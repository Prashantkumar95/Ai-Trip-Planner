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
  const [placesWithImages, setPlacesWithImages] = React.useState([]);
  const [isLoadingImages, setIsLoadingImages] = React.useState(false);

  // PROCESS DATA - IMPROVED DATA EXTRACTION
  const { dailyPlans, dataStatus } = React.useMemo(() => {
    if (!tripData || Object.keys(tripData).length === 0) {
      return { dailyPlans: [], dataStatus: 'no-data' };
    }

    try {
      // Enhanced data extraction for various data structures
      let rawPlans = [];
      
      // Handle different possible data structures
      if (tripData?.tripData?.itinerary) {
        rawPlans = tripData.tripData.itinerary;
      } else if (tripData?.itinerary) {
        rawPlans = tripData.itinerary;
      } else if (Array.isArray(tripData)) {
        rawPlans = tripData;
      } else if (tripData?.dailyPlans) {
        rawPlans = tripData.dailyPlans;
      }
      
      const processedPlans = Array.isArray(rawPlans) && rawPlans.length > 0
        ? rawPlans.filter(day => day && typeof day === 'object').map((day, index) => {
            // Extract activities with proper fallbacks
            let activities = [];
            
            if (day.activities && Array.isArray(day.activities)) {
              activities = day.activities;
            } else if (day.places && Array.isArray(day.places)) {
              activities = day.places;
            } else if (day.events && Array.isArray(day.events)) {
              activities = day.events;
            } else if (day.items && Array.isArray(day.items)) {
              activities = day.items;
            }
            
            return {
              day: day.day || day.dayNumber || index + 1,
              theme: day.theme || day.title || `Day ${day.day || index + 1}`,
              date: day.date || '',
              activities: normalizeActivities(activities),
              description: day.description || '',
              ...day
            };
          })
        : [];

      return {
        dailyPlans: processedPlans,
        dataStatus: processedPlans.length > 0 ? 'has-data' : 'no-plans'
      };
    } catch (error) {
      console.error('Data processing error:', error);
      return { dailyPlans: [], dataStatus: 'error' };
    }
  }, [tripData]);

  // NORMALIZE ACTIVITIES - ENSURING ALL FIELDS ARE VISIBLE
  function normalizeActivities(activities) {
    if (!Array.isArray(activities)) return [];

    return activities.map((act, idx) => {
      // Extract the place name from various possible fields
      const placeName = act.placeName || 
                       act.name || 
                       act.location || 
                       act.title || 
                       act.attraction || 
                       act.place || 
                       'Unnamed Location';
      
      // Extract time information
      const timeInfo = act.time || 
                      act.timeRange || 
                      act.schedule || 
                      (act.startTime && act.endTime ? `${act.startTime} - ${act.endTime}` : '');
      
      // Extract duration
      const duration = act.duration || 
                      act.estimatedDuration || 
                      act.timeSpent || 
                      'Flexible';
      
      // Extract best visit time
      const bestTime = act.bestVisitTime || 
                      act.bestTime || 
                      act.recommendedTime || 
                      'Anytime';
      
      // Extract description/details
      const description = act.placeDetails || 
                         act.description || 
                         act.details || 
                         act.notes || 
                         act.info || 
                         '';
      
      // Extract ticket price
      const price = act.ticketPrice || 
                   act.price || 
                   act.cost || 
                   act.entryFee || 
                   'Free';
      
      // Extract rating
      const rating = act.rating || 
                    act.stars || 
                    (act.reviews ? 4.5 : null);
      
      // Extract address
      const address = act.address || 
                     act.location || 
                     act.fullAddress || 
                     '';

      return {
        id: act.id || `place-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 8)}`,
        placeName: placeName,
        placeImageURL: act.placeImageURL || act.imageURL || act.image || '/api/placeholder/400/300',
        placeDetails: description,
        bestVisitTime: bestTime,
        duration: duration,
        ticketPrice: price,
        timeRange: timeInfo,
        address: address,
        rating: rating,
        latitude: act.latitude || act.lat,
        longitude: act.longitude || act.lng || act.lon,
        mapsUrl: generateGoogleMapsUrl({ placeName, address, latitude: act.latitude, longitude: act.longitude }),
        tips: act.tips || act.proTips || '',
        category: act.category || act.type || 'Attraction',
        isPremium: act.isPremium || act.premium || false,
        ...act
      };
    });
  }

  // MAP URL GENERATION
  function generateGoogleMapsUrl(activity) {
    if (activity.latitude && activity.longitude) {
      return `https://www.google.com/maps?q=${activity.latitude},${activity.longitude}`;
    }
    
    let searchQuery = activity.placeName;
    if (activity.address && activity.address !== activity.placeName) {
      searchQuery = `${activity.placeName}, ${activity.address}`;
    }
    
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
  }

  // IMAGE FETCHING
  React.useEffect(() => {
    if (dataStatus !== 'has-data') return;

    const fetchImagesForPlaces = async () => {
      setIsLoadingImages(true);
      
      try {
        const updatedDailyPlans = await Promise.all(
          dailyPlans.map(async (day) => {
            const updatedActivities = await Promise.all(
              day.activities.map(async (activity) => {
                if (activity.placeImageURL && 
                    !activity.placeImageURL.includes('/api/placeholder') &&
                    activity.placeImageURL !== '/placeholder-location.jpg') {
                  return activity;
                }

                // Fallback to placeholder images if no API key
                const placeholderImages = [
                  `https://source.unsplash.com/featured/400x300?${encodeURIComponent(activity.placeName)}`,
                  `https://loremflick.com/400/300?${encodeURIComponent(activity.placeName)}`,
                ];
                
                // Use Unsplash if API key is available
                const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
                
                if (UNSPLASH_KEY) {
                  try {
                    const response = await fetch(
                      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                        activity.placeName
                      )}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`
                    );
                    
                    if (response.ok) {
                      const data = await response.json();
                      if (data.results && data.results[0]) {
                        return {
                          ...activity,
                          placeImageURL: data.results[0].urls.regular
                        };
                      }
                    }
                  } catch (error) {
                    console.error(`Failed to fetch image for ${activity.placeName}:`, error);
                  }
                }
                
                // Return with placeholder if no image found
                return {
                  ...activity,
                  placeImageURL: placeholderImages[0]
                };
              })
            );
            
            return { ...day, activities: updatedActivities };
          })
        );
        
        setPlacesWithImages(updatedDailyPlans);
      } catch (error) {
        console.error('Error fetching images:', error);
        setPlacesWithImages(dailyPlans);
      } finally {
        setIsLoadingImages(false);
      }
    };
    
    fetchImagesForPlaces();
  }, [dailyPlans, dataStatus]);

  const displayPlans = placesWithImages.length > 0 ? placesWithImages : dailyPlans;

  // RATING STARS COMPONENT
  const RatingStars = ({ rating }) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400' : (i === fullStars && hasHalfStar ? 'text-yellow-400' : 'text-gray-600')}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
        <span className="text-gray-400 text-sm ml-1">({rating})</span>
      </div>
    );
  };

  // STATE RENDERING
  if (dataStatus === 'no-data') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Journey</h3>
        <p className="text-gray-500">Please wait while we prepare your personalized itinerary...</p>
      </div>
    );
  }

  if (dataStatus === 'no-plans') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-4">
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Itinerary Found</h3>
        <p className="text-gray-500">We couldn't find any planned activities for this trip.</p>
      </div>
    );
  }

  if (dataStatus === 'error') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Something Went Wrong</h3>
        <p className="text-gray-500">Unable to load itinerary data. Please try again later.</p>
      </div>
    );
  }

  // MAIN PROFESSIONAL UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium tracking-wide">CURATED JOURNEY</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Places To Visit
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              Discover handpicked destinations, hidden gems, and unforgettable experiences 
              tailored just for you.
            </p>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-gray-50" preserveAspectRatio="none" viewBox="0 0 1440 54" fill="currentColor">
            <path d="M0 22L120 16.7C240 11 480 0 720 0C960 0 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"/>
          </svg>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoadingImages && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-full shadow-lg px-5 py-3 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700 text-sm font-medium">Loading images...</span>
          </div>
        </div>
      )}

      {/* Itinerary Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {displayPlans.map((day, dayIndex) => (
            <div key={day.day || dayIndex} className="relative">
              {/* Day Connector Line */}
              {dayIndex < displayPlans.length - 1 && (
                <div className="absolute left-8 top-32 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent hidden lg:block"></div>
              )}
              
              {/* Day Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Day Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-6 py-5 md:px-8 md:py-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl font-bold">{day.day}</span>
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                          {day.theme || `Day ${day.day}`}
                        </h2>
                        {day.date && (
                          <p className="text-gray-500 text-sm mt-1">{day.date}</p>
                        )}
                        {day.description && (
                          <p className="text-gray-600 text-sm mt-2 max-w-2xl">{day.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-full px-4 py-2">
                      <span className="text-blue-700 text-sm font-semibold">
                        {day.activities.length} {day.activities.length === 1 ? 'Activity' : 'Activities'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activities Grid */}
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {day.activities.length > 0 ? (
                      day.activities.map((activity, actIndex) => (
                        <div 
                          key={activity.id || actIndex}
                          className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                          {/* Image Section */}
                          <div className="relative h-48 overflow-hidden bg-gray-100">
                            <img 
                              src={activity.placeImageURL} 
                              alt={activity.placeName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = '/api/placeholder/400/300';
                              }}
                            />
                            {activity.isPremium && (
                              <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                PREMIUM
                              </div>
                            )}
                            {activity.category && (
                              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                                {activity.category}
                              </div>
                            )}
                          </div>

                          {/* Content Section - CRITICAL: Place name is clearly visible here */}
                          <div className="p-5">
                            {/* Place Name - Large and prominent */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {activity.placeName}
                            </h3>
                            
                            {/* Rating */}
                            {activity.rating && <RatingStars rating={activity.rating} />}
                            
                            {/* Time Info */}
                            {activity.timeRange && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{activity.timeRange}</span>
                              </div>
                            )}
                            
                            {/* Duration */}
                            {activity.duration && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Duration: {activity.duration}</span>
                              </div>
                            )}
                            
                            {/* Best Time */}
                            {activity.bestVisitTime && activity.bestVisitTime !== 'Anytime' && (
                              <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span>Best time: {activity.bestVisitTime}</span>
                              </div>
                            )}
                            
                            {/* Price */}
                            {activity.ticketPrice && (
                              <div className="flex items-center gap-2 text-sm mt-3 pt-3 border-t border-gray-100">
                                <span className={`font-semibold ${activity.ticketPrice === 'Free' ? 'text-green-600' : 'text-gray-900'}`}>
                                  {activity.ticketPrice}
                                </span>
                              </div>
                            )}
                            
                            {/* Description - if available */}
                            {activity.placeDetails && (
                              <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                                {activity.placeDetails}
                              </p>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                              <a
                                href={activity.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                View on Map
                              </a>
                              
                              {activity.tips && (
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Travel Tips">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">No activities planned for this day</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Plan Your Perfect Journey</h3>
            <p className="text-gray-600 mb-4">Need help customizing your itinerary?</p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Travel Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlacesToVisit;