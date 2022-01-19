const form = document.querySelector('.form');
const contiainer = document.querySelector('.container');
const inputWord = document.querySelector('.input');
const loader = document.querySelector('.loader');
let btnSynonym;

const clearContainer = () => (contiainer.innerHTML = '');

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

const renderFetchError = function () {
  clearContainer();
  const markup = `
      <h1 class= "error">
        Could Not Find the word, Please try another word :)
      </h1>
  `;
  loader.style.display = 'none';
  contiainer.insertAdjacentHTML('beforeend', markup);
};

const renderInputError = function () {
  clearContainer();
  const markup = `
      <h1 class= "error">
        Please Enter word :)
      </h1>
  `;
  loader.style.display = 'none';
  contiainer.insertAdjacentHTML('beforeend', markup);
};

const renderMeanings = async function (e) {
  try {
    e.preventDefault();
    clearContainer();
    loader.style.display = 'block';
    const word = inputWord.value.toLowerCase();
    // console.log(word);

    if (word === '') return renderInputError();

    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (res.status === 404) return renderFetchError();

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
    loader.style.display = 'none';
    clearContainer();
    contiainer.insertAdjacentHTML('beforeend', markup);

    // const container = document.querySelector('.container');
    if (!contiainer) return;
    const btnSynonyms = Array.from(document.querySelectorAll('.btn-synonym'));
    if (!btnSynonyms) return;
    btnSynonyms.forEach(btn =>
      btn.addEventListener('click', function (e) {
        inputWord.value = btn.textContent;
        renderMeanings(e);
      })
    );
  } catch (err) {
    console.error(err);
  }
};

form.addEventListener('submit', e => {
  renderMeanings(e);
});

// <!-- <div class="summary">
// <h2>Part of Speech : noun</h2>
// <h2>Definition : xyz</h2>
// <h2>Example: abc</h2>
// <h2>synonyms</h2>
// </div>
