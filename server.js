import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serves index.html, shake.js, sos.js

const sosFile = path.join(__dirname, "sos_log.json");

// ✅ Helper function to save SOS logs
function saveData(filename, data) {
  const existing = fs.existsSync(filename)
    ? JSON.parse(fs.readFileSync(filename, "utf8"))
    : [];
  existing.push(data);
  fs.writeFileSync(filename, JSON.stringify(existing, null, 2));
}

// ✅ Endpoint to receive SOS alerts
app.post("/sos", (req, res) => {
  const { user, time, intensity, location } = req.body;

  const sosDetails = {
    user: user || "Anonymous",
    time: time || new Date().toISOString(),
    intensity: intensity || "N/A",
    location: location || "Unknown",
  };

  saveData(sosFile, sosDetails);
  console.log("🚨 SOS Logged:", sosDetails);

  res.json({ status: "SOS data logged successfully" });
});

// ✅ Endpoint to download all SOS logs
app.get("/download-sos", (req, res) => {
  if (!fs.existsSync(sosFile)) {
    return res.status(404).json({ error: "No SOS logs found" });
  }
  res.download(sosFile, "sos_log.json");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
