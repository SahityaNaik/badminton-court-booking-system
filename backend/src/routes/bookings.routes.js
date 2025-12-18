const express = require("express");
const prisma = require("../prisma");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");
const { calculatePrice } = require("../services/pricing.service");

const router = express.Router();

/**
 * POST /api/bookings
 * User – create booking (atomic)
 */
router.post("/", requireAuth, async (req, res) => {
  const {
    courtId,
    date,
    startTime,
    endTime,
    equipment = [],
    coachId,
  } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Court availability
      const conflict = await tx.booking.findFirst({
        where: {
          courtId,
          date: new Date(date),
          startTime: { lt: endTime },
          endTime: { gt: startTime },
          status: "CONFIRMED",
        },
      });

      if (conflict) throw new Error("Court not available");

      // 2. Fetch court
      const court = await tx.court.findUnique({ where: { id: courtId } });

      // 3. Equipment availability
      const equipmentDetails = [];
      for (const item of equipment) {
        const eq = await tx.equipment.findUnique({
          where: { id: item.equipmentId },
        });

        if (!eq || eq.totalQuantity < item.quantity) {
          throw new Error("Equipment not available");
        }

        equipmentDetails.push({
          ...eq,
          quantity: item.quantity,
        });
      }

      // 4. Coach availability
      let coach = null;
      if (coachId) {
        const availability = await tx.coachAvailability.findFirst({
          where: {
            coachId,
            date: new Date(date),
            startTime: { lte: startTime },
            endTime: { gte: endTime },
          },
        });

        if (!availability) throw new Error("Coach not available");

        coach = await tx.coach.findUnique({ where: { id: coachId } });
      }

      // 5. Price calculation
      const pricing = await calculatePrice({
        court,
        startTime,
        endTime,
        date,
        equipment: equipmentDetails,
        coach,
      });

      // 6. Create booking
      const booking = await tx.booking.create({
        data: {
          userId: req.user.id,
          courtId,
          coachId,
          date: new Date(date),
          startTime,
          endTime,
          totalPrice: pricing.totalPrice,
          equipment: {
            create: equipment.map((e) => ({
              equipmentId: e.equipmentId,
              quantity: e.quantity,
            })),
          },
        },
        include: { equipment: true },
      });

      return { booking, pricing };
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * GET /api/bookings
 * User – view own booking history
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        court: true,
        coach: true,
        equipment: {
          include: { equipment: true },
        },
      },
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

/**
 * GET /api/bookings/admin/all
 * Admin – view all bookings
 */
router.get("/admin/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        court: true,
        coach: true,
        equipment: {
          include: { equipment: true },
        },
      },
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});


module.exports = router;
