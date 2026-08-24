import api from "./axios";
import { API_ENDPOINTS } from "./endpoints";
import { Message, MessagesResponse } from "../types/message";

export interface GetMessagesParams {
  page?: number;
  limit?: number;
}

export const getMessagesApi = async (
  chatId: string,
  params?: GetMessagesParams,
) => {
  const response = await api.get<{
    success: boolean;
    data: MessagesResponse | Message[];
  }>(API_ENDPOINTS.messages.list(chatId), {
    params,
  });

  return response.data;
};
