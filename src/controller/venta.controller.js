const Venta = require('../models/Venta');

const ventaCtrl = {};

// Crear una venta
ventaCtrl.crearVenta = async (req, res) => {
  try {
    const { cliente, productos, total, registradoPor } = req.body;

    if (!cliente || !productos || productos.length === 0 || !total) {
      return res.status(400).json({ message: 'Datos incompletos para crear la venta' });
    }

    const nuevaVenta = new Venta({
      cliente,
      productos,
      total,
      registradoPor
    });

    await nuevaVenta.save();
    res.status(201).json({ message: 'Venta creada correctamente', venta: nuevaVenta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la venta' });
  }
};

// Obtener todas las ventas
ventaCtrl.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().populate('registradoPor', 'nombre correo');
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
};

// Obtener una venta por ID
ventaCtrl.obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id).populate('registradoPor', 'nombre correo');
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la venta' });
  }
};

// Actualizar una venta por ID
ventaCtrl.actualizarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;
    const ventaActualizada = await Venta.findByIdAndUpdate(id, datosActualizados, { new: true });
    if (!ventaActualizada) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json({ message: 'Venta actualizada', venta: ventaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la venta' });
  }
};

// Eliminar una venta por ID
ventaCtrl.eliminarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const ventaEliminada = await Venta.findByIdAndDelete(id);
    if (!ventaEliminada) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json({ message: 'Venta eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la venta' });
  }
};

module.exports = ventaCtrl;

