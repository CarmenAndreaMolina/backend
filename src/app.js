const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express();

const mensajeRoutes = require('./routes/mensaje.routes');
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/usuarios', require('./routes/usuario'));
app.use('/api/productos', require('./routes/producto'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/factura', require('./routes/factura'));
app.use('/api/carrito', require('./routes/carrito'));


app.use('/api/ventas', require('./routes/venta'));
app.use('/api/ordenes', require('./routes/orden'));
app.use('/api/ofertas', require('./routes/oferta'));
app.use('/api/mensajes', mensajeRoutes);
// Servir imágenes estáticas desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a mi API REST Full');
});

app.set('port', process.env.PORT || 4000);

module.exports = app;

