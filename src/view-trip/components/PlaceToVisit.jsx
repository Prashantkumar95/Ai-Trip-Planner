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
//   const [processedData, setProcessedData] = React.useState([]);
//   const [isLoading, setIsLoading] = React.useState(true);

//   React.useEffect(() => {
//     console.log('TripData received:', tripData);
    
//     let itinerary = [];
    
//     if (tripData?.itinerary && Array.isArray(tripData.itinerary)) {
//       itinerary = tripData.itinerary;
//     } else if (tripData?.tripData?.itinerary && Array.isArray(tripData.tripData.itinerary)) {
//       itinerary = tripData.tripData.itinerary;
//     } else if (Array.isArray(tripData)) {
//       itinerary = tripData;
//     }
    
//     const days = itinerary.map((day, dayIndex) => {
//       let activities = day.activities || day.places || [];
      
//       const processedActivities = activities.map((activity, actIndex) => ({
//         id: `act-${dayIndex}-${actIndex}`,
//         placeName: activity.placeName || activity.name || `Activity ${actIndex + 1}`,
//         duration: activity.duration || '',
//         bestVisitTime: activity.bestVisitTime || activity.bestTime || '',
//         placeDetails: activity.placeDetails || activity.description || '',
//         ticketPrice: activity.ticketPrice || 'Free',
//         mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.placeName || '')}`
//       }));
      
//       return {
//         day: day.day || dayIndex + 1,
//         theme: day.theme || `Day ${day.day || dayIndex + 1}`,
//         activities: processedActivities
//       };
//     });
    
//     setProcessedData(days);
//     setIsLoading(false);
//   }, [tripData]);

//   if (isLoading) {
//     return (
//       <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <div style={{ backgroundColor: '#1a1a1a', padding: '32px', borderRadius: '12px', textAlign: 'center' }}>
//           <div style={{ color: '#fff' }}>Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#000', padding: '32px 16px' }}>
//       <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
//         {/* Header */}
//         <div style={{ textAlign: 'center', marginBottom: '48px' }}>
//           <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>
//             Places To Visit
//           </h1>
//           <p style={{ color: '#9ca3af', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
//             Explore handpicked attractions for your journey
//           </p>
//         </div>

//         {/* Itinerary */}
//         {processedData.map((day) => (
//           <div key={day.day} style={{ marginBottom: '32px' }}>
            
//             {/* Day Header */}
//             <div style={{ 
//               background: 'linear-gradient(135deg, #2563eb, #1e40af)', 
//               padding: '20px', 
//               borderRadius: '12px 12px 0 0',
//               borderBottom: '1px solid #333'
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                 <div style={{ 
//                   backgroundColor: '#fff', 
//                   borderRadius: '50%', 
//                   width: '48px', 
//                   height: '48px', 
//                   display: 'flex', 
//                   alignItems: 'center', 
//                   justifyContent: 'center'
//                 }}>
//                   <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '20px' }}>{day.day}</span>
//                 </div>
//                 <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{day.theme}</h2>
//               </div>
//             </div>

//             {/* Activities Grid */}
//             <div style={{ 
//               backgroundColor: '#111', 
//               padding: '24px', 
//               borderRadius: '0 0 12px 12px',
//               borderLeft: '1px solid #333',
//               borderRight: '1px solid #333',
//               borderBottom: '1px solid #333'
//             }}>
//               <div style={{ 
//                 display: 'grid', 
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
//                 gap: '24px' 
//               }}>
//                 {day.activities.map((activity) => (
//                   <PlaceCardItem key={activity.id} place={activity} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default PlacesToVisit;



import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ tripData = {} }) {
  const [processedData, setProcessedData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let itinerary = [];
    
    if (tripData?.itinerary && Array.isArray(tripData.itinerary)) {
      itinerary = tripData.itinerary;
    } else if (tripData?.tripData?.itinerary && Array.isArray(tripData.tripData.itinerary)) {
      itinerary = tripData.tripData.itinerary;
    } else if (Array.isArray(tripData)) {
      itinerary = tripData;
    }
    
    const days = itinerary.map((day, dayIndex) => {
      let activities = day.activities || day.plan || day.places || [];
      
      const processedActivities = activities.map((activity, actIndex) => ({
        id: `act-${dayIndex}-${actIndex}`,
        placeName: activity.placeName || activity.name || `Activity ${actIndex + 1}`,
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
      <div style={{ backgroundColor: '#000000', padding: '60px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid #1a1a1a', borderTop: '3px solid #f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#6b7280', marginTop: '16px' }}>Loading itinerary...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div style={{ backgroundColor: '#000000', padding: '60px 0', textAlign: 'center' }}>
        <p style={{ color: '#6b7280' }}>No itinerary data available</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000000', padding: '32px 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        
        {processedData.map((day) => (
          <div key={day.day} style={{ marginBottom: '40px' }}>
            
            {/* Day Header - Gold Theme */}
            <div style={{
              background: 'linear-gradient(135deg, #0a0a0a 0%, #000000 100%)',
              borderBottom: `2px solid #f59e0b`,
              padding: '20px 24px',
              borderRadius: '16px 16px 0 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  borderRadius: '12px',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(245,158,11,0.3)'
                }}>
                  <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '24px' }}>{day.day}</span>
                </div>
                <div>
                  <h2 style={{ color: '#ffffff', fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
                    {day.theme}
                  </h2>
                  <p style={{ color: '#f59e0b', fontSize: '13px', marginTop: '4px' }}>
                    ⭐ {day.activities.length} {day.activities.length === 1 ? 'Experience' : 'Experiences'}
                  </p>
                </div>
              </div>
            </div>

            {/* Activities Grid */}
            <div style={{
              backgroundColor: '#000000',
              padding: '24px',
              borderRadius: '0 0 16px 16px',
              borderLeft: '1px solid #1a1a1a',
              borderRight: '1px solid #1a1a1a',
              borderBottom: '1px solid #1a1a1a'
            }}>
              {day.activities.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '24px'
                }}>
                  {day.activities.map((activity) => (
                    <PlaceCardItem key={activity.id} place={activity} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <p style={{ color: '#6b7280' }}>No activities planned for this day</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;