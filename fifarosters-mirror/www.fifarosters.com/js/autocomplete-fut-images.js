		$(".fut-images-typeahead").autocomplete({
			search: function(event, ui) {
				$(this).siblings(".spinner").show();
			},
			source: "lookupfutplayer.php",
			minLength: 2,
			focus: function (event, ui) {
				event.preventDefault();
				//$(this).val(ui.item.label);
				//$("#form-card-image").val(ui.item.value);
			},
			select: function (event, ui) {
				event.preventDefault();
				var $this = $(this);
				var $hidden_response = $this.siblings(".hidden-response");
				$this.val(ui.item.label);
				$hidden_response.val(ui.item.xl_img_url);
				var player_id_val = $hidden_response.val();
				$hidden_response.trigger("change");
			},
			response: function (event,ui) {
				$(this).siblings(".spinner").hide();
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
			var value = item.color;
			var player_color = "";
			if (value.indexOf("bronze") > -1) {
				player_color = "bronze";
			} else if (value.indexOf("silver") > -1) {
				player_color = "silver";
			} else if (value.indexOf("gold") > -1) {
				player_color = "gold";
			} else if (value.indexOf("purple") > -1) {
				player_color = "hero";
			} else if (value.indexOf("record_breaker") > -1) {
				player_color = "record breaker";
			} else if (value.indexOf("gotm") > -1) {
				player_color = "TOTT";
			} else {
				player_color = value.replace(/[_-]/g, ' ');
			}
			
			var player_type = "";
			if (value.indexOf("totw") > -1) {
				player_type = "if";
			} else if (value.indexOf("tots") > -1) {
				player_type = "tots";
			} else if (value.indexOf("rare") > -1) {
				player_type = "rare";
			} else {
				player_type = "nonrare";
			}
			
			if (player_color == "bronze" || player_color == "silver" || player_color == "gold") {
    			var card_type_color = player_type + ' ' + player_color;
			} else {
    			var card_type_color = player_color;
			}
			
			if (item.position && card_type_color != "") {
    			var card_info = '<span class="ac-player-data">' + item.position + ' - ' + card_type_color + ' - FIFA 17</span>';
			} else {
    			var card_info = '';
			}
			
			var autocomplete_tmpl = '<a>' +
    			    item.img + item.nation +
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