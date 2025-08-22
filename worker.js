export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle "yes" and "no"
    if (url.searchParams.get("choice") === "yes") {
      await sendEvent(env, "Lead", 0.003);
      return Response.redirect("https://only-fan.github.io/Juicypleasure/", 302);
    }
    if (url.searchParams.get("choice") === "no") {
      await sendEvent(env, "Rejected", 0);
      return new Response("You exited.", { status: 200 });
    }

    return new Response("Worker up ✅", { status: 200 });
  }
};

async function sendEvent(env, eventName, value) {
  const endpoint = `https://graph.facebook.com/v18.0/${env.PIXEL_ID}/events?access_token=${env.ACCESS_TOKEN}`;

  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: "https://only-fan.github.io/Juicypleasure/",
      custom_data: {
        value: value,
        currency: "USD"
      }
    }]
  };

  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
