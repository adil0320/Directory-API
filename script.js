const form = document.querySelector('.form');
const contiainer = document.querySelector('.container');
const inputWord = document.querySelector('.input');
const loader = document.querySelector('.loader');
let btnSynonym;

const genSynonymMarkup = function (synonyms) {
  let markup = '<center><div class="grid-container">';
  synonyms.forEach(synonym => {
    markup += `
        <button class="btn-synonym">${synonym}</button>
        `;
  });

  markup += '</div></center>';

  return markup;
};

form.addEventListener('submit', async function (e) {
  try {
    e.preventDefault();
    const word = inputWord.value.toLowerCase();

    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    const [data] = await res.json();
    const wordMeanings = data.meanings;
    let markup = '';
    wordMeanings.forEach(meaning => {
      const definitions = meaning.definitions[0];
      const synonyms = definitions.synonyms.slice(0, 9);
      const synonymsMarkup =
        synonyms.length === 0
          ? `<span class="output">No synonym for ${data.word} </span>`
          : genSynonymMarkup(synonyms);
      markup += `
        <div class="summary">
            <h2>Part of Speech : <span class="output">${meaning.partOfSpeech}</span></h2>
            <h2>Definition : <span class="output">${definitions.definition}</span></h2>
            <h2>Example: <span class="output">${definitions.example}</span></h2>
            <h2 class= 'synonyms'>Synonyms: ${synonymsMarkup}</h2>
        </div>
    `;
    });
    contiainer.innerHTML = '';
    contiainer.insertAdjacentHTML('beforeend', markup);

    document
      .querySelector('.grid-container')
      .addEventListener('click', function (e) {
        const btnSynonym = e.target.closest('.btn-synonym');
        if (!btnSynonym) return;
        inputWord.value = btnSynonym.textContent;
      });
  } catch (err) {
    console.error(err);
  }
});

// <!-- <div class="summary">
// <h2>Part of Speech : noun</h2>
// <h2>Definition : xyz</h2>
// <h2>Example: abc</h2>
// <h2>synonyms</h2>
// </div>
