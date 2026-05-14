export function mapPrecostToDocument(data: any, options: any) {
  return {
    document: "precost",
    documentType: options.documentType,
    documentData: [
      {
        id: data.pre_cost_id,
        vessel_name: data.vessel_name,
        date_arrived: data.date_arrived,
        date_saild: data.date_saild,

        discount: data.discount,
        usd_rate: data.usd_rate,
        total_cost: data.total_cost,
        total_cost_usd: data.total_cost_usd,

        status: data.status,
        remark: data.remark,

        show_discount: options.showDiscount,
        show_additional_charge: options.showAdditionalCharges,

        items: data.preCostData || [],
        additional_charges: data.additionalCharges || [],
      },
    ],
  };
}