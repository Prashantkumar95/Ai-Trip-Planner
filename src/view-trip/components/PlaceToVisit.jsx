// import React from 'react';
// import PlaceCardItem from './PlaceCardItem'; // Your card component

// function PlacesToVisit({ tripData = {} }) {
//   const [placesWithImages, setPlacesWithImages] = React.useState([]);
//   const [isLoadingImages, setIsLoadingImages] = React.useState(false);

//   console.log('PlacesToVisit tripData:', tripData);

//   // Extract itinerary days from your data shape
//   const { dailyPlans, dataStatus } = React.useMemo(() => {
//     if (!tripData || Object.keys(tripData).length === 0) {
//       return { dailyPlans: [], dataStatus: 'no-data' };
//     }

//     try {
//       // Adjusted to your schema: tripData.tripData.itinerary is an array of days
//       const rawPlans = tripData?.tripData?.itinerary || [];

//       const processedPlans = Array.isArray(rawPlans)
//         ? rawPlans
//             .filter(day => day && typeof day === 'object')
//             .map((day, index) => ({
//               day: day.day || index + 1,
//               theme: day.theme || `Day ${day.day || index + 1}`,
//               activities: normalizeActivities(day.activities || []),
//               ...day
//             }))
//         : [];

//       return {
//         dailyPlans: processedPlans,
//         dataStatus: processedPlans.length > 0 ? 'has-data' : 'no-plans'
//       };
//     } catch (error) {
//       console.error("Data processing error:", error);
//       return { dailyPlans: [], dataStatus: 'error' };
//     }
//   }, [tripData]);

//   // Fetch images for activities missing images
//   React.useEffect(() => {
//     if (dataStatus !== 'has-data') return;

//     const fetchImagesForPlaces = async () => {
//       setIsLoadingImages(true);

//       try {
//         const allActivities = dailyPlans.flatMap(day => day.activities);
//         const activitiesWithImages = await Promise.all(
//           allActivities.map(async (activity) => {
//             if (activity.placeImageURL && activity.placeImageURL !== '/placeholder-location.jpg') {
//               return activity;
//             }

//             try {
//               const response = await fetch(
//                 `https://api.unsplash.com/search/photos?query=${encodeURIComponent(activity.placeName)}&per_page=1&client_id=YOUR_UNSPLASH_ACCESS_KEY`
//               );

//               if (!response.ok) throw new Error('Unsplash API error');

//               const data = await response.json();
//               const imageUrl = data.results[0]?.urls?.regular || '/placeholder-location.jpg';

//               return {
//                 ...activity,
//                 placeImageURL: imageUrl
//               };
//             } catch (error) {
//               console.error(`Failed to fetch image for ${activity.placeName}:`, error);
//               return activity;
//             }
//           })
//         );

//         // Update dailyPlans with fetched images
//         const updatedDailyPlans = dailyPlans.map(day => ({
//           ...day,
//           activities: activitiesWithImages.filter(act =>
//             day.activities.some(originalAct => originalAct.id === act.id)
//           )
//         }));

//         setPlacesWithImages(updatedDailyPlans);
//       } catch (error) {
//         console.error('Error fetching images:', error);
//         setPlacesWithImages(dailyPlans);
//       } finally {
//         setIsLoadingImages(false);
//       }
//     };

//     fetchImagesForPlaces();
//   }, [dailyPlans, dataStatus]);

//   function normalizeActivities(activities) {
//     if (!Array.isArray(activities)) return [];

//     return activities.map(act => {
//       const mapsUrl = generateGoogleMapsUrl(act);

//       return {
//         id: act.id || `${act.placeName || 'activity'}-${Math.random().toString(36).substr(2, 5)}`,
//         placeName: act.placeName || act.name || 'Unnamed Place',
//         placeImageURL: act.placeImageURL || '/placeholder-location.jpg',
//         placeDetails: act.placeDetails || '',
//         bestVisitTime: act.bestVisitTime || 'Flexible',
//         duration: act.duration || '1-2 hours',
//         ticketPrice: act.ticketPrice || 'Free',
//         mapsUrl,
//         ...act
//       };
//     });
//   }

//   function generateGoogleMapsUrl(activity) {
//     if (activity.latitude && activity.longitude) {
//       return `https://www.google.com/maps?q=${activity.latitude},${activity.longitude}`;
//     }

//     const query = encodeURIComponent(activity.placeName);

//     if (activity.address) {
//       const address = encodeURIComponent(activity.address);
//       return `https://www.google.com/maps/search/?api=1&query=${address}`;
//     }

//     return `https://www.google.com/maps/search/?api=1&query=${query}`;
//   }

//   // Use placesWithImages if available, else fallback to dailyPlans
//   const displayPlans = placesWithImages.length > 0 ? placesWithImages : dailyPlans;

//   switch (dataStatus) {
//     case 'no-data':
//       return (
//         <div className="p-6 text-center bg-gray-50 rounded-lg">
//           <p className="text-gray-500">Trip data not loaded yet...</p>
//         </div>
//       );

//     case 'no-plans':
//       return (
//         <div className="p-6 text-center bg-blue-50 rounded-lg">
//           <h3 className="text-lg font-medium mb-2">No Itinerary Found</h3>
//           <p className="text-blue-800">
//             This trip doesn't have any planned activities yet.
//           </p>
//         </div>
//       );

//     case 'error':
//       return (
//         <div className="p-6 text-center bg-red-50 rounded-lg">
//           <h3 className="text-lg font-medium mb-2 text-red-800">Data Error</h3>
//           <p>Couldn't process itinerary data.</p>
//         </div>
//       );

//     default:
//       return (
//         <div className="mt-8">
//           <h2 className="text-2xl font-bold mb-6">Places to Visit</h2>
//           {isLoadingImages && (
//             <div className="mb-4 text-center text-gray-500">
//               Loading images for places...
//             </div>
//           )}
//           <div className="space-y-10">
//             {displayPlans.map((day) => (
//               <div key={`day-${day.day}`} className="day-section">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="bg-purple-100 text-purple-800 font-bold rounded-full w-8 h-8 flex items-center justify-center">
//                     {day.day}
//                   </div>
//                   <h3 className="text-xl font-semibold">
//                     {day.theme || `Day ${day.day}`}
//                   </h3>
//                 </div>

//                 <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//                   {day.activities.length > 0 ? (
//                     day.activities.map((activity) => (
//                       <PlaceCardItem
//                         key={activity.id}
//                         place={activity}
//                       />
//                     ))
//                   ) : (
//                     <div className="col-span-full p-4 bg-gray-50 rounded-lg text-center">
//                       <p className="text-gray-500">No activities planned for this day</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//   }
// }

// // Sample static data to test component independently
// export const sampleTripData = {
//   tripData: {
//     itinerary: [
//       {
//         day: 1,
//         theme: "Beach Day",
//         activities: [
//           {
//             id: "act1",
//             placeName: "Goa Beach",
//             latitude: 15.2993,
//             longitude: 74.1240,
//             placeImageURL: "",
//             placeDetails: "Beautiful beach in Goa.",
//             bestVisitTime: "Morning",
//             duration: "3 hours",
//             ticketPrice: "Free"
//           }
//         ]
//       },
//       {
//         day: 2,
//         theme: "City Tour",
//         activities: [
//           {
//             id: "act2",
//             placeName: "New York City",
//             latitude: 40.7128,
//             longitude: -74.0060,
//             placeImageURL: "",
//             placeDetails: "Explore the Big Apple.",
//             bestVisitTime: "All day",
//             duration: "Full day",
//             ticketPrice: "Varies"
//           }
//         ]
//       }
//     ]
//   }
// };

// export default PlacesToVisit;


// import React from 'react';
// import PlaceCardItem from './PlaceCardItem';

// function PlacesToVisit({ tripData = {} }) {
//   const [placesWithImages, setPlacesWithImages] = React.useState([]);
//   const [isLoadingImages, setIsLoadingImages] = React.useState(false);

//   console.log('PlacesToVisit tripData:', tripData);

//   const { dailyPlans, dataStatus } = React.useMemo(() => {
//     if (!tripData || Object.keys(tripData).length === 0) {
//       return { dailyPlans: [], dataStatus: 'no-data' };
//     }

//     try {
//       const rawPlans = tripData?.tripData?.itinerary || [];

//       const processedPlans = Array.isArray(rawPlans)
//         ? rawPlans
//             .filter(day => day && typeof day === 'object')
//             .map((day, index) => ({
//               day: day.day || index + 1,
//               theme: day.theme || `Day ${day.day || index + 1}`,
//               activities: normalizeActivities(day.activities || []),
//               ...day
//             }))
//         : [];

//       return {
//         dailyPlans: processedPlans,
//         dataStatus: processedPlans.length > 0 ? 'has-data' : 'no-plans'
//       };
//     } catch (error) {
//       console.error("Data processing error:", error);
//       return { dailyPlans: [], dataStatus: 'error' };
//     }
//   }, [tripData]);

//   React.useEffect(() => {
//     if (dataStatus !== 'has-data') return;

//     const fetchImagesForPlaces = async () => {
//       setIsLoadingImages(true);

//       try {
//         const allActivities = dailyPlans.flatMap(day => day.activities);

//         const activitiesWithImages = await Promise.all(
//           allActivities.map(async (activity) => {
//             if (
//               activity.placeImageURL &&
//               activity.placeImageURL !== '/placeholder-location.jpg'
//             ) {
//               return activity;
//             }

//             try {
//               const response = await fetch(
//                 `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
//                   activity.placeName
//                 )}&per_page=1&client_id=YOUR_UNSPLASH_ACCESS_KEY`
//               );

//               if (!response.ok) throw new Error('Unsplash API error');

//               const data = await response.json();

//               const imageUrl =
//                 data.results[0]?.urls?.regular ||
//                 '/placeholder-location.jpg';

//               return {
//                 ...activity,
//                 placeImageURL: imageUrl
//               };
//             } catch (error) {
//               console.error(
//                 `Failed to fetch image for ${activity.placeName}:`,
//                 error
//               );
//               return activity;
//             }
//           })
//         );

//         const updatedDailyPlans = dailyPlans.map(day => ({
//           ...day,
//           activities: activitiesWithImages.filter(act =>
//             day.activities.some(originalAct => originalAct.id === act.id)
//           )
//         }));

//         setPlacesWithImages(updatedDailyPlans);
//       } catch (error) {
//         console.error('Error fetching images:', error);
//         setPlacesWithImages(dailyPlans);
//       } finally {
//         setIsLoadingImages(false);
//       }
//     };

//     fetchImagesForPlaces();
//   }, [dailyPlans, dataStatus]);

//   function normalizeActivities(activities) {
//     if (!Array.isArray(activities)) return [];

//     return activities.map(act => {
//       const mapsUrl = generateGoogleMapsUrl(act);

//       return {
//         id:
//           act.id ||
//           `${act.placeName || 'activity'}-${Math.random()
//             .toString(36)
//             .substr(2, 5)}`,
//         placeName: act.placeName || act.name || 'Unnamed Place',
//         placeImageURL:
//           act.placeImageURL || '/placeholder-location.jpg',
//         placeDetails: act.placeDetails || '',
//         bestVisitTime: act.bestVisitTime || 'Flexible',
//         duration: act.duration || '1-2 hours',
//         ticketPrice: act.ticketPrice || 'Free',
//         mapsUrl,
//         ...act
//       };
//     });
//   }

//   function generateGoogleMapsUrl(activity) {
//     if (activity.latitude && activity.longitude) {
//       return `https://www.google.com/maps?q=${activity.latitude},${activity.longitude}`;
//     }

//     const query = encodeURIComponent(activity.placeName);

//     if (activity.address) {
//       const address = encodeURIComponent(activity.address);
//       return `https://www.google.com/maps/search/?api=1&query=${address}`;
//     }

//     return `https://www.google.com/maps/search/?api=1&query=${query}`;
//   }

//   const displayPlans =
//     placesWithImages.length > 0
//       ? placesWithImages
//       : dailyPlans;

//   switch (dataStatus) {
//     case 'no-data':
//       return (
//         <div className="p-6 text-center bg-[#111111] border border-gray-800 rounded-2xl shadow-xl">
//           <p className="text-gray-400">
//             Trip data not loaded yet...
//           </p>
//         </div>
//       );

//     case 'no-plans':
//       return (
//         <div className="p-6 text-center bg-[#111111] border border-gray-800 rounded-2xl shadow-xl">
//           <h3 className="text-xl font-semibold mb-2 text-white">
//             No Itinerary Found
//           </h3>
//           <p className="text-gray-400">
//             This trip doesn't have any planned activities yet.
//           </p>
//         </div>
//       );

//     case 'error':
//       return (
//         <div className="p-6 text-center bg-[#111111] border border-red-900 rounded-2xl shadow-xl">
//           <h3 className="text-xl font-semibold mb-2 text-red-400">
//             Data Error
//           </h3>
//           <p className="text-gray-400">
//             Couldn't process itinerary data.
//           </p>
//         </div>
//       );

//     default:
//       return (
//   <div className="mt-8 min-h-screen bg-[#070707] text-white px-4 md:px-6 py-10 rounded-[32px]">

//     {/* Premium Header */}
//     <div className="mb-12">
//       <div className="flex items-center gap-3 mb-3">

//         <div className="w-12 h-1 rounded-full bg-white"></div>

//         <span className="uppercase tracking-[0.25em] text-sm text-gray-400 font-medium">
//           Travel Itinerary
//         </span>
//       </div>

//       <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
//         Places to Visit
//       </h2>

//       <p className="text-gray-300 mt-4 text-lg max-w-2xl leading-relaxed">
//         Discover carefully curated destinations, premium experiences,
//         and unforgettable attractions designed for your perfect trip.
//       </p>
//     </div>

//     {/* Loader */}
//     {isLoadingImages && (
//       <div className="mb-8 flex justify-center">
//         <div className="flex items-center gap-3 bg-[#121212] border border-gray-700 px-6 py-3 rounded-full shadow-xl">
          
//           <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>

//           <span className="text-gray-200 text-sm font-medium">
//             Loading destination visuals...
//           </span>
//         </div>
//       </div>
//     )}

//     {/* Days */}
//     <div className="space-y-10">
//       {displayPlans.map((day) => (
//         <div
//           key={`day-${day.day}`}
//           className="relative bg-[#111111] border border-gray-700 rounded-[28px] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
//         >

//           {/* Background Accent */}
//           <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none"></div>

//           {/* Header */}
//           <div className="flex items-center gap-5 mb-8 relative z-10">

//             {/* Day Circle */}
//             <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-xl font-bold shadow-lg">
//               {day.day}
//             </div>

//             {/* Day Info */}
//             <div>
//               <h3 className="text-2xl md:text-3xl font-bold text-white">
//                 {day.theme || `Day ${day.day}`}
//               </h3>

//               <p className="text-gray-300 mt-1 text-sm md:text-base">
//                 Premium curated itinerary for your journey
//               </p>
//             </div>
//           </div>

//           {/* Activities */}
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">

//             {day.activities.length > 0 ? (
//               day.activities.map((activity) => (
//                 <div
//                   key={activity.id}
//                   className="
//                     bg-[#181818]
//                     border border-gray-700
//                     rounded-3xl
//                     overflow-hidden
//                     shadow-lg
//                     hover:shadow-[0_0_35px_rgba(255,255,255,0.08)]
//                     hover:border-gray-500
//                     hover:-translate-y-1
//                     transition-all duration-300
//                   "
//                 >
//                   <PlaceCardItem place={activity} />
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full bg-[#181818] border border-gray-700 rounded-2xl p-8 text-center">

//                 <p className="text-gray-300 text-lg font-medium">
//                   No activities planned for this day
//                 </p>

//                 <p className="text-gray-500 mt-2 text-sm">
//                   Your itinerary for this day is currently empty.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );
//   }
// }

// export default PlacesToVisit;

import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ tripData = {} }) {
  const [processedData, setProcessedData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Extract itinerary from data structure
    let itinerary = [];
    
    if (tripData?.itinerary && Array.isArray(tripData.itinerary)) {
      itinerary = tripData.itinerary;
    } else if (tripData?.tripData?.itinerary && Array.isArray(tripData.tripData.itinerary)) {
      itinerary = tripData.tripData.itinerary;
    } else if (Array.isArray(tripData)) {
      itinerary = tripData;
    }
    
    // Process each day
    const days = itinerary.map((day, dayIndex) => {
      let activities = [];
      
      if (day.activities && Array.isArray(day.activities)) {
        activities = day.activities;
      } else if (day.places && Array.isArray(day.places)) {
        activities = day.places;
      }
      
      const processedActivities = activities.map((activity, actIndex) => ({
        id: `act-${dayIndex}-${actIndex}`,
        placeName: activity.placeName || activity.name || `Activity ${actIndex + 1}`,
        timeRange: activity.timeRange || activity.time || '',
        duration: activity.duration || '',
        bestVisitTime: activity.bestVisitTime || activity.bestTime || '',
        placeDetails: activity.placeDetails || activity.description || '',
        ticketPrice: activity.ticketPrice || 'Free',
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.placeName || '')}`
      }));
      
      return {
        day: day.day || dayIndex + 1,
        theme: day.theme || `Day ${day.day || dayIndex + 1}`,
        activities: processedActivities
      };
    });
    
    setProcessedData(days);
    setIsLoading(false);
  }, [tripData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg text-center border border-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded-lg text-center border border-gray-800 max-w-md">
          <p className="text-gray-400 mb-2">No itinerary data found</p>
          <p className="text-gray-500 text-sm">Please check your trip data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Places To Visit
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore handpicked attractions and unforgettable experiences 
            carefully curated for your personalized travel journey.
          </p>
        </div>

        {/* Days */}
        <div className="space-y-8">
          {processedData.map((day) => (
            <div key={day.day} className="mb-8">
              
              {/* Day Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                    <span className="text-blue-600 font-bold text-xl">{day.day}</span>
                  </div>
                  <div>
                    <h2 className="text-white text-2xl md:text-3xl font-bold">
                      {day.theme}
                    </h2>
                    <p className="text-blue-200 text-sm mt-1">
                      Curated itinerary for your premium experience
                    </p>
                  </div>
                </div>
              </div>

              {/* Activities Grid */}
              <div className="bg-gray-900 rounded-b-2xl p-6 border-x border-b border-gray-800">
                {day.activities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {day.activities.map((activity) => (
                      <PlaceCardItem key={activity.id} place={activity} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No activities planned for this day</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlacesToVisit;