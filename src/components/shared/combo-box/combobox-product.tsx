"use client";

import { ProductModel } from "@/models/dashboard/master-data/product/product.response.model";
import { getProductsService } from "@/services/dashboard/product/product.service";
import { AsyncCombobox } from "./async-combobox";

interface ComboboxProductProps {
  value: ProductModel | null;
  onSelect: (item: ProductModel | null) => void;
  disabled?: boolean;
}

export function ComboboxProduct({
  value,
  onSelect,
  disabled
}: ComboboxProductProps) {
  return (
    <AsyncCombobox<ProductModel>
      value={value}
      onSelect={onSelect}
      fetchDataFn={async (params) => {
        const result = await getProductsService(
          params.pageNo,
          params.pageSize,
          params.search
        );
        return {
          content: result.content,
          last: !!result.last,
          pageNo: result.pageNo || 1
        };
      }}
      placeholder="Select product..."
      searchPlaceholder="Search product name..."
      emptyMessage="No product found."
      labelKey="name"
      valueKey="id"
      disabled={disabled}
    />
  );
}
