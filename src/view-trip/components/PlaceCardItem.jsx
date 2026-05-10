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
//         <h3 className="text-xl font-bold mb-2 text-gray-800">{place.placeName}</h3>

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
//               <p className="text-gray-600 text-sm">{place.placeDetails}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlaceCardItem;


import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';

import { GetPlaceDetails } from '@/service/GlobalApi';

import {
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
} from 'react-icons/fa';

const GOOGLE_API_KEY =
  import.meta.env
    .VITE_GOOGLE_PLACE_API_KEY || '';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop';

const PHOTO_REF_URL = (
  photoName
) =>
  GOOGLE_API_KEY
    ? `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1000&key=${GOOGLE_API_KEY}`
    : FALLBACK_IMAGE;

function PlaceCardItem({
  place,
}) {
  const [imageUrl, setImageUrl] =
    useState(
      place?.placeImageURL &&
        place.placeImageURL !==
          '/placeholder-location.jpg'
        ? place.placeImageURL
        : FALLBACK_IMAGE
    );

  const [isLoading, setIsLoading] =
    useState(false);

  // FETCH GOOGLE PLACE IMAGE
  const fetchPlacePhoto =
    useCallback(async () => {
      if (
        imageUrl &&
        imageUrl !== FALLBACK_IMAGE
      ) {
        return;
      }

      if (!place?.placeName) return;

      try {
        setIsLoading(true);

        const response =
          await GetPlaceDetails({
            textQuery:
              place.placeName,
          });

        console.log(
          'Google Place Response:',
          response?.data
        );

        const photo =
          response?.data?.places?.[0]
            ?.photos?.[0];

        if (photo?.name) {
          setImageUrl(
            PHOTO_REF_URL(
              photo.name
            )
          );
        }
      } catch (error) {
        console.error(
          'Failed to fetch place photo:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    }, [place?.placeName]);

  useEffect(() => {
    fetchPlacePhoto();
  }, [fetchPlacePhoto]);

  return (
    <div
      className="
        bg-[#f8f9fb]
        rounded-3xl
        overflow-hidden
        border
        border-gray-300
        shadow-xl
        hover:shadow-2xl
        hover:-translate-y-2
        transition-all
        duration-300
        min-h-[650px]
        flex
        flex-col
      "
    >
      {/* IMAGE SECTION */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">

        {/* LOADER */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">

            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}

        {/* IMAGE */}
        <img
          src={imageUrl}
          alt={
            place?.placeName ||
            'Destination'
          }
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            hover:scale-110
          "
          onError={(e) => {
            e.target.src =
              FALLBACK_IMAGE;
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        {/* MAP BUTTON */}
        {place?.mapsUrl && (
          <a
            href={place.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              absolute
              top-4
              right-4
              bg-white
              p-3
              rounded-full
              shadow-lg
              hover:bg-black
              hover:text-white
              transition-all
              duration-300
            "
          >
            <FaMapMarkerAlt className="text-lg" />
          </a>
        )}

        {/* PLACE NAME */}
        <div className="absolute bottom-5 left-5 right-5">

          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            {place?.placeName ||
              'Unknown Destination'}
          </h2>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col flex-1">

        {/* DESCRIPTION */}
        <p className="text-gray-700 leading-relaxed text-[15px] mb-6 line-clamp-4">

          {place?.placeDetails ||
            'Explore this beautiful travel destination and enjoy unforgettable experiences carefully curated for your journey.'}
        </p>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* BEST TIME */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">

            <div className="flex items-center gap-2 mb-2">

              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">

                <FaClock />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                  Best Time
                </p>

                <p className="text-sm font-bold text-black">
                  {place?.bestVisitTime ||
                    'Flexible'}
                </p>
              </div>
            </div>
          </div>

          {/* PRICE */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">

            <div className="flex items-center gap-2 mb-2">

              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">

                <FaTicketAlt />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                  Ticket Price
                </p>

                <p className="text-sm font-bold text-black">
                  {place?.ticketPrice ||
                    'Free'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DURATION */}
        <div className="bg-black rounded-2xl p-5 mb-6 text-white shadow-lg">

          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
            Estimated Duration
          </p>

          <h3 className="text-2xl font-bold">
            {place?.duration ||
              '2-3 Hours'}
          </h3>
        </div>

        {/* BUTTON */}
        {place?.mapsUrl && (
          <a
            href={place.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-auto
              w-full
              bg-black
              text-gray
              py-4
              rounded-2xl
              font-semibold
              text-center
              hover:bg-gray-900
              transition-all
              duration-300
              shadow-lg
            "
          >
            Explore Destination
          </a>
        )}
      </div>
    </div>
  );
}

export default PlaceCardItem;