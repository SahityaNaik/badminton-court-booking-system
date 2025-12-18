require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ----- USERS -----
const hashedAdminPassword = await bcrypt.hash("admin123", 10);
const hashedUserPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@badminton.com",
      password: hashedAdminPassword,  
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "user@badminton.com",
      password: hashedUserPassword,
      role: "USER",
    },
  });

  // ----- COURTS -----
  await prisma.court.createMany({
    data: [
      { name: "Court 1", type: "INDOOR", basePrice: 500 },
      { name: "Court 2", type: "INDOOR", basePrice: 500 },
      { name: "Court 3", type: "OUTDOOR", basePrice: 300 },
      { name: "Court 4", type: "OUTDOOR", basePrice: 300 },
    ],
  });

  // ----- EQUIPMENT -----
  await prisma.equipment.createMany({
    data: [
      { name: "Racket", totalQuantity: 10, pricePerHour: 50 },
      { name: "Shoes", totalQuantity: 5, pricePerHour: 30 },
    ],
  });

  // ----- COACHES -----
  const coach1 = await prisma.coach.create({
    data: { name: "Coach A", pricePerHour: 200 },
  });

  const coach2 = await prisma.coach.create({
    data: { name: "Coach B", pricePerHour: 250 },
  });

  const coach3 = await prisma.coach.create({
    data: { name: "Coach C", pricePerHour: 300 },
  });

  // ----- COACH AVAILABILITY -----
  await prisma.coachAvailability.createMany({
    data: [
      {
        coachId: coach1.id,
        date: new Date("2025-01-01"),
        startTime: 6,
        endTime: 22,
      },
      {
        coachId: coach2.id,
        date: new Date("2025-01-01"),
        startTime: 8,
        endTime: 20,
      },
      {
        coachId: coach3.id,
        date: new Date("2025-01-01"),
        startTime: 10,
        endTime: 18,
      },
    ],
  });

  // ----- PRICING RULES -----
  await prisma.pricingRule.createMany({
    data: [
      {
        name: "Peak Hours (6-9 PM)",
        type: "PEAK_HOUR",
        multiplier: 1.5,
      },
      {
        name: "Weekend Pricing",
        type: "WEEKEND",
        multiplier: 1.2,
      },
      {
        name: "Indoor Court Premium",
        type: "INDOOR",
        multiplier: 1.3,
      },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
