const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'cliente'], default: 'cliente' }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);