$(document).on("ready", function() {
    clickable = false;
    $(".start-btn").on("click", function() {
        $(this).remove();
        $(".flip-card.semi-transparent").removeClass("semi-transparent");
        clickable = true;
        startTimer();
    });
    $(".flip-card").on("click", function() {
        let $this = $(this);
        if (!clickable || $this.hasClass("empty_slot")) {
            return;
        }
        if ($this.hasClass("flipped")) {
            return;
        } else {
            $this.addClass("flipped");
            let player_idx = $this.attr("data-mid");
            let last_set = false;
            flipped_cards.push(memory_cards[player_idx]);
            if (flipped_cards.length > 1) {
                clickable = false;

                // This is the last set, stop timer on final click
                if (matched_cards.length == (memory_cards.length - 2)) {
                    last_set = true;
                    stopTimer();
                    finished();
                }

                // flipped cards match
                if (flipped_cards[0] === flipped_cards[1]) {
                    matched_cards.push(flipped_cards[0], flipped_cards[1]);
                    setTimeout(function() { cardsMatch(last_set) }, 400);
                } else {
                    setTimeout(flipOverAll, 1250);
                }
            }
        }
    });
});
function startTimer() {
    // TO DO: Cheat protection - Insert game start time in db
    
    // On successful start time insert, start on-screen timer
    var a = document.getElementById("game_timer");
    window.aTimer = new Stopwatch(a, { suffix: "s" });
    aTimer.start();
}
function stopTimer() {
    aTimer.stop();

    // TO DO: Insert game stop time in db
}
function finished() {
    let finished_text = $("<div>");
    finished_text.addClass("finished-text");
    let finished_time = $("#game_timer span").first().text();
    let play_again_btn = $("<button />");
    play_again_btn.attr({
        type: "button"
    });
    play_again_btn.addClass("btn btn-primary btn-lg");
    play_again_btn.html("Play Again!");
    play_again_btn.on("click", function() {
        location.reload();
    });
    finished_text.html("You finished " + sets + " sets in<br>" + finished_time + " seconds!<br>");
    finished_text.append(play_again_btn);
    $("#game_area").append(finished_text);
    
    clickable = false;
    $(".flip-card").addClass("flipped").animate({ "opacity": 1 }, 250);
    
    // Confetti Effect
    var end = Date.now() + (15 * 1000);
    
    // go Buckeyes!
    var colors = ['#337ab7', '#ffffff', '#F6C900'];
    
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 65,
        origin: { y: 0.75, x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 65,
        origin: { y: 0.75, x: 1 },
        colors: colors
      });
    
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
}
function flipOverAll() {
    $(".flipped").removeClass("flipped");
    flipped_cards = [];
    setTimeout((function() { clickable = true; }), 0);
}
function cardsMatch(last_set) {
    var last_set = (typeof last_set === 'undefined') ? false : last_set;
    let flipped = $(".flipped");
    flipped.addClass("empty_slot");
    
    // If not last set, fade out match and reset
    if (!last_set) {
        flipped.animate({
            "opacity": 0
            }, 500, function() {
                //flipped.find(".flip-card-inner").remove();
                flipOverAll();
            });
    }
}