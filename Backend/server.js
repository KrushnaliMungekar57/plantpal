// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose.connect("mongodb://127.0.0.1:27017/plantdb")

// .then(() => console.log("✅ MongoDB Connected"))
// .catch((err) => console.error("❌ MongoDB Error:", err));

// // Schema & Model
// const plantSchema = new mongoose.Schema({
//   name: String,
//   care: String,
//   type: String,
//   description: String,
//   imageUrl: String,
// });
// const Plant = mongoose.model("Plant", plantSchema);

// // Routes
// app.post("/plants", async (req, res) => {
//   const plant = new Plant(req.body);
//   await plant.save();
//   res.json(plant);
// });

// app.get("/plants", async (req, res) => {
//   const plants = await Plant.find();
//   res.json(plants);
// });

// // Start server
// app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios"; // 👈 Import axios for ML service communication

// --- Configuration ---
// Old: const ML_SERVICE_URL = 'http://localhost:5000'; 
// New:
const ML_SERVICE_URL = 'http://localhost:5001'; // 👈 Must match the Python Mock Service port // 👈 URL of your Python Flask ML service
const MONGODB_URI = "mongodb://127.0.0.1:27017/plantdb";

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(MONGODB_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));


// --- Mongoose Schemas & Models ---

// 1. Plant Info Model (Your existing model)
const plantSchema = new mongoose.Schema({
  name: String,
  care: String,
  type: String,
  description: String,
  imageUrl: String,
});
const Plant = mongoose.model("Plant", plantSchema);

// 2. Sensor Reading Model (New: For data coming from ESP32)
const readingSchema = new mongoose.Schema({
  deviceId: { type: String, required: true }, // Identifier for the ESP32 device/plant
  moisture: { type: Number, required: true },
  waterUsed: { type: Number, default: 0 },
  temp: { type: Number, default: null }, // Optional temp reading
  timestamp: { type: Date, default: Date.now },
  // ML Prediction Fields
  mlSuggestion: { type: String, default: 'OK' }, 
  predictedMoisture: { type: Number, default: null },
});
const Reading = mongoose.model("Reading", readingSchema);


// --- ML Integration Function ---

/**
 * Sends current sensor data to the Python ML service and gets a prediction.
 * @param {object} readingData - The current sensor reading.
 */
async function getMLPrediction(readingData) {
  try {
    const predictionInput = {
      moisture: readingData.moisture,
      water_used: readingData.waterUsed,
      temp: readingData.temp,
    };

    console.log(`Sending reading for ML prediction: ${readingData.moisture}%`);
    
    // POST request to the Python Flask /predict endpoint
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, predictionInput);

    // Return the key ML data
    return {
      mlSuggestion: response.data.suggestion,
      predictedMoisture: response.data.predicted_moisture_tomorrow,
    };

  } catch (error) {
    console.error('❌ ML Service Error:', error.message);
    // Return a default/safe suggestion if the ML service is unavailable
    return { 
        mlSuggestion: readingData.moisture < 30 ? "Needs Water (ML Offline)" : "OK (ML Offline)",
        predictedMoisture: null
    };
  }
}

// --- Routes ---

// 1. Route to receive data from ESP32 (The core data stream)
app.post("/sensor/data", async (req, res) => {
  try {
    const { deviceId, moisture, waterUsed, temp } = req.body;
    
    if (!deviceId || moisture === undefined) {
      return res.status(400).json({ message: "Missing deviceId or moisture data." });
    }

    // 1. Prepare and save the raw reading
    const newReading = new Reading({ deviceId, moisture, waterUsed: waterUsed || 0, temp: temp || null });
    
    // 2. Get ML prediction
    const mlResult = await getMLPrediction(newReading);

    // 3. Update the Reading object with ML results and save
    newReading.mlSuggestion = mlResult.mlSuggestion;
    newReading.predictedMoisture = mlResult.predictedMoisture;
    await newReading.save();

    console.log(`✅ Data saved. ML Suggestion: ${mlResult.mlSuggestion}`);

    // Send the full result back to the ESP32 (optional) or just an OK
    res.json({ message: "Data processed successfully", suggestion: mlResult.mlSuggestion });

  } catch (error) {
    console.error("Error processing sensor data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// 2. Route to get the latest reading for a specific device (for the Dashboard)
app.get("/sensor/latest/:deviceId", async (req, res) => {
    const { deviceId } = req.params;
    try {
        const latestReading = await Reading.findOne({ deviceId })
            .sort({ timestamp: -1 }) // Get the most recent
            .limit(1);

        if (!latestReading) {
            return res.status(404).json({ message: "No data found for this device." });
        }
        res.json(latestReading);
    } catch (error) {
        console.error("Error fetching latest data:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// 3. Existing Routes for Plant Management (Basic Service)

app.post("/plants", async (req, res) => {
  const plant = new Plant(req.body);
  await plant.save();
  res.json(plant);
});

app.get("/plants", async (req, res) => {
  const plants = await Plant.find();
  res.json(plants);
});


// --- Start Server ---
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));