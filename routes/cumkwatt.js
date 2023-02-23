const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/cumkwatt/api", async (req, res) => {
  try {
    const { i, o } = req.query;
    let url = "https://api.cumkwatt.com/v1/inclorient/";
    url += "?key=" + process.env.API_KEY_CUMKWATT;
    url += "&i=" + i;
    url += "&o=" + o;
    const response = await axios.get(url);
    res.json(response.data);
    // console.log(response.data);
    return;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
