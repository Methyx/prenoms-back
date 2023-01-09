const express = require("express");
const router = express.Router();

const Prenom = require("../models/Prenom");

const listOfDepartements = require("../assets/listOfDepartements");

// -----------------------------------------
// Get the list of firstname sort by number
// -----------------------------------------
//
// Query        Exemple                  Require
//
// years        2010
//              or 2010-2015                No
//
// gender       M or F                      No
//
// dptCode      75                          No  (total France if missing)
//
//
// start        1 (top n°1)                 No
//
//
// number       5 (5 names following)       No
//
router.get("/top", async (req, res) => {
  try {
    const { years, gender, dptCode, start, number } = req.query;
    const searchFilters = {
      preusuel: { $ne: "_PRENOMS_RARES" },
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

    if (dptCode && Number(dptCode)) {
      searchFilters.dpt = Number(dptCode);
    }

    const request = [
      { $match: searchFilters },
      {
        $group: {
          _id: "$preusuel",
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

    if (start && Number(start) > 0) {
      request.push({ $skip: Number(start) - 1 });
    }
    if (number && Number(number) > 0) {
      request.push({ $limit: Number(number) });
    }

    // // National treatment
    // const nationalNumber = await Prenom.aggregate([
    //   { $match: searchFilters },
    //   {
    //     $group: { _id: "total", total: { $sum: "$nombre" } },
    //   },
    // ]);
    // console.log(nationalNumber);
    const results = await Prenom.aggregate(request);

    res.json(results);
    // res.json(results.slice(startIndex, endIndex));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
