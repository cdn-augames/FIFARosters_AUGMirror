		var $this = $(".teams-typeahead");
		var $spinner = $this.siblings(".spinner");
		var $hidden_id,
			hidden_id_selector = "hidden_team_id",
			redirect = true;
		if ($this[0].hasAttribute("data-hidden-id")) {
			hidden_id_selector = $this.attr("data-hidden-id");
		}
		
		$hidden_id = $("#" + hidden_id_selector);
		if ($this[0].hasAttribute("data-redirect") && $this.attr("data-redirect") == "no-redirect") {
			redirect = false;
		} else {
			redirect = true;
		}
		$this.autocomplete({
			search: function(event, ui) {
				//$spinner.show();
				$this.addClass("loading");
			},
			source: function(request, response) {
						$.ajax({
							url: "lookupteams.php",
							dataType: "json",
							data: {
									term: request.term,
									nationalteams: $this.attr("data-nationalteams"),
									womensteams: $this.attr("data-womensteams"),
									include_unofficial: $this.attr("data-include-unofficial")
								},
							success: function(data) {
									response(data);
								}
						});
					},
			minLength: 2,
			focus: function (event, ui) {
				event.preventDefault();
				$this.val(ui.item.label);
				$hidden_id.val(ui.item.value);
			},
			select: function (event, ui) {
				event.preventDefault();
				$this.val(ui.item.label);
				if (typeof ui.item.imgurl != "undefined" && ui.item.imgurl != "") {
    				$hidden_id.val(ui.item.imgurl);
				} else {
    				$hidden_id.val(ui.item.value);
                }
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
			return $("<li>")
				.data("ui-autocomplete-item", item)
				.append("<a>" + item.img + " " + item.label + " <div class=\"item-rating\" style=\"float:right\">" + item.rating + "</div></a>")
				.appendTo(ul);
		};