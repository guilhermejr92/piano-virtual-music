const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheck = document.querySelector(".keys-check input");
const playSongBtn = document.getElementById("playSongBtn");
const songSelect = document.getElementById("songSelect");

let audio = new Audio("src/tunes/a.wav");
let isVisible = true;
let currentSong = null;
let currentNoteIndex = 0;
let mapedKeys = [];

// Lista de músicas com notas e tempos
const songs = {
    "Twinkle Twinkle": [
        { key: "a", duration: 500 },
        { key: "a", duration: 500 },
        { key: "s", duration: 500 },
        { key: "s", duration: 500 },
        { key: "d", duration: 500 },
        { key: "d", duration: 500 },
        { key: "s", duration: 1000 }
    ],
    "Ode to Joy": [
        { key: "d", duration: 400 },
        { key: "d", duration: 400 },
        { key: "e", duration: 400 },
        { key: "f", duration: 400 },
        { key: "f", duration: 400 },
        { key: "e", duration: 400 },
        { key: "d", duration: 400 },
        { key: "c", duration: 400 },
        { key: "c", duration: 400 },
        { key: "d", duration: 400 },
        { key: "e", duration: 400 },
        { key: "e", duration: 400 },
        { key: "d", duration: 800 }
        // Continue com o restante da música
    ]
};


// Function to play the song
const playSong = () => {
    currentSong = songs[songSelect.value];
    currentNoteIndex = 0;
    playNextNote();
};

// Function to play the next note in the sequence
const playNextNote = () => {
    if (!currentSong || currentNoteIndex >= currentSong.length) return;

    const note = currentSong[currentNoteIndex];
    playTune(note.key);  // Play the sound
    highlightKey(note.key);  // Highlight the key for visual feedback

    // Move to the next note after the specified duration
    setTimeout(() => {
        currentNoteIndex++;
        playNextNote();
    }, note.duration);
};

// Function to highlight keys for visual feedback
const highlightKey = (key) => {
    const keyElement = document.querySelector(`[data-key="${key}"]`);
    keyElement.classList.add("active");
    setTimeout(() => keyElement.classList.remove("active"), 300);
};

// Main playTune function
const playTune = (key) => {
    audio.src = `src/tunes/${key}.wav`;
    audio.play();
};

// Piano key event listeners
pianoKeys.forEach((key) => {
    key.addEventListener("click", () => playTune(key.dataset.key));
    key.addEventListener("touchstart", () => playTune(key.dataset.key));
    mapedKeys.push(key.dataset.key);
});

// Keydown event listener for keyboard input
document.addEventListener("keydown", (e) => {
    if (mapedKeys.includes(e.key)) playTune(e.key);
});

// Volume control
const handleVolume = (e) => {
    audio.volume = e.target.value;
};

// Show or hide key labels
const showHideKeys = () => {
    pianoKeys.forEach(key => key.classList.toggle("hide"));
};

// Event listeners
volumeSlider.addEventListener("input", handleVolume);
keysCheck.addEventListener("click", showHideKeys);
playSongBtn.addEventListener("click", playSong);

