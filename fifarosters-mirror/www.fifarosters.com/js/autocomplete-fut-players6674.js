let autocomplete_elems = $("#site_search, .fut-players-typeahead, .fut-images-typeahead");

if (autocomplete_elems.length > 0) {
		autocomplete_elems.each(function() {
            let search_type = $(this).attr("search-type");
    		$(this).autocomplete({
    			search: function(event, ui) {
    				$(this).toggleClass("loading", true);
    			},
    			source: function(request, response) {
                    $.getJSON("lookupfutplayer.php",
                        {
                            term: request.term,
                            no_blank: $(this.element).attr("no-blank"),
                            year: $(this.element).attr("fut-year"),
                            base_cards_only: $(this.element).attr("base-cards-only")
                        }, 
                        response
                    );
                },
    			minLength: 2,
    			focus: function (event, ui) {
    				event.preventDefault();
    				$(this).addClass("ui-state-active");
    				//$(this).val(ui.item.label);
    				//$("#form-card-image").val(ui.item.value);
    			},
    			blur: function (event, ui) {
    				$(this).removeClass("ui-state-active");
    			},
    			select: function (event, ui) {
    				event.preventDefault();
    				var $this = $(this);
    				var $hidden_response = $this.siblings(".hidden-response");
    				var year = $this.attr("fut-year");
    				var source = $this.attr("player-search-logsource");
    				var search_term = $this.val();
    				$this.val(ui.item.label);
    				if (search_type == "image") {
        				$hidden_response.val(ui.item.xl_img_url);
    				} else {
        				$hidden_response.val(ui.item.futid);
                    }
                                
    				var player_id_val = $hidden_response.val();
    				var playerdata = ui.item.data;
    				
    				if (typeof handleAutocomplete == "function" && search_type !== "image") {
        				handleAutocomplete(playerdata, ui);
                    }
    				
    				setTimeout(function() {
    					$hidden_response.trigger("change");
    				}, 0);

                    $.post("/player-search-log.php", {
                            term: search_term,
                            player_name: ui.item.label,
                            year: year,
                            card_id: ui.item.futid,
                            source: source
                        }
                    )
                    .always(function() {
                        if ($this.attr("no-refresh") !== "true") {
                            // Go to player profile
                            if (ui.item.baseid && ui.item.futid) {
                                window.location.href = "players.php?v=" + year + "&player=" + ui.item.baseid + "&futid=" + ui.item.futid;
                            }
                        }
                    });
    			},
    			response: function (event,ui) {
    				$(this).toggleClass("loading", false);
    				if (!ui.content.length) {
        				ui.content.push({
            				'value': "",
            				'futid': 0,
            				'playerid': 0,
            				'baseid': 0,
            				'label': "No results found",
            				'img_url': '',
            				'color': "",
            				'img': '',
            				'nation': "",
            				'position': "",
            				'rating': "",
            				'data': "",
            				'xl_img_url': ''
                        });
    				}
    			}
    		})
    		.data("ui-autocomplete")._renderItem = function(ul, item) {
        		if (this.element[0].id == 'site_search') {
            		ul.addClass('site_search_autocomplete');
        		} else {
            		ul.addClass('fut_players_autocomplete');
        		}
    			var autocomplete_year = $(this.element).attr("fut-year");
    			
    			if (item.position && item.color_label != "") {
        			var card_info = '<span class="ac-player-data">' + item.position + ' - ' + item.color_label + ' - FIFA ' + autocomplete_year + '</span>';
    			} else {
        			var card_info = '';
    			}
    			
    			var autocomplete_tmpl = '<a>' +
        			    item.img + item.club + item.nation +
        			    '<div class="ac-player-info">' +
                		    '<span class="ac-player-name">' + item.label + '</span>' + 
                		    card_info +
                        '</div>' +
                        '<div class="item-rating">' + item.rating + '</div>' +
                    '</a>';

    			return $("<li class=\"fut-list-item " + item.color + " \">")
    				.data("ui-autocomplete-item", item)
    				.append(autocomplete_tmpl)
    				.appendTo(ul);
    		};
        });
}