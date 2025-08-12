export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body = await request.json();

      const fbPayload = {
        data: [
          {
            event_name: body.event_name,
            event_time: body.event_time,
            action_source: "website",
            custom_data: body.custom_data || {},
          },
        ],
      };

      const pixelId = "1091970342909970"; // Your Pixel ID
      const accessToken = "EAAeAAwIifDgBPIWlb9op95UrRg3ssVOLgqp3KwuPu2zJ15pzlt8yUORE3DFv4NCmi8pBZAPMGpTYlVHFyuGZBeeEm6lchCT3j8ZCBwuX0Le3A3l8wYzPTA3qCM7fQEnN4s2fDLjDNnaaWaqRxo91oZBZC76FTXDxdELxoTJZAOSZA7uPcSfQF8HgioaemJhzAZDZD"; // Your CAPI token

      const fbRes = await fetch(
        `https://graph.facebook.com/v17.0/${pixelId}/events?access_token=${accessToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fbPayload),
        }
      );

      const fbData = await fbRes.json();

      return new Response(JSON.stringify(fbData), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};