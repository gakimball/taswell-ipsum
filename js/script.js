(function(quotes_json){
  /*
    Form elements
  */

  var input_paragraphs = document.getElementById('paragraphs');
  var generate_button = document.getElementById('generate');
  var results = document.getElementById('results');

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
        quotes = [],
        numParagraphs = input_paragraphs.value,
        numQuotes = quotes.length;

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

    // Iterator for number of paragraphs
    for (var i = 0, q = 0; i < numParagraphs; i++) {
      var string = i == 0 ? 'Hey everybody, it\'s Tuuuuuuuesday! ' : '';
      var max = 10;

      // Iterator for number of sentences in a paragraph
      for (var j = 0; j < max; j++, q++) {
        if (!quotes[q]) {
          // When we run out of quotes, shuffle the array again and start over
          shuffle(quotes);
          q = 0;
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