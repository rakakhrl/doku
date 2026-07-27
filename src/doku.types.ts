import { DineroCurrency } from "dinero.js/currencies";
import { Doku } from "./doku";

/**
 * Configuration options for initializing a new Doku instance.
 */
interface DokuOptions {
  /**
   * The Dinero currency object defining the currency code, base, and exponent.
   * If omitted, it will fall back to the default currency defined in your Doku class (e.g., IDR).
   */
  currency?: DineroCurrency<number, string>;

  /**
   * The number of decimal places the raw amount represents.
   * For example, a scale of 2 means an amount of 1000 represents 10.00.
   */
  scale?: number;

  /**
   * An optional currency symbol used for string formatting or UI rendering (e.g., "Rp", "$").
   */
  symbol?: string;
}

/**
 * Represents the distinct outcomes when comparing two Doku amounts.
 *
 * - `"equal"`: The base amount is exactly the same as the comparator.
 * - `"less"`: The base amount is strictly less than the comparator.
 * - `"greater"`: The base amount is strictly greater than the comparator.
 */
type DokuComparisonResult = "equal" | "less" | "greater";

/**
 * Represents a single operation step within the Doku pipeline.
 * It takes the current state of a Doku instance, processes it, and returns a new Doku instance.
 *
 * @callback PipelineOperation
 * @param {Doku} current - The current accumulated Doku instance in the pipeline.
 * @returns {Doku} The new, modified Doku instance.
 */
export type PipelineOperation = (current: Doku) => Doku;

export type { DokuOptions, DokuComparisonResult };
