const express = require("express");
const prisma = require("../prisma");
const {
  requireAuth,
  requireAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * GET /api/equipment
 * Public – list all equipment
 */
router.get("/", async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany({
      orderBy: { name: "asc" },
    });

    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch equipment" });
  }
});

/**
 * PATCH /api/equipment/:id
 * Admin only – update quantity and/or price
 */
router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { totalQuantity, pricePerHour } = req.body;

  try {
    const updated = await prisma.equipment.update({
      where: { id },
      data: {
        ...(totalQuantity !== undefined && { totalQuantity }),
        ...(pricePerHour !== undefined && { pricePerHour }),
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update equipment" });
  }
});

module.exports = router;
