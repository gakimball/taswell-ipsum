(function(){

	/*
		Quotes request
	*/

	var json_request = new XMLHttpRequest();

	json_request.open('get', 'js/quotes.json', true);
	json_request.onreadystatechange = function() {
		if (json_request.readyState == 4 && json_request.status == 200) {
			window.quotes_json = JSON.parse(json_request.responseText);
			generate_ipsum();
		}
	}
	json_request.send();

	/*
		Form elements
	*/

	var input_paragraphs = document.getElementById('paragraphs');
	var input_ptags = document.getElementById('ptags');
	var generate_button = document.getElementById('generate');
	var results = document.getElementById('results');

	generate_button.addEventListener('click', function(){
		generate_ipsum(true)
	});

	/*
		Generator
	*/

	var generate_ipsum = function(explicit) {
		// Default to cursin'
		// It's what Ryan would have wanted
		if (typeof explicit !== 'boolean') explicit = true;

		if (explicit === true) {
			var quotes = window.quotes_json.vanilla.concat(window.quotes_json.explicit);
		}
		else {
			var quotes = window.quotes_json.vanilla;
		}
		shuffle(quotes);

		// Output generation
		var ph = 5;
		for (var i = 0; i < ph; i++) {
			// Paragraph generation
			var string = i == 0 ? 'Hey everybody, it\'s Tuuuuuuuesday! ' : '';
			var q = i * 10;
			var max = q + 10;
			while (q < max) {
				string += quotes[q] + ' ';
				q++;
			}

			string = '<p>' + string + '</p>';

			var p = document.createElement('p');
			p.textContent = string;
			results.appendChild(p);
		}
		console.log(results);
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

}())