export default {
async fetch(request, env) {
const url = new URL(request.url);
const path = url.pathname.toLowerCase();

// Your Facebook Pixel details  
const pixelId = "1091970342909970";  
const accessToken = "EAAeAAwIifDgBPIWlb9op95UrRg3ssVOLgqp3KwuPu2zJ15pzlt8yUORE3DFv4NCmi8pBZAPMGpTYlVHFyuGZBeeEm6lchCT3j8ZCBwuX0Le3A3l8wYzPTA3qCM7fQEnN4s2fDLjDNnaaWaqRxo91oZBZC76FTXDxdELxoTJZAOSZA7uPcSfQF8HgioaemJhzAZDZD";  

// Third-party links for Yes/No  
const yesRedirect = "https://only-fan.github.io/Juicypleasure/"; // Your YES link  
const noRedirect = "https://only-fan.github.io/Juicypleasure/";  // Your NO link  

// Send Facebook CAPI Event  
async function sendFBEvent(eventName) {  
  const fbPayload = {  
    data: [  
      {  
        event_name: eventName,  
        event_time: Math.floor(Date.now() / 1000),  
        action_source: "website",  
        event_source_url: request.url,  
        user_data: {  
          client_ip_address: request.headers.get("CF-Connecting-IP"),  
          client_user_agent: request.headers.get("User-Agent")  
        }  
      }  
    ]  
  };  

  await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`, {  
    method: "POST",  
    headers: { "Content-Type": "application/json" },  
    body: JSON.stringify(fbPayload)  
  });  
}  

// Route handling  
if (path === "/yes") {  
  await sendFBEvent("Yes_Click");  
  return Response.redirect(yesRedirect, 302);  
} else if (path === "/no") {  
  await sendFBEvent("No_Click");  
  return Response.redirect(noRedirect, 302);  
}  

// Default response for non-matching paths  
return new Response("Invalid request", { status: 404 });

}
};


