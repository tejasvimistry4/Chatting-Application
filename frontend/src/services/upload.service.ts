import { uploadFileApi } from "../api/upload.api";

export const uploadFile = async (file: File) => {
  const response = await uploadFileApi(file);

  return response.data;
};
