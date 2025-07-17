// controller/mensaje.controller.js
const Mensaje = require('../models/Mensaje');

const mensajeCtrl = {};

// Enviar mensaje
mensajeCtrl.enviarMensaje = async (req, res) => {
  try {
    const { receptorId, contenido } = req.body;
    const nuevoMensaje = new Mensaje({
      emisor: req.usuario.id,
      receptor: receptorId,
      contenido
    });

    await nuevoMensaje.save();
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al enviar mensaje' });
  }
};

// Obtener conversación entre dos usuarios
mensajeCtrl.obtenerConversacion = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const mensajes = await Mensaje.find({
      $or: [
        { emisor: req.usuario.id, receptor: usuarioId },
        { emisor: usuarioId, receptor: req.usuario.id }
      ]
    }).sort('createdAt');

    res.json(mensajes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener conversación' });
  }
};

module.exports = mensajeCtrl;
