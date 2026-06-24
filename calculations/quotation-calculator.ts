import type { BasisCalculation } from "@/types/basis.types";
import type { QuotationItem } from "@/types/quotation.types";

export class QuotationCalculator {
  /**
   * Single item calculation
   */
  static calculate(item: QuotationItem, basis: BasisCalculation): QuotationItem {
    const qty = Number(item.quantity || 0);
    const unitRate_LKR = Number(item.price || 0);
    const additional = Number(item.additional_charges || 0);

    const usdRate = Number(basis?.usdRate || 1);
    const basisValue = Number(basis?.basis || 0);

    // ---- LKR CALCULATION ----
    const conva_basis = unitRate_LKR * basisValue;

    const total_unit_rate_rs = unitRate_LKR + additional;
    const total_rs = total_unit_rate_rs * qty;

    // ---- USD CALCULATION (UNCHANGED LOGIC) ----
    const unit_rate_usd = unitRate_LKR / usdRate;

    const total_unit_rate_usd = total_unit_rate_rs / usdRate;

    const total_usd = total_unit_rate_usd * qty;

    return {
      ...item,

      unit_rate_usd: unit_rate_usd.toFixed(2),
      total_unit_rate_usd: total_unit_rate_usd.toFixed(2),
      conva_basis: conva_basis.toFixed(2),
      total_unit_rate_rs: total_unit_rate_rs.toFixed(2),
      total_rs: total_rs.toFixed(2),
      total_usd: total_usd.toFixed(2),
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
    const itemsTotal = items.reduce(
      (sum, item) => sum + Number(item.total_rs || 0),
      0,
    );

    const usdRate = Number(basis?.usdRate || 1);

    const additionalTotal = additionalCharges.reduce((sum, charge) => {
      const amount = Number(charge.amount || 0);

      if (charge.currency === "USD") {
        return sum + amount * usdRate;
      }

      return sum + amount;
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

    const itemsTotalUSD = items.reduce(
      (sum, item) => sum + Number(item.total_usd || 0),
      0,
    );

    const additionalUSD = additionalCharges.reduce((sum, charge) => {
      const amount = Number(charge.amount || 0);

      if (charge.currency === "LKR") {
        return sum + amount / usdRate;
      }

      return sum + amount;
    }, 0);

    const discountUSD = Number(discountLKR || 0) / usdRate;

    return itemsTotalUSD + additionalUSD - discountUSD;
  }
}