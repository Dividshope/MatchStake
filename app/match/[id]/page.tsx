"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Match = {
  id: string;
  stake_amount: number;
  status: string;
  creator_id: string;
  opponent_id: string | null;
};

export default function MatchPage({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!error) setMatch(data);
      setLoading(false);
    };

    fetchMatch();
  }, [params.id]);

  if (loading) return <p style={{ padding: 20 }}>Loading match...</p>;
  if (!match) return <p style={{ padding: 20 }}>Match not found</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Chess Match</h1>

      <p><strong>Match ID:</strong> {match.id}</p>
      <p><strong>Stake:</strong> ${match.stake_amount}</p>
      <p><strong>Status:</strong> {match.status}</p>

      {match.status === "in_progress" && (
        <>
          <h3>Report Result</h3>

          <button style={btn} onClick={() => alert("Reported WIN")}>
            I Won
          </button>

          <button style={btn} onClick={() => alert("Reported LOSS")}>
            I Lost
          </button>

          <button style={btn} onClick={() => alert("Reported DRAW")}>
            Draw
          </button>
        </>
      )}

      {match.status !== "in_progress" && (
        <p>Waiting for opponent or resolution…</p>
      )}
    </main>
  );
}

const btn = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  fontSize: "16px",
};
