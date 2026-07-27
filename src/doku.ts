import { DineroCurrency, IDR } from "dinero.js/currencies";
import { DokuOptions } from "./doku.types";
import {
  Dinero,
  dinero,
  DineroSnapshot,
  DineroTransformer,
  toDecimal,
  toSnapshot,
} from "dinero.js";
import { formatter } from "./formatter";

/**
 * The core wrapper class for Dinero.js.
 *
 * It encapsulates a monetary value and provides convenient getter methods
 * to access raw values, formatted strings for UI rendering, and the underlying
 * Dinero object for mathematical operations.
 */
export class Doku {
  private _amount: number;
  private _currency: DineroCurrency<number, string>;
  private _scale: number;
  private _symbol: string | undefined;

  /**
   * Initializes a new Doku instance.
   *
   * @param {number} amount - The raw monetary amount (e.g., 100000 represents 1000.00 if scale is 2).
   * @param {DokuOptions} [options] - Optional configurations. Defaults to IDR currency and a scale of 2.
   */
  constructor(amount: number, options?: DokuOptions) {
    this._amount = amount;
    this._currency = options?.currency ?? IDR;
    this._scale = options?.scale ?? 2;
    this._symbol = options?.symbol;
  }

  /**
   * Gets the raw numeric amount.
   *
   * @returns {number} The raw amount.
   */
  get amount(): number {
    return this._amount;
  }

  /**
   * Gets the scale (number of decimal places).
   *
   * @returns {number} The current scale.
   */
  get scale(): number {
    return this._scale;
  }

  /**
   * Gets the configured currency object.
   *
   * @returns {DineroCurrency<number, string>} The Dinero currency object.
   */
  get currency(): DineroCurrency<number, string> {
    return this._currency;
  }

  /**
   * Returns the monetary value formatted as a basic decimal string.
   * Useful for API payloads or inputs that require plain numbers.
   *
   * @example "150000.00"
   * @returns {string} The decimal string representation.
   */
  get as_string(): string {
    return toDecimal(
      dinero({
        amount: this._amount,
        currency: this._currency,
        scale: this._scale,
      }),
    );
  }

  /**
   * Returns the monetary value formatted as a string complete with its currency symbol or code.
   * Ideal for rendering the final price on the UI.
   *
   * @example "Rp 150.000,00"
   * @returns {string} The formatted currency string.
   */
  get with_currency(): string {
    const d = dinero({
      amount: this._amount,
      currency: this._currency,
      scale: this._scale,
    });

    const createFormatter = (
      transformer: DineroTransformer<number, string, string, string>,
    ) => toDecimal(d, transformer);
    const formatted = createFormatter(({ value, currency }) =>
      formatter(value, this._symbol ?? currency.code),
    );
    return formatted;
  }

  /**
   * Returns a raw snapshot object of the current monetary state.
   * Useful for serialization (e.g., saving to Redux/localStorage) or debugging.
   *
   * @returns {DineroSnapshot<number, string>} The snapshot containing amount, currency, and scale.
   */
  get snapshot(): DineroSnapshot<number, string> {
    return toSnapshot(
      dinero({
        amount: this._amount,
        currency: this._currency,
        scale: this._scale,
      }),
    );
  }

  /**
   * Constructs and returns the underlying Dinero.js object.
   * Typically accessed internally by `DokuOperation` to perform calculations.
   *
   * @returns {Dinero<number, string>} The active Dinero object.
   */
  get dinero_object(): Dinero<number, string> {
    return dinero({
      amount: this._amount,
      currency: this._currency,
      scale: this._scale,
    });
  }

  /**
     * Checks if the monetary amount is exactly zero.
     * Useful for disabling payment buttons if a bill is fully paid.
     *
     * @returns {boolean} True if the amount is 0.
     */
    get is_zero(): boolean {
      return this._amount === 0;
    }

    /**
     * Checks if the monetary amount is negative.
     * Useful for validating overpayments or excessive discounts.
     *
     * @returns {boolean} True if the amount is less than 0.
     */
    get is_negative(): boolean {
      return this._amount < 0;
    }

    /**
     * Checks if the monetary amount is positive.
     *
     * @returns {boolean} True if the amount is strictly greater than 0.
     */
    get is_positive(): boolean {
      return this._amount > 0;
    }
}
