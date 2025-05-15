import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaShare } from "react-icons/fa";
import { GetPlaceDetails } from "@/service/GlobalApi";

const InfoSection = ({ trip, isLoading }) => {
  const [placePhoto, setPlacePhoto] = useState(null);

  const formatDays = (value) => {
    if (!value) return 'Duration not specified';
    return typeof value === 'number' ? `${value} Days` : value;
  };

  const formatTravelers = (value) => {
    if (!value) return 'Number not specified';
    return typeof value === 'number' ? `${value} Traveler${value !== 1 ? 's' : ''}` : value;
  };

  useEffect(() => {
    const fetchPlacePhoto = async () => {
      if (!trip?.destination) return;

      try {
        const response = await GetPlaceDetails({ textQuery: trip.destination });
        console.log("Place API Response:", response.data);

        const photoName = response.data?.places?.[0]?.photos?.[0]?.name;
        if (photoName) {
          const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
          setPlacePhoto(photoUrl);
        } else {
          console.warn("No photo found for the destination.");
        }
      } catch (error) {
        console.error("Failed to fetch place photo:", error);
      }
    };

    fetchPlacePhoto();
  }, [trip?.destination]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-[340px] w-full bg-gray-200 rounded-xl"></div>
        <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
        <div className="flex gap-3">
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <img
        src={placePhoto || trip?.imageUrl || '/placeholder.png'}
        alt={`Trip to ${trip?.destination || 'unknown destination'}`}
        className="h-[340px] w-full object-cover rounded-xl"
        onError={(e) => {
          e.target.src = '/placeholder.png';
        }}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {trip?.destination || 'Destination not specified'}
          </h1>

          <div className="flex flex-wrap gap-2 font-medium text-sm sm:text-base">
            <TripDetailBadge icon="📅" text={formatDays(trip?.duration)} />
            <TripDetailBadge icon="💸" text={trip?.budget || 'Budget not specified'} />
            <TripDetailBadge 
              icon="🧑‍🤝‍🧑" 
              text={`${trip?.groupType || 'Group type not specified'} - ${formatTravelers(trip?.travelers)}`}
            />
          </div>
        </div>

        <Button className="bg-[#2a2828] hover:bg-[#3a3838]">
          <FaShare className="mr-2" />
          Share Trip
        </Button>
      </div>
    </div>
  );
};

const TripDetailBadge = ({ icon, text }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
    <span className="mr-1">{icon}</span>
    {text}
  </span>
);

export default InfoSection;
