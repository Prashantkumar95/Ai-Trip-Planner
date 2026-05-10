// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { toast } from 'sonner';
// import { db } from '@/service/firebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';
// import InfoSection from '../components/InfoSection';
// import Hotels from '../components/Hotels'; // Import the Hotels component
// import PlacesToVisit from '../components/PlaceToVisit';
// import Footer from '../components/Footer';

// const ViewTrip = () => {
//   const { tripId } = useParams();
//   const [tripData, setTripData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getTripData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const docRef = doc(db, 'AITrips', tripId);
//         const docSnap = await getDoc(docRef);

//         if (!docSnap.exists()) {
//           throw new Error('Trip not found');
//         }

//         const data = docSnap.data();
//         console.log('Fetched trip data:', data);

//         // Transform data to match both components' needs
//         const transformedData = {
//           destination: data.userSelection?.destination?.label || "Destination not specified",
//           duration: data.userSelection?.noOfDays || "Duration not specified",
//           budget: data.userSelection?.budget?.title || "Budget not specified",
//           travelers: data.userSelection?.travelGroup?.people || "Travelers not specified",
//           groupType: data.userSelection?.travelGroup?.title || "Group type not specified",
//           imageUrl: data.tripData?.itinerary?.[0]?.plan?.[0]?.placeImageUrl || '/placeholder.png',
//           // Prepare hotel data for both InfoSection and Hotels components
//           hotels: data.tripData?.hotels?.map(hotel => ({
//             hotelName: hotel.hotelName,
//             hotelImageURL: hotel.hotelImageUrl || '/hotel-placeholder.jpg',
//             rating: hotel.rating,
//             price: hotel.price,
//             description: hotel.description,
//             hotelAddress: hotel.hotelAddress,
//             notes: hotel.notes,
//             geoCoordinates: hotel.geoCoordinates
//           })) || [],
//           itinerary: data.tripData?.itinerary || [],
//           rawData: data,
//           // For Hotels component
//           tripData: {
//             hotelOptions: data.tripData?.hotels || []
//           }
//         };

//         setTripData(transformedData);
//       } catch (err) {
//         console.error('Error fetching trip:', err);
//         setError(err.message);
//         toast.error(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (tripId) getTripData();
//   }, [tripId]);

//   if (loading) {
//     return <div className="text-center py-20">Loading trip details...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-20 text-red-500">
//         <h2 className="text-xl font-bold mb-2">Error Loading Trip</h2>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* <InfoSection trip={tripData} isLoading={loading} /> */}
      
//       {/* Render the Hotels component */}
//       <Hotels tripdata={tripData} />

//       {/* <PlacesToVisit tripdata={tripData} isLoading={loading} /> */}
      
    
//       {/* <Footer  /> */}


      
//       {/*  Itinerary Section
//       {tripData?.itinerary?.length > 0 && (
//         <section className="mt-12">
//           <h2 className="text-3xl font-bold mb-8">Your Itinerary</h2>
//           {tripData.itinerary.map((day, dayIndex) => (
//             <div key={dayIndex} className="mb-12">
//               <h3 className="text-2xl font-semibold mb-6">{day.day}</h3>
//               <div className="space-y-6">
//                 {day.plan.map((activity, activityIndex) => (
//                   <div key={activityIndex} className="border-l-4 border-blue-500 pl-6 py-2">
//                     <div className="flex flex-col md:flex-row md:items-center gap-4">
//                       <div className="w-full md:w-1/4">
//                         <p className="font-medium text-lg">{activity.time}</p>
//                         <p className="text-gray-500">{activity.duration}</p>
//                       </div>
//                       <div className="w-full md:w-3/4">
//                         <h4 className="font-bold text-xl">{activity.placeName}</h4>
//                         <p className="text-gray-700 mt-1">{activity.placeDetails}</p>
//                         {activity.ticketPrice && activity.ticketPrice !== "Free" && (
//                           <p className="text-gray-600 mt-1">Cost: {activity.ticketPrice}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))} 
//               </div>
//             </div>
//           ))}
//         </section>
//       )} */}
//       {/* Itinerary Section with Map */}
// {tripData?.itinerary?.length > 0 && (
//   <section className="mt-12">
//     <h2 className="text-3xl font-bold mb-8">Your Itinerary</h2>
    
//     {/* Map Container - You can use Google Maps, Mapbox, or any other mapping service */}
    

//     {tripData.itinerary.map((day, dayIndex) => (
//   <div key={dayIndex} className="mb-12">
//     <h3 className="text-2xl font-semibold mb-6">{day.day}</h3>
//     <div className="space-y-6">
//       {day.plan.map((activity, activityIndex) => (
//         <div key={activityIndex} className="border-l-4 border-blue-500 pl-6 py-2">
//           <div className="flex flex-col md:flex-row md:items-center gap-4">
//             <div className="w-full md:w-1/4">
//               <p className="font-medium text-lg">{activity.time}</p>
//               <p className="text-gray-500">{activity.duration}</p>
//             </div>
//             <div className="w-full md:w-3/4">
//               <h4 className="font-bold text-xl">{activity.placeName}</h4>
//               <p className="text-gray-700 mt-1">{activity.placeDetails}</p>

//               {activity.ticketPrice && activity.ticketPrice !== 'Free' && (
//                 <p className="text-gray-600 mt-1">Cost: {activity.ticketPrice}</p>
//               )}

//               {/* View on Map Button */}
//               <button
//                 onClick={() =>
//                   window.open(
//                     activity.location
//                       ? `https://www.google.com/maps?q=${activity.location.lat},${activity.location.lng}`
//                       : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.placeName)}`,
//                     '_blank'
//                   )
//                 }
//                 className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
//               >
//                 <svg
//                   className="w-5 h-5 mr-1"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                 </svg>
//                 View on Map
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// ))}


      
//       <Footer  />
//       {/* Debug section */}
//       {/* {process.env.NODE_ENV === 'development' && (
//         <div className="mt-10 p-4 bg-gray-100 rounded-lg">
//           <h3 className="font-bold mb-2">Debug Info</h3>
//           <pre className="text-xs overflow-x-auto">
//             {JSON.stringify(tripData?.rawData, null, 2)}
//           </pre>
//         </div>
//       )} */}
//     </section>
//   )}
// </div>
//   );
// };

// export default ViewTrip;



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { db } from "@/service/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import Hotels from "../components/Hotels";
import Footer from "../components/Footer";

const ViewTrip = () => {
  const { tripId } = useParams();

  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTripData = async () => {
      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, "AITrips", tripId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("Trip not found");
        }

        const data = docSnap.data();

        console.log("Fetched trip data:", data);

        const transformedData = {
          destination:
            data.userSelection?.destination?.label ||
            "Destination not specified",

          duration:
            data.userSelection?.noOfDays ||
            "Duration not specified",

          budget:
            data.userSelection?.budget?.title ||
            "Budget not specified",

          travelers:
            data.userSelection?.travelGroup?.people ||
            "Travelers not specified",

          groupType:
            data.userSelection?.travelGroup?.title ||
            "Group type not specified",

          imageUrl:
            data.tripData?.itinerary?.[0]?.plan?.[0]
              ?.placeImageUrl || "/placeholder.png",

          hotels:
            data.tripData?.hotels?.map((hotel) => ({
              hotelName: hotel.hotelName,
              hotelImageURL:
                hotel.hotelImageUrl ||
                "/hotel-placeholder.jpg",
              rating: hotel.rating,
              price: hotel.price,
              description: hotel.description,
              hotelAddress: hotel.hotelAddress,
              notes: hotel.notes,
              geoCoordinates: hotel.geoCoordinates,
            })) || [],

          itinerary: data.tripData?.itinerary || [],

          rawData: data,

          tripData: {
            hotelOptions: data.tripData?.hotels || [],
          },
        };

        setTripData(transformedData);
      } catch (err) {
        console.error("Error fetching trip:", err);

        setError(err.message);

        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      getTripData();
    }
  }, [tripId]);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h2 className="text-3xl font-bold animate-pulse">
          Loading Trip Details...
        </h2>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-4">
            Error Loading Trip
          </h2>

          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

        {/* Hero Section */}
        <div className="mb-14">

          <div className="relative h-[350px] md:h-[500px] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">

            <img
              src={tripData?.imageUrl}
              alt={tripData?.destination}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 md:p-12">

              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {tripData?.destination}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm md:text-base">

                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  {tripData?.duration} Days
                </span>

                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  {tripData?.budget}
                </span>

                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  {tripData?.groupType}
                </span>

                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  {tripData?.travelers}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hotels Section */}
        <div className="mt-20">
          <Hotels tripdata={tripData} />
        </div>

        {/* Itinerary Section */}
        {tripData?.itinerary?.length > 0 && (
          <section className="mt-24">

            <div className="mb-12">
              <h2 className="text-4xl font-bold">
                Your Itinerary
              </h2>

              <p className="text-gray-400 mt-3">
                Explore your complete AI-generated travel plan.
              </p>
            </div>

            {tripData.itinerary.map((day, dayIndex) => (
              <div key={dayIndex} className="mb-20">

                {/* Day Title */}
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-blue-400">
                    {day.day}
                  </h3>
                </div>

                {/* Activities */}
                <div className="space-y-8">

                  {day.plan.map((activity, activityIndex) => (
                    <div
                      key={activityIndex}
                      className="bg-[#111111] border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition duration-300 shadow-xl"
                    >
                      <div className="flex flex-col lg:flex-row">

                        {/* Image */}
                        <div className="lg:w-[350px]">
                          <img
                            src={
                              activity.placeImageUrl ||
                              "/placeholder.png"
                            }
                            alt={activity.placeName}
                            className="w-full h-full object-cover lg:h-[320px]"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 md:p-8">

                          {/* Time Badge */}
                          <div className="mb-4">
                            <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold border border-blue-500/20">
                              {activity.time}
                            </span>
                          </div>

                          {/* Place Name */}
                          <h4 className="text-3xl font-bold">
                            {activity.placeName}
                          </h4>

                          {/* Description */}
                          <p className="text-gray-300 leading-8 mt-4">
                            {activity.placeDetails}
                          </p>

                          {/* Info Grid */}
                          <div className="grid md:grid-cols-2 gap-5 mt-6">

                            <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-gray-800">
                              <p className="text-gray-400 text-sm">
                                Travel Time
                              </p>

                              <p className="text-white font-semibold mt-2">
                                {activity.timeToTravel || "N/A"}
                              </p>
                            </div>

                            <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-gray-800">
                              <p className="text-gray-400 text-sm">
                                Ticket Pricing
                              </p>

                              <p className="text-green-400 font-semibold mt-2">
                                {activity.ticketPricing || "Free"}
                              </p>
                            </div>
                          </div>

                          {/* Address */}
                          {activity.placeAddress && (
                            <div className="mt-6">
                              <p className="text-gray-400 text-sm">
                                Address
                              </p>

                              <p className="text-white mt-2">
                                {activity.placeAddress}
                              </p>
                            </div>
                          )}

                          {/* View on Map */}
                          <button
                            onClick={() =>
                              window.open(
                                activity.geoCoordinates
                                  ? `https://www.google.com/maps?q=${activity.geoCoordinates}`
                                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                      activity.placeName
                                    )}`,
                                "_blank"
                              )
                            }
                            className="mt-8 bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition duration-300"
                          >
                            View on Map
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ViewTrip;