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

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
      } else {
        setUserId(data.user.id);
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchMatches = async () => {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .or(
          `creator_id.eq.${userId},opponent_id.eq.${userId}`
        )
        .order("created_at", { ascending: false });

      if (data) setMatches(data);
      setLoading(false);
    };

    fetchMatches();
  }, [userId]);

  if (loading) return <p style={{ padding: 20 }}>Loading dashboard…</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>My Matches</h1>

      {matches.length === 0 && (
        <p>No matches yet. Create one!</p>
      )}

      {matches.map((match) => (
        <div
          key={match.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginTop: "12px",
            borderRadius: "6px",
          }}
        >
          <p><strong>Stake:</strong> ${match.stake_amount}</p>
          <p><strong>Status:</strong> {match.status}</p>

          <a href={`/match/${match.id}`}>
            View Match →
          </a>
        </div>
      ))}

      <a
        href="/match/new"
        style={{
          display: "block",
          marginTop: "24px",
          fontWeight: "bold",
        }}
      >
        + Create New Match
      </a>
    </main>
  );
          }
