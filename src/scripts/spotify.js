import "../styles/spotify.css";
import { createIcons } from "lucide";

const LIBRARY_DATA = [
  {
    name: "Lofi Beats",
    type: "Playlist",
    author: "Tomas",
    img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150&h=150&fit=crop",
  },
  {
    name: "Gym Hype",
    type: "Playlist",
    author: "Spotify",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop",
  },
  {
    name: "Coding Focus",
    type: "Album",
    author: "Deep Focus",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop",
  },
  {
    name: "The Weeknd",
    type: "Artist",
    author: "Verified",
    img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=150&h=150&fit=crop",
  },
  {
    name: "Tame Impala",
    type: "Artist",
    author: "Verified",
    img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&h=150&fit=crop",
  },
];

const ALBUM_DATA = [
  {
    id: 1,
    title: "Midnight City",
    artist: "M83",
    img: "/spotify-clone/songs-photos/midnight-city.jpeg",
  },
  {
    id: 2,
    title: "Starboy",
    artist: "The Weeknd",
    img: "/spotify-clone/songs-photos/the-weeknd-starboy.png",
  },
  {
    id: 3,
    title: "After Hours",
    artist: "The Weeknd",
    img: "/spotify-clone/songs-photos/the-weeknd-after-hours.png",
  },
  {
    id: 4,
    title: "Currents",
    artist: "Tame Impala",
    img: "/spotify-clone/songs-photos/tame-impala-currents.png",
  },
  {
    id: 5,
    title: "Plastic Beach",
    artist: "Gorillaz",
    img: "/spotify-clone/songs-photos/plastic-beach.jpeg",
  },
  {
    id: 6,
    title: "Runner",
    artist: "Djo",
    img: "/spotify-clone/songs-photos/djo-runner.jpg",
  },
  {
    id: 7,
    title: "Levitating",
    artist: "Dua Lipa",
    img: "/spotify-clone/songs-photos/levitating-dua-lipa.png",
  },
  {
    id: 8,
    title: "Beat It",
    artist: "Michael Jackson",
    img: "/spotify-clone/songs-photos/beat-it.jpg",
  },
];

const searchInput = document.getElementById("main-search-input");
const clearBtn = document.getElementById("clear-search");
const albumGrid = document.getElementById("album-grid");
const playlistContainer = document.getElementById("playlist-container");
const masterIcon = document.getElementById("master-icon");
const masterPlayBtn = document.getElementById("master-play");
let isPlaying = false;

function initLibrary() {
  playlistContainer.innerHTML = LIBRARY_DATA.map(
    (item) => `
    <li class="flex items-center gap-3 hover:bg-zinc-800/50 p-2 rounded-lg cursor-pointer group transition-all duration-200">
      <img src="${item.img}" class="w-10 h-10 sm:w-12 sm:h-12 ${item.type === "Artist" ? "rounded-full" : "rounded-md"} object-cover shadow-lg group-hover:scale-105 transition" alt="${item.name} ${item.type}">
      <div class="min-w-0">
        <p class="text-xs sm:text-sm font-semibold truncate text-zinc-200 group-hover:text-white">${item.name}</p>
        <p class="text-[10px] sm:text-xs text-zinc-500 font-medium">${item.type} • ${item.author}</p>
      </div>
    </li>
  `,
  ).join("");
}

function renderContent(filter = "") {
  const results = ALBUM_DATA.filter(
    (a) =>
      a.title.toLowerCase().includes(filter.toLowerCase()) ||
      a.artist.toLowerCase().includes(filter.toLowerCase()),
  );

  document
    .getElementById("search-count")
    .classList.toggle("hidden", filter === "");
  clearBtn.classList.toggle("hidden", filter === "");

  albumGrid.innerHTML = results
    .map(
      (album) => `
    <li class="album-card group bg-[#181818] p-3 sm:p-4 rounded-xl hover:bg-[#282828] transition-all duration-300 cursor-pointer relative"
        onclick="playSong('${album.title}', '${album.artist}', '${album.img}')">
      <figure class="block">
        <div class="relative mb-3 sm:mb-4 aspect-square overflow-hidden rounded-lg shadow-xl">
          <img src="${album.img}" class="album-img absolute inset-0 w-full h-full object-cover" alt="${album.title} by ${album.artist}">
          <button class="absolute bottom-2 right-2 bg-green-500 text-black p-2.5 sm:p-3.5 rounded-full opacity-0 translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300 play-btn-shadow hover:scale-105 active:scale-95" aria-label="Play ${album.title}">
            <i data-lucide="play" class="fill-current w-5 h-5 sm:w-6 sm:h-6"></i>
          </button>
        </div>
        <figcaption>
          <h3 class="font-bold truncate text-xs sm:text-sm text-white">${album.title}</h3>
          <p class="text-[10px] sm:text-xs text-zinc-400 mt-1 sm:mt-2 font-semibold">${album.artist}</p>
        </figcaption>
      </figure>
    </li>
  `,
    )
    .join("");

  createIcons();
}

window.playSong = function (title, artist, img) {
  document.getElementById("player-title").innerText = title;
  document.getElementById("player-artist").innerText = artist;
  const playerArt = document.getElementById("player-art");
  playerArt.src = img;
  playerArt.alt = `Album art for ${title} by ${artist}`;
  masterIcon.setAttribute("data-lucide", "pause");
  masterPlayBtn.setAttribute("aria-label", "Pause current song");
  createIcons();
};

masterPlayBtn.addEventListener("click", () => {
  masterIcon.setAttribute("data-lucide", isPlaying ? "play" : "pause");
  masterPlayBtn.setAttribute(
    "aria-label",
    isPlaying ? "Play current song" : "Pause current song",
  );
  isPlaying = !isPlaying;
  createIcons();
});

searchInput.oninput = (e) => renderContent(e.target.value);
clearBtn.onclick = () => {
  searchInput.value = "";
  renderContent("");
};

const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("mobile-sidebar");
const overlay = document.getElementById("sidebar-overlay");
const closeSidebar = document.getElementById("close-sidebar");

menuBtn.onclick = () => {
  const open = sidebar.classList.toggle("sidebar-open");
  overlay.classList.toggle("hidden");
  menuBtn.setAttribute("aria-expanded", open);
};
closeSidebar.onclick = menuBtn.onclick;
overlay.onclick = menuBtn.onclick;

const hour = new Date().getHours();
document.getElementById("greeting").innerText =
  hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

initLibrary();
renderContent();
