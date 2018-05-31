(function () {
	const inputParagraphs = document.getElementById('paragraphs');
	const inputExplicit = document.getElementById('explicit');
	const generateButton = document.getElementById('generate');
	const clipboardButton = document.getElementById('clipboard');
	const results = document.getElementById('results');

	generateButton.addEventListener('click', () => {
		const explicit = inputExplicit.checked;
		generateIpsum(explicit);
	});

	// Setup our clipboard on DOM ready
	document.addEventListener('DOMContentLoaded', () => {
		const defaultButtonText = clipboardButton.textContent;
		let buttonTextTimeout = null;

		clipboardButton.addEventListener('click', event => {
			event.preventDefault();

			if (results.childNodes.length === 0) {
				// No quotes? make them!
				generateIpsum();
			}

			const quoteText = [...results.childNodes].map(p => p.textContent).join('\n');

			copyToClipboard(quoteText);

			clipboardButton.classList.add('button-green');
			clipboardButton.textContent = 'Copied!';

			if (buttonTextTimeout) {
				// If there's another timeout, clear it
				clearTimeout(buttonTextTimeout);
				buttonTextTimeout = null;
			}

			buttonTextTimeout = setTimeout(
				() => {
					clipboardButton.classList.remove('button-green');
					clipboardButton.textContent = defaultButtonText;
				},
				5000
			);
		});
	});

	// Generate random paragraphs and append them to the page
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

	// Copy to clipboard
	// Thank you: https://github.com/sindresorhus/copy-text-to-clipboard/blob/b96e86e94989c560979c782eca9c6e43fe1c4a86/index.js
	function copyToClipboard(input = '') {
		const el = document.createElement('textarea');

		el.value = input;

		// Prevent keyboard from showing on mobile
		el.setAttribute('readonly', '');

		el.style.contain = 'strict';
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		el.style.fontSize = '12pt'; // Prevent zooming on iOS

		const selection = document.getSelection();
		let originalRange = false;
		if (selection.rangeCount > 0) {
			originalRange = selection.getRangeAt(0);
		}

		document.body.appendChild(el);
		el.select();

		// Explicit selection workaround for iOS
		el.selectionStart = 0;
		el.selectionEnd = input.length;

		let success = false;
		try {
			success = document.execCommand('copy');
		} catch (err) {}

		document.body.removeChild(el);

		if (originalRange) {
			selection.removeAllRanges();
			selection.addRange(originalRange);
		}

		return success;
	}
})();
