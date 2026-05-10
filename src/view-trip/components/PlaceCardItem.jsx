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
    if (imageUrl !== '/placeholder-location.jpg') return; // Already have a valid image

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
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Place Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={`Image of ${place.placeName || 'place'}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-location.jpg';
          }}
        />
        {/* Google Maps Link */}
        {place.mapsUrl && (
          <a
            href={place.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors"
            title="Open in Google Maps"
          >
            <FaMapMarkerAlt className="text-red-500 text-lg" />
          </a>
        )}
      </div>

      {/* Place Details */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{place.placeName}</h3>

        <div className="flex items-center mb-1">
          <FaClock className="text-gray-500 mr-2" />
          <span className="text-gray-600">
            <span className="font-semibold">Best time:</span> {place.bestVisitTime}
          </span>
        </div>

        <div className="flex items-center mb-1">
          <FaHourglassHalf className="text-gray-500 mr-2" />
          <span className="text-gray-600">
            <span className="font-semibold">Duration:</span> {place.duration}
          </span>
        </div>

        <div className="flex items-center mb-3">
          <FaTicketAlt className="text-gray-500 mr-2" />
          <span className="text-gray-600">
            <span className="font-semibold">Price:</span> {place.ticketPrice}
          </span>
        </div>

        {place.placeDetails && (
          <div className="mt-auto pt-2 border-t border-gray-100">
            <div className="flex items-start">
              <FaInfoCircle className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
              <p className="text-gray-600 text-sm">{place.placeDetails}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceCardItem;
