import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, AlertCircle } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, companyName);
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Google login failed.");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-primary px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-secondary p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-textmain">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-2 text-textmuted">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Sign up to start trading industrial waste"}
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded bg-red-500/10 p-3 text-red-400 border border-red-500/20">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-1 block text-sm font-medium text-textmain">Company / Username</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="block w-full rounded border border-gray-700 bg-primary py-2 pl-10 pr-3 text-textmain placeholder-gray-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm"
                  placeholder="Green Recycling Ltd"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-textmain">Email Address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded border border-gray-700 bg-primary py-2 pl-10 pr-3 text-textmain placeholder-gray-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-textmain">Password</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded border border-gray-700 bg-primary py-2 pl-10 pr-3 text-textmain placeholder-gray-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-accent px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-orange-500 focus:outline-none disabled:opacity-70"
          >
            {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-secondary px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-3 rounded border border-gray-700 bg-primary px-4 py-2 text-sm font-medium text-textmain transition-colors hover:bg-gray-800 focus:outline-none"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-textmuted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-accent hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
