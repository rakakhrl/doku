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

export class DokuOperation {
  static add(augend: Doku, addend: Doku): Doku {
    const result = dineroAdd(augend.dinero_object, addend.dinero_object);
    return new Doku(result.toJSON().amount, {
      currency: result.toJSON().currency,
      scale: result.toJSON().scale,
    });
  }

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

  static multiply_integer(multipicant: Doku, multiplier: number): Doku {
    const result = dineroMultiply(multipicant.dinero_object, multiplier);

    return new Doku(result.toJSON().amount, {
      currency: result.toJSON().currency,
      scale: result.toJSON().scale,
    });
  }

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

  static take_percentage(base: Doku, percentage: number): Doku {
    const rest = 100 - percentage;
    const [result] = allocate(base.dinero_object, [percentage, rest]);

    return new Doku(result.toJSON().amount, {
      currency: result.toJSON().currency,
      scale: result.toJSON().scale,
    });
  }

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
}
