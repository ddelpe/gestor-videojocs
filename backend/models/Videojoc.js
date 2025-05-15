const mongoose = require('mongoose');
const VideojocSchema = new mongoose.Schema({
  titol: { type: String, required: true },
  genere: { type: String, required: true },
  plataforma: { type: String, required: true },
  any: { type: Number, required: true },
  descripcio: { type: String }
});
module.exports = mongoose.model('Videojoc', VideojocSchema);