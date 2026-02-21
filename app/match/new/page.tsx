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
  const [stake, setStake] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
      } else {
        setUserId(data.user.id);
      }
    });
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
