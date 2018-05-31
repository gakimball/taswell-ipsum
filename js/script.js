/* global ZeroClipboard */

(function () {
	const inputParagraphs = document.getElementById('paragraphs');
	const inputExplicit = document.getElementById('explicit');
	const generateButton = document.getElementById('generate');
	const results = document.getElementById('results');

	generateButton.addEventListener('click', () => {
		const explicit = inputExplicit.checked;
		generateIpsum(explicit);
	});

	ZeroClipboard.setDefaults({
		moviePath: 'js/zero-clipboard/ZeroClipboard.swf',
		allowScriptAccess: 'always',
		hoverClass: 'button-hover'
	});

	// Setup our clipboard on DOM ready
	document.addEventListener('DOMContentLoaded', () => {
		const clipboardButton = document.getElementById('clipboard');
		const clipboard = new ZeroClipboard(clipboardButton, {
			hoverClass: 'button-hover'
		});
		let previousTimeout;

		clipboardButton.textContent = clipboardButton.dataset.normal;

		clipboard.on('mousedown', () => {
			if (results.childNodes.length === 0) {
				// No quotes? make them!
				generateIpsum();
			}

			// Set the text on the clipboard
			clipboard.setText(results.innerHTML);

			clipboardButton.textContent = clipboardButton.dataset.onCopied;

			if (clipboardButton.className.indexOf(clipboardButton.dataset.onCopiedClass) === -1) {
				// Only add the hover class if it doesn't exist already
				clipboardButton.className += ' ' + clipboardButton.dataset.onCopiedClass;
			}

			if (previousTimeout) {
				// If there's another timeout, try clearing it
				clearTimeout(previousTimeout);
			}

			previousTimeout = setTimeout(
				() => {
					// Make the button look normal again
					clipboardButton.textContent = clipboardButton.dataset.normal;
					clipboardButton.className = clipboardButton.className.replace(clipboardButton.dataset.onCopiedClass, '');
				},
				5000
			);
		});
	});

	function generateIpsum(explicit = true) {
		const quoteList = window.__TASWELL_QUOTES__;
		const newElements = document.createDocumentFragment();
		const quotes = quoteList.vanilla.concat(explicit ? quoteList.explicit : []);
		const numParagraphs = inputParagraphs.value;
		const numSentences = 10;

		shuffle(quotes);
		results.innerHTML = '';

		// Iterator for number of paragraphs
		for (let i = 0, q = 0; i < numParagraphs; i++) {
			let string = i === 0 ? 'Hey everybody, it\'s Tuuuuuuuesday! ' : '';

			// Iterator for number of sentences in a paragraph
			for (let j = 0; j < numSentences; j++, q++) {
				if (!quotes[q]) {
					// When we run out of quotes, shuffle the array again and start over
					shuffle(quotes);
					q = 0;
				}

				string += quotes[q] + ' ';
			}

			const p = document.createElement('p');
			p.innerHTML = string;
			newElements.appendChild(p);
		}

		results.appendChild(newElements);
	}

	// Array shuffler
	// Thank you: http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
	function shuffle(array) {
		let currentIndex = array.length;
		let temporaryValue;
		let randomIndex;

		// While there remain elements to shuffle...
		while (currentIndex !== 0) {
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
})();
