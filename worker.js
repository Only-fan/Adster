export default {
  async fetch(request) {
    const url = new URL(request.url);
    const choice = url.searchParams.get("choice");

    // Default redirect if no choice
    if (!choice) {
      return Response.redirect("https://only-fan.github.io/Juicypleasure/", 302);
    }

    // ✅ Handle choice events
    if (choice === "yes") {
      // user clicked "I am 18+"
      return Response.redirect("https://only-fan.github.io/Juicypleasure/", 302);
    }

    if (choice === "no") {
      // user clicked "Exit"
      return Response.redirect("https://www.google.com/", 302);
    }

    // ✅ For custom events later
    if (choice === "lead") {
      return Response.redirect("https://only-fan.github.io/Juicypleasure/", 302);
    }

    if (choice === "rejected") {
      return Response.redirect("https://www.google.com/", 302);
    }

    // fallback
    return new Response("Invalid choice", { status: 400 });
  }
}
