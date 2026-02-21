"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
const BASE_WAGER = 10; // MVP default
const MAX_MULTIPLIER = 15;
const MAX_STAKE = BASE_WAGER * MAX_MULTIPLIER;
const TIER_BASE: Record<string, number> = {
  free: 0,
  starter: 10,
  pro: 25,
  elite: 50,
};

const MULTIPLIER = 15;
export default function NewMatchPage() {
  const [dailyWagered, setDailyWagered] = useState(0);
const [lastWagerDate, setLastWagerDate] = useState<string | null>(null);
  const [stake, setStake] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/login";
      return;
    }

    setUserId(data.user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_tier, daily_wagered, last_wager_date")
      .eq("id", data.user.id)
      .single();

    if (profile) {
      setMembership(profile.membership_tier);
      setDailyWagered(profile.daily_wagered || 0);
      setLastWagerDate(profile.last_wager_date);
    }
  };

  loadUser();
}, []);

  const BASE_WAGER = 10; // MVP default
const MAX_MULTIPLIER = 15;
const MAX_STAKE = BASE_WAGER * MAX_MULTIPLIER;

  return (
    <main style={{ padding: 24 }}>
      <h1>Create Chess Match</h1>

      <label>
        Stake Amount ($)
        <input
          <p style={{ fontSize: "14px", color: "#666" }}>
  Max stake: ${MAX_STAKE} (15× limit)
</p>
          type="number"
          min="1"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "16px",
          }}
        />
      </label>

      <button
        onClick={createMatch}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
        }}
      >
        {loading ? "Creating..." : "Create Match"}
      </button>
    </main>
  );
}
