// All visible text lives here. To add a new word: add the same key to en, mr and hi.
// To add a new language: add { code, label } to LANGUAGES and a new block below.
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिन्दी' },
];

const en = {
  // navbar
  'nav.home': 'Home', 'nav.book': 'Book Ticket', 'nav.plan': 'Plan Trip', 'nav.stations': 'Stations',
  'nav.map': 'Metro Map', 'nav.timetable': 'Time Table', 'nav.card': 'Metro Card',
  'nav.tickets': 'My Tickets', 'nav.services': 'Services', 'nav.about': 'About',
  'nav.main': 'Main',
  'top.tagline': 'Book · Scan · Ride',
  'top.login': 'Login', 'top.signup': 'Sign up',
  'top.language': 'Change language',
  'top.dark': 'Dark', 'top.light': 'Light',
  'top.toDark': 'Switch to dark mode', 'top.toLight': 'Switch to light mode',
  'top.location': 'Pune, Maharashtra',
  'top.locationTitle': 'Pune Metro service area. Open the metro map.',
  'top.account': 'Account', 'top.accountOf': 'Account of',
  'top.menu': 'Menu', 'top.close': 'Close', 'top.homeAria': 'Metro QR home',

  // footer
  'foot.travel': 'Travel', 'foot.account': 'Account', 'foot.support': 'Support',
  'foot.profile': 'Profile', 'foot.help': 'Help & FAQ', 'foot.privacy': 'Privacy Policy',
  'foot.emergency': 'Emergency Contacts',
  'foot.note': 'Note: This is a demo project and is not the official Pune Metro application.',
  'foot.madeBy': 'Made by Abhijit Awatare ♥',

  // home
  'home.pill': 'Metro tickets, online',
  'home.h1a': 'Skip the queue.', 'home.h1b': 'Ride with a QR.',
  'home.sub': 'Pick your stations, pay once and enter the gate with a single scan.',
  'home.quickBooking': 'Quick booking',
  'home.from': 'From', 'home.to': 'To', 'home.passengers': 'Passengers',
  'home.seeFare': 'See fare', 'home.sameStation': 'Choose two different stations.',
  'home.f1': 'QR entry', 'home.f1d': 'Show your QR code at the gate. No paper ticket.',
  'home.f2': 'Instant fare', 'home.f2d': 'See the fare before you pay.',
  'home.f3': 'Save time', 'home.f3d': 'Skip the counter queue and book in seconds.',
  'home.quickActions': 'Quick actions',
  'home.q1': 'Metro Stations', 'home.q2': 'Fare Enquiry', 'home.q3': 'City Landmarks', 'home.q4': 'Plan My Trip',
  'home.upcoming': 'Upcoming Trip', 'home.last': 'Last Trip',
  'home.loginToSee': 'Login to see your tickets here.',
  'home.noTickets': 'You have no tickets yet. Book one in under a minute.',
  'home.ticketId': 'Ticket ID', 'home.booked': 'Booked', 'home.validTill': 'Valid till',
  'home.bookNew': 'Book a new ticket',
  'home.cardTag': 'Metro Card', 'home.cardTitle': 'Get your Metro Card',
  'home.cardText': 'Recharge once and tap in at the gate.', 'home.cardBtn': 'Get Metro Card',
  'home.cardAlt': 'MetroQR prepaid metro card',
  'home.places': 'Best places in Pune', 'home.seeAllPlaces': 'See all places →',

  // services page
  'svc.map': 'View Map', 'svc.timetable': 'Metro Time Table', 'svc.nearby': 'Nearby Metro Station',
  'svc.advisor': 'Travel Advisor', 'svc.emergency': 'Emergency Contacts', 'svc.feeder': 'Feeder Services', 'svc.toilet': 'Toilet Seva',

  // not found
  'nf.title': 'Page not found', 'nf.home': 'Go to Home',
};

const mr = {
  'nav.home': 'मुख्यपृष्ठ', 'nav.book': 'तिकीट बुक करा', 'nav.plan': 'प्रवास नियोजन', 'nav.stations': 'स्थानके',
  'nav.map': 'मेट्रो नकाशा', 'nav.timetable': 'वेळापत्रक', 'nav.card': 'मेट्रो कार्ड',
  'nav.tickets': 'माझी तिकिटे', 'nav.services': 'सेवा', 'nav.about': 'आमच्याबद्दल',
  'nav.main': 'मुख्य',
  'top.tagline': 'बुक · स्कॅन · राइड',
  'top.login': 'लॉगिन', 'top.signup': 'साइन अप',
  'top.language': 'भाषा बदला',
  'top.dark': 'डार्क', 'top.light': 'लाइट',
  'top.toDark': 'डार्क मोडवर जा', 'top.toLight': 'लाइट मोडवर जा',
  'top.location': 'पुणे, महाराष्ट्र',
  'top.locationTitle': 'पुणे मेट्रो सेवा क्षेत्र. मेट्रो नकाशा उघडा.',
  'top.account': 'खाते', 'top.accountOf': 'खाते:',
  'top.menu': 'मेनू', 'top.close': 'बंद करा', 'top.homeAria': 'मेट्रो QR मुख्यपृष्ठ',

  'foot.travel': 'प्रवास', 'foot.account': 'खाते', 'foot.support': 'मदत',
  'foot.profile': 'प्रोफाइल', 'foot.help': 'मदत आणि FAQ', 'foot.privacy': 'गोपनीयता धोरण',
  'foot.emergency': 'आपत्कालीन संपर्क',
  'foot.note': 'टीप: हा एक डेमो प्रोजेक्ट आहे आणि अधिकृत पुणे मेट्रो ॲप नाही.',
  'foot.madeBy': 'Abhijit Awatare यांनी बनवले ♥',

  'home.pill': 'मेट्रो तिकिटे, ऑनलाइन',
  'home.h1a': 'रांग टाळा.', 'home.h1b': 'QR सोबत प्रवास करा.',
  'home.sub': 'तुमची स्थानके निवडा, एकदाच पैसे भरा आणि एका स्कॅनने गेटमधून आत जा.',
  'home.quickBooking': 'जलद बुकिंग',
  'home.from': 'कुठून', 'home.to': 'कुठे', 'home.passengers': 'प्रवासी',
  'home.seeFare': 'भाडे पहा', 'home.sameStation': 'दोन वेगळी स्थानके निवडा.',
  'home.f1': 'QR प्रवेश', 'home.f1d': 'गेटवर तुमचा QR कोड दाखवा. कागदी तिकीट नको.',
  'home.f2': 'तत्काळ भाडे', 'home.f2d': 'पैसे भरण्याआधी भाडे पहा.',
  'home.f3': 'वेळ वाचवा', 'home.f3d': 'काउंटरवरची रांग टाळा आणि काही सेकंदांत बुक करा.',
  'home.quickActions': 'जलद कृती',
  'home.q1': 'मेट्रो स्थानके', 'home.q2': 'भाडे चौकशी', 'home.q3': 'शहरातील प्रेक्षणीय स्थळे', 'home.q4': 'माझा प्रवास नियोजन',
  'home.upcoming': 'आगामी प्रवास', 'home.last': 'मागील प्रवास',
  'home.loginToSee': 'तुमची तिकिटे इथे पाहण्यासाठी लॉगिन करा.',
  'home.noTickets': 'तुमच्याकडे अजून तिकिटे नाहीत. एका मिनिटात बुक करा.',
  'home.ticketId': 'तिकीट आयडी', 'home.booked': 'बुक केले', 'home.validTill': 'पर्यंत वैध',
  'home.bookNew': 'नवीन तिकीट बुक करा',
  'home.cardTag': 'मेट्रो कार्ड', 'home.cardTitle': 'तुमचे मेट्रो कार्ड मिळवा',
  'home.cardText': 'एकदा रिचार्ज करा आणि गेटवर टॅप करा.', 'home.cardBtn': 'मेट्रो कार्ड मिळवा',
  'home.cardAlt': 'MetroQR प्रीपेड मेट्रो कार्ड',
  'home.places': 'पुण्यातील सर्वोत्तम ठिकाणे', 'home.seeAllPlaces': 'सर्व ठिकाणे पहा →',

  'svc.map': 'नकाशा पहा', 'svc.timetable': 'मेट्रो वेळापत्रक', 'svc.nearby': 'जवळचे मेट्रो स्थानक',
  'svc.advisor': 'प्रवास सल्लागार', 'svc.emergency': 'आपत्कालीन संपर्क', 'svc.feeder': 'फीडर सेवा', 'svc.toilet': 'स्वच्छतागृह सेवा',

  'nf.title': 'पृष्ठ सापडले नाही', 'nf.home': 'मुख्यपृष्ठावर जा',
};

const hi = {
  'nav.home': 'होम', 'nav.book': 'टिकट बुक करें', 'nav.plan': 'यात्रा योजना', 'nav.stations': 'स्टेशन',
  'nav.map': 'मेट्रो मैप', 'nav.timetable': 'समय सारणी', 'nav.card': 'मेट्रो कार्ड',
  'nav.tickets': 'मेरे टिकट', 'nav.services': 'सेवाएं', 'nav.about': 'हमारे बारे में',
  'nav.main': 'मुख्य',
  'top.tagline': 'बुक · स्कैन · राइड',
  'top.login': 'लॉगिन', 'top.signup': 'साइन अप',
  'top.language': 'भाषा बदलें',
  'top.dark': 'डार्क', 'top.light': 'लाइट',
  'top.toDark': 'डार्क मोड चालू करें', 'top.toLight': 'लाइट मोड चालू करें',
  'top.location': 'पुणे, महाराष्ट्र',
  'top.locationTitle': 'पुणे मेट्रो सेवा क्षेत्र. मेट्रो मैप खोलें.',
  'top.account': 'खाता', 'top.accountOf': 'खाता:',
  'top.menu': 'मेन्यू', 'top.close': 'बंद करें', 'top.homeAria': 'मेट्रो QR होम',

  'foot.travel': 'यात्रा', 'foot.account': 'खाता', 'foot.support': 'सहायता',
  'foot.profile': 'प्रोफ़ाइल', 'foot.help': 'सहायता और FAQ', 'foot.privacy': 'गोपनीयता नीति',
  'foot.emergency': 'आपातकालीन संपर्क',
  'foot.note': 'नोट: यह एक डेमो प्रोजेक्ट है और आधिकारिक पुणे मेट्रो ऐप नहीं है.',
  'foot.madeBy': 'Abhijit Awatare द्वारा बनाया गया ♥',

  'home.pill': 'मेट्रो टिकट, ऑनलाइन',
  'home.h1a': 'कतार से बचें.', 'home.h1b': 'QR के साथ सफर करें.',
  'home.sub': 'अपने स्टेशन चुनें, एक बार भुगतान करें और एक स्कैन से गेट में प्रवेश करें.',
  'home.quickBooking': 'त्वरित बुकिंग',
  'home.from': 'कहाँ से', 'home.to': 'कहाँ तक', 'home.passengers': 'यात्री',
  'home.seeFare': 'किराया देखें', 'home.sameStation': 'दो अलग स्टेशन चुनें.',
  'home.f1': 'QR एंट्री', 'home.f1d': 'गेट पर अपना QR कोड दिखाएं. कागज़ी टिकट की ज़रूरत नहीं.',
  'home.f2': 'तुरंत किराया', 'home.f2d': 'भुगतान से पहले किराया देखें.',
  'home.f3': 'समय बचाएं', 'home.f3d': 'काउंटर की कतार से बचें और कुछ ही सेकंड में बुक करें.',
  'home.quickActions': 'त्वरित कार्य',
  'home.q1': 'मेट्रो स्टेशन', 'home.q2': 'किराया पूछताछ', 'home.q3': 'शहर के प्रमुख स्थल', 'home.q4': 'मेरी यात्रा की योजना',
  'home.upcoming': 'आगामी यात्रा', 'home.last': 'पिछली यात्रा',
  'home.loginToSee': 'अपने टिकट यहाँ देखने के लिए लॉगिन करें.',
  'home.noTickets': 'आपके पास अभी कोई टिकट नहीं है. एक मिनट में बुक करें.',
  'home.ticketId': 'टिकट आईडी', 'home.booked': 'बुक किया', 'home.validTill': 'तक मान्य',
  'home.bookNew': 'नया टिकट बुक करें',
  'home.cardTag': 'मेट्रो कार्ड', 'home.cardTitle': 'अपना मेट्रो कार्ड पाएं',
  'home.cardText': 'एक बार रिचार्ज करें और गेट पर टैप करें.', 'home.cardBtn': 'मेट्रो कार्ड पाएं',
  'home.cardAlt': 'MetroQR प्रीपेड मेट्रो कार्ड',
  'home.places': 'पुणे के बेहतरीन स्थल', 'home.seeAllPlaces': 'सभी स्थान देखें →',

  'svc.map': 'मैप देखें', 'svc.timetable': 'मेट्रो समय सारणी', 'svc.nearby': 'नज़दीकी मेट्रो स्टेशन',
  'svc.advisor': 'यात्रा सलाहकार', 'svc.emergency': 'आपातकालीन संपर्क', 'svc.feeder': 'फीडर सेवाएं', 'svc.toilet': 'शौचालय सेवा',

  'nf.title': 'पृष्ठ नहीं मिला', 'nf.home': 'होम पर जाएं',
};

export const TRANSLATIONS = { en, mr, hi };
