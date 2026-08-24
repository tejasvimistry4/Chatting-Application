import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-blue-600">
                C
              </div>

              <span className="text-2xl font-bold text-white">ChatApp</span>
            </div>
          </div>

          <div className="max-w-lg">
            <h1 className="text-5xl font-bold leading-tight text-white">
              Connect.
              <br />
              Chat.
              <br />
              Stay connected.
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              A real-time messaging experience built for simple, fast and
              reliable communication.
            </p>
          </div>

          <p className="text-sm text-blue-100">© 2026 ChatApp</p>
        </div>

        <div className="flex items-center justify-center bg-white px-6 py-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
