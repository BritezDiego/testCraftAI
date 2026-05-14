import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";
import type { CustomTemplate, AppContext, OutputFormat } from "../lib/types";
import { TEMPLATE_LIMITS } from "../lib/constants";

export function useCustomTemplates(userId: string | undefined, plan: string = "free") {
  const [templates, setTemplates] = useState<CustomTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("custom_templates")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    setTemplates((data as CustomTemplate[]) ?? []);
    setLoading(false);
  }, [userId]);

  const createTemplate = useCallback(
    async (template: {
      name: string;
      user_story: string;
      context: AppContext;
      format: OutputFormat;
      include_edge_cases: boolean;
    }): Promise<CustomTemplate> => {
      const limit = TEMPLATE_LIMITS[plan] ?? 3;
      if (templates.length >= limit) {
        throw new Error(`LIMIT_REACHED`);
      }
      const { data, error } = await supabase
        .from("custom_templates")
        .insert({ ...template, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      const created = data as CustomTemplate;
      setTemplates((prev) => [created, ...prev]);
      return created;
    },
    [userId, plan, templates.length]
  );

  const deleteTemplate = useCallback(async (id: string) => {
    await supabase.from("custom_templates").delete().eq("id", id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const templateLimit = TEMPLATE_LIMITS[plan] ?? 3;
  const canAddMore = templates.length < templateLimit;

  return { templates, loading, fetchTemplates, createTemplate, deleteTemplate, canAddMore, templateLimit };
}
