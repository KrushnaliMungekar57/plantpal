import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/plantdb")

.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

// Schema & Model
const plantSchema = new mongoose.Schema({
  name: String,
  care: String,
  type: String,
  description: String,
  imageUrl: String,
});
const Plant = mongoose.model("Plant", plantSchema);

// Routes
app.post("/plants", async (req, res) => {
  const plant = new Plant(req.body);
  await plant.save();
  res.json(plant);
});

app.get("/plants", async (req, res) => {
  const plants = await Plant.find();
  res.json(plants);
});

// Start server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
