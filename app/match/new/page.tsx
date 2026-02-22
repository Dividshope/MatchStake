"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const TIER_BASE: Record<string, number> = {
  free: 0,
  starter: 10,
  pro: 25,
  elite: 50,
};

const MULTIPLIER = 15;

export default function NewMatchPage() {
  return <div>Match page works</div>;
}

  const [userId, setUserId] = useState<string | null>(null);
  const [membership, setMembership] = useState("free");
  const [stake, setStake] = useState("");
  const [dailyWagered, setDailyWagered] = useState(0);
  const [lastWagerDate, setLastWagerDate] = useState<string | null>(null);
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

  const createMatch = async () => {
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0];
    let currentDaily = dailyWagered;

    if (lastWagerDate !== today) {
      currentDaily = 0;

      await supabase
        .from("profiles")
        .update({
          daily_wagered: 0,
          last_wager_date: today,
        })
        .eq("id", userId);
    }

    const base = TIER_BASE[membership];
    if (!base) {
      alert("Upgrade membership to wager.");
      return;
    }

    const maxDaily = base * MULTIPLIER;
    const stakeValue = Number(stake);

    if (!stakeValue || stakeValue <= 0) {
      alert("Enter a valid stake");
      return;
    }

    if (currentDaily + stakeValue > maxDaily) {
      alert(
        `Daily limit exceeded. Remaining: $${maxDaily - currentDaily}`
      );
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("matches")
      .insert({
        creator_id: userId,
        stake_amount: stakeValue,
        status: "open",
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await supabase
      .from("profiles")
      .update({
        daily_wagered: currentDaily + stakeValue,
        last_wager_date: today,
      })
      .eq("id", userId);

    window.location.href = `/match/${data.id}`;
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Create Match</h1>

      <input
        type="number"
        placeholder="Stake amount"
        value={stake}
        onChange={(e) => setStake(e.target.value)}
      />

      <p style={{ fontSize: 14, color: "#666" }}>
        Tier: <strong>{membership}</strong><br />
        Daily limit: ${TIER_BASE[membership] * MULTIPLIER}<br />
        Used today: ${dailyWagered}
      </p>

      <button onClick={createMatch} disabled={loading}>
        {loading ? "Creating..." : "Create Match"}
      </button>
    </main>
  );
  }

