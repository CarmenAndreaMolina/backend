const Factura = require('../models/Factura');

exports.crearFactura = async (req, res) => {
  try {
    const { cliente, productos } = req.body;
    const nuevaFactura = new Factura({ cliente, productos });
    await nuevaFactura.save();
    res.status(201).json({ mensaje: 'Factura creada correctamente', factura: nuevaFactura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error creando la factura' });
  }
};
