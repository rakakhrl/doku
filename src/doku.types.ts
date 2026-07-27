import { Dinero } from "dinero.js";
import { DineroCurrency } from "dinero.js/currencies";

interface DokuOptions {
  currency?: DineroCurrency<number, string>;
  scale?: number;
  symbol?: string;
}

type DokuComparisonResult = "equal" | "less" | "greater";

export type { DokuOptions, DokuComparisonResult };
