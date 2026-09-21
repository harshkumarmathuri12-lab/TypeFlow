const avatar = document.getElementById("avatar");
const username = document.getElementById("username");
const email = document.getElementById("email");

const bestWpm = document.getElementById("bestWpm");
const avgWpm = document.getElementById("avgWpm");
const totalTests = document.getElementById("totalTests");
const bestAcc = document.getElementById("bestAcc");
const streak = document.getElementById("streak");

const badgeContainer = document.getElementById("badgeContainer");
const historyList = document.getElementById("historyList");

// =============================
// User Info (Firebase)
// =============================

if (typeof auth !== "undefined") {
  auth.onAuthStateChanged(user => {

    if (user) {
      avatar.src = user.photoURL;
      username.innerText = user.displayName;
      email.innerText = user.email;
    }

  });
}

// =============================
// Load Local History
// =============================

const history = JSON.parse(localStorage.getItem("typeflow_history")) || [];

const streakData = JSON.parse(localStorage.getItem("typeflow_streak")) || {
  streak: 0
};

streak.innerText = `${streakData.streak} 🔥`;
totalTests.innerText = history.length;

if (history.length > 0) {

  const best = Math.max(...history.map(x => x.wpm));

  const average = Math.round(
    history.reduce((sum, item) => sum + item.wpm, 0) / history.length
  );

  const accuracy = Math.max(...history.map(x => x.accuracy));

  bestWpm.innerText = best;
  avgWpm.innerText = average;
  bestAcc.innerText = accuracy + "%";

}

// =============================
// Achievements
// =============================

const bestScore = history.length
  ? Math.max(...history.map(x => x.wpm))
  : 0;

const badges = [];

if (bestScore >= 30) badges.push("🥉 Bronze Typist");
if (bestScore >= 50) badges.push("🥈 Silver Typist");
if (bestScore >= 70) badges.push("🥇 Gold Typist");
if (bestScore >= 100) badges.push("👑 Speed Master");

if (badges.length === 0) {
  badgeContainer.innerHTML = "<p>No badges unlocked yet.</p>";
} else {

  badges.forEach(badge => {

    badgeContainer.innerHTML += `
      <div class="badge">${badge}</div>
    `;

  });

}

// =============================
// Recent History
// =============================

if (history.length === 0) {

  historyList.innerHTML = "<p>No typing tests yet.</p>";

} else {

  history.slice(0, 10).forEach(test => {

    historyList.innerHTML += `
      <div class="item">

        <div>
          <h3>${test.wpm} WPM</h3>
          <p>${test.accuracy}% Accuracy</p>
        </div>

        <div style="text-align:right;">
          <strong>${test.time}s</strong>
          <p>${test.date}</p>
        </div>

      </div>
    `;

  });

}

// =============================
// Navigation
// =============================

function goHome(){
  window.location.href = "index.html";
}