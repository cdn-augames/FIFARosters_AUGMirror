
		$(".players-typeahead").autocomplete({
			search: function(event, ui) {
				$(this).siblings(".spinner").show();
			},
			source: "lookupplayer.php",
			minLength: 2,
			focus: function (event, ui) {
				event.preventDefault();
				$(this).val(ui.item.label);
				$("#hidden_player_id").val(ui.item.value);
			},
			select: function (event, ui) {
				event.preventDefault();
				$(this).val(ui.item.label);
				$("#hidden_player_id").val(ui.item.value);
				var player_id_val = $("#hidden_player_id").val();
				window.location.href = "players.php?player=" + player_id_val;
			},
			response: function (event,ui) {
				$(this).siblings(".spinner").hide();
			}
		})
		.data("ui-autocomplete")._renderItem = function(ul, item) {
			return $("<li>")
				.data("ui-autocomplete-item", item)
				.append("<a>" + item.img + item.nation + " " + item.label + " (" + item.position + ")" + item.rating + "</a>")
				.appendTo(ul);
		};