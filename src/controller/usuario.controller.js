const usuarioCtrl = {};
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Crear usuario
usuarioCtrl.createUsu = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, edad, contraseña, rol, imagen = null } = req.body;

    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Correo ya registrado' });
    }

    const contraseñaHash = await bcrypt.hash(contraseña, 10);

    const newUsu = new Usuario({
      nombre,
      apellido,
      correo,
      telefono,
      edad,
      contraseña: contraseñaHash,
      rol: rol || 'cliente',
      imagen
    });

    await newUsu.save();
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

// Obtener todos los usuarios
usuarioCtrl.getUsu = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};


// Obtener usuario por ID
usuarioCtrl.getUsuario = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: 'ID de usuario inválido o no proporcionado' });
  }

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuario' });
  }
};

// Eliminar usuario
usuarioCtrl.deleteUsu = async (req, res) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: 'ID de usuario inválido o no proporcionado' });
  }

  try {
    const eliminado = await Usuario.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado para eliminar' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
};

// Actualizar usuario
usuarioCtrl.updateUsu = async (req, res) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: 'ID de usuario inválido o no proporcionado' });
  }

  try {
    const { nombre, apellido, correo, telefono, edad, contraseña, imagen } = req.body;
    const contraseñaHash = contraseña ? await bcrypt.hash(contraseña, 10) : undefined;

    const updateData = {
      nombre,
      apellido,
      correo,
      telefono,
      edad,
      imagen
    };
    if (contraseñaHash) updateData.contraseña = contraseñaHash;

    const actualizado = await Usuario.findByIdAndUpdate(id, updateData, { new: true });
    if (!actualizado) return res.status(404).json({ mensaje: 'Usuario no encontrado para actualizar' });

    res.json({ message: 'Usuario actualizado', usuario: actualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

// Login usuario
usuarioCtrl.loginUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(400).json({ mensaje: 'Usuario no encontrado' });

    const esCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esCorrecta) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario._id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '2h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        imagen: usuario.imagen || null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = usuarioCtrl;

