const multer = require('multer');
const path = require('path');

// Carpeta donde se guardan las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp + extensión
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes JPEG, PNG o JPG'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
