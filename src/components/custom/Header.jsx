import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

const getEmailInitials = (email) => {
  if (!email) return "";
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  return parts
    .map((p) => p.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

const Header = () => {
  const [user, setUser] = useState(null);
  const [showGoogleSignIn, setShowGoogleSignIn] = useState(false);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      const credential = GoogleAuthProvider.credential(
        credentialResponse.credential,
      );
      const userCredential = await signInWithCredential(auth, credential);

      const userData = {
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
        uid: userCredential.user.uid,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setShowGoogleSignIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
  }, []);

  return (
    <div className="p-2 px-5 flex justify-between items-center bg-[#0f0f0f] border-b border-gray-800 shadow-md">
      {/* Logo */}
      <img src="/sarthi.png" alt="Logo" className="h-10" />

      {/* Right Side */}
      <div className="flex items-center gap-4 relative text-white">
        {user ? (
          <>
            <a href="/create-trip">
              <Button className="rounded-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700">
                + Create Trip
              </Button>
            </a>

            <a href="/my-trips">
              <Button className="rounded-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700">
                My Trips
              </Button>
            </a>

            <Popover>
              <PopoverTrigger>
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-800 text-white font-bold cursor-pointer border border-gray-700 hover:bg-gray-700 transition">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    getEmailInitials(user.email)
                  )}
                </div>
              </PopoverTrigger>

              <PopoverContent className="w-52 bg-[#1a1a1a] text-white border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  {user.picture && (
                    <img src={user.picture} className="h-8 w-8 rounded-full" />
                  )}
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <>
            <Button
              onClick={() => setShowGoogleSignIn(true)}
              className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md"
            >
              Sign In
            </Button>

            {showGoogleSignIn && (
              <div className="absolute top-12 right-0 z-50 bg-[#1a1a1a] p-4 rounded-lg shadow-lg border border-gray-700">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => setShowGoogleSignIn(false)}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                />

                <Button
                  variant="ghost"
                  className="w-full mt-2 text-white hover:bg-gray-800"
                  onClick={() => setShowGoogleSignIn(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
