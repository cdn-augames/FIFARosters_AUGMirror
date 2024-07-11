/*
    Animation Details

    Stadium background (dark)
    UT badge rotating right to left
        - size: slightly touching top and bottom of screen
        - U and T fly off, triangled pieces of badge fly off to reveal bright gold (card color?) underneath
        - flag fades in as last triangles fly off
    New badge shown rotating left to right (less rotation)
        - same size as last
        - trianlges flying off
        - position fades in
        - stadium search lights start shining
    New badge shown, fairly centered, not much rotation
        - same size as last
        - triangles flying off
        - club fades in
        - stadium lights - bulb lines - getting brighter
        - some etching lights trace around the badge
    Card shows, big, centered
        - bright light beams from behind card
        - light boards to sides, blank, card color bg
        - can see some other boards
        - perspective moving back away from the scene
        * If NOT double walkout >
            - First card is blank
            - flag, league, club at bottom fade in and to the center
            - name area bubbles
            - rating starts ticking up
            - Player image fades in & light boards info fades in
            - Name fades in
        * If double walkout >
            Card rotates at medium speed to reveal other player
                - rating is ticking up
                - player info & picture is fading in
                - attributes fade in and slide down a bit
            Light board info slides toward middle to reveal second player info
    Light boards fade in rating, club, flag at the same time
    



    
*/

function runSparks(id, colors, type) {
    if (typeof colors == 'undefined') {
        colors = ['#EF7555'];
    }

    let confetti_base = {
        particleCount: 3,
        angle: 90,
        spread: 15,
        origin: { x: .5, y: 1 },
        colors: colors,
        decay: 0.97
    };
    
    let confetti_small = {
        particleCount: 8,
        scalar: 0.3,
        startVelocity: 15,
        ticks: 50,
        shapes: ['circle']
    };

    let confetti_args = confetti_base;

    if (typeof type !== 'undefined' && type == 'small') {
        confetti_args = {
            ...confetti_base,
            ...confetti_small
        }
    }

    var canvas = document.getElementById(id);

    // you should  only initialize a canvas once, so save this function
    // we'll save it to the canvas itself for the purpose of this demo
    canvas.confetti = canvas.confetti || confetti.create(canvas, { resize: true });
    
    var end = Date.now() + (1 * 1000);
    
    (function frame() {
        canvas.confetti(confetti_args);
    
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

$(document).on('ready', function() {

    $(".pack_contents").hide();
    
    displayAdBlockMessage();

    var tl = new TimelineMax();

    if (window.constants.DEBUG_MODE) {
        var debug = true;
    } else {
        var debug = false;
    }
    
    if (debug) {
        var play_btn = $('<button id="play">Play</button>');
        var slider = $('<div id="sliderWrapper"><div id="slider"></div></div>');
        var controls = $('<div id="animationControls" style="padding: 10px; width: 100%; height: 50px; position: fixed; bottom: 0; z-index: 9999;"></div>');
        
        $(controls).append(play_btn).append(slider);
        
        $("body").append(controls);
    
        /* TIMELINE CONTROLS */
        tl.eventCallback("onUpdate", updateSlider);
    
        $("#slider").slider({
          range: false,
          min: 0,
          max: 100,
          step:.1,
          slide: function ( event, ui ) {
            tl.pause();
            //adjust the timeline's progress() based on slider value
            tl.progress( ui.value/100 );
            }
        });
        
        function updateSlider() {
            $("#slider").slider("value", tl.progress() *100);
        }
        
        $("#play").click(function() {
            tl.play();
        }); 	
    
        tl.progress(1);
        /* END OF TIMELINE CONTROLS */
    }

    let top_card = $(".top_card");

    // Set correct size of top card
    var available_ht = top_card.height();
    var starting_ht = top_card.find(".player").height();
    var scale_factor = (available_ht/starting_ht);
    var scale_factor_x = top_card.width()/top_card.find(".player").width();
    var translateX = (Math.abs(1-scale_factor_x)/4)*-100;
    top_card.find(".player").css({
        transform: "scale(" + scale_factor + ") translate(" + translateX + "%, 1%)"
    });

    if (window.top_card.rating < 86) {
        $("#fireworks_container").remove();
    }
    
    /*
    $(".top_card .player .playercard, .board, .light-board").css({
        filter: "brightness(25%)"
    });
    */
    
    top_card.find(".playercard-name").css({
        transform: "translateY(-10%)"
    });

    top_card.find(".playercard-attr").css({
        transform: "translateY(-40%)"
    });

    top_card.find(".playercard-position, .playercard-chemistry, .playercard-fifarosters").css({
        transform: "translateX(-50%)"
    });
    
    var fade_in_items = ".playercard-rating, .playercard-position, .playercard-nation, .playercard-club, .playercard-league, .playercard-name, .playercard-picture, .playercard-attr, .playercard-chemistry, .playercard-fifarosters";
    
    top_card.find(fade_in_items).css({
        opacity: 0
    });
    $(".reveal_badge img, .reveal_badge .text, .light-board, .board, .top_card").css({
        opacity: 0
    });
    
    // Set colors based on top card
    var themeBgColor = card_pack_colors[window.top_card["color"]]["card"];
    var themeTextColor = card_pack_colors[window.top_card["color"]]["text"];
    
    $(".board, .light-board, .reveal_badge").css({
        "background-color": themeBgColor,
        "color": themeTextColor
    });

    tl.to($(".mask_overlay"), 1, { opacity: 0.8 }, 0);

    tl.to($(".reveal_nation"), .5, {
        left: "40%",
        transform: "scale(1)",
        ease: "circ.out"
    }, 0).add("revealNationIn");
    tl.to($(".reveal_nation"), 1.5, {
        left: "30%",
        transform: "rotateY(-18deg)",
        backgroundColor: "#eaeaea"
    }, "revealNationIn");
    tl.to($(".reveal_nation img"), .5, {
        opacity: 1
    }, "revealNationIn+=.5");
    tl.to($(".reveal_nation"), .25, {
        left: "-40%",
        opacity: 0,
        ease: "circ.out"
    }).add("revealBadgesDone");

    tl.to($(".reveal_position"), .5, {
        left: "40%",
        transform: "scale(1)",
        ease: "circ.out"
    }).add("revealPositionIn");
    tl.to($(".reveal_position"), 1.5, {
        left: "30%",
        transform: "rotateY(-18deg)",
        backgroundColor: "#eaeaea"
    }, "revealPositionIn");
    tl.to($(".reveal_position .text"), .5, {
        opacity: 1
    }, "revealPositionIn+=.5");
    tl.to($(".reveal_position"), .25, {
        left: "-40%",
        opacity: 0,
        ease: "circ.out"
    }).add("revealPositionDone");

    tl.to($(".reveal_club"), .5, {
        left: "40%",
        transform: "scale(1)",
        ease: "circ.out"
    }).add("revealClubIn");
    tl.to($(".reveal_club"), 1.5, {
        left: "30%",
        transform: "rotateY(-18deg)",
        backgroundColor: "#eaeaea"
    }, "revealClubIn");
    tl.to($(".reveal_club img"), .5, {
        opacity: 1
    }, "revealClubIn+=.5");
    tl.to($(".reveal_club"), .25, {
        left: "-40%",
        opacity: 0,
        ease: "circ.out"
    }).add("revealBadgesDone");

    tl.to($(".mask_overlay"), .25, { opacity: 0 }, "revealBadgesDone").add("maskOff");
    tl.to($(".light-board, .board, .top_card"), .25, { opacity: 1 }, "revealBadgesDone");
            
    tl.to($(".stadium"), 4, { transform: "scale(1)" }, "maskOff-=.05");
    //tl.to($(".stadium"), 5, { scale: 1.5 }, "club-out");
    
    if (window.top_card.rating >= 86) {
        tl.call(runSparks, ["fire_1"], null, "maskOff");
        tl.call(runSparks, ["fire_2"], null, "maskOff");
        tl.call(runSparks, ["fire_3"], null, "maskOff+=.5");
        tl.call(runSparks, ["fire_4"], null, "maskOff+=.5");
        tl.call(runSparks, ["fire_5"], null, "maskOff+=1");
        tl.call(runSparks, ["fire_6"], null, "maskOff+=1");
    } else if (window.top_card.rating >= 83) {
        tl.call(runSparks, ["fire_5"], null, "maskOff");
        tl.call(runSparks, ["fire_6"], null, "maskOff");
    } else {
        // check if rare
        if ($.inArray(window.top_card.color, [ "rare_bronze", "rare_silver", "rare_gold" ]) > -1) {
            tl.call(runSparks, ["fire_1", [ themeBgColor ], "small" ], null, "maskOff");
            tl.call(runSparks, ["fire_2", [ themeBgColor ], "small" ], null, "maskOff");
            tl.call(runSparks, ["fire_3", [ themeBgColor ], "small" ], null, "maskOff+=.5");
            tl.call(runSparks, ["fire_4", [ themeBgColor ], "small" ], null, "maskOff+=.5");
            tl.call(runSparks, ["fire_5", [ themeBgColor ], "small" ], null, "maskOff+=1");
            tl.call(runSparks, ["fire_6", [ themeBgColor ], "small" ], null, "maskOff+=1");
        } else {
            tl.call(runSparks, ["fire_5", [ themeBgColor ], "small" ], null, "maskOff");
            tl.call(runSparks, ["fire_6", [ themeBgColor ], "small" ], null, "maskOff");
        }
    }
    
    //tl.to($(".light-board"), .5, { filter: "brightness(100%)" }, "maskOff");
    
    //tl.to($(".board"), .5, { filter: "brightness(100%)" }, "maskOff+=.35").add("boardsLit");
    //tl.to(top_card.find(".player .playercard"), .5, { filter: "brightness(100%)" }, "maskOff+=.6").add("cardLit");
    
    tl.from(top_card.find(".playercard-rating"), 4, {
        textContent: 0,
        ease: "circ.out",
        roundProps: {
            textContent: 1
        }
    }, "maskOff+=.25").add("ratingDone");

    tl.to($(".playercard-rating, .playercard-nation, .playercard-league, .playercard-club"), 1, { opacity: 1 }, "maskOff+=.25").add("cardLit");

    tl.to($(".board .nation, .board .board-position, .board .club"), .5, { opacity: 1 }, "maskOff+=.75");

    tl.to(top_card.find(".playercard-picture"), .75, { opacity: 1 }, "maskOff+=.25").add("faceIn");

    tl.to($(".playercard-position"), .75, { opacity: 1, transform: "translate(0)" }, "maskOff+=.25")
    tl.to($(".playercard-chemistry"), .75, { opacity: 1, transform: "translate(0)" }, "maskOff+=.75");
    tl.to($(".playercard-fifarosters"), .75, { opacity: 1, transform: "translate(0)" }, "maskOff+=1");

    tl.to(top_card.find(".playercard-attr1"), 1, { opacity: 1, transform: "translate(0)" }, "maskOff+=.25");
    tl.to(top_card.find(".playercard-attr2"), 1, { opacity: 1, transform: "translate(0)" }, "maskOff+=.29");
    tl.to(top_card.find(".playercard-attr3"), 1, { opacity: 1, transform: "translate(0)" }, "maskOff+=.33");
    tl.to(top_card.find(".playercard-attr4"), 1, { opacity: 1, transform: "translate(0)" }, "maskOff+=.37");
    tl.to(top_card.find(".playercard-attr5"), 1, { opacity: 1, transform: "translate(0)" }, "maskOff+=.41");
    tl.to(top_card.find(".playercard-attr6"), 1, { opacity: 1, transform: "translate(0)" }, "maskOff+=.45").add("statsDone");

    tl.to(top_card.find(".playercard-name"), .5, { opacity: 1, transform: "translate(0)" }, "maskOff+=.45");
    
    //tl.to($(".light-board-left .board-text, .light-board-right .board-text"), 0, { transform: 'translateY(0%)' }, "statsDone+=1");
    
    if (window.top_card.rating >= 86) {
        tl.call(runSparks, ["fire_1"], null);
        tl.call(runSparks, ["fire_2"], null);
        tl.call(runSparks, ["fire_3"], null, "+=.5");
        tl.call(runSparks, ["fire_4"], null, "+=.5");
        tl.call(runSparks, ["fire_5"], null, "+=1");
        tl.call(runSparks, ["fire_6"], null, "+=1");
    } else if (window.top_card.rating >= 83) {
        tl.call(runSparks, ["fire_5"], null);
        tl.call(runSparks, ["fire_6"], null);
    } else {
        // check if rare
        if ($.inArray(window.top_card.color, [ "rare_bronze", "rare_silver", "rare_gold" ]) > -1) {
            tl.call(runSparks, ["fire_1", [ themeBgColor ], "small" ], null);
            tl.call(runSparks, ["fire_2", [ themeBgColor ], "small" ], null);
            tl.call(runSparks, ["fire_3", [ themeBgColor ], "small" ], null, "+=.5");
            tl.call(runSparks, ["fire_4", [ themeBgColor ], "small" ], null, "+=.5");
            tl.call(runSparks, ["fire_5", [ themeBgColor ], "small" ], null, "+=1");
            tl.call(runSparks, ["fire_6", [ themeBgColor ], "small" ], null, "+=1");
        } else {
            tl.call(runSparks, ["fire_5", [ themeBgColor ], "small" ], null);
            tl.call(runSparks, ["fire_6", [ themeBgColor ], "small" ], null);
        }
    }

    tl.to($(".mask .instructions"), 1, {opacity:1});
    
    $(".mask, .outer-mask").on("click", function() {
        $(".outer-mask").fadeOut("fast", function() {
            $(".pack_contents").css("opacity", 1).fadeIn("fast");
            if (document.getElementById("venatus-ad-manager") == null) {
                var element = document.createElement('script');
                element.id = "venatus-ad-manager";
                element.src = 'https://hb.vntsm.com/v3/live/ad-manager.min.js';
                element.type = 'text/javascript';
                element.setAttribute('data-site-id', '5c5ac57146e0fb0001acdeb4');
                element.setAttribute('data-mode', 'scan');
                document.head.appendChild(element);
            }
        });
    });
    
});