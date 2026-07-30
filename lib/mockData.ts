export interface DocumentChecklistItem {
  id: string;
  title: string;
  titleBn: string;
  taskLabel: string;
  upvoteCount: number;
}

export interface InstitutionItem {
  id: string;
  name: string;
  nameBn?: string;
  address: string;
  category: string;
  division: string;
  district: string;
  trustScore: number; // Star rating out of 5
  jonomotRating: number; // 0-100 Janamot score formula
  hours: string;
  contact: string;
  imageUrl: string;
  googleMapUrl?: string;
  photos?: string[];
  reportCount: number;
  featured?: boolean;
  aiSummary?: string;
  busyHoursNote?: string;
  documentChecklist?: DocumentChecklistItem[];
}

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  visitDate: string;
  rating: number;
  upvotes: number;
  institutionId: string;
  institutionName: string;
  userName: string;
  userRole: "CITIZEN" | "MODERATOR" | "ADMIN";
  createdAt: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  verified: boolean;
  civicTag: "ঘুষ (Bribe)" | "দালাল (Middleman/Agent)" | "লম্বা লাইন (Long Queue)" | "দুর্ব্যবহার (Rude Behavior)" | "ভালো ব্যবহার (Helpful Staff)";
  hasVideoProof?: boolean;
  photoUrls?: string[];
  videoUrl?: string;
  userId?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameBn: string;
  iconName: string;
  count: number;
}

export const CATEGORIES: CategoryItem[] = [
  { id: "1", name: "Transportation & License", nameBn: "পরিবহন ও লাইসেন্স", iconName: "Car", count: 142 },
  { id: "2", name: "Healthcare & Hospitals", nameBn: "স্বাস্থ্য ও হাসপাতাল", iconName: "Hospital", count: 218 },
  { id: "3", name: "Identity & Passport", nameBn: "পাসপোর্ট ও এনআইডি", iconName: "FileText", count: 98 },
  { id: "4", name: "Municipal & City Services", nameBn: "সিটি কর্পোরেশন সেবা", iconName: "Building2", count: 176 },
  { id: "5", name: "Bhumi & Registration (Land & Revenue)", nameBn: "ভূমি ও রেজিস্ট্রেশন অফিস", iconName: "Landmark", count: 114 },
  { id: "6", name: "Police & Public Safety", nameBn: "পুলিশ ও নাগরিক নিরাপত্তা", iconName: "ShieldAlert", count: 89 },
  { id: "7", name: "Others (অন্যান্য সেবা)", nameBn: "অন্যান্য সেবা (Others)", iconName: "HelpCircle", count: 25 },
];

const RAW_INSTITUTIONS: InstitutionItem[] = [
  {
    "id": "brta-dhaka-metro-circle-1-mirpur",
    "name": "BRTA, Dhaka Metro Circle-1 (Mirpur)",
    "nameBn": "বিআরটিএ, ঢাকা মেট্রো সার্কেল-১ (মিরপুর)",
    "address": "Metro DHA, Dhaka 1216, Bangladesh",
    "category": "Transportation & License",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 3.7,
    "jonomotRating": 73,
    "hours": "Sun-Thu 9:00 AM-3:30 PM, Fri-Sat Closed",
    "contact": "+880 1790-540210",
    "imageUrl": "/prelilogin.png",
    "reportCount": 532,
    "featured": true,
    "aiSummary": "Visitors say the process has become more organized than before and is doable without a middleman if you bring complete documents, though brokers still linger and waits can be long.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "brta-headquarters-banani",
    "name": "BRTA Headquarters (Banani)",
    "nameBn": "বিআরটিএ প্রধান কার্যালয় (বনানী)",
    "address": "BRTA Bhaban, Chairmanbari, Dhaka 1212, Bangladesh",
    "category": "Transportation & License",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4.1,
    "jonomotRating": 80,
    "hours": "Sun-Thu 9:00 AM-5:00 PM, Fri-Sat Closed",
    "contact": "+880 9610-990998",
    "imageUrl": "/prelilogin.png",
    "reportCount": 82,
    "featured": true,
    "aiSummary": "Generally positive reviews describing helpful, professional staff and a well-kept building, though seating space is limited on some floors.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "brta-dhaka-metro-3-uttara",
    "name": "BRTA, Dhaka Metro-3 (Uttara)",
    "nameBn": "বিআরটিএ, ঢাকা মেট্রো-৩ (উত্তরা)",
    "address": "Sonargaon Janapath Rd, Dhaka 1230, Bangladesh",
    "category": "Transportation & License",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 3.7,
    "jonomotRating": 73,
    "hours": "Sun-Thu 9:00 AM-5:00 PM, Fri-Sat Closed",
    "contact": "+880 1705-151188",
    "imageUrl": "/prelilogin.png",
    "reportCount": 190,
    "featured": true,
    "aiSummary": "Mixed reviews: several mention brokers and slow service, but multiple recent visitors say things have improved and self-service without middlemen is possible with preparation.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "brta-dhaka-metro-2-ekuria",
    "name": "BRTA, Dhaka Metro-2 (Ekuria)",
    "nameBn": "বিআরটিএ, ঢাকা মেট্রো-২ (একুরিয়া)",
    "address": "Hasnabad, Dhaka, Bangladesh",
    "category": "Transportation & License",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 3.8,
    "jonomotRating": 75,
    "hours": "Sun-Thu 9:00 AM-5:00 PM, Fri-Sat Closed",
    "contact": "+880 1550-051626",
    "imageUrl": "/prelilogin.png",
    "reportCount": 39,
    "featured": true,
    "aiSummary": "Visitors describe a large, clean, well-organized campus with helpful staff; fitness certification is reported as notably fast.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "brta-segunbagicha",
    "name": "BRTA Segunbagicha",
    "nameBn": "বিআরটিএ সেগুনবাগিচা",
    "address": "PCP5+55C, Dhaka 1205, Bangladesh",
    "category": "Transportation & License",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 3.8,
    "jonomotRating": 75,
    "hours": "Sun-Thu 9:00 AM-5:00 PM, Fri-Sat Closed",
    "contact": "+880 1700-000000",
    "imageUrl": "/prelilogin.png",
    "reportCount": 12,
    "featured": true,
    "aiSummary": "Few reviews; visitors note it's hard to find and recommend booking an appointment ahead of a visit.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "bangladesh-police-headquarters",
    "name": "Bangladesh Police Headquarters",
    "nameBn": "বাংলাদেশ পুলিশ সদর দপ্তর",
    "address": "6 Phoenix Rd, Dhaka 1000, Bangladesh",
    "category": "Police & Public Safety",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4,
    "jonomotRating": 78,
    "hours": "Open 24 hours",
    "contact": "+880 1886-101009",
    "imageUrl": "/prelilogin.png",
    "reportCount": 12,
    "featured": true,
    "aiSummary": "No Google ratings on file for this location yet.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "kotwali-police-station-dmp",
    "name": "Kotwali Police Station, DMP",
    "nameBn": "কোতোয়ালি থানা, ডিএমপি",
    "address": "2no Simson Rd, Dhaka 1100, Bangladesh",
    "category": "Police & Public Safety",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4,
    "jonomotRating": 78,
    "hours": "Open 24 hours",
    "contact": "+880 2-7116255",
    "imageUrl": "/prelilogin.png",
    "reportCount": 12,
    "featured": true,
    "aiSummary": "No Google ratings on file for this location yet.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "pallabi-police-station",
    "name": "Pallabi Police Station",
    "nameBn": "পল্লবী থানা",
    "address": "Shagufta New Rd, Dhaka 1216, Bangladesh",
    "category": "Police & Public Safety",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4,
    "jonomotRating": 78,
    "hours": "Open 24 hours",
    "contact": "+880 1320-041090",
    "imageUrl": "/prelilogin.png",
    "reportCount": 12,
    "featured": true,
    "aiSummary": "No Google ratings on file for this location yet.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "gulshan-police-station",
    "name": "Gulshan Police Station",
    "nameBn": "গুলশান থানা",
    "address": "59, North Gulshan Ave, Dhaka 1212, Bangladesh",
    "category": "Police & Public Safety",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4,
    "jonomotRating": 78,
    "hours": "Open 24 hours",
    "contact": "+880 2-9895826",
    "imageUrl": "/prelilogin.png",
    "reportCount": 12,
    "featured": true,
    "aiSummary": "No Google ratings on file for this location yet.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "uttara-west-police-station",
    "name": "Uttara West Police Station",
    "nameBn": "উত্তরা পশ্চিম থানা",
    "address": "House 88, Road 18, Dhaka 1230, Bangladesh",
    "category": "Police & Public Safety",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4,
    "jonomotRating": 78,
    "hours": "Open 24 hours",
    "contact": "+880 1320-041824",
    "imageUrl": "/prelilogin.png",
    "reportCount": 12,
    "featured": true,
    "aiSummary": "No Google ratings on file for this location yet.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "divisional-passport-and-visa-office-agargaon",
    "name": "Divisional Passport and Visa Office, Agargaon",
    "nameBn": "বিভাগীয় পাসপোর্ট ও ভিসা অফিস, আগারগাঁও",
    "address": "E, 7 Agargaon Sher-E-Bangla Nagar, Dhaka 1207, Bangladesh",
    "category": "Identity & Passport",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 3.6,
    "jonomotRating": 71,
    "hours": "Sun,Mon-Thu 9:00 AM-5:00 PM, Fri-Sat Closed",
    "contact": "+880 1700-000000",
    "imageUrl": "/prelilogin.png",
    "reportCount": 183,
    "featured": true,
    "aiSummary": "Many describe the process as much smoother than in past years with brokers largely gone, but say instructions on which documents need photocopies vs originals are often unclear, causing repeat visits.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "regional-passport-office-dhaka-cantonment",
    "name": "Regional Passport Office, Dhaka Cantonment",
    "nameBn": "আঞ্চলিক পাসপোর্ট অফিস, ঢাকা সেনানিবাস",
    "address": "Road 4, Dhaka Cantonment, Dhaka 1206, Bangladesh",
    "category": "Identity & Passport",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4.3,
    "jonomotRating": 83,
    "hours": "Sun,Mon-Thu 9:00 AM-5:00 PM, Fri-Sat Closed",
    "contact": "+880 1709-989900",
    "imageUrl": "/prelilogin.png",
    "reportCount": 12,
    "featured": true,
    "aiSummary": "Reviewers describe fast, reliable service when documents are complete, with accessible arrangements noted for elderly or disabled applicants.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "regional-passport-office-uttara",
    "name": "Regional Passport Office, Uttara",
    "nameBn": "আঞ্চলিক পাসপোর্ট অফিস, উত্তরা",
    "address": "Plot 5, Road 3/B, Block H, Dhaka 1230, Bangladesh",
    "category": "Identity & Passport",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 3.6,
    "jonomotRating": 71,
    "hours": "Sun,Mon-Thu 9:00 AM-5:00 PM, Fri-Sat Closed",
    "contact": "+880 1700-000000",
    "imageUrl": "/prelilogin.png",
    "reportCount": 80,
    "featured": true,
    "aiSummary": "Visitors mention a token-based queue system and multiple document-verification rooms; several recommend bringing a full photocopy set in advance.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "regional-passport-office-dhaka-east-aftabnagar",
    "name": "Regional Passport Office, Dhaka East (Aftabnagar)",
    "nameBn": "আঞ্চলিক পাসপোর্ট অফিস, ঢাকা পূর্ব (আফতাবনগর)",
    "address": "Jahurul Islam Ave, Dhaka, Bangladesh",
    "category": "Identity & Passport",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 3.5,
    "jonomotRating": 70,
    "hours": "Sun,Mon-Thu 9:00 AM-5:00 PM, Fri-Sat Closed",
    "contact": "+880 1747-176538",
    "imageUrl": "/prelilogin.png",
    "reportCount": 28,
    "featured": true,
    "aiSummary": "Several recent reviewers report a smooth, broker-free experience taking as little as 20-30 minutes; one notes electricity-bill proof of address is strictly checked.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "regional-passport-office-dhaka-west-mohammadpur",
    "name": "Regional Passport Office, Dhaka West (Mohammadpur)",
    "nameBn": "আঞ্চলিক পাসপোর্ট অফিস, ঢাকা পশ্চিম (মোহাম্মদপুর)",
    "address": "Plot 698/4, Road 1, Mohammadpur, Dhaka, Bangladesh",
    "category": "Identity & Passport",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 3.7,
    "jonomotRating": 73,
    "hours": "Sun,Mon-Thu 9:00 AM-4:00 PM, Fri-Sat Closed",
    "contact": "+880 1689-852455",
    "imageUrl": "/prelilogin.png",
    "reportCount": 28,
    "featured": true,
    "aiSummary": "Mixed feedback: some describe multiple redundant verification stops and slow counters, while others report short waits when arriving early with an appointment.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "bangladesh-election-commission-agargaon-hq",
    "name": "Bangladesh Election Commission, Agargaon (HQ)",
    "nameBn": "বাংলাদেশ নির্বাচন কমিশন, আগারগাঁও (প্রধান কার্যালয়)",
    "address": "Nirbachan Bhaban, Agargaon, Dhaka 1207, Bangladesh",
    "category": "Municipal & City Services",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4.2,
    "jonomotRating": 81,
    "hours": "Sun,Mon-Thu 9:00 AM-5:00 PM, Fri-Sat Closed",
    "contact": "+880 2-55007514",
    "imageUrl": "/prelilogin.png",
    "reportCount": 70,
    "featured": true,
    "aiSummary": "Described as a highly secure, professionally run office; can get busy, but staff behavior is generally rated well.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "election-commission-office-of-dhaka-district",
    "name": "Election Commission Office of Dhaka District",
    "nameBn": "নির্বাচন কমিশন কার্যালয়, ঢাকা জেলা",
    "address": "Science Museum to Water Tank Rd, Dhaka, Bangladesh",
    "category": "Municipal & City Services",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4.1,
    "jonomotRating": 80,
    "hours": "Sun,Mon-Thu 9:00 AM-5:00 PM, Fri-Sat Closed",
    "contact": "+880 1646-852926",
    "imageUrl": "/prelilogin.png",
    "reportCount": 14,
    "featured": true,
    "aiSummary": "Reviewers say service has become notably faster with more processes now online.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "election-commission-office-sabujbag",
    "name": "Election Commission Office, Sabujbag",
    "nameBn": "নির্বাচন কমিশন কার্যালয়, সবুজবাগ",
    "address": "Nirbachan Bhaban, Agargaon, Dhaka 1207, Bangladesh",
    "category": "Municipal & City Services",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 3.9,
    "jonomotRating": 76,
    "hours": "Sun,Mon-Thu 9:00 AM-4:00 PM, Fri-Sat Closed",
    "contact": "+880 2-55007514",
    "imageUrl": "/prelilogin.png",
    "reportCount": 12,
    "featured": true,
    "aiSummary": "Sharply mixed: some praise a smooth NID-correction process, others describe rude staff distracted by phones during busy hours.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "dhanmondi-election-office",
    "name": "Dhanmondi Election Office",
    "nameBn": "ধানমন্ডি নির্বাচন অফিস",
    "address": "Green Rd, Dhaka 1205, Bangladesh",
    "category": "Municipal & City Services",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 3.8,
    "jonomotRating": 75,
    "hours": "Sun,Mon-Thu 8:00 AM-3:00 PM, Fri-Sat Closed",
    "contact": "+880 2-9615570",
    "imageUrl": "/prelilogin.png",
    "reportCount": 12,
    "featured": true,
    "aiSummary": "Several call staff behavior unexpectedly good for a government office and describe smart-NID collection as quick, though others report corruption and slow service.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "nid-operation-branch-election-commission",
    "name": "NID Operation Branch, Election Commission",
    "nameBn": "এনআইডি অপারেশন শাখা, নির্বাচন কমিশন",
    "address": "Electoral Training Institute Bhaban, Agargaon, Dhaka, Bangladesh",
    "category": "Municipal & City Services",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4.2,
    "jonomotRating": 81,
    "hours": "Sun,Mon-Thu 9:00 AM-5:00 PM, Fri-Sat Closed",
    "contact": "+880 1700-000000",
    "imageUrl": "/prelilogin.png",
    "reportCount": 12,
    "featured": true,
    "aiSummary": "Reviewers cite quick NID correction and replacement handling, calling it a genuine improvement over past experiences, though one reports a long unresolved wait on a name correction.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "dhaka-medical-college-hospital",
    "name": "Dhaka Medical College Hospital",
    "nameBn": "ঢাকা মেডিকেল কলেজ হাসপাতাল",
    "address": "Secretariat Rd, Dhaka 1000, Bangladesh",
    "category": "Healthcare & Hospitals",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4.3,
    "jonomotRating": 83,
    "hours": "Open 24 hours",
    "contact": "+880 2-55165130",
    "imageUrl": "/prelilogin.png",
    "reportCount": 278,
    "featured": true,
    "aiSummary": "Recognized as Bangladesh's largest public hospital, praised for affordable care, but reviewers consistently describe heavy overcrowding and stretched hygiene standards.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "shaheed-suhrawardy-medical-college-and-hospital",
    "name": "Shaheed Suhrawardy Medical College and Hospital",
    "nameBn": "শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ ও হাসপাতাল",
    "address": "Sher-E-Bangla Nagar, Dhaka 1207, Bangladesh",
    "category": "Healthcare & Hospitals",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4.2,
    "jonomotRating": 81,
    "hours": "Open 24 hours",
    "contact": "+880 1783-906066",
    "imageUrl": "/prelilogin.png",
    "reportCount": 176,
    "featured": true,
    "aiSummary": "Described as an important general hospital with friendly doctors and low treatment costs; toilet/bathroom cleanliness is flagged as a weak point.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "kurmitola-general-hospital",
    "name": "Kurmitola General Hospital",
    "nameBn": "কুর্মিটোলা জেনারেল হাসপাতাল",
    "address": "Tongi Diversion Rd, Dhaka 1206, Bangladesh",
    "category": "Healthcare & Hospitals",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4.3,
    "jonomotRating": 83,
    "hours": "Open 24 hours",
    "contact": "+880 2-55062388",
    "imageUrl": "/prelilogin.png",
    "reportCount": 182,
    "featured": true,
    "aiSummary": "Praised as clean and well-maintained with a park-like setting; the main complaint is long queues at counters and report collection.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "government-employees-hospital-fulbaria",
    "name": "Government Employees Hospital (Fulbaria)",
    "nameBn": "সরকারি কর্মচারী হাসপাতাল (ফুলবাড়িয়া)",
    "address": "College Rd, Dhaka 1000, Bangladesh",
    "category": "Healthcare & Hospitals",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4.3,
    "jonomotRating": 83,
    "hours": "Open 24 hours",
    "contact": "+880 1404-430810",
    "imageUrl": "/prelilogin.png",
    "reportCount": 36,
    "featured": true,
    "aiSummary": "Reviewers call it one of the cleanest government hospitals with a recently renovated building, though department coverage is seen as limited and staff behavior inconsistent.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  },
  {
    "id": "kuwait-bangladesh-friendship-government-hospital",
    "name": "Kuwait Bangladesh Friendship Government Hospital",
    "nameBn": "কুয়েত বাংলাদেশ মৈত্রী সরকারি হাসপাতাল",
    "address": "Isakha Ave, Uttara, Dhaka 1231, Bangladesh",
    "category": "Healthcare & Hospitals",
    "division": "Dhaka",
    "district": "Dhaka",
    "trustScore": 4.1,
    "jonomotRating": 80,
    "hours": "Open 24 hours",
    "contact": "+880 1720-013923",
    "imageUrl": "/prelilogin.png",
    "reportCount": 40,
    "featured": true,
    "aiSummary": "Valued for very low-cost specialist visits and a free pharmacy; one review disputes the advertised 24/7 emergency coverage as unreliable in practice.",
    "busyHoursNote": "Peak waiting times typically between 11:00 AM and 2:00 PM."
  }
];

const CATEGORY_IMAGES: Record<string, { cover: string; gallery: string[] }> = {
  "Transportation & License": {
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Uttara_Uttor_Dhaka_Metro_Rail_Station_platform_3.jpg/960px-Uttara_Uttor_Dhaka_Metro_Rail_Station_platform_3.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Uttara_Uttor_Dhaka_Metro_Rail_Station_platform_3.jpg/960px-Uttara_Uttor_Dhaka_Metro_Rail_Station_platform_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/HSIA_Terminal_3.jpg/960px-HSIA_Terminal_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Dhaka_21st_March_%2825870222381%29.jpg/960px-Dhaka_21st_March_%2825870222381%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Emblem_of_Bangladesh_Road_Transport_Authority_%28BRTA%29.svg/960px-Emblem_of_Bangladesh_Road_Transport_Authority_%28BRTA%29.svg.png",
    ],
  },
  "Healthcare & Hospitals": {
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/%E0%A6%95%E0%A7%81%E0%A6%AE%E0%A6%BF%E0%A6%9F%E0%A7%8B%E0%A6%B2%E0%A6%BE_%E0%A6%9C%E0%A7%87%E0%A6%A8%E0%A6%BE%E0%A6%B0%E0%A7%87%E0%A6%B2_%E0%A6%B9%E0%A6%BE%E0%A6%B8%E0%A6%AA%E0%A6%BE%E0%A6%A4%E0%A6%BE%E0%A6%B2_%E0%A7%A8.jpg/960px-%E0%A6%95%E0%A7%81%E0%A6%AE%E0%A6%BF%E0%A6%9F%E0%A7%8B%E0%A6%B2%E0%A6%BE_%E0%A6%9C%E0%A7%87%E0%A6%A8%E0%A6%BE%E0%A6%B0%E0%A7%87%E0%A6%B2_%E0%A6%B9%E0%A6%BE%E0%A6%B8%E0%A6%AA%E0%A6%BE%E0%A6%A4%E0%A6%BE%E0%A6%B2_%E0%A7%A8.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/%E0%A6%95%E0%A7%81%E0%A6%AE%E0%A6%BF%E0%A6%9F%E0%A7%8B%E0%A6%B2%E0%A6%BE_%E0%A6%9C%E0%A7%87%E0%A6%A8%E0%A6%BE%E0%A6%B0%E0%A7%87%E0%A6%B2_%E0%A6%B9%E0%A6%BE%E0%A6%B8%E0%A6%AA%E0%A6%BE%E0%A6%A4%E0%A6%BE%E0%A6%B2_%E0%A7%A8.jpg/960px-%E0%A6%95%E0%A7%81%E0%A6%AE%E0%A6%BF%E0%A6%9F%E0%A7%8B%E0%A6%B2%E0%A6%BE_%E0%A6%9C%E0%A7%87%E0%A6%A8%E0%A6%BE%E0%A6%B0%E0%A7%87%E0%A6%B2_%E0%A6%B9%E0%A6%BE%E0%A6%B8%E0%A6%AA%E0%A6%BE%E0%A6%A4%E0%A6%BE%E0%A6%B2_%E0%A7%A8.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tejgaon_Commercial_Area.jpg/960px-Tejgaon_Commercial_Area.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Curjon_Hall.jpg/960px-Curjon_Hall.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/960px-Government_Seal_of_Bangladesh.svg.png",
    ],
  },
  "Identity & Passport": {
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tejgaon_Commercial_Area.jpg/960px-Tejgaon_Commercial_Area.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tejgaon_Commercial_Area.jpg/960px-Tejgaon_Commercial_Area.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bangladesh_National_Museum_southern_side_%2801%29.jpg/960px-Bangladesh_National_Museum_southern_side_%2801%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/960px-Government_Seal_of_Bangladesh.svg.png",
    ],
  },
  "Municipal & City Services": {
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/DG_81_-_09_NAGAR_BHABAN_ANCIENT_DHAKA_IMG_1660.jpg/960px-DG_81_-_09_NAGAR_BHABAN_ANCIENT_DHAKA_IMG_1660.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/DG_81_-_09_NAGAR_BHABAN_ANCIENT_DHAKA_IMG_1660.jpg/960px-DG_81_-_09_NAGAR_BHABAN_ANCIENT_DHAKA_IMG_1660.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/National_Assembly_of_Bangladesh_%2810%29.jpg/960px-National_Assembly_of_Bangladesh_%2810%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ahsan_Manzil-Front_View.jpg/960px-Ahsan_Manzil-Front_View.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/960px-Government_Seal_of_Bangladesh.svg.png",
    ],
  },
  "Police & Public Safety": {
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/National_Assembly_of_Bangladesh_%2810%29.jpg/960px-National_Assembly_of_Bangladesh_%2810%29.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/National_Assembly_of_Bangladesh_%2810%29.jpg/960px-National_Assembly_of_Bangladesh_%2810%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bangladesh_Police_Insignia_Patch.svg/960px-Bangladesh_Police_Insignia_Patch.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tejgaon_Commercial_Area.jpg/960px-Tejgaon_Commercial_Area.jpg",
    ],
  },
  "Land & Revenue (AC Land)": {
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/%E0%A6%B2%E0%A6%BE%E0%A6%B2_%E0%A6%95%E0%A7%87%E0%A6%B2%E0%A7%8D%E0%A6%B2%E0%A6%BE%E0%A6%B0_%E0%A6%AE%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A6%BE.jpg/960px-%E0%A6%B2%E0%A6%BE%E0%A6%B2_%E0%A6%95%E0%A7%87%E0%A6%B2%E0%A7%8D%E0%A6%B2%E0%A6%BE%E0%A6%B0_%E0%A6%AE%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A6%BE.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/%E0%A6%B2%E0%A6%BE%E0%A6%B2_%E0%A6%95%E0%A7%87%E0%A6%B2%E0%A7%8D%E0%A6%B2%E0%A6%BE%E0%A6%B0_%E0%A6%AE%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A6%BE.jpg/960px-%E0%A6%B2%E0%A6%BE%E0%A6%B2_%E0%A6%95%E0%A7%87%E0%A6%B2%E0%A7%8D%E0%A6%B2%E0%A6%BE%E0%A6%B0_%E0%A6%AE%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A6%BE.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/960px-Government_Seal_of_Bangladesh.svg.png",
    ],
  },
};

// Map each institution to its authentic listed photo
const INST_SPECIFIC_PHOTOS: Record<string, { cover: string; gallery: string[] }> = {
  "brta-dhaka-metro-circle-1-mirpur": {
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Uttara_Uttor_Dhaka_Metro_Rail_Station_platform_3.jpg/960px-Uttara_Uttor_Dhaka_Metro_Rail_Station_platform_3.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Uttara_Uttor_Dhaka_Metro_Rail_Station_platform_3.jpg/960px-Uttara_Uttor_Dhaka_Metro_Rail_Station_platform_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Emblem_of_Bangladesh_Road_Transport_Authority_%28BRTA%29.svg/960px-Emblem_of_Bangladesh_Road_Transport_Authority_%28BRTA%29.svg.png",
    ],
  },
  "agargaon-passport": {
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tejgaon_Commercial_Area.jpg/960px-Tejgaon_Commercial_Area.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tejgaon_Commercial_Area.jpg/960px-Tejgaon_Commercial_Area.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/960px-Government_Seal_of_Bangladesh.svg.png",
    ],
  },
  "dhaka-medical-college-hospital": {
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/%E0%A6%95%E0%A7%81%E0%A6%AE%E0%A6%BF%E0%A6%9F%E0%A7%8B%E0%A6%B2%E0%A6%BE_%E0%A6%9C%E0%A7%87%E0%A6%A8%E0%A6%BE%E0%A6%B0%E0%A7%87%E0%A6%B2_%E0%A6%B9%E0%A6%BE%E0%A6%B8%E0%A6%AA%E0%A6%BE%E0%A6%A4%E0%A6%BE%E0%A6%B2_%E0%A7%A8.jpg/960px-%E0%A6%95%E0%A7%81%E0%A6%AE%E0%A6%BF%E0%A6%9F%E0%A7%8B%E0%A6%B2%E0%A6%BE_%E0%A6%9C%E0%A7%87%E0%A6%A8%E0%A6%BE%E0%A6%B0%E0%A7%87%E0%A6%B2_%E0%A6%B9%E0%A6%BE%E0%A6%B8%E0%A6%AA%E0%A6%BE%E0%A6%A4%E0%A6%BE%E0%A6%B2_%E0%A7%A8.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/%E0%A6%95%E0%A7%81%E0%A6%AE%E0%A6%BF%E0%A6%9F%E0%A7%8B%E0%A6%B2%E0%A6%BE_%E0%A6%9C%E0%A7%87%E0%A6%A8%E0%A6%BE%E0%A6%B0%E0%A7%87%E0%A6%B2_%E0%A6%B9%E0%A6%BE%E0%A6%B8%E0%A6%AA%E0%A6%BE%E0%A6%A4%E0%A6%BE%E0%A6%B2_%E0%A7%A8.jpg/960px-%E0%A6%95%E0%A7%81%E0%A6%AE%E0%A6%BF%E0%A6%9F%E0%A7%8B%E0%A6%B2%E0%A6%BE_%E0%A6%9C%E0%A7%87%E0%A6%A8%E0%A6%BE%E0%A6%B0%E0%A7%87%E0%A6%B2_%E0%A6%B9%E0%A6%BE%E0%A6%B8%E0%A6%AA%E0%A6%BE%E0%A6%A4%E0%A6%BE%E0%A6%B2_%E0%A7%A8.jpg",
    ],
  },
  "dncc-zone-5": {
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/DG_81_-_09_NAGAR_BHABAN_ANCIENT_DHAKA_IMG_1660.jpg/960px-DG_81_-_09_NAGAR_BHABAN_ANCIENT_DHAKA_IMG_1660.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/DG_81_-_09_NAGAR_BHABAN_ANCIENT_DHAKA_IMG_1660.jpg/960px-DG_81_-_09_NAGAR_BHABAN_ANCIENT_DHAKA_IMG_1660.jpg",
    ],
  },
  "police-headquarters-dhaka": {
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/National_Assembly_of_Bangladesh_%2810%29.jpg/960px-National_Assembly_of_Bangladesh_%2810%29.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/National_Assembly_of_Bangladesh_%2810%29.jpg/960px-National_Assembly_of_Bangladesh_%2810%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bangladesh_Police_Insignia_Patch.svg/960px-Bangladesh_Police_Insignia_Patch.svg.png",
    ],
  },
};

export const INSTITUTIONS: InstitutionItem[] = RAW_INSTITUTIONS.map((inst) => {
  const specific = INST_SPECIFIC_PHOTOS[inst.id];
  const catImg = specific || CATEGORY_IMAGES[inst.category] || CATEGORY_IMAGES["Municipal & City Services"];
  const googleMapUrl =
    inst.googleMapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      inst.name + " " + inst.address
    )}`;

  // General standard way: fetch image related to that Google Maps link
  const standardGoogleMapImage = `/api/google-map-image?url=${encodeURIComponent(
    googleMapUrl
  )}&query=${encodeURIComponent(inst.name)}`;

  return {
    ...inst,
    imageUrl: standardGoogleMapImage,
    photos: [standardGoogleMapImage, ...(catImg.gallery || [])],
    googleMapUrl,
  };
});

export function getGoogleMapUrl(institution: InstitutionItem): string {
  return (
    institution.googleMapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      institution.name + " " + institution.address
    )}`
  );
}

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: "rep-101",
    title: "Smooth Driving License Biometric Verification",
    description: "Visited the BRTA Mirpur circle for biometric verification. The token system was well organized and the officer at booth #4 was very cooperative. Finished within 45 minutes without any agent involvement.",
    visitDate: "2026-07-27",
    rating: 5,
    upvotes: 38,
    institutionId: "brta-mirpur-1",
    institutionName: "BRTA Mirpur Circle-1 Office",
    userName: "Tanvir Rahman",
    userRole: "CITIZEN",
    createdAt: "2 days ago",
    status: "APPROVED",
    verified: true,
    civicTag: "ভালো ব্যবহার (Helpful Staff)",
  },
  {
    id: "rep-102",
    title: "Emergency triage was prompt and attentive",
    description: "Brought my elderly father in during peak evening hours. Despite high crowd density, duty doctors conducted immediate triage and provided diagnostic guidance.",
    visitDate: "2026-07-26",
    rating: 5,
    upvotes: 62,
    institutionId: "dmch-dhaka",
    institutionName: "Dhaka Medical College Hospital (DMCH)",
    userName: "Nusrat Jahan",
    userRole: "CITIZEN",
    createdAt: "3 days ago",
    status: "APPROVED",
    verified: true,
    civicTag: "ভালো ব্যবহার (Helpful Staff)",
  },
  {
    id: "rep-103",
    title: "E-Passport biometric capture line wait time improvement needed",
    description: "The digital appointment check-in worked well, but the physical queue for fingerprint and iris scanning took over 2 hours due to 2 out of 5 counters being closed.",
    visitDate: "2026-07-25",
    rating: 3,
    upvotes: 41,
    institutionId: "agargaon-passport",
    institutionName: "Agargaon Regional Passport Office",
    userName: "Shakil Ahmed",
    userRole: "MODERATOR",
    createdAt: "4 days ago",
    status: "APPROVED",
    verified: true,
    civicTag: "লম্বা লাইন (Long Queue)",
  },
  {
    id: "rep-104",
    title: "Trade license renewal desk transparent fee posting",
    description: "The DNCC Zone 5 helpdesk assisted with verifying our commercial property holding tax document. Friendly staff and transparent fee structure posted on the bulletin board.",
    visitDate: "2026-07-24",
    rating: 4,
    upvotes: 19,
    institutionId: "dncc-zone-5",
    institutionName: "Dhaka North City Corporation (DNCC) Zone-5",
    userName: "Farhana Akter",
    userRole: "CITIZEN",
    createdAt: "5 days ago",
    status: "APPROVED",
    verified: false,
    civicTag: "ভালো ব্যবহার (Helpful Staff)",
  },
  {
    id: "rep-105",
    title: "Unverified agent approached near exterior gate",
    description: "While waiting for the passport document counter to open, an unofficial agent offered to bypass the line for 1500 BDT. I declined and reported it to the security desk.",
    visitDate: "2026-07-23",
    rating: 2,
    upvotes: 54,
    institutionId: "agargaon-passport",
    institutionName: "Agargaon Regional Passport Office",
    userName: "Imran Hossain",
    userRole: "CITIZEN",
    createdAt: "6 days ago",
    status: "APPROVED",
    verified: true,
    civicTag: "দালাল (Middleman/Agent)",
    hasVideoProof: true,
  },
];
