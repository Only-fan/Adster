export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const choice = url.searchParams.get("choice");

    if (choice === "yes") {
      await sendEvent(env, "Lead", { value: 3.00, currency: "USD" });
      return Response.redirect(env.ADSTERRA_LINK, 302);
    } else if (choice === "no") {
      return Response.redirect(env.NO_REDIRECT, 302);
    }

    // Fire ViewContent when LP loads
    await sendEvent(env, "ViewContent", { value: 0.01, currency: "USD" });
    return new Response("Adult LP Worker running...");
  },
};

async function sendEvent(env, eventName, params) {
  const body = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: "https://your-landing-page-domain.com",
        user_data: {}, // we can enrich later
        custom_data: params,
      },
    ],
  };

  const res = await fetch(
    `https://graph.facebook.com/v18.0/${env.PIXEL_ID}/events?access_token=${env.ACCESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  // Log status + error message if any
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Meta Pixel API Error:", errorText);
  }
                                         }
