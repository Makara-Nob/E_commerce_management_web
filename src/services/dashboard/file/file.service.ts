import { axiosClientWithAuth } from "@/utils/axios";

export interface FileUploadResponse {
  message: string;
  url: string;
}

/**
 * Reusable file upload service.
 * @param file The file object to upload.
 * @param folder Optional subfolder path (e.g., 'categories', 'products').
 * @returns Promise with the relative URL of the uploaded file.
 */
export async function uploadFileService(
  file: File,
  folder: string = ""
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosClientWithAuth.post(
    `/api/v1/admin/files/upload${folder ? `?folder=${folder}` : ""}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
}
