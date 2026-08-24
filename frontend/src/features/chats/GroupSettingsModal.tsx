import { UserPlus, Trash2, UserMinus, LogOut, Pencil, X } from "lucide-react";

import { useState } from "react";

import Avatar from "../../components/common/Avatar/Avatar";

import { Chat } from "../../types/chat";
import { User } from "../../types/auth";

import { useUserSearch } from "../../hooks/useUserSearch";

import {
  addGroupMembers,
  deleteGroup,
  leaveGroup,
  removeGroupMember,
  renameGroup,
} from "../../services/chat.service";

import { showErrorToast, showSuccessToast } from "../../utils/toast";

interface Props {
  open: boolean;
  chat: Chat;
  currentUserId: string;
  onClose: () => void;
  onChatUpdated: () => void;
  onGroupRemoved: () => void;
}

const GroupSettingsModal = ({
  open,
  chat,
  currentUserId,
  onClose,
  onChatUpdated,
  onGroupRemoved,
}: Props) => {
  const [editingName, setEditingName] = useState(false);

  const [groupName, setGroupName] = useState(chat.name || "");

  const [addingMembers, setAddingMembers] = useState(false);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const { users, loading: searchLoading } = useUserSearch(search);

  if (!open) {
    return null;
  }

  const currentMember = chat.members.find(
    (member) => member.userId === currentUserId,
  );

  const isAdmin = !!currentMember?.isAdmin;

  const isCreator = chat.createdBy === currentUserId;

  const existingMemberIds = new Set(
    chat.members.map((member) => member.userId),
  );

  const availableUsers = users.filter(
    (user) => !existingMemberIds.has(user.id),
  );

  const handleRename = async () => {
    if (!groupName.trim()) {
      showErrorToast("Group name is required.");
      return;
    }

    try {
      setLoading(true);

      await renameGroup(chat.id, groupName.trim());

      onChatUpdated();

      setEditingName(false);

      showSuccessToast("Group renamed successfully.");
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Unable to rename group.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (user: User) => {
    try {
      setLoading(true);

      await addGroupMembers(chat.id, [user.id]);

      showSuccessToast(`${user.fullName} added to the group.`);

      setSearch("");

      onChatUpdated();
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Unable to add member.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const member = chat.members.find((item) => item.userId === memberId);

    if (!member) {
      return;
    }

    const confirmed = window.confirm(
      `Remove ${member.user.fullName} from this group?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await removeGroupMember(chat.id, memberId);

      showSuccessToast(`${member.user.fullName} removed.`);

      onChatUpdated();
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Unable to remove member.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to leave "${chat.name || "this group"}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await leaveGroup(chat.id);

      showSuccessToast("You left the group.");

      onGroupRemoved();
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Unable to leave group.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${chat.name || "this group"}" permanently?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await deleteGroup(chat.id);

      showSuccessToast("Group deleted.");

      onGroupRemoved();
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Unable to delete group.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Group settings
            </h2>

            <p className="text-xs text-gray-500">
              Manage group members and settings
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {/* Group name */}

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Group name</p>

              {isAdmin && !editingName && (
                <button
                  type="button"
                  onClick={() => {
                    setGroupName(chat.name || "");
                    setEditingName(true);
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <Pencil size={13} />
                  Edit
                </button>
              )}
            </div>

            {editingName ? (
              <div className="flex gap-2">
                <input
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  autoFocus
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleRename}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {chat.name || "Unnamed group"}
              </div>
            )}
          </div>

          {/* Members */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                Members ({chat.members.length})
              </p>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setAddingMembers((value) => !value)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                >
                  <UserPlus size={14} />
                  Add members
                </button>
              )}
            </div>

            {/* Add member search */}

            {addingMembers && isAdmin && (
              <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search people..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

                {search.trim().length >= 2 && (
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {searchLoading && (
                      <p className="py-3 text-center text-xs text-gray-500">
                        Searching...
                      </p>
                    )}

                    {!searchLoading &&
                      availableUsers.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          disabled={loading}
                          onClick={() => handleAddMember(user)}
                          className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white disabled:opacity-50"
                        >
                          <Avatar
                            name={user.fullName}
                            src={user.avatar}
                            size="sm"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {user.fullName}
                            </p>

                            <p className="truncate text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>

                          <UserPlus size={16} className="text-blue-600" />
                        </button>
                      ))}

                    {!searchLoading && availableUsers.length === 0 && (
                      <p className="py-3 text-center text-xs text-gray-500">
                        No available users found.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Member list */}

            <div className="space-y-1">
              {chat.members.map((member) => {
                const isCurrentUser = member.userId === currentUserId;

                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50"
                  >
                    <Avatar
                      name={member.user.fullName}
                      src={member.user.avatar}
                      size="sm"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {member.user.fullName}
                        {isCurrentUser && (
                          <span className="ml-1 text-xs text-gray-400">
                            (You)
                          </span>
                        )}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {member.user.email}
                      </p>
                    </div>

                    {member.isAdmin && (
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600">
                        Admin
                      </span>
                    )}

                    {isAdmin && !isCurrentUser && !member.isAdmin && (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleRemoveMember(member.userId)}
                        title="Remove member"
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <UserMinus size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}

          <div className="mt-6 border-t border-gray-200 pt-5">
            <button
              type="button"
              disabled={loading}
              onClick={handleLeave}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 disabled:opacity-50"
            >
              <LogOut size={17} />
              Leave group
            </button>

            {isCreator && (
              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={17} />
                Delete group
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;
