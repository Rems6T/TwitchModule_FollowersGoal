(() => {
  // ___ DO NOT CHANGE ANYTHING ELSE THAN "CLIENT_ID", "ACCESS_TOKEN", "USER_ID" VALUES IF YOU DON'T KNOW TO USE IT ___

  // If you see "8/25" please, check your Client ID, your access Token and your User ID

  // === CONFIG ===
  // 1. To get your ClientID, go to https://dev.twitch.tv/console/apps
  // 2. "Register your application" give it a name (not important)
  // 3. OAuth Redirect URLs = your website where you want to use it. If you use on your computer, enter "http://localhost"
  // 4. Tap "Create" then "Manage" and "New secret", copy the Client ID and replace "your_client_id" with it
  const CLIENT_ID = "your_client_id";

  // 1. To get both AccessToken and UserID, go to "https://twitchtokengenerator.com/"
  // 2. Search "user:read:email" and check the box to "Yes" on this line
  // 3. Go down and click on "Generate Token!"
  // 4. Log in and Authorize (and do the captcha)
  // 5. Now you can copy "Access token" and "Client ID" and replace both "your_access_token" and "your_user_id" below
  const ACCESS_TOKEN = "your_access_token";
  const USER_ID = "your_user_id";

  // ___ DO NOT CHANGE ANYTHING ELSE THAN "CLIENT_ID", "ACCESS_TOKEN", "USER_ID" VALUES IF YOU DON'T KNOW TO USE IT ___

  const heart = document.querySelector(".svgClass");
  if (!heart) return;

  const svg = heart.querySelector(".svg-block");
  const fillRect = svg.querySelector(".svg-fill");
  const currentEl = heart.querySelector(".current");
  const maxEl = heart.querySelector(".max");

  let max = parseInt(heart.dataset.max, 10) || 25;
  let current = parseInt(heart.dataset.current, 10) || 0;

  const clamp = (n, a, b) => Math.max(a, Math.min(n, b));

  const heartPath = svg.querySelector("clipPath#svg-clip-us path");
  const bbox = heartPath.getBBox();
  const TOP_Y = bbox.y;
  const BOTTOM_Y = bbox.y + bbox.height;
  const USABLE_H = BOTTOM_Y - TOP_Y;

  function nextMax(m) {
    if (m < 50) return m + 25;
    if (m < 200) return m + 50;
    return m + 100;
  }

  function render() {
    while (current > max) max = nextMax(max);
    current = clamp(current, 0, max);

    const pct = max > 0 ? current / max : 0;
    const height = pct * USABLE_H;
    const y = BOTTOM_Y - height;

    fillRect.setAttribute("y", y.toFixed(3));
    fillRect.setAttribute("height", height.toFixed(3));

    if (currentEl) currentEl.textContent = current.toLocaleString("en-EN");
    if (maxEl) maxEl.textContent = max.toLocaleString("en-EN");
  }

  async function fetchFollowers() {
    try {
      const res = await fetch(
        `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${USER_ID}`,
        {
          headers: {
            "Client-ID": CLIENT_ID,
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );
      if (!res.ok) {
        console.error("Twitch API:", res.status, await res.text());
        return;
      }
      const data = await res.json();
      if (typeof data.total === "number") {
        current = data.total;
        render();
      }
    } catch (err) {
      console.error("Twitch API Error:", err);
    }
  }

  render();
  fetchFollowers();
  setInterval(fetchFollowers, 30000);
})();
