const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes") 
const courtRoutes = require("./routes/courts.routes")
const equipmentRoutes = require("./routes/equipment.routes")
const coachRoutes = require("./routes/coaches.routes")
const bookingRoutes = require("./routes/bookings.routes")

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/courts", courtRoutes)
app.use("/api/equipment", equipmentRoutes)
app.use("/api/coaches", coachRoutes)
app.use('/api/bookings', bookingRoutes)

app.get("/", (req, res) => {
  res.send("Badminton Booking API running");
});

module.exports = app;
