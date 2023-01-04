const express = require("express");
const router = express.Router();

const Prenom = require("../models/Prenom");

router.get("/top", async (req, res) => {
  try {
    const { years, gender, dptCode } = req.query;
    const searchFilters = {};
    if (years) {
      const date = years.split("-");
      if (date.length === 1) {
        if (Number(date[0])) {
          searchFilters.annais = date[0];
        } else {
          return res.status(401).json({ message: "bad year" });
        }
      } else {
        if (Number(date[0]) && Number(date[1])) {
          searchFilters.annais = { $gte: date[0], $lte: date[1] };
        } else {
          return res.status(401).json({ message: "bad years" });
        }
      }
    }

    if (gender === "M") {
      searchFilters.sexe = 1;
    } else if (gender === "F") {
      searchFilters.sexe = 2;
    }
    if (dptCode && Number(dptCode)) {
      searchFilters.dpt = dptCode;
    }
    const results = await Prenom.find(searchFilters).sort("preusuel");
    const response = [];
    let name = "";
    for (let i = 0; i < results.length; i++) {
      if (results[i].preusuel !== "_PRENOMS_RARES") {
        if (results[i].preusuel !== name) {
          name = results[i].preusuel;
          response.push({
            name: name,
            count: Number(results[i].nombre),
          });
        } else {
          response[response.length - 1].count += Number(results[i].nombre);
        }
      }
    }
    res.json(
      response.sort((a, b) => {
        if (a.count < b.count) {
          return 1;
        }
        if (a.count > b.count) {
          return -1;
        }
        return 0;
      })
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
