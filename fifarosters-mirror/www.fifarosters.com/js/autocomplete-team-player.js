		var autocomplete_spinner = $("#autocomplete-player").siblings(".spinner");
		$("#autocomplete-player").autocomplete({
			search: function(event, ui) {
				autocomplete_spinner.show();
			},
			source: function(request, response) {
				$.ajax({
					url: "lookupplayer.php",
					data: { term: request.term },
					success: function(data) {
						response(data);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(jqXHR.responseText);
						console.log(textStatus);
						console.log(errorThrown);
						alert("error handler!");
						autocomplete_spinner.hide()
					},
					dataType: "json"
				});
			},
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
				$.ajax({
					url: "utils/getplayerinfo.php?player_id=" + ui.item.value,
					success: function(data) {
						var playerdata = data;
						$.ajax({
							url: "utils/getAge.php?birthdate=" + playerdata[0]["birthdate"],
							success: function(data) {
								myElem = $("#age");
								myElem.val(data);
								myElem.css("background-color", "#ccffba");
								myElem.animate({
									backgroundColor: "#fff"
								}, 1500);
							}
						});
						$.each(playerdata[0], function(key, value) {
							if (key == "weakfootabilitytypecode") {
								var myElem = $("#weakfoot");
							} else if (key == "preferredposition1") {
								var myElem = $("#position");
								value = ui.item.position;
							} else {
								var myElem = $("#"+key);
							}
							if (myElem.prop("tagName")=="INPUT" && (myElem.attr("type")=="text" || myElem.attr("type")=="hidden")) {
								myElem.val(value);
								myElem.css("background-color", "#ccffba");
								myElem.animate({
									backgroundColor: "#fff"
								}, 1500);
							} else if (myElem.prop("tagName")=="SELECT") {
								myElem.val(value);
								myElem.css("background-color", "#ccffba");
								myElem.animate({
									backgroundColor: "#fff"
								}, 1500);
							}
						});
					}
				}).complete(function() {
					copyMetricToUSCustom();
				});
			},
			response: function (event,ui) {
				autocomplete_spinner.hide();
			}
		})
		.data("ui-autocomplete")._renderItem = function(ul, item) {
			return $("<li>")
				.data("ui-autocomplete-item", item)
				.append("<a>" + item.img + item.nation + " " + item.label + " (" + item.position + ")" + item.rating + "</a>")
				.appendTo(ul);
		};