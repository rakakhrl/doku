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

export class Doku {
  private _amount: number;
  private _currency: DineroCurrency<number, string>;
  private _scale: number;
  private _symbol: string | undefined;

  constructor(amount: number, options?: DokuOptions) {
    this._amount = amount;
    this._currency = options?.currency ?? IDR;
    this._scale = options?.scale ?? 2;
    this._symbol = options?.symbol;
  }

  get amount(): number {
    return this._amount;
  }

  get scale(): number {
    return this._scale;
  }

  get currency(): DineroCurrency<number, string> {
    return this._currency;
  }

  get as_string(): string {
    return toDecimal(
      dinero({
        amount: this._amount,
        currency: this._currency,
        scale: this._scale,
      }),
    );
  }

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

  get snapshot(): DineroSnapshot<number, string> {
    return toSnapshot(
      dinero({
        amount: this._amount,
        currency: this._currency,
        scale: this._scale,
      }),
    );
  }

  get dinero_object(): Dinero<number, string> {
    return dinero({
      amount: this._amount,
      currency: this._currency,
      scale: this._scale,
    });
  }
}
