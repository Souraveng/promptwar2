import { NextResponse } from "next/server";

// Mocking real-time election data as ECI doesn't provide a public real-time API
// Data structure follows official ECI reporting patterns for General Elections
// Updated with real 2024 Baselines and simulated 2026 West Bengal Trends
export async function GET() {
  return NextResponse.json({
    status: "Active - Phase VI (West Bengal Focus)",
    lastUpdated: new Date().toISOString(),
    nationalTurnout: "66.4%", // Based on 2024 avg
    totalVotesPolled: "642,000,000", // Based on 2024 final
    source: "Election Commission of India (ECI)",
    sourceUrl: "https://results.eci.gov.in/",
    topParties: [
      { name: "AITC (Bengal 2026)", seats: 215, status: "Defending (2021 State Baseline)", color: "#25D366" },
      { name: "BJP (Bengal 2026)", seats: 77, status: "Challenging (2021 State Baseline)", color: "#FF9933" },
      { name: "CPIM (Bengal 2026)", seats: 0, status: "Re-emerging (2021 State Baseline)", color: "#DE0000" },
      { name: "INC (Bengal 2026)", seats: 0, status: "Coalition Partner", color: "#19AAED" },
      { name: "NDA (National)", seats: 293, status: "Current Govt (2024 Results)", color: "#FF9933" },
      { name: "INDIA (National)", seats: 234, status: "Opposition (2024 Results)", color: "#19AAED" }
    ],
    upcomingPhases: [
      { phase: "West Bengal Phase VII", date: "2026-05-10", states: ["Murshidabad", "Nadia", "Kolkata North"], pollingBooths: 12450 },
      { phase: "West Bengal Phase VIII", date: "2026-05-15", states: ["Birbhum", "Malda", "Kolkata South"], pollingBooths: 11200 },
      { phase: "Counting Day (State)", date: "2026-05-23", states: ["West Bengal"], pollingBooths: 0 },
      { phase: "General Elections (National)", date: "2029-04-15", states: ["All India"], pollingBooths: 1000000 },
    ]
  });
}
