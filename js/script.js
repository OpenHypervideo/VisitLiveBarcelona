var lastVideo;
var lastChoiceOverlay;
var choiceTimeout;
var choiceTimeoutCount;

var choiceTimeoutDuration = 4; // Duration in seconds

$(document).ready( function() {

	$('#intro img').click(function(evt) {
		$('#intro').fadeOut(800, function() {
			
			$('.menuBtn').removeClass('active');
			$('#menu').fadeIn(400).children('.menuBtn#backToIntro').addClass('active');
		});
	});

	$('.pin').attr({
		'data-targetsize': '0.75',
		'data-duration': '800'
	}).zoomTarget();

	$('.pin').click(function(evt) {
		//$(this).zoomTo({targetsize:0.75, duration:600});
        //evt.stopPropagation();
		window.setTimeout(function() {
			$('#map').fadeOut(800);
			
			$('#menu').fadeIn(400).children('.menuBtn').addClass('active');
		}, 800);
	});

	$('.menuBtn#backToIntro').click(function(evt) {
		
		$('#intro').fadeIn(800, function() {
			resetVideos();
		});

		$('.zoomContainer').click();
		$('#map').show();

		$('#menu').fadeOut(200);
	});

	$('.menuBtn#backToMap').click(function(evt) {
		
		$('#map').fadeIn(800, function() {
			$('.zoomContainer').click();

			$('.menuBtn').removeClass('active');
			$('#menu').fadeIn(400).children('.menuBtn#backToIntro').addClass('active');

			resetVideos();
		});
	});

	// at the end of each video, resume to the last decision overlay
	$('video').each( function() {
		$(this).get(0).addEventListener('ended', function(e) {
			$('.endOfVideoMessage').hide();
			$('#endOfVideoMessageWrapper').fadeIn(400);

			var perspective = $(e.originalTarget).data('type');
			if (perspective == 'tourist') {
				// show tourist message
				$('.endOfVideoMessage#tourist').show();
			} else {
				// show local message
				$('.endOfVideoMessage#local').show();
			}

			window.setTimeout(function() {
				$('.menuBtn#backToMap').click();
			}, 6000);
		});

		$(this).get(0).addEventListener('play', function(e) {
			var perspective = $(e.originalTarget).data('type')
			$('#videoWrapper').attr('data-perspective', perspective);
		});

		$(this).get(0).addEventListener('pause', function(e) {
			
		});

		$(this).get(0).addEventListener('timeupdate', function(e) {
			var progressBar = $('#progress');
			var percentage = Math.floor((100 / $('video.active')[0].duration) *
			$('video.active')[0].currentTime);
			progressBar.css('width', percentage + '%');
		});

	});

	$('#playBtn').click(function() {
		$('video.active')[0].play();
	});

	$('.choiceOverlay .changePerspective').click(function(evt) {
		
		// stop timeout, as something was chosen
		window.clearInterval(choiceTimeout);
		
		// hide counter, overlays & videos
		$('#choiceOverlayCounter').hide();
		$('.choiceOverlay').hide();
		
		var cityPart = $(lastVideo).data('citypart'),
			perspective = $(lastVideo).data('type'),
			perspectiveTime = lastVideo.currentTime,
			counterPerspective;

		if (perspective == 'tourist') {
			counterPerspective = 'local';
		} else {
			counterPerspective = 'tourist';
		}

		$('video').removeClass('active');

		var newVideo = $('video[data-citypart="'+ cityPart +'"][data-type="'+ counterPerspective +'"]');
		newVideo.addClass('active');

		//find opposite perspective & play
		newVideo[0].currentTime = perspectiveTime;
		newVideo[0].play();

		$('#videoWrapper').attr('data-perspective', counterPerspective);

	});

	// INITIALIZE VIDEOS
	// (every additional video has to be referenced here with a unique ID,
	// based on the ID of the respective video element in index.html)

	var tourist1 = Popcorn('#tourist1');
	var local1 = Popcorn('#local1');

	// show startvideo
	$('#tourist1').addClass('active');


	/*************************************************************************
	* (TIMEBASED) EVENTS FOR TOURIST VIDEO 1
	*************************************************************************/

	tourist1.cue(40, function(evt) {
		showMessage(evt.originalTarget, '#choice1');
	});

	tourist1.cue(114, function(evt) {
		showMessage(evt.originalTarget, '#choice2');
	});

	tourist1.cue(140, function(evt) {
		showMessage(evt.originalTarget, '#choice3');
	});

	/*************************************************************************
	* (TIMEBASED) EVENTS FOR LOCAL VIDEO 1
	*************************************************************************/

	local1.cue(53, function(evt) {
		showMessage(evt.originalTarget, '#choice4');
	});

	local1.cue(96, function(evt) {
		showMessage(evt.originalTarget, '#choice5');
	});

	/*************************************************************************
	* Generic Functions
	*************************************************************************/

	function showMessage(currentVideo, choiceElementID) {
		
		lastVideo = currentVideo;

		currentVideo.pause();
		$('.choiceOverlay'+ choiceElementID).show();

		// After a certain timespan, go back to the video
		// (duration is defined in choiceTimeoutDuration)
		choiceTimeoutCount = choiceTimeoutDuration;
		$('#choiceOverlayCounter').text(choiceTimeoutCount).show();

		choiceTimeout = window.setInterval(function() {
			
			if (choiceTimeoutCount < 0) {
				
				window.clearInterval(choiceTimeout);
				$('#choiceOverlayCounter').hide();
				$('.choiceOverlay'+ choiceElementID).hide();

				currentVideo.play();

			} else {
				
				$('#choiceOverlayCounter').text(choiceTimeoutCount);
				choiceTimeoutCount--;

			}

		}, 1000); // execute every 1 seconds
	}

	function resetVideos() {
		$('#endOfVideoMessageWrapper').hide();
		$('#videoWrapper').attr('data-perspective', '');
		tourist1.pause();
		tourist1.currentTime(0);
		local1.pause();
		local1.currentTime(0);
	}


}); // document ready
