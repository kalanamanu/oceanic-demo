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
}