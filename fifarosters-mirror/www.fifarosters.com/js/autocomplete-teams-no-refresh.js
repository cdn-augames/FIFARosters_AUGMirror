		$(".teams-typeahead").autocomplete({
			search: function(event, ui) {
				$(this).siblings(".spinner").show();
			},
			source: "lookupteams.php",
			minLength: 2,
			focus: function (event, ui) {
				event.preventDefault();
				$(this).val(ui.item.label);
				$(this).siblings(".hidden_team_id").val(ui.item.value);
			},
			select: function (event, ui) {
				event.preventDefault();
				$(this).val(ui.item.label);
				$(this).siblings(".hidden_team_id").val(ui.item.value);
				var team_id_val = $(this).siblings(".hidden_team_id").val();
				//window.location.href = "teams.php?team=" + team_id_val;
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
				$(this).siblings(".spinner").hide();
			}
		});