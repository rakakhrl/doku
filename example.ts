// Run this example by typing `npx tsx example.ts` in your terminal

import { Dinero, Doku, DokuOperation } from "./dist";

const doku = new Doku(1845572);

console.log("=== Doku ===");
console.log("amount: ", doku.amount);
console.log("scale: ", doku.scale);
console.log("currency: ", doku.currency);
console.log("amount as string: ", doku.as_string);
console.log("dinero object: ", doku.dinero_object);
console.log("\nUse snapshot to store money in database");
console.log("snapshot: ", doku.snapshot);
console.log("amount with currency: ", doku.with_currency);
console.log("amount with currency using custom symbol: ", new Doku(1845572, { currency: Dinero.IDR, scale: 2, symbol: "Rp" }).with_currency);
console.log("Create money from snapshot => {amount: 100000, currency: IDR, scale: 2}: ", new Doku(100000, { currency: Dinero.IDR, scale: 2 }).with_currency)
console.log("======================\n");

console.log("=== Addition ===");
console.log(
  "18455,72 + 2000,00 = ",
  DokuOperation.add(doku, new Doku(200000)).with_currency,
);
console.log(
  "18455,72 + 2000,00 + 545,00 + 1000,00 = ",
  DokuOperation.add_many([
    doku,
    new Doku(200000),
    new Doku(54500),
    new Doku(100000),
  ]).with_currency,
);
console.log("======================\n");

console.log("=== Subtraction ===");
console.log(
  "18455,72 - 2000,00 = ",
  DokuOperation.subtract(doku, new Doku(200000)).with_currency,
);
console.log(
  "18455,72 - 2000,00 - 455,00 - 1000,00 = ",
  DokuOperation.subtract_many([
    doku,
    new Doku(200000),
    new Doku(45500),
    new Doku(100000),
  ]).with_currency,
);
console.log("======================\n");

console.log("=== Multiplication ===");
console.log(
  "15550,00 * 2 = ",
  DokuOperation.multiply_integer(new Doku(1555000), 2).with_currency,
);
console.log(
  "1000,00 * 2000,000 = ",
  DokuOperation.multiply_scale(new Doku(100000), { amount: 200000, scale: 3 }).with_currency,
);
console.log("======================\n");


console.log("=== Percentage ===");
console.log(
  "50% of 3000,00 = ",
  DokuOperation.take_percentage(new Doku(300000), 50).with_currency,
);
console.log(
  "Distribute 15% and 50% and 35% of 10000,00 = ",
  DokuOperation.distribute_percentage(new Doku(1000000), [15, 50, 35]).map((m) => m.with_currency),
);
console.log("\nUse case => Prorate total discount to each item")
const items = [
  new Doku(12312300),
  new Doku(86128400),
  new Doku(1283200),
  new Doku(12311100),
  new Doku(43212322),
]
const total = DokuOperation.add_many(items);
const discount = DokuOperation.take_percentage(total, 33);
// const discount = new Money(34598757)
const roundedDiscount = DokuOperation.rounding(discount, "nearest");

const discountedTotal = DokuOperation.subtract(total, discount);
const proratedDiscount = DokuOperation.prorate(discount, items);
const newItems = items.map((v, i) => DokuOperation.subtract(v, proratedDiscount[i]));

console.log("Items: ", items.map((i) => i.with_currency))
console.log("Total: ", total.with_currency)
console.log("Discount: ", discount.with_currency)
console.log("Rounded Discount: ", roundedDiscount.with_currency)
console.log(`Discounted total (${total.with_currency} - ${discount.with_currency}): ${discountedTotal.with_currency}`)
console.log(
  "Prorate discount to each item = ",
  proratedDiscount.map((m, i) => `${m.with_currency} discount for ${items[i].with_currency}`),
);
console.log("Items after discount: ", items.map((item, i) => `${item.with_currency} - ${proratedDiscount[i].with_currency} = ${newItems[i].with_currency}`))
console.log(`Total items after prorated discount should be ${discountedTotal.with_currency}`, DokuOperation.add_many(newItems).with_currency)

console.log("======================\n");

console.log("=== Comparison ===");
console.log(
  "Compare 5000,00 to 3000,00 = ",
  DokuOperation.compare(new Doku(500000), new Doku(300000)),
);
console.log(
  "Compare 3000,00 to 5000,00 = ",
  DokuOperation.compare(new Doku(300000), new Doku(500000)),
);
console.log(
  "Compare 5000,00 to 5000,00 = ",
  DokuOperation.compare(new Doku(500000), new Doku(500000)),
);
console.log("======================\n");

console.log("=== Rounding ===");
console.log(
  "Round 18455,554 up = ",
  DokuOperation.rounding(new Doku(18455554, { currency: Dinero.IDR, scale: 3 }), "up").with_currency,
);
console.log(
  "Round 18455,554 down = ",
  DokuOperation.rounding(new Doku(18455554, { currency: Dinero.IDR, scale: 3 }), "down").with_currency,
);
console.log(
  "Round 18455,557 to nearest = ",
  DokuOperation.rounding(new Doku(18455557, { currency: Dinero.IDR, scale: 3 }), "nearest").with_currency,
);
console.log(
  "Round 18455,72 on position 1 (18455,7[2]) = ",
  DokuOperation.rounding_on_position(doku, 1).with_currency,
);
console.log(
  "Round 18455,72 on position 2 (18455,[72]) = ",
  DokuOperation.rounding_on_position(doku, 2).with_currency,
);
console.log(
  "Round 18455,72 on position 3 (1845[5,72]) = ",
  DokuOperation.rounding_on_position(doku, 3).with_currency,
);
console.log(
  "Round 18455,72 on position 4 (184[55,72]) = ",
  DokuOperation.rounding_on_position(doku, 4).with_currency,
);
console.log(
  "Round 18455,72 on position 5 (18[455,72]) = ",
  DokuOperation.rounding_on_position(doku, 5).with_currency,
);
console.log(
  "Round 18455,72 on position 6 (1[8455,72]) = ",
  DokuOperation.rounding_on_position(doku, 6).with_currency,
);
console.log("\nDo nothing if position is equal, greater, or less than amount length")
console.log(
  "Round 18455,72 on position 7 ([18455,72]) = ",
  DokuOperation.rounding_on_position(doku, 7).with_currency,
);
console.log(
  "Round 18455,72 on position 10 ([___18455,72]) = ",
  DokuOperation.rounding_on_position(doku, 10).with_currency,
);
console.log(
  "Round 18455,72 on position 0 (18455,72) = ",
  DokuOperation.rounding_on_position(doku, 0).with_currency,
);
console.log("======================\n");
