const { createClient } = require("@supabase/supabase-js");

exports.handler = async function (event, context) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // simple test query (replace "inspections" with your table later)
    const { data, error } = await supabase
      .from("inspections")
      .select("*")
      .limit(1);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Connected to Supabase successfully",
        sample: data,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
pwd
ls -la
ls -la netlify
ls -la netlify/functions
file netlify/functions || true
git status
git add netlify/functions/test-connection.js package.json pnpm-lock.yaml
git status
