const wordInput = document.getElementById('wordInput');
const searchBtn = document.getElementById('searchBtn');
const resultArea = document.getElementById('resultArea');
const loader = document.getElementById('loader');

// Main function to handle search
async function searchWord() {
    const word = wordInput.value.trim();
    if (!word) return;

    // Show loader, hide result
    loader.classList.remove('hidden');
    resultArea.classList.add('hidden');

    try {
        // 1. Get English Meaning
        const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const dictData = await dictRes.json();

        // 2. Get Hindi Meaning
        const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${word}&langpair=en|hi`);
        const transData = await transRes.json();

        if (dictRes.ok) {
            displayResults(dictData[0], transData.responseData.translatedText);
        } else {
            alert("Word not found!");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        loader.classList.add('hidden');
    }
}

// Function to update the HTML
function displayResults(data, hindi) {
    document.getElementById('wordTitle').innerText = data.word;
    document.getElementById('hindiMean').innerText = hindi;
    
    const list = document.getElementById('definitionList');
    list.innerHTML = ""; // Clear old meanings

    // Loop through meanings and add them to the list
    data.meanings.forEach(m => {
        const p = document.createElement('p');
        p.className = "meaning-item";
        p.innerHTML = `<strong>[${m.partOfSpeech}]</strong> ${m.definitions[0].definition}`;
        list.appendChild(p);
    });

    // Handle Audio
    const audioSrc = data.phonetics.find(p => p.audio)?.audio;
    document.getElementById('audioBtn').onclick = () => {
        if (audioSrc) new Audio(audioSrc).play();
        else alert("No audio available");
    };

    resultArea.classList.remove('hidden');
}

// Event Listeners
searchBtn.addEventListener('click', searchWord);
wordInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") searchWord();
});