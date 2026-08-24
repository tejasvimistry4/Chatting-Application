import { LogOut, MessageCircle, Pencil, UserCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { logout } from "../../../redux/auth/authSlice";
import { disconnectSocket } from "../../../socket/socket";
import EditProfileModal from "../../../features/profile/EditProfileModal";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    disconnectSocket();
    dispatch(logout());

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <MessageCircle size={20} />
          </div>

          <div>
            <h1 className="text-base font-bold text-gray-900">Chat App</h1>
            <p className="hidden text-xs text-gray-500 sm:block">
              Real-time messaging
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
            title="Edit profile"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-gray-500">{user?.email || ""}</p>
            </div>

            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName || "User"}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-blue-100"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 ring-2 ring-transparent transition group-hover:ring-blue-100">
                  <UserCircle size={22} />
                </div>
              )}

              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white">
                <Pencil size={8} />
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />

            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      <EditProfileModal
        open={profileOpen}
        user={user}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
};

export default Header;
