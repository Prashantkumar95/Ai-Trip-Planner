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
  const [placesWithImages, setPlacesWithImages] =
    React.useState([]);

  const [isLoadingImages, setIsLoadingImages] =
    React.useState(false);

  console.log(
    'PlacesToVisit tripData:',
    tripData
  );

  // PROCESS DATA
  const { dailyPlans, dataStatus } =
    React.useMemo(() => {
      if (
        !tripData ||
        Object.keys(tripData).length === 0
      ) {
        return {
          dailyPlans: [],
          dataStatus: 'no-data'
        };
      }

      try {
        const rawPlans =
          tripData?.tripData?.itinerary ||
          [];

        const processedPlans =
          Array.isArray(rawPlans)
            ? rawPlans
                .filter(
                  day =>
                    day &&
                    typeof day === 'object'
                )
                .map((day, index) => ({
                  day:
                    day.day ||
                    index + 1,

                  theme:
                    day.theme ||
                    `Day ${
                      day.day ||
                      index + 1
                    }`,

                  activities:
                    normalizeActivities(
                      day.activities ||
                        []
                    ),

                  ...day
                }))
            : [];

        return {
          dailyPlans: processedPlans,

          dataStatus:
            processedPlans.length > 0
              ? 'has-data'
              : 'no-plans'
        };
      } catch (error) {
        console.error(
          'Data processing error:',
          error
        );

        return {
          dailyPlans: [],
          dataStatus: 'error'
        };
      }
    }, [tripData]);

  // FETCH IMAGES
  React.useEffect(() => {
    if (dataStatus !== 'has-data')
      return;

    const fetchImagesForPlaces =
      async () => {
        setIsLoadingImages(true);

        try {
          const allActivities =
            dailyPlans.flatMap(
              day => day.activities
            );

          const activitiesWithImages =
            await Promise.all(
              allActivities.map(
                async activity => {
                  if (
                    activity.placeImageURL &&
                    activity.placeImageURL !==
                      '/placeholder-location.jpg'
                  ) {
                    return activity;
                  }

                  try {
                    const response =
                      await fetch(
                        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                          activity.placeName
                        )}&per_page=1&client_id=YOUR_UNSPLASH_ACCESS_KEY`
                      );

                    if (!response.ok) {
                      throw new Error(
                        'Unsplash API error'
                      );
                    }

                    const data =
                      await response.json();

                    const imageUrl =
                      data.results[0]
                        ?.urls
                        ?.regular ||
                      '/placeholder-location.jpg';

                    return {
                      ...activity,
                      placeImageURL:
                        imageUrl
                    };
                  } catch (error) {
                    console.error(
                      `Failed to fetch image for ${activity.placeName}:`,
                      error
                    );

                    return activity;
                  }
                }
              )
            );

          const updatedDailyPlans =
            dailyPlans.map(day => ({
              ...day,

              activities:
                activitiesWithImages.filter(
                  act =>
                    day.activities.some(
                      originalAct =>
                        originalAct.id ===
                        act.id
                    )
                )
            }));

          setPlacesWithImages(
            updatedDailyPlans
          );
        } catch (error) {
          console.error(
            'Error fetching images:',
            error
          );

          setPlacesWithImages(
            dailyPlans
          );
        } finally {
          setIsLoadingImages(false);
        }
      };

    fetchImagesForPlaces();
  }, [dailyPlans, dataStatus]);

  // NORMALIZE ACTIVITIES
  function normalizeActivities(
    activities
  ) {
    if (!Array.isArray(activities))
      return [];

    return activities.map(act => {
      const mapsUrl =
        generateGoogleMapsUrl(act);

      return {
        id:
          act.id ||
          `${act.placeName || 'activity'}-${Math.random()
            .toString(36)
            .substr(2, 5)}`,

        placeName:
          act.placeName ||
          act.name ||
          'Unnamed Place',

        placeImageURL:
          act.placeImageURL ||
          '/placeholder-location.jpg',

        placeDetails:
          act.placeDetails || '',

        bestVisitTime:
          act.bestVisitTime ||
          'Flexible',

        duration:
          act.duration ||
          '1-2 hours',

        ticketPrice:
          act.ticketPrice ||
          'Free',

        mapsUrl,

        ...act
      };
    });
  }

  // MAP URL
  function generateGoogleMapsUrl(
    activity
  ) {
    if (
      activity.latitude &&
      activity.longitude
    ) {
      return `https://www.google.com/maps?q=${activity.latitude},${activity.longitude}`;
    }

    const query =
      encodeURIComponent(
        activity.placeName
      );

    if (activity.address) {
      const address =
        encodeURIComponent(
          activity.address
        );

      return `https://www.google.com/maps/search/?api=1&query=${address}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  const displayPlans =
    placesWithImages.length > 0
      ? placesWithImages
      : dailyPlans;

  // NO DATA
  if (dataStatus === 'no-data') {
    return (
      <div className="bg-[#111111] border border-gray-800 rounded-3xl p-10 text-center shadow-xl">
        <p className="text-gray-300 text-lg">
          Trip data not loaded yet...
        </p>
      </div>
    );
  }

  // NO PLANS
  if (dataStatus === 'no-plans') {
    return (
      <div className="bg-[#111111] border border-gray-800 rounded-3xl p-10 text-center shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-3">
          No Itinerary Found
        </h3>

        <p className="text-gray-300">
          This trip doesn't have any
          planned activities yet.
        </p>
      </div>
    );
  }

  // ERROR
  if (dataStatus === 'error') {
    return (
      <div className="bg-[#111111] border border-red-900 rounded-3xl p-10 text-center shadow-xl">
        <h3 className="text-2xl font-bold text-red-400 mb-3">
          Data Error
        </h3>

        <p className="text-gray-300">
          Couldn't process itinerary
          data.
        </p>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="relative min-h-screen bg-[#050505] rounded-[36px] overflow-hidden px-4 md:px-8 py-10 text-white">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_30%)]"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]"></div>

      {/* CONTENT */}
      <div className="relative z-10">

        {/* HEADER */}
        <div className="mb-14">

          <div className="flex items-center gap-4 mb-4">

            <div className="w-14 h-[3px] rounded-full bg-white"></div>

            <span className="uppercase tracking-[0.25em] text-sm text-gray-400 font-semibold">
              Luxury Travel Guide
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Places To Visit
          </h2>

          <p className="mt-5 text-gray-300 text-lg max-w-3xl leading-relaxed">
            Explore handpicked
            attractions, premium
            destinations, and
            unforgettable experiences
            carefully curated for your
            personalized travel
            journey.
          </p>
        </div>

        {/* LOADER */}
        {isLoadingImages && (
          <div className="flex justify-center mb-10">

            <div className="flex items-center gap-3 bg-[#111111] border border-gray-700 px-6 py-3 rounded-full shadow-lg">

              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>

              <span className="text-gray-200 text-sm font-medium">
                Loading premium
                destination visuals...
              </span>
            </div>
          </div>
        )}

        {/* DAY PLANS */}
        <div className="space-y-12">

          {displayPlans.map(day => (
            <div
              key={`day-${day.day}`}
              className="
                relative
                bg-[#111111]
                border border-gray-800
                rounded-[32px]
                p-6 md:p-8
                shadow-[0_10px_40px_rgba(0,0,0,0.5)]
                overflow-hidden
              "
            >

              {/* GLOW */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none"></div>

              {/* DAY HEADER */}
              <div className="flex items-center justify-between flex-wrap gap-5 mb-10 relative z-10">

                <div className="flex items-center gap-5">

                  {/* DAY BADGE */}
                  <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center text-2xl font-black shadow-lg">
                    {day.day}
                  </div>

                  {/* DAY INFO */}
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {day.theme ||
                        `Day ${day.day}`}
                    </h3>

                    <p className="text-gray-400 mt-1">
                      Curated itinerary for
                      your premium
                      experience
                    </p>
                  </div>
                </div>

                {/* ACTIVITY COUNT */}
                <div className="bg-[#1a1a1a] border border-gray-700 px-5 py-2 rounded-full text-sm text-gray-200 font-medium">
                  {day.activities.length}{' '}
                  Activities
                </div>
              </div>

              {/* ACTIVITIES */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 relative z-10">

                {day.activities.length >
                0 ? (
                  day.activities.map(
                    activity => (
                      <div
                        key={
                          activity.id
                        }
                        className="
                          bg-[#111111]
                          border border-gray-700
                          rounded-[28px]
                          overflow-hidden
                          shadow-xl
                          hover:border-white
                          hover:shadow-[0_0_35px_rgba(255,255,255,0.08)]
                          hover:-translate-y-2
                          transition-all duration-300
                        "
                      >
                        <PlaceCardItem
                          place={
                            activity
                          }
                        />
                      </div>
                    )
                  )
                ) : (
                  <div className="col-span-full bg-[#181818] border border-gray-700 rounded-3xl p-10 text-center">

                    <h4 className="text-xl font-semibold text-white mb-2">
                      No Activities
                      Planned
                    </h4>

                    <p className="text-gray-400">
                      Your itinerary for
                      this day is
                      currently empty.
                    </p>
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