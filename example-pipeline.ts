// Run this example by typing `npx tsx example.ts` in your terminal

import { Doku, DokuOperation, DokuPipeline, Dinero } from "./src";

/**
 * --- Skenario Dunia Nyata: Keranjang Belanja E-Commerce ---
 *
 * User lagi checkout barang incerannya. Alur perhitungannya:
 * 1. Modal awal: Harga barang utamanya (Laptop)
 * 2. Tambah harga barang kedua (Mouse)
 * 3. Tambah ongkos kirim
 * 4. Potong voucher gratis ongkir/diskon (Nominal pas)
 * 5. Dipotong lagi diskon Flash Sale 5% dari subtotal sementara
 * 6. Tambah biaya asuransi pengiriman & admin aplikasi
 * 7. Pembulatan
 */

export const calculateEcommerceCart = () => {
  // 1. Setup isi keranjang (Scale 2 buat nyimpen 2 angka di belakang koma)
  const hargaLaptop = new Doku(1500000000, { currency: Dinero.IDR, scale: 2 }); // Rp 15.000.000,00
  const hargaMouse = new Doku(50000000, { currency: Dinero.IDR, scale: 2 });    // Rp 500.000,00
  const ongkir = new Doku(4500000, { currency: Dinero.IDR, scale: 2 });         // Rp 45.000,00
  const asuransi = new Doku(1500000, { currency: Dinero.IDR, scale: 2 });       // Rp 15.000,00
  const adminApp = new Doku(250000, { currency: Dinero.IDR, scale: 2 });        // Rp 2.500,00

  const voucherDiskon = new Doku(10000000, { currency: Dinero.IDR, scale: 2 }); // Potongan Rp 100.000,00

  // 2. Eksekusi keranjang belanjanya
  const totalTagihan = DokuPipeline
    .start(hargaLaptop)
    .pipe((current) => DokuOperation.add(current, hargaMouse)) // a. Masukin barang tambahan ke keranjang
    .pipe((current) => DokuOperation.add(current, ongkir)) // b. Tambah ongkos kirim
    .pipe((current) => DokuOperation.subtract(current, voucherDiskon)) // c. Potong pake voucher promo nominal
    .pipe((current) => {
      const nilaiFlashSale = DokuOperation.take_percentage(current, 5);
      return DokuOperation.subtract(current, nilaiFlashSale);
    }) // d. Potong diskon event (Flash Sale 5%)
    .pipe((current) => DokuOperation.add(current, asuransi)) // e. Tambah printilan biaya Asuransi
    .pipe((current) => DokuOperation.add(current, adminApp)) // f. Tambah printilan biaya Admin
    .pipe((current) => DokuOperation.rounding(current, "nearest", 2)) // g. Buletin nilai akhirnya
    .calculate(); // 3. Render jadi duit beneran

  console.log(`[Checkout Keranjang]`);
  console.log(`Laptop (Base)  : ${hargaLaptop.with_currency}`);
  console.log(`Mouse          : +${hargaMouse.with_currency}`);
  console.log(`Ongkir         : +${ongkir.with_currency}`);
  console.log(`Voucher Promo  : -${voucherDiskon.with_currency}`);
  console.log(`Asuransi       : +${asuransi.with_currency}`);
  console.log(`Admin          : +${adminApp.with_currency}`);
  console.log(`------------------------------`);
  console.log(`Total Bayar (inc. Flash Sale 5%) : ${totalTagihan.with_currency}`);

  return totalTagihan;
};

calculateEcommerceCart();
