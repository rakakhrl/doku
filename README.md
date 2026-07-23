> ** 🙏 Credit and acknowledgements**

> Thank you to Sarah Dayan and the contributors of **dinero.js**. This package is built on top of their core logic and external library.

# Doku

Thin wrapper around [Dinero.js](https://github.com/dinero-js/dinero.js) to work with monetary values.

---

## Installation
```bash
npm install @rakakhrl/doku
```

## Usage
### 1. Initialization
Use the `Doku` class to represent monetary values safely (avoiding floating-point precision issues in JavaScript).

```typescript
import { Doku } from '@rakakhrl/doku';

// Create a Doku instance (can be from number, string, or cent value)
const price = new Doku(1500000); // Rp 15,000.00
const custom_symbol = new Doku("1500000", { symbol: "Rp" }); // Rp 25,000.00

console.log(price.with_currency); // Output: "IDR 15,000.00"
console.log(custom_symbol.with_currency); // Output: "Rp 25,000.00"
```

### 2. Arithmetic Operations Using DokuOperation
To perform arithmetic operations (addition, subtraction, multiplication, division) between monetary values.

```typescript
import { Doku, DokuOperation } from '@rakakhrl/doku';

const subtotal = new Doku(100000); // Rp 1,000.00
const tax = new Doku(11000); // Rp 110.00

// Adding
const total = DokuOperation.add(subtotal, tax);
console.log(total.with_currency); // Rp 1,110.00

// Subtracting
const remaining = DokuOperation.subtract(subtotal, new Doku(250000));
console.log(remaining.with_currency); // Rp 7,500.00

// Multiplying or Dividing with a Normal Number
const doubled = DokuOperation.multiply(subtotal, 2);
console.log(doubled.with_currency); // Rp 2,000.00
```

## Example
Head over to the example file to see a full example of how to use Doku in your application or run this command to see the example in action:
```bash
npx tsx example.ts
```
