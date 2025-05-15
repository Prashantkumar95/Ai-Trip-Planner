import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaShieldAlt, 
  FaInfoCircle, 
  FaStar, 
  FaHotel, 
  FaSwimmingPool, 
  FaUmbrellaBeach,
  FaWifi,
  FaParking,
  FaUtensils,
  FaGlassCheers,
  FaSnowflake,
  FaSpa
} from 'react-icons/fa';
import { GetPlaceDetails } from '@/service/GlobalApi';

// Premium hotel and resort images from Unsplash
const HOTEL_IMAGES = {
  // Luxury Hotels
  luxury: [
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1535827841776-24af3b6d188f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  
  // Budget Hotels
  budget: [
    'https://images.unsplash.com/photo-1582719471386-8b6d6b457a9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1560073748-41fef9e6b9e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1566073771273-5a37a8a3b8e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  
  // Beach Resorts
  resort: [
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  
  // City Hotels
  city: [
    'https://images.unsplash.com/photo-1445991842772-097fea258e7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1485872299829-c673f5194813?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  
  // Default
  default: [
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ]
};

// Icons for different property types
const PROPERTY_ICONS = {
  hotel: <FaHotel className="text-blue-500" />,
  resort: <FaSwimmingPool className="text-teal-500" />,
  beach: <FaUmbrellaBeach className="text-yellow-500" />,
  luxury: <FaStar className="text-gold-500" />,
  spa: <FaSpa className="text-pink-500" />,
  mountain: <FaSnowflake className="text-blue-300" />,
  default: <FaHotel className="text-gray-500" />
};

// Amenity icons
const AMENITY_ICONS = {
  wifi: <FaWifi className="text-blue-400" />,
  parking: <FaParking className="text-gray-600" />,
  restaurant: <FaUtensils className="text-red-500" />,
  bar: <FaGlassCheers className="text-purple-500" />,
  pool: <FaSwimmingPool className="text-blue-300" />,
  spa: <FaSpa className="text-pink-400" />,
  beach: <FaUmbrellaBeach className="text-yellow-500" />
};

function Hotels({ tripdata }) {
  const hotels = tripdata?.tripData?.hotelOptions || tripdata?.hotelOptions || [];
  const [propertyPhotos, setPropertyPhotos] = useState({});
  const [loading, setLoading] = useState(true);

  // Determine property type
  const getPropertyType = (property) => {
    const name = property.hotelName?.toLowerCase() || '';
    const desc = property.description?.toLowerCase() || '';
    const amenities = property.amenities?.join(' ')?.toLowerCase() || '';
    
    if (name.includes('resort') || desc.includes('resort') || amenities.includes('resort')) 
      return 'resort';
    if (name.includes('spa') || desc.includes('spa') || amenities.includes('spa')) 
      return 'spa';
    if (name.includes('beach') || desc.includes('beach') || amenities.includes('beach')) 
      return 'beach';
    if (name.includes('luxury') || desc.includes('luxury') || name.includes('5 star')) 
      return 'luxury';
    if (name.includes('mountain') || desc.includes('mountain') || amenities.includes('ski')) 
      return 'mountain';
    
    return name.includes('hotel') ? 'hotel' : 'default';
  };

  // Get random image for property type
  const getPropertyImage = (type) => {
    const images = HOTEL_IMAGES[type] || HOTEL_IMAGES.default;
    return images[Math.floor(Math.random() * images.length)];
  };

  // Fetch property photos
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      const photos = {};

      for (const property of hotels) {
        const name = property.hotelName;
        if (!name) continue;

        try {
          const res = await GetPlaceDetails({ textQuery: name });
          const photoName = res.data?.places?.[0]?.photos?.[0]?.name;

          if (photoName) {
            photos[name] = `https://places.googleapis.com/v1/${photoName}/media?key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
          } else {
            photos[name] = getPropertyImage(getPropertyType(property));
          }
        } catch (error) {
          console.error(`Error fetching photo for ${name}:`, error);
          photos[name] = getPropertyImage(getPropertyType(property));
        }
      }

      setPropertyPhotos(photos);
      setLoading(false);
    };

    if (hotels.length) fetchPhotos();
    else setLoading(false);
  }, [hotels]);

  // ... [rest of the component code remains the same, 
  // just replace hotel-specific references with property references]

  return (
    <section className="mt-12">
      <div className="flex items-center mb-8">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <FaHotel className="text-blue-600 text-2xl" />
        </div>
        <h2 className="text-3xl font-bold">Accommodation Options</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-8">
          <FaHotel className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">No accommodation options available for this trip.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((property, index) => {
            const propertyType = getPropertyType(property);
            const propertyImage = propertyPhotos[property.hotelName] || getPropertyImage(propertyType);
            const PropertyIcon = PROPERTY_ICONS[propertyType] || PROPERTY_ICONS.default;

            return (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white">
                <div className="relative h-48 overflow-hidden group">
                  <img 
                    src={propertyImage}
                    alt={property.hotelName || "Property image"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = getPropertyImage(propertyType);
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-white/80 rounded-full p-2 shadow">
                    {PropertyIcon}
                  </div>
                  {property.rating && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{property.rating}</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{property.hotelName || "Premium Accommodation"}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{property.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-green-600">
                      {property.price || 'Contact for pricing'}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {propertyType.toUpperCase()}
                    </span>
                  </div>

                  {property.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {property.amenities.slice(0, 4).map((amenity, i) => (
                        <div key={i} className="flex items-center text-xs text-gray-600">
                          {AMENITY_ICONS[amenity.toLowerCase()] || <FaInfoCircle />}
                          <span className="ml-1">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <a
                    href={property.bookingLink || `https://www.google.com/search?q=${encodeURIComponent(property.hotelName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-2 text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Hotels;