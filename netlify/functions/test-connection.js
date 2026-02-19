import { createClient } from "@supabase/supabase-js";

export const handler = async () => {
  try {
    const url = process.env.SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRole) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error:
            "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables",
        }),
      };
    }

    const supabase = createClient(url, serviceRole);

    // simplest DB check: run a lightweight query
    const { data, error } = await supabase
      .from("test_table")
      .select("*")
      .limit(1);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Supabase connected",
        data,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err?.message || String(err),
      }),
    };
  }
};
