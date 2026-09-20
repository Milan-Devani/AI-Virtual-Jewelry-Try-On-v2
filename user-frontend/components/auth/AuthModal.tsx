"use client";

import * as React from "react";
import { Modal } from "../ui/dialog";
import { Button } from "../ui/button";
import { loginApi, registerApi } from "../../services/api";
import { toast } from "sonner";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialMode?: "login" | "register";
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function AuthModal({ isOpen, onClose, onSuccess, initialMode = "login" }: AuthModalProps) {
  const [isRegister, setIsRegister] = React.useState(initialMode === "register");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordTouched, setPasswordTouched] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [confirmPasswordTouched, setConfirmPasswordTouched] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const resetForm = React.useCallback(() => {
    setPassword("");
    setConfirmPassword("");
    setEmailTouched(false);
    setPasswordTouched(false);
    setConfirmPasswordTouched(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  // Sync mode when modal opens or initialMode changes
  React.useEffect(() => {
    if (isOpen) {
      setIsRegister(initialMode === "register");
      resetForm();
    } else {
      resetForm();
    }
  }, [isOpen, initialMode, resetForm]);

  // Email validation state
  const cleanEmail = email.trim().toLowerCase();
  const isEmailValid = cleanEmail.length > 0 && EMAIL_REGEX.test(cleanEmail);
  const showEmailError = emailTouched && (!cleanEmail || !isEmailValid);

  // Password match validation
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const showPasswordMismatch = isRegister && confirmPasswordTouched && confirmPassword.length > 0 && !passwordsMatch;

  // Reset form when switching mode
  const toggleMode = (registerMode: boolean) => {
    setIsRegister(registerMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    if (isRegister) setConfirmPasswordTouched(true);

    if (!cleanEmail) {
      toast.error("Please enter your Gmail / email address.");
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      toast.error("Please enter a valid email address (e.g., you@gmail.com).");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (isRegister) {
      const cleanFirstName = firstName.trim();
      const cleanLastName = lastName.trim();
      const cleanPhone = phoneNumber.trim();

      if (!cleanFirstName) {
        toast.error("Please enter your first name.");
        return;
      }

      if (!cleanLastName) {
        toast.error("Please enter your last name.");
        return;
      }

      if (!cleanPhone) {
        toast.error("Please enter your phone number.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match. Please verify and re-enter.");
        return;
      }

      try {
        setIsLoading(true);
        const data = await registerApi({
          email: cleanEmail,
          password,
          firstName: cleanFirstName,
          lastName: cleanLastName,
          phoneNumber: cleanPhone,
          name: `${cleanFirstName} ${cleanLastName}`,
        });

        toast.success("Account created successfully! Welcome to JEWELAI.");
        onSuccess(data.user);
        resetForm();
        onClose();
      } catch (err: any) {
        toast.error(err.message || "Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign In mode
      try {
        setIsLoading(true);
        const data = await loginApi({ email: cleanEmail, password });
        toast.success("Welcome back to JEWELAI!");
        onSuccess(data.user);
        resetForm();
        onClose();
      } catch (err: any) {
        toast.error(err.message || "Authentication failed. Please check your credentials.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRegister ? "Create JEWELAI Account" : "Sign In to JEWELAI"}
      description={
        isRegister
          ? "Join luxury jewelry brands and stylists generating hyper-realistic virtual try-ons."
          : "Access your membership credits, try-on studio, and payment history."
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 pt-1" noValidate>
        {isRegister && (
          <>
            {/* First Name & Last Name in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A534B] uppercase tracking-wider mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#E2DBD1] text-sm text-[#2A2622] placeholder:text-[#A89F95] focus:outline-none focus:ring-2 focus:ring-[#D8B77E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A534B] uppercase tracking-wider mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vance"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#E2DBD1] text-sm text-[#2A2622] placeholder:text-[#A89F95] focus:outline-none focus:ring-2 focus:ring-[#D8B77E]"
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-[#5A534B] uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#E2DBD1] text-sm text-[#2A2622] placeholder:text-[#A89F95] focus:outline-none focus:ring-2 focus:ring-[#D8B77E]"
                />
              </div>
            </div>
          </>
        )}

        {/* Gmail / Email Address (With real-time & on-blur validation for both Sign In & Sign Up) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-[#5A534B] uppercase tracking-wider">
              Gmail / Email Address
            </label>
            {emailTouched && cleanEmail.length > 0 && (
              <span
                className={`text-[11px] font-medium ${
                  isEmailValid ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {isEmailValid ? "Valid email format" : "Invalid email"}
              </span>
            )}
          </div>

          <div className="relative">
            <Mail
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                showEmailError ? "text-rose-400" : "text-[#8C827A]"
              }`}
            />
            <input
              type="email"
              placeholder="you@gmail.com"
              required
              value={email}
              onBlur={() => setEmailTouched(true)}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!emailTouched && e.target.value.includes("@")) {
                  setEmailTouched(true);
                }
              }}
              className={`w-full pl-9 pr-9 py-2 rounded-lg bg-white border text-sm text-[#2A2622] placeholder:text-[#A89F95] transition-all focus:outline-none focus:ring-2 ${
                showEmailError
                  ? "border-rose-300 bg-rose-50/20 focus:border-rose-400 focus:ring-rose-200"
                  : emailTouched && isEmailValid
                  ? "border-emerald-400/80 focus:ring-emerald-200"
                  : "border-[#E2DBD1] focus:ring-[#D8B77E]"
              }`}
            />
            {emailTouched && cleanEmail.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {isEmailValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in zoom-in-50 duration-150" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 animate-in zoom-in-50 duration-150" />
                )}
              </div>
            )}
          </div>

          {showEmailError && (
            <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {!cleanEmail
                  ? "Email address is required."
                  : "Please enter a valid email address (e.g., name@gmail.com)."}
              </span>
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-[#5A534B] uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="•••••••• (min. 6 characters)"
              required
              value={password}
              onBlur={() => setPasswordTouched(true)}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2 rounded-lg bg-white border border-[#E2DBD1] text-sm text-[#2A2622] placeholder:text-[#A89F95] focus:outline-none focus:ring-2 focus:ring-[#D8B77E]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#2A2622] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password (Register mode only) */}
        {isRegister && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#5A534B] uppercase tracking-wider">
                Confirm Password
              </label>
              {confirmPasswordTouched && confirmPassword.length > 0 && (
                <span
                  className={`text-[11px] font-medium ${
                    passwordsMatch ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {passwordsMatch ? "Passwords match" : "Mismatch"}
                </span>
              )}
            </div>

            <div className="relative">
              <Lock
                className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                  showPasswordMismatch ? "text-rose-400" : "text-[#8C827A]"
                }`}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="•••••••• (repeat password)"
                required
                value={confirmPassword}
                onBlur={() => setConfirmPasswordTouched(true)}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-9 pr-10 py-2 rounded-lg bg-white border text-sm text-[#2A2622] placeholder:text-[#A89F95] transition-all focus:outline-none focus:ring-2 ${
                  showPasswordMismatch
                    ? "border-rose-300 bg-rose-50/20 focus:border-rose-400 focus:ring-rose-200"
                    : confirmPasswordTouched && passwordsMatch
                    ? "border-emerald-400/80 focus:ring-emerald-200"
                    : "border-[#E2DBD1] focus:ring-[#D8B77E]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#2A2622] transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {showPasswordMismatch && (
              <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Passwords do not match. Please verify and re-enter.</span>
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1A1715] hover:bg-[#2A2622] text-[#FBF9F5] py-2.5 font-medium flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#D8B77E]" />
              <span>{isRegister ? "Create JEWELAI Account" : "Sign In"}</span>
            </>
          )}
        </Button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => toggleMode(!isRegister)}
            className="text-xs text-[#8C6428] hover:underline font-medium"
          >
            {isRegister
              ? "Already have an account? Sign in here"
              : "Don't have an account? Create one"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
