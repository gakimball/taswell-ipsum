(function(quotes_json){
  /*
    Form elements
  */

  var input_paragraphs = document.getElementById('paragraphs');
  var input_ptags = document.getElementById('ptags');
  var generate_button = document.getElementById('generate');
  var results = document.getElementById('results');

  input_paragraphs.value = '3';

  generate_button.addEventListener('click', function(){
    generate_ipsum(true);
  });

  ZeroClipboard.setDefaults({
    moviePath: 'js/zero-clipboard/ZeroClipboard.swf',
    allowScriptAccess: 'always',
    hoverClass: 'button-hover'
  });

  /**
   * Setup our clipboard on DOM ready 
   */
  document.addEventListener('DOMContentLoaded', function () {
    var clipboardButton = document.getElementById('clipboard'),
      clipboard,
      previousTimeout;

    clipboard = new ZeroClipboard(clipboardButton, {
      hoverClass: 'button-hover'
    });

    clipboardButton.textContent = clipboardButton.dataset.normal;

    clipboard.on('mousedown', function () {

        if (results.childNodes.length === 0) {
          //no quotes? make them!
          generate_ipsum(true);
        }

        //set the text on the clipboard 
        clipboard.setText(results.innerHTML);

        clipboardButton.textContent = clipboardButton.dataset.onCopied;

        if (clipboardButton.className.indexOf(clipboardButton.dataset.onCopiedClass) === -1) {
          //only add the hover class if it doesn't exist already
          clipboardButton.className += ' ' + clipboardButton.dataset.onCopiedClass;
        }

        if (previousTimeout) {
          //if there's another timeout, try clearing it
          clearTimeout(previousTimeout);
        }

        previousTimeout = setTimeout(
          function () {
            //make the button look normal again
            clipboardButton.textContent = clipboardButton.dataset.normal;
            clipboardButton.className = clipboardButton.className.replace(clipboardButton.dataset.onCopiedClass, '');
          },
          5000
        );
      });
  });

  /*
    Generator
  */

  var generate_ipsum = function(explicit) {
    var newElements = document.createDocumentFragment(),
      quotes;

    // Default to cursin'
    // It's what Ryan would have wanted
    if (typeof explicit !== 'boolean') explicit = true;

    if (explicit === true) {
      quotes = quotes_json.vanilla.concat(quotes_json.explicit);
    }
    else {
      quotes = quotes_json.vanilla;
    }

    shuffle(quotes);

    results.innerHTML = '';

    // Output generation
    var ph = input_paragraphs.value;

    var numQuotes = quotes.length;

    for (var i = 0; i < ph; i++) {
      // Paragraph generation
      var string = i == 0 ? 'Hey everybody, it\'s Tuuuuuuuesday! ' : '';
      var max = random(5, 10);
      var q = random(0, numQuotes - 1);

      for (var z = 0; z < max; z += 1, q += 1) {
        if (!quotes[q]) {
          //no quotes at that index?
          //set our counter to a point where
          //we'll get more quotes
          q = random(0, numQuotes - 1);
        }

        string += quotes[q] + ' ';
      }

      var p = document.createElement('p');
      p.innerHTML = string;
      newElements.appendChild(p);
    }

    results.appendChild(newElements);
  }

  /*
    Array shuffler
    Thank you: http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
  */

  function shuffle(array) {
    var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /**
   * Gets a random int in a range
   * @param  {Number} min 
   * @param  {Number} max 
   * @return {Number}
   */
  function random(min, max) {
    return ~~(Math.random() * (max - min + 1) + min);
  }
}(window.quotes_json))