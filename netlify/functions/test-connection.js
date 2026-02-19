// netlify/functions/save-form.js
const { createClient } = require("@supabase/supabase-js");

const json = (statusCode, bodyObj, extraHeaders = {}) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    // CORS (safe defaults)
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    ...extraHeaders,
  },
  body: JSON.stringify(bodyObj),
});

function safeJsonParse(raw) {
  try {
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

exports.handler = async (event) => {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return json(204, {});
  }

  if (event.httpMethod !== "POST") {
    return json(405, { success: false, error: "Use POST" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, {
      success: false,
      error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    });
  }

  const body = safeJsonParse(event.body);
  if (!body) {
    return json(400, { success: false, error: "Invalid JSON body" });
  }

  const serial = String(body.serial || "").trim();
  const data = body.data;

  if (!serial) {
    return json(400, { success: false, error: "serial is required" });
  }

  if (data === null || data === undefined) {
    return json(400, { success: false, error: "data is required" });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Upsert by primary key "serial"
    const { error } = await supabase
      .from("quality_forms")
      .upsert({ serial, data }, { onConflict: "serial" });

    if (error) {
      return json(500, {
        success: false,
        error: "Supabase upsert failed",
        details: error.message || String(error),
      });
    }

    return json(200, { success: true });
  } catch (err) {
    return json(500, {
      success: false,
      error: "Unhandled server error",
      details: err?.message || String(err),
    });
  }
};
