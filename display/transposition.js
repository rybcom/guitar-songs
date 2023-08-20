var chordCircle = [
  "C",
  "G",
  "D",
  "A",
  "E",
  "B",
  "F#",
  "Db",
  "Ab",
  "Eb",
  "Bb",
  "F",
];

function transpose(chord, step) {
  // Regular expression to separate the root note and the suffix of the chord
  var chordComponents = chord.match(/([A-Ga-g#b]+)([^A-Ga-g#b]*)/);
  if (!chordComponents) return chord; // if chord doesn't match, return original

  var rootNote = chordComponents[1]; // e.g., "E" in "E7"
  var suffix = chordComponents[2]; // e.g., "7" in "E7"

  // Find the root note in the chord circle
  var index = chordCircle.indexOf(rootNote);
  if (index === -1) return chord; // return original chord if it's not in the circle

  // Transpose the root note
  var transposedIndex =
    (index + step + chordCircle.length) % chordCircle.length;

  // Recombine the transposed root note with the original suffix
  return chordCircle[transposedIndex] + suffix;
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
