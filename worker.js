export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Handle button redirects
    if (url.pathname === "/yes") {
      return Response.redirect("https://only-fan.github.io/Juicypleasure/", 302);
    }
    if (url.pathname === "/no") {
      return Response.redirect("https://juicy-pleasure.github.io/Juicypleasure/", 302);
    }

    // Default: show the LP
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Adult Verification</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      color: #fff;
      background: url("Background.jpg") no-repeat center center fixed;
      background-size: cover;
    }
    .overlay {
      background: rgba(0,0,0,0.7);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 20px;
    }
    .box {
      background: rgba(20,20,20,0.85);
      padding: 30px;
      border-radius: 14px;
      max-width: 400px;
    }
    h1 {
      font-size: 28px;
      margin-bottom: 15px;
    }
    p {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .btn {
      display: inline-block;
      background: #ff004f;
      color: #fff;
      font-weight: bold;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
      margin: 8px;
    }
    .btn:hover {
      background: #ff2e6f;
    }
  </style>
</head>
<body>
  <div class="overlay">
    <div class="box">
      <h1>Adult Content Verification</h1>
      <p>You must verify your age to continue.</p>
      <a href="/yes" class="btn">I am 18+</a>
      <a href="/no" class="btn">Exit</a>
    </div>
  </div>
</body>
</html>
    `;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
};
