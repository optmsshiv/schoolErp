const overlay = document.getElementById("searchPalette");
const input = document.getElementById("paletteInput");
const openBtn = document.getElementById("openSearchPalette");
const closeBtn = document.getElementById("closeSearchPalette");
const recentList = document.getElementById("recentList");

let currentIndex = -1;

/* -------------------------
   OPEN / CLOSE PALETTE
--------------------------*/
function openPalette() {
  const overlay = document.getElementById("searchPalette");

  overlay.classList.remove("closing");
  overlay.style.display = "flex";

  setTimeout(() => {
    overlay.classList.add("active");
    input.focus();
  }, 10);
}
openBtn.addEventListener("click", openPalette);


function closePalette() {
  const overlay = document.getElementById("searchPalette");

  overlay.classList.add("closing");
  overlay.classList.remove("active");

  // remove from screen AFTER animation
  setTimeout(() => {
    overlay.style.display = "none";
  }, 250); // match CSS transition
}
closeBtn.addEventListener("click", closePalette);


// ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePalette();
});

// CTRL + K to open
document.addEventListener("keydown", function(e) {
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openPalette();
  }
});

/* -------------------------
   RECENT SEARCH HANDLING
-------------------------- */
function loadRecent() {
  const recent = JSON.parse(localStorage.getItem("recentStudents") || "[]");
  recentList.innerHTML = "";

  recent.forEach(item => {
    let div = document.createElement("div");
    div.innerHTML = `<i class='bx bx-time'></i> ${item}`;
    div.onclick = () => {
      input.value = item;
      startSearch(); // trigger search
    };
    recentList.appendChild(div);
  });
}

function saveRecent(term) {
  if (!term) return;

  let recent = JSON.parse(localStorage.getItem("recentStudents") || "[]");
  recent = recent.filter(t => t !== term); // remove duplicate
  recent.unshift(term);

  if (recent.length > 4) recent.pop();

  localStorage.setItem("recentStudents", JSON.stringify(recent));
  loadRecent();
}

loadRecent();
window.saveRecent = saveRecent;

/* -------------------------
   SKELETON LOADING
-------------------------- */
function showSkeleton() {
  document.getElementById("searchSkeleton").style.display = "block";
  document.getElementById("paletteResults").innerHTML = "";
}

function hideSkeleton() {
  document.getElementById("searchSkeleton").style.display = "none";
}

/* -------------------------
   SEARCH + KEY NAVIGATION
-------------------------- */
input.addEventListener("keyup", function (e) {
// Auto-hide recent when typing
  if (input.value.trim().length > 0) {
    recentList.style.display = "none";
  } else {
    recentList.style.display = "block"; // empty input → show recent again
  }

  // KEYBOARD NAVIGATION HANDLER
  if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
    navigateResults(e.key);
    return;
  }
  // Normal typing → Perform fresh search
  startSearch();
});

function startSearch() {
  const term = input.value.trim();
  currentIndex = -1;

  showSkeleton();

  // Delay to show skeleton animation
  setTimeout(() => {
    searchStudents(input, document.getElementById("paletteResults"));
    saveRecent(term);
    hideSkeleton();
  }, 300);
}

/* -------------------------
   NAVIGATION LOGIC
-------------------------- */
function navigateResults(key) {
  const items = document.querySelectorAll("#paletteResults .result-item");
  if (!items.length) return;

  items.forEach(i => i.classList.remove("active")); // remove old highlight

  if (key === "ArrowDown") currentIndex++;
  if (key === "ArrowUp") currentIndex--;

  // Loop back
  if (currentIndex >= items.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = items.length - 1;

  // Apply highlight
  items[currentIndex].classList.add("active");

  // Auto scroll into view
  items[currentIndex].scrollIntoView({ block: "nearest" });

  if (key === "Enter") {
    items[currentIndex].click();
  }
}
 // fade animation
function highlightMatch(text, query) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, `<mark class="highlight">$1</mark>`);
}
