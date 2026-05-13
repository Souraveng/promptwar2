export interface StateData {
  name: string;
  govt: string;
  cm: string;
  totalSeats: number; // Lok Sabha
  assemblySeats: number; // Vidhan Sabha
  constituencies: string[];
}

export const allStatesData: StateData[] = [
  { name: "Andaman and Nicobar Islands", govt: "President's Rule", cm: "N/A", totalSeats: 1, assemblySeats: 0, constituencies: ["Andaman and Nicobar Islands"] },
  { name: "Andhra Pradesh", govt: "TDP-BJP-JSP", cm: "N. Chandrababu Naidu", totalSeats: 25, assemblySeats: 175, constituencies: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kadapa"] },
  { name: "Arunachal Pradesh", govt: "BJP", cm: "Pema Khandu", totalSeats: 2, assemblySeats: 60, constituencies: ["Arunachal West", "Arunachal East"] },
  { name: "Assam", govt: "BJP", cm: "Himanta Biswa Sarma", totalSeats: 14, assemblySeats: 126, constituencies: ["Guwahati", "Dibrugarh", "Silchar", "Tezpur"] },
  { name: "Bihar", govt: "BJP-JD(U)", cm: "Samrat Choudhary", totalSeats: 40, assemblySeats: 243, constituencies: ["Patna Sahib", "Gaya", "Bhagalpur", "Muzaffarpur", "Begusarai"] },
  { name: "Chandigarh", govt: "President's Rule", cm: "N/A", totalSeats: 1, assemblySeats: 0, constituencies: ["Chandigarh"] },
  { name: "Chhattisgarh", govt: "BJP", cm: "Vishnu Deo Sai", totalSeats: 11, assemblySeats: 90, constituencies: ["Raipur", "Bastar", "Durg", "Bilaspur"] },
  { name: "Dadra and Nagar Haveli and Daman and Diu", govt: "President's Rule", cm: "N/A", totalSeats: 2, assemblySeats: 0, constituencies: ["Dadra and Nagar Haveli", "Daman and Diu"] },
  { name: "Delhi", govt: "BJP", cm: "Rekha Gupta", totalSeats: 7, assemblySeats: 70, constituencies: ["Chandni Chowk", "East Delhi", "New Delhi", "South Delhi", "West Delhi", "North East Delhi", "North West Delhi"] },
  { name: "Goa", govt: "BJP", cm: "Pramod Sawant", totalSeats: 2, assemblySeats: 40, constituencies: ["North Goa", "South Goa"] },
  { name: "Gujarat", govt: "BJP", cm: "Bhupendrabhai Patel", totalSeats: 26, assemblySeats: 182, constituencies: ["Ahmedabad West", "Ahmedabad East", "Gandhinagar", "Surat", "Rajkot", "Vadodara"] },
  { name: "Haryana", govt: "BJP", cm: "Nayab Singh Saini", totalSeats: 10, assemblySeats: 90, constituencies: ["Gurgaon", "Faridabad", "Karnal", "Ambala"] },
  { name: "Himachal Pradesh", govt: "INC", cm: "Sukhvinder Singh Sukhu", totalSeats: 4, assemblySeats: 68, constituencies: ["Shimla", "Mandi", "Hamirpur", "Kangra"] },
  { name: "Jammu and Kashmir", govt: "JKNC-INC", cm: "Omar Abdullah", totalSeats: 5, assemblySeats: 90, constituencies: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"] },
  { name: "Jharkhand", govt: "JMM-INC", cm: "Hemant Soren", totalSeats: 14, assemblySeats: 81, constituencies: ["Ranchi", "Jamshedpur", "Dhanbad", "Dumka"] },
  { name: "Karnataka", govt: "INC", cm: "Siddaramaiah", totalSeats: 28, assemblySeats: 224, constituencies: ["Bangalore North", "Bangalore South", "Bangalore Central", "Mysore", "Hubli-Dharwad"] },
  { name: "Kerala", govt: "CPI(M)", cm: "Pinarayi Vijayan", totalSeats: 20, assemblySeats: 140, constituencies: ["Thiruvananthapuram", "Wayanad", "Kozhikode", "Ernakulam", "Thrissur"] },
  { name: "Ladakh", govt: "President's Rule", cm: "N/A", totalSeats: 1, assemblySeats: 0, constituencies: ["Ladakh"] },
  { name: "Lakshadweep", govt: "President's Rule", cm: "N/A", totalSeats: 1, assemblySeats: 0, constituencies: ["Lakshadweep"] },
  { name: "Madhya Pradesh", govt: "BJP", cm: "Mohan Yadav", totalSeats: 29, assemblySeats: 230, constituencies: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Chhindwara"] },
  { name: "Maharashtra", govt: "BJP-SHS-NCP (Mahayuti)", cm: "Devendra Fadnavis", totalSeats: 48, assemblySeats: 288, constituencies: ["Mumbai North", "Mumbai South", "Pune", "Nagpur", "Nashik", "Baramati"] },
  { name: "Manipur", govt: "President's Rule", cm: "N/A", totalSeats: 2, assemblySeats: 60, constituencies: ["Inner Manipur", "Outer Manipur"] },
  { name: "Meghalaya", govt: "NPP", cm: "Conrad Sangma", totalSeats: 2, assemblySeats: 60, constituencies: ["Shillong", "Tura"] },
  { name: "Mizoram", govt: "ZPM", cm: "Lalduhoma", totalSeats: 1, assemblySeats: 40, constituencies: ["Mizoram"] },
  { name: "Nagaland", govt: "NDPP-BJP", cm: "Neiphiu Rio", totalSeats: 1, assemblySeats: 60, constituencies: ["Nagaland"] },
  { name: "Odisha", govt: "BJP", cm: "Mohan Charan Majhi", totalSeats: 21, assemblySeats: 147, constituencies: ["Bhubaneswar", "Puri", "Cuttack", "Sambalpur"] },
  { name: "Puducherry", govt: "AINRC-BJP", cm: "N. Rangaswamy", totalSeats: 1, assemblySeats: 30, constituencies: ["Puducherry"] },
  { name: "Punjab", govt: "AAP", cm: "Bhagwant Mann", totalSeats: 13, assemblySeats: 117, constituencies: ["Amritsar", "Ludhiana", "Patiala", "Jalandhar"] },
  { name: "Rajasthan", govt: "BJP", cm: "Bhajan Lal Sharma", totalSeats: 25, assemblySeats: 200, constituencies: ["Jaipur", "Jodhpur", "Udaipur", "Bikaner", "Ajmer"] },
  { name: "Sikkim", govt: "SKM", cm: "Prem Singh Tamang", totalSeats: 1, assemblySeats: 32, constituencies: ["Sikkim"] },
  { name: "Tamil Nadu", govt: "DMK", cm: "M.K. Stalin", totalSeats: 39, assemblySeats: 234, constituencies: ["Chennai North", "Chennai South", "Coimbatore", "Madurai", "Thoothukudi"] },
  { name: "Telangana", govt: "INC", cm: "A. Revanth Reddy", totalSeats: 17, assemblySeats: 119, constituencies: ["Hyderabad", "Secunderabad", "Warangal", "Nizamabad"] },
  { name: "Tripura", govt: "BJP", cm: "Manik Saha", totalSeats: 2, assemblySeats: 60, constituencies: ["Tripura West", "Tripura East"] },
  { name: "Uttar Pradesh", govt: "BJP", cm: "Yogi Adityanath", totalSeats: 80, assemblySeats: 403, constituencies: ["Lucknow", "Varanasi", "Amethi", "Rae Bareli", "Gorakhpur", "Mathura", "Kanpur"] },
  { name: "Uttarakhand", govt: "BJP", cm: "Pushkar Singh Dhami", totalSeats: 5, assemblySeats: 70, constituencies: ["Haridwar", "Nainital", "Almora", "Tehri Garhwal", "Pauri Garhwal"] },
  { name: "West Bengal", govt: "AITC", cm: "Mamata Banerjee", totalSeats: 42, assemblySeats: 294, constituencies: ["Kolkata South", "Kolkata North", "Asansol", "Darjeeling", "Diamond Harbour"] }
];
