import express from "express";
import db from "./db.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const {
      farmerId, farmerName, contactNumber, surveyNumber, landArea,
      soilType, irrigationSource, cropSeason, seedQuantity,
      produceQuantity, cropType, fertilizerUsed, sowingDate, harvestDate
    } = req.body;

    const query = `
      INSERT INTO farm_data (
        farmerId, farmerName, contactNumber, surveyNumber, landArea, soilType,
        irrigationSource, cropSeason, seedQuantity, produceQuantity,
        cropType, fertilizerUsed, sowingDate, harvestDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      farmerId, farmerName, contactNumber, surveyNumber, landArea,
      soilType, irrigationSource, cropSeason, seedQuantity,
      produceQuantity, cropType, fertilizerUsed, sowingDate, harvestDate
    ]);

    res.json({ success: true, message: "Form data saved successfully!" });
  } catch (error) {
    console.error("❌ DB Error:", error);

    let errorMessage = "Server error. Please try again later.";
    if (error.code === "ER_DUP_ENTRY") {
      errorMessage = "Duplicate entry: Farmer ID already exists.";
    }

    res.status(500).json({ success: false, message: errorMessage });
  }
});

export default router;
