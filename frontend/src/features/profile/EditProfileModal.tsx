import { ChangeEvent, useEffect, useState } from "react";
import { Camera, Loader2, Save, Trash2, X } from "lucide-react";
import Avatar from "../../components/common/Avatar/Avatar";
import { User } from "../../types/auth";
import { updateProfile } from "../../services/auth.service";
import { uploadFile } from "../../services/upload.service";
import { useAppDispatch } from "../../redux/store";
import { updateUser } from "../../redux/auth/authSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

const EditProfileModal = ({ open, user, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !user) {
      return;
    }

    setFullName(user.fullName || "");
    setAvatar(user.avatar || null);
  }, [open, user]);

  if (!open || !user) {
    return null;
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showErrorToast("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showErrorToast("Image must be smaller than 5MB.");
      return;
    }

    try {
      setUploading(true);
      const uploaded = await uploadFile(file);
      setAvatar(uploaded.url);
      showSuccessToast("Image uploaded.");
    } catch (error: any) {
      console.error("Avatar upload failed:", error);
      showErrorToast(
        error?.response?.data?.message || "Unable to upload image.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  const handleSave = async () => {
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      showErrorToast("Full name is required.");
      return;
    }
    if (trimmedName.length < 2) {
      showErrorToast("Full name must contain at least 2 characters.");
      return;
    }

    try {
      setSaving(true);

      const updatedUser = await updateProfile({
        fullName: trimmedName,
        avatar,
      });

      dispatch(updateUser(updatedUser));
      showSuccessToast("Profile updated successfully.");
      onClose();
    } catch (error: any) {
      console.error("Profile update failed:", error);

      showErrorToast(
        error?.response?.data?.message || "Unable to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Profile
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Update your name and profile photo
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving || uploading}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar name={fullName} src={avatar} size="lg" />

              <label
                htmlFor="profile-avatar"
                className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
              >
                {uploading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Camera size={17} />
                )}
              </label>

              <input
                id="profile-avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading || saving}
              />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <label
                htmlFor="profile-avatar"
                className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Change photo
              </label>

              {avatar && (
                <>
                  <span className="text-gray-300">•</span>

                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={uploading || saving}
                    className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-400">
              JPG, PNG or other image • Max 5MB
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="profile-full-name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full name
            </label>

            <input
              id="profile-full-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              disabled={saving}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Email address cannot be changed here.
            </p>
          </div>
        </div>
                
        <div className="flex gap-3 border-t border-gray-200 p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={saving || uploading}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
