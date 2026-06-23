import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "./context/AuthContext";
import { apiChat, apiAnalyzeImage } from "./utils/api";

const languageNativeName = {
  English: "English",
  Hindi: "Hindi (हिंदी)",
  Telugu: "Telugu (తెలుగు)",
  Tamil: "Tamil (தமிழ்)",
  Kannada: "Kannada (ಕನ್ನಡ)",
  Marathi: "Marathi (मराठी)",
  Punjabi: "Punjabi (ਪੰਜਾਬੀ)",
};


const translations = {
  English: {
    appName: "KisanSaathi",
    tagline: "Farmer Advisory Platform",
    dashboard: "Dashboard", weather: "Weather", market: "Market",
    crops: "Crops", disease: "Disease", schemes: "Schemes", advisor: "AI Advisor",
    weatherTitle: "Live Weather by Location",
    weatherPlaceholder: "Enter city, district or state e.g. Visakhapatnam",
    searchBtn: "Search", loading: "Loading...",
    marketTitle: "Mandi Prices Today",
    cropTitle: "Crop Advisor",
    cropPlaceholder: "e.g. Rice, Wheat, Tomato, Cotton...",
    soilPlaceholder: "e.g. Black, Red, Loamy, Sandy, Clay...",
    getAITips: "Get AI Farming Tips", gettingTips: "Getting AI Tips...",
    diseaseTitle: "AI Disease Diagnosis",
    diseaseDesc: "Upload a photo of your crop OR describe the symptoms below.",
    analyzeBtn: "Diagnose Disease", analyzingBtn: "Analyzing...",
    analyzePhotoBtn: "Analyze Photo",
    chatPlaceholder: "Ask about crops, diseases, schemes...",
    sendBtn: "Send",
    schemesTitle: "Government Schemes",
    eligible: "Eligible", notEligible: "Not Eligible",
    applyNow: "Apply Now →",
    selectLang: "Select Language",
yieldTitle: "Yield & Profit Predictor",
yieldSub: "Enter crop details → Get yield, revenue & profit estimate",
predictBtn: "🌾 Predict Yield & Profit",
predictingBtn: "Predicting...",
soilAnalyzerTitle: "🪨 AI Soil Analyzer",
analyzeSoilBtn: "🔬 Analyze Soil",
analyzingSoilBtn: "Analyzing...",
mandiSub: "Find nearest mandis and today's prices near you",
locationLabel: "Your Location",
findMandisBtn: "🗺️ Find Nearby Mandis",
findingBtn: "Finding...",
calculateBtn: "🧮 Calculate Requirements",
calculatingBtn: "Calculating...",
todayOverview: "Today's Overview",
topSell: "🟢 Top 3 = Good time to sell",
tempLabel: "Temperature", feelsLike: "Feels", moderate: "Moderate", liveData: "Live data",
wheatPrice: "Wheat Price", updating: "Updating...", activeSchemes: "Active Schemes", youreEligible: "You're eligible",
windSpeed: "Wind Speed", todayTasks: "Today's Farm Tasks", yourEligibleSchemes: "Your Eligible Schemes",
quickActions: "Quick Actions", yieldTab: "Yield", soilTab: "Soil AI", mandiTab: "Mandis", seedTab: "Seeds",
farmAlertLabel: "Farm Alert", forecastLabel: "7-Day Forecast", mandiPriceSub: "AI-powered daily mandi prices · Select your state and refresh anytime",
marketTip: "Market Tip", priceChangeIn: "Crops ranked by today's price change in", poweredBy: "Powered by Claude · Ask in any language",
onlineStatus: "Online", addTask: "+ Add", addTaskPlaceholder: "Add a new task...",
cropCalendar: "📅 Crop Calendar", whatToDoThis: "What to do this", harvestPoll: "📊 Harvest Poll",
harvestQuestion: "How is your harvest this season?", welcomeMsg: "Your complete farming companion — weather, markets, crops, disease detection & government schemes in one place.",
refresh: "🔄 Refresh", viewAll: "View All →",
  },
  Hindi: {
    appName: "किसान साथी",
    tagline: "किसान सलाह मंच",
    dashboard: "डैशबोर्ड", weather: "मौसम", market: "बाज़ार",
    crops: "फसलें", disease: "रोग", schemes: "योजनाएं", advisor: "AI सलाहकार",
    weatherTitle: "स्थान के अनुसार मौसम",
    weatherPlaceholder: "शहर, जिला या राज्य दर्ज करें जैसे दिल्ली",
    searchBtn: "खोजें", loading: "लोड हो रहा है...",
    marketTitle: "आज के मंडी भाव",
    cropTitle: "फसल सलाहकार",
    cropPlaceholder: "जैसे धान, गेहूं, टमाटर, कपास...",
    soilPlaceholder: "जैसे काली, लाल, दोमट, रेतीली, चिकनी...",
    getAITips: "AI फसल सुझाव पाएं", gettingTips: "AI सुझाव लोड हो रहे हैं...",
    diseaseTitle: "AI रोग निदान",
    diseaseDesc: "फसल की फोटो अपलोड करें या लक्षण लिखें।",
    analyzeBtn: "रोग पहचानें", analyzingBtn: "विश्लेषण हो रहा है...",
    analyzePhotoBtn: "फोटो विश्लेषण करें",
    chatPlaceholder: "फसल, रोग, योजनाओं के बारे में पूछें...",
    sendBtn: "भेजें",
    schemesTitle: "सरकारी योजनाएं",
    eligible: "पात्र", notEligible: "अपात्र",
    applyNow: "अभी आवेदन करें →",
    selectLang: "भाषा चुनें",
yieldTitle: "उपज और लाभ अनुमान",
yieldSub: "फसल विवरण दर्ज करें → उपज, आय और लाभ जानें",
predictBtn: "🌾 उपज और लाभ का अनुमान लगाएं",
predictingBtn: "अनुमान लगाया जा रहा है...",
soilAnalyzerTitle: "🪨 AI मिट्टी विश्लेषक",
analyzeSoilBtn: "🔬 मिट्टी का विश्लेषण करें",
analyzingSoilBtn: "विश्लेषण हो रहा है...",
mandiSub: "नजदीकी मंडियां और आज के भाव खोजें",
locationLabel: "आपका स्थान",
findMandisBtn: "🗺️ नजदीकी मंडियां खोजें",
findingBtn: "खोजा जा रहा है...",
calculateBtn: "🧮 आवश्यकताएं गणना करें",
calculatingBtn: "गणना हो रही है...",
todayOverview: "आज का सारांश",
topSell: "🟢 शीर्ष 3 = बेचने का अच्छा समय",
tempLabel: "तापमान", feelsLike: "महसूस", moderate: "मध्यम", liveData: "लाइव डेटा",
wheatPrice: "गेहूं भाव", updating: "अपडेट हो रहा है...", activeSchemes: "सक्रिय योजनाएं", youreEligible: "आप पात्र हैं",
windSpeed: "हवा की गति", todayTasks: "आज के खेती के कार्य", yourEligibleSchemes: "आपकी पात्र योजनाएं",
quickActions: "त्वरित कार्रवाई", yieldTab: "उपज", soilTab: "मिट्टी AI", mandiTab: "मंडी", seedTab: "बीज",
farmAlertLabel: "खेत चेतावनी", forecastLabel: "7-दिन का पूर्वानुमान", mandiPriceSub: "AI-संचालित दैनिक मंडी भाव · राज्य चुनें और ताज़ा करें",
marketTip: "बाज़ार टिप", priceChangeIn: "आज के मूल्य परिवर्तन के अनुसार फसलें", poweredBy: "Claude द्वारा संचालित · किसी भी भाषा में पूछें",
onlineStatus: "ऑनलाइन", addTask: "+ जोड़ें", addTaskPlaceholder: "नया काम जोड़ें...",
cropCalendar: "📅 फसल कैलेंडर", whatToDoThis: "इस महीने क्या करें", harvestPoll: "📊 फसल सर्वेक्षण",
harvestQuestion: "इस सीज़न आपकी फसल कैसी है?", welcomeMsg: "मौसम, बाज़ार, फसल, रोग निदान और सरकारी योजनाएं — सब एक जगह।",
refresh: "🔄 ताज़ा करें", viewAll: "सभी देखें →",
  },
  Telugu: {
    appName: "కిసాన్ సాథి",
    tagline: "రైతు సలహా వేదిక",
    dashboard: "డాష్‌బోర్డ్", weather: "వాతావరణం", market: "మార్కెట్",
    crops: "పంటలు", disease: "వ్యాధులు", schemes: "పథకాలు", advisor: "AI సలహాదారు",
    weatherTitle: "స్థానం ఆధారంగా వాతావరణం",
    weatherPlaceholder: "నగరం లేదా జిల్లా పేరు నమోదు చేయండి",
    searchBtn: "వెతకండి", loading: "లోడవుతోంది...",
    marketTitle: "నేటి మండి ధరలు",
    cropTitle: "పంట సలహాదారు",
    cropPlaceholder: "ఉదా. వరి, గోధుమ, టమాటా, పత్తి...",
    soilPlaceholder: "ఉదా. నల్లమట్టి, ఎర్రమట్టి, గరప...",
    getAITips: "AI పంట చిట్కాలు పొందండి", gettingTips: "AI చిట్కాలు లోడవుతున్నాయి...",
    diseaseTitle: "AI వ్యాధి నిర్ధారణ",
    diseaseDesc: "పంట ఫోటో అప్‌లోడ్ చేయండి లేదా లక్షణాలు వివరించండి.",
    analyzeBtn: "వ్యాధి గుర్తించండి", analyzingBtn: "విశ్లేషిస్తోంది...",
    analyzePhotoBtn: "ఫోటో విశ్లేషించండి",
    chatPlaceholder: "పంటలు, వ్యాధులు, పథకాల గురించి అడగండి...",
    sendBtn: "పంపండి",
    schemesTitle: "ప్రభుత్వ పథకాలు",
    eligible: "అర్హులు", notEligible: "అనర్హులు",
    applyNow: "ఇప్పుడు దరఖాస్తు చేయండి →",
    selectLang: "భాష ఎంచుకోండి",
yieldTitle: "దిగుబడి మరియు లాభం అంచనా",
yieldSub: "పంట వివరాలు నమోదు చేయండి → దిగుబడి మరియు లాభం తెలుసుకోండి",
predictBtn: "🌾 దిగుబడి అంచనా వేయండి",
predictingBtn: "అంచనా వేస్తోంది...",
soilAnalyzerTitle: "🪨 AI మట్టి విశ్లేషకుడు",
analyzeSoilBtn: "🔬 మట్టి విశ్లేషించండి",
analyzingSoilBtn: "విశ్లేషిస్తోంది...",
mandiSub: "దగ్గరలోని మండులు మరియు నేటి ధరలు కనుగొనండి",
locationLabel: "మీ స్థానం",
findMandisBtn: "🗺️ దగ్గరి మండులు కనుగొనండి",
findingBtn: "వెతుకుతోంది...",
calculateBtn: "🧮 అవసరాలు లెక్కించండి",
calculatingBtn: "లెక్కిస్తోంది...",
todayOverview: "నేటి సారాంశం",
topSell: "🟢 టాప్ 3 = అమ్మడానికి మంచి సమయం",
tempLabel: "ఉష్ణోగ్రత", feelsLike: "అనిపించే", moderate: "మధ్యస్థంగా", liveData: "నేరుగా డేటా",
wheatPrice: "గోధుమ ధర", updating: "నవీకరిస్తోంది...", activeSchemes: "చురుకైన పథకాలు", youreEligible: "మీరు అర్హులు",
windSpeed: "గాలి వేగం", todayTasks: "నేటి వ్యవసాయ పనులు", yourEligibleSchemes: "మీ అర్హత పథకాలు",
quickActions: "త్వరిత చర్యలు", yieldTab: "దిగుబడి", soilTab: "మట్టి AI", mandiTab: "మండి", seedTab: "విత్తనాలు",
farmAlertLabel: "వ్యవసాయ హెచ్చరిక", forecastLabel: "7-రోజుల అంచనా", mandiPriceSub: "AI-ఆధారిత రోజువారీ మండి ధరలు · మీ రాష్ట్రం ఎంచుకోండి",
marketTip: "మార్కెట్ చిట్కా", priceChangeIn: "నేటి ధర మార్పు ప్రకారం పంటలు", poweredBy: "Claude ద్వారా · ఏ భాషలోనైనా అడగండి",
onlineStatus: "ఆన్‌లైన్", addTask: "+ జోడించు", addTaskPlaceholder: "కొత్త పని జోడించు...",
cropCalendar: "📅 పంట క్యాలెండర్", whatToDoThis: "ఈ నెలలో ఏం చేయాలి", harvestPoll: "📊 దిగుబడి సర్వే",
harvestQuestion: "ఈ సీజన్ మీ దిగుబడి ఎలా ఉంది?", welcomeMsg: "వాతావరణం, మార్కెట్లు, పంటలు, వ్యాధి నిర్ధారణ & ప్రభుత్వ పథకాలు అన్నీ ఒకే చోట.",
refresh: "🔄 రిఫ్రెష్", viewAll: "అన్నీ చూడండి →",
  },
  Tamil: {
    appName: "கிசான் சாதி",
    tagline: "விவசாயி ஆலோசனை தளம்",
    dashboard: "டாஷ்போர்டு", weather: "வானிலை", market: "சந்தை",
    crops: "பயிர்கள்", disease: "நோய்கள்", schemes: "திட்டங்கள்", advisor: "AI ஆலோசகர்",
    weatherTitle: "இடம் சார்ந்த வானிலை",
    weatherPlaceholder: "நகரம் அல்லது மாவட்டம் உள்ளிடுக",
    searchBtn: "தேடு", loading: "ஏற்றுகிறது...",
    marketTitle: "இன்றைய சந்தை விலைகள்",
    cropTitle: "பயிர் ஆலோசகர்",
    cropPlaceholder: "எ.கா. நெல், கோதுமை, தக்காளி...",
    soilPlaceholder: "எ.கா. கருப்பு, சிவப்பு, வண்டல்...",
    getAITips: "AI பயிர் குறிப்புகள் பெறுக", gettingTips: "AI குறிப்புகள் ஏற்றுகின்றன...",
    diseaseTitle: "AI நோய் கண்டறிதல்",
    diseaseDesc: "பயிர் புகைப்படம் பதிவேற்றவும் அல்லது அறிகுறிகளை விவரிக்கவும்.",
    analyzeBtn: "நோய் கண்டறி", analyzingBtn: "பகுப்பாய்வு...",
    analyzePhotoBtn: "புகைப்படம் பகுப்பாய்வு",
    chatPlaceholder: "பயிர்கள், நோய்கள் பற்றி கேளுங்கள்...",
    sendBtn: "அனுப்பு",
    schemesTitle: "அரசு திட்டங்கள்",
    eligible: "தகுதியான", notEligible: "தகுதியற்ற",
    applyNow: "இப்போது விண்ணப்பிக்கவும் →",
    selectLang: "மொழி தேர்வு",
yieldTitle: "விளைச்சல் மற்றும் லாப கணிப்பு",
yieldSub: "பயிர் விவரங்கள் உள்ளிடுக → விளைச்சல் மற்றும் லாபம் அறிக",
predictBtn: "🌾 விளைச்சல் கணிக்கவும்",
predictingBtn: "கணிக்கிறது...",
soilAnalyzerTitle: "🪨 AI மண் பகுப்பாய்வி",
analyzeSoilBtn: "🔬 மண் பகுப்பாய்வு செய்க",
analyzingSoilBtn: "பகுப்பாய்வு செய்கிறது...",
mandiSub: "அருகிலுள்ள சந்தைகள் மற்றும் இன்றைய விலைகள் கண்டறியுங்கள்",
locationLabel: "உங்கள் இடம்",
findMandisBtn: "🗺️ அருகில் சந்தை கண்டறி",
findingBtn: "தேடுகிறது...",
calculateBtn: "🧮 தேவைகளை கணக்கிடுக",
calculatingBtn: "கணக்கிடுகிறது...",
todayOverview: "இன்றைய சுருக்கம்",
topSell: "🟢 முதல் 3 = விற்க நல்ல நேரம்",
tempLabel: "வெப்பநிலை", feelsLike: "உணர்வு", moderate: "மிதமான", liveData: "நேரடி தரவு",
wheatPrice: "கோதுமை விலை", updating: "புதுப்பிக்கிறது...", activeSchemes: "செயலில் திட்டங்கள்", youreEligible: "நீங்கள் தகுதியானவர்",
windSpeed: "காற்று வேகம்", todayTasks: "இன்றைய வேளாண் பணிகள்", yourEligibleSchemes: "உங்கள் தகுதி திட்டங்கள்",
quickActions: "விரைவு நடவடிக்கைகள்", yieldTab: "விளைச்சல்", soilTab: "மண் AI", mandiTab: "சந்தை", seedTab: "விதைகள்",
farmAlertLabel: "வேளாண் எச்சரிக்கை", forecastLabel: "7-நாள் முன்னறிவிப்பு", mandiPriceSub: "AI-இயங்கும் தினசரி சந்தை விலைகள் · உங்கள் மாநிலம் தேர்வு செய்யுங்கள்",
marketTip: "சந்தை குறிப்பு", priceChangeIn: "இன்றைய விலை மாற்றத்தின் படி பயிர்கள்", poweredBy: "Claude மூலம் · எந்த மொழியிலும் கேளுங்கள்",
onlineStatus: "நிகழ்நேரம்", addTask: "+ சேர்", addTaskPlaceholder: "புதிய பணி சேர்க்கவும்...",
cropCalendar: "📅 பயிர் காலண்டர்", whatToDoThis: "இந்த மாதம் என்ன செய்வது", harvestPoll: "📊 அறுவடை கணக்கெடுப்பு",
harvestQuestion: "இந்த சீசனில் உங்கள் அறுவடை எப்படி?", welcomeMsg: "வானிலை, சந்தைகள், பயிர்கள், நோய் கண்டறிதல் & அரசு திட்டங்கள் எல்லாம் ஒரே இடத்தில்.",
refresh: "🔄 புதுப்பி", viewAll: "அனைத்தும் காண →",
  },
  Kannada: {
    appName: "ಕಿಸಾನ್ ಸಾಥಿ",
    tagline: "ರೈತ ಸಲಹಾ ವೇದಿಕೆ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", weather: "ಹವಾಮಾನ", market: "ಮಾರುಕಟ್ಟೆ",
    crops: "ಬೆಳೆಗಳು", disease: "ರೋಗಗಳು", schemes: "ಯೋಜನೆಗಳು", advisor: "AI ಸಲಹೆಗಾರ",
    weatherTitle: "ಸ್ಥಳ ಆಧಾರಿತ ಹವಾಮಾನ",
    weatherPlaceholder: "ನಗರ ಅಥವಾ ಜಿಲ್ಲೆಯ ಹೆಸರು ನಮೂದಿಸಿ",
    searchBtn: "ಹುಡುಕಿ", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    marketTitle: "ಇಂದಿನ ಮಂಡಿ ಬೆಲೆಗಳು",
    cropTitle: "ಬೆಳೆ ಸಲಹೆಗಾರ",
    cropPlaceholder: "ಉದಾ. ಭತ್ತ, ಗೋಧಿ, ಟೊಮೇಟೊ...",
    soilPlaceholder: "ಉದಾ. ಕಪ್ಪು, ಕೆಂಪು, ಮೆಕ್ಕಲು...",
    getAITips: "AI ಬೆಳೆ ಸಲಹೆ ಪಡೆಯಿರಿ", gettingTips: "AI ಸಲಹೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    diseaseTitle: "AI ರೋಗ ಪತ್ತೆ",
    diseaseDesc: "ಬೆಳೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ.",
    analyzeBtn: "ರೋಗ ಗುರುತಿಸಿ", analyzingBtn: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    analyzePhotoBtn: "ಫೋಟೋ ವಿಶ್ಲೇಷಿಸಿ",
    chatPlaceholder: "ಬೆಳೆಗಳು, ರೋಗಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
    sendBtn: "ಕಳುಹಿಸಿ",
    schemesTitle: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    eligible: "ಅರ್ಹ", notEligible: "ಅನರ್ಹ",
    applyNow: "ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ →",
    selectLang: "ಭಾಷೆ ಆಯ್ಕೆ",
yieldTitle: "ಇಳುವರಿ ಮತ್ತು ಲಾಭ ಅಂದಾಜು",
yieldSub: "ಬೆಳೆ ವಿವರ ನಮೂದಿಸಿ → ಇಳುವರಿ ಮತ್ತು ಲಾಭ ತಿಳಿಯಿರಿ",
predictBtn: "🌾 ಇಳುವರಿ ಅಂದಾಜು ಮಾಡಿ",
predictingBtn: "ಅಂದಾಜು ಮಾಡಲಾಗುತ್ತಿದೆ...",
soilAnalyzerTitle: "🪨 AI ಮಣ್ಣು ವಿಶ್ಲೇಷಕ",
analyzeSoilBtn: "🔬 ಮಣ್ಣು ವಿಶ್ಲೇಷಿಸಿ",
analyzingSoilBtn: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
mandiSub: "ಹತ್ತಿರದ ಮಂಡಿಗಳು ಮತ್ತು ಇಂದಿನ ಬೆಲೆಗಳು ಹುಡುಕಿ",
locationLabel: "ನಿಮ್ಮ ಸ್ಥಳ",
findMandisBtn: "🗺️ ಹತ್ತಿರದ ಮಂಡಿ ಹುಡುಕಿ",
findingBtn: "ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
calculateBtn: "🧮 ಅವಶ್ಯಕತೆಗಳು ಲೆಕ್ಕಿಸಿ",
calculatingBtn: "ಲೆಕ್ಕಿಸಲಾಗುತ್ತಿದೆ...",
todayOverview: "ಇಂದಿನ ಸಾರಾಂಶ",
topSell: "🟢 ಟಾಪ್ 3 = ಮಾರಾಟಕ್ಕೆ ಉತ್ತಮ ಸಮಯ",
tempLabel: "ತಾಪಮಾನ", feelsLike: "ಅನಿಸಿಕೆ", moderate: "ಮಧ್ಯಮ", liveData: "ನೇರ ಡೇಟಾ",
wheatPrice: "ಗೋಧಿ ಬೆಲೆ", updating: "ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...", activeSchemes: "ಸಕ್ರಿಯ ಯೋಜನೆಗಳು", youreEligible: "ನೀವು ಅರ್ಹರು",
windSpeed: "ಗಾಳಿ ವೇಗ", todayTasks: "ಇಂದಿನ ಕೃಷಿ ಕಾರ್ಯಗಳು", yourEligibleSchemes: "ನಿಮ್ಮ ಅರ್ಹ ಯೋಜನೆಗಳು",
quickActions: "ತ್ವರಿತ ಕ್ರಮಗಳು", yieldTab: "ಇಳುವರಿ", soilTab: "ಮಣ್ಣು AI", mandiTab: "ಮಂಡಿ", seedTab: "ಬೀಜಗಳು",
farmAlertLabel: "ಕೃಷಿ ಎಚ್ಚರಿಕೆ", forecastLabel: "7-ದಿನದ ಮುನ್ಸೂಚನೆ", mandiPriceSub: "AI-ಆಧಾರಿತ ದೈನಂದಿನ ಮಂಡಿ ಬೆಲೆಗಳು · ನಿಮ್ಮ ರಾಜ್ಯ ಆಯ್ಕೆ ಮಾಡಿ",
marketTip: "ಮಾರುಕಟ್ಟೆ ಸಲಹೆ", priceChangeIn: "ಇಂದಿನ ಬೆಲೆ ಬದಲಾವಣೆಯ ಪ್ರಕಾರ ಬೆಳೆಗಳು", poweredBy: "Claude ಮೂಲಕ · ಯಾವ ಭಾಷೆಯಲ್ಲಿ ಬೇಕಾದರೂ ಕೇಳಿ",
onlineStatus: "ಆನ್‌ಲೈನ್", addTask: "+ ಸೇರಿಸು", addTaskPlaceholder: "ಹೊಸ ಕೆಲಸ ಸೇರಿಸಿ...",
cropCalendar: "📅 ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್", whatToDoThis: "ಈ ತಿಂಗಳು ಏನು ಮಾಡಬೇಕು", harvestPoll: "📊 ಇಳುವರಿ ಸಮೀಕ್ಷೆ",
harvestQuestion: "ಈ ಋತುವಿನಲ್ಲಿ ನಿಮ್ಮ ಇಳುವರಿ ಹೇಗಿದೆ?", welcomeMsg: "ಹವಾಮಾನ, ಮಾರುಕಟ್ಟೆ, ಬೆಳೆಗಳು, ರೋಗ ಪತ್ತೆ & ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಎಲ್ಲವೂ ಒಂದೇ ಕಡೆ.",
refresh: "🔄 ರಿಫ್ರೆಶ್", viewAll: "ಎಲ್ಲ ನೋಡಿ →",
  },
  Marathi: {
    appName: "किसान साथी",
    tagline: "शेतकरी सल्ला मंच",
    dashboard: "डॅशबोर्ड", weather: "हवामान", market: "बाजार",
    crops: "पिके", disease: "रोग", schemes: "योजना", advisor: "AI सल्लागार",
    weatherTitle: "स्थानानुसार हवामान",
    weatherPlaceholder: "शहर किंवा जिल्हा प्रविष्ट करा",
    searchBtn: "शोधा", loading: "लोड होत आहे...",
    marketTitle: "आजचे बाजार भाव",
    cropTitle: "पीक सल्लागार",
    cropPlaceholder: "उदा. भात, गहू, टोमॅटो, कापूस...",
    soilPlaceholder: "उदा. काळी, लाल, गाळाची, वालुकामय...",
    getAITips: "AI पीक सल्ला मिळवा", gettingTips: "AI सल्ला लोड होत आहे...",
    diseaseTitle: "AI रोग निदान",
    diseaseDesc: "पिकाचा फोटो अपलोड करा किंवा लक्षणे सांगा.",
    analyzeBtn: "रोग ओळखा", analyzingBtn: "विश्लेषण होत आहे...",
    analyzePhotoBtn: "फोटो विश्लेषण करा",
    chatPlaceholder: "पिके, रोग, योजनांबद्दल विचारा...",
    sendBtn: "पाठवा",
    schemesTitle: "सरकारी योजना",
    eligible: "पात्र", notEligible: "अपात्र",
    applyNow: "आता अर्ज करा →",
    selectLang: "भाषा निवडा",
yieldTitle: "उत्पादन आणि नफा अंदाज",
yieldSub: "पीक तपशील प्रविष्ट करा → उत्पादन आणि नफा जाणून घ्या",
predictBtn: "🌾 उत्पादन अंदाज करा",
predictingBtn: "अंदाज होत आहे...",
soilAnalyzerTitle: "🪨 AI माती विश्लेषक",
analyzeSoilBtn: "🔬 माती विश्लेषण करा",
analyzingSoilBtn: "विश्लेषण होत आहे...",
mandiSub: "जवळच्या मंड्या आणि आजचे भाव शोधा",
locationLabel: "तुमचे स्थान",
findMandisBtn: "🗺️ जवळच्या मंड्या शोधा",
findingBtn: "शोधत आहे...",
calculateBtn: "🧮 आवश्यकता मोजा",
calculatingBtn: "मोजत आहे...",
todayOverview: "आजचा आढावा",
topSell: "🟢 टॉप 3 = विकण्यासाठी चांगला वेळ",
tempLabel: "तापमान", feelsLike: "जाणवते", moderate: "मध्यम", liveData: "थेट माहिती",
wheatPrice: "गहू भाव", updating: "अपडेट होत आहे...", activeSchemes: "सक्रिय योजना", youreEligible: "तुम्ही पात्र आहात",
windSpeed: "वाऱ्याचा वेग", todayTasks: "आजची शेती कामे", yourEligibleSchemes: "तुमच्या पात्र योजना",
quickActions: "त्वरित कृती", yieldTab: "उत्पादन", soilTab: "माती AI", mandiTab: "मंडी", seedTab: "बियाणे",
farmAlertLabel: "शेती इशारा", forecastLabel: "7-दिवसांचा अंदाज", mandiPriceSub: "AI-चालित दैनिक मंडी भाव · तुमचे राज्य निवडा",
marketTip: "बाजार टिप", priceChangeIn: "आजच्या किंमत बदलानुसार पिके", poweredBy: "Claude द्वारे · कोणत्याही भाषेत विचारा",
onlineStatus: "ऑनलाइन", addTask: "+ जोडा", addTaskPlaceholder: "नवीन काम जोडा...",
cropCalendar: "📅 पीक दिनदर्शिका", whatToDoThis: "या महिन्यात काय करावे", harvestPoll: "📊 कापणी सर्वेक्षण",
harvestQuestion: "या हंगामात तुमची कापणी कशी आहे?", welcomeMsg: "हवामान, बाजार, पिके, रोग निदान आणि सरकारी योजना — सर्व एकाच ठिकाणी.",
refresh: "🔄 रिफ्रेश", viewAll: "सर्व पहा →",
  },
  Punjabi: {
    appName: "ਕਿਸਾਨ ਸਾਥੀ",
    tagline: "ਕਿਸਾਨ ਸਲਾਹ ਮੰਚ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ", weather: "ਮੌਸਮ", market: "ਬਾਜ਼ਾਰ",
    crops: "ਫ਼ਸਲਾਂ", disease: "ਰੋਗ", schemes: "ਯੋਜਨਾਵਾਂ", advisor: "AI ਸਲਾਹਕਾਰ",
    weatherTitle: "ਸਥਾਨ ਅਨੁਸਾਰ ਮੌਸਮ",
    weatherPlaceholder: "ਸ਼ਹਿਰ ਜਾਂ ਜ਼ਿਲ੍ਹਾ ਦਰਜ ਕਰੋ",
    searchBtn: "ਖੋਜੋ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    marketTitle: "ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਅ",
    cropTitle: "ਫ਼ਸਲ ਸਲਾਹਕਾਰ",
    cropPlaceholder: "ਜਿਵੇਂ ਝੋਨਾ, ਕਣਕ, ਟਮਾਟਰ...",
    soilPlaceholder: "ਜਿਵੇਂ ਕਾਲੀ, ਲਾਲ, ਦੋਮਟ...",
    getAITips: "AI ਫ਼ਸਲ ਸੁਝਾਅ ਲਓ", gettingTips: "AI ਸੁਝਾਅ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...",
    diseaseTitle: "AI ਰੋਗ ਨਿਦਾਨ",
    diseaseDesc: "ਫ਼ਸਲ ਦੀ ਫ਼ੋਟੋ ਅਪਲੋਡ ਕਰੋ ਜਾਂ ਲੱਛਣ ਦੱਸੋ।",
    analyzeBtn: "ਰੋਗ ਪਛਾਣੋ", analyzingBtn: "ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...",
    analyzePhotoBtn: "ਫ਼ੋਟੋ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
    chatPlaceholder: "ਫ਼ਸਲਾਂ, ਰੋਗਾਂ ਬਾਰੇ ਪੁੱਛੋ...",
    sendBtn: "ਭੇਜੋ",
    schemesTitle: "ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ",
    eligible: "ਯੋਗ", notEligible: "ਅਯੋਗ",
    applyNow: "ਹੁਣੇ ਅਰਜ਼ੀ ਦਿਓ →",
    selectLang: "ਭਾਸ਼ਾ ਚੁਣੋ",
yieldTitle: "ਝਾੜ ਅਤੇ ਮੁਨਾਫ਼ਾ ਅਨੁਮਾਨ",
yieldSub: "ਫ਼ਸਲ ਵੇਰਵਾ ਦਰਜ ਕਰੋ → ਝਾੜ ਅਤੇ ਮੁਨਾਫ਼ਾ ਜਾਣੋ",
predictBtn: "🌾 ਝਾੜ ਦਾ ਅਨੁਮਾਨ ਲਗਾਓ",
predictingBtn: "ਅਨੁਮਾਨ ਲਗਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...",
soilAnalyzerTitle: "🪨 AI ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਕ",
analyzeSoilBtn: "🔬 ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
analyzingSoilBtn: "ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...",
mandiSub: "ਨਜ਼ਦੀਕੀ ਮੰਡੀਆਂ ਅਤੇ ਅੱਜ ਦੇ ਭਾਅ ਲੱਭੋ",
locationLabel: "ਤੁਹਾਡਾ ਸਥਾਨ",
findMandisBtn: "🗺️ ਨਜ਼ਦੀਕੀ ਮੰਡੀਆਂ ਲੱਭੋ",
findingBtn: "ਲੱਭਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
calculateBtn: "🧮 ਲੋੜਾਂ ਹਿਸਾਬ ਕਰੋ",
calculatingBtn: "ਹਿਸਾਬ ਹੋ ਰਿਹਾ ਹੈ...",
todayOverview: "ਅੱਜ ਦਾ ਸੰਖੇਪ",
topSell: "🟢 ਟਾਪ 3 = ਵੇਚਣ ਦਾ ਚੰਗਾ ਸਮਾਂ",
tempLabel: "ਤਾਪਮਾਨ", feelsLike: "ਮਹਿਸੂਸ", moderate: "ਦਰਮਿਆਨਾ", liveData: "ਲਾਈਵ ਡੇਟਾ",
wheatPrice: "ਕਣਕ ਭਾਅ", updating: "ਅੱਪਡੇਟ ਹੋ ਰਿਹਾ ਹੈ...", activeSchemes: "ਸਰਗਰਮ ਯੋਜਨਾਵਾਂ", youreEligible: "ਤੁਸੀਂ ਯੋਗ ਹੋ",
windSpeed: "ਹਵਾ ਦੀ ਗਤੀ", todayTasks: "ਅੱਜ ਦੇ ਖੇਤੀ ਕੰਮ", yourEligibleSchemes: "ਤੁਹਾਡੀਆਂ ਯੋਗ ਯੋਜਨਾਵਾਂ",
quickActions: "ਤੁਰੰਤ ਕਾਰਵਾਈ", yieldTab: "ਝਾੜ", soilTab: "ਮਿੱਟੀ AI", mandiTab: "ਮੰਡੀ", seedTab: "ਬੀਜ",
farmAlertLabel: "ਖੇਤ ਚੇਤਾਵਨੀ", forecastLabel: "7-ਦਿਨ ਦਾ ਅਨੁਮਾਨ", mandiPriceSub: "AI-ਸੰਚਾਲਿਤ ਰੋਜ਼ਾਨਾ ਮੰਡੀ ਭਾਅ · ਆਪਣਾ ਰਾਜ ਚੁਣੋ",
marketTip: "ਬਾਜ਼ਾਰ ਟਿੱਪ", priceChangeIn: "ਅੱਜ ਦੇ ਭਾਅ ਬਦਲਾਅ ਅਨੁਸਾਰ ਫ਼ਸਲਾਂ", poweredBy: "Claude ਦੁਆਰਾ · ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਪੁੱਛੋ",
onlineStatus: "ਔਨਲਾਈਨ", addTask: "+ ਜੋੜੋ", addTaskPlaceholder: "ਨਵਾਂ ਕੰਮ ਜੋੜੋ...",
cropCalendar: "📅 ਫ਼ਸਲ ਕੈਲੰਡਰ", whatToDoThis: "ਇਸ ਮਹੀਨੇ ਕੀ ਕਰਨਾ ਹੈ", harvestPoll: "📊 ਵਾਢੀ ਸਰਵੇਖਣ",
harvestQuestion: "ਇਸ ਸੀਜ਼ਨ ਤੁਹਾਡੀ ਵਾਢੀ ਕਿਵੇਂ ਹੈ?", welcomeMsg: "ਮੌਸਮ, ਬਾਜ਼ਾਰ, ਫ਼ਸਲਾਂ, ਰੋਗ ਪਛਾਣ ਅਤੇ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ — ਸਭ ਇੱਕ ਥਾਂ।",
refresh: "🔄 ਰਿਫ੍ਰੈਸ਼", viewAll: "ਸਭ ਦੇਖੋ →",
  },
};
 
// ── Palette & theme ──────────────────────────────────────────────
const theme = {
  soil: "#3d2b1f",
  bark: "#6b4226",
  wheat: "#e8c97a",
  leaf: "#4a7c59",
  leafLight: "#6db87f",
  sky: "#a8d8ea",
  sun: "#f9a825",
  cream: "#fdf6e3",
  red: "#c0392b",
  muted: "#8a7560",
  card: "#fffdf5",
  border: "#e2d9c5",
};
 
// ── Mock Data ────────────────────────────────────────────────────
const weatherData = {
  current: { temp: 31, feels: 34, humidity: 72, wind: 14, condition: "Partly Cloudy", icon: "⛅" },
  forecast: [
    { day: "Mon", icon: "☀️", high: 33, low: 24, rain: 5 },
    { day: "Tue", icon: "🌧️", high: 28, low: 22, rain: 80 },
    { day: "Wed", icon: "⛈️", high: 26, low: 21, rain: 90 },
    { day: "Thu", icon: "🌤️", high: 30, low: 23, rain: 20 },
    { day: "Fri", icon: "☀️", high: 34, low: 25, rain: 5 },
    { day: "Sat", icon: "☀️", high: 35, low: 26, rain: 0 },
    { day: "Sun", icon: "⛅", high: 32, low: 24, rain: 15 },
  ],
  
};
 
const marketPrices = [
  { crop: "Wheat", price: 2215, change: +45, unit: "quintal", trend: [2100, 2130, 2160, 2180, 2215] },
  { crop: "Rice", price: 3180, change: -20, unit: "quintal", trend: [3250, 3220, 3200, 3190, 3180] },
  { crop: "Tomato", price: 1840, change: +120, unit: "quintal", trend: [1600, 1680, 1720, 1780, 1840] },
  { crop: "Onion", price: 1260, change: -80, unit: "quintal", trend: [1400, 1360, 1320, 1290, 1260] },
  { crop: "Potato", price: 980, change: +30, unit: "quintal", trend: [920, 940, 955, 965, 980] },
  { crop: "Cotton", price: 6450, change: +200, unit: "quintal", trend: [6100, 6200, 6280, 6380, 6450] },
  { crop: "Soybean", price: 4320, change: -60, unit: "quintal", trend: [4450, 4410, 4380, 4360, 4320] },
  { crop: "Maize", price: 1890, change: +15, unit: "quintal", trend: [1850, 1860, 1870, 1878, 1890] },
];
 
const governmentSchemes = [
  { name: "PM-KISAN", desc: "₹6,000/year direct income support to farmer families in 3 installments.", category: "Income Support", deadline: "Ongoing", eligible: true },
  { name: "PMFBY", desc: "Pradhan Mantri Fasal Bima Yojana – crop insurance at subsidized premiums.", category: "Insurance", deadline: "Jun 30, 2026", eligible: true },
  { name: "KCC Scheme", desc: "Kisan Credit Card for short-term credit needs at 4% interest rate.", category: "Credit", deadline: "Ongoing", eligible: true },
  { name: "Soil Health Card", desc: "Free soil testing & customized fertilizer recommendations.", category: "Soil Health", deadline: "Ongoing", eligible: false },
  { name: "eNAM", desc: "Online trading platform for agricultural commodities across mandis.", category: "Market", deadline: "Ongoing", eligible: true },
  { name: "PKVY", desc: "Paramparagat Krishi Vikas Yojana for organic farming support.", category: "Organic", deadline: "Mar 31, 2026", eligible: false },
];
 
const diseases = [
  { name: "Blast (Rice)", symptoms: "Spindle-shaped lesions on leaves with gray centers and brown margins.", treatment: "Spray Tricyclazole 75 WP @ 0.6 g/L. Remove infected debris.", severity: "High" },
  { name: "Powdery Mildew", symptoms: "White powdery coating on leaves and stems.", treatment: "Apply Sulphur 80 WP @ 2.5 g/L or Tebuconazole 25 EC @ 1 mL/L.", severity: "Medium" },
  { name: "Root Rot", symptoms: "Yellowing leaves, wilting, dark discoloration at stem base.", treatment: "Drench with Carbendazim 1g/L. Improve drainage.", severity: "High" },
  { name: "Aphids", symptoms: "Curled leaves, sticky residue (honeydew), stunted growth.", treatment: "Spray Imidacloprid 0.5 mL/L or Neem oil 5 mL/L.", severity: "Medium" },
  { name: "Leaf Blight", symptoms: "Water-soaked lesions that turn brown, with yellow margins.", treatment: "Apply Mancozeb 75 WP @ 2.5 g/L. Avoid overhead irrigation.", severity: "Medium" },
];
 
// ── Smart Farm Insights Helpers ──────────────────────────────────
// Reads live weather (dashWeather from weatherapi.com) when available,
// otherwise falls back to the local mock weatherData. Re-runs whenever
// dashWeather changes so every derived card stays in sync automatically.
function getFarmConditions(dashWeather, fallback) {
  if (dashWeather && dashWeather.current) {
    const heavyRain = (dashWeather.forecast?.forecastday || []).some(d => d.day.daily_chance_of_rain >= 70);
    return {
      temp: dashWeather.current.temp_c,
      humidity: dashWeather.current.humidity,
      wind: dashWeather.current.wind_kph,
      heavyRain,
    };
  }
  const heavyRain = fallback.forecast.some(f => f.rain >= 70);
  return {
    temp: fallback.current.temp,
    humidity: fallback.current.humidity,
    wind: fallback.current.wind,
    heavyRain,
  };
}

function computeCropHealth(
  crop,
  stage,
  temp,
  humidity,
  heavyRain,
  diseaseRisk
) {
  let score = 100;
  let note = "Conditions are favorable for healthy crop growth.";

  if (temp > 35) score -= 10;
  if (humidity > 85) score -= 10;
  if (heavyRain) score -= 10;

  if (diseaseRisk === "HIGH") score -= 20;
  else if (diseaseRisk === "MEDIUM") score -= 10;

  // Crop specific

  if (
    crop === "Rice" &&
    stage === "Flowering"
  ) {
    score -= 5;
  }

  if (
    crop === "Wheat" &&
    stage === "Flowering"
  ) {
    score -= 8;
  }

  if (
    crop === "Cotton" &&
    stage === "Boll Formation"
  ) {
    score -= 5;
  }

  score = Math.max(30, Math.min(100, score));

  const status =
    score >= 90
      ? "Excellent"
      : score >= 75
      ? "Healthy"
      : score >= 60
      ? "Moderate"
      : "Needs Attention";

  return {
    score,
    status,
    note
  };
}
function computeDiseaseRisk(humidity, heavyRain) {
  if (humidity > 85 && heavyRain) {
    return { level: "HIGH", icon: "🔴", color: "#c0392b", bg: "#fce4ec", text: "High humidity and rainfall may increase fungal disease risk." };
  }
  if (humidity >= 70) {
    return { level: "MEDIUM", icon: "🟡", color: "#f9a825", bg: "#fff8e1", text: "Moderate humidity — keep an eye out for early signs of disease." };
  }
  return { level: "LOW", icon: "🟢", color: "#2e7d32", bg: "#e8f5e9", text: "Current conditions are unfavorable for disease spread." };
}

function generateAdvisory(
  crop,
  currentStage,
  diseaseRisk,
  temp,
  humidity,
  wind,
  heavyRain
) {
  const tips = [];

  // Weather advice
  if (heavyRain)
    tips.push(
      "❌ Avoid pesticide spraying — rain in the forecast will wash it off."
    );

  if (wind > 20)
    tips.push(
      "⚠️ Delay fertilizer application — strong winds will reduce effectiveness."
    );

  if (humidity < 40)
    tips.push(
      "💧 Irrigation recommended — low humidity may stress your crop."
    );

  if (temp > 35)
    tips.push(
      "🌡️ Heat stress warning — increase irrigation frequency."
    );

  // Disease advice
  if (diseaseRisk === "HIGH")
    tips.push(
      "🦠 High disease risk detected — inspect crops immediately."
    );

  // Crop-specific advice

  if (crop === "Rice" && currentStage === "Vegetative")
    tips.push(
      "🌾 Rice Vegetative Stage — apply nitrogen fertilizer if scheduled."
    );

  if (crop === "Rice" && currentStage === "Flowering")
    tips.push(
      "🌾 Rice Flowering Stage — monitor for pest and fungal attacks."
    );

  if (crop === "Wheat" && currentStage === "Tillering")
    tips.push(
      "🌾 Wheat Tillering Stage — urea top dressing is recommended."
    );

  if (crop === "Cotton" && currentStage === "Flowering")
    tips.push(
      "🌱 Cotton Flowering Stage — monitor for bollworm activity."
    );

  const fillers = [
    "✅ Conditions look favorable for regular field operations.",
    "🌱 Continue routine monitoring for pests and disease signs.",
    "📅 Good day for general farm maintenance."
  ];

  let i = 0;

  while (tips.length < 4 && i < fillers.length) {
    tips.push(fillers[i]);
    i++;
  }

  return tips.slice(0, 4);
}

// Simple hardcoded stage map keyed by crop name (user.mainCrop)


const cropStageMap = {
  Rice: {
    stages: ["Sowing", "Vegetative", "Flowering", "Grain Filling", "Harvest"],
    stageDays: [20, 45, 70, 100],
    nextAction: "Apply nitrogen fertilizer for better tillering"
  },

  Paddy: {
    stages: ["Sowing", "Vegetative", "Flowering", "Grain Filling", "Harvest"],
    stageDays: [20, 45, 70, 100],
    nextAction: "Apply nitrogen fertilizer for better tillering"
  },

  Wheat: {
    stages: ["Sowing", "Tillering", "Flowering", "Grain Filling", "Harvest"],
    stageDays: [15, 40, 65, 95],
    nextAction: "Apply urea top dressing"
  },

  Cotton: {
    stages: ["Sowing", "Vegetative", "Flowering", "Boll Formation", "Harvest"],
    stageDays: [25, 55, 85, 130],
    nextAction: "Monitor for bollworm and apply potash"
  },

  Maize: {
    stages: ["Sowing", "Vegetative", "Tasseling", "Grain Filling", "Harvest"],
    stageDays: [18, 45, 75, 110],
    nextAction: "Apply nitrogen top dressing"
  },

  Sugarcane: {
    stages: ["Planting", "Tillering", "Grand Growth", "Maturity", "Harvest"],
    stageDays: [40, 120, 240, 330],
    nextAction: "Earthing up and irrigation"
  },

  Tomato: {
    stages: ["Nursery", "Vegetative", "Flowering", "Fruiting", "Harvest"],
    stageDays: [15, 35, 60, 90],
    nextAction: "Apply calcium spray"
  },

  Soybean: {
    stages: ["Sowing", "Vegetative", "Flowering", "Pod Filling", "Harvest"],
    stageDays: [20, 45, 70, 100],
    nextAction: "Apply phosphorus fertilizer"
  }
};

function getCropStage(crop, sowingDate) {

  const cropData = cropStageMap[crop];

  if (!cropData) return null;

  const today = new Date();
  const sowDate = new Date(sowingDate);

  const daysAfterSowing = Math.max(
  0,
  Math.floor(
    (today - sowDate) /
    (1000 * 60 * 60 * 24)
  )
);

  let currentIndex = 0;

  for (let i = 0; i < cropData.stageDays.length; i++) {

    if (daysAfterSowing > cropData.stageDays[i]) {
      currentIndex = i + 1;
    }

  }

  currentIndex = Math.min(
    currentIndex,
    cropData.stages.length - 1
  );

  const nextBoundary =
    cropData.stageDays[currentIndex];

  return {
    currentIndex,
    currentStage:
      cropData.stages[currentIndex],
    daysAfterSowing,
    daysToNext:
      nextBoundary
        ? nextBoundary - daysAfterSowing
        : 0,
    nextAction:
      cropData.nextAction,
    stages:
      cropData.stages
  };
}



// ── Circular Progress Ring ───────────────────────────────────────
function CircularProgress({ percentage, size = 140, strokeWidth = 12, color = "#4a7c59", trackColor = "#e8f0e4" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
  );
}

// ── Sparkline Component ──────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function Sparkline({ data, color }) {
  const min = Math.min(...data), max = Math.max(...data);
  const w = 80, h = 30, pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.split(" ").pop().split(",")[0]} cy={pts.split(" ").pop().split(",")[1]} r="3" fill={color} />
    </svg>
  );
}
 
// ── AI Chat Component ────────────────────────────────────────────
function FarmTaskChecklist({ t = translations.English }) {
  const defaultTasks = [
    { id: 1, text: "Check soil moisture levels", done: false },
    { id: 2, text: "Inspect crops for disease signs", done: false },
    { id: 3, text: "Apply fertilizer if scheduled", done: false },
    { id: 4, text: "Check weather forecast", done: false },
    { id: 5, text: "Update farm expense records", done: false },
    { id: 6, text: "Water seedlings in nursery", done: false },
  ];
  const [tasks, setTasks] = useState(defaultTasks);
  const [newTask, setNewTask] = useState("");

  function toggle(id) { setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
  function addTask() {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask.trim(), done: false }]);
    setNewTask("");
  }
  function deleteTask(id) { setTasks(prev => prev.filter(t => t.id !== id)); }

  const done = tasks.filter(t => t.done).length;

  return (
    <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: theme.muted }}>
          <span style={{ fontWeight: 700, color: theme.leaf }}>{done}</span> / {tasks.length} completed
        </div>
        <div style={{ background: "#e8f5e9", borderRadius: 20, padding: "3px 12px", fontSize: 11, color: "#2e7d32", fontWeight: 700 }}>
          {Math.round((done / tasks.length) * 100)}% done
        </div>
      </div>
      <div style={{ height: 6, background: "#eee", borderRadius: 4, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(done / tasks.length) * 100}%`, background: theme.leaf, borderRadius: 4, transition: "width 0.4s" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {tasks.map(task => (
          <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: task.done ? "#f0fff4" : "#fafaf6", border: `1px solid ${task.done ? "#a5d6a7" : theme.border}`, transition: "all 0.2s" }}>
            <div onClick={() => toggle(task.id)} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${task.done ? theme.leaf : theme.muted}`, background: task.done ? theme.leaf : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {task.done && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
            </div>
            <span style={{ flex: 1, fontSize: 13, color: task.done ? theme.muted : theme.soil, textDecoration: task.done ? "line-through" : "none", fontFamily: "'Lato', sans-serif" }}>{task.text}</span>
            <span onClick={() => deleteTask(task.id)} style={{ cursor: "pointer", color: theme.muted, fontSize: 14, padding: "0 4px" }}>✕</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder={t.addTaskPlaceholder}
          style={{ flex: 1, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "9px 14px", fontSize: 13, outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif" }} />
        <button onClick={addTask} style={{ background: theme.leaf, color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{t.addTask}</button>
      </div>
    </div>
  );
}

function CropCalendar({ t = translations.English }) {
  const month = new Date().toLocaleString("en-IN", { month: "long" });
  const activities = {
    January: [{ crop: "Wheat", task: "Irrigation & top dressing fertilizer", icon: "🌾" }, { crop: "Mustard", task: "Watch for aphid attack", icon: "🌻" }, { crop: "Potato", task: "Earthing up operation", icon: "🥔" }],
    February: [{ crop: "Wheat", task: "Second irrigation, grain filling stage", icon: "🌾" }, { crop: "Sugarcane", task: "Planting season begins", icon: "🎋" }, { crop: "Vegetables", task: "Harvest leafy vegetables", icon: "🥬" }],
    March: [{ crop: "Wheat", task: "Harvesting begins in South India", icon: "🌾" }, { crop: "Sunflower", task: "Sowing time for summer crop", icon: "🌻" }, { crop: "Groundnut", task: "Prepare land for Zaid season", icon: "🥜" }],
    April: [{ crop: "Rice", task: "Nursery preparation for Kharif", icon: "🌾" }, { crop: "Watermelon", task: "Peak harvest season", icon: "🍉" }, { crop: "Maize", task: "Summer maize harvesting", icon: "🌽" }],
    May: [{ crop: "Cotton", task: "Land preparation & soil treatment", icon: "🌿" }, { crop: "Moong", task: "Sowing for Zaid season", icon: "🫘" }, { crop: "Vegetables", task: "Apply mulch to conserve moisture", icon: "🥦" }],
    June: [{ crop: "Rice", task: "Transplanting after monsoon", icon: "🌾" }, { crop: "Cotton", task: "Sowing with onset of monsoon", icon: "🌿" }, { crop: "Soybean", task: "Sowing season begins", icon: "🫘" }],
    July: [{ crop: "Rice", task: "Weed control & fertilizer application", icon: "🌾" }, { crop: "Maize", task: "Top dressing of nitrogen", icon: "🌽" }, { crop: "Cotton", task: "Monitor for bollworm", icon: "🌿" }],
    August: [{ crop: "Rice", task: "Panicle initiation stage — water management", icon: "🌾" }, { crop: "Soybean", task: "Pod filling stage — no water stress", icon: "🫘" }, { crop: "Onion", task: "Nursery preparation for Rabi", icon: "🧅" }],
    September: [{ crop: "Rice", task: "Harvesting early varieties", icon: "🌾" }, { crop: "Wheat", task: "Land preparation begins", icon: "🌱" }, { crop: "Potato", task: "Seed treatment & land prep", icon: "🥔" }],
    October: [{ crop: "Wheat", task: "Sowing season — North India", icon: "🌾" }, { crop: "Potato", task: "Planting in Punjab & UP", icon: "🥔" }, { crop: "Mustard", task: "Sowing in Rajasthan & MP", icon: "🌻" }],
    November: [{ crop: "Wheat", task: "First irrigation after sowing", icon: "🌾" }, { crop: "Chickpea", task: "Sowing season — Central India", icon: "🫘" }, { crop: "Onion", task: "Transplanting seedlings", icon: "🧅" }],
    December: [{ crop: "Wheat", task: "Tillering stage — second irrigation", icon: "🌾" }, { crop: "Mustard", task: "Flowering stage — bee pollination", icon: "🌻" }, { crop: "Vegetables", task: "Harvest tomato & brinjal", icon: "🍅" }],
  };
  const tasks = activities[month] || activities["June"];

  return (
    <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: theme.soil, marginBottom: 4, fontWeight: 700 }}>{t.cropCalendar}</div>
      <div style={{ fontSize: 12, color: theme.muted, marginBottom: 14 }}>{t.whatToDoThis} {month}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tasks.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 12, background: i === 0 ? "#f0fff4" : i === 1 ? "#fff8e1" : "#f3e5f5", border: `1px solid ${i === 0 ? "#a5d6a7" : i === 1 ? "#ffe082" : "#ce93d8"}` }}>
            <div style={{ fontSize: 24 }}>{item.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: theme.soil }}>{item.crop}</div>
              <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>{item.task}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function HarvestPoll({ t = translations.English }) {
  const [voted, setVoted] = useState(null);
  const [votes, setVotes] = useState({ excellent: 142, good: 89, average: 34, poor: 12 });

  function vote(option) {
    if (voted) return;
    setVoted(option);
    setVotes(prev => ({ ...prev, [option]: prev[option] + 1 }));
  }

  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  const options = [
    { key: "excellent", label: "🌟 Excellent", color: "#4caf50", bg: "#e8f5e9" },
    { key: "good", label: "😊 Good", color: "#2196f3", bg: "#e3f2fd" },
    { key: "average", label: "😐 Average", color: "#ff9800", bg: "#fff8e1" },
    { key: "poor", label: "😟 Poor", color: "#f44336", bg: "#fce4ec" },
  ];

  return (
    <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: theme.soil, marginBottom: 4, fontWeight: 700 }}>{t.harvestPoll}</div>
      <div style={{ fontSize: 12, color: theme.muted, marginBottom: 16 }}>{t.harvestQuestion}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map(opt => {
          const pct = Math.round((votes[opt.key] / total) * 100);
          return (
            <div key={opt.key} onClick={() => vote(opt.key)}
              style={{ borderRadius: 10, border: `2px solid ${voted === opt.key ? opt.color : theme.border}`, overflow: "hidden", cursor: voted ? "default" : "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: voted === opt.key ? opt.bg : "#fff" }}>
                <span style={{ fontSize: 13, fontWeight: voted === opt.key ? 700 : 400, color: theme.soil }}>{opt.label}</span>
                {voted && <span style={{ fontSize: 12, fontWeight: 700, color: opt.color }}>{pct}%</span>}
              </div>
              {voted && (
                <div style={{ height: 4, background: "#eee" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: opt.color, transition: "width 0.6s" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {voted && <div style={{ marginTop: 12, fontSize: 12, color: theme.muted, textAlign: "center" }}>Thanks for voting! {total} farmers responded.</div>}
      {!voted && <div style={{ marginTop: 12, fontSize: 12, color: theme.muted, textAlign: "center" }}>👆 Tap to share your experience</div>}
    </div>
  );
}

// ── Smart Farm Insights Section ──────────────────────────────────
function SmartFarmInsights({ conditions,crop,currentStage }) {
 const diseaseRisk = useMemo(
    () => computeDiseaseRisk(conditions.humidity, conditions.heavyRain),
    [conditions.humidity, conditions.heavyRain]
  );
 const cropHealth = useMemo(
  () =>
    computeCropHealth(
      crop,
      currentStage,
      conditions.temp,
      conditions.humidity,
      conditions.heavyRain,
      diseaseRisk.level
    ),
  [
    crop,
    currentStage,
    conditions.temp,
    conditions.humidity,
    conditions.heavyRain,
    diseaseRisk.level
  ]
);
 
  const advisoryTips = useMemo(
    () =>
      generateAdvisory(
      crop,
      currentStage,
      diseaseRisk.level,
      conditions.temp,
      conditions.humidity,
      conditions.wind,
      conditions.heavyRain
      ),
    [
  crop,
  currentStage,
  diseaseRisk.level,
  conditions.temp,
  conditions.humidity,
  conditions.wind,
  conditions.heavyRain
]
    );

  const healthColor = cropHealth.score >= 90 ? "#2e7d32" : cropHealth.score >= 75 ? theme.leaf : cropHealth.score >= 60 ? "#f9a825" : theme.red;
  const cardStyle = { background: theme.card, borderRadius: 18, border: `1px solid ${theme.border}`, padding: 22, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" };
  const titleStyle = { fontFamily: "'Playfair Display', serif", fontSize: 15, color: theme.soil, fontWeight: 700 };

  return (
    <div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: theme.soil, marginBottom: 12, fontWeight: 700 }}>🧠 Smart Farm Insights</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>

        {/* Crop Health Score */}
        <div className="card-hover" style={{ ...cardStyle, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ ...titleStyle, alignSelf: "flex-start", marginBottom: 14 }}>🌱 Crop Health Score</div>
          <div style={{ position: "relative", width: 140, height: 140, marginBottom: 12 }}>
            <CircularProgress percentage={cropHealth.score} color={healthColor} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: theme.soil }}>{cropHealth.score}%</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: healthColor }}>{cropHealth.status}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.4 }}>{cropHealth.note}</div>
        </div>

        {/* Disease Risk Alert */}
        <div className="card-hover" style={cardStyle}>
          <div style={titleStyle}>🦠 Disease Risk</div>
          <div style={{ display: "flex", justifyContent: "center", margin: "22px 0 16px" }}>
            <div style={{ padding: "10px 26px", borderRadius: 30, fontWeight: 900, fontSize: 17, letterSpacing: 1, background: diseaseRisk.bg, color: diseaseRisk.color, border: `2px solid ${diseaseRisk.color}` }}>
              {diseaseRisk.icon} {diseaseRisk.level}
            </div>
          </div>
          <div style={{ fontSize: 12, color: theme.muted, textAlign: "center", lineHeight: 1.5 }}>{diseaseRisk.text}</div>
        </div>

        {/* Today's AI Advisory */}
        <div className="card-hover" style={cardStyle}>
          <div style={titleStyle}>🤖 Today's AI Advisory</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {advisoryTips.map((tip, i) => (
              <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: "#fafaf6", border: `1px solid ${theme.border}`, fontSize: 12.5, color: theme.soil, lineHeight: 1.4 }}>
                {tip}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const stageRecommendations = {
  Wheat: {
    Sowing: "Prepare irrigation schedule",
    Tillering: "Apply urea top dressing",
    Flowering: "Monitor fungal diseases",
    "Grain Filling": "Maintain soil moisture",
    Harvest: "Prepare harvesting equipment"
  },

  Rice: {
    Sowing: "Maintain nursery moisture",
    Vegetative: "Apply nitrogen fertilizer",
    Flowering: "Monitor pest attacks",
    "Grain Filling": "Ensure water availability",
    Harvest: "Prepare harvesting"
  },

  Cotton: {
    Sowing: "Maintain seedling moisture",
    Vegetative: "Apply potash fertilizer",
    Flowering: "Monitor bollworm attack",
    "Boll Formation": "Check nutrient deficiency",
    Harvest: "Prepare harvesting"
  },

  Maize: {
    Sowing: "Ensure proper germination",
    Vegetative: "Apply nitrogen fertilizer",
    Tasseling: "Monitor water stress",
    "Grain Filling": "Maintain soil moisture",
    Harvest: "Prepare harvesting"
  }
};


// ── Crop Stage Tracker ───────────────────────────────────────────
function CropStageTracker({ crop = "Rice", sowingDate,  onEdit }) {
   const data =
  getCropStage(
    crop,
    sowingDate
  ) ||
  getCropStage(
    "Rice",
    sowingDate
  );

const recommendation =
  stageRecommendations[crop]?.[
    data.currentStage
  ] ||
  "Monitor crop regularly";

const stagePct =
  Math.round(
    (data.daysAfterSowing /
      (data.daysAfterSowing + data.daysToNext || 1)) *
      100
  );

  return (
    <div className="card-hover" style={{ background: theme.card, borderRadius: 18, border: `1px solid ${theme.border}`, padding: 22, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
 
    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  }}
>
  <div
    style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: 16,
      color: theme.soil,
      fontWeight: 700
    }}
  >
    🌾 Crop Stage Tracker
  </div>

  <button
    onClick={() => {
      console.log("Edit clicked");
      onEdit && onEdit();
    }}
    style={{
      border: "none",
      background: "#f5f5f5",
      borderRadius: 8,
      padding: "6px 10px",
      cursor: "pointer"
    }}
  >
    ⚙️ Edit
  </button>
</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, color: theme.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Current Crop</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.soil, marginTop: 2 }}>🌾 {crop}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: theme.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Current Stage</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.leaf, marginTop: 2 }}>{data.currentStage}</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 18 }}>
        {data.stages.map((stage, i) => (
          <React.Fragment key={stage}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 56 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: i <= data.currentIndex ? theme.leaf : "#e0e0e0", border: `2px solid ${i === data.currentIndex ? theme.leaf : "#ddd"}`, boxShadow: i === data.currentIndex ? "0 0 0 4px rgba(74,124,89,0.15)" : "none" }} />
              <div style={{ fontSize: 10, marginTop: 6, color: i === data.currentIndex ? theme.leaf : theme.muted, fontWeight: i === data.currentIndex ? 700 : 400, textAlign: "center" }}>{stage}</div>
            </div>
            {i < data.stages.length - 1 && <div style={{ flex: 1, height: 3, background: i < data.currentIndex ? theme.leaf : "#e0e0e0", marginTop: 6 }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ height: 8, background: "#eee", borderRadius: 4, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${stagePct}%`, background: `linear-gradient(90deg, ${theme.leaf}, ${theme.leafLight})`, borderRadius: 4, transition: "width 0.5s" }} />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1, background: "#f0fff4", borderRadius: 10, padding: "10px 12px", border: "1px solid #c8e6c9" }}>
          <div style={{ fontSize: 9, color: theme.muted, fontWeight: 700, textTransform: "uppercase" }}>Days After Sowing</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: theme.soil }}>{data.daysAfterSowing} <span style={{ fontSize: 11, fontWeight: 400 }}>Days</span></div>
        </div>
        <div style={{ flex: 1, background: "#fff8e1", borderRadius: 10, padding: "10px 12px", border: "1px solid #ffe082" }}>
          <div style={{ fontSize: 9, color: theme.muted, fontWeight: 700, textTransform: "uppercase" }}>Days to Next Stage</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: theme.soil }}>{data.daysToNext} <span style={{ fontSize: 11, fontWeight: 400 }}>Days</span></div>
        </div>
      </div>

      <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 12, padding: "12px 14px", fontSize: 12, color: theme.soil, lineHeight: 1.4 }}>
        <span style={{ fontWeight: 700 }}>💡 Next Recommended Action: </span>{recommendation}
      </div>
    </div>
  );
}






// eslint-disable-next-line no-unused-vars
function FarmProfileCard() {
  const [crop, setCrop] = useState(
    localStorage.getItem("crop") || ""
  );

  const [sowingDate, setSowingDate] = useState(
    localStorage.getItem("sowingDate") || ""
  );

  const saveProfile = () => {

  if (!crop) {
    alert("Please select crop");
    return;
  }

  if (!sowingDate) {
    alert("Please select sowing date");
    return;
  }

  if (new Date(sowingDate) > new Date()) {
    alert("Sowing date cannot be in future");
    return;
  }

  localStorage.setItem("crop", crop);
  localStorage.setItem("sowingDate", sowingDate);

  alert("Farm profile saved");

  window.location.reload();
};

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 16,
        border: "1px solid #ddd"
      }}
    >
      <h3>🌾 My Farm Profile</h3>

      <select
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 12
        }}
      >
        <option value="">Select Crop</option>
        <option>Rice</option>
        <option>Wheat</option>
        <option>Cotton</option>
        <option>Maize</option>
        <option>Tomato</option>
        <option>Soybean</option>
      </select>

     <input
  type="date"
  value={sowingDate}
  max={new Date().toISOString().split("T")[0]}
  onChange={(e) => setSowingDate(e.target.value)}
  style={{
    width: "100%",
    padding: 10,
    marginBottom: 12
  }}
/>

      <button
        onClick={saveProfile}
        style={{
          background: "#2e7d32",
          color: "white",
          border: "none",
          padding: "10px 16px",
          borderRadius: 8
        }}
      >
        Save Profile
      </button>
    </div>
  );
}
function SchemesTab({ t, language, authFetch }) {
  
  const [state, setState] = useState("Andhra Pradesh");
  const [category, setCategory] = useState("All");
  const [aiSchemes, setAiSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const [search, setSearch] = useState("");

  const categories = ["All", "Income Support", "Insurance", "Credit", "Soil Health", "Market", "Organic", "Seeds", "Irrigation"];
  const indianStates = ["Andhra Pradesh","Telangana","Maharashtra","Punjab","Haryana","Uttar Pradesh","Madhya Pradesh","Rajasthan","Gujarat","Karnataka","Tamil Nadu","Kerala","Bihar","West Bengal","Odisha"];

  const filteredSchemes = governmentSchemes.filter(s => {
    const matchCat = category === "All" || s.category === category;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

 async function fetchAISchemes() {
  setLoading(true);

  try {
   const response = await fetch(
  `${process.env.REACT_APP_API_URL}/api/schemes?state=${encodeURIComponent(state)}`
);

    const data = await response.json();

    setAiSchemes(data);

  } catch (err) {
    console.error(err);
    setAiSchemes([]);
  } finally {
    setLoading(false);
  }
}

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* AI Schemes by State */}
      <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: theme.soil, marginBottom: 4 }}>🤖 AI Latest Schemes by State</div>
        <p style={{ fontSize: 12, color: theme.muted, marginBottom: 14 }}>Get latest government schemes specific to your state</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select value={state} onChange={e => setState(e.target.value)}
            style={{ flex: 1, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif" }}>
            {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={fetchAISchemes} disabled={loading}
            style={{ background: theme.leaf, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Lato', sans-serif", whiteSpace: "nowrap" }}>
            {loading ? "⏳ Loading..." : "🔍 Get Latest Schemes"}
          </button>
        </div>
      </div>

{aiSchemes.length > 0 && (
  <div
    style={{
      background: theme.card,
      borderRadius: 16,
      border: `1px solid ${theme.border}`,
      padding: 20
    }}
  >
    <div
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 17,
        color: theme.soil,
        marginBottom: 14
      }}
    >
      🏛️ State Government Schemes
    </div>

    {aiSchemes.map((scheme, index) => (
      <div
        key={index}
        style={{
          background: "#f9fffe",
          border: "1px solid #a5d6a7",
          borderRadius: 10,
          padding: 16,
          marginBottom: 12
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: theme.soil,
            marginBottom: 8
          }}
        >
          {scheme.name}
        </div>

        <div
          style={{
            fontSize: 13,
            color: theme.muted,
            marginBottom: 8
          }}
        >
          {scheme.description}
        </div>

        <div style={{ fontSize: 12, marginBottom: 4 }}>
          💰 Benefit: {scheme.benefit}
        </div>

        <div style={{ fontSize: 12, marginBottom: 4 }}>
          ✅ Eligibility: {scheme.eligibility}
        </div>

        <div style={{ fontSize: 12 }}>
          📅 Deadline: {scheme.deadline}
        </div>
      </div>
    ))}
  </div>
)}



      {/* Filter & Search */}
      <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: theme.soil, marginBottom: 14 }}>🏛️ {t.schemesTitle}</div>

        {/* Search */}
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search schemes by name or keyword..."
          style={{ width: "100%", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif", boxSizing: "border-box", marginBottom: 12 }} />

        {/* Category Filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ padding: "6px 14px", borderRadius: 20, border: `2px solid ${category === c ? theme.leaf : theme.border}`, background: category === c ? theme.leaf : "#fff", color: category === c ? "#fff" : theme.soil, fontSize: 12, fontWeight: category === c ? 700 : 400, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Schemes List */}
        <div style={{ fontSize: 12, color: theme.muted, marginBottom: 12 }}>
          {filteredSchemes.length} scheme(s) found
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredSchemes.map((s, i) => (
            <div key={i} className="card-hover" style={{ borderRadius: 14, border: `2px solid ${s.eligible ? "#a5d6a7" : theme.border}`, padding: 18, background: s.eligible ? "#f9fffe" : "#fafaf6", cursor: "default", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: theme.soil, fontFamily: "'Playfair Display', serif" }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: theme.muted, marginTop: 4, maxWidth: 500 }}>{s.desc}</div>
                </div>
                {s.eligible ? (
                  <span style={{ background: "#e8f5e9", color: "#2e7d32", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", marginLeft: 12 }}>✅ {t.eligible}</span>
                ) : (
                  <span style={{ background: "#fce4ec", color: "#c62828", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 }}>❌ {t.notEligible}</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
                <span style={{ fontSize: 11, background: "#ede7f6", color: "#4527a0", borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>{s.category}</span>
                <span style={{ fontSize: 12, color: theme.muted }}>📅 {s.deadline}</span>
                
              </div>
            </div>
          ))}
          {filteredSchemes.length === 0 && (
            <div style={{ textAlign: "center", padding: 30, color: theme.muted, fontSize: 13 }}>
              No schemes found 
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// ── AI Chat Component ────────────────────────────────────────────
function MarketTab({ t, language, authFetch }) {
  
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("Andhra Pradesh");
  const [tip, setTip] = useState("");
  const [priceAlert, setPriceAlert] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");
  const stateMultiplier = {
  "Andhra Pradesh": 1.00,
  "Telangana": 1.03,
  "Maharashtra": 1.08,
  "Punjab": 1.12,
  "Haryana": 1.10,
  "Uttar Pradesh": 0.98,
  "Madhya Pradesh": 0.95,
  "Rajasthan": 1.05,
  "Gujarat": 1.07,
  "Karnataka": 1.04,
  "Tamil Nadu": 1.09,
  "Kerala": 1.15,
  "Bihar": 0.92,
  "West Bengal": 1.01,
  "Odisha": 0.97
};
 
function fetchPrices() {
  setLoading(true);

  const multiplier = stateMultiplier[state] || 1;

  const updatedPrices = marketPrices.map(item => ({
    ...item,
    price: Math.round(item.price * multiplier),
    change: Math.floor(Math.random() * 200) - 50
  }));

  setPrices(updatedPrices);

  setLastUpdated(
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    })
  );

  setTip(
    `${state}: Market prices updated based on local mandi trends.`
  );

  setLoading(false);
}
  const indianStates = ["Andhra Pradesh","Telangana","Maharashtra","Punjab","Haryana","Uttar Pradesh","Madhya Pradesh","Rajasthan","Gujarat","Karnataka","Tamil Nadu","Kerala","Bihar","West Bengal","Odisha"];

  const cropNames = {
    English: { Wheat:"Wheat", Rice:"Rice", Tomato:"Tomato", Onion:"Onion", Potato:"Potato", Cotton:"Cotton", Soybean:"Soybean", Maize:"Maize", Groundnut:"Groundnut", Chilli:"Chilli" },
    Hindi: { Wheat:"गेहूं", Rice:"चावल", Tomato:"टमाटर", Onion:"प्याज", Potato:"आलू", Cotton:"कपास", Soybean:"सोयाबीन", Maize:"मक्का", Groundnut:"मूंगफली", Chilli:"मिर्च" },
    Telugu: { Wheat:"గోధుమ", Rice:"వరి", Tomato:"టమాటా", Onion:"ఉల్లిపాయ", Potato:"బంగాళాదుంప", Cotton:"పత్తి", Soybean:"సోయాబీన్", Maize:"మొక్కజొన్న", Groundnut:"వేరుశనగ", Chilli:"మిర్చి" },
    Tamil: { Wheat:"கோதுமை", Rice:"அரிசி", Tomato:"தக்காளி", Onion:"வெங்காயம்", Potato:"உருளைக்கிழங்கு", Cotton:"பருத்தி", Soybean:"சோயாபீன்", Maize:"மக்காச்சோளம்", Groundnut:"வேர்க்கடலை", Chilli:"மிளகாய்" },
    Kannada: { Wheat:"ಗೋಧಿ", Rice:"ಭತ್ತ", Tomato:"ಟೊಮೇಟೊ", Onion:"ಈರುಳ್ಳಿ", Potato:"ಆಲೂಗಡ್ಡೆ", Cotton:"ಹತ್ತಿ", Soybean:"ಸೋಯಾಬೀನ್", Maize:"ಮೆಕ್ಕೆಜೋಳ", Groundnut:"ಕಡಲೆಕಾಯಿ", Chilli:"ಮೆಣಸಿನಕಾಯಿ" },
    Marathi: { Wheat:"गहू", Rice:"तांदूळ", Tomato:"टोमॅटो", Onion:"कांदा", Potato:"बटाटा", Cotton:"कापूस", Soybean:"सोयाबीन", Maize:"मका", Groundnut:"भुईमूग", Chilli:"मिरची" },
    Punjabi: { Wheat:"ਕਣਕ", Rice:"ਚਾਵਲ", Tomato:"ਟਮਾਟਰ", Onion:"ਪਿਆਜ਼", Potato:"ਆਲੂ", Cotton:"ਕਪਾਹ", Soybean:"ਸੋਇਆਬੀਨ", Maize:"ਮੱਕੀ", Groundnut:"ਮੂੰਗਫਲੀ", Chilli:"ਮਿਰਚ" },
  };

  const getCropName = (crop) => cropNames[language]?.[crop] || crop;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: theme.soil, marginBottom: 4 }}>📊 {t.marketTitle}</div>
        <p style={{ fontSize: 12, color: theme.muted, marginBottom: 14 }}>{t.mandiPriceSub}</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <select value={state} onChange={e => setState(e.target.value)}
            style={{ flex: 1, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif" }}>
            {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={fetchPrices} disabled={loading}
            style={{ background: theme.leaf, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Lato', sans-serif", whiteSpace: "nowrap" }}>
            {loading ? "⏳ Loading..." : "🔄 Get Today's Prices"}
          </button>
        </div>

        {lastUpdated && <div style={{ fontSize: 11, color: theme.muted, marginBottom: 12 }}>Last updated: {lastUpdated}</div>}

        {loading && (
          <div style={{ textAlign: "center", padding: 30, color: theme.muted, fontSize: 13 }}>
            ⏳ Fetching live mandi prices for {state}...
          </div>
        )}

        {prices.length > 0 && (
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 80px", padding: "10px 16px", background: theme.soil, color: "#fff", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
              <span>Crop</span>
              <span style={{ textAlign: "right" }}>Price (₹/qtl | ₹/kg)</span>
              <span style={{ textAlign: "right" }}>Change</span>
              <span style={{ textAlign: "center" }}>Alert</span>
            </div>
            {prices.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 80px", padding: "12px 16px", background: i % 2 === 0 ? "#fff" : "#fafaf6", alignItems: "center", borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ fontWeight: 700, color: theme.soil, fontSize: 14 }}>🌾 {getCropName(m.crop)}</span>
                <span style={{ textAlign: "right", fontWeight: 700, fontSize: 15, color: theme.soil }}><div style={{ textalign: "right" }}>
  <div
    style={{
      fontweight: 700,
      fontsize: 15,
      color: theme.soil
    }}
  >
    ₹{(m.price / 100).toFixed(2)}/kg
  </div>

  <div
    style={{
      fontsize: 11,
      color: theme.muted
    }}
  >
    ₹{m.price}/qtl
  </div>
</div></span>
                <span style={{ textAlign: "right", color: m.change >= 0 ? "#2e7d32" : theme.red, fontWeight: 700, fontSize: 13 }}>
                  {m.change >= 0 ? "▲" : "▼"} {Math.abs(m.change)}
                </span>
                <div style={{ textAlign: "center" }}>
                  <button onClick={() => setPriceAlert(prev => ({ ...prev, [m.crop]: !prev[m.crop] }))}
                    style={{ background: priceAlert[m.crop] ? "#e8f5e9" : "#f5f5f5", border: `1px solid ${priceAlert[m.crop] ? "#a5d6a7" : theme.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", color: priceAlert[m.crop] ? "#2e7d32" : theme.muted }}>
                    {priceAlert[m.crop] ? "🔔 ON" : "🔔 Set"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && prices.length === 0 && (
          <div style={{ textAlign: "center", padding: 30, color: theme.muted, fontSize: 13, background: "#fafaf6", borderRadius: 10 }}>
            👆 Select your state and click "Get Today's Prices"
          </div>
        )}
      </div>

      {tip && (
        <div style={{ background: "#e8f5e9", borderRadius: 14, border: "1px solid #c8e6c9", padding: 16, fontSize: 13, color: "#2e7d32" }}>
          💡 <strong>{t.marketTip}:</strong>
 {tip}
        </div>
      )}

      {prices.length > 0 && (
        <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: theme.soil, marginBottom: 4 }}>🏆 Price Change Leaderboard</div>
          <div style={{ fontSize: 12, color: theme.muted, marginBottom: 16 }}>{t.priceChangeIn} {state}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...prices].sort((a, b) => b.change - a.change).map((m, i) => {
              const isTop = i < 3;
              const isBottom = i >= prices.length - 3;
              const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
              const barWidth = Math.abs(m.change) / Math.max(...prices.map(p => Math.abs(p.change))) * 100;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: isTop ? "#f0fff4" : isBottom ? "#fff5f5" : "#fafaf6", border: `1px solid ${isTop ? "#a5d6a7" : isBottom ? "#ffcdd2" : theme.border}` }}>
                  <div style={{ fontSize: 18, minWidth: 32, textAlign: "center" }}>{medal}</div>
                  <div style={{ fontWeight: 700, color: theme.soil, fontSize: 14, minWidth: 80 }}>🌾 {getCropName(m.crop)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 8, borderRadius: 4, background: "#eee", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${barWidth}%`, background: m.change >= 0 ? "#4caf50" : "#f44336", borderRadius: 4, transition: "width 0.5s" }} />
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: theme.soil, minWidth: 70, textAlign: "right" }}><div style={{ textalign: "right" }}>
  <div
    style={{
      fontweight: 700,
      fontsize: 15,
      color: theme.soil
    }}
  >
    ₹{(m.price / 100).toFixed(2)}/kg
  </div>

  <div
    style={{
      fontsize: 11,
      color: theme.muted
    }}
  >
    ₹{m.price}/qtl
  </div>
</div></div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: m.change >= 0 ? "#2e7d32" : theme.red, minWidth: 60, textAlign: "right" }}>
                    {m.change >= 0 ? "▲" : "▼"} ₹{Math.abs(m.change)}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 12 }}>
            <span style={{ color: "#2e7d32" }}>{t.topSell}</span>
            <span style={{ color: theme.red }}>🔴 Bottom 3 = Prices falling
</span>
          </div>
        </div>
      )}
    </div>
  );
}



function WeatherTab({ t }) {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getWeather() {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=8b00faec197b4af3aa195603260306&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`
      );
      const data = await res.json();
      if (data.error) { setError(t.weatherNotFound || "Location not found."); }
      else { setWeather(data); }
    } catch { setError("Could not fetch weather. Check your internet."); }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: theme.soil, marginBottom: 12 }}>🌦️ {t.weatherTitle}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === "Enter" && getWeather()}
            placeholder={t.weatherPlaceholder}
            style={{ flex: 1, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif" }} />
          <button onClick={getWeather} disabled={loading}
            style={{ background: "#1565c0", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
            {loading ? t.loading : `🔍 ${t.searchBtn}`}
          </button>
        </div>
        {error && <div style={{ marginTop: 10, color: theme.red, fontSize: 13 }}>{error}</div>}
      </div>

      {weather && (
        <>
          <div style={{ background: `linear-gradient(135deg, #1565c0, #42a5f5, #80deea)`, borderRadius: 20, padding: 28, color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, opacity: 0.8, marginBottom: 4 }}>📍 {weather.location.name}, {weather.location.region}</div>
                <div style={{ fontSize: 64, fontWeight: 300, lineHeight: 1 }}>{weather.current.temp_c}°</div>
                <div style={{ fontSize: 18, opacity: 0.9, marginTop: 4 }}>{weather.current.condition.text}</div>
              </div>
              <img src={weather.current.condition.icon} alt="weather" style={{ width: 80, height: 80 }} />
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.3)" }}>
              {[{ label: "Feels Like", val: `${weather.current.feelslike_c}°C` }, { label: t.humidity, val: `${weather.current.humidity}%` }, { label: "Wind", val: `${weather.current.wind_kph} km/h` }].map((s, i) => (
                <div key={i}><div style={{ opacity: 0.7, fontSize: 12 }}>{s.label}</div><div style={{ fontWeight: 700, fontSize: 16 }}>{s.val}</div></div>
              ))}
            </div>
          </div>

          <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: theme.soil, marginBottom: 16 }}>{t.forecastLabel}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
              {weather.forecast.forecastday.map((f, i) => (
                <div key={i} style={{ textAlign: "center", background: "#f5f5f5", borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 11, color: theme.muted, marginBottom: 6, fontWeight: 700 }}>{new Date(f.date).toLocaleDateString("en-IN", { weekday: "short" })}</div>
                  <img src={f.day.condition.icon} alt="" style={{ width: 36, height: 36 }} />
                  <div style={{ fontWeight: 700, color: theme.soil, marginTop: 4, fontSize: 14 }}>{f.day.maxtemp_c}°</div>
                  <div style={{ color: theme.muted, fontSize: 12 }}>{f.day.mintemp_c}°</div>
                  <div style={{ color: "#1565c0", fontSize: 11, marginTop: 4 }}>💧{f.day.daily_chance_of_rain}%</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff3e0", borderRadius: 16, border: "1px solid #ffcc80", padding: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#e65100", marginBottom: 12 }}>⚠️ {t.farmAlerts} {weather.location.name}</div>
            <div style={{ fontSize: 13, color: "#bf360c" }}>• {weather.current.humidity > 80 ? "High humidity — watch for fungal diseases on crops." : "Humidity levels normal — good for most crops."}</div>
            <div style={{ fontSize: 13, color: "#bf360c", marginTop: 6 }}>• {weather.current.wind_kph > 25 ? "Strong winds — avoid spraying pesticides today." : "Wind speed is low — safe for pesticide spraying."}</div>
            <div style={{ fontSize: 13, color: "#bf360c", marginTop: 6 }}>• {weather.forecast.forecastday[0].day.daily_chance_of_rain > 60 ? "High chance of rain — delay irrigation and harvesting." : "Low rain chance — irrigation may be needed."}</div>
          </div>
        </>
      )}

      {!weather && !loading && (
        <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 30, textAlign: "center", color: theme.muted, fontSize: 14 }}>
          🔍 Enter your city or district above to get live weather and farm alerts!
        </div>
      )}
    </div>
  );
}


function AIAdvisor({ t, language, authFetch }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Namaste! 🌾 I'm your AI Farm Advisor. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
 
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
 
  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const reply = await apiChat(authFetch, `You are an expert agricultural advisor for Indian farmers. Answer this: ${userMsg}. Please Respond entirely in ${languageNativeName[language]} language. Do not switch to English.`) || "Sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Connection error. Please check your internet and try again." }]);
    }
    setLoading(false);
  }
 
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "500px", background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
      <div style={{ background: theme.leaf, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>🤖</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "'Playfair Display', serif" }}>AI Farm Advisor</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>{t.poweredBy}</div>
        </div>
        <div style={{ marginLeft: "auto", background: "#6db87f", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#fff" }}>● {t.onlineStatus}</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role === "user" ? theme.leaf : "#f0ebe0",
              color: m.role === "user" ? "#fff" : theme.soil,
              fontSize: 13, lineHeight: 1.55, fontFamily: "'Lato', sans-serif",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#f0ebe0", borderRadius: "18px 18px 18px 4px", padding: "10px 16px", fontSize: 18 }}>
              <span style={{ animation: "pulse 1s infinite" }}>●</span> <span style={{ animation: "pulse 1s 0.2s infinite" }}>●</span> <span style={{ animation: "pulse 1s 0.4s infinite" }}>●</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${theme.border}`, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder={t.chatPlaceholder}
          style={{ flex: 1, border: `1px solid ${theme.border}`, borderRadius: 24, padding: "9px 16px", fontSize: 13, outline: "none", background: "#fafaf6", fontFamily: "'Lato', sans-serif", color: theme.soil }}
        />
        <button onClick={send} disabled={loading} style={{ background: theme.leaf, color: "#fff", border: "none", borderRadius: 24, padding: "9px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
          {t.sendBtn}
        </button>
      </div>
    </div>
  );
}
 
// ── Disease Analyzer ─────────────────────────────────────────────
function DiseaseAnalyzer({ t, language, authFetch }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function analyze() {
    if ((!query.trim() && !image) || loading) return;
    setLoading(true);
    setResult(null);
    try {
      if (image) {
        const text = await apiAnalyzeImage(authFetch, image, query);
        setResult(text || "Could not analyze image. Please try again.");
      } else {
        const text = await apiChat(authFetch, `You are a plant pathologist. A farmer describes these crop symptoms: ${query}. Identify the disease, cause, severity, treatment steps, and prevention tips. Please Respond entirely in ${languageNativeName[language]} language. Do not switch to English.`);
        setResult(text || "Could not analyze. Please try again.");
      }
    } catch {
      setResult("Connection error. Please try again.");
    }
    setLoading(false);
  }
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: theme.soil, marginBottom: 12 }}>🔍 {t.diseaseTitle}</div>
        <p style={{ fontSize: 13, color: theme.muted, marginBottom: 14, fontFamily: "'Lato', sans-serif" }}>{t.diseaseDesc}</p>

        <div onClick={() => fileRef.current.click()}
          style={{ border: `2px dashed ${imagePreview ? theme.leaf : theme.border}`, borderRadius: 12, padding: 20, textAlign: "center", cursor: "pointer", background: imagePreview ? "#f0f7f0" : "#fafaf6", marginBottom: 12 }}>
          {imagePreview ? (
            <div>
              <img src={imagePreview} alt="uploaded" style={{ maxHeight: 180, borderRadius: 8, marginBottom: 8 }} />
              <div style={{ fontSize: 12, color: theme.leaf, fontWeight: 600 }}>✅ Image uploaded — click to change</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.soil }}>Click to upload crop photo</div>
              <div style={{ fontSize: 11, color: theme.muted, marginTop: 4 }}>JPG, PNG supported</div>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />

        <div style={{ fontSize: 12, color: theme.muted, textAlign: "center", marginBottom: 8 }}>— OR describe symptoms below —</div>

        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. My tomato leaves have brown spots with yellow edges and the plant is wilting from the bottom..."
          rows={3}
          style={{ width: "100%", border: `1px solid ${theme.border}`, borderRadius: 10, padding: 12, fontSize: 13, resize: "none", outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif", boxSizing: "border-box" }}
        />
        <button onClick={analyze} disabled={loading || (!query.trim() && !image)}
          style={{ marginTop: 10, background: loading ? theme.muted : theme.red, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Lato', sans-serif" }}>
          {loading ? t.diseaseLoading : image ? `🔬 ${t.diseaseAnalyze}` : `🧬 ${t.diseaseBtn}`}
        </button>
        {result && (
          <div style={{ marginTop: 16, background: "#fff9f0", border: `1px solid #f5ddb0`, borderRadius: 10, padding: 16, fontSize: 13, color: theme.soil, lineHeight: 1.7, fontFamily: "'Lato', sans-serif", whiteSpace: "pre-wrap" }}>
            {result}
          </div>
        )}
      </div>
 
      <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: theme.soil, marginBottom: 14 }}>📚 Common Disease Library</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {diseases.map((d, i) => (
            <div key={i} onClick={() => setSelected(selected === i ? null : i)}
              style={{ borderRadius: 10, border: `1px solid ${theme.border}`, overflow: "hidden", cursor: "pointer" }}>
              <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: selected === i ? "#f5ede0" : "#fff" }}>
                <div>
                  <span style={{ fontWeight: 700, color: theme.soil, fontSize: 14, fontFamily: "'Lato', sans-serif" }}>{d.name}</span>
                  <span style={{ marginLeft: 10, background: d.severity === "High" ? "#fde8e8" : "#fef9e7", color: d.severity === "High" ? theme.red : "#b7950b", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{d.severity}</span>
                </div>
                <span style={{ color: theme.muted }}>{selected === i ? "▲" : "▼"}</span>
              </div>
              {selected === i && (
                <div style={{ padding: "12px 16px", background: "#fafaf6", borderTop: `1px solid ${theme.border}` }}>
                  <div style={{ marginBottom: 8 }}><strong style={{ color: theme.bark }}>Symptoms:</strong> <span style={{ color: theme.muted, fontSize: 13 }}>{d.symptoms}</span></div>
                  <div><strong style={{ color: theme.bark }}>Treatment:</strong> <span style={{ color: theme.muted, fontSize: 13 }}>{d.treatment}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
// ── Crop Recommender ─────────────────────────────────────────────
function CropRecommender({ t, language, authFetch }) {
  const [season, setSeason] = useState("Kharif");
  const [soil, setSoil] = useState("");
  const [crop, setCrop] = useState("");
  const [aiTips, setAiTips] = useState("");
  const [state, setState] = useState("");
  const [result, setResult] = useState(null);
  
  const cropInfo = {
  Potato: { suitability: "87%", water: "Medium", fertilizer: "NPK", duration: "100 Days", profit: "High" },
  Rice: { suitability: "95%", water: "High", fertilizer: "Urea + DAP", duration: "120 Days", profit: "High" },
  Wheat: { suitability: "90%", water: "Medium", fertilizer: "Urea + NPK", duration: "110 Days", profit: "High" },
  Cotton: { suitability: "88%", water: "Medium", fertilizer: "DAP + Potash", duration: "180 Days", profit: "High" },
  Maize: { suitability: "85%", water: "Medium", fertilizer: "Urea + NPK", duration: "100 Days", profit: "Medium" },
  Groundnut: { suitability: "92%", water: "Low", fertilizer: "Gypsum + DAP", duration: "110 Days", profit: "High" },
  Tomato: { suitability: "89%", water: "Medium", fertilizer: "NPK", duration: "90 Days", profit: "High" }
};
  async function getAITips() {

  if (!crop || !soil || !season || !state) return;

 
  setAiTips("");

  setResult(cropInfo[crop] || null);
  const localTips = {
  Rice: "✓ Best in clay soil\n✓ Maintain water level\n✓ Apply Urea + DAP\n✓ Watch for Blast disease\n✓ Expected Yield: 20-25 quintals/acre",

  Wheat: "✓ Best in loamy soil\n✓ Timely irrigation required\n✓ Apply NPK fertilizer\n✓ Watch for Rust disease\n✓ Expected Yield: 18-22 quintals/acre",

  Cotton: "✓ Best in black soil\n✓ Avoid waterlogging\n✓ Use DAP + Potash\n✓ Watch for Bollworm\n✓ Expected Yield: 8-12 quintals/acre",

  Maize: "✓ Requires moderate water\n✓ Use balanced fertilizer\n✓ Watch for Fall Armyworm\n✓ Expected Yield: 20-30 quintals/acre",

  Groundnut: "✓ Grows well in sandy soil\n✓ Avoid excess irrigation\n✓ Apply Gypsum\n✓ Watch for Leaf Spot\n✓ Expected Yield: 10-15 quintals/acre",

  Tomato: "✓ Requires regular watering\n✓ Use NPK fertilizer\n✓ Watch for Early Blight\n✓ Expected Yield: 250-350 quintals/acre",

  Potato: "✓ Requires cool climate\n✓ Use Potassium-rich fertilizer\n✓ Watch for Late Blight\n✓ Expected Yield: 80-120 quintals/acre"
};

setAiTips(localTips[crop] || "Local recommendation available.");

  

 
}
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 20 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: theme.soil, marginBottom: 6 }}>🌱 {t.cropTitle}</div>
        <p style={{ fontSize: 13, color: theme.muted, marginBottom: 16 }}>Enter your crop, soil type and season to get AI-powered farming tips.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Crop Name</label>
            <select value={crop} onChange={e => setCrop(e.target.value)} style={{ width: "100%", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif", boxSizing: "border-box" }}>
<option value="">Select Crop</option>
<option value="Rice">Rice</option>
<option value="Wheat">Wheat</option>
<option value="Cotton">Cotton</option>
<option value="Maize">Maize</option>
<option value="Groundnut">Groundnut</option>
<option value="Tomato">Tomato</option>
<option value="Potato">Potato</option>
<option value="Onion">Onion</option>
<option value="Chilli">Chilli</option>
<option value="Turmeric">Turmeric</option>
<option value="Sugarcane">Sugarcane</option>
</select>
           </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Soil Type</label>
            <select value={soil} onChange={e => setSoil(e.target.value)} style={{ width: "100%", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif", boxSizing: "border-box" }}>
<option value="">Select Soil Type</option>
<option value="Black">Black Soil</option>
<option value="Red">Red Soil</option>
<option value="Loamy">Loamy Soil</option>
<option value="Sandy">Sandy Soil</option>
<option value="Clay">Clay Soil</option>
</select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Season</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Kharif", "Rabi", "Zaid"].map(s => (
                <button key={s} onClick={() => setSeason(s)} style={{ flex: 1, padding: "9px 14px", borderRadius: 8, border: `2px solid ${season === s ? theme.leaf : theme.border}`, background: season === s ? theme.leaf : "#fff", color: season === s ? "#fff" : theme.soil, fontWeight: season === s ? 700 : 400, fontSize: 13, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
        <div>
  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>State</label>
  <select value={state} onChange={e => setState(e.target.value)} style={{ width: "100%", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif", boxSizing: "border-box" }}>
    <option value="">Select State</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Telangana">Telangana</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Punjab">Punjab</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Kerala">Kerala</option>
    <option value="Rajasthan">Rajasthan</option>
  </select>
</div>


        <div style={{ background: "#f0f7f0", borderRadius: 10, padding: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.bark, marginBottom: 8 }}>💡 Try these examples:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[["Rice", "Clay", "Kharif"], ["Wheat", "Loamy", "Rabi"], ["Cotton", "Black", "Kharif"], ["Tomato", "Red", "Zaid"]].map(([c, s, se], i) => (
              <button key={i} onClick={() => { setCrop(c); setSoil(s); setSeason(se); }}
                style={{ background: "#fff", border: `1px solid #a5d6a7`, borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#2e7d32", cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
                🌿 {c} · {s} · {se}
              </button>
            ))}
          </div>
        </div>


        <button onClick={getAITips} disabled={!crop || !soil || !state}
          style={{ width: "100%", background: theme.leaf, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
          {`💡 ${t.getAITips}`}
        </button>

        {aiTips && (
          <div style={{ marginTop: 16, background: "#fffde7", border: `1px solid #ffe082`, borderRadius: 10, padding: 16, fontSize: 13, color: theme.soil, lineHeight: 1.8, fontFamily: "'Lato', sans-serif", whiteSpace: "pre-wrap" }}>
            <div style={{ fontWeight: 700, color: theme.bark, marginBottom: 8 }}>🌾 AI Tips for {crop} · {soil} Soil · {season}</div>
            {aiTips}
          </div>
        )}
          {result && (
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 16 }}>

<div style={{ background: "#f0f7f0", borderRadius: 12, padding: 14 }}>
<div style={{ fontWeight: 700 }}>🌾 Crop</div>
<div>{crop}</div>
</div>

<div style={{ background: "#e8f5e9", borderRadius: 12, padding: 14 }}>
<div style={{ fontWeight: 700 }}>📊 Suitability</div>
<div>{result.suitability}</div>
</div>

<div style={{ background: "#e3f2fd", borderRadius: 12, padding: 14 }}>
<div style={{ fontWeight: 700 }}>💧 Water Need</div>
<div>{result.water}</div>
</div>

<div style={{ background: "#fff3e0", borderRadius: 12, padding: 14 }}>
<div style={{ fontWeight: 700 }}>🧪 Fertilizer</div>
<div>{result.fertilizer}</div>
</div>

<div style={{ background: "#f3e5f5", borderRadius: 12, padding: 14 }}>
<div style={{ fontWeight: 700 }}>⏳ Duration</div>
<div>{result.duration}</div>
</div>

<div style={{ background: "#fce4ec", borderRadius: 12, padding: 14 }}>
<div style={{ fontWeight: 700 }}>💰 Profit</div>
<div>{result.profit}</div>
</div>

</div>
)}
      </div>
    </div>
  );
}
 
function YieldPredictor({ language, t, authFetch }) {
  
  const [crop, setCrop] = useState("");
  const [land, setLand] = useState("");
  const [soil, setSoil] = useState("");
  const [season, setSeason] = useState("Kharif");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function predict() {

  if (!crop || !land) return;

  setLoading(true);

  const cropData = {
    Rice: { yield: 25, price: 2200, cost: 18000 },
    Wheat: { yield: 20, price: 2400, cost: 15000 },
    Cotton: { yield: 10, price: 6500, cost: 22000 },
    Maize: { yield: 22, price: 2100, cost: 14000 },
    Soybean: { yield: 12, price: 4500, cost: 16000 },
    Groundnut: { yield: 15, price: 6000, cost: 18000 },
    Chilli: { yield: 25, price: 12000, cost: 45000 },
    Turmeric: { yield: 30, price: 8000, cost: 35000 },
    Potato: { yield: 90, price: 1000, cost: 25000 },
    Onion: { yield: 70, price: 1600, cost: 28000 },
    Tomato: { yield: 80, price: 1200, cost: 30000 },
    Sugarcane: { yield: 350, price: 350, cost: 40000 },
    Millets: { yield: 18, price: 2500, cost: 12000 },
    Sunflower: { yield: 10, price: 5500, cost: 17000 },
    Pulses: { yield: 12, price: 7000, cost: 15000 }
  };

  const data = cropData[crop];

  if (!data) {
    setResult("Please select a valid crop.");
    setLoading(false);
    return;
  }

  const acres = parseFloat(land);

  const totalYield = data.yield * acres;
  const revenue = totalYield * data.price;
  const totalCost = acres * data.cost;
  const profit = revenue - totalCost;

  setResult(`
🌾 Expected Yield

Per Acre: ${data.yield} quintals

Total Yield: ${totalYield.toFixed(1)} quintals

💰 Estimated Revenue

₹${revenue.toLocaleString("en-IN")}

💸 Estimated Input Cost

₹${totalCost.toLocaleString("en-IN")}

📈 Estimated Net Profit

₹${profit.toLocaleString("en-IN")}

🌱 Soil Type: ${soil || "Not Selected"}

☀️ Season: ${season}

⚠️ Key Risks
• Weather changes
• Pest attacks
• Market fluctuations

💡 Recommendations
• Use certified seeds
• Follow proper irrigation schedule
• Apply balanced fertilizers
• Monitor crop health regularly

Note: These are estimated values based on standard agricultural data.
`);

  setLoading(false);
}

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "linear-gradient(135deg, #1b5e20, #4caf50)", borderRadius: 16, padding: 24, color: "#fff" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, marginBottom: 6 }}> 🌾 Yield & Profit Predictor</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>{t.yieldSub}</div>
      </div>
      <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: theme.muted, marginBottom: 6, textTransform: "uppercase" }}>Crop Name</label>
            <select
  value={crop}
  onChange={(e) => setCrop(e.target.value)}
  style={{
    width: "100%",
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    background: "#fafaf6",
    color: theme.soil,
    fontFamily: "'Lato', sans-serif",
    boxSizing: "border-box"
  }}
>
  <option value="">Select Crop</option>

  <option value="Rice">Rice</option>
  <option value="Wheat">Wheat</option>
  <option value="Cotton">Cotton</option>
  <option value="Maize">Maize</option>
  <option value="Soybean">Soybean</option>
  <option value="Groundnut">Groundnut</option>
  <option value="Chilli">Chilli</option>
  <option value="Turmeric">Turmeric</option>
  <option value="Potato">Potato</option>
  <option value="Onion">Onion</option>
  <option value="Tomato">Tomato</option>
  <option value="Sugarcane">Sugarcane</option>
  <option value="Millets">Millets</option>
  <option value="Sunflower">Sunflower</option>
  <option value="Pulses">Pulses</option>
</select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: theme.muted, marginBottom: 6, textTransform: "uppercase" }}>Land Size (Acres)</label>
              <input value={land} onChange={e => setLand(e.target.value)} placeholder="e.g. 2.5"type="number" min="0.1" step="0.1"
                style={{ width: "100%", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: theme.muted, marginBottom: 6, textTransform: "uppercase" }}>Soil Type</label>
              <input value={soil} onChange={e => setSoil(e.target.value)} placeholder="e.g. Black, Red, Loamy..."
                style={{ width: "100%", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: theme.muted, marginBottom: 6, textTransform: "uppercase" }}>Season</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["Kharif", "Rabi", "Zaid"].map(s => (
                  <button key={s} onClick={() => setSeason(s)} style={{ flex: 1, padding: "10px 6px", borderRadius: 8, border: `2px solid ${season === s ? theme.leaf : theme.border}`, background: season === s ? theme.leaf : "#fff", color: season === s ? "#fff" : theme.soil, fontWeight: season === s ? 700 : 400, fontSize: 12, cursor: "pointer" }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: "#f0f7f0", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.bark, marginBottom: 8 }}>💡 Try examples:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[["Rice", "2", "Clay", "Kharif"], ["Wheat", "5", "Loamy", "Rabi"], ["Cotton", "3", "Black", "Kharif"]].map(([c, l, s, se], i) => (
                <button key={i} onClick={() => { setCrop(c); setLand(l); setSoil(s); setSeason(se); }}
                  style={{ background: "#fff", border: "1px solid #a5d6a7", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#2e7d32", cursor: "pointer" }}>
                  🌿 {c} · {l} acres · {s}
                </button>
              ))}
            </div>
          </div>
          <button onClick={predict} disabled={loading || !crop.trim() || !land.trim()}
            style={{ background: loading ? theme.muted : "#1b5e20", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
            {loading ? t.predictingBtn : t.predictBtn}
          </button>
          {result && (
            <div style={{ background: "#f1f8e9", border: "1px solid #aed581", borderRadius: 12, padding: 18, fontSize: 13, color: theme.soil, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SoilAnalyzer({ language, t, authFetch }) {
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualSoil, setManualSoil] = useState("");
  const fileRef = useRef(null);
  const soilKnowledge = {
    Black: {
      ph: "6.5 - 8.0",
      crops: "Cotton, Soybean, Groundnut",
      fertilizer: "Urea, DAP",
      color: "Dark Black",
      texture: "Clayey"
    },

    Red: {
      ph: "5.5 - 7.0",
      crops: "Millets, Groundnut, Pulses",
      fertilizer: "NPK + Organic Manure",
      color: "Red",
      texture: "Sandy Loam"
    },

    Loamy: {
      ph: "6.0 - 7.5",
      crops: "Rice, Wheat, Sugarcane, Vegetables",
      fertilizer: "Balanced NPK",
      color: "Brown",
      texture: "Fine & Fertile"
    },

    Sandy: {
      ph: "5.5 - 7.5",
      crops: "Groundnut, Watermelon",
      fertilizer: "Organic Compost",
      color: "Light Brown",
      texture: "Loose"
    },

    Clay: {
      ph: "6.0 - 8.0",
      crops: "Rice, Sugarcane",
      fertilizer: "Nitrogen Rich",
      color: "Dark Brown",
      texture: "Sticky"
    }
  };

 



  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setManualSoil("");
    const reader = new FileReader();
    reader.onload = () => { setImage(reader.result); setPreview(reader.result); };
    reader.readAsDataURL(file);
  }

  async function analyze() {
   if (manualSoil) {
  setResult({
    soilType: manualSoil,
    ...soilKnowledge[manualSoil]
  });
  return;
}
    setLoading(true);
    setResult("");
    try {
      const soilType = await apiAnalyzeImage(
  authFetch,
  image,
  `Identify ONLY the soil type from this image.

Choose exactly one:
Black
Red
Loamy
Sandy
Clay

Choose exactly one word:

Black
Red
Loamy
Sandy
Clay

Reply with ONLY that one word.
No explanation.
No sentence.
No markdown..`
);
let detectedSoil = "Unknown";

if (soilType.includes("Black")) {
  detectedSoil = "Black";
}
else if (soilType.includes("Red")) {
  detectedSoil = "Red";
}
else if (soilType.includes("Loamy")) {
  detectedSoil = "Loamy";
}
else if (soilType.includes("Sandy")) {
  detectedSoil = "Sandy";
}
else if (soilType.includes("Clay")) {
  detectedSoil = "Clay";
}

const soilData = soilKnowledge[detectedSoil];

if (soilData) {
  setResult({
    soilType: detectedSoil,
    ...soilData
  });
} else {
  setResult({
    soilType: detectedSoil,
    color: "Unknown",
    texture: "Unknown",
    ph: "Unknown",
    crops: "Not available",
    fertilizer: "Not available"
  });
}
    } catch (err) {
  console.error(err);
setResult({
  soilType: "Loamy",
  color: "Brown",
  texture: "Fine & Fertile",
  ph: "6.0 - 7.5",
  crops: "Rice, Wheat, Sugarcane, Vegetables",
  fertilizer: "Balanced NPK"
});
}
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "linear-gradient(135deg, #4e342e, #8d6e63)", borderRadius: 16, padding: 24, color: "#fff" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, marginBottom: 6 }}>{t.soilAnalyzerTitle}</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>Upload a photo of your soil → AI identifies type, quality & best crops</div>
      </div>
      <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 24 }}>
        <div onClick={() => fileRef.current.click()}
          style={{ border: `2px dashed ${preview ? "#8d6e63" : theme.border}`, borderRadius: 14, padding: 28, textAlign: "center", cursor: "pointer", background: preview ? "#efebe9" : "#fafaf6", marginBottom: 16 }}>
          {preview ? (
            <div>
              <img src={preview} alt="soil" style={{ maxHeight: 220, borderRadius: 10, marginBottom: 10 }} />
              <div style={{ fontSize: 12, color: "#6d4c41", fontWeight: 600 }}>✅ Soil photo uploaded — click to change</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🪨</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.soil, marginBottom: 4 }}>Click to upload soil photo</div>
              <div style={{ fontSize: 12, color: theme.muted }}>Take a clear photo of your soil in natural light</div>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
        <select
  value={manualSoil}
  onChange={(e) => setManualSoil(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    border: `1px solid ${theme.border}`,
    marginBottom: 12,
    background: "#fff"
  }}
>
  <option value="">Or Select Soil Type Manually</option>
  <option value="Black">Black Soil</option>
  <option value="Red">Red Soil</option>
  <option value="Loamy">Loamy Soil</option>
  <option value="Sandy">Sandy Soil</option>
  <option value="Clay">Clay Soil</option>
</select>
        <button onClick={analyze} disabled={loading || (!image && !manualSoil)}
          style={{ width: "100%", background: loading ? theme.muted : "#4e342e", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          {loading ? t.analyzingSoilBtn : t.analyzeSoilBtn}
        </button>
        {result && typeof result === "object" && (
  <div
    style={{
      marginTop: 16,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 12
    }}
  >

    <div style={{ background: "#efebe9", borderRadius: 12, padding: 16 }}>
      <div style={{ fontWeight: 700 }}>🪨 Soil Type</div>
      <div style={{ marginTop: 8 }}>{result.soilType}</div>
    </div>

    <div style={{ background: "#fbe9e7", borderRadius: 12, padding: 16 }}>
      <div style={{ fontWeight: 700 }}>🎨 Soil Color</div>
      <div style={{ marginTop: 8 }}>{result.color}</div>
    </div>

    <div style={{ background: "#fff8e1", borderRadius: 12, padding: 16 }}>
      <div style={{ fontWeight: 700 }}>🧱 Texture</div>
      <div style={{ marginTop: 8 }}>{result.texture}</div>
    </div>

    <div style={{ background: "#e3f2fd", borderRadius: 12, padding: 16 }}>
      <div style={{ fontWeight: 700 }}>🧪 Estimated pH</div>
      <div style={{ marginTop: 8 }}>{result.ph}</div>
    </div>

    <div style={{ background: "#e8f5e9", borderRadius: 12, padding: 16 }}>
      <div style={{ fontWeight: 700 }}>🌾 Suitable Crops</div>
      <div style={{ marginTop: 8 }}>{result.crops}</div>
    </div>

    <div style={{ background: "#f3e5f5", borderRadius: 12, padding: 16 }}>
      <div style={{ fontWeight: 700 }}>💊 Recommended Fertilizer</div>
      <div style={{ marginTop: 8 }}>{result.fertilizer}</div>
    </div>

  </div>
)}
      </div>
    </div>
  );
}

function MandiFinder({ language, t, authFetch }) {
  
  const [state, setState] = useState("");
  const [mandis, setMandis] = useState([]);
  const [loading, setLoading] = useState(false);
 async function findMandis() {

  if (!state) return;

  setLoading(true);

  try {

    const response = await fetch(
      `http://localhost:3001/api/mandis?state=${encodeURIComponent(state)}`
    );

    const data = await response.json();

    setMandis(data);

  } catch (err) {

    console.error(err);

    setMandis([]);

  } finally {

    setLoading(false);

  }
}

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "linear-gradient(135deg, #1a237e, #3949ab)", borderRadius: 16, padding: 24, color: "#fff" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, marginBottom: 6 }}>🗺️ Nearby Mandi Finder</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>{t.mandiSub}</div>
      </div>
      <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 24 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: theme.muted, marginBottom: 8, textTransform: "uppercase" }}>{t.locationLabel}</label>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
         <select
  value={state}
  onChange={(e) => setState(e.target.value)}
  style={{
    flex: 1,
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 13,
    outline: "none",
    background: "#fafaf6",
    color: theme.soil,
    fontFamily: "'Lato', sans-serif"
  }}
>
<option value="">Select State</option>

<option value="Andhra Pradesh">Andhra Pradesh</option>
<option value="Telangana">Telangana</option>
<option value="Maharashtra">Maharashtra</option>
<option value="Punjab">Punjab</option>
<option value="Karnataka">Karnataka</option>
<option value="Tamil Nadu">Tamil Nadu</option>
<option value="Kerala">Kerala</option>
<option value="Rajasthan">Rajasthan</option>
  
</select>
          <button onClick={findMandis} disabled={loading || !state}
            style={{ background: "#1a237e", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
            {loading ? t.findingBtn : t.findMandisBtn}
          </button>
        </div>
        
         {mandis.length > 0 && (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {mandis.map((m, index) => (
      <div
        key={index}
        style={{
          background: "#e8eaf6",
          border: "1px solid #9fa8da",
          borderRadius: 12,
          padding: 16
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15 }}>
          🏪 {m.mandiName}
        </div>

        <div style={{ marginTop: 8 }}>
          📍 {m.address}
        </div>
        <div
  style={{
    display: "inline-block",
    marginTop: 10,
    background: "#e8f5e9",
    color: "#2e7d32",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600
  }}
>
  Agricultural Market
</div>
        
      </div>
    ))}
  </div>
)}
    
      </div>
    </div>
  );
}

function SeedCalculator({ language, t, authFetch }) {
  
  const [crop, setCrop] = useState("");
  const [land, setLand] = useState("");
  const [method, setMethod] = useState("Transplanting");
  const [result, setResult] = useState("null");
  const [loading, setLoading] = useState(false);
  const cropData = {
  Rice: {
    seedRate: 20,
    water: 1200000,
    fertilizer: "Urea 100kg, DAP 50kg",
    cost: 15000
  },

  Wheat: {
    seedRate: 40,
    water: 800000,
    fertilizer: "Urea 80kg, DAP 40kg",
    cost: 12000
  },

  Cotton: {
    seedRate: 2,
    water: 900000,
    fertilizer: "Urea 120kg, DAP 60kg",
    cost: 20000
  },

  Maize: {
    seedRate: 8,
    water: 700000,
    fertilizer: "Urea 90kg, DAP 45kg",
    cost: 14000
  },

  Groundnut: {
    seedRate: 60,
    water: 500000,
    fertilizer: "Urea 40kg, DAP 50kg",
    cost: 18000
  },

  Tomato: {
    seedRate: 0.1,
    water: 600000,
    fertilizer: "NPK 100kg",
    cost: 25000
  },
  

Soybean: {
  seedRate: 30,
  water: 500000,
  fertilizer: "DAP 50kg, Potash 20kg",
  cost: 13000
},

Chilli: {
  seedRate: 0.5,
  water: 600000,
  fertilizer: "NPK 120kg",
  cost: 35000
},

Turmeric: {
  seedRate: 800,
  water: 900000,
  fertilizer: "Organic Manure + NPK",
  cost: 40000
},

Potato: {
  seedRate: 800,
  water: 700000,
  fertilizer: "DAP 100kg, Potash 80kg",
  cost: 30000
},

Onion: {
  seedRate: 4,
  water: 650000,
  fertilizer: "NPK 100kg",
  cost: 28000
},

Sugarcane: {
  seedRate: 3500,
  water: 1800000,
  fertilizer: "Urea 150kg, DAP 100kg",
  cost: 45000
},

Millets: {
  seedRate: 4,
  water: 300000,
  fertilizer: "Urea 30kg, DAP 20kg",
  cost: 8000
},

Sunflower: {
  seedRate: 3,
  water: 450000,
  fertilizer: "NPK 60kg",
  cost: 10000
},

Pulses: {
  seedRate: 25,
  water: 350000,
  fertilizer: "DAP 40kg",
  cost: 9000
}
  
};

  function calculate() {

  if (!crop || !land) return;

  const data = cropData[crop];

  if (!data) {

    setResult(
      "Crop data not available.\n\nPlease select a supported crop."
    );

    return;
  }

  const acres = Number(land);

  let seedMultiplier = 1;

if (method === "Direct Seeding") {
  seedMultiplier = 1.25;
}

if (method === "Broadcasting") {
  seedMultiplier = 1.5;
}

const seedRequired =
  data.seedRate * acres * seedMultiplier;

  const waterRequired = data.water * acres;

  let costMultiplier = 1;

if (method === "Transplanting") {
  costMultiplier = 1.2;
}

if (method === "Broadcasting") {
  costMultiplier = 0.9;
}

const totalCost =
  data.cost * acres * costMultiplier;

  setResult({
  seed: `${seedRequired} kg`,
  water: `${waterRequired.toLocaleString()} liters`,
  fertilizer: data.fertilizer,
  cost: `₹${totalCost.toLocaleString()}`,
  crop,
  method
});
}

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "linear-gradient(135deg, #e65100, #ff8f00)", borderRadius: 16, padding: 24, color: "#fff" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, marginBottom: 6 }}>🧮 Smart Seed & Input Calculator
</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>Enter crop & land size → Get exact seeds, fertilizer, water & cost</div>
      </div>
      <div style={{ background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: theme.muted, marginBottom: 6, textTransform: "uppercase" }}>Crop Name</label>
              <select
  value={crop}
  onChange={(e) => setCrop(e.target.value)}
  style={{
    width: "100%",
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    background: "#fafaf6",
    color: theme.soil,
    fontFamily: "'Lato', sans-serif",
    boxSizing: "border-box"
  }}
>
  <option value="">Select Crop</option>

  <option value="Rice">Rice</option>
  <option value="Wheat">Wheat</option>
  <option value="Cotton">Cotton</option>
  <option value="Maize">Maize</option>
  <option value="Soybean">Soybean</option>
  <option value="Groundnut">Groundnut</option>
  <option value="Chilli">Chilli</option>
  <option value="Turmeric">Turmeric</option>
  <option value="Potato">Potato</option>
  <option value="Onion">Onion</option>
  <option value="Tomato">Tomato</option>
  <option value="Sugarcane">Sugarcane</option>
  <option value="Millets">Millets</option>
  <option value="Sunflower">Sunflower</option>
  <option value="Pulses">Pulses</option>
</select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: theme.muted, marginBottom: 6, textTransform: "uppercase" }}>Land Size (Acres)</label>
              <input value={land} onChange={e => setLand(e.target.value)} placeholder="e.g. 1.5"
                style={{ width: "100%", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, outline: "none", background: "#fafaf6", color: theme.soil, fontFamily: "'Lato', sans-serif", boxSizing: "border-box" }} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: theme.muted, marginBottom: 6, textTransform: "uppercase" }}>Planting Method
</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Transplanting", "Direct Seeding", "Broadcasting"].map(m => (
                <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, padding: "9px 6px", borderRadius: 8, border: `2px solid ${method === m ? "#e65100" : theme.border}`, background: method === m ? "#fff3e0" : "#fff", color: method === m ? "#e65100" : theme.soil, fontWeight: method === m ? 700 : 400, fontSize: 11, cursor: "pointer" }}>{m}</button>
              ))}
            </div>
          </div>
          <div style={{ background: "#fff3e0", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#e65100", marginBottom: 8 }}>💡 Try examples:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[["Rice", "2"], ["Wheat", "5"], ["Tomato", "1"], ["Cotton", "3"]].map(([c, l], i) => (
                <button key={i} onClick={() => { setCrop(c); setLand(l); }}
                  style={{ background: "#fff", border: "1px solid #ffcc80", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#e65100", cursor: "pointer" }}>
                  🌱 {c} · {l} acres
                </button>
              ))}
            </div>
          </div>
          <button onClick={calculate} disabled={!crop || !land.trim()}
            style={{ background: loading ? theme.muted : "#e65100", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            Calculate Requirements
          </button>
         {result && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 12
    }}
  >

    <div style={{
      background: "#e8f5e9",
      borderRadius: 12,
      padding: 16
    }}>
      <div style={{ fontWeight: 700 }}>🌱 Seed Required</div>
      <div style={{ marginTop: 8 }}>{result.seed}</div>
    </div>

    <div style={{
      background: "#e3f2fd",
      borderRadius: 12,
      padding: 16
    }}>
      <div style={{ fontWeight: 700 }}>💧 Water Requirement</div>
      <div style={{ marginTop: 8 }}>{result.water}</div>
    </div>

    <div style={{
      background: "#fff8e1",
      borderRadius: 12,
      padding: 16
    }}>
      <div style={{ fontWeight: 700 }}>🧪 Fertilizer</div>
      <div style={{ marginTop: 8 }}>{result.fertilizer}</div>
    </div>

    <div style={{
      background: "#f3e5f5",
      borderRadius: 12,
      padding: 16
    }}>
      <div style={{ fontWeight: 700 }}>💰 Estimated Cost</div>
      <div style={{ marginTop: 8 }}>{result.cost}</div>
    </div>

    <div style={{
      background: "#ede7f6",
      borderRadius: 12,
      padding: 16
    }}>
      <div style={{ fontWeight: 700 }}>🌾 Crop</div>
      <div style={{ marginTop: 8 }}>{result.crop}</div>
    </div>

    <div style={{
      background: "#fce4ec",
      borderRadius: 12,
      padding: 16
    }}>
      <div style={{ fontWeight: 700 }}>🚜 Method</div>
      <div style={{ marginTop: 8 }}>{result.method}</div>
    </div>

  </div>
)}
        </div>
      </div>
    </div>
  );
}
  export default function KisanSaathiDashboard() {
  const { authFetch, logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [language, setLanguage] = useState("English");
  const t = translations[language] || translations.English;

  const [dashWeather, setDashWeather] = useState(null);
  const [dashLocation, setDashLocation] = useState("Visakhapatnam");

  const [farmProfile, setFarmProfile] = useState({
  crop: localStorage.getItem("crop") || "Rice",
  sowingDate:
    localStorage.getItem("sowingDate") ||
    new Date().toISOString().split("T")[0]
});



const [showFarmModal, setShowFarmModal] = useState(false);

const saveFarmProfile = () => {

  localStorage.setItem(
    "crop",
    farmProfile.crop
  );

  localStorage.setItem(
    "sowingDate",
    farmProfile.sowingDate
  );

  setFarmProfile({
    crop: farmProfile.crop,
    sowingDate: farmProfile.sowingDate
  });

  setShowFarmModal(false);
};

const conditions = useMemo(
  () => getFarmConditions(dashWeather, weatherData),
  [dashWeather]
);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async pos => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8b00faec197b4af3aa195603260306&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`);
          const data = await res.json();
          if (!data.error) {
            setDashWeather(data);
            setDashLocation(data.location.name);
          }
        } catch {}
      });
    }
  }, []);

  const tabs = [
    { id: "dashboard", label: t.dashboard, icon: "🏠" },
    { id: "weather", label: t.weather, icon: "🌤️" },
    { id: "market", label: t.market, icon: "📈" },
    { id: "crops", label: t.crops, icon: "🌱" },
    { id: "disease", label: t.disease, icon: "🔬" },
    { id: "schemes", label: t.schemes, icon: "🏛️" },
    { id: "advisor", label: t.advisor, icon: "🤖" },
    { id: "yield", label: t.yieldTab, icon: "📊" },
    { id: "soil", label: t.soilTab, icon: "📸" },
    { id: "mandi", label: t.mandiTab, icon: "🗺️" },
    { id: "seed", label: t.seedTab, icon: "🧮" },
    ...(user?.role === "admin"
    ? [{ id: "admin", label: "Admin", icon: "🛠️" }]
    : [])
  ];

  
 
  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "'Lato', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important; transition: all 0.2s; }
      `}</style>
 
      {/* Header */}
      <div style={{ background: theme.leaf, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 30 }}>🌾</span>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>{t.appName}</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>{t.tagline}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 12 }}>
            <div>
            <div style={{ color: "#fff", fontSize: 12, opacity: 0.8 }}>📍 {dashWeather?.location?.region || "Andhra Pradesh"} </div>
              <div style={{ color: theme.wheat, fontSize: 11 }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
            </div>
            <select value={language} onChange={e => setLanguage(e.target.value)}

              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer", outline: "none" }}>
              {Object.keys(translations).map(lang => (
                <option key={lang} value={lang} style={{ background: theme.leaf, color: "#fff" }}>{lang}</option>
              ))}
            </select>
           {showFarmModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div
      style={{
        background: "#fff",
        width: 420,
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        🌾 Update Farm Details
      </h3>

      <div style={{ marginBottom: 12 }}>
        <label>Crop</label>

        <select
          value={farmProfile.crop}
          onChange={(e) =>
            setFarmProfile({
              ...farmProfile,
              crop: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: 10,
            marginTop: 6
          }}
        >
          <option>Rice</option>
          <option>Wheat</option>
          <option>Cotton</option>
          <option>Maize</option>
          <option>Sugarcane</option>
          <option>Tomato</option>
          <option>Soybean</option>
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label>Sowing Date</label>

        <input
          type="date"
          value={farmProfile.sowingDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) =>
            setFarmProfile({
              ...farmProfile,
              sowingDate: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: 10,
            marginTop: 6
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10
        }}
      >
        <button
          onClick={() => setShowFarmModal(false)}
        >
          Cancel
        </button>

        <button
          onClick={saveFarmProfile}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

        {/* ADD LOGOUT BUTTON HERE */}
        <button
          onClick={logout}
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "'Lato', sans-serif",
          }}
        >
          🚪 Logout
        </button>
          </div>
        </div>
      </div>
 
      {/* Nav Tabs */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${theme.border}`, overflowX: "auto", display: "flex" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: "12px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400, color: activeTab === tab.id ? theme.leaf : theme.muted, borderBottom: activeTab === tab.id ? `3px solid ${theme.leaf}` : "3px solid transparent", whiteSpace: "nowrap", fontFamily: "'Lato', sans-serif", transition: "all 0.2s" }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
 
      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", animation: "fadeIn 0.3s ease" }}>
 
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Hero Welcome Banner */}
            <div style={{ background: `linear-gradient(135deg, ${theme.leaf} 0%, #2d5a3d 100%)`, borderRadius: 20, padding: "28px 32px", color: "#fff", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: 20, top: 10, fontSize: 80, opacity: 0.1 }}>🌾</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>📅 {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · 📍 {dashLocation}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, marginBottom: 6 }}>
                Welcome to KisanSaathi 🌾

              </div>
              <div style={{ fontSize: 14, opacity: 0.85, maxWidth: 500 }}>
                {t.welcomeMsg}
              </div>
              {dashWeather && <div style={{ marginTop: 8, fontSize: 18 }}>📍 {dashWeather.current.temp_c}°C · {dashWeather.current.condition.text}</div>}
              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                {["🌤️ Check Weather", "📊 Market Prices", "🌱 Crop Tips", "🔬 Disease Check"].map((btn, i) => (
                  <button key={i} onClick={() => setActiveTab(["weather","market","crops","disease"][i])}
                    style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 20, padding: "7px 16px", fontSize: 12, color: "#fff", cursor: "pointer", fontWeight: 600, fontFamily: "'Lato', sans-serif" }}>
                    {btn}
                  </button>
                ))}
              </div>
            </div>

           {/* Weather Alert Banner */}

{farmAlerts.map((alert, index) => (
  <div
    key={index}
    style={{
      background: "#fff8dc",
      padding: 12,
      borderRadius: 12,
      marginBottom: 10,
      border: "1px solid #f0d98a"
    }}
  >
    ⚠️ Farm Alert: {alert}
  </div>
))}
            

            {/* Quick Stats */}
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: theme.soil, marginBottom: 12, fontWeight: 700 }}>📌 {t.todayOverview}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
                {[
                  { label: t.tempLabel, value: dashWeather ? `${dashWeather.current.temp_c}°C` : `${weatherData.current.temp}°C`, icon: "🌡️", sub: dashWeather ? `${t.feelsLike} ${dashWeather.current.feelslike_c}°C` : `${t.feelsLike} ${weatherData.current.feels}°C`, color: "#e3f2fd", border: "#90caf9" },
                  { label: t.humidity, value: dashWeather ? `${dashWeather.current.humidity}%` : `${weatherData.current.humidity}%`, icon: "💧", sub: dashWeather ? dashWeather.current.condition.text : t.moderate, color: "#e0f7fa", border: "#80deea" },
                  { label: t.windSpeed, value: dashWeather ? `${dashWeather.current.wind_kph} km/h` : `${weatherData.current.wind} km/h`, icon: "💨", sub: t.liveData, color: "#f3e5f5", border: "#ce93d8" },
                
                ].map((s, i) => (
                  <div key={i} className="card-hover" style={{ background: s.color, borderRadius: 16, border: `1.5px solid ${s.border}`, padding: "18px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "default" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 10, color: theme.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4, fontWeight: 700 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: theme.soil }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: theme.leaf, marginTop: 4, fontWeight: 600 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Smart Farm Insights */}
        <SmartFarmInsights
  conditions={conditions}
  crop={farmProfile.crop}
  currentStage={
    getCropStage(
      farmProfile.crop,
      farmProfile.sowingDate
    )?.currentStage
  }
/>

            {/* 7-Day Forecast + Crop Stage Tracker */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Weather mini / 7-Day Forecast */}
              <div style={{ background: `linear-gradient(135deg, #1565c0, #42a5f5)`, borderRadius: 18, padding: 22, color: "#fff", boxShadow: "0 4px 20px rgba(21,101,192,0.3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}>🌤️ {t.forecastLabel}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "3px 10px" }}>Live</div>
                </div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                  {(dashWeather ? dashWeather.forecast.forecastday : []).map((f, i) => (
                    <div key={i} style={{ textAlign: "center", minWidth: 52, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 6px", backdropFilter: "blur(4px)" }}>
                      <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 6, fontWeight: 700 }}>{new Date(f.date).toLocaleDateString("en-IN", { weekday: "short" })}</div>
                      <img src={f.day.condition.icon} alt="" style={{ width: 28, height: 28 }} />
                      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{f.day.maxtemp_c}°</div>
                      <div style={{ fontSize: 10, opacity: 0.7 }}>{f.day.mintemp_c}°</div>
                      <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4, background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: "2px 4px" }}>💧{f.day.daily_chance_of_rain}%</div>
                    </div>
                  ))}
                  {!dashWeather && weatherData.forecast.map((f, i) => (
                    <div key={i} style={{ textAlign: "center", minWidth: 52, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 6px" }}>
                      <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 6, fontWeight: 700 }}>{f.day}</div>
                      <div style={{ fontSize: 22 }}>{f.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{f.high}°</div>
                      <div style={{ fontSize: 10, opacity: 0.7 }}>{f.low}°</div>
                      <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4, background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: "2px 4px" }}>💧{f.rain}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crop Stage Tracker */}
             <CropStageTracker
  crop={farmProfile.crop}
  sowingDate={farmProfile.sowingDate}
onEdit={() => {
  console.log("Edit clicked");
  setShowFarmModal(true);
}}
/>
            </div>

            {/* Quick Actions */}
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: theme.soil, marginBottom: 12, fontWeight: 700 }}>⚡ {t.quickActions}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                {[
                  { icon: "🔬", label: t.disease, tab: "disease", color: "#fce4ec", border: "#f48fb1" },
                  { icon: "🌱", label: t.crops, tab: "crops", color: "#e8f5e9", border: "#a5d6a7" },
                  { icon: "🏛️", label: t.schemes, tab: "schemes", color: "#ede7f6", border: "#ce93d8" },
                  { icon: "🤖", label: t.advisor, tab: "advisor", color: "#e3f2fd", border: "#90caf9" },
                  { icon: "📈", label: t.market, tab: "market", color: "#fff8e1", border: "#ffe082" },
                  { icon: "🌤️", label: t.weather, tab: "weather", color: "#e0f7fa", border: "#80deea" },
                ].map((a, i) => (
                  <div key={i} className="card-hover" onClick={() => setActiveTab(a.tab)}
                    style={{ background: a.color, border: `1.5px solid ${a.border}`, borderRadius: 14, padding: "18px 14px", textAlign: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div style={{ fontSize: 30, marginBottom: 8 }}>{a.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: theme.soil, fontFamily: "'Lato', sans-serif" }}>{a.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Farm Task Checklist / Today's Tasks */}
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: theme.soil, marginBottom: 12, fontWeight: 700 }}>✅ {t.todayTasks}</div>
              <FarmTaskChecklist t={t} />
            </div>

            {/* Crop Calendar */}
            <CropCalendar t={t} />

          </div>
        )}

        {/* WEATHER TAB */}
        {activeTab === "weather" && (
          <WeatherTab t={t} />
        )}
           {/* MARKET TAB */}
        {activeTab === "market" && (
          <MarketTab t={t} language={language}  authFetch={authFetch}/>
        )}
 
        {/* CROPS TAB */}
        {activeTab === "crops" && <CropRecommender t={t} language={language} authFetch={authFetch} />}
 
        {/* DISEASE TAB */}
        {activeTab === "disease" && <DiseaseAnalyzer t={t} language={language} authFetch={authFetch} />}
 
        {/* SCHEMES TAB */}
        {activeTab === "schemes" && (
          <SchemesTab t={t} language={language} authFetch={authFetch}/>
        )}
 
        {/* YIELD PREDICTOR TAB */}
        {activeTab === "yield" && <YieldPredictor language={language} t={t} authFetch={authFetch}/>}

        {/* SOIL ANALYZER TAB */}
        {activeTab === "soil" && <SoilAnalyzer language={language} t={t} authFetch={authFetch}/>}

        {/* MANDI FINDER TAB */}
        {activeTab === "mandi" && <MandiFinder language={language} t={t} authFetch={authFetch}/>}

        {/* SEED CALCULATOR TAB */}
        {activeTab === "seed" && <SeedCalculator language={language} t={t} authFetch={authFetch}/>}

        {/* AI ADVISOR TAB */}
        {activeTab === "advisor" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "#2e7d32" }}>
              🤖 Ask anything in English, Hindi, Telugu, Tamil or any Indian language. The AI understands you!            </div>
            <AIAdvisor t={t} language={language} authFetch={authFetch}/>
            <div style={{ background: theme.card, borderRadius: 14, border: `1px solid ${theme.border}`, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.bark, marginBottom: 10 }}>💬 Try asking:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["What should I sow in June on black soil?", "How to treat yellowing rice leaves?", "Best time to sell onions this month?", "Which govt scheme gives free seeds?", "How much water does wheat need?"].map((q, i) => (
                  <span key={i} style={{ background: "#f0f7f0", border: "1px solid #c8e6c9", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#2e7d32", cursor: "pointer" }}>{q}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
{activeTab === "admin" && <AdminDashboard />}


 
      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px", color: theme.muted, fontSize: 11, borderTop: `1px solid ${theme.border}`, marginTop: 20 }}>
        KisanSaathi · Farmer Advisory Platform · Data sourced from IMD, Agmarknet, eNAM & Government Portals
      </div>
    </div>
  );
}

function generateWeatherAlerts(weatherData) {
  const alerts = [];

  // Temperature Alert
  if (weatherData.current.temp >= 38) {
    alerts.push(
      "🔥 High temperature detected. Increase irrigation and avoid field work during afternoon."
    );
  }

  // Humidity Alert
  if (weatherData.current.humidity >= 80) {
    alerts.push(
      "🦠 High humidity may increase fungal disease risk. Monitor crops carefully."
    );
  }

  // Wind Alert
  if (weatherData.current.wind >= 25) {
    alerts.push(
      "💨 Strong winds expected. Secure young plants and avoid spraying."
    );
  }

  // Rain Alerts from Forecast
  weatherData.forecast.forEach(day => {
    if (day.rain >= 70) {
      alerts.push(
        `🌧 Heavy rainfall expected on ${day.day}. Avoid pesticide spraying.`
      );
    }
  });

  // Default Alert
  if (alerts.length === 0) {
    alerts.push(
      "✅ Weather conditions look favorable for normal farming activities."
    );
  }

  return alerts;
}

const farmAlerts = generateWeatherAlerts(weatherData);

function AdminDashboard() {
  const [section, setSection] = useState("dashboard");

  const [activities, setActivities] = useState([
    "🔐 Admin logged in"
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div
        style={{ background: "#fff8dc", padding: 20, borderRadius: 16, border: "1px solid #f0d98a"
        }}
      >
        <h2>🛠️ Admin Dashboard</h2>
        <AdminStats />
        <p>Manage platform data and users.</p>
      </div>

      <div
        style={{display: "flex",gap: 20,alignItems: "flex-start"
        }}
      >

        {/* Sidebar */}
        <div
          style={{ width: 260, background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #ddd", height: "fit-content"
          }}
        >
          <h3>🛡️ Admin Menu</h3>
          <button
            onClick={() => setSection("dashboard")}
            style={{ width: "100%", padding: 12, marginTop: 12, border: "none", borderRadius: 10, cursor: "pointer",
              background:
                section === "dashboard"
                  ? "#2e7d32"
                  : "#f5f5f5",
              color:
                section === "dashboard"
                  ? "#fff"
                  : "#000"
            }}
          >
            🖥️ Dashboard
          </button>

          <button
            onClick={() => setSection("users")}
            style={{  width: "100%",padding: 12,marginTop: 10,border: "none",borderRadius: 10,cursor: "pointer",
              background:
                section === "users"
                  ? "#2e7d32"
                  : "#f5f5f5",
              color:
                section === "users"
                  ? "#fff"
                  : "#000"
            }}
          >
            👥 Users
          </button>

          <button
            onClick={() => setSection("market")}
            style={{  width: "100%",  padding: 12,  marginTop: 10,  border: "none",  borderRadius: 10,  cursor: "pointer",
              background:
                section === "market"
                  ? "#2e7d32"
                  : "#f5f5f5",
              color:
                section === "market"
                  ? "#fff"
                  : "#000"
            }}
          >
            📈 Market Prices
          </button>

          <button
            onClick={() => setSection("schemes")}
            style={{ width: "100%", padding: 12, marginTop: 10, border: "none", borderRadius: 10, cursor: "pointer",
              background:
                section === "schemes"
                  ? "#2e7d32"
                  : "#f5f5f5",
              color:
                section === "schemes"
                  ? "#fff"
                  : "#000"
            }}
          >
            🏛️ Schemes
          </button>
          <button
  onClick={() => setSection("notifications")}
  style={{
    width: "100%",
    padding: 12,
    marginTop: 10,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    background:
      section === "notifications"
        ? "#2e7d32"
        : "#f5f5f5",
    color:
      section === "notifications"
        ? "#fff"
        : "#000"
  }}
>
  🔔 Notifications
</button>

        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>

          {section === "dashboard" && (
            <DashboardOverview
              setSection={setSection}
              activities={activities}
            />
          )}

          {section === "users" && (
            <UsersManagement />
          )}

          {section === "market" && (
            <MarketManagement
              setActivities={setActivities}
            />
          )}

          {section === "schemes" && (
            <SchemesManagement
              setActivities={setActivities}
            />
          )}
          {section === "notifications" && (
  <NotificationsManagement
    setActivities={setActivities}
  />
)}

        </div>

      </div>

    </div>
  );
}
function DashboardOverview({ setSection,activities }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20
      }}
    >

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          border: "1px solid #ddd"
        }}
      >
        <h3>📊 Dashboard Overview</h3>
        <p>Real-time overview of platform activity.</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20
        }}
      >

        <div
          style={{
            background: "#f8fff8",
            borderRadius: 16,
            padding: 20,
            border: "1px solid #ddd"
          }}
        >
          <h3>🟢 Recent Activity</h3>

          <div style={{ marginTop: 12 }}>
           {activities.map((activity, index) => (
  <p key={index}>{activity}</p>
))}
          </div>
        </div>

        <div
          style={{
            background: "#fafcff",
            borderRadius: 16,
            padding: 20,
            border: "1px solid #ddd"
          }}
        >
          <h3>⚡ Quick Actions</h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 12
            }}
          >
          <button
  onClick={() => setSection("users")}
  style={{
    padding: 12,
    border: "none",
    borderRadius: 10,
    background: "#e8f5e9",
    cursor: "pointer",
    fontWeight: 600
  }}
>
  ➕ Add User
</button>

<button
  onClick={() => setSection("market")}
  style={{
    padding: 12,
    border: "none",
    borderRadius: 10,
    background: "#e3f2fd",
    cursor: "pointer",
    fontWeight: 600
  }}
>
  ➕ Add Market Price
</button>

<button
  onClick={() => setSection("schemes")}
  style={{
    padding: 12,
    border: "none",
    borderRadius: 10,
    background: "#fff3e0",
    cursor: "pointer",
    fontWeight: 600
  }}
>
  ➕ Add Scheme
</button>
          </div>
        </div>

      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          border: "1px solid #ddd"
        }}
      >
        <h3>📌 Platform Summary</h3>

        <p>
          KisanSaathi currently manages farmers,
          market prices and government schemes.
        </p>
      </div>

    </div>
  );
}

function NotificationsManagement({
  setActivities
}) {

  const [notifications, setNotifications] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    fetch(
      "http://localhost:3001/api/notifications"
    )
      .then(res => res.json())
      .then(data =>
        setNotifications(data)
      )
      .catch(console.error);
  }, []);

  async function addNotification() {

    const res = await fetch(
      "http://localhost:3001/api/admin/notifications",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          title,
          message
        })
      }
    );

    const data = await res.json();

    setNotifications(prev => [
      data,
      ...prev
    ]);

    setActivities(prev => [
      `🔔 Notification added`,
      ...prev
    ]);

    setTitle("");
    setMessage("");

    alert("Notification Added");
  }

  async function deleteNotification(id) {

    if (
      !window.confirm(
        "Delete notification?"
      )
    )
      return;

    await fetch(
      `http://localhost:3001/api/admin/notifications/${id}`,
      {
        method: "DELETE"
      }
    );

    setNotifications(prev =>
      prev.filter(
        n => n._id !== id
      )
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 16,
        border:
          "1px solid #ddd"
      }}
    >
      <h3>
        🔔 Notifications
      </h3>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20
        }}
      >
        <input
          placeholder="Title"
          value={title}
          onChange={e =>
            setTitle(
              e.target.value
            )
          }
        />

        <input
          placeholder="Message"
          value={message}
          onChange={e =>
            setMessage(
              e.target.value
            )
          }
          style={{
            flex: 1
          }}
        />

        <button
          onClick={
            addNotification
          }
        >
          Add
        </button>
      </div>

      {notifications.map(
        notification => (
          <div
            key={
              notification._id
            }
            style={{
              border:
                "1px solid #ddd",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10
            }}
          >
            <h4>
              {
                notification.title
              }
            </h4>

            <p>
              {
                notification.message
              }
            </p>

            <button
              onClick={() =>
                deleteNotification(
                  notification._id
                )
              }
              style={{
                background:
                  "#d32f2f",
                color: "#fff",
                border: "none",
                padding:
                  "8px 12px",
                borderRadius: 8,
                cursor:
                  "pointer"
              }}
            >
              Delete
            </button>
          </div>
        )
      )}
    </div>
  );
}
function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error);
  }, []);

  async function deleteUser(id) {

    if (!window.confirm("Delete this user?")) return;

    await fetch(
      `http://localhost:3001/api/admin/users/${id}`,
      {
        method: "DELETE"
      }
    );

    setUsers(prev =>
      prev.filter(user => user._id !== id)
    );
  }

  const filteredUsers = users.filter(user =>
    (user.fullName || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (user.email || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 20,
        border: "1px solid #ddd"
      }}
    >
      <h3>👥 Registered Users</h3>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 15,
          marginBottom: 15,
          borderRadius: 10,
          border: "1px solid #ccc"
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 3fr 2fr 2fr 1fr 1fr",
          fontWeight: 700,
          padding: 12,
          background: "#f5f5f5",
          borderRadius: 10
        }}
      >
        <div>Name</div>
        <div>Email</div>
        <div>State</div>
        <div>Crop</div>
        <div>Role</div>
        <div>Action</div>
      </div>

      {filteredUsers.map(user => (
        <div
          key={user._id}
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 3fr 2fr 2fr 1fr 1fr",
            padding: 12,
            borderBottom: "1px solid #eee",
            alignItems: "center"
          }}
        >
          <div>{user.fullName}</div>
          <div>{user.email}</div>
          <div>{user.state}</div>
          <div>{user.mainCrop}</div>
          <div>{user.role || "farmer"}</div>

          <div>
            <button
              onClick={() =>
                deleteUser(user._id)
              }
              style={{
                background: "#d32f2f",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer"
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
function MarketManagement({
  setActivities
}) {

  const [prices, setPrices] = useState([]);
  const [newCrop, setNewCrop] = useState("");
  const [newMarket, setNewMarket] = useState("");
  const [newPrice, setNewPrice] = useState("");
  
async function addPrice() {
  try {
    const res = await fetch(
      "http://localhost:3001/api/admin/market-price",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          crop: newCrop,
          market: newMarket,
          state: "Andhra Pradesh",
          pricePerQtl: Number(newPrice)
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert("Backend Error");
      return;
    }

    setPrices(prev => [...prev, data]);

    // Recent Activity
    setActivities(prev => [
      `📈 ${newCrop} price added`,
      ...prev
    ]);

    setNewCrop("");
    setNewMarket("");
    setNewPrice("");

    alert("Price Added Successfully");

  } catch (err) {
    console.error(err);
    alert("Request Failed");
  }
}

  useEffect(() => {
    fetch("http://localhost:3001/api/market-prices?state=Andhra Pradesh")
      .then(res => res.json())
      .then(data => setPrices(data))
      .catch(console.error);
  }, []);

  async function savePrice(id, pricePerQtl) {

  await fetch(
    `http://localhost:3001/api/admin/market-price/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pricePerQtl
      })
    }
  );

  setActivities(prev => [
    "✏️ Market price updated",
    ...prev
  ]);

  alert("Price Updated");
}

  return (
    <div
      style={{
        background:"#fff",
        padding:20,
        borderRadius:16,
        border:"1px solid #ddd"
      }}
    >

      <h3>📈 Market Price Management</h3>
      <div
  style={{
    display: "flex",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap"
  }}
>
  <input
    placeholder="Crop"
    value={newCrop}
    onChange={(e) => setNewCrop(e.target.value)}
  />

  <input
    placeholder="Market"
    value={newMarket}
    onChange={(e) => setNewMarket(e.target.value)}
  />

  <input
    type="number"
    placeholder="Price"
    value={newPrice}
    onChange={(e) => setNewPrice(e.target.value)}
  />

  <button
    onClick={addPrice}
    style={{
      background: "#2e7d32",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: 8,
      cursor: "pointer"
    }}
  >
    Add Price
  </button>
</div>

     <table
  style={{
    width: "100%",
    marginTop: 16,
    borderCollapse: "collapse"
  }}
>
  <thead>
    <tr style={{ background: "#f5f5f5" }}>
      <th style={{ padding: 12, textAlign: "left" }}>Crop</th>
      <th style={{ padding: 12, textAlign: "left" }}>Market</th>
      <th style={{ padding: 12, textAlign: "left" }}>Price/Qtl</th>
      <th style={{ padding: 12, textAlign: "center" }}>Action</th>
    </tr>
  </thead>

  <tbody>
    {prices.map(item => (
      <tr
        key={item._id}
        style={{ borderTop: "1px solid #eee" }}
      >
        <td style={{ padding: 12 }}>{item.crop}</td>

        <td style={{ padding: 12 }}>
          {item.market}
        </td>

        <td style={{ padding: 12 }}>
          <input
            type="number"
            defaultValue={item.pricePerQtl}
            onChange={(e) =>
              (item.pricePerQtl = e.target.value)
            }
            style={{
              padding: 8,
              width: 120,
              borderRadius: 8,
              border: "1px solid #ccc"
            }}
          />
        </td>

        <td
          style={{
            padding: 12,
            textAlign: "center"
          }}
        >
         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
  <button
    onClick={() =>
      savePrice(item._id, item.pricePerQtl)
    }
    style={{
      background: "#2e7d32",
      color: "#fff",
      border: "none",
      padding: "8px 12px",
      borderRadius: 8,
      cursor: "pointer"
    }}
  >
    Save
  </button>

  <button
    onClick={() => deletePrice(item._id)}
    style={{
      background: "#d32f2f",
      color: "#fff",
      border: "none",
      padding: "8px 12px",
      borderRadius: 8,
      cursor: "pointer"
    }}
  >
    Delete
  </button>
</div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
  
async function deletePrice(id) {

  if (!window.confirm("Delete this price?")) return;

  await fetch(
    `http://localhost:3001/api/admin/market-price/${id}`,
    {
      method: "DELETE"
    }
  );

  setPrices(prices.filter(p => p._id !== id));

  setActivities(prev => [
    "🗑️ Market price deleted",
    ...prev
  ]);
}
}

function SchemesManagement({
  setActivities
}) {
  const [schemes, setSchemes] = useState([]);
    const [newName, setNewName] = useState("");
const [newState, setNewState] = useState("");
const [newCategory, setNewCategory] = useState("");

async function addScheme() {
  const res = await fetch(
    "http://localhost:3001/api/admin/schemes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: newName,
        state: newState,
        category: newCategory,
        description: "",
        benefit: "",
        eligibility: "",
        deadline: "Ongoing"
      })
    }
  );

  const data = await res.json();

  setSchemes(prev => [...prev, data]);

  setActivities(prev => [
    `🏛️ ${newName} scheme added`,
    ...prev
  ]);

  setNewName("");
  setNewState("");
  setNewCategory("");

  alert("Scheme Added Successfully");
}

async function deleteScheme(id) {
  if (!window.confirm("Delete this scheme?")) return;

  await fetch(
    `http://localhost:3001/api/admin/schemes/${id}`,
    {
      method: "DELETE"
    }
  );

  setSchemes(
    schemes.filter(s => s._id !== id)
  );

  setActivities(prev => [
    "🗑️ Scheme deleted",
    ...prev
  ]);
}

  useEffect(() => {
    fetch("http://localhost:3001/api/schemes?state=andhra%20pradesh")
      .then(res => res.json())
      .then(data => setSchemes(data))
      .catch(console.error);
  }, []);

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 16,
        border: "1px solid #ddd"
      }}
    >
      <h3>🏛️ Government Schemes</h3>
      <div
  style={{
    display:"flex",
    gap:10,
    marginBottom:20
  }}
>

  <input
    placeholder="Scheme Name"
    value={newName}
    onChange={(e)=>setNewName(e.target.value)}
  />

  <input
    placeholder="State"
    value={newState}
    onChange={(e)=>setNewState(e.target.value)}
  />

  <input
    placeholder="Category"
    value={newCategory}
    onChange={(e)=>setNewCategory(e.target.value)}
  />

  <button onClick={addScheme}>
    Add Scheme
  </button>

</div>

<table
  style={{
    width: "100%",
    marginTop: 16,
    borderCollapse: "collapse"
  }}
>
  <thead>
    <tr style={{ background: "#f5f5f5" }}>
      <th style={{ padding: 12, textAlign: "left" }}>Name</th>
      <th style={{ padding: 12, textAlign: "left" }}>Category</th>
      <th style={{ padding: 12, textAlign: "left" }}>Deadline</th>
      <th style={{ padding: 12, textAlign: "center" }}>Action</th>
    </tr>
  </thead>

  <tbody>
    {schemes.map(scheme => (
      <tr
        key={scheme._id}
        style={{
          borderTop: "1px solid #eee"
        }}
      >
        <td style={{ padding: 12 }}>
          {scheme.name}
        </td>

        <td style={{ padding: 12 }}>
          {scheme.category}
        </td>

        <td style={{ padding: 12 }}>
          {scheme.deadline}
        </td>

       

        <td
          style={{
            padding: 12,
            textAlign: "center"
          }}
        >
          <button
            onClick={() => deleteScheme(scheme._id)}
            style={{
              background: "#d32f2f",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
     
    </div>
  );
}
function AdminStats() {
  const [userCount, setUserCount] = useState(0);
  const [marketCount, setMarketCount] = useState(0);
  const [schemeCount, setSchemeCount] = useState(0);

  useEffect(() => {

    fetch("http://localhost:3001/api/admin/users")
      .then(res => res.json())
      .then(data => setUserCount(data.length))
      .catch(console.error);

    fetch("http://localhost:3001/api/market-prices?state=Andhra Pradesh")
      .then(res => res.json())
      .then(data => setMarketCount(data.length))
      .catch(console.error);

    fetch("http://localhost:3001/api/schemes?state=andhra%20pradesh")
      .then(res => res.json())
      .then(data => setSchemeCount(data.length))
      .catch(console.error);

  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 16
      }}
    >
      <div
        style={{
          background:"#e8f5e9",
          padding:20,
          borderRadius:16
        }}
      >
        <h2>👥 {userCount}</h2>
        <p>Total Users</p>
      </div>

      <div
        style={{
          background:"#e3f2fd",
          padding:20,
          borderRadius:16
        }}
      >
        <h2>📈 {marketCount}</h2>
        <p>Market Records</p>
      </div>

      <div
        style={{background:"#fff3e0",padding:20,borderRadius:16
        }}
      >
        <h2>🏛️ {schemeCount}</h2>
        <p>Government Schemes</p>
      </div>
    </div>
  );
}