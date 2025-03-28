import React, { useState, useEffect } from "react";
import { auth, googleProvider, githubProvider } from "../context/FirebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setIsPanelOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsPanelOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={togglePanel}
        className="fixed top-6 right-6 w-12 h-12 bg-blue-950 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 transition-colors z-50"
      >
        {user ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>

      {isPanelOpen && (
        <div className="absolute top-20 right-6 w-80 bg-white rounded-lg shadow-xl p-6 z-40 animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-blue-950 text-center">
            Welcome to Video Call App
          </h2>

          {user ? (
            <div className="text-center">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="mb-2 font-medium">Welcome, {user.displayName}!</p>
              <p className="mb-4 text-gray-600 text-sm">{user.email}</p>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors w-full"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-gray-600">Please login to continue</p>
              
              {/* Google Login */}
              <button
                onClick={() => handleLogin(googleProvider)}
                className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-full mx-auto mb-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Login with Google
              </button>

              {/* GitHub Login */}
              <button
                onClick={() => handleLogin(githubProvider)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 w-full mx-auto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.34.727-4.042-1.61-4.042-1.61-.546-1.387-1.332-1.757-1.332-1.757-1.086-.744.084-.729.084-.729 1.205.086 1.84 1.235 1.84 1.235 1.067 1.833 2.805 1.303 3.49.996.108-.773.417-1.303.76-1.603-2.665-.303-5.466-1.333-5.466-5.932 0-1.31.47-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.292-1.552 3.3-1.23 3.3-1.23.652 1.653.24 2.873.117 3.176.765.84 1.235 1.91 1.235 3.22 0 4.608-2.805 5.625-5.475 5.922.428.368.81 1.096.81 2.215 0 1.6-.015 2.887-.015 3.282 0 .322.217.695.825.578C20.565 22.092 24 17.592 24 12c0-6.627-5.373-12-12-12"
                  />
                </svg>
                Login with GitHub
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
