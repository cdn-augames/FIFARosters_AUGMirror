import { CountUp } from './countUp/countUp.min.js';

$(document).ready(function() {
    displayAdBlockMessage();
    var count = 0,
        startBtn = $("#spinnerShuffle"),
        stopBtn = $("#spinnerStop"),
        reloadBtn = $("#reload_btn"),
        casino1 = $("#spinners1"),
        casino2 = $("#spinners2"),
        casino3 = $("#spinners3"),
        winning_card = $("#winning_card");
        
    winning_card.find(".playercard-rating, .playercard-name, .playercard-position, .playercard-nation, .playercard-club, .playercard-picture, .playercard-mid-bar, .playercard-attr").hide();

    var mCasino1 = casino1.slotMachine({
        delay: 500,
        spins: 1,
        randomize() {
            return window.spinner_winner_keys[0];
        },
        onComplete() {
            casino1.addClass('reel_locked');
            enableStopBtn();
            winning_card.find('.playercard-position').fadeIn();
        }
    });

    var mCasino2 = casino2.slotMachine({
        delay: 500,
        spins: 1,
        randomize() {
            return window.spinner_winner_keys[1];
        },
        onComplete() {
            casino2.addClass('reel_locked');
            enableStopBtn();
            winning_card.find('.player').animate({ opacity: 1 }, 500);
            winning_card.find('.card_placeholder').fadeOut();
        }
    });

    var mCasino3 = casino3.slotMachine({
        delay: 500,
        spins: 1,
        randomize() {
            return window.spinner_winner_keys[2];
        },
        onComplete() {
            casino3.addClass('reel_locked');
            animateWinningCard();
            $("#leaderboardLinkContainer").slideDown();
            storePoints();
        }
    });
    
    startBtn.on('click', function() {
        count = 3;
        mCasino1.shuffle(9999);
        mCasino2.shuffle(9999);
        mCasino3.shuffle(9999);
        $(this).hide();
        stopBtn.show();
    });
    
    stopBtn.on('click', function() {
        disableStopBtn();
        switch(count) {
            case 3:
                mCasino1.stop();
                break;
            case 2:
                mCasino2.stop();
                break;
            case 1:
                mCasino3.stop();
                break;
        }
        count--;
    });

    function disableStopBtn() {
        stopBtn.attr("disabled", true).removeClass('btn-danger').addClass('btn-warning');
        stopBtn.text("WAIT");
    }

    function enableStopBtn() {
        stopBtn.attr("disabled", false).addClass('btn-danger').removeClass('btn-warning');
        stopBtn.text("STOP!");
    }

    function animateWinningCard() {
        var countUp = new CountUp('points', window.points, { 'duration': 3 });
        countUp.start();

        winning_card.find('.playercard-nation').fadeIn(500, function () {
            winning_card.find('.playercard-club').delay(500).fadeIn(500, function () {
                winning_card.find('.playercard-rating, .playercard-name, .playercard-picture, .playercard-mid-bar, .playercard-attr').delay(500).fadeIn(500, function () {
                    stopBtn.hide();
                    reloadBtn.show().on("click", function() {
                        window.location.href = window.location.href;
                    });
                });
            });
        });
    }

    function storePoints() {
        $.ajax({
            url: 'utils/saveFutSpinScores.php',
            type: 'post',
            data: {year: window.year},
            success: function(response){
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log(XMLHttpRequest.responseText);
            }
       });
    }

});