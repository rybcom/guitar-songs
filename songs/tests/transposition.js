var chordCircle = [
  "C", "Cm",
  "G", "Gm",
  "D", "Dm",
  "A", "Am",
  "E", "Em",
  "B", "Bm",
  "F#/Gb", "F#m/Gbm",
  "Db", "Dbm",
  "Ab", "Abm",
  "Eb", "Ebm",
  "Bb", "Bbm",
  "F", "Fm",
];

function transpose(chord, step) {
  // Split the chord into base and modifiers (like m for minor)
  var baseChord = chord.replace(/m$/, '');
  var isMinor = chord.endsWith('m');
  
  // Find the base chord in the chord circle
  var index = chordCircle.indexOf(baseChord);
  if (index === -1) return chord; // return original chord if it's not in the circle
  
  // Handle minors by shifting the index
  if (isMinor) index++;

  var transposedIndex = (index + step * 2 + chordCircle.length) % chordCircle.length;
  return chordCircle[transposedIndex];
}

function transposeSong(step) {
  var chords = document.getElementsByTagName("sup");
  for (var i = 0; i < chords.length; i++) {
    chords[i].textContent = transpose(chords[i].textContent, step);
  }
}

class TranspositionController extends HTMLElement {
  /*
   * The constructor() method is called when the element is first created.
   * It's a good place to set default values and DOM, but not to make changes
   * to the DOM that reflect dynamic values (e.g. the current time).
   * connectedCallback() is a better place for that.
   */
  constructor() {
    super();
    this.transposition = 0;
  }

  /*
   * connectedCallback() is called when the element is first added to the DOM.
   */
  connectedCallback() {
    this.innerHTML = `
      <button id="decreaseButton" onclick="this.parentElement.decreaseTransposition()">-</button>
      <span id="currentTransposition">${this.transposition}</span>
      <button id="increaseButton" onclick="this.parentElement.increaseTransposition()">+</button>
    `;
  }

  /*
   * decreaseTransposition() change the transposition of the song by -1
   */
  decreaseTransposition() {
    this.transposition--;
    this.updateTranspositionText();
    transposeSong(-1);
  }

  /*
   * increaseTransposition() change the transposition of the song by +1
   */
  increaseTransposition() {
    this.transposition++;
    this.updateTranspositionText();
    transposeSong(1);
  }

  /*
   * updateTranspositionText() update the text of the transposition
   */
  updateTranspositionText() {
    this.querySelector("#currentTransposition").textContent =
      this.transposition;
  }
}

customElements.define("transposition-controller", TranspositionController);
