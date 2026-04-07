"use client";

import { BrandModel } from "@/models/dashboard/master-data/brand/brand.model";
import { fetchBrandsService } from "@/services/dashboard/brand/brand.service";
import { AsyncCombobox } from "./async-combobox";

interface ComboboxBrandProps {
  value: BrandModel | null;
  onSelect: (item: BrandModel | null) => void;
  disabled?: boolean;
}

export function ComboboxBrand({
  value,
  onSelect,
  disabled
}: ComboboxBrandProps) {
  return (
    <AsyncCombobox<BrandModel>
      value={value}
      onSelect={onSelect}
      fetchDataFn={async (params) => {
        const result = await fetchBrandsService(params);
        return {
          content: result.content,
          last: !!result.last,
          pageNo: result.pageNo || 1
        };
      }}
      placeholder="Select brand..."
      searchPlaceholder="Search brand..."
      emptyMessage="No brand found."
      labelKey="name"
      valueKey="id"
      disabled={disabled}
    />
  );
}
