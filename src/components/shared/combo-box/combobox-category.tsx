"use client";

import { CategoryModel } from "@/models/dashboard/master-data/category/category.model";
import { fetchCategoriesService } from "@/services/dashboard/category/category.service";
import { AsyncCombobox } from "./async-combobox";

interface ComboboxCategoryProps {
  value: CategoryModel | null;
  onSelect: (item: CategoryModel | null) => void;
  disabled?: boolean;
}

export function ComboboxCategory({
  value,
  onSelect,
  disabled
}: ComboboxCategoryProps) {
  return (
    <AsyncCombobox<CategoryModel>
      value={value}
      onSelect={onSelect}
      fetchDataFn={async (params) => {
        const result = await fetchCategoriesService(params);
        return {
          content: result.content,
          last: !!result.last,
          pageNo: result.pageNo || 1
        };
      }}
      placeholder="Select category..."
      searchPlaceholder="Search category..."
      emptyMessage="No category found."
      labelKey="name"
      valueKey="id"
      disabled={disabled}
    />
  );
}
