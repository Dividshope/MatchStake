"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Match = {
  id: string;
  stake_amount: number;
  status: string;
  creator_id: string;
  opponent_id: string | null;
  creator_result: string | null;
  opponent_result: string | null;
};

export default function MatchPage({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<Match | null>(null);
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
    const fetchMatch = async () => {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .eq("id", params.id)
        .single();

      setMatch(data);
      setLoading(false);
    };

    fetchMatch();
  }, [params.id]);

  const joinMatch = async () => {
    if (!match || !userId) return;

    await supabase
      .from("matches")
      .update({
        opponent_id: userId,
        status: "in_progress",
      })
      .eq("id", match.id);

    window.location.reload();
  };

  const reportResult = async (result: "win" | "loss" | "draw") => {
    if (!match || !userId) return;

    const field =
      userId === match.creator_id
        ? "creator_result"
        : "opponent_result";

    await supabase
      .from("matches")
      .update({ [field]: result, status: "reported" })
      .eq("id", match.id);

    window.location.reload();
  };

  if (loading) return <p style={{ padding: 20 }}>Loading match…</p>;
  if (!match) return <p style={{ padding: 20 }}>Match not found</p>;

  const isCreator = userId === match.creator_id;
  const isOpponent = userId === match.opponent_id;

  return (
    <main style={{ padding: 24 }}>
      <h1>Chess Match</h1>

      <p><strong>Stake:</strong> ${match.stake_amount}</p>
      <p><strong>Status:</strong> {match.status}</p>

      {/* OPEN MATCH */}
      {match.status === "open" && !match.opponent_id && !isCreator && (
        <button style={btn} onClick={joinMatch}>
          Join Match
        </button>
      )}

      {match.status === "open" && isCreator && (
        <p>Waiting for an opponent…</p>
      )}

      {/* IN PROGRESS */}
      {match.status === "in_progress" && (isCreator || isOpponent) && (
        <>
          <h3>Report Result</h3>

          <button style={btn} onClick={() => reportResult("win")}>
            I Won
          </button>

          <button style={btn} onClick={() => reportResult("loss")}>
            I Lost
          </button>

          <button style={btn} onClick={() => reportResult("draw")}>
            Draw
          </button>
        </>
      )}

      {/* REPORTED */}
      {match.status === "reported" && (
        <p>Result submitted. Waiting for confirmation…</p>
      )}

      {/* RESOLVED */}
      {match.status === "resolved" && (
        <p>Match complete. Funds released.</p>
      )}

      {/* DISPUTED */}
      {match.status === "disputed" && (
        <p>Match disputed. Admin review in progress.</p>
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
