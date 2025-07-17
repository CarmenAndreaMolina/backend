const Oferta = require('../models/Oferta');

const ofertaCtrl = {};

// Obtener todas las ofertas
ofertaCtrl.getOfertas = async (req, res) => {
  try {
    const ofertas = await Oferta.find();
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ofertas' });
  }
};

// Obtener una oferta por ID
ofertaCtrl.getOferta = async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id);
    if (!oferta) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.json(oferta);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la oferta' });
  }
};

// Crear una nueva oferta
ofertaCtrl.createOferta = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      imagen,
      tipo_oferta,
      valor,
      fecha_inicio,
      fecha_fin,
      activa = true,
      codigo_promocional = null,
      aplica_a_categoria_id = null,
      aplica_a_producto_id = null,
      uso_maximo = null
    } = req.body;

    const newOferta = new Oferta({
      nombre,
      descripcion,
      imagen,
      tipo_oferta,
      valor,
      fecha_inicio,
      fecha_fin,
      activa,
      codigo_promocional,
      aplica_a_categoria_id,
      aplica_a_producto_id,
      uso_maximo
    });

    await newOferta.save();
    res.json({ message: "La oferta ha sido creada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la oferta', error: error.message });
  }
};

// Actualizar una oferta
ofertaCtrl.updateOferta = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      imagen,
      tipo_oferta,
      valor,
      fecha_inicio,
      fecha_fin,
      activa,
      codigo_promocional,
      aplica_a_categoria_id,
      aplica_a_producto_id,
      uso_maximo
    } = req.body;

    const updateFields = {
      nombre,
      descripcion,
      imagen,
      tipo_oferta,
      valor,
      fecha_inicio,
      fecha_fin,
      activa,
      codigo_promocional,
      aplica_a_categoria_id,
      aplica_a_producto_id,
      uso_maximo
    };

    await Oferta.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.json({ message: "La oferta ha sido actualizada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la oferta", error: error.message });
  }
};

// Eliminar una oferta
ofertaCtrl.deleteOferta = async (req, res) => {
  try {
    await Oferta.findByIdAndDelete(req.params.id);
    res.json({ message: "La oferta ha sido eliminada" });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la oferta' });
  }
};

module.exports = ofertaCtrl;
