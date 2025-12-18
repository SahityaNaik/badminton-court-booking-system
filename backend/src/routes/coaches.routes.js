const express = require("express");
const prisma = require("../prisma");
const {
  requireAuth,
  requireAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * GET /api/coaches
 * Public – list all active coaches
 */
router.get("/", async (req, res) => {
  try {
    const coaches = await prisma.coach.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    res.json(coaches);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch coaches" });
  }
});

/**
 * POST /api/coaches
 * Admin – add a coach
 */
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { name, pricePerHour } = req.body;

  try {
    const coach = await prisma.coach.create({
      data: { name, pricePerHour },
    });

    res.status(201).json(coach);
  } catch (err) {
    res.status(500).json({ message: "Failed to create coach" });
  }
});

/**
 * PATCH /api/coaches/:id
 * Admin – update coach (price / active)
 */
router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { pricePerHour, isActive } = req.body;

  try {
    const updated = await prisma.coach.update({
      where: { id },
      data: {
        ...(pricePerHour !== undefined && { pricePerHour }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update coach" });
  }
});

/**
 * PATCH /api/coaches/:id/toggle
 * Admin – enable/disable coach
 */
router.patch("/:id/toggle", requireAuth, requireAdmin, async (req, res) => {
  try {
    const coach = await prisma.coach.findUnique({
      where: { id: req.params.id },
    });

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    const updated = await prisma.coach.update({
      where: { id: req.params.id },
      data: { isActive: !coach.isActive },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update coach" });
  }
});


/**
 * POST /api/coaches/:id/availability
 * Admin – add coach availability
 */
router.post("/:id/availability", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { date, startTime, endTime } = req.body;

  try {
    const availability = await prisma.coachAvailability.create({
      data: {
        coachId: id,
        date: new Date(date),
        startTime,
        endTime,
      },
    });

    res.status(201).json(availability);
  } catch (err) {
    res.status(500).json({ message: "Failed to add availability" });
  }
});

/**
 * GET /api/coaches/admin/all
 * Admin – list all coaches (active + disabled)
 */
router.get("/admin/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const coaches = await prisma.coach.findMany({
      orderBy: { name: "asc" },
    });

    res.json(coaches);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch coaches" });
  }
});

/**
 * GET /api/coaches/:id/availability/all
 * Admin – view all availability for a coach
 */
router.get(
  "/:id/availability/all",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const availability = await prisma.coachAvailability.findMany({
        where: { coachId: req.params.id },
        orderBy: [
          { date: "asc" },
          { startTime: "asc" },
        ],
      });

      res.json(availability);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  }
);


/**
 * GET /api/coaches/:id/availability?date=YYYY-MM-DD
 * Public – view coach availability for a date
 */
router.get("/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  try {
    const availability = await prisma.coachAvailability.findMany({
      where: {
        coachId: id,
        date: new Date(date),
      },
      orderBy: { startTime: "asc" },
    });

    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch availability" });
  }
});

module.exports = router;
