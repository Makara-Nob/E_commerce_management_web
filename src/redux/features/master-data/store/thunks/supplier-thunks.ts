import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  fetchSuppliersService, 
  createSupplierService, 
  updateSupplierService, 
  deleteSupplierService 
} from "@/services/dashboard/supplier/supplier.service";
import { SupplierFetchRequest, SupplierModel } from "@/models/dashboard/master-data/supplier/supplier.model";

export const fetchAllSuppliers = createAsyncThunk(
  "suppliers/fetchAll",
  async (params: SupplierFetchRequest, { rejectWithValue }) => {
    try {
      return await fetchSuppliersService(params);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch suppliers");
    }
  }
);

export const createSupplier = createAsyncThunk(
  "suppliers/create",
  async (data: Partial<SupplierModel>, { rejectWithValue }) => {
    try {
      return await createSupplierService(data);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create supplier");
    }
  }
);

export const updateSupplier = createAsyncThunk(
  "suppliers/update",
  async ({ id, data }: { id: string | number; data: Partial<SupplierModel> }, { rejectWithValue }) => {
    try {
      return await updateSupplierService(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update supplier");
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "suppliers/delete",
  async (id: string | number, { rejectWithValue }) => {
    try {
      await deleteSupplierService(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete supplier");
    }
  }
);
