const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'secreto';

module.exports = function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).json({ message: 'Token requerido' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    req.usuario = decoded;  // asigna decoded a req.usuario
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
