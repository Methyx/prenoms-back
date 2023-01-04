const mongoose = require("mongoose");

const Prenom = mongoose.model("Prenom", {
  sexe: Number,
  preusuel: String,
  annais: Number,
  dpt: Number,
  nombre: Number,
});

module.exports = Prenom;
