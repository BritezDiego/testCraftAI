import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Generation, OutputFormat, AppContext } from "../lib/types";

export type SortOrder = "desc" | "asc" | "alpha";
export type DateRange = "month" | "3months" | "all";

export interface GenerationFilters {
  format?: OutputFormat;
  context?: AppContext;
  favoritesOnly?: boolean;
  search?: string;
  sortOrder?: SortOrder;
  dateRange?: DateRange;
}

export function useGenerations(userId: string | undefined) {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGenerations = useCallback(
    async (filters?: GenerationFilters) => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from("generations")
          .select("*")
          .eq("user_id", userId);

        if (filters?.search) {
          query = query.or(
            `user_story.ilike.%${filters.search}%,output_text.ilike.%${filters.search}%`
          );
        }
        if (filters?.format) query = query.eq("output_format", filters.format);
        if (filters?.context) query = query.eq("context", filters.context);
        if (filters?.favoritesOnly) query = query.eq("is_favorite", true);

        if (filters?.dateRange === "month") {
          const d = new Date();
          d.setMonth(d.getMonth() - 1);
          query = query.gte("created_at", d.toISOString());
        } else if (filters?.dateRange === "3months") {
          const d = new Date();
          d.setMonth(d.getMonth() - 3);
          query = query.gte("created_at", d.toISOString());
        }

        if (filters?.sortOrder === "asc") {
          query = query.order("created_at", { ascending: true });
        } else if (filters?.sortOrder === "alpha") {
          query = query.order("user_story", { ascending: true });
        } else {
          query = query.order("created_at", { ascending: false });
        }

        const { data, error: err } = await query;
        if (err) throw err;
        setGenerations(data as Generation[]);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error loading generations");
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const fetchRecent = useCallback(
    async (limit = 5) => {
      if (!userId) return [];
      const { data } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);
      return (data as Generation[]) ?? [];
    },
    [userId]
  );

  const toggleFavorite = useCallback(async (id: string, current: boolean) => {
    await supabase.from("generations").update({ is_favorite: !current }).eq("id", id);
    setGenerations((prev) =>
      prev.map((g) => (g.id === id ? { ...g, is_favorite: !current } : g))
    );
  }, []);

  const deleteGeneration = useCallback(async (id: string) => {
    await supabase.from("generations").delete().eq("id", id);
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const getById = useCallback(async (id: string): Promise<Generation | null> => {
    const { data } = await supabase
      .from("generations")
      .select("*")
      .eq("id", id)
      .single();
    return data as Generation | null;
  }, []);

  return {
    generations,
    loading,
    error,
    fetchGenerations,
    fetchRecent,
    toggleFavorite,
    deleteGeneration,
    getById,
  };
}
