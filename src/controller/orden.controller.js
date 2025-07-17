const path = require('path');
const Orden = require('../models/Orden');
const Producto = require('../models/Producto');
const Venta = require('../models/Venta');
const Factura = require('../models/Factura');
const generarFacturaPDF = require('../utils/generarFacturaPDF');

const nodemailer = require('nodemailer');

const ordenCtrl = {};

// Función para enviar correo con PDF adjunto
async function enviarCorreoConAdjunto(to, subject, text, archivoPath) {
  // Configurar el transporte usando variables de entorno
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: path.basename(archivoPath),
        path: archivoPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

// Crear una nueva orden
ordenCtrl.crearOrden = async (req, res) => {
  try {
    const nuevaOrden = new Orden(req.body);
    await nuevaOrden.save();
    res.status(201).json({ message: 'Orden creada correctamente', orden: nuevaOrden });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la orden', error: error.message });
  }
};

// Obtener todas las órdenes
ordenCtrl.obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find().populate('items.producto');
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener órdenes' });
  }
};

// Obtener una orden por ID
ordenCtrl.obtenerOrdenPorId = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id).populate('items.producto');
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la orden' });
  }
};

// Actualizar una orden
ordenCtrl.actualizarOrden = async (req, res) => {
  try {
    const orden = await Orden.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json({ message: 'Orden actualizada', orden });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la orden', error: error.message });
  }
};

// Eliminar una orden
ordenCtrl.eliminarOrden = async (req, res) => {
  try {
    const orden = await Orden.findByIdAndDelete(req.params.id);
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json({ message: 'Orden eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la orden', error: error.message });
  }
};

// Aprobar una orden (crear venta, actualizar stock, generar factura + PDF y enviar email)
ordenCtrl.aprobarOrden = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id).populate('items.producto');
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });

    if (orden.estado !== 'pendiente') {
      return res.status(400).json({ message: 'La orden ya ha sido procesada' });
    }

    let totalVenta = 0;
    const detalleVenta = [];

    for (const item of orden.items) {
      const producto = await Producto.findById(item.producto._id);

      if (producto.stock < item.cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para ${producto.nombreProdu}` });
      }

      producto.stock -= item.cantidad;
      await producto.save();

      const subtotal = producto.precioUnitario * item.cantidad;
      totalVenta += subtotal;

      detalleVenta.push({
        productoId: producto._id,
        nombre: producto.nombreProdu,
        precioUnitario: producto.precioUnitario,
        cantidad: item.cantidad,
        subtotal
      });
    }

    const nuevaVenta = new Venta({
      cliente: {
        nombre: orden.comprador.nombre,
        correo: orden.comprador.correo
      },
      productos: detalleVenta,
      total: totalVenta
    });
    await nuevaVenta.save();

    const nuevaFactura = new Factura({
      cliente: orden.comprador.nombre,
      productos: orden.items.map(item => ({
        productoId: item.producto._id,
        cantidad: item.cantidad
      }))
    });
    await nuevaFactura.save();

    // Agrega el total en la orden para usar en el PDF
    orden.total = totalVenta;

    // Generar PDF y guardar ruta relativa en la orden
    await generarFacturaPDF(orden);
    orden.comprobanteUrl = `/uploads/facturas/factura-${orden._id}.pdf`;

    // Cambiar estado y guardar orden
    orden.estado = 'aprobada';
    await orden.save();

    // Enviar correo con el PDF adjunto
    const rutaPDFFisica = path.join(__dirname, '../../uploads/facturas', `factura-${orden._id}.pdf`);
    await enviarCorreoConAdjunto(
      orden.comprador.correo,
      'Factura de su compra',
      `Hola ${orden.comprador.nombre}, adjuntamos la factura de su compra.`,
      rutaPDFFisica
    );

    res.json({
      message: 'Orden aprobada, venta registrada, factura generada, PDF creado y correo enviado',
      venta: nuevaVenta,
      factura: nuevaFactura,
      pdfUrl: orden.comprobanteUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al aprobar orden', error: err.message });
  }
};

// Rechazar una orden (cambiar estado a "rechazada")
ordenCtrl.rechazarOrden = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id);
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });

    if (orden.estado !== 'pendiente') {
      return res.status(400).json({ message: 'La orden ya ha sido procesada y no se puede rechazar' });
    }

    // Cambiar estado
    orden.estado = 'rechazada';
    await orden.save();

    // Configura el correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: orden.comprador.correo,
      subject: 'Orden rechazada - Comprobante no válido',
      text: `Hola ${orden.comprador.nombre},

Lamentamos informarte que tu orden ha sido rechazada porque el comprobante de pago que enviaste no corresponde a un documento válido.

Por este motivo, la venta no será procesada.

Si fue un error, por favor realiza una nueva orden y asegúrate de subir un comprobante correcto.

Gracias por tu comprensión.
`,
    };

    // Envía el correo
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Orden rechazada y correo enviado al comprador', orden });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al rechazar la orden', error: err.message });
  }
};


module.exports = ordenCtrl;




