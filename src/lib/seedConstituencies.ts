import { db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const constituencies = [
  {
    name: "New Delhi",
    state: "Delhi",
    code: "ND",
    pinCodes: ["110001", "110003", "110011", "110021"],
    affidavitUrl: "https://affidavit.eci.gov.in/show-profile/ND",
    votingDate: "2024-05-25T07:00:00Z"
  },
  {
    name: "Mumbai South",
    state: "Maharashtra",
    code: "MS",
    pinCodes: ["400001", "400002", "400003", "400004", "400005"],
    affidavitUrl: "https://affidavit.eci.gov.in/show-profile/MS",
    votingDate: "2024-05-20T07:00:00Z"
  },
  {
    name: "Bangalore Central",
    state: "Karnataka",
    code: "BC",
    pinCodes: ["560001", "560002", "560025", "560027"],
    affidavitUrl: "https://affidavit.eci.gov.in/show-profile/BC",
    votingDate: "2024-04-26T07:00:00Z"
  },
  {
    name: "Chennai North",
    state: "Tamil Nadu",
    code: "CN",
    pinCodes: ["600001", "600013", "600021"],
    affidavitUrl: "https://affidavit.eci.gov.in/show-profile/CN",
    votingDate: "2024-04-19T07:00:00Z"
  },
  {
    name: "Kolkata Uttar",
    state: "West Bengal",
    code: "KU",
    pinCodes: ["700001", "700003", "700004"],
    affidavitUrl: "https://affidavit.eci.gov.in/show-profile/KU",
    votingDate: "2024-06-01T07:00:00Z"
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    code: "HYD",
    pinCodes: ["500001", "500002", "500023"],
    affidavitUrl: "https://affidavit.eci.gov.in/show-profile/HYD",
    votingDate: "2024-05-13T07:00:00Z"
  },
  {
    name: "Ahmedabad West",
    state: "Gujarat",
    code: "AW",
    pinCodes: ["380001", "380007", "380013"],
    affidavitUrl: "https://affidavit.eci.gov.in/show-profile/AW",
    votingDate: "2024-05-07T07:00:00Z"
  }
];

export const seedConstituencies = async () => {
  try {
    const colRef = collection(db, "constituencies");
    for (const c of constituencies) {
      await setDoc(doc(colRef, c.code), c);
      console.log(`Seeded ${c.name}`);
    }
    return true;
  } catch (e) {
    console.error("Error seeding constituencies:", e);
    return false;
  }
};
