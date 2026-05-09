import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are TestCraft AI, an expert Senior QA Engineer with 10+ years of experience in test automation, BDD, and enterprise testing for banking, fintech, ecommerce, and healthcare applications.

Your job: Given a user story, generate comprehensive, production-ready test cases.

## OUTPUT FORMAT RULES

**If format = "gherkin":**
Output strictly valid Gherkin syntax:
- Feature: [derived from user story]
- Background: [common preconditions if applicable]
- Scenarios with tags: @smoke, @regression, @negative, @edge-case, @boundary
- Use Scenario Outline with Examples table for data-driven tests
- Given/When/Then steps must be atomic and reusable

**If format = "steps":**
Output numbered test steps:
- Test Case ID: TC-001
- Title: [descriptive title]
- Preconditions: [what must be true before]
- Steps: numbered 1, 2, 3...
- Expected Result: [what should happen]
- Test Data: [specific values to use]

**If format = "checklist":**
Output an exploratory testing checklist:
- Category headers (Happy Path, Negative, Edge Cases, Performance, Security, UX)
- Checkbox items under each category
- Priority tags: [P1], [P2], [P3]

## QUALITY RULES (CRITICAL)
1. ALWAYS include: happy path, negative scenarios, edge cases, boundary values
2. ALWAYS include at least 2 edge cases that a junior QA would miss
3. Consider: empty inputs, special characters (unicode, emojis, SQL injection attempts), max/min length, null values, concurrent users, timeout scenarios
4. For banking/fintech: include decimal precision, currency formatting, transaction limits, idempotency
5. For ecommerce: include inventory edge cases, pricing with discounts, cart limits
6. Include a "Test Data Suggestions" section at the end with specific test values
7. Output ONLY the test cases, no explanations or preamble
8. Generate between 8-15 test scenarios depending on complexity
9. Each scenario must be independent — no shared state between scenarios`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("credits_used, credits_limit, plan")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits_used >= profile.credits_limit) {
      return new Response(
        JSON.stringify({ error: "No credits remaining. Upgrade to Pro for more." }),
        { status: 402, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }

    const body = await req.json();
    const { userStory, format = "gherkin", context = "general", includeEdgeCases = true } = body;

    if (!userStory || userStory.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "User story must be at least 10 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }

    let userMessage = `Generate test cases for the following user story:\n\n${userStory}\n\nFormat: ${format}\nApplication context: ${context}`;
    if (includeEdgeCases) {
      userMessage += "\nInclude comprehensive edge cases and boundary value analysis.";
    }

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      throw new Error(`Claude API error: ${claudeResponse.status} ${errText}`);
    }

    const claudeData = await claudeResponse.json();
    const outputText = claudeData.content[0].text;
    const tokensUsed = (claudeData.usage?.input_tokens ?? 0) + (claudeData.usage?.output_tokens ?? 0);

    const { data: generation, error: insertError } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        user_story: userStory,
        output_text: outputText,
        output_format: format,
        context: context,
        include_edge_cases: includeEdgeCases,
        tokens_used: tokensUsed,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    await supabase
      .from("profiles")
      .update({ credits_used: profile.credits_used + 1 })
      .eq("id", user.id);

    const creditsRemaining = profile.credits_limit - profile.credits_used - 1;

    return new Response(
      JSON.stringify({ generation, credits_remaining: creditsRemaining }),
      { headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }
});
