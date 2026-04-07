import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  fetchCategoriesService, 
  createCategoryService, 
  updateCategoryService, 
  deleteCategoryService 
} from "@/services/dashboard/category/category.service";
import { 
  CategoryFetchRequest, 
  CategoryRequest 
} from "@/models/dashboard/master-data/category/category.model";

export const fetchAllCategories = createAsyncThunk(
  "category/fetchAll",
  async (params: CategoryFetchRequest, { rejectWithValue }) => {
    try {
      return await fetchCategoriesService(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/create",
  async (data: CategoryRequest, { rejectWithValue }) => {
    try {
      return await createCategoryService(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create category");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, data }: { id: string; data: CategoryRequest }, { rejectWithValue }) => {
    try {
      return await updateCategoryService(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update category");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteCategoryService(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete category");
    }
  }
);
