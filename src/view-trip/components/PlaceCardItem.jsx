// import React, { useEffect, useState, useCallback } from 'react';
// import { GetPlaceDetails } from '@/service/GlobalApi';
// import { FaMapMarkerAlt, FaClock, FaTicketAlt, FaInfoCircle, FaHourglassHalf } from 'react-icons/fa';

// const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY || '';

// const PHOTO_REF_URL = (ref) =>
//   GOOGLE_API_KEY
//     ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${GOOGLE_API_KEY}`
//     : '/placeholder-location.jpg';

// const PlaceCardItem = ({ place }) => {
//   const [imageUrl, setImageUrl] = useState(
//     place.placeImageURL && place.placeImageURL !== '/placeholder-location.jpg'
//       ? place.placeImageURL
//       : '/placeholder-location.jpg'
//   );

//   const fetchPlacePhoto = useCallback(async () => {
//     if (imageUrl !== '/placeholder-location.jpg') return; // Already have a valid image

//     try {
//       const data = { textQuery: place.placeName };
//       const response = await GetPlaceDetails(data);
//       const photoRef = response?.data?.photos?.[0]?.photo_reference;

//       if (photoRef) {
//         setImageUrl(PHOTO_REF_URL(photoRef));
//       }
//     } catch (error) {
//       console.error('Failed to fetch place photo:', error);
//     }
//   }, [place.placeName, imageUrl]);

//   useEffect(() => {
//     fetchPlacePhoto();
//   }, [fetchPlacePhoto]);

//   return (
//     <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
//       {/* Place Image */}
//       <div className="relative h-48 overflow-hidden">
//         <img
//           src={imageUrl}
//           alt={`Image of ${place.placeName || 'place'}`}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             e.target.src = '/placeholder-location.jpg';
//           }}
//         />
//         {/* Google Maps Link */}
//         {place.mapsUrl && (
//           <a
//             href={place.mapsUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors"
//             title="Open in Google Maps"
//           >
//             <FaMapMarkerAlt className="text-red-500 text-lg" />
//           </a>
//         )}
//       </div>

//       {/* Place Details */}
//       <div className="p-4 flex-1 flex flex-col">
//         <h3 className="text-xl font-bold mb-2 text-black-800">{place.placeName}</h3>

//         <div className="flex items-center mb-1">
//           <FaClock className="text-gray-500 mr-2" />
//           <span className="text-gray-600">
//             <span className="font-semibold">Best time:</span> {place.bestVisitTime}
//           </span>
//         </div>

//         <div className="flex items-center mb-1">
//           <FaHourglassHalf className="text-gray-500 mr-2" />
//           <span className="text-gray-600">
//             <span className="font-semibold">Duration:</span> {place.duration}
//           </span>
//         </div>

//         <div className="flex items-center mb-3">
//           <FaTicketAlt className="text-gray-500 mr-2" />
//           <span className="text-gray-600">
//             <span className="font-semibold">Price:</span> {place.ticketPrice}
//           </span>
//         </div>

//         {place.placeDetails && (
//           <div className="mt-auto pt-2 border-t border-gray-100">
//             <div className="flex items-start">
//               <FaInfoCircle className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
//               <p className="text-black-600 text-sm">{place.placeDetails}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlaceCardItem;


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

import React, { useEffect, useState, useCallback } from 'react';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { FaMapMarkerAlt, FaClock, FaTicketAlt, FaInfoCircle, FaHourglassHalf } from 'react-icons/fa';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY || '';

const PHOTO_REF_URL = (ref) =>
  GOOGLE_API_KEY
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${GOOGLE_API_KEY}`
    : '/placeholder-location.jpg';

const PlaceCardItem = ({ place }) => {
  const [imageUrl, setImageUrl] = useState(
    place.placeImageURL && place.placeImageURL !== '/placeholder-location.jpg'
      ? place.placeImageURL
      : '/placeholder-location.jpg'
  );

  const fetchPlacePhoto = useCallback(async () => {
    if (imageUrl !== '/placeholder-location.jpg') return;

    try {
      const data = { textQuery: place.placeName };
      const response = await GetPlaceDetails(data);
      const photoRef = response?.data?.photos?.[0]?.photo_reference;

      if (photoRef) {
        setImageUrl(PHOTO_REF_URL(photoRef));
      }
    } catch (error) {
      console.error('Failed to fetch place photo:', error);
    }
  }, [place.placeName, imageUrl]);

  useEffect(() => {
    fetchPlacePhoto();
  }, [fetchPlacePhoto]);

  return (
    <div 
      style={{
        backgroundColor: '#000000',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 35px -10px rgba(0,0,0,0.5)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #1a1a1a'
      }}
    >
      {/* Image Section */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#0a0a0a' }}>
        <img
          src={imageUrl}
          alt={place.placeName || 'Place'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = '/placeholder-location.jpg';
          }}
        />
        
        {/* Dark Gradient Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(to top, #000000, transparent)'
        }}></div>
        
        {/* Duration Badge */}
        {place.duration && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: '#000000cc',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid #333'
          }}>
            <FaHourglassHalf style={{ color: '#ffffff', fontSize: '12px' }} />
            <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: '500' }}>{place.duration}</span>
          </div>
        )}
        
        {/* Map Button */}
        {place.mapsUrl && (
          <a
            href={place.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#000000cc',
              backdropFilter: 'blur(8px)',
              padding: '10px',
              borderRadius: '50%',
              border: '1px solid #333',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <FaMapMarkerAlt style={{ color: '#3b82f6', fontSize: '18px' }} />
          </a>
        )}
      </div>

      {/* Content Section - PURE BLACK with BRIGHT WHITE TEXT */}
      <div style={{ padding: '20px', flex: 1, backgroundColor: '#000000' }}>
        
        {/* PLACE NAME - BIG BRIGHT WHITE */}
        <h3 style={{ 
          fontSize: '22px', 
          fontWeight: 'bold', 
          marginBottom: '14px', 
          color: '#ffffff',
          lineHeight: '1.3'
        }}>
          {place.placeName || 'Unnamed Place'}
        </h3>

        {/* Best Time */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
          <FaClock style={{ color: '#3b82f6', marginRight: '10px', marginTop: '2px', fontSize: '14px' }} />
          <div>
            <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 'bold' }}>Best Time: </span>
            <span style={{ color: '#d1d5db', fontSize: '13px' }}>{place.bestVisitTime || 'Anytime'}</span>
          </div>
        </div>

        {/* Price */}
        {place.ticketPrice && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
            <FaTicketAlt style={{ color: '#3b82f6', marginRight: '10px', fontSize: '14px' }} />
            <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 'bold' }}>Price: </span>
            <span style={{ color: '#d1d5db', fontSize: '13px', marginLeft: '4px' }}>{place.ticketPrice}</span>
          </div>
        )}

        {/* Description - NOW FULLY VISIBLE */}
        {place.placeDetails && (
          <div style={{ 
            marginTop: '16px', 
            paddingTop: '16px', 
            borderTop: '1px solid #1a1a1a'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <FaInfoCircle style={{ color: '#3b82f6', marginRight: '10px', marginTop: '2px', fontSize: '13px', flexShrink: 0 }} />
              <p style={{ 
                color: '#9ca3af', 
                fontSize: '13px', 
                lineHeight: '1.6', 
                margin: 0,
                letterSpacing: '0.2px'
              }}>
                {place.placeDetails}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceCardItem;