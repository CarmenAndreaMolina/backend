const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');

const carritoCtrl = {};

carritoCtrl.obtenerCarrito = async (req, res) => {
  const userId = req.usuario.id;
  const carrito = await Carrito.findOne({ usuario: userId }).populate('items.producto');
  res.json(carrito || { usuario: userId, items: [] });
};

carritoCtrl.agregarAlCarrito = async (req, res) => {
  const userId = req.usuario.id;
  const { productoId, cantidad } = req.body;

  let carrito = await Carrito.findOne({ usuario: userId });

  if (!carrito) {
    carrito = new Carrito({ usuario: userId, items: [] });
  }

  const index = carrito.items.findIndex(i => i.producto.toString() === productoId);

  if (index > -1) {
    carrito.items[index].cantidad += cantidad;
  } else {
    carrito.items.push({ producto: productoId, cantidad });
  }

  await carrito.save();
  res.json({ message: 'Producto agregado al carrito', carrito });
};

carritoCtrl.eliminarDelCarrito = async (req, res) => {
  const userId = req.usuario.id;
  const { productoId } = req.params;

  const carrito = await Carrito.findOne({ usuario: userId });
  if (!carrito) return res.status(404).json({ message: 'Carrito no encontrado' });

  carrito.items = carrito.items.filter(i => i.producto.toString() !== productoId);
  await carrito.save();

  res.json({ message: 'Producto eliminado del carrito', carrito });
};

carritoCtrl.vaciarCarrito = async (req, res) => {
  const userId = req.usuario.id;
  await Carrito.findOneAndUpdate({ usuario: userId }, { items: [] });
  res.json({ message: 'Carrito vaciado' });
};

module.exports = carritoCtrl;
