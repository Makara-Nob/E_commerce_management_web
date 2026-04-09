import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  fetchBrandsService, 
  createBrandService, 
  updateBrandService, 
  deleteBrandService 
} from "@/services/dashboard/brand/brand.service";
import { BrandFetchRequest, BrandModel } from "@/models/dashboard/master-data/brand/brand.model";

export const fetchAllBrands = createAsyncThunk(
  "brands/fetchAll",
  async (params: BrandFetchRequest, { rejectWithValue }) => {
    try {
      return await fetchBrandsService(params);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch brands");
    }
  }
);

export const createBrand = createAsyncThunk(
  "brands/create",
  async (data: Partial<BrandModel>, { rejectWithValue }) => {
    try {
      return await createBrandService(data);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create brand");
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brands/update",
  async ({ id, data }: { id: string | number; data: Partial<BrandModel> }, { rejectWithValue }) => {
    try {
      return await updateBrandService(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update brand");
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brands/delete",
  async (id: string | number, { rejectWithValue }) => {
    try {
      await deleteBrandService(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete brand");
    }
  }
);
