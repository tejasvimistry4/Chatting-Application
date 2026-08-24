import api from "./axios";
import { API_ENDPOINTS } from "./endpoints";

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
  };
}

export const uploadFileApi = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<UploadResponse>(
    API_ENDPOINTS.uploads.create,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
