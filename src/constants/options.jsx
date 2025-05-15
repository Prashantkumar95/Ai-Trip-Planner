import { FaUser, FaHeart, FaUsers, FaMoneyBillAlt, FaBalanceScale, FaGem ,FaUserFriends} from 'react-icons/fa';

export const SelecteTravelList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole traveler in exploration",
    icon: <FaUser />, // Icon for "Just Me"
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travelers in tandem",
    icon: <FaHeart />, // Icon for "A Couple"
    people: "2 People",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of fun-loving adventurers",
    icon: <FaUsers />, // Icon for "Family"
    people: "3 to 5 People",
  },
  {
    id: 4,
    title: "Friends",
    desc: "A bunch of thrill-seekess",
    icon: <FaUserFriends />, // Icon for "Friends"
    people: "5 to 10 People",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: <FaMoneyBillAlt />, // Icon for "Cheap"
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep costs on the average side",
    icon: <FaBalanceScale />, // Icon for "Moderate"
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Don't worry about cost",
    icon: <FaGem />, // Icon for "Luxury"
  },
];


// export const AI_PROMPT='Generate Tarvel Plan for Location : {location},for {totalDays} Days for {traveler} with a {budget} budget,give me Hotels options list days with each day plan with best time to visit in JSON format.'

export const AI_PROMPT = 'Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. Provide: 1) Hotel options list with name, address, price, image URL, coordinates, rating, and description. 2) Daily itinerary with place name, details, image URL, coordinates, ticket price, best visit time, and duration. Return ONLY valid JSON.';