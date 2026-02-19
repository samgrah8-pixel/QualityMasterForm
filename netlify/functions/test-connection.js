const { createClient } = require("@supabase/supabase-js");

exports.handler = async () => {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars",
        }),
      };
    }

    const supabase = createClient(url, key);

    // simple query just to prove auth + DB access works
    const { data, error } = await supabase
      .from("test_table")
      .select("*")
      .limit(1);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Supabase connected",
        data,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: err?.message || String(err),
      }),
    };
  }
};
