document.addEventListener("DOMContentLoaded", () => {
  const moodForm = document.getElementById("moodForm");
  const moodInput = document.getElementById("moodInput");
  const moodList = document.getElementById("moodList");
  const tableBody = document.querySelector("#entriesTable tbody");
  const ctx = document.getElementById("moodChart").getContext("2d");
  let chart;

  // ✅ All 25 moods
  const moods = [
    "😊 Happy", "😢 Sad", "😡 Angry", "😌 Relaxed", "🤔 Thoughtful",
    "😍 Loved", "😴 Tired", "😎 Confident", "😭 Heartbroken", "🤯 Stressed",
    "😇 Grateful", "🤗 Excited", "😔 Lonely", "😱 Anxious", "🤤 Bored",
    "😤 Frustrated", "😏 Proud", "😋 Playful", "🥰 Romantic", "🤒 Sick",
    "😵 Confused", "😃 Motivated", "🤫 Calm", "😬 Nervous", "🤩 Inspired"
  ];

  // ✅ Show dropdown suggestions below input
  moodInput.addEventListener("input", () => {
    const query = moodInput.value.toLowerCase();
    moodList.innerHTML = "";

    if (!query) {
      moodList.style.display = "none";
      return;
    }

    const filtered = moods.filter(m => m.toLowerCase().includes(query));
    if (filtered.length === 0) {
      moodList.style.display = "none";
      return;
    }

    filtered.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m;
      li.addEventListener("click", () => {
        moodInput.value = m;
        moodList.style.display = "none";
      });
      moodList.appendChild(li);
    });

    moodList.style.display = "block";
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!moodInput.contains(e.target) && !moodList.contains(e.target)) {
      moodList.style.display = "none";
    }
  });

  // ✅ Load mood entries
  async function loadEntries() {
    try {
      const res = await fetch("/api/entries");
      const entries = await res.json();
      tableBody.innerHTML = "";

      entries.forEach((entry, i) => {
        const row = `<tr>
          <td>${i + 1}</td>
          <td>${entry.mood}</td>
          <td>${entry.note}</td>
          <td>${entry.timestamp}</td>
        </tr>`;
        tableBody.innerHTML += row;
      });

      updateChart(entries);
    } catch (err) {
      console.error("Error loading entries:", err);
    }
  }

  // ✅ Update Pie Chart
  function updateChart(entries) {
    const counts = {};
    entries.forEach(e => counts[e.mood] = (counts[e.mood] || 0) + 1);

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            "#ff6384","#36a2eb","#ffce56","#4bc0c0","#9966ff",
            "#ff9f40","#c9cbcf","#8bc34a","#e91e63","#2196f3",
            "#00bcd4","#ffeb3b","#8bc34a","#ff5722","#9c27b0",
            "#607d8b","#03a9f4","#ff9800","#795548","#009688",
            "#f44336","#673ab7","#cddc39","#e91e63","#03a9f4"
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  // ✅ Handle form submit
  moodForm.addEventListener("submit", async e => {
    e.preventDefault();
    const mood = moodInput.value.trim();
    const note = document.getElementById("note").value.trim();

    if (!mood) return alert("Please select or type a mood!");

    try {
      await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, note })
      });
      moodForm.reset();
      loadEntries();
    } catch (err) {
      console.error("Error adding entry:", err);
    }
  });

  // ✅ Initial load
  loadEntries();
});