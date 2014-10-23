$(document).ready(function(event) {
	var classes = ['default', 'denial', 'envy', 'faze', 'mostwanted',
						 		 'noble', 'og', 'on', 'rise', 'off'];

	// initialize team logo variables
	if (!localStorage.getItem('team1')) {
		localStorage.setItem('team1', 'default');
		localStorage.setItem('idx1', 1);
	}
	if (!localStorage.getItem('team2')) {
		localStorage.setItem('team2', 'default');
		localStorage.setItem('idx2', 1);
	}

	// set team logo appropriately
	$('#1.team-logo').addClass(localStorage.getItem('team1'));
	$('#2.team-logo').addClass(localStorage.getItem('team2'));

	$('.team-logo').click(function(event) {
		event.preventDefault();
		var col, idx, classToAdd, changeClass;
		col = $(this);
		col.removeClass();

		if (col.data("number") == 1) {
			idx = parseInt(localStorage.getItem('idx1'));
			classToAdd = classes[idx];
			col.addClass("team-logo " + classToAdd);
			localStorage.setItem('idx1', (idx + 1) % classes.length);
			localStorage.setItem('team1', classToAdd);
		} else {
			idx = parseInt(localStorage.getItem('idx2'));
			classToAdd = classes[idx];
			col.addClass("team-logo team-logo2 " + classToAdd);
			localStorage.setItem('idx2', (idx + 1) % classes.length);
			localStorage.setItem('team2', classToAdd);
		}
	});
});