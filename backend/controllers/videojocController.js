const Videojoc = require('../models/Videojoc');

exports.getAll = async (req, res) => {
  try {
    const videojocs = await Videojoc.find();
    res.json(videojocs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener videojuegos' });
  }
};

exports.create = async (req, res) => {
  try {
    const nouVideojoc = new Videojoc(req.body);
    await nouVideojoc.save();
    res.json(nouVideojoc);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear videojuego', details: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const videojocActualitzat = await Videojoc.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!videojocActualitzat) return res.status(404).json({ error: 'Videojuego no encontrado' });
    res.json(videojocActualitzat);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar videojuego', details: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const videojoc = await Videojoc.findByIdAndDelete(req.params.id);
    if (!videojoc) return res.status(404).json({ error: 'Videojuego no encontrado' });
    res.json({ message: 'Videojuego eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar videojuego' });
  }
};