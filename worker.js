export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // --- SETTINGS ---
    const PIXEL_ID = "1091970342909970"; // your pixel ID
    const ACCESS_TOKEN = env.FB_ACCESS_TOKEN; // stored in Cloudflare
    const TEST_CODE = "TEST89426"; // your current test_event_code
    const USE_TEST_MODE = true; // change to false when going live
    // ----------------

    if (url.pathname === "/track") {
      const { event_name, event_id, user_data } = await request.json();

      const payload = {
        data: [
          {
            event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_id: event_id || crypto.randomUUID(),
            action_source: "website",
            event_source_url: url.origin,
            user_data,
          },
        ],
        ...(USE_TEST_MODE ? { test_event_code: TEST_CODE } : {}),
      };

      const fbResponse = await fetch(
        `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      return new Response(await fbResponse.text(), {
        status: fbResponse.status,
      });
    }

    return new Response("Worker up ✅", { status: 200 });
  },
};
