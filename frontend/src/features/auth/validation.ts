export const validateLogin = (email: string, password: string) => {
  const errors: {
    email?: string;
    password?: string;
  } = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

export const validateRegister = (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  const errors: Record<string, string> = {};

  if (!fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
