const tracks = [
  new Audio('assets/audio/tetris-soundtrack.mp3'),
  new Audio('assets/audio/chill-soundtrack.mp3'),
  new Audio('assets/audio/rushE.mp3'),
];

let currentTrackIndex = 0;
const song = document.getElementById("song");

// Function to update the song name display
function updateSongDisplay() {
  const currentTrack = tracks[currentTrackIndex];
  // Extract filename from the src path
  const filename = currentTrack.src.split('/').pop().replace('.mp3', '');
  song.textContent = filename;
}

// Initialize
tracks.forEach(track => track.volume = 0.05);
tracks[currentTrackIndex].loop = true;
tracks[currentTrackIndex].play().catch(err => {
  console.log("Autoplay failed:", err);
});

// Update song display initially
updateSongDisplay();

const btn = document.getElementById("toggle-music");
btn.addEventListener("click", () => {
  tracks.forEach(track => track.muted = !track.muted);
  btn.textContent = tracks.some(track => track.muted) ? "🔇" : "🔊";
});

const nextSong = document.getElementById("next-song");
nextSong.addEventListener("click", () => {
  tracks[currentTrackIndex].pause();
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  tracks[currentTrackIndex].currentTime = 0;
  tracks[currentTrackIndex].play().catch(err => {
    console.log("Autoplay failed:", err);
  });
  updateSongDisplay(); // Update display when song changes
});

const prevSong = document.getElementById("prev-song");
prevSong.addEventListener("click", () => {
  tracks[currentTrackIndex].pause();
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  tracks[currentTrackIndex].currentTime = 0;
  tracks[currentTrackIndex].play().catch(err => {
    console.log("Autoplay failed:", err);
  });
  updateSongDisplay(); // Update display when song changes
});