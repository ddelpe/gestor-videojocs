const Videojoc = require('../models/Videojoc');

exports.getAll = async (req, res) => {
  const videojocs = await Videojoc.find();
  res.json(videojocs);
};

exports.getById = async (req, res) => {
  const videojoc = await Videojoc.findById(req.params.id);
  res.json(videojoc);
};

exports.create = async (req, res) => {
  const nouVideojoc = new Videojoc(req.body);
  await nouVideojoc.save();
  res.json(nouVideojoc);
};

exports.update = async (req, res) => {
  const videojocActualitzat = await Videojoc.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(videojocActualitzat);
};

exports.delete = async (req, res) => {
  await Videojoc.findByIdAndDelete(req.params.id);
  res.json({ message: 'Videojoc eliminat' });
};