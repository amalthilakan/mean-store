const express = require('express');
const { sarvamEngToMalTranslation } = require('./sarvamService');


const router = express.Router()

router.post("/", async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided for translation." });
    }

    const translatedText = await sarvamEngToMalTranslation(text);

    return res.status(200).json({ translatedText });

  } catch (error) {
   next(error)
  }
});

module.exports =  router