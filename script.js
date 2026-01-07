const wordInput = document.getElementById('word-input');
const searchBtn = document.getElementById('search-btn');
const resultContainer = document.getElementById('result-container');
const errorMessage = document.getElementById('error-message');

async function searchWord() {
    const word = wordInput.value.trim();
    if (!word) {
        alert("Please enter a word!");
        return;
    }

    resultContainer.style.display = "none";
    errorMessage.innerText = "";

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) throw new Error("Word not found. Please try another word.");
        
        const data = await response.json();
        renderResult(data[0]);
    } catch (err) {
        errorMessage.innerText = err.message;
    }
}

function renderResult(data) {
    const word = data.word;
    const phonetic = data.phonetic || "";
    const meaning = data.meanings[0];
    const definition = meaning.definitions[0].definition;
    const partOfSpeech = meaning.partOfSpeech;

    // Search for an example in any of the definitions of the first meaning
    let example = "Example not available";
    for (let def of meaning.definitions) {
        if (def.example) {
            example = def.example;
            break;
        }
    }

    // Audio Logic
    const audioObj = data.phonetics.find(p => p.audio !== "");
    const audioUrl = audioObj ? audioObj.audio : null;

    resultContainer.innerHTML = `
        <div class="word-header">
            <div>
                <h2 style="font-size: 2rem;">${word}</h2>
                <p class="phonetic">${phonetic}</p>
            </div>
            ${audioUrl ? `
                <button onclick="new Audio('${audioUrl}').play()" style="border-radius: 50%; width: 50px; height: 50px;">
                    <i class="fas fa-volume-up"></i>
                </button>` : ''}
        </div>
        
        <div class="content">
            <span class="pos-badge">${partOfSpeech}</span>
            <p class="definition">${definition}</p>
            
            <div class="example-container">
                <span class="example-label">Example</span>
                <p class="example-text">"${example}"</p>
            </div>
        </div>
    `;

    resultContainer.style.display = "block";
}

searchBtn.addEventListener('click', searchWord);
wordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchWord(); });
