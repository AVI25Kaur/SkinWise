
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";

const AuthContext = createContext(null);

const DEFAULT_API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development"
    ? `http://${window.location.hostname}:5000/api`
    : "https://skinwise-backend.onrender.com/api");

const TOKEN_KEY = "skinwise_auth_token";

// Resilient backend fetch helper
const apiFetch = async (endpoint, options = {}) => {
  const baseUrls = [
    DEFAULT_API_URL,
    DEFAULT_API_URL.includes("localhost")
      ? DEFAULT_API_URL.replace("localhost", "127.0.0.1")
      : DEFAULT_API_URL.replace("127.0.0.1", "localhost")
  ];

  let lastError = null;

  for (const url of [...new Set(baseUrls)]) {
    try {
      return await fetch(`${url}${endpoint}`, options);
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    lastError?.message ||
    "Unable to connect to the authentication server. Please check your backend URL."
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore an existing session
  const loadUserFromToken = useCallback(async (existingToken) => {
    try {
      const response = await apiFetch("/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${existingToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Session expired or invalid");
      }

      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        setToken(existingToken);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        throw new Error("User verification failed");
      }
    } catch (err) {
      console.warn("Unable to restore session:", err.message);

      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (savedToken) {
      loadUserFromToken(savedToken);
    } else {
      setLoading(false);
    }
  }, [loadUserFromToken]);

  // Signup
  const signup = async (name, email, password, confirmPassword) => {
    setAuthError(null);

    try {
      const response = await apiFetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create account.");
      }

      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      }

      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Login
  const login = async (email, password) => {
    setAuthError(null);

    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }

      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      }

      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    authError,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
