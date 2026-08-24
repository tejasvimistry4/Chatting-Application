import { getMessagesApi, GetMessagesParams } from "../api/message.api";

export const getMessages = async (
  chatId: string,
  params?: GetMessagesParams,
) => {
  return getMessagesApi(chatId, params);
};
