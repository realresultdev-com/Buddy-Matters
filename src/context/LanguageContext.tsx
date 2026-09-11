import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ta";

export const translations = {
  en: {
    // Navigation
    searchPlaceholder: "Search mattresses, orthopedic pillows, bedding...",
    allDepartments: "All Departments",
    todaysDeals: "Today's Deals",
    freeDeliveryBadge: "100-Night Trial & Free Delivery",
    adminPanel: "Admin Panel",
    sellerCentral: "Seller Central Management",
    signIn: "Sign In",
    signOut: "Sign Out",
    cart: "Cart",
    returns: "Returns",
    orders: "& Orders",
    returnsAndOrders: "Returns & Orders",
    yourOrders: "Your Orders",
    yourOrdersTracking: "Your Orders & Tracking",
    yourAccount: "Your Account",
    yourProfile: "Your Profile & Settings",
    savedAddresses: "Saved Addresses",
    storeAdmin: "Store Administrator",
    clubMember: "Buddy Sleep Club Member",
    newToBuddy: "New to Buddy Mattress?",
    startHere: "Start here.",
    deliverTo: "Deliver to",
    india: "India",
    exploreAll: "Explore All Mattresses & Pillows",
    shoppingCart: "Shopping Cart",
    adminDashboard: "Admin Dashboard",
    selectLanguage: "Select Language",
    english: "English",
    tamil: "தமிழ்",
    hello: "Hello",

    // Hero Banner
    heroBadge: "100-NIGHT FREE HOME TRIAL",
    heroTitle: "Wake Up Energized. Sleep on Pure Luxury.",
    heroSubtitle: "India's premier orthopedic memory foam mattresses, cooling gel pillows & breathable protectors.",
    shopMattresses: "Shop All Mattresses",
    warrantyButton: "10-Year Comprehensive Warranty",

    // Sleep Club Card
    joinClubTitle: "Join the Buddy Sleep Club",
    joinClubDesc: "Unlock exclusive member pricing, 100-night trial benefits, and free doorstep delivery across India.",
    signInClubBtn: "Sign In to Buddy Mattress",
    benefitTrial: "100-Night Risk-Free Home Trial",
    benefitWarranty: "10-Year Comprehensive Warranty",
    benefitDelivery: "Free Delivery & Professional Unboxing",

    // Departments / Taxonomy
    departments: "Departments:",
    noProductsFound: "No products found in this department.",
    noProductsSub: "Check back soon or explore our other collections.",
    featuredCollectionTitle: "Featured Sleep & Comfort Collection",
    featuredCollectionDesc: "Engineered with high-density orthopedic zones, breathable memory foam, and zero-partner-disturbance technology.",

    // Product Card
    bestSeller: "Best Seller",
    buddyPick: "Buddy Pick",
    reviews: "reviews",
    limitedDeal: "Limited Deal",
    off: "OFF",
    freeDoorstepDelivery: "Free Doorstep Delivery",
    trialAndWarranty: "100-Night Trial • 10-Yr Warranty",
    addToCart: "Add to Cart",
    addedToCart: "Added to Cart",
    currentlyUnavailable: "Currently Unavailable",

    // Product Details & Buy Box
    officialStore: "Official Buddy Mattress Store",
    buddysChoice: "Buddy's Choice",
    answeredQuestions: "answered questions",
    aboutThisItem: "About this item",
    inStock: "In stock",
    onlyLeft: "Only {n} left",
    shipsFrom: "Ships from",
    soldBy: "Sold by",
    trialPeriod: "Trial Period",
    trial100Nights: "100 Nights Free",
    quantity: "Quantity:",
    buyNow: "Buy Now",
    secureCheckout: "100% Secure 256-bit Encrypted Checkout",
    buddyPrimeFree: "✓ Buddy Prime FREE delivery within 2-4 days",
    deliverToLocation: "Deliver to Bengaluru 560001",

    // Trust Guarantees
    guaranteeReplacement: "7 Days Replacement",
    guaranteeDelivery: "Free Delivery",
    guaranteeWarranty: "10-Year Warranty",
    guaranteeTopBrand: "Top Brand",

    // Footer
    backToTop: "Back to top",
    getToKnowUs: "Get to Know Us",
    aboutBuddy: "About Buddy Mattress",
    careers: "Careers",
    pressReleases: "Press Releases",
    buddyCares: "Buddy Cares",
    connectWithUs: "Connect with Us",
    facebook: "Facebook",
    twitter: "Twitter / X",
    instagram: "Instagram",
    makeMoney: "Make Money with Us",
    sellOnBuddy: "Sell on Buddy Mattress",
    becomeAffiliate: "Become an Affiliate",
    fulfillmentByBuddy: "Fulfillment by Buddy",
    advertiseProducts: "Advertise Your Products",
    letUsHelp: "Let Us Help You",
    yourAccountFooter: "Your Account",
    returnsCentre: "Returns & Replacement Centre",
    warrantyAssistance: "10-Year Warranty Help",
    helpCentre: "Help Centre & Contact",
    allRightsReserved: "Buddy Mattress India Pvt. Ltd. All rights reserved.",
  },
  ta: {
    // Navigation
    searchPlaceholder: "மெத்தைகள், தலையணைகள், படுக்கை விரிப்புகள் தேடுக...",
    allDepartments: "அனைத்து பிரிவுகள்",
    todaysDeals: "இன்றைய சலுகைகள்",
    freeDeliveryBadge: "100-இரவு சோதனை & இலவச டெலிவரி",
    adminPanel: "நிர்வாகக் குழு",
    sellerCentral: "விற்பனையாளர் மேலாண்மை",
    signIn: "உள்நுழைக",
    signOut: "வெளியேறு",
    cart: "கூடை",
    returns: "திரும்பப் பெறல்",
    orders: "& ஆர்டர்கள்",
    returnsAndOrders: "ஆர்டர்கள் & திரும்பப் பெறல்",
    yourOrders: "உங்கள் ஆர்டர்கள்",
    yourOrdersTracking: "உங்கள் ஆர்டர்கள் & கண்காணிப்பு",
    yourAccount: "உங்கள் கணக்கு",
    yourProfile: "சுயவிவரம் மற்றும் அமைப்புகள்",
    savedAddresses: "சேமிக்கப்பட்ட முகவரிகள்",
    storeAdmin: "ஸ்டோர் நிர்வாகி",
    clubMember: "Buddy ஸ்லீப் கிளப் உறுப்பினர்",
    newToBuddy: "Buddy Mattress-க்கு புதியவரா?",
    startHere: "இங்கே தொடங்கவும்.",
    deliverTo: "டெலிவரி இடம்",
    india: "இந்தியா",
    exploreAll: "அனைத்து மெத்தைகள் & தலையணைகள்",
    shoppingCart: "ஷாப்பிங் கூடை",
    adminDashboard: "நிர்வாக பலகை",
    selectLanguage: "மொழியைத் தேர்வு செய்க",
    english: "English",
    tamil: "தமிழ்",
    hello: "வணக்கம்",

    // Hero Banner
    heroBadge: "100-இரவு இலவச வீட்டு சோதனை",
    heroTitle: "புத்துணர்ச்சியுடன் விழித்தெழுங்கள். தூய சொகுசில் உறங்குங்கள்.",
    heroSubtitle: "இந்தியாவின் முன்னணி எலும்பியல் மெமரி ஃபோம் மெத்தைகள், குளிர்ச்சியூட்டும் ஜெல் தலையணைகள் & பாதுகாப்பிகள்.",
    shopMattresses: "அனைத்து மெத்தைகளையும் காண்க",
    warrantyButton: "10-ஆண்டு முழுமையான உத்தரவாதம்",

    // Sleep Club Card
    joinClubTitle: "Buddy ஸ்லீப் கிளப்பில் சேருங்கள்",
    joinClubDesc: "பிரத்யேக உறுப்பினர் விலை, 100-இரவு சோதனை நன்மைகள் மற்றும் இந்தியா முழுவதும் இலவச வீட்டு டெலிவரி பெறுங்கள்.",
    signInClubBtn: "Buddy Mattress-ல் உள்நுழைக",
    benefitTrial: "100-இரவு ஆபத்தில்லாத வீட்டு சோதனை",
    benefitWarranty: "10-ஆண்டு விரிவான உத்தரவாதம்",
    benefitDelivery: "இலவச டெலிவரி & தொழில்முறை அன்பாக்சிங்",

    // Departments / Taxonomy
    departments: "பிரிவுகள்:",
    noProductsFound: "இப்பிரிவில் பொருட்கள் எதுவும் காணப்படவில்லை.",
    noProductsSub: "விரைவில் மீண்டும் பார்க்கவும் அல்லது பிற பிரிவுகளை ஆராயவும்.",
    featuredCollectionTitle: "சிறப்பு தூக்க & வசதி தொகுப்பு",
    featuredCollectionDesc: "உயர்தர எலும்பியல் ஆதரவு, சுவாசிக்கும் மெமரி ஃபோம் மற்றும் பார்ட்னர் தொந்தரவு இல்லாத தொழில்நுட்பத்துடன் உருவாக்கப்பட்டது.",

    // Product Card
    bestSeller: "அதிக விற்பனை",
    buddyPick: "Buddy தேர்வு",
    reviews: "மதிப்புரைகள்",
    limitedDeal: "சிறப்பு சலுகை",
    off: "தள்ளுபடி",
    freeDoorstepDelivery: "இலவச வீட்டு டெலிவரி",
    trialAndWarranty: "100-இரவு சோதனை • 10-ஆண்டு உத்தரவாதம்",
    addToCart: "கூடையில் சேர்க்க",
    addedToCart: "கூடையில் சேர்க்கப்பட்டது",
    currentlyUnavailable: "தற்போது கிடைக்கவில்லை",

    // Product Details & Buy Box
    officialStore: "அதிகாரப்பூர்வ Buddy Mattress ஸ்டோர்",
    buddysChoice: "Buddy-ன் தேர்வு",
    answeredQuestions: "பதிலளிக்கப்பட்ட கேள்விகள்",
    aboutThisItem: "இந்த பொருளைப் பற்றி",
    inStock: "கையிருப்பில் உள்ளது",
    onlyLeft: "{n} மட்டுமே உள்ளன",
    shipsFrom: "அனுப்புபவர்",
    soldBy: "விற்பனையாளர்",
    trialPeriod: "சோதனை காலம்",
    trial100Nights: "100 இரவுகள் இலவசம்",
    quantity: "அளவு:",
    buyNow: "இப்போதே வாங்குக",
    secureCheckout: "100% பாதுகாப்பான 256-பிட் என்க்ரிப்ட் செய்யப்பட்ட கட்டணம்",
    buddyPrimeFree: "✓ Buddy Prime இலவச டெலிவரி 2-4 நாட்களில்",
    deliverToLocation: "பெங்களூரு 560001-க்கு டெலிவரி",

    // Trust Guarantees
    guaranteeReplacement: "7 நாட்கள் மாற்று வசதி",
    guaranteeDelivery: "இலவச டெலிவரி",
    guaranteeWarranty: "10-ஆண்டு உத்தரவாதம்",
    guaranteeTopBrand: "முன்னணி பிராண்ட்",

    // Footer
    backToTop: "மேலே செல்க",
    getToKnowUs: "எங்களைப் பற்றி",
    aboutBuddy: "Buddy Mattress பற்றி",
    careers: "வேலைவாய்ப்புகள்",
    pressReleases: "செய்தி வெளியீடுகள்",
    buddyCares: "Buddy சமுதாயப் பணி",
    connectWithUs: "எங்களுடன் இணையுங்கள்",
    facebook: "பேஸ்புக்",
    twitter: "ட்விட்டர் / X",
    instagram: "இன்ஸ்டாகிராம்",
    makeMoney: "எங்களுடன் பணம் ஈட்டுங்கள்",
    sellOnBuddy: "Buddy-ல் விற்பனை செய்ய",
    becomeAffiliate: "இணைப்பு பங்குதாரராக",
    fulfillmentByBuddy: "Buddy மூலம் பூர்த்தி செய்தல்",
    advertiseProducts: "உங்கள் தயாரிப்புகளை விளம்பரப்படுத்துங்கள்",
    letUsHelp: "உங்களுக்கு உதவ நாங்கள் தயார்",
    yourAccountFooter: "உங்கள் கணக்கு",
    returnsCentre: "திரும்பப் பெறல் மையம்",
    warrantyAssistance: "10-ஆண்டு உத்தரவாத உதவி",
    helpCentre: "உதவி மையம் & தொடர்பு",
    allRightsReserved: "Buddy Mattress India Pvt. Ltd. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
  },
};

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("preferred_language");
    return saved === "ta" ? "ta" : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_language", lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === "ta") {
      document.documentElement.classList.add("font-tamil");
    } else {
      document.documentElement.classList.remove("font-tamil");
    }
  }, [language]);

  const t = (key: TranslationKey, params?: Record<string, any>): string => {
    let str = translations[language][key] || translations.en[key] || (key as string);
    if (params) {
      Object.keys(params).forEach((k) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(params[k]));
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
