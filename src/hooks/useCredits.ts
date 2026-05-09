import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { Profile } from "../lib/types";

export function useCredits(profile: Profile | null) {
  const [updating, setUpdating] = useState(false);

  const creditsUsed = profile?.credits_used ?? 0;
  const creditsLimit = profile?.credits_limit ?? 10;
  const creditsRemaining = Math.max(0, creditsLimit - creditsUsed);
  const hasCredits = creditsRemaining > 0;
  const percentUsed = creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0;

  async function decrementCredits(userId: string): Promise<boolean> {
    if (!profile || !hasCredits) return false;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ credits_used: creditsUsed + 1 })
        .eq("id", userId);
      return !error;
    } finally {
      setUpdating(false);
    }
  }

  return { creditsUsed, creditsLimit, creditsRemaining, hasCredits, percentUsed, updating, decrementCredits };
}
