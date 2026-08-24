import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";

import { showErrorToast, showSuccessToast } from "../../utils/toast";

import { AUTH_MESSAGES } from "../../constants/messages";
import { useAppDispatch } from "../../redux/store";
import { loginThunk } from "../../redux/auth/authThunk";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      const result = await dispatch(
        loginThunk({
          email,
          password,
        }),
      ).unwrap();

      showSuccessToast(AUTH_MESSAGES.LOGIN_SUCCESS);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      const message =
        typeof error === "string" ? error : AUTH_MESSAGES.LOGIN_FAILED;

      setError(message);

      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue chatting
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          <Button type="submit" loading={loading}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
