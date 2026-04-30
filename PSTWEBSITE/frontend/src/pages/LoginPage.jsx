import api from "../api/axios";
import { saveToken, saveUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
    return;
  }
  try {
    const res = await api.post("/users/login", { username, password });
    const { token, user } = res.data;
      if (token) {
        saveToken(token);
        saveUser(user);
        setError("");
        navigate("/dashboard", { replace: true });
    } else {
      setError("Login failed: no token returned");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Invalid username or password");
  }
  };

  return (
     <div className="min-h-screen flex justify-center items-center  font-sans text-gray-800 p-4">
      
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-[400px] border-[#2c3b5e] border-1 text-center mx-4 relative overflow-hidden">
        {/* Accent Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-5 text-[#2c3b5e] hover:text-[#1a2542] transition-colors"
          aria-label="Back to main page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        <h2 className="text-2xl font-black text-[#1a2542] uppercase tracking-tight mb-2 mt-2">
          Professor Login
        </h2>
        <p className="text-sm text-gray-500 font-medium mb-8">Please enter your details to sign in.</p>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 p-3 mb-6 rounded-lg text-sm font-semibold shadow-sm">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="text-left">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 ml-1">Username</label>
            <input
              type="text"
              placeholder="Input your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#2c3b5e] focus:ring-2 focus:ring-[#2c3b5e]/20 transition-all font-medium"
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#2c3b5e] focus:ring-2 focus:ring-[#2c3b5e]/20 transition-all font-medium"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#2c3b5e] hover:bg-[#1a2542] text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm tracking-wide uppercase flex justify-center items-center gap-2"
        >
          Login
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

      </div>
      
    </div>
  );
}

export default Login;