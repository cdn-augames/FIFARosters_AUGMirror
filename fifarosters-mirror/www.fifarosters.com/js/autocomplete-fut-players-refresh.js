if ($(".fut-players-typeahead").length > 0) {
		$(".fut-players-typeahead").autocomplete({
			search: function(event, ui) {
				$(this).siblings(".spinner").show();
			},
			source: "lookupfutplayer.php",
			minLength: 2,
			focus: function (event, ui) {
				event.preventDefault();
				$(this).val(ui.item.label);
				//$("#form-card-image").val(ui.item.value);
			},
			select: function (event, ui) {
				event.preventDefault();
				$(this).val(ui.item.label);
				$(this).siblings(".hidden-response").val(ui.item.baseid);
				window.location.href = "players.php?player=" + ui.item.baseid + "&futid=" + ui.item.futid;
			},
			response: function (event,ui) {
				$(this).siblings(".spinner").hide();
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
				player_color = "bluered";
			} else {
				player_color = value;
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
			return $("<li class=\"fut-list-item " + player_type + " " + player_color + " \">")
				.data("ui-autocomplete-item", item)
				.append("<a>" + item.img + item.nation + " " + item.label + " (" + item.position + ") <div class=\"item-rating\">" + item.rating + "</div></a>")
				.appendTo(ul);
		};
}