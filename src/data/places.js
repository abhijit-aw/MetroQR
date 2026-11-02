
// Best places to visit in Pune. Edit freely: add a place by copying one block.
//
// PHOTOS (put files in public/images/):
//   - list your own files using:
//     photos: ["filename.jpg"]
//
// Timings and entry fees change, so most places only say "check before you go".

export const PLACES = [
  {
    slug: "shaniwar-wada",
    name: "Shaniwar Wada",
    category: "History",
    area: "Shaniwar Peth, old Pune",
    summary: "The old fortified palace of the Peshwa rulers.",
    about:
      "Shaniwar Wada was the seat of the Peshwa rulers and stands in the heart of old Pune. The huge stone walls, gates and garden grounds are still there, but the main palace buildings were destroyed in a fire in 1828.",
    highlights: [
      "Huge stone walls and gates",
      "Peshwa-era history",
      "Lotus-shaped fountain remains",
      "Walk to Dagdusheth temple",
    ],
    bestTime: "Early morning for fewer crowds",
    duration: "1 to 2 hours",
    fromRailway: 3.1,
    metro: "Civil Court",
    metroNote: "About a 12 minute walk",
    tips: [
      "Wear comfortable shoes for the stone paths.",
      "Combine it with Dagdusheth temple and Kelkar Museum for one old-city day.",
    ],
    nearby: [
      "dagdusheth-halwai-ganpati-temple",
      "raja-dinkar-kelkar-museum",
      "pataleshwar-cave-temple",
    ],
    photos: ["shaniwar-wada-pune.jpeg"],
  },

  {
    slug: "aga-khan-palace",
    name: "Aga Khan Palace",
    category: "History",
    area: "Kalyani Nagar, Nagar Road",
    summary: "A palace tied to Mahatma Gandhi and the freedom movement.",
    about:
      "Built in 1892 by Sultan Muhammed Shah Aga Khan III, the palace is linked with India's freedom struggle. Mahatma Gandhi, Kasturba Gandhi, Mahadev Desai and Sarojini Naidu were held here, and Kasturba Gandhi and Mahadev Desai died during that time.",
    highlights: [
      "Gandhi memorial and museum",
      "Memorials of Kasturba Gandhi and Mahadev Desai",
      "Gardens and arches",
      "Good for photos",
    ],
    bestTime: "Morning or late afternoon",
    duration: "1 to 2 hours",
    fromRailway: 6.6,
    timings: "9:00 AM to 5:30 PM, daily",
    fee: "Rs 25 for Indian visitors, Rs 300 for foreign visitors",
    tips: [
      "Check the timings and ticket price before you go, they can change.",
      "Dress modestly, it is a memorial.",
    ],
    nearby: ["bund-garden", "shaniwar-wada"],
    photos: ["Aga khan place.jpeg"],
  },

  {
    slug: "dagdusheth-halwai-ganpati-temple",
    name: "Dagdusheth Halwai Ganpati Temple",
    category: "Temple",
    area: "Budhwar Peth",
    summary: "One of the best-known Ganesha temples in Pune.",
    about:
      "Dagdusheth Halwai Ganpati is one of the most visited Ganesha temples in Pune, in Budhwar Peth. It is named after Dagdusheth Halwai, a sweet maker. The temple gets very crowded during the Ganesh festival.",
    highlights: [
      "Famous Ganesha idol",
      "Ganesh festival celebrations",
      "Short distance from Shaniwar Wada",
    ],
    bestTime: "Early morning, avoid festival days if you dislike crowds",
    duration: "30 to 60 minutes",
    fromRailway: 2.9,
    metro: "Civil Court",
    metroNote: "About a 10 minute walk",
    tips: [
      "Go early to avoid long queues.",
      "Check the temple rules for bags and phones.",
    ],
    nearby: [
      "shaniwar-wada",
      "raja-dinkar-kelkar-museum",
      "saras-baug",
    ],
    photos: ["temple.jpeg"],
  },

  {
    slug: "raja-dinkar-kelkar-museum",
    name: "Raja Dinkar Kelkar Museum",
    category: "Museum",
    area: "Shukrawar Peth, off Bajirao Road",
    summary:
      "A museum of everyday objects, art and crafts from India's past.",
    about:
      "The museum holds a large private collection gathered by Dinkar Gangadhar Kelkar and named after his son Raja. It shows how people lived, with objects such as pots, lamps, musical instruments and carved woodwork.",
    highlights: [
      "Large collection of everyday objects",
      "Carved woodwork and crafts",
      "Easy to combine with Shaniwar Wada",
    ],
    bestTime: "Weekday mornings",
    duration: "2 to 3 hours",
    fromRailway: 4.5,
    metro: "Mandai",
    metroNote: "About 1 km away",
    tips: [
      "Read the exhibit descriptions, they are the best part.",
      "Check the museum timings and closing day before you go.",
    ],
    nearby: [
      "shaniwar-wada",
      "dagdusheth-halwai-ganpati-temple",
      "saras-baug",
      "pataleshwar-cave-temple",
    ],
    photos: ["museum.jpeg"],
  },

  {
    slug: "pataleshwar-cave-temple",
    name: "Pataleshwar Cave Temple",
    category: "Temple",
    area: "Jangli Maharaj Road, Shivajinagar",
    summary: "An ancient Shiva temple carved out of one rock.",
    about:
      "Pataleshwar is an ancient rock-cut cave temple dedicated to Lord Shiva, usually dated to the 8th century. The whole shrine is carved from a single rock, right in the middle of the busy city.",
    highlights: [
      "Rock-cut temple",
      "Quiet and cool inside",
      "Round Nandi pavilion",
    ],
    bestTime: "Morning or evening",
    duration: "30 to 45 minutes",
    fromRailway: 2.5,
    tips: [
      "It is a short stop, pair it with Shaniwar Wada or Kelkar Museum.",
    ],
    nearby: [
      "shaniwar-wada",
      "raja-dinkar-kelkar-museum",
      "dagdusheth-halwai-ganpati-temple",
    ],
    photos: ["pataleshwar cave temple.jpeg"],
  },

  {
    slug: "saras-baug",
    name: "Saras Baug",
    category: "Garden",
    area: "Sadashiv Peth",
    summary: "A garden with a Ganpati temple, popular for evening walks.",
    about:
      "Saras Baug is a green park with a well-known Ganpati temple. People come here for a lazy, peaceful evening and the view of the setting sun.",
    highlights: [
      "Ganpati temple",
      "Evening walks",
      "Good for families",
    ],
    bestTime: "Evening",
    duration: "1 hour",
    fromRailway: 5.4,
    tips: [
      "It is close to Parvati Hill, so you can visit both.",
    ],
    nearby: [
      "parvati-hill",
      "dagdusheth-halwai-ganpati-temple",
      "raja-dinkar-kelkar-museum",
    ],
    photos: ["Saras baug.jpeg"],
  },

  {
    slug: "parvati-hill",
    name: "Parvati Hill",
    category: "Temple",
    area: "Parvati Paytha",
    summary: "A hilltop temple complex with a view over Pune.",
    about:
      "Parvati Hill has a group of old temples at the top and gives a wide view over the city. Many people walk up in the early morning.",
    highlights: [
      "Hilltop temples",
      "City views",
      "Sunrise and sunset walks",
    ],
    bestTime: "Sunrise or sunset",
    duration: "1 to 2 hours",
    tips: [
      "Wear shoes with a good grip.",
      "Carry water, there is a climb.",
    ],
    nearby: ["saras-baug"],
    photos: ["Paravti hill.jpeg"],
  },

  {
    slug: "sinhagad-fort",
    name: "Sinhagad Fort",
    category: "Fort",
    area: "About 35 km southwest of Pune",
    summary: "A hill fort with views of the Sahyadri hills.",
    about:
      "Sinhagad is a hill fort around 35 km southwest of Pune. It is known for the Battle of Sinhagad in 1670, where Tanaji Malusare died. Visitors come for the history, the views and the climb.",
    highlights: [
      "Views of the Sahyadri hills",
      "Trek or drive up",
      "Monsoon mist and greenery",
    ],
    bestTime: "Monsoon and winter mornings",
    duration: "Half a day including travel",
    tips: [
      "Start early, it gets crowded on weekends.",
      "In the rains the paths are slippery, wear proper shoes.",
      "There is no metro, go by road.",
    ],
    nearby: [
      "khadakwasla-dam",
      "okayama-friendship-garden",
    ],
    photos: ["Sinhagad fort.jpeg"],
  },

  {
    slug: "khadakwasla-dam",
    name: "Khadakwasla Dam",
    category: "Lake",
    area: "South-west edge of Pune",
    summary: "A big reservoir with an evening crowd and snack stalls.",
    about:
      "Khadakwasla is a dam and reservoir on the south-west side of the city. It is a favourite place for an evening outing, especially in the monsoon.",
    highlights: [
      "Lake and dam views",
      "Evening street snacks",
      "On the way to Sinhagad",
    ],
    bestTime: "Evening, and the monsoon",
    duration: "1 to 2 hours",
    tips: [
      "Be careful near the water, especially in the rains.",
      "It can be very crowded on weekends.",
    ],
    nearby: [
      "sinhagad-fort",
      "okayama-friendship-garden",
    ],
    photos: ["Khadakwasala dam.jpeg"],
  },

  {
    slug: "okayama-friendship-garden",
    name: "Okayama Friendship Garden",
    category: "Garden",
    area: "Sinhagad Road",
    summary:
      "A Japanese-style garden, named for Pune's sister city Okayama.",
    about:
      "The Pu La Deshpande Udyan, also called the Okayama Friendship Garden, is a Japanese-style garden on Sinhagad Road. It is linked to Pune's sister city Okayama in Japan.",
    highlights: [
      "Japanese-style layout",
      "Walking paths",
      "Good for a quiet evening",
    ],
    bestTime: "Late afternoon",
    duration: "1 to 2 hours",
    tips: [
      "Check the opening hours and entry fee before you go.",
    ],
    nearby: [
      "khadakwasla-dam",
      "sinhagad-fort",
    ],
    photos: ["garden.jpeg"],
  },

  {
    slug: "bund-garden",
    name: "Bund Garden",
    category: "Garden",
    area: "Along the Mula-Mutha river",
    summary:
      "A riverside park next to a Pune Metro station of the same name.",
    about:
      "Bund Garden is a park along the Mula-Mutha river, near the old Fitzgerald Bridge. The Aqua Line has a station called Bund Garden, which makes it one of the easiest places to reach by metro.",
    highlights: [
      "River views",
      "Evening walks",
      "Metro station next to it",
    ],
    bestTime: "Evening",
    duration: "1 hour",
    metro: "Bund Garden",
    metroNote: "Aqua Line station with the same name",
    tips: [
      "Good first stop before visiting Aga Khan Palace.",
    ],
    nearby: ["aga-khan-palace"],
    photos: ["Bund garden.jpeg"],
  },

  {
    slug: "pashan-lake",
    name: "Pashan Lake",
    category: "Lake",
    area: "Pashan, west Pune",
    summary: "A quiet lake that is popular with bird watchers.",
    about:
      "Pashan Lake is a calm lake on the western side of Pune. It is known as a bird watching spot, especially in the cooler months.",
    highlights: [
      "Bird watching",
      "Quiet walks",
      "Sunrise views",
    ],
    bestTime: "Winter mornings",
    duration: "1 to 2 hours",
    tips: [
      "Carry binoculars if you have them.",
      "Go early, the birds are most active in the morning.",
    ],
    nearby: [],
    photos: ["lake.jpg"],
  },

  {
    slug: "shri-swaminarayan-temple",
    name: "Shri Swaminarayan Temple",
    category: "Temple",
    area: "Narhe-Ambegaon, Pune",
    summary:
      "A Swaminarayan temple in the Narhe-Ambegaon area of Pune.",
    about:
      "Shri Swaminarayan Temple is in the Narhe-Ambegaon area on the southern side of Pune. Check the darshan timings and any dress rules before you go.",
    highlights: [
      "Temple darshan",
    ],
    bestTime: "Morning",
    duration: "About 1 hour",
    tips: [
      "Check the temple timings and rules before you go.",
    ],
    nearby: [],
    photos: ["temple.jpeg"],
  },
];

export const CATEGORIES = [
  ...new Set(PLACES.map((p) => p.category)),
];

export const placeBySlug = (slug) =>
  PLACES.find((p) => p.slug === slug);  