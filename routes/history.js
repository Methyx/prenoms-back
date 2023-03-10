const express = require("express");
const router = express.Router();

const Prenom = require("../models/Prenom");

// -------------------------------------------------
// Get the number of a firstname per year since 1900
// -------------------------------------------------
//
// Query        Exemple                  Require
//
// name         marcel                      YES
//
// gender       M or F                      No
//
// dptCode      75                          No  (total France if missing)
//
//

router.get("/history", async (req, res) => {
  try {
    const { name, gender, dptCode } = req.query;
    if (!name) {
      return res.status(401).json({ message: "name is missing" });
    }

    const searchFilters = {
      preusuel: name.toUpperCase(),
    };

    if (gender === "M") {
      searchFilters.sexe = 1;
    } else if (gender === "F") {
      searchFilters.sexe = 2;
    }

    if (dptCode && Number(dptCode)) {
      searchFilters.dpt = Number(dptCode);
    }

    const request = [
      { $match: searchFilters },
      {
        $group: {
          _id: "$annais",
          total: {
            $sum: "$nombre",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];

    const results = await Prenom.aggregate(request);
    if (results.length && !results[0]._id) {
      const garbage = results.shift();
    }
    if (results.length) {
      // add every years if necessary
      let index = 0;
      for (let i = 1900; i < 2022; i++) {
        if (index >= results.length) {
          results.push({ _id: i, total: 0 });
          index++;
        } else {
          if (results[index]._id === i) {
            index++;
          } else {
            results.splice(index, 0, { _id: i, total: 0 });
            index++;
          }
        }
      }
    }
    res.json(results);
    //
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
