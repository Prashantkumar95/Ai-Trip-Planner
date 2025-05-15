import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
// import { auth, GoogleAuthProvider, signInWithCredential } from "./firebase/store; // Make sure you have firebase configured
// import { toast } from "react-hot-toast";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

const getEmailInitials = (email) => {
  if (!email) return "";
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  const initials = parts
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
  return initials;
};

const Header = () => {
  const [user, setUser] = useState(null);
  const [showGoogleSignIn, setShowGoogleSignIn] = useState(false);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      const credential = GoogleAuthProvider.credential(credentialResponse.credential);
      const userCredential = await signInWithCredential(auth, credential);

      const userData = {
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
        uid: userCredential.user.uid
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setShowGoogleSignIn(false);
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Error during Google auth:", error);
      toast.error(`Login failed: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <div className="p-2 shadow-sm flex justify-between items-center px-5 bg-white">
      {/* Logo */}
      <img src="/sarthi.png" alt="Logo" className="h-10" />

      {/* Right-side controls */}
      <div className="flex items-center gap-4 relative">
        {user ? (
          <>
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full">
                + Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button variant="outline" className="rounded-full">
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700 transition-colors">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    getEmailInitials(user.email)
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-48 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  {user.picture && (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="mt-2 w-full"
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
              className="rounded-full"
            >
              Sign In
            </Button>

            {showGoogleSignIn && (
              <div className="absolute top-12 right-0 z-50 bg-white p-4 rounded-lg shadow-lg border">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => {
                    toast.error("Google login failed");
                    setShowGoogleSignIn(false);
                  }}
                  useOneTap
                  auto_select
                  theme="filled_blue"
                  size="medium"
                  text="signin_with"
                  shape="pill"
                />
                <Button
                  variant="ghost"
                  className="w-full mt-2"
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