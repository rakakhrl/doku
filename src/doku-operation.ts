import { Doku } from "./doku";
import {
  Dinero,
  add as dineroAdd,
  subtract as dineroSubtract,
  multiply as dineroMultiply,
  DineroScaledAmount,
  allocate,
  up,
  down,
  halfAwayFromZero,
  transformScale,
  compare as dineroCompare,
} from "dinero.js";
import { DokuComparisonResult } from "./doku.types";

/**
 * A utility class containing pure functions (static methods) to perform mathematical
 * and logical operations on Doku instances.
 *
 * All methods treat Doku instances as immutable; they do not modify the original
 * input but instead return a brand new Doku instance containing the calculated result.
 */
export class DokuOperation {
  /**
   * Adds two Doku amounts together.
   *
   * @param {Doku} augend - The base amount.
   * @param {Doku} addend - The amount to be added.
   * @returns {Doku} A new Doku instance representing the sum.
   */
  static add(augend: Doku, addend: Doku): Doku {
    const result = dineroAdd(augend.dinero_object, addend.dinero_object);
    return new Doku(result.toJSON().amount, {
      currency: result.toJSON().currency,
      scale: result.toJSON().scale,
    });
  }

  /**
   * Subtracts one Doku amount from another.
   *
   * @param {Doku} minuend - The base amount to subtract from.
   * @param {Doku} subtrahend - The amount to subtract.
   * @returns {Doku} A new Doku instance representing the difference.
   */
  static subtract(minuend: Doku, subtrahend: Doku): Doku {
    const result = dineroSubtract(
      minuend.dinero_object,
      subtrahend.dinero_object,
    );
    return new Doku(result.toJSON().amount, {
      currency: result.toJSON().currency,
      scale: result.toJSON().scale,
    });
  }

  /**
   * Adds multiple Doku amounts together sequentially.
   *
   * @param {Doku[]} moneyList - An array of Doku instances to be summed.
   * @returns {Doku} A new Doku instance representing the total sum.
   */
  static add_many(moneyList: Doku[]): Doku {
    const transform = moneyList.map((m) => m.dinero_object);
    const calculate = (addends: Dinero<number, string>[]) =>
      addends.reduce(dineroAdd);
    const result = calculate(transform);

    return new Doku(result.toJSON().amount, {
      currency: result.toJSON().currency,
      scale: result.toJSON().scale,
    });
  }

  /**
   * Subtracts multiple Doku amounts sequentially from the first item in the array.
   *
   * @param {Doku[]} moneyList - An array of Doku instances.
   * @returns {Doku} A new Doku instance representing the final subtracted amount.
   */
  static subtract_many(moneyList: Doku[]): Doku {
    const transform = moneyList.map((m) => m.dinero_object);
    const calculate = (subtrahends: Dinero<number, string>[]) =>
      subtrahends.reduce(dineroSubtract);
    const result = calculate(transform);

    return new Doku(result.toJSON().amount, {
      currency: result.toJSON().currency,
      scale: result.toJSON().scale,
    });
  }

  /**
   * Multiplies a Doku amount by a standard integer.
   *
   * @param {Doku} multipicant - The base amount to multiply.
   * @param {number} multiplier - The integer to multiply by.
   * @returns {Doku} A new Doku instance representing the product.
   */
  static multiply_integer(multipicant: Doku, multiplier: number): Doku {
    const result = dineroMultiply(multipicant.dinero_object, multiplier);

    return new Doku(result.toJSON().amount, {
      currency: result.toJSON().currency,
      scale: result.toJSON().scale,
    });
  }

  /**
   * Multiplies a Doku amount by a scaled Dinero multiplier (e.g., for fractions or percentages).
   *
   * @param {Doku} multiplicant - The base amount.
   * @param {DineroScaledAmount<number>} multiplier - The scaled multiplier object.
   * @returns {Doku} A new Doku instance representing the product.
   */
  static multiply_scale(
    multiplicant: Doku,
    multiplier: DineroScaledAmount<number>,
  ): Doku {
    const result = dineroMultiply(multiplicant.dinero_object, multiplier);

    return new Doku(result.toJSON().amount, {
      currency: result.toJSON().currency,
      scale: result.toJSON().scale,
    });
  }

  /**
   * Extracts a specific percentage portion from a base Doku amount.
   * Safely allocates the amount to avoid precision loss or floating-point errors.
   *
   * @param {Doku} base - The total base amount.
   * @param {number} percentage - The percentage to extract (e.g., 11 for 11%).
   * @returns {Doku} A new Doku instance representing the extracted percentage.
   */
  static take_percentage(base: Doku, percentage: number): Doku {
    const rest = 100 - percentage;
    const [result] = allocate(base.dinero_object, [percentage, rest]);

    return new Doku(result.toJSON().amount, {
      currency: result.toJSON().currency,
      scale: result.toJSON().scale,
    });
  }

  /**
   * Distributes a base Doku amount into multiple parts based on an array of percentages.
   * Useful for splitting bills or calculating multiple tax/fee brackets.
   *
   * @param {Doku} base - The total base amount.
   * @param {number[]} percentages - An array of percentages representing the distribution ratios.
   * @returns {Doku[]} An array of new Doku instances corresponding to each percentage.
   */
  static distribute_percentage(base: Doku, percentages: number[]): Doku[] {
    const result = allocate(base.dinero_object, percentages);

    return result.map(
      (r) =>
        new Doku(r.toJSON().amount, {
          currency: r.toJSON().currency,
          scale: r.toJSON().scale,
        }),
    );
  }

  /**
   * Prorates (distributes) a base Doku amount proportionally based on another set of Doku amounts.
   *
   * @param {Doku} base - The base amount to be distributed.
   * @param {Doku[]} proporsional - An array of Doku amounts defining the ratio of distribution.
   * @returns {Doku[]} An array of new prorated Doku instances.
   */
  static prorate(base: Doku, proporsional: Doku[]): Doku[] {
    const result = allocate(
      base.dinero_object,
      proporsional.map((p) => p.amount),
    );

    return result.map(
      (r) =>
        new Doku(r.toJSON().amount, {
          currency: r.toJSON().currency,
          scale: r.toJSON().scale,
        }),
    );
  }

  /**
   * Compares two Doku amounts.
   *
   * @param {Doku} base - The base amount to compare.
   * @param {Doku} comparator - The amount to compare against.
   * @returns {DokuComparisonResult | undefined} `"equal"`, `"less"`, `"greater"`, or undefined if comparison fails.
   */
  static compare(
    base: Doku,
    comparator: Doku,
  ): DokuComparisonResult | undefined {
    const result = dineroCompare(base.dinero_object, comparator.dinero_object);

    switch (result) {
      case 0:
        return "equal";
      case -1:
        return "less";
      case 1:
        return "greater";
      default:
        return;
    }
  }

  /**
   * Rounds the Doku amount to a specified scale using a specific rounding behavior.
   *
   * @param {Doku} base - The Doku amount to round.
   * @param {"up" | "down" | "nearest"} direction - The rounding strategy to apply.
   * @param {number} [scale=2] - The new scale to transform the amount to (defaults to 2).
   * @returns {Doku} A new rounded Doku instance.
   */
  static rounding(
    base: Doku,
    direction: "up" | "down" | "nearest",
    scale: number = 2,
  ): Doku {
    let rounder;

    switch (direction) {
      case "up":
        rounder = up;
        break;
      case "down":
        rounder = down;
        break;
      case "nearest":
        rounder = halfAwayFromZero;
        break;
      default:
        break;
    }

    const result = transformScale(base.dinero_object, scale, rounder);

    return new Doku(result.toJSON().amount, {
      currency: result.toJSON().currency,
      scale: result.toJSON().scale,
    });
  }

  /**
   * Custom rounding method that forcefully rounds the raw amount value at a specific decimal position.
   *
   * @param {Doku} base - The Doku amount to round.
   * @param {number} position - The decimal position to execute the Math.round logic on.
   * @returns {Doku} A new Doku instance with the modified amount.
   */
  static rounding_on_position(base: Doku, position: number): Doku {
    if (position >= base.amount.toString().length) {
      return base;
    }
    const transformed = base.amount / Math.pow(10, position);
    const rounded = Math.round(transformed) * Math.pow(10, position);

    return new Doku(rounded, {
      currency: base.currency,
      scale: base.scale,
    });
  }

  /**
     * Finds the maximum Doku amount from a given array of Doku instances.
     *
     * @param {Doku[]} moneyList - The array of Doku instances to compare.
     * @returns {Doku} The Doku instance with the highest value.
     * @throws {Error} If the provided array is empty.
     */
    static max(moneyList: Doku[]): Doku {
      if (moneyList.length === 0) {
        throw new Error("Cannot find the maximum value of an empty array.");
      }
      return moneyList.reduce((prev, current) => {
        return (current.amount > prev.amount) ? current : prev;
      });
    }

    /**
     * Finds the minimum Doku amount from a given array of Doku instances.
     *
     * @param {Doku[]} moneyList - The array of Doku instances to compare.
     * @returns {Doku} The Doku instance with the lowest value.
     * @throws {Error} If the provided array is empty.
     */
    static min(moneyList: Doku[]): Doku {
      if (moneyList.length === 0) {
        throw new Error("Cannot find the minimum value of an empty array.");
      }
      return moneyList.reduce((prev, current) => {
        return (current.amount < prev.amount) ? current : prev;
      });
    }
}
