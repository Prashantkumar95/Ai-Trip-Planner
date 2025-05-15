import { GetPlaceDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PHOTO_REF_URL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference={PHOTO_REF}";

// Direct image URLs from free image services
const DEFAULT_IMAGES = {
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  city: 'https://images.unsplash.com/photo-1485872299829-c673f5194813?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  family: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  couple: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  adventure: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  luxury: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  budget: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  generic: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
};

function UserTripCard({ trip }) {
    const [photoUrl, setPhotoUrl] = useState(DEFAULT_IMAGES.generic);
    
    useEffect(() => {
        if (trip) {
            getPlacePhoto();
        }
    }, [trip]);

    const getPlacePhoto = async () => {
        try {
            const data = {
                textQuery: trip?.userSelection?.location?.label
            };
            
            const response = await GetPlaceDetails(data);
            const places = response?.data?.places;
            
            if (places?.length > 0 && places[0].photos?.length > 0) {
                const photoReference = places[0].photos[0].photo_reference;
                const url = PHOTO_REF_URL.replace('{PHOTO_REF}', photoReference);
                setPhotoUrl(url);
            } else {
                setPhotoUrl(getDefaultImage());
            }
        } catch (error) {
            console.error("Error fetching place photo:", error);
            setPhotoUrl(getDefaultImage());
        }
    };

    const getDefaultImage = () => {
        const budgetType = trip?.userSelection?.budget?.title?.toLowerCase();
        const travelGroup = trip?.userSelection?.travelGroup?.title?.toLowerCase();
        const location = trip?.userSelection?.location?.label?.toLowerCase();

        if (budgetType?.includes('luxury')) return DEFAULT_IMAGES.luxury;
        if (budgetType?.includes('budget') || budgetType?.includes('cheap')) return DEFAULT_IMAGES.budget;
        if (travelGroup?.includes('family')) return DEFAULT_IMAGES.family;
        if (travelGroup?.includes('couple')) return DEFAULT_IMAGES.couple;
        if (travelGroup?.includes('adventure')) return DEFAULT_IMAGES.adventure;
        if (location?.includes('beach')) return DEFAULT_IMAGES.beach;
        if (location?.includes('mountain')) return DEFAULT_IMAGES.mountain;
        if (location?.includes('paris') || location?.includes('new york') || location?.includes('city')) 
            return DEFAULT_IMAGES.city;

        return DEFAULT_IMAGES.generic;
    };

    return (
        <Link to={`/view-trip/${trip?.id}`} className="block">
            <div className='hover:scale-105 transition-all'>
                <img 
                    src={photoUrl} 
                    alt={trip?.userSelection?.location?.label || 'Trip destination'} 
                    className='object-cover rounded-xl h-[220px] w-full' 
                    onError={(e) => {
                        e.target.src = getDefaultImage();
                    }}
                />
                <div className="mt-2">
                    <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
                    <h2 className='text-gray-500 text-sm'>
                        Destination: {trip?.userSelection?.location?.label}<br />
                        {trip?.userSelection?.travelGroup?.title} with {trip?.userSelection?.travelGroup?.people} Travelers<br />
                        {trip?.userSelection?.noOfDays} Days Trip with {trip?.userSelection?.budget?.title} Budget
                    </h2>
                </div>
            </div>
        </Link>
    );
}

export default UserTripCard;