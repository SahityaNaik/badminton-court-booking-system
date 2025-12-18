const express = require("express");
const prisma = require("../prisma");
const {
  requireAuth,
  requireAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * GET /api/courts
 * Public – list all active courts
 */
router.get("/", async (req, res) => {
  try {
    const courts = await prisma.court.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    res.json(courts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courts" });
  }
});

/**
 * GET /api/courts/admin/all
 * Admin – list all courts (active + disabled)
 */
router.get("/admin/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const courts = await prisma.court.findMany({
      orderBy: { name: "asc" },
    });

    res.json(courts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courts" });
  }
});


/**
 * POST /api/courts
 * Admin only – add a new court
 */
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { name, type, basePrice } = req.body;

  try {
    const court = await prisma.court.create({
      data: {
        name,
        type,
        basePrice,
      },
    });

    res.status(201).json(court);
  } catch (err) {
    res.status(500).json({ message: "Failed to create court" });
  }
});

/**
 * PATCH /api/courts/:id/toggle
 * Admin – enable/disable court
 */
router.patch("/:id/toggle", requireAuth, requireAdmin, async (req, res) => {
  try {
    const court = await prisma.court.findUnique({
      where: { id: req.params.id },
    });

    if (!court) {
      return res.status(404).json({ message: "Court not found" });
    }

    const updated = await prisma.court.update({
      where: { id: req.params.id },
      data: { isActive: !court.isActive },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update court" });
  }
});

module.exports = router;
