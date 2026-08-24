import { FormEvent, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";

import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { AUTH_MESSAGES } from "../../constants/messages";

import { registerSchema } from "../../validations/auth.schema";
import { useAppDispatch } from "../../redux/store";
import { registerThunk } from "../../redux/auth/authThunk";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    const validation = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const message =
        validation.error.issues[0]?.message || "Please check your details.";

      setError(message);
      showErrorToast(message);

      return;
    }

    try {
      setLoading(true);

      const result = await dispatch(
        registerThunk({
          fullName,
          email,
          password,
        }),
      ).unwrap();

      showSuccessToast(AUTH_MESSAGES.REGISTER_SUCCESS);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || AUTH_MESSAGES.REGISTER_FAILED;

      setError(message);

      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>

          <p className="mt-2 text-sm text-gray-500">Join the conversation</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="John Doe"
            autoComplete="name"
            required
          />

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
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            required
          />

          <Input
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
          />

          <div className="pt-2">
            <Button type="submit" loading={loading}>
              Create account
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
