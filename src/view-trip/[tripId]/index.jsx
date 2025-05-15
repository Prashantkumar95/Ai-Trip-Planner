import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels'; // Import the Hotels component
import PlacesToVisit from '../components/PlaceToVisit';
import Footer from '../components/Footer';

const ViewTrip = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTripData = async () => {
      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error('Trip not found');
        }

        const data = docSnap.data();
        console.log('Fetched trip data:', data);

        // Transform data to match both components' needs
        const transformedData = {
          destination: data.userSelection?.destination?.label || "Destination not specified",
          duration: data.userSelection?.noOfDays || "Duration not specified",
          budget: data.userSelection?.budget?.title || "Budget not specified",
          travelers: data.userSelection?.travelGroup?.people || "Travelers not specified",
          groupType: data.userSelection?.travelGroup?.title || "Group type not specified",
          imageUrl: data.tripData?.itinerary?.[0]?.plan?.[0]?.placeImageUrl || '/placeholder.png',
          // Prepare hotel data for both InfoSection and Hotels components
          hotels: data.tripData?.hotels?.map(hotel => ({
            hotelName: hotel.hotelName,
            hotelImageURL: hotel.hotelImageUrl || '/hotel-placeholder.jpg',
            rating: hotel.rating,
            price: hotel.price,
            description: hotel.description,
            hotelAddress: hotel.hotelAddress,
            notes: hotel.notes,
            geoCoordinates: hotel.geoCoordinates
          })) || [],
          itinerary: data.tripData?.itinerary || [],
          rawData: data,
          // For Hotels component
          tripData: {
            hotelOptions: data.tripData?.hotels || []
          }
        };

        setTripData(transformedData);
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) getTripData();
  }, [tripId]);

  if (loading) {
    return <div className="text-center py-20">Loading trip details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <h2 className="text-xl font-bold mb-2">Error Loading Trip</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <InfoSection trip={tripData} isLoading={loading} />
      
      {/* Render the Hotels component */}
      <Hotels tripdata={tripData} />

      {/* <PlacesToVisit tripdata={tripData} isLoading={loading} /> */}
      
    
      {/* <Footer  /> */}


      
      {/*  Itinerary Section
      {tripData?.itinerary?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-8">Your Itinerary</h2>
          {tripData.itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">{day.day}</h3>
              <div className="space-y-6">
                {day.plan.map((activity, activityIndex) => (
                  <div key={activityIndex} className="border-l-4 border-blue-500 pl-6 py-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="w-full md:w-1/4">
                        <p className="font-medium text-lg">{activity.time}</p>
                        <p className="text-gray-500">{activity.duration}</p>
                      </div>
                      <div className="w-full md:w-3/4">
                        <h4 className="font-bold text-xl">{activity.placeName}</h4>
                        <p className="text-gray-700 mt-1">{activity.placeDetails}</p>
                        {activity.ticketPrice && activity.ticketPrice !== "Free" && (
                          <p className="text-gray-600 mt-1">Cost: {activity.ticketPrice}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))} 
              </div>
            </div>
          ))}
        </section>
      )} */}
      {/* Itinerary Section with Map */}
{tripData?.itinerary?.length > 0 && (
  <section className="mt-12">
    <h2 className="text-3xl font-bold mb-8">Your Itinerary</h2>
    
    {/* Map Container - You can use Google Maps, Mapbox, or any other mapping service */}
    

    {tripData.itinerary.map((day, dayIndex) => (
  <div key={dayIndex} className="mb-12">
    <h3 className="text-2xl font-semibold mb-6">{day.day}</h3>
    <div className="space-y-6">
      {day.plan.map((activity, activityIndex) => (
        <div key={activityIndex} className="border-l-4 border-blue-500 pl-6 py-2">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-full md:w-1/4">
              <p className="font-medium text-lg">{activity.time}</p>
              <p className="text-gray-500">{activity.duration}</p>
            </div>
            <div className="w-full md:w-3/4">
              <h4 className="font-bold text-xl">{activity.placeName}</h4>
              <p className="text-gray-700 mt-1">{activity.placeDetails}</p>

              {activity.ticketPrice && activity.ticketPrice !== 'Free' && (
                <p className="text-gray-600 mt-1">Cost: {activity.ticketPrice}</p>
              )}

              {/* View on Map Button */}
              <button
                onClick={() =>
                  window.open(
                    activity.location
                      ? `https://www.google.com/maps?q=${activity.location.lat},${activity.location.lng}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.placeName)}`,
                    '_blank'
                  )
                }
                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                View on Map
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
))}


      
      <Footer  />
      {/* Debug section */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-10 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Debug Info</h3>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(tripData?.rawData, null, 2)}
          </pre>
        </div>
      )} */}
    </section>
  )}
</div>
  );
};

export default ViewTrip;