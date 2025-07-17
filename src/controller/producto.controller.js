const Producto = require('../models/Producto');

const productoCtrl = {};

// Obtener todos los productos
productoCtrl.getProdu = async (req, res) => {
  try {
    const { categoria, nombre } = req.query;

    const filtro = {};

    if (categoria && categoria !== 'Todas') {
      filtro.categoria = categoria;
    }

    if (nombre) {
      filtro.nombreProdu = { $regex: nombre, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
    }

    const productos = await Producto.find(filtro);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};



// Crear un nuevo producto (solo recibe URL imagen desde req.body)
productoCtrl.createProdu = async (req, res) => {
  try {
    const {
      nombreProdu,
      descripcionProdu,
      marca,
      modelo,
      precioUnitario,
      stock = 0,
      imagen = null,
      categoria,
    } = req.body;

    const newProdu = new Producto({
      nombreProdu,
      descripcionProdu,
      marca,
      modelo,
      precioUnitario,
      stock,
      imagen,
      categoria
    });

    await newProdu.save();
    res.json({ message: "El producto ha sido agregado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

// Obtener un producto por ID
productoCtrl.getProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

// Eliminar un producto
productoCtrl.deleteProdu = async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ message: "El producto ha sido eliminado" });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};

// Actualizar un producto (solo actualiza campos, incluyendo imagen URL)
productoCtrl.updateProdu = async (req, res) => {
  try {
    const {
      nombreProdu,
      descripcionProdu,
      marca,
      modelo,
      precioUnitario,
      stock = 0,
      categoria,
      imagen = null
    } = req.body;

    const updateFields = {
      nombreProdu,
      descripcionProdu,
      marca,
      modelo,
      precioUnitario,
      stock,
      categoria,
      imagen
    };

    await Producto.findByIdAndUpdate(req.params.id, updateFields);
    res.json({ message: "El producto ha sido actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar producto", error: error.message });
  }
};

// Actualizar solo el stock
productoCtrl.actualizarStock = async (req, res) => {
  try {
    const { cantidadVendida } = req.body;

    if (!cantidadVendida || cantidadVendida <= 0) {
      return res.status(400).json({ message: "Cantidad inválida." });
    }

    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    if (producto.stock < cantidadVendida) {
      return res.status(400).json({ message: "Stock insuficiente." });
    }

    producto.stock -= cantidadVendida;
    await producto.save();

    res.json({ message: "Stock actualizado.", stockActual: producto.stock });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar stock." });
  }
};

module.exports = productoCtrl;
