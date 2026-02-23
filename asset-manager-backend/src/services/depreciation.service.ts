export function calculateStraightLineDepreciation(
  purchaseCost: number,
  purchaseDate: Date,
  usefulLifeYears: number = 5,
  salvageValue: number = 0
): number {

  const today = new Date();

  // Calculate difference in years
  const yearsUsed =
    (today.getTime() - purchaseDate.getTime()) /
    (1000 * 60 * 60 * 24 * 365);

  // Annual depreciation
  const annualDepreciation =
    (purchaseCost - salvageValue) / usefulLifeYears;

  // Total depreciation so far
  const accumulatedDepreciation =
    annualDepreciation * yearsUsed;

  // Book value
  const bookValue =
    purchaseCost - accumulatedDepreciation;

  // Asset value should never go below salvage value
  return bookValue > salvageValue
    ? parseFloat(bookValue.toFixed(2))
    : salvageValue;
}