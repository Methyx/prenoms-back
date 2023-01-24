const express = require("express");
const router = express.Router();

const Prenom = require("../models/Prenom");

const listOfDepartements = require("../assets/listOfDepartements");

// -----------------------------------------
// Get the number of name by departement
// -----------------------------------------
//
// Query        Exemple                  Require
//
// name         louis                       yes
//
// years        2010
//              or 2010-2015                No
//
// gender       M or F                      No
//
//
router.get("/name", async (req, res) => {
  try {
    const { name, years, gender } = req.query;

    if (!name) {
      return res.status(401).jsonp({ message: "name is missing" });
    }
    const searchFilters = {
      preusuel: name.toUpperCase(),
    };

    if (years) {
      const date = years.split("-");
      if (date.length === 1) {
        if (Number(date[0])) {
          searchFilters.annais = Number(date[0]);
        } else {
          return res.status(401).json({ message: "bad year" });
        }
      } else {
        if (Number(date[0]) && Number(date[1])) {
          searchFilters.annais = {
            $gte: Number(date[0]),
            $lte: Number(date[1]),
          };
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

    const request = [
      { $match: searchFilters },
      {
        $group: {
          _id: "$dpt",
          total: {
            $sum: "$nombre",
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ];

    const results = await Prenom.aggregate(request);
    res.json(results);
    //
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
