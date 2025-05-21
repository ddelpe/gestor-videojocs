const mongoose = require('mongoose');

const VideojocSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  imagenUrl: { type: String, required: true },
  descripcion: { type: String, required: true },
  sitioUrl: { type: String, required: true }
});

module.exports = mongoose.model('Videojoc', VideojocSchema);