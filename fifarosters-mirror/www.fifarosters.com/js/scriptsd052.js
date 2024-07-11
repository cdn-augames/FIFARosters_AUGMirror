var is_mobile = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	is_mobile = true;
}

/* //// Polyfills //// */
Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' && 
    isFinite(value) && 
    Math.floor(value) === value;
};

function AdBlockEnabled() {
    var ad = document.createElement('ins');
    ad.className = 'AdSense';
    ad.style.display = 'block';
    ad.style.position = 'absolute';
    ad.style.top = '-1px';
    ad.style.height = '1px';
    document.body.appendChild(ad);
    var isAdBlockEnabled = !ad.clientHeight;
    document.body.removeChild(ad);
    return isAdBlockEnabled;
}

function displayAdBlockMessage() {
    var adBlock = AdBlockEnabled();
    if (adBlock) {
        /*
        var site_support_msg = '<h2 style="margin-top: 0;">Ads are dumb...</h2><p>... but it is how we cover the costs involved with running this site.</p><p>Please turn off your ad blocker and help support us making a better site for you.</p>';
        var site_support_modal = '<div class="modal fade" id="site_support_modal" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h4 class="modal-title">Please Support FifaRosters</h4></div><div class="modal-body"><div class="row"><div class="col-xs-12">' + site_support_msg + '</div></div></div></div></div></div>';
        var site_support = $(site_support_modal);
        $("body").append(site_support);
        $("#site_support_modal").modal("show");
        */
        $.toast({
            text: "Ads are the only way we cover costs on the site. Support us by turning off your AdBlocker or whitelisting our site.", // Text that is to be shown in the toast
            heading: 'Please Turn Off AdBlock', // Optional heading to be shown on the toast
            
            showHideTransition: 'fade', // fade, slide or plain
            allowToastClose: true, // Boolean value true or false
            hideAfter: false, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
            stack: 5, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'top-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            
            bgColor: '#850000',  // Background color of the toast
            textColor: '#ffffff',  // Text color of the toast
            textAlign: 'left',  // Text alignment i.e. left, right or center
            loader: true,  // Whether to show loader or not. True by default
            loaderBg: '#9EC600',  // Background color of the toast loader
            beforeShow: function () {}, // will be triggered before the toast is shown
            afterShown: function () {}, // will be triggered after the toat has been shown
            beforeHide: function () {}, // will be triggered before the toast gets hidden
            afterHidden: function () {}  // will be triggered after the toast has been hidden
        });
    }
}

$(function() {
	$("#ratingstable").tablesorter({
		sortInitialOrder: 'desc',
		sortList: [[3,1]]
	});
	$("#statstable").tablesorter({
		sortInitialOrder: 'desc',
		sortList: [[3,1]]
	});
	$("#userstable").tablesorter({
		sortInitialOrder: 'desc',
		sortList: [[3,1]]
	});
	$("#gemstable").tablesorter({
		sortInitialOrder: 'desc',
		sortList: [[7,1]]
	});
	$("#ratingstable, #statstable, #userstable, #gemstable").bind("sortEnd", function() {
		$table = $(this);
		$(this).find("tr td").removeClass("highlight");
		$(this).find("th.headerSortUp, th.headerSortDown").each(function() {
			$table.find("tr td:nth-child("+($(this).index()+1)+")").addClass("highlight");
		});
	});
	$(".showStats").on("click", function(e) {
		e.preventDefault();
		$(this).closest(".row").next(".well").toggle();
	});
	$("form#team-form").on("submit", function(e) {
		//e.preventDefault();
		/*
		var team = {};
		var rostertotal = $("#roster > li").length;
		$("#roster > li").each(function(rosterindex) {
			$roster_id = $(this).attr("id");
			$roster_i = parseInt($roster_id.replace("roster-", ""));
			team[$roster_i] = {};
			teamarray = "{";
			var inputtotal = $(this).find("input, select").length;
			$(this).find("input, select").each(function(inputindex) {
				var id = $(this).attr("id");
				var name = $(this).attr("name");
				var value = (!$(this).val()?0:$(this).val());
				team[$roster_i][id] = value;
				teamarray += "\"" + id + "\": \"" + value + "\"";
				if(inputindex != inputtotal - 1) {
					teamarray += ", ";
				}
			});
			if(rosterindex != rostertotal - 1) {
				teamarray += ", ";
			}
			teamarray += "}";
			//console.log("fifarosters_p"+rosterindex+" = "+teamarray);
		});
		console.log("teamarray = " + teamarray);
		console.log(team);
		$.ajax({
			url: "saveteam.php",
			type: "POST",
			processData: false,
			contentType: "application/json",
			data: team,
			success: function(data) {
				console.log("Success:");
				console.log(data);
			}
		});
		//location.reload();
		*/
	});
	$("#team_roster #edit_team_info_btn").on("click", function(e) {
		e.preventDefault();
		$("#edit_team_container").slideToggle("fast");
	});
	$("form#team-form input, form#player-form input").on("focus", function() {
		if (is_mobile) {
			this.setSelectionRange(0,999);
		} else {
			this.select();
		}
	});
	/*
	// MOVE TO NEXT INPUT AFTER
	.on("keyup", function(e) {
		var thisinput = $(this);
		var key = (e.which ? e.which : e.keyCode);
		if(key > 31 && (key < 48 || key > 57)) {
			if(thisinput.attr("maxlength") && (thisinput.val().length == thisinput.attr("maxlength"))) {
				var inputs = thisinput.closest("form").find("input, select");
				if (is_mobile) {
					inputs.eq( inputs.index(thisinput)+ 1 ).setSelectionRange(0, 999);
				} else {
					inputs.eq( inputs.index(thisinput)+ 1 ).select();
				}
			}
		}
	});
	*/
	$(".playerid_info").popover();
	$(".newchanges_info").popover();
	$("#reportbug_btn, #suggestion_btn, #reportbug_btn2, .contact_btn").click(function() {
		$("#reportbug").modal('show');
	});
	$("#trlogin_btn").click(function() {
		$("#login").modal("hide");
	});
	$(".chart_bar").tooltip();
	$("[data-toggle='tooltip']").tooltip();
	
	$(".-show-edit-player-form").on("click", function(e) {
		e.preventDefault();
		var btn_text = $(this).html();
		if(btn_text.indexOf("Edit") > -1) {
			$(this).html(btn_text.replace("Edit Player", "Hide Form"));
			$(this).find(".caret").addClass("caret-up");
		} else {
			$(this).html(btn_text.replace("Hide Form", "Edit Player"));
			$(this).find(".caret").removeClass("caret-up");
		}
		$("#edit-player-form").slideToggle("fast");
	});
	
	$(".addtooltip").tooltip();
	
	$(".squad_header .header").tooltip({
		container: 'body'
	});
	
	$(".compare-table .-toggle-compare-section").on("click", function() {
		var section = $(this).attr("data-section");
		$(".section_" + section).toggle(1);
	});
	
	$("#player_compare_form select").on("change", function() {
		var p1 = $("#player_compare_form select").eq(0).val();
		var p2 = $("#player_compare_form select").eq(1).val();
		var p3 = $("#player_compare_form select").eq(2).val();
		window.location = "compare?p1=" + p1 + "&p2=" + p2 + "&p3=" + p3;
	});
	
	$("#fullwidthstats-btn").on("click", function() {
		var statstable = $("#statstable");
		if (statstable.attr("data-fullwidth") != 1) {
			var statsoffset = statstable.offset();
			var statsx = statsoffset.left;
			var statsy = statsoffset.top;
			statstable.css({
				"margin-left" : (10-statsx),
				"width" : ($("body").outerWidth()-20)
			});
			statstable.attr("data-fullwidth", 1);
		} else {
			statstable.removeAttr("style");
			statstable.attr("data-fullwidth", 0);
		}
	});
	
	$("#clear_errors").on("click", function() {
		$.ajax({
			url: "clear_errors.php"
		});
	});

	$('#playerSections .nav-tabs > li > a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
	
	$("#usheight").on("keyup", function (e) {
		validateHt($(this));
		var metricht = Math.round(convertHtToMetric($(this).val()));
		$("#height").val(metricht);
	});
	
	$("#usweight").on("keyup", function (e) {
		var metricwt = Math.round(convertWtToMetric($(this).val()));
		$("#weight").val(metricwt);
	});
	
	$("input[name='player[0][measurements]']").on("change", function() {
		setMeasurementsDisplay($(this).val());
	});

    // Setup Vote listeners
    $(document).on("click", ".vote-widget button", function() {
    	var curButton = $(this),
    	    curWidget = curButton.parent();
    	if (curWidget.attr("logged-in") == "true" && curWidget.attr("vote-status") !== "closed") {
        	var curClass = '',
        	    otherClass = '',
        	    voteVal = 0,
                owner = curWidget.attr("data-oid"),
                record = curWidget.attr("data-rid"),
                table = curWidget.attr("data-t"),
                buttons = curWidget.find("button"),
                upvote_btn = curWidget.find("button.upvote"),
                downvote_btn = curWidget.find("button.downvote"),
                votesNum = curWidget.find(".votes"),
                currentVotes = parseInt(votesNum.html()),
                initialVotesTotal = parseInt(curWidget.attr("data-orig-vote")),
                userCurrentVote = 0;
            
            buttons.prop('disabled', true);
            
            // Store and undo existing vote
            if (curWidget.find(".active_vote").length > 0) {
                if (curWidget.find(".active_vote").hasClass("upvote")) {
                    userCurrentVote = 1;
                } else if (curWidget.find(".active_vote").hasClass("downvote")) {
                    userCurrentVote = -1;
                }
                buttons.removeClass("active_vote inactive_vote");
                currentVotes-=userCurrentVote;
            }
            
        	if (curButton.hasClass("upvote")) {
        		curClass = "upvote";
        		otherClass = "downvote";
        		voteVal = 1;
        	}
        	if (curButton.hasClass("downvote")) {
        		curClass = "downvote";
        		otherClass = "upvote";
        		voteVal = -1;
        	}
        	
        	// User clicked different vote, set new vote
            if (userCurrentVote !== voteVal) {
                // change the active state
                curButton.addClass("active_vote").removeClass("inactive_vote");
                
                // muted class for other button
                curWidget.find("." + otherClass).addClass("inactive_vote").removeClass("active_vote");
                
                // Update vote number
                currentVotes+=voteVal;
            }

            votesNum.html(currentVotes);
        
            // Send vote ajax
        	$.ajax({
        		url: "utils/setVotes.php",
        		type: "POST",
        		data: {
                        "record": record,
                        "table": table,
                        "owner": owner,
                        "vote": voteVal
                    },
        		success: function(data) {
        			console.log("voted");
        		},
        		error: function(data) {
        			console.log("voting error");
        		},
        		complete: function(data) {
                    buttons.prop('disabled', false);
        		}
        	});
        } else {
            curButton.siblings(".notice-login-vote").addClass("animated bounce");
        }
    });
    
    $("#card-designer-community-designs-tab").on("click", function() {
        loadCardDesigns()
    });
    
    $(document).on("click", "#card_selector_modal_user_designs .user_card_design", function(e) {
        e.preventDefault();
        var design_id = $(this).attr("data-design-id");
        changeCardColorCustom('design-' + design_id);
    });
    
    $(".load_card_year").on("change", function() {
        updateAutocompleteYear(this);
    });

    $("#image_selector_modal, #background_selector_modal").find(".collapse").on("show.bs.collapse", function() {
        $(this).find("img.lazy_load").each(function() {
            $(this).attr("src", $(this).attr("data-src"));
        });
    });

    if ($(".nation-club-typeahead").length > 0) {
        $(".nation-club-typeahead").autocomplete({
        	search: function(event, ui) {
        		$(this).siblings(".spinner").show();
        	},
        	source: "lookupnationsteams.php",
        	minLength: 2,
        	focus: function (event, ui) {
        		event.preventDefault();
        		$(this).val(ui.item.label);
        		$(this).siblings(".hidden_nation_club_id").val(ui.item.value);
        	},
        	select: function (event, ui) {
        		event.preventDefault();
        		$(this).val(ui.item.label);
        		$(this).siblings(".hidden_nation_club_id").val(ui.item.value);
        		var team_id_val = $(this).siblings(".hidden_nation_club_id").val();
        		var img = $("<img>").attr("src", ui.item.img_url);
        		var anchor = $("<a>").attr("onclick", "ImageCreator_SelectImage(event, this)");
        		anchor.append(img);
                $(this).parent().append(anchor);
                anchor.trigger("click").remove();
        	},
        	response: function (event,ui) {
        		$(this).siblings(".spinner").hide();
        	}
        })
    	.data("ui-autocomplete")._renderItem = function(ul, item) {
    		return $("<li>")
    			.data("ui-autocomplete-item", item)
    			.append("<a>" + item.img + " " + item.label + "</a>")
    			.appendTo(ul);
    	};
    }
    $("body").addClass("page-loaded");
});

$(document).ready(function() {
    resizeSideBanners();
    $(window).on("resize scroll", function() {
        resizeSideBanners();
    });
});

function setMeasurementsDisplay(measurementCode) {
	if(measurementCode == 2) {
		$(".uscustom").hide();
		$(".metric").show();
	} else {
		$(".uscustom").show();
		$(".metric").hide();
	}
}

function copyMetricToUSCustom() {
	$("#usheight").val(getStandardHt($("#height").val()));
	$("#usweight").val(getLbs($("#weight").val()));
	
	$("#usheight, #usweight").css("background-color", "#ccffba");
	$("#usheight, #usweight").animate({
		backgroundColor: "#fff"
	}, 1500);
}

function moveOverlappingChart() {
	$(".chart-age .chart-item").each(function() {
		var thisleft = $(this).css("left");
		var thisbottom = $(this).css("bottom");
		$(this).siblings(".chart-item").each(function() {
			var left2 = $(this).css("left");
			var bottom2 = $(this).css("bottom");
			if ((left2 == thisleft) && (bottom2 == thisbottom)) {
				$(this).css("bottom", (parseInt(bottom2.replace("px",""))-15)+"px");
			}
		});
	});
}

function loadImages() {
	$("img[data-image]").each(function() {
        var thisimage = $(this),
            newsrc = thisimage.attr("data-image");
        var img = new Image();
        img.onload = function() {
            thisimage.attr("src", newsrc);
        };
        img.onerror = function() {
            console.log("Couldn't load " + newsrc);
        };
        img.src = newsrc;
	});
}

function getStandardHt(metricht) {
	var totalinches = metricht/2.54;
	var feet = Math.floor(totalinches/12);
	var inches = Math.round(totalinches%12);
	var height = feet + "'" + inches + "\"";
	return height;
}

function getLbs(metricwt) {
	var lbs = Math.round(metricwt / 0.45359237);
	return lbs;
}

function convertHtToMetric(standardht) {
	var rex = /^(\d+)'(\d+)"$/;
	var match = rex.exec(standardht);
	var feet, inches, totalinches, cms;
	if (match) {
		feet = parseInt(match[1], 10);
		inches = parseInt(match[2], 10);
		totalinches = inches + (feet*12);
		cms = totalinches*2.54;
		return cms;
	}
}

function convertWtToMetric(standardwt) {
	var wt = standardwt * 0.45359237;
	return wt;
}

function validateHt(elem) {
	var rex = /^[0-9\'\"]$/;
	if (elem.val().indexOf("'") == -1 || elem.val().indexOf("\"") == -1 || rex.exec(elem.val())) {
		elem.closest(".form-group").addClass("has-error").removeClass("has-success");
	} else {
		elem.closest(".form-group").removeClass("has-error").addClass("has-success");
	}
}

function fixHt(heightinput) {
	var fixedHt = null;
	if (heightinput.length==1 && parseInt(heightinput)) {
		fixedHt = heightinput+"'0\"";
	}
	return fixedHt;
}

function generateImage(elem, downloadElement, filename, prerender, callback, appendCanvasTo) {
	$(elem).text("Downloading Card").attr("disabled", "disabled");
	var elem_clone = downloadElement.clone();
	$("body").append(elem_clone);
	elem_clone.css("transform", "none");

	html2canvas(elem_clone, {
    		logging: true,
    		background: "transparent",
    		//useCORS: true,
    		//allowTaint: true,
    		proxy: "utils/html2canvasproxy.php"
		}).then(function(canvas) {
			$("body").append(canvas);
			if (appendCanvasTo) {
				$(appendCanvasTo).append(cloneCanvas(canvas));
			}
			var data = canvas.toDataURL();
			callback(data);
			elem_clone.remove();
			$(canvas).remove();
			$(elem).text("Download Card").removeAttr("disabled");
		});
}

function cloneCanvas(oldCanvas) {

	//create a new canvas
	var newCanvas = document.createElement('canvas');
	var context = newCanvas.getContext('2d');
	
	//set dimensions
	newCanvas.width = oldCanvas.width;
	newCanvas.height = oldCanvas.height;
	
	//apply the old canvas to the new one
	context.drawImage(oldCanvas, 0, 0);
	
	//return the new canvas
	return newCanvas;
}

function downloadURI(uri, name) {
	var open = window.open(uri, "_blank");
	if (open == null || typeof(open)=='undefined') {
		alert("Tried to open card in a new window. Please turn off pop-up blocker and try again.");
	}
}

function download(url, filename) {
	// Example call: download("http://i.stack.imgur.com/L8rHf.png", 'img.png');
	
	filename = (filename!=null && filename!='' ? filename : (($("#form-card-name").val() ? $("#form-card-name").val() : "fifarosters-download") + ".png"));
	
	var a = document.createElement('a');

	if (typeof a.download != "undefined" && (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase()))) {
		a.download = filename;
		a.target = "_blank";
		a.href = url;
		a.click();
		a.remove();
	} else {
		downloadURI(url, filename);
	}
}

function downloadImage(elem, imageElem, filename) {
	var data = generateImage(elem, imageElem, filename, null, download);
}

function putCardOnBackground() {
	/*
		x clone html item
		x append to body (out of sight)
		x remove transforms
		x generateImage (canvas)
		x clone canvas to a child on $("#card-creator-square-background");
		o see about smoothing/sharpening image for final rendering
	*/
}

function setupAutocomplete(input, hidden_input, redirect, lookup) {
		var $this = input;
		var $spinner = $this.siblings(".spinner");
		var $hidden_id = hidden_input;
		var redirect = (typeof redirect === "undefined") ? true : redirect;
		
		if ($this[0].hasAttribute("data-redirect") && $this.attr("data-redirect") == "no-redirect") {
			redirect = false;
		}

		$this.autocomplete({
			search: function(event, ui) {
				//$spinner.show();
				$this.addClass("loading");
			},
			source: function(request, response) {
						$.ajax({
							url: "lookup" + lookup + ".php",
							dataType: "json",
							data: {
									term: request.term
								},
							success: function(data) {
									response(data);
								}
						});
					},
			minLength: 2,
			focus: function (event, ui) {
				event.preventDefault();
				/*
					// I don't think we want to 'select' the value onfocus
				$this.val(ui.item.label);
				$hidden_id.val(ui.item.value);
				*/
			},
			select: function (event, ui) {
				event.preventDefault();
				$this.val(ui.item.label);
				$hidden_id.val(ui.item.value);
				if (redirect) {
					var team_id_val = $hidden_id.val();
					window.location.href = "teams.php?team=" + team_id_val;
				}
				$hidden_id.trigger("change");
				/*
				$.ajax({
					url: "utils/getteamroster.php?team=" + team_id_val,
					success: function(data) {
						$( "#team_roster" ).html(data);
					}
				});
				$.ajax({
					url: "utils/getteaminfo.php?team=" + team_id_val,
					success: function(data) {
						$( "#team_info" ).html(data);
					}
				});
				*/
			},
			response: function (event,ui) {
				//$spinner.hide();
				$this.removeClass("loading");
			}
		})
		.data("ui-autocomplete")._renderItem = function(ul, item) {
			var listing = "<a>" + item.img + " " + item.label;
			if (item.rating) {
				listing += " <div class=\"item-rating\" style=\"float:right\">" + item.rating + "</div>"
			}
			listing += "</a>";
			return $("<li>")
				.data("ui-autocomplete-item", item)
				.append(listing)
				.appendTo(ul);
		};
}

function setupAutocompletes() {
	$("input[data-autocomplete]").each(function() {
		var input = $(this);
		var hidden_input = $("#" + input.attr("data-hidden-id"));
		var redirect = input.attr("data-redirect");
		var lookup = input.attr("data-autocomplete");
		
		setupAutocomplete(input, hidden_input, redirect, lookup);
	});
}

function ImageCreator_SetModalCaller(caller) {
    $("#image_selector_modal").attr("data-caller", $(caller).closest(".child-form-item").attr("id"));
}

function ImageCreator_SelectImage(e, element) {
    e.preventDefault();
    var image_selector_modal = $("#image_selector_modal");
    var specific_form_input = $("#" + image_selector_modal.attr("data-caller")).find(".background-form-item-image input[type='hidden']");
    var image_val = $(element).find("img").attr("src");
    specific_form_input.val(image_val);
	specific_form_input.trigger("change");
	image_selector_modal.modal("hide");
}

function ImageCreator_SelectBackground(e, element) {
    e.preventDefault();
    var image_selector_modal = $("#background_selector_modal");
    var specific_form_input = $("#form-background-image");
    if ($(element).prop("tagName") == "A") {
        var image_val = $(element).find("img").attr("src");
    } else if ($(element).prop("tagName") == "INPUT") {
        var image_val = "solid-color";
    }
    
    // strip domain if it exists
    image_val = image_val.replace(/^.*\/\/[^\/]+/, '');
    if (image_val[0] == '/') {
        image_val = image_val.substring(1);
    }
    
    specific_form_input.val(image_val);
	specific_form_input.trigger("change");
	image_selector_modal.modal("hide");
}

function selectChosenImage(e, element) {
    e.preventDefault();
    var image_selector_modal = $("#image_selector_modal");
    var specific_form_input = $("#form-background-image")
    if ($('#target-elem').val() == 'foreground') {
        specific_form_input = $("#form-foreground-image");
    }
    if ($('#target-elem').val() == 'foregroundoverlay') {
        specific_form_input = $("#form-foreground-overlay-image");
    }
    if ($(element).prop("tagName") == "A") {
        var image_val = $(element).find("img").attr("src");
    } else if ($(element).prop("tagName") == "INPUT") {
        var image_val = "solid-color";
    }
    
    // strip domain if it exists
    image_val = image_val.replace(/^.*\/\/[^\/]+/, '');
    if (image_val[0] == '/') {
        image_val = image_val.substring(1);
    }
    
    specific_form_input.val('/' + image_val);
    specific_form_input.trigger("change");
    image_selector_modal.modal("hide");
}

function updateAutocompleteYear(elem) {
    var year = $(elem).val(),
        autocomplete = $(elem).parent().siblings("#site_search, .fut-players-typeahead, .fut-images-typeahead").attr("fut-year", year);
}

function loadVotingWidgets() {
    $(".vote-widget").each(function() {
        var vote = $(this),
            owner = vote.attr("data-oid"),
            record = vote.attr("data-rid"),
            table = vote.attr("data-t"),
            buttons = vote.find("button"),
            upvote_btn = vote.find("button.upvote"),
            downvote_btn = vote.find("button.downvote"),
            votesNum = vote.find(".votes");
        
        // Load Votes
		$.ajax({
			url: "utils/getVotes.php",
			type: "POST",
			data: {
                    "record": record,
                    "table": table
                },
			success: function(data) {
    			// total votes
    			if (data.votes.votes == null) {
        			data.votes.votes = 0;
    			}
    			if (data.votes && data.votes.votes) {
        			votesNum.html(data.votes.votes);
        			vote.attr("data-orig-vote", data.votes.votes);
                }
    			
    			// user's vote
    			if (data.vote && data.vote.vote) {
        			if (data.vote.vote > 0) {
            			upvote_btn.addClass("active_vote");
        			}
        			if (data.vote.vote < 0) {
            			downvote_btn.addClass("active_vote");
        			}
    			}
			},
			error: function(data) {
    			votesNum.html("Error");
			}
		});
    });
}

function loadCardDesigns(args) {
        var spinner = $("#card-designer-community-designs .spinner");
        spinner.show();

        var filters = {};
        var search_val = '';

        // Page
        var pageNum = 1;
        if (typeof args !== "undefined") {
            pageNum = args.pagenum;
        }
        
        // Year
        var year_input = $("#form-card-year");
        if (year_input.length > 0) {
            year = year_input.val();
        } else {
            year = DEFAULT_CARD_YEAR;
        }
        filters["year"] = year;
        
        // Search
        var search_input = $("input[name='form-community-designs-search']");
        if (search_input.length > 0) {
            search_val = search_input.val();
            if (search_val.length > 0) {
                filters["search"] = search_val;
            }
        }
        
        $.ajax({
			url: "utils/getList.php",
			type: "POST",
			data: {
                "sql_name": "card_designs",
                "filters": filters,
                "pageNum": pageNum
            },
            beforeSend: function() {
                spinner.show();
            },
			success: function(data) {
    			$("#loaded_designs_css").html(data.designs_css);
    			
                var community_designs_container = $("#card-designer-community-designs");
    			community_designs_container.html("<div class=\"row\"></div>");
    			
    			// Build list
    			var cardElem = $("#playercard_container .player"),
    			    cardDesignsContent = community_designs_container.find(".row"),
    			    cardCloneBase = cardElem.clone(false);
        			cardCloneBase.attr("class", "player");
                    cardCloneBase.find(".card-xl").removeClass()
                        .addClass("playercard")
                        .addClass("fut" + year)
                        .addClass("card-small")
                        .addClass("tots")
                        .addClass("gold");
                        
                if (cardCloneBase.find(".card-mini").length > 0) {
                    cardCloneBase.find(".card-mini").removeClass()
                        .addClass("playercard")
                        .addClass("fut" + year)
                        .addClass("card-mini")
                        .addClass("card-mini-small")
                        .addClass("tots")
                        .addClass("gold");
                }
    			
    			var list_html = "";
    			
    			// Setup pagination
    			if (pageNum - 1 > 0) {
        			prevPage = pageNum-1;
    			} else {
        			prevPage = 1;
        			prevPageDisabled = "disabled";
    			}

                var pagination_html = "<nav style=\"margin: 10px 0; text-align: right;\"><span style=\"display: inline-block; line-height: 34px; vertical-align: top; margin: 0 10px;\" class=\"current-page\">Page <span class=\"page-num\">" + pageNum + "</span></span>" +
    			        "<ul class=\"pagination\" style=\"margin: 0;\">" +
        			        "<li><a href=\"javascript:loadCardDesigns({pagenum:" + prevPage + "});\" class=\"prev-button " + prevPageDisabled + "\">Prev</a></li>" +
        			        "<li><a href=\"javascript:loadCardDesigns({pagenum:" + (pageNum+1) + "});\" class=\"next-button\">Next</a></li>" +
        			     "</ul></nav>";

    			
    			var header = "<div style=\"margin-bottom: 10px;\" class=\"col-xs-12\">" +
    			        "<div class=\"filters flexbox\">" +
    			            "<input type=\"text\" name=\"form-community-designs-search\" class=\"form-control\" placeholder=\"Filter designs by keyword\" value=\"" + search_val + "\">" +
    			            "<button class=\"btn btn-primary\" onclick=\"loadCardDesigns()\">Filter Designs</button>" +
    			        "</div>";
                
                if (data.pagination.totalRecords > 0) {
                    header += pagination_html;
                }
                
                header += "</div>" +
    			     "<div class=\"spinner text-center\"><img src=\"images/loader.gif\" alt=\"Loading\"></div>";
    			
    			cardDesignsContent.html(header);
                
                if (data.pagination.totalRecords == 0) {
        			var noRecords = '<div class="col-xs-12"><div class="alert alert-warning">No card designs. Try adjusting your search or filters.</div></div>';
        			cardDesignsContent.append(noRecords);
                }

    			$.each(data.list_data, function (i, item) {
        			var design_title = (item.title ? item.title : 'Design ' + item.id);
        			var design_link = (item.designer_url ? '<a href="' + item.designer_url + '" target="_blank">Designer Link</a><br>' : '');
        			var card_link = '<a href="card-designer?design_id=' + item.id + '">View Card</a><br>';
        			var cardLink = $('<a href="#" data-design-id="' + item.id + '" class="user_card_design design-' + item.id + '"></a>');
        			cardClone = cardCloneBase.clone(false);
                    cardClone.appendTo(cardLink);
                    var design_container = $('<div class="user_card_design_wrapper"></div>');
                    
                    cardLink.appendTo(design_container);
                    
                    // Vote Widget
                    if (!window.hasOwnProperty('session')) {
                    	var loggedin = false;
                    } else {
                        var loggedin = true;
                    }
                    
                    var table_name = 'fifarosters_card_designer';
                    var upvote_vote = "";
                    var downvote_vote = "";
                    
                    // Get User's Vote
                    if (item.user_vote) {
                        if (item.user_vote == 1) {
                            upvote_vote = "active_vote";
                            downvote_vote = "inactive_vote";
                        } else if (item.user_vote == -1) {
                            upvote_vote = "inactive_vote";
                            downvote_vote = "active_vote";
                        }
                    }
                    
                    if (!item.votes) {
                        item.votes = 0;
                    }
                    
                    if (!item.username) {
                        item.username = item.user_id;
                    }
                    
                    var voteWidget = '<div class="vote-widget compact-widget" data-oid="' + item.user_id + '" data-rid="' + item.id + '" data-t="' + table_name + '" data-orig-vote="' + item.votes + '" ' + (loggedin ? 'logged-in="true"' : '') + '>' +
                        '<button class="upvote btn ' + upvote_vote + '">' +
                            '<span class="fa fa-chevron-up"></span>' +
                        '</button>' +
                        '<div class="votes">';
                        if (item.votes == 0) {
                            voteWidget += "Vote";
                        } else {
                            voteWidget += item.votes;
                        }
                        voteWidget += '</div>' +
                        '<button class="downvote btn ' + downvote_vote + '">' +
                            '<span class="fa fa-chevron-down"></span>' +
                        '</button>';
                        if (!loggedin) {
                            voteWidget += '<div class="notice-login-vote">' +
                                        '<small><em>Login to vote</em></small>' +
                                    '</div>';
                        }
                        voteWidget += '</div>';
                    
                    design_container.append('<div class="design-info">' +
            			            '<div class="design-title">' + design_title + '</div>' +
            			            '<div class="design-author">by ' + item.username + '</div>' +
            			            voteWidget +
            			            '<hr>' +
            			            card_link +
            			            design_link +
                                '</div>');
                    
                    var design_container_wrap = $('<div class="col-xs-12 col-sm-6 col-md-4"></div>');
                    design_container_wrap.append(design_container);
        			cardDesignsContent.append(design_container_wrap);
    			});
    			
    			if (data.pagination.totalRecords > 0) {
        			cardDesignsContent.append("<div class=\"col-xs-12\">" + pagination_html + "</div>");
                }
    			
    			spinner.hide();
    			community_designs_container.attr("loaded-year", year);
			},
			error: function(data) {
    			console.log("Error loading cards:", data);
    			$("#card-designer-community-designs").html("There was an error loading card designs. Please try again.");
			}
		});
}

function fixUrl(url) {
    // if url doesn't start with http, add it
    if (!url.startsWith("http")) {
        url = "http://" + url;
    }
    
    // if url has single or double quotes, remove them
    url.replace(/[`"' ]/g, "");
    
    // if trying to use improper imgur link, change to direct
    if (url.indexOf("imgur.com") > -1) {
        url.replace("http://", "https://");
        var imgur_url_prefix = "https://imgur.com/";
        if (url.startsWith(imgur_url_prefix)) {
            url = url.replace(imgur_url_prefix, "https://i.imgur.com/") + ".png";
        }
    }
    
    return url;
}

function setFormFieldStatus(formElem, status, errorMsg) {
    if (status == "default") {
		formElem.closest(".form-group").removeClass("has-error");
		formElem.closest(".form-group").find(".help-block").text("").hide();
    } else {
		formElem.closest(".form-group").addClass("has-error");
		formElem.closest(".form-group").find(".help-block").text(errorMsg).show();
	}
}

function resizeSideBanners() {
    var nav_bar_height = $("#primary-navigation").height();
    var container_width = $("section.container").outerWidth();
    var remaining_width = $(window).innerWidth() - container_width;
    
    var nav_bar_height_partial = nav_bar_height - $(window).scrollTop();
    var nav_bar_height_remaining = nav_bar_height_partial>0 ? nav_bar_height_partial : 0;
    var remaining_height = $(window).innerHeight() - nav_bar_height_remaining;
    $(".side-banner").each(function() {
        $(this).width(remaining_width/2);
        $(this).height(remaining_height);
        $(this).css('top', nav_bar_height_remaining);
    });
}

function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\" + char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

function openModal(args) {
    var title = typeof args['title'] !== "undefined" ? args['title'] : false;
    var id = typeof args['id'] !== "undefined" ? args['id'] : false;
    var body = typeof args['body'] !== "undefined" ? args['body'] : '';
    var footer = typeof args['footer'] !== "undefined" ? args['footer'] : false;
    var size_class = typeof args['size'] !== "undefined" ? 'modal-' + args['size'] : '';
    
    var html = '<div class="modal fade" tabindex="-1" role="dialog" id="' + id + '">'
        + '<div class="modal-dialog ' + size_class + '" role="document">'
        + '    <div class="modal-content">'
        + '        <div class="modal-header">'
        + '            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    if (title) {
        html += '   <h4 class="modal-title">' + title + '</h4>';
    }
    
    html += '  </div>'
        + '    <div class="modal-body">' + body + '</div>';
                
    if (footer) {
        html += '<div class="modal-footer">' + footer + '</div>';
    }
    
    html += '</div></div></div>';
    
    if (id && $('#' + id).length > 0) {
        $('#' + id).modal('show');
    } else {
        $("body").append(html);
        $('#' + id).modal('show');
    }
}

function copyShareUrl() {
    $('#share_url').select();
    try {
        var successful = document.execCommand('copy');
        if (successful) {
            $('#copy_msg').addClass('text-success').html('Successfully copied').fadeIn().delay(2000).fadeOut();
        } else {
            $('#copy_msg').addClass('text-error').html('Could not copy').fadeIn().delay(2000).fadeOut();
        }
    } catch(err) {  
        $('#copy_msg').addClass('text-error').html('Unable to copy').fadeIn().delay(2000).fadeOut();
    }  
}

/*
	////////////////////////////////
	// External linking to tab content and google analytics tracking of tabs
	////////////////////////////////
	
// Javascript to enable link to tab
var page_url = document.location.toString();
if (page_url.match('#')) {
	$('.nav-tabs a[href="#' + page_url.split('#')[1] + '"]').tab('show');
} 

// Change hash for page-reload
$('.nav-tabs a').on('shown.bs.tab', function (e) {
	window.location.hash = e.target.hash;
});
*/

// Login
$('form#frmLogin').on('submit', function (e) {
    e.preventDefault();
    $('.statusMessage').removeClass('alert alert-danger alert-success').hide();
    $.ajax({
      type: 'post',
      url: 'login.php',
      data: $('form').serialize(),
      success: function (response) {
          let statusMessage = $('.statusMessage');
          statusMessage.show();
          if (response.error != "") {
              statusMessage.addClass('alert alert-danger').html(response.error);
          } else {
              statusMessage.addClass('alert alert-success').html("Successful Login. Please wait..");
              statusMessage.siblings().hide();
              statusMessage.parents('#frmLogin').find('.modal-footer').hide();
              location.reload();
          }
      }
    });
});

// Sign Up
$('form#frmSignUp').on('submit', function (e) {
  e.preventDefault();
  $('.statusMessage').removeClass('alert alert-danger alert-success').hide();
  $.ajax({
    type: 'post',
    url: 'newuser-add.php',
    dataType: "json",
    data: $('form').serialize(),
    contentType: "application/x-www-form-urlencoded",
    success: function (response) {
        $('.statusMessage').show();
        if (response.status == "Success") {
            $('.statusMessage').addClass('alert alert-success').html(errors[response.msgIndex]);
            $(':input').val('');
            $('form#frmSignUp .form-group').hide();
            window.location.href = window.location.href.replace(/[^/]*$/, 'activate');
        }
        else {
            $('.statusMessage').addClass('alert alert-danger').html(errors[response.msgIndex]);
        }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
        console.log(XMLHttpRequest.responseText);
    }
  });
});
  
$('#btnUpdateProfile').on('click', function (e) {
    e.preventDefault();
    $('.statusMessage').removeClass('alert alert-danger alert-success').hide();
    var firstName = $("#txtFirstName").val();
    var lastName = $("#txtLastName").val();
    var userName = $("#txtUsername").val();
    var password = $("#txtPassword").val();
    $.ajax({
        type: 'post',
        url: 'account-management.php',
        dataType: "json",
        data: {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            password: password,
        },
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {
            $('.statusMessage').show();
            if (response.status == "Success") {
                $('.statusMessage').addClass('alert alert-success').html(response.msg);
                $('.showUsername').html(userName);
                $('.basicInfo').html(firstName + ' ' + lastName);
                $(".showProfileInfo, .recoverpwd").show();
                $(".editProfileInfo, #trPwd").hide();
                $('#trPwd').remove();
            }
            else {
                $('.statusMessage').addClass('alert alert-danger').html(response.msg);
            }
        }
    });
});

// Focus search input when search modal is opened
$(".search-modal").on('shown.bs.modal', function () {
    $(this).find(".modal-body input[type='search']").focus();
});