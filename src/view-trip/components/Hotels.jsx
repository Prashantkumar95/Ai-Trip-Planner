import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaShieldAlt, FaInfoCircle, FaStar, FaHotel } from 'react-icons/fa';
import { GetPlaceDetails } from '@/service/GlobalApi';

// Permanent fallback images for different hotel categories
const HOTEL_IMAGES = {
  luxury: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  budget: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  resort: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  boutique: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  business: 'https://images.unsplash.com/photo-1445991842772-097fea258e7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  default: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
};

function Hotels({ tripdata }) {
  const hotels = tripdata?.tripData?.hotelOptions || tripdata?.hotelOptions || [];
  const [hotelPhotos, setHotelPhotos] = useState({});

  // Determine best fallback image based on hotel type
  const getFallbackImage = (hotel) => {
    const name = hotel.hotelName?.toLowerCase() || '';
    const price = hotel.price?.toLowerCase() || '';
    
    if (price.includes('luxury') || name.includes('luxury') || name.includes('5 star')) 
      return HOTEL_IMAGES.luxury;
    if (price.includes('budget') || name.includes('budget') || name.includes('hostel')) 
      return HOTEL_IMAGES.budget;
    if (name.includes('resort')) return HOTEL_IMAGES.resort;
    if (name.includes('boutique')) return HOTEL_IMAGES.boutique;
    if (name.includes('business') || name.includes('suite')) return HOTEL_IMAGES.business;
    
    return HOTEL_IMAGES.default;
  };

  // Fetch photo URLs for each hotel
  useEffect(() => {
    const fetchPhotos = async () => {
      const photos = {};

      for (const hotel of hotels) {
        const name = hotel.hotelName;
        if (!name) continue;

        try {
          const res = await GetPlaceDetails({ textQuery: name });
          const photoName = res.data?.places?.[0]?.photos?.[0]?.name;

          if (photoName) {
            const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
            photos[name] = photoUrl;
          } else {
            photos[name] = getFallbackImage(hotel);
          }
        } catch (error) {
          console.error(`Error fetching photo for ${name}:`, error);
          photos[name] = getFallbackImage(hotel);
        }
      }

      setHotelPhotos(photos);
    };

    if (hotels.length) {
      fetchPhotos();
    }
  }, [hotels]);

  const formatDualCurrency = (priceString) => {
    if (!priceString) return 'Price not available';
    
    const usdMatch = priceString.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    const inrMatch = priceString.match(/₹(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    
    if (inrMatch) return priceString;
    
    if (usdMatch) {
      const usdAmount = parseFloat(usdMatch[1].replace(/,/g, ''));
      const inrAmount = usdAmount * 83.5;
      
      return (
        <span>
          <span className="text-green-600">₹{inrAmount.toLocaleString('en-IN')}</span>
          <span className="text-gray-500 text-sm ml-2">(${usdAmount.toLocaleString('en-US')})</span>
        </span>
      );
    }
    
    return priceString;
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const renderItineraryItem = (item) => (
    <div className="border-l-4 border-blue-500 pl-4 py-3 my-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg">{item.placeName}</h4>
          <p className="text-gray-600">{item.time} • {item.duration}</p>
        </div>
        {item.ticketPrice && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {item.ticketPrice}
          </span>
        )}
      </div>
      <p className="my-2">{item.placeDetails}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {item.geoCoordinates && (
          <a
            href={`https://www.google.com/maps?q=${item.geoCoordinates}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaMapMarkerAlt className="mr-1" />
            View on Map
          </a>
        )}
        {item.securityInfo && (
          <div className="flex items-center text-yellow-600">
            <FaShieldAlt className="mr-1" />
            <span>{item.securityInfo}</span>
          </div>
        )}
        {item.additionalInfo && (
          <div className="flex items-center text-gray-600">
            <FaInfoCircle className="mr-1" />
            <span>{item.additionalInfo}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (!tripdata) return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p>Loading hotel data...</p>
    </div>
  );

  if (!hotels.length) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
          <FaHotel className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Hotel Recommendations</h2>
        <p className="text-gray-600">No hotels available for this trip.</p>
      </div>
    );
  }

  return (
    <section className="mt-12">
      <div className="flex items-center mb-8">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <FaHotel className="text-blue-600 text-2xl" />
        </div>
        <h2 className="text-3xl font-bold">Hotel Recommendations</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel, index) => {
          const hotelPhoto = hotelPhotos[hotel.hotelName] || getFallbackImage(hotel);

          return (
            <div 
              key={index}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white"
            >
              <div className="relative h-48 overflow-hidden group">
                <img 
                  src={hotelPhoto}
                  alt={hotel.hotelName || "Hotel image"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = getFallbackImage(hotel);
                  }}
                />
                {hotel.rating && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{hotel.rating}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{hotel.hotelName || "Unnamed Hotel"}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{hotel.description}</p>
                
                <div className="font-semibold mb-3">
                  {formatDualCurrency(hotel.price)}
                </div>
                
                {hotel.rating && renderRatingStars(parseFloat(hotel.rating))}
                
                <div className="flex flex-wrap gap-2 my-3">
                  {hotel.geoCoordinates && (
                    <a
                      href={`https://www.google.com/maps?q=${hotel.geoCoordinates}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-xs"
                    >
                      <FaMapMarkerAlt className="mr-1" />
                      Map Location
                    </a>
                  )}
                  {hotel.securityRating && (
                    <span className="flex items-center text-yellow-600 text-xs">
                      <FaShieldAlt className="mr-1" />
                      Safety: {hotel.securityRating}/5
                    </span>
                  )}
                </div>
                
                {hotel.hotelAddress && (
                  <p className="text-gray-500 text-xs mb-3">📍 {hotel.hotelAddress}</p>
                )}
                
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(hotel.hotelName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm text-center"
                >
                  View Details & Book
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed itinerary */}
      {tripdata?.itinerary?.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center mb-8">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaInfoCircle className="text-green-600 text-2xl" />
            </div>
            <h2 className="text-3xl font-bold">Detailed Itinerary</h2>
          </div>
          
          {tripdata.itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">{day.day}</h3>
              <div className="bg-white rounded-lg shadow p-5">
                {day.plan.map((activity, activityIndex) => (
                  <div key={activityIndex}>
                    {renderItineraryItem({
                      ...activity,
                      securityInfo: activity.securityLevel 
                        ? `Safety: ${activity.securityLevel} (${getSecurityDescription(activity.securityLevel)})`
                        : null,
                      additionalInfo: activity.bestVisitTime 
                        ? `Best time: ${activity.bestVisitTime}`
                        : null
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Helper for safety descriptions
const getSecurityDescription = (level) => {
  const descriptions = {
    1: 'Use caution',
    2: 'Moderately safe',
    3: 'Generally safe',
    4: 'Very safe',
    5: 'Extremely safe'
  };
  return descriptions[level] || 'Safety info not available';
};

export default Hotels;