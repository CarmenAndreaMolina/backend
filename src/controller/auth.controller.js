const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const authCtrl = {};
const client = new OAuth2Client('585801483608-93qtbjjporggds2cbcoj5pjnjd5m6pet.apps.googleusercontent.com');

// Registro tradicional
authCtrl.registro = async (req, res) => {
  const { nombre, apellido, edad, telefono, correo, contraseña, rol, imagen } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) return res.status(400).json({ mensaje: 'El correo ya está registrado' });

    const salt = await bcrypt.genSalt(10);
    const hashContraseña = await bcrypt.hash(contraseña, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      edad,
      telefono,
      correo,
      imagen,
      contraseña: hashContraseña,
      rol: rol || 'cliente'
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Login tradicional
authCtrl.login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(400).json({ mensaje: 'Correo no encontrado' });

    const valido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!valido) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        correo: usuario.correo,
        imagen: usuario.imagen
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Login con Google
authCtrl.loginConGoogle = async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: '585801483608-93qtbjjporggds2cbcoj5pjnjd5m6pet.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload; // ← obtenemos también la imagen

    let usuario = await Usuario.findOne({ correo: email });

    if (!usuario) {
      // Crear nuevo usuario si no existe
      usuario = new Usuario({
        nombre: name,
        correo: email,
        imagen: picture, // ← guardamos imagen
        contraseña: ':)', // requerido por el modelo
        google: true
      });
      await usuario.save();
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        correo: usuario.correo,
        imagen: usuario.imagen // ← devolvemos imagen
      }
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ mensaje: 'Token de Google inválido o expirado' });
  }
};

module.exports = authCtrl;

