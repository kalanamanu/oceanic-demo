import type { Basis } from "@/types/basis.types";
import type { QuotationItem } from "@/types/quotation.types";

export class QuotationCalculator {
  /**
   * Single item calculation
  */
  static calculate(item: QuotationItem, basis: Basis): QuotationItem {
    const qty = Number(item.quantity || 0);
    const unitRate = Number(item.price || 0);
    const additional = Number(item.additional_charges || 0);
    const basisValue = Number(basis?.basis || 0);

    const conva_basis = unitRate * basisValue;

    const total_unit_rate_rs = unitRate + additional;

    const total_rs = total_unit_rate_rs * qty;

    const total_usd = conva_basis * qty;

    return {
      ...item,
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
    basis: Basis,
  ): QuotationItem[] {
    return items.map((item) => this.calculate(item, basis));
  }

  /**
   * Total amount LKR calculation
  */

  static calculateGrandTotalLKR(
  items: QuotationItem[],
  basis: Basis,
  additionalCharges: { name: string; amount: string; currency: string }[],
  discountLKR: string
): number {
  // 1. Items Total (already in LKR)
  const itemsTotal = items.reduce(
    (sum, item) => sum + Number(item.total_rs || 0),
    0
  );

  // 2. Additional Charges -> Convert to LKR if needed
  const additionalTotal = additionalCharges.reduce((sum, charge) => {
    const amount = Number(charge.amount || 0);

    if (charge.currency === "USD") {
      return sum + amount * Number(basis?.USDRate || 0);
    }

    // LKR or others treated as LKR
    return sum + amount;
  }, 0);

  // 3. Discount (already LKR)
  const discount = Number(discountLKR || 0);

  // 4. Final Total
  return itemsTotal + additionalTotal - discount;
}

/**
   * Total amount USD calculation
   */

static calculateGrandTotalUSD(
  items: QuotationItem[],
  basis: Basis,
  additionalCharges: { name: string; amount: string; currency: string }[],
  discountLKR: string
): number {
  const usdRate = Number(basis?.USDRate || 0);

  // 1. Items Total (already USD)
  const itemsTotalUSD = items.reduce(
    (sum, item) => sum + Number(item.total_usd || 0),
    0
  );

  // 2. Additional Charges -> convert to USD if needed
  const additionalUSD = additionalCharges.reduce((sum, charge) => {
    const amount = Number(charge.amount || 0);

    if (charge.currency === "LKR") {
      return sum + amount / usdRate;
    }

    // USD stays USD
    return sum + amount;
  }, 0);

  // 3. Discount (LKR → USD)
  const discountUSD = Number(discountLKR || 0) / usdRate;

  // 4. Final Total
  return itemsTotalUSD + additionalUSD - discountUSD;
}

}