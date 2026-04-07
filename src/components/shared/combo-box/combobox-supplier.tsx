"use client";

import { SupplierModel } from "@/models/dashboard/master-data/supplier/supplier.model";
import { fetchSuppliersService } from "@/services/dashboard/supplier/supplier.service";
import { AsyncCombobox } from "./async-combobox";

interface ComboboxSupplierProps {
  value: SupplierModel | null;
  onSelect: (item: SupplierModel | null) => void;
  disabled?: boolean;
}

export function ComboboxSupplier({
  value,
  onSelect,
  disabled
}: ComboboxSupplierProps) {
  return (
    <AsyncCombobox<SupplierModel>
      value={value}
      onSelect={onSelect}
      fetchDataFn={async (params) => {
        const result = await fetchSuppliersService(params);
        return {
          content: result.content,
          last: !!result.last,
          pageNo: result.pageNo || 1
        };
      }}
      placeholder="Select supplier..."
      searchPlaceholder="Search supplier..."
      emptyMessage="No supplier found."
      labelKey="name"
      valueKey="id"
      disabled={disabled}
    />
  );
}
