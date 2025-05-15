import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelecteTravelList
} from "@/constants/options";
import { chatSession } from "@/service/AIMODAL";
import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db,auth } from "@/service/firebaseConfig";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    destination: null,
    noOfDays: "",
    budget: null,
    travelGroup: null
  });

  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Firestore listener to debug trips
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "AITrips"), (snapshot) => {
      console.log(
        "Current trips in database:",
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  const handlePlaceSelect = (place) => {
    setFormData({ ...formData, destination: place });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBudgetSelect = (budget) => {
    setFormData({ ...formData, budget });
  };

  const handleTravelGroupSelect = (group) => {
    setFormData({ ...formData, travelGroup: group });
  };

  const handleLoginSuccess = async (credentialResponse) => {
  try {
    // Remove these lines:
    // const {jwtDecode} = jwtDecodeModule.default;
    
    // Just use the directly imported jwtDecode
    const decodedToken = jwtDecode(credentialResponse.credential);

    const credential = GoogleAuthProvider.credential(
      credentialResponse.credential
    );
    const userCredential = await signInWithCredential(auth, credential);

    const userData = {
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture,
      uid: userCredential.user.uid
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setOpenDialog(false);
    toast.success("Logged in successfully!");
  } catch (error) {
    console.error("Error during Firebase auth:", error);
    toast.error(`Login failed: ${error.message}`);
  }
};
  const handleLoginError = () => {
    toast.error("Login Failed");
  };

  const saveAiTrip = async (tripData) => {
    setIsSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();

      let parsedTripData;
      try {
        parsedTripData =
          typeof tripData === "string" ? JSON.parse(tripData) : tripData;
      } catch (e) {
        console.error("Failed to parse tripData:", tripData);
        throw new Error("Invalid trip data format");
      }

      const tripDoc = {
        userSelection: formData,
        tripData: parsedTripData,
        userEmail: user?.email,
        id: docId,
        createdAt: new Date().toISOString()
      };

      const cleanDoc = JSON.parse(JSON.stringify(tripDoc));

      await setDoc(doc(db, "AITrips", docId), cleanDoc);
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error("Save error details:", {
        error,
        formData,
        tripData
      });
      toast.error(`Failed to save trip: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const generateAIItinerary = async () => {
    const { destination, noOfDays, budget, travelGroup } = formData;

    if (!user) {
      setOpenDialog(true);
      return null;
    }

    setIsGenerating(true);
    try {
      const FINAL_PROMPT = AI_PROMPT.replace("{location}", destination?.label || "")
        .replace("{totalDays}", noOfDays)
        .replace("{traveler}", travelGroup?.title || "")
        .replace("{budget}", budget?.title || "");

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const tripText = result?.response?.text();

      if (tripText) {
        await saveAiTrip(tripText);
        toast.success("Trip saved successfully!");
      }
      return tripText;
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error(`Failed: ${error.message}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.destination ||
      !formData.noOfDays ||
      !formData.budget ||
      !formData.travelGroup
    ) {
      toast.error("Please fill out all fields before submitting.");
      return;
    }

    if (isNaN(Number(formData.noOfDays)) || Number(formData.noOfDays) < 1) {
      toast.error("Please enter a valid number of days (minimum 1)");
      return;
    }

    toast.info("Generating your perfect trip...");

    try {
      const trip = await generateAIItinerary();
      if (trip) {
        console.log("Generated Trip Itinerary:", trip);
      }
    } catch (error) {
      console.error("Trip generation error:", error);
    }
  };

  if (!clientId) {
    return (
      <div className="text-red-600 font-bold">
        Missing Google Client ID. Please check your .env file.
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="sm:px-10 md:px-12 lg:px-56 xl:px-10 px-5 mt-10">
        <Toaster richColors />
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-3xl">
              Tell us your travel preferences🏕️🌴
            </h2>
            <p className="mt-3 text-gray-500 text-xl">
              Just provide some basic information, and our trip planner will
              generate a customized itinerary based on your preferences.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mt-20 flex flex-col gap-9">
            {/* Destination Input */}
            <div>
              <h2 className="text-xl my-3 font-medium">
                What is your destination of choice?
              </h2>
              <GooglePlacesAutocomplete
                apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                selectProps={{
                  onChange: handlePlaceSelect,
                  placeholder: "Search for a place...",
                  styles: {
                    control: (provided) => ({
                      ...provided,
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#888"
                      }
                    }),
                    option: (provided) => ({
                      ...provided,
                      color: "#333"
                    })
                  }
                }}
              />
            </div>

            {/* Number of Days Input */}
            <div>
              <h2 className="text-xl my-3 font-medium">
                How many days are you planning your trip?
              </h2>
              <Input
                placeholder="e.g., 3"
                type="number"
                min="1"
                max="30"
                name="noOfDays"
                value={formData.noOfDays}
                onChange={handleInputChange}
              />
            </div>

            {/* Budget Options */}
            <div>
              <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SelectBudgetOptions.map((item) => (
                  <div
                    key={item.id}
                    className={`p-6 border rounded-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col items-center text-center bg-white hover:scale-105 transform ${
                      formData.budget?.id === item.id ? "border-blue-500" : ""
                    }`}
                    onClick={() => handleBudgetSelect(item)}
                  >
                    <div
                      className="p-4 rounded-2xl mb-4 flex items-center justify-center"
                      style={{
                        background: getIconGradient(item.title)
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        className: "text-white text-4xl"
                      })}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel List Options */}
            <div>
              <h2 className="text-xl my-3 font-medium">
                Who are you traveling with on your next adventure?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SelecteTravelList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-6 border rounded-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col items-center text-center bg-white hover:scale-105 transform ${
                      formData.travelGroup?.id === item.id
                        ? "border-blue-500"
                        : ""
                    }`}
                    onClick={() => handleTravelGroupSelect(item)}
                  >
                    <div
                      className="p-4 rounded-2xl mb-4 flex items-center justify-center"
                      style={{
                        background: getTravelIconGradient(item.title)
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        className: "text-white text-4xl"
                      })}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-gray-600">{item.desc}</p>
                    <p className="mt-2 text-sm text-gray-500">{item.people}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="my-10 justify-end flex">
              <Button type="submit" disabled={isGenerating || isSaving}>
                {isGenerating || isSaving ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isSaving ? "Saving Trip..." : "Generating Trip..."}
                  </span>
                ) : (
                  "Generate Trip"
                )}
              </Button>
            </div>

            {/* Login Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent aria-describedby="dialog-description">
                <DialogHeader>
                  <DialogTitle className="sr-only">
                    Sign In with Google
                  </DialogTitle>
                  <img
                    src="sarthi.png"
                    alt="Sarthi Logo"
                    className="w-20 mx-auto"
                  />
                  <DialogDescription id="dialog-description" className="mt-1 text-center">
                    Sign in to save and manage your trips
                  </DialogDescription>
                  <div className="flex justify-center mt-5">
                    <GoogleLogin
                      onSuccess={handleLoginSuccess}
                      onError={handleLoginError}
                      useOneTap
                      auto_select
                      theme="filled_blue"
                      size="large"
                      shape="rectangular"
                      text="continue_with"
                    />
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

const getIconGradient = (title) => {
  switch (title) {
    case "Cheap":
      return "linear-gradient(135deg, #4CAF50, #81C784)";
    case "Moderate":
      return "linear-gradient(135deg, #FFC107, #FFD54F)";
    case "Luxury":
      return "linear-gradient(135deg, #F44336, #E57373)";
    default:
      return "linear-gradient(135deg, #9E9E9E, #BDBDBD)";
  }
};

const getTravelIconGradient = (title) => {
  switch (title) {
    case "Just Me":
      return "linear-gradient(135deg, #2196F3, #64B5F6)";
    case "A Couple":
      return "linear-gradient(135deg, #E91E63, #F06292)";
    case "Family":
      return "linear-gradient(135deg, #FF9800, #FFB74D)";
    case "Friends":
      return "linear-gradient(135deg, #9C27B0, #BA68C8)";
    default:
      return "linear-gradient(135deg, #9E9E9E, #BDBDBD)";
  }
};

export default CreateTrip;
