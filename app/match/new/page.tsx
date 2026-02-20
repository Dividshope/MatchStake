"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

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

  const createMatch = async () => {
    if (!stake || !userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("matches")
      .insert({
        creator_id: userId,
        stake_amount: Number(stake),
        status: "open",
      })
      .select()
      .single();

    if (!error && data) {
      window.location.href = `/match/${data.id}`;
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Create Chess Match</h1>

      <label>
        Stake Amount ($)
        <input
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
