// netlify/functions/uppromote-get-sale.js
export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  const { program_id, from, to } = event.queryStringParameters || {};
  if (!program_id) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "program_id required" }),
    };
  }

  try {
    const upstream = new URL("https://aff-api.uppromote.com/api/customize/v1/deanan/get-sale");
    upstream.searchParams.set("program_id", String(program_id));
    if (from) upstream.searchParams.set("from", String(from));
    if (to) upstream.searchParams.set("to", String(to));

    const resp = await fetch(upstream.toString(), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.UPPROMOTE_KEY}`,
      },
    });

    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": resp.headers.get("content-type") || "application/json",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "proxy_error", message: String(err) }),
    };
  }
}
