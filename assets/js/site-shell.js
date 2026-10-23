(() => {
  const script = document.currentScript;
  const component = script?.dataset.component;

  if (!script || !component) return;

  const navigation = [
    ["challenges", "/challenges.html", "fa-bullseye", "CHALLENGES"],
    ["academy", "/academy.html", "fa-graduation-cap", "ACADEMY"],
    ["arena", "/arena", "fa-landmark", "ARENA"],
    ["faq", "/faq.html", "fa-question-circle", "FAQ"],
    ["contact", "/contact.html", "fa-envelope", "CONTACT"],
    ["scoreboard", "/scoreboard.html", "fa-trophy", "SCOREBOARD"],
    ["contributors", "/contributors.html", "fa-users", "CONTRIBUTORS"],
  ];

  const pagePath = window.location.pathname.toLowerCase().replace(/\.html$/, "");
  const activePage = navigation.find(([key]) =>
    pagePath === `/${key}` || pagePath.startsWith(`/${key}/`),
  )?.[0];

  const shell = `
    <header class="header">
      <a href="/home.html">
        <img src="/images/wargame header logo 3 banner.webp" alt="Wargames Logo" class="header-logo">
      </a>
      <div class="header-right" id="headerRight">
        <a href="/login.html" class="auth-button" id="loginBtn">Login</a>
        <a href="/register.html" class="auth-button" id="registerBtn">Register</a>
      </div>
    </header>
    <button class="donate-float" id="donateButton">Donate!</button>
    ${["/home", "/home.html", "/privacy-policy", "/privacy-policy.html", "/profiles", "/profiles/index.html"].includes(window.location.pathname.toLowerCase()) ? `
      <div class="discord-invite-sign" id="discordInviteSign">
        <div class="discord-tooltip">Join Our Discord!</div>
        <img src="/images/discord-invite-sign.webp" alt="Discord Invite" class="discord-invite-image">
      </div>
    ` : ""}
    <div class="overlay" id="overlay"></div>
    <div class="donation-popup" id="donationPopup">
      <h2>SUPPORT US</h2>
      <div class="donation-options">
        <div class="donation-method">
          <div class="donation-method-title">Donate via Patreon</div>
          <a href="https://www.patreon.com/WargamesBataMladen" target="_blank" class="donation-link patreon">
            <i class="fab fa-patreon"></i>
            <span>Patreon</span>
          </a>
        </div>
        <div class="donation-method">
          <div class="donation-method-title">Donate in cryptocurrency</div>
          <a href="https://www.tip.md/batamladen" target="_blank" class="donation-link tip">
            <i class="fab fa-bitcoin"></i>
            <span>Tip.md</span>
          </a>
        </div>
      </div>
      <button class="cancel-button" id="closePopup">CLOSE</button>
    </div>
    <div class="sidebar">
      <ul class="challenge-list" id="sidebarList">
        ${navigation.map(([key, href, icon, label]) => `
          <a href="${href}" class="challenge-item${key === activePage ? " active" : ""}" data-challenge="${key}">
            <i class="fas ${icon}"></i> ${label}
          </a>
        `).join("")}
      </ul>
    </div>
  `;

  const footer = `
    <footer class="site-footer">
      <div class="footer-content">
        <div>
          <div class="footer-logo-section">
            <img src="/images/wargames-logo.ico" alt="Wargames Logo" class="footer-logo">
            <div class="footer-logo-text">Wargames BataMladen</div>
          </div>
          <p class="footer-tagline">A cybersecurity wargames platform created for your enjoyment by Mladen Nikolov.</p>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h3>Platform</h3>
            <ul class="footer-links-list">
              <li><a href="/challenges">Challenges</a></li>
              <li><a href="/academy">Academy</a></li>
              <li><a href="/arena">Arena</a></li>
              <li><a href="/scoreboard">Scoreboard</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Community</h3>
            <ul class="footer-links-list">
              <li><a href="/contributors">Contributors</a></li>
              <li><a href="https://discord.gg/r7uN9vBqVC" target="_blank">Discord</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Support</h3>
            <ul class="footer-links-list">
              <li><a href="#" id="footerDonateButton">Donate</a></li>
              <li><a href="https://discord.gg/r7uN9vBqVC">Report Bug</a></li>
              <li><a href="https://discord.gg/r7uN9vBqVC">Suggest Feature</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Other</h3>
            <ul class="footer-links-list">
              <li><a href="/documentation">Documentation</a></li>
              <li><a href="/sponsors">Sponsors</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-legal-links"><a href="/privacy-policy">Privacy Policy</a></div>
          <div class="footer-social-links">
            <a href="https://github.com/batamladen/Wargames-BataMladen" target="_blank" class="social-link" title="GitHub"><i class="fab fa-github"></i></a>
            <a href="https://discord.gg/r7uN9vBqVC" target="_blank" class="social-link" title="Discord"><i class="fab fa-discord"></i></a>
            <a href="https://www.patreon.com/WargamesBataMladen" target="_blank" class="social-link" title="Patreon"><i class="fab fa-patreon"></i></a>
            <a href="https://www.tip.md/batamladen" target="_blank" class="social-link" title="Tip.md"><i class="fab fa-bitcoin"></i></a>
          </div>
          <div class="footer-copyright">&copy; <span id="current-year">2025</span> Wargames By BataMladen.</div>
        </div>
      </div>
    </footer>
  `;

  script.insertAdjacentHTML("beforebegin", component === "footer" ? footer : shell);
  script.remove();
})();