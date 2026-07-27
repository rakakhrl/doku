import { Doku } from "./doku";
import type { PipelineOperation } from "./doku.types";

/**
 * A builder class that orchestrates sequential money calculations using lazy evaluation.
 *
 * `DokuPipeline` allows developers to chain multiple `DokuOperation` methods without deep nesting,
 * creating a clean, readable workflow. Operations are merely queued when calling `.pipe()`
 * and are only executed when `.calculate()` is finally invoked.
 *
 * @example
 * const finalPrice = DokuPipeline.start(basePrice)
 *   .pipe((current) => DokuOperation.add(current, shippingFee))
 *   .pipe((current) => DokuOperation.subtract(current, discount))
 *   .calculate();
 */
export class DokuPipeline {
  private initialMoney: Doku;
  private operations: PipelineOperation[] = [];

  /**
   * Initializes a new calculation pipeline.
   *
   * @param {Doku} initialMoney - The starting money value for the calculation workflow.
   */
  constructor(initialMoney: Doku) {
    this.initialMoney = initialMoney;
  }

  /**
   * A static factory method to initialize the pipeline cleanly without the `new` keyword.
   * This improves code readability during method chaining.
   *
   * @param {Doku} initialMoney - The starting money value.
   * @returns {DokuPipeline} A new instance of the DokuPipeline.
   */
  static start(initialMoney: Doku): DokuPipeline {
    return new DokuPipeline(initialMoney);
  }

  /**
   * Queues a new operation to be executed in the pipeline.
   *
   * @param {PipelineOperation} operation - A function containing the calculation logic. It must return a `Doku` instance.
   * @returns {this} The current pipeline instance to allow method chaining.
   */
  pipe(operation: PipelineOperation): this {
    this.operations.push(operation);
    return this;
  }

  /**
   * Executes all queued operations sequentially (from top to bottom) and returns the final result.
   *
   * @returns {Doku} The final calculated Doku instance after all operations have been applied.
   */
  calculate(): Doku {
    return this.operations.reduce(
      (currentAmount, operation) => operation(currentAmount),
      this.initialMoney
    );
  }

  /**
     * Injects a debugging step into the pipeline without modifying the current amount.
     * It logs the current state of the Doku instance to the console.
     *
     * @param {string} [label="Debug Pipeline"] - An optional label to prefix the console log.
     * @returns {this} The current pipeline instance to allow further method chaining.
     */
    debug(label: string = "Debug Pipeline"): this {
      this.operations.push((current) => {
        console.log(`[${label}] Amount: ${current.amount} | Formatted: ${current.with_currency}`);
        return current; // Return as-is, no mutations
      });
      return this;
    }
}
