function displayNextQ() {
	var selector = (
				'.dayblock#'+day + 
				" [data-qblock=" + qblock + "]" + 
				" [data-qid=" + qid + "]");

	$(selector).show();
}

function advanceQ() {
	if(window.qid < 2) {
			window.qid += 1;
			displayNextQ(window.day, window.qblock, window.qid);
		} else {
			revealFullQ(window.day, window.qblock);
	}
}

function setScore(score) {
	$("#score").text(score);
}

function addToScore(points) {
	window.score += points;
	setScore(window.score);
}

function displayNextQblock() {
	var selector = ".dayblock#" + window.day + " .questionblock[data-qblock="+ window.qblock + "]"
	$(selector).show();
	$("#controls-box").show().insertAfter(selector);

	displayNextQ(window.day, window.qblock, window.qid);
}

function revealFullQ() {
	var qblock = $(".dayblock#"+window.day + ' .questionblock[data-qblock='+window.qblock+']');
	qblock.find('.question').show();
	qblock.find('.percent').show();
	qblock.find('.answerblock').show();

	if(window.qblock < 4) {

		window.qblock += 1;
		window.qid = 0;
		displayNextQblock();
	}
}

function match(guess, actual) {
	var actualClean = actual.toUpperCase().trim().replace(/[^\w\s]/gi, '');
	var guessClean = guess.toUpperCase().trim().replace(/[^\w\s]/gi, '');

	var actualArray = actualClean.split(" ");

	if(guessClean == actualClean || 
		guessClean == actualArray[actualArray.length - 1] ||
		guessClean + "S" == actualClean ||
		guessClean == actualClean + "S") {
		return true;
	}

	return false;
}

$(function() {
	window.qid = 0;

	$('a#next').click(function(e) {
		e.preventDefault();

		$("#correct-box").css('visibility', 'hidden');

		advanceQ();
	});

	$('a#submit-button').click(function(e) {
		e.preventDefault();

		var qblock = $(".dayblock#"+window.day + ' .questionblock[data-qblock='+window.qblock+']');

		var guess = $("input#guess").val();
		console.log($("input#guess"));
		var actual = qblock.find(".answer").text();

		$("input#guess").val("");

		if(match(guess, actual)) {
			var pointsAdded = 3 - window.qid;

			addToScore(pointsAdded);
			
			qblock.find(".awarded span").text(pointsAdded);

			$("#correct-box").css('visibility', 'visible');
			qblock.find(".question[data-qid=" + window.qid + "]").addClass("answered");

			revealFullQ();	
		} else {
			advanceQ();
			$("#correct-box").css('visibility', 'hidden');
		}
	});

	$('.day-label a').click(function(e) {
		e.preventDefault();

		$(".dayblock").hide();
		
		var date = $(e.target).attr('data-date');

		var dayblock = $(".dayblock#"+date);
		dayblock.toggle();

		window.day = date;
		window.score = 0;
		setScore(window.score);
		window.qblock = 0;
		window.qid = 0;

		displayNextQblock();
	});
});