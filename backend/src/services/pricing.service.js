const prisma = require("../prisma");

async function calculatePrice({
  court,
  startTime,
  endTime,
  date,
  equipment = [],
  coach,
}) {
  const hours = endTime - startTime;

  let basePrice = court.basePrice * hours;
  let multiplier = 1;

  const rules = await prisma.pricingRule.findMany({
    where: { isActive: true },
  });

  for (const rule of rules) {
    if (rule.type === "INDOOR" && court.type === "INDOOR") {
      multiplier *= rule.multiplier;
    }

    if (rule.type === "PEAK_HOUR" && startTime < 21 && endTime > 18) {
      multiplier *= rule.multiplier;
    }

    if (rule.type === "WEEKEND") {
      const day = new Date(date).getDay();
      if (day === 0 || day === 6) {
        multiplier *= rule.multiplier;
      }
    }
  }

  let total = basePrice * multiplier;

  let equipmentCost = 0;
  for (const item of equipment) {
    equipmentCost += item.pricePerHour * item.quantity * hours;
  }

  let coachCost = 0;
  if (coach) {
    coachCost = coach.pricePerHour * hours;
  }

  return {
    basePrice,
    multiplier,
    equipmentCost,
    coachCost,
    totalPrice: Math.round(total + equipmentCost + coachCost),
  };
}

module.exports = {
  calculatePrice,
};
