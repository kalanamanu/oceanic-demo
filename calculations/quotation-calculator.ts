import type { BasisCalculation } from "@/types/basis.types";
import type { QuotationItem } from "@/types/quotation.types";

export class QuotationCalculator {
  /**
   * Single item calculation
   */
  static calculate(item: QuotationItem, basis: BasisCalculation): QuotationItem {
    const qty = Number(item.quantity || 0);
    const unitRateLKR = Number(item.price || 0);
    const additional = Number(item.additional_charges || 0);

    const usdRate = Number(basis?.usdRate || 1);
    const basisValue = Number(basis?.basis || 0);

    // ---- LKR CALCULATION ----
    const conva_basis = unitRateLKR * basisValue;

    const totalUnitRateLKR = unitRateLKR + additional;
    const totalLKR = totalUnitRateLKR * qty;

    // ---- USD CALCULATION ----
    const unitRateUSD = unitRateLKR / usdRate;
    const totalUnitRateUSD = totalUnitRateLKR / usdRate;
    const totalUSD = totalUnitRateUSD * qty;

    return {
      ...item,

      // keep numbers internally
      unit_rate_usd: unitRateUSD.toString(),
      total_unit_rate_usd: totalUnitRateUSD.toString(),
      conva_basis: conva_basis.toString(),
      total_unit_rate_rs: totalUnitRateLKR.toString(),
      total_rs: totalLKR.toString(),
      total_usd: totalUSD.toString(),
    };
  }

  /**
   * Batch recalculation
   */
  static recalculateAll(
    items: QuotationItem[],
    basis: BasisCalculation,
  ): QuotationItem[] {
    return items.map((item) => this.calculate(item, basis));
  }

  /**
   * GRAND TOTAL LKR
   */
  static calculateGrandTotalLKR(
    items: QuotationItem[],
    basis: BasisCalculation,
    additionalCharges: { name: string; amount: string; currency: string }[],
    discountLKR: string,
  ): number {
    const usdRate = Number(basis?.usdRate || 1);

    // ✅ ALWAYS recalc to avoid stale values
    const itemsTotal = items.reduce((sum, item) => {
      const calculated = this.calculate(item, basis);
      return sum + Number(calculated.total_rs || 0);
    }, 0);

    const additionalTotal = additionalCharges.reduce((sum, charge) => {
      const amount = Number(charge.amount || 0);

      return charge.currency === "USD"
        ? sum + amount * usdRate
        : sum + amount;
    }, 0);

    const discount = Number(discountLKR || 0);

    return itemsTotal + additionalTotal - discount;
  }

  /**
   * GRAND TOTAL USD
   */
  static calculateGrandTotalUSD(
    items: QuotationItem[],
    basis: BasisCalculation,
    additionalCharges: { name: string; amount: string; currency: string }[],
    discountLKR: string,
  ): number {
    const usdRate = Number(basis?.usdRate || 1);

    const itemsTotalUSD = items.reduce((sum, item) => {
      const calculated = this.calculate(item, basis);
      return sum + Number(calculated.total_usd || 0);
    }, 0);

    const additionalUSD = additionalCharges.reduce((sum, charge) => {
      const amount = Number(charge.amount || 0);

      return charge.currency === "LKR"
        ? sum + amount / usdRate
        : sum + amount;
    }, 0);

    const discountUSD = Number(discountLKR || 0) / usdRate;

    return itemsTotalUSD + additionalUSD - discountUSD;
  }
}