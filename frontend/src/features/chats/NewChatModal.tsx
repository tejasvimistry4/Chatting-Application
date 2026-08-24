import { useState } from "react";
import { X, Search } from "lucide-react";
import Avatar from "../../components/common/Avatar/Avatar";
import { useUserSearch } from "../../hooks/useUserSearch";
import {
  createPrivateChat,
  createGroupChat,
} from "../../services/chat.service";
import { Chat } from "../../types/chat";
import { User } from "../../types/auth";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onChatCreated: (chat: Chat) => void;
}

type Mode = "private" | "group";

const NewChatModal = ({ open, onClose, onChatCreated }: Props) => {
  const [mode, setMode] = useState<Mode>("private");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const { users, loading: searchLoading } = useUserSearch(search);

  if (!open) {
    return null;
  }

  const reset = () => {
    setSearch("");
    setSelectedUsers([]);
    setGroupName("");
    setMode("private");
  };

  const handleClose = () => {
    if (loading) {
      return;
    }
    reset();
    onClose();
  };

  const selectUser = (user: User) => {
    if (mode === "private") {
      setSelectedUsers([user]);
      return;
    }

    const exists = selectedUsers.some((item) => item.id === user.id);
    if (exists) {
      setSelectedUsers(selectedUsers.filter((item) => item.id !== user.id));
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleCreate = async () => {
    if (mode === "private" && selectedUsers.length !== 1) {
      showErrorToast("Select a user first.");
      return;
    }

    if (mode === "group" && !groupName.trim()) {
      showErrorToast("Enter a group name.");
      return;
    }
    if (mode === "group" && selectedUsers.length < 1) {
      showErrorToast("Select at least one member.");
      return;
    }
    try {
      setLoading(true);

      let response;

      if (mode === "private") {
        response = await createPrivateChat({
          userId: selectedUsers[0].id,
        });
      } else {
        response = await createGroupChat({
          name: groupName.trim(),
          members: selectedUsers.map((user) => user.id),
        });
      }

      const chat = response.data;

      onChatCreated(chat);

      showSuccessToast(
        mode === "private"
          ? "Chat created successfully."
          : "Group created successfully.",
      );

      reset();
      onClose();
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || "Unable to create chat.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              New conversation
            </h2>

            <p className="text-xs text-gray-500">
              Start a private or group chat
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => {
              setMode("private");
              setSelectedUsers([]);
            }}
            className={`
              flex-1 px-4 py-3 text-sm font-medium
              ${
                mode === "private"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }
            `}
          >
            Private
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("group");
              setSelectedUsers([]);
            }}
            className={`
              flex-1 px-4 py-3 text-sm font-medium
              ${
                mode === "group"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }
            `}
          >
            Group
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {mode === "group" && (
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Group name
              </label>

              <input
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder="e.g. Development Team"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search people..."
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {selectedUsers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => selectUser(user)}
                  className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                >
                  <Avatar name={user.fullName} src={user.avatar} size="sm" />

                  {user.fullName}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 space-y-1">
            {searchLoading && (
              <div className="py-8 text-center text-sm text-gray-500">
                Searching...
              </div>
            )}

            {!searchLoading && search.trim().length < 2 && (
              <div className="py-8 text-center text-sm text-gray-500">
                Search by name or email
              </div>
            )}

            {!searchLoading &&
              search.trim().length >= 2 &&
              users.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-500">
                  No users found
                </div>
              )}

            {!searchLoading &&
              users.map((user) => {
                const selected = selectedUsers.some(
                  (item) => item.id === user.id,
                );

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => selectUser(user)}
                    className={`
                      flex w-full items-center gap-3
                      rounded-xl p-3 text-left
                      transition
                      ${selected ? "bg-blue-50" : "hover:bg-gray-50"}
                    `}
                  >
                    <Avatar name={user.fullName} src={user.avatar} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user.fullName}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    {mode === "group" && (
                      <div
                        className={`
                          flex h-5 w-5
                          items-center justify-center
                          rounded-md border
                          ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300"
                          }
                        `}
                      >
                        {selected && "✓"}
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 p-5">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : mode === "private"
                ? "Start chat"
                : "Create group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
