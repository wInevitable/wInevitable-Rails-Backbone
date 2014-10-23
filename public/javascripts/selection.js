$(document).ready(function(event) {
	// enable preview option to forecast pick placement...working on it...
	// track picks and changes to DOM
	var pool, picks, returnToPool, fillPool, findSpace, makeMove;
	pool = $('.pool');
	picks = 0;

	// refill map pool with tiles and remove placeholders
	returnToPool = function(idx, map) {
		var tile = $(map).attr("style", "position: relative")[0];
		$(pool.children()[idx]).remove();

		if (idx < 10) {
			$(pool.children()[idx]).before(tile);
		} else {
			$(pool.children()[idx - 1]).after(tile);
		}
	};

	// fill map pool with empty LIs so maps don't move
	fillPool = function(idx, el) {
		if (el) {
			placeholder = el;
		} else {
			placeholder = document.createElement("li");
			placeholder.className = "placeholder";
		}

		if (idx < 10) {
			$(pool.children()[idx]).before(placeholder);
		} else {
			$(pool.children()[idx - 1]).after(placeholder);
		}
	};

	findSpace = function(destination, origin, map) {
		$('.picks').children().each(function(idx, el) {
			if ($(el).children().length == 0) {
				$(el).append(destination.children()[0]);
				destination.append(map);

				// fill in map pool if drawing from there
				if (origin.hasClass("pool")) { fillPool($(map).data("number"));	}
				return false;
			}
		});
	};

	makeMove = function(el, tile) {
		el.removeChild(el.lastChild);
		el.appendChild(tile.attr("style", "position: relative")[0]);
	};

	// enable map LIs to be dragged on screen
	$('.dragme').draggable({
		containment: ".container",
		zIndex: 100,
		stop: function(event, ui) {
			var destination, map, origin, x, y, position, placeholder;
			map = ui.helper[0];
			origin = $(ui.helper.context.parentElement);
			x = ui.offset.left;
			y = ui.offset.top;
			position = $(map).data("number");

			// logic to determine target destination
			if (x < 440) {
				 if (y < 160 && x < 200) { destination = $('#1'); }
				 else if (y < 240 && x < 200) { destination = $('#2'); }
				 else if (x < 200 || y > 260) { destination = $('#3'); }
				 else if (y < 160) { destination = $('#4'); }
				 else if (y >= 160) { destination = $('#5'); }
			} else if (1590 > x && x > 1300) {
				destination = $('.team-1');
			} else if (x >= 1590) {
				destination = $('.team-2');
			}	else {
				destination = $('.pool');
			}

			// logic to move li to new list if allowed
			// refactor to its own function
			if (destination.hasClass("vetoes") && (destination.children().length < 3)) {
				// veto map
				destination.append(map);
				if (origin.hasClass("pool")) {
					fillPool(position);
				}
			} else if (destination.hasClass("pool") && !origin.hasClass("pool")) {
					// move map tile back to pool & remove placeholder li
					returnToPool(position, map);
			} else if (destination.parent().hasClass("picks")) {
					if (destination.children().length == 0) {
						// if no pick - place it
						destination.append(map);
						if (origin.hasClass("pool")) { fillPool(position); }
					} else if (origin.parent().hasClass("picks")) {
						// if moving between picks - swap them
						origin.append(destination.children()[0]);
						destination.append(map);
					} else {
						// if pick exists and moving from pool or veto -
						// bump existing pick to another slot if available
						// otherwise refute move/do nothing (5 current picks)
						findSpace(destination, $(origin), map);
					}
			} else {
				// do nothing
			}
		},
		// revert drag move - our logic actually makes the switch not "draggable"
		revert: "invalid",
		revertDuration: 0
	});
	$('ul').sortable();
});