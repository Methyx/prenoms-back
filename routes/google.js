const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/google/autocomplete", async (req, res) => {
  try {
    const { input } = req.query;
    let url = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
    url += "?key=" + process.env.API_KEY_GOOGLE;
    url += "&input=" + input;
    url += "&region=fr";
    const response = await axios.get(url);
    res.json(response.data);
    // console.log(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/google/details", async (req, res) => {
  try {
    const { placeId } = req.query;
    let url = "https://maps.googleapis.com/maps/api/place/details/json";
    url += "?key=" + process.env.API_KEY_GOOGLE;
    url += "&place_id=" + placeId;
    const response = await axios.get(url);
    res.json(response.data);
    // console.log(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
