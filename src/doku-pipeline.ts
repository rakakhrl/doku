import { Doku } from "./doku";
// Lu kaga perlu import DokuOperation lagi di mari

/**
 * Tipe fungsi yang diterima sama pipeline.
 * Intinya nerima Doku saat ini, dan wajib nge-return Doku hasil olahan.
 */
export type PipelineOperation = (current: Doku) => Doku;

/**
 * Engine pipeline buat ngejalanin kalkulasi Doku secara berurutan (workflow).
 */
export class DokuPipeline {
  private initialMoney: Doku;
  private operations: PipelineOperation[] = [];

  constructor(initialMoney: Doku) {
    this.initialMoney = initialMoney;
  }

  /** Mulai pipeline baru dengan modal awal */
  static start(initialMoney: Doku): DokuPipeline {
    return new DokuPipeline(initialMoney);
  }

  /**
   * Masukin operasi ke dalem antrean pipeline.
   *
   * @param operation Fungsi yang nge-return instans Doku baru.
   */
  pipe(operation: PipelineOperation): this {
    this.operations.push(operation);
    return this;
  }

  /**
   * Eksekusi semua antrean operasi dari atas ke bawah.
   */
  calculate(): Doku {
    return this.operations.reduce(
      (currentAmount, operation) => operation(currentAmount),
      this.initialMoney
    );
  }
}
