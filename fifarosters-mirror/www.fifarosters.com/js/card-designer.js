        function updateImage(elem, cardElem) {
            if ($(elem).length > 0 && $(cardElem).length > 0) {
                var elem = $(elem),
    			    img_url = elem.val();
                if (validateImage(elem)) {
        			$.get("utils/getImage.php", {image: img_url}, function(data) {
        				if (data.is_image) {
            				elem.closest(".form-group").removeClass("has-error");
            				elem.closest(".form-group").find(".help-block").text("").hide();
        					$(cardElem).css("background-image", "url('" + img_url + "')");
        				} else {
            				elem.closest(".form-group").addClass("has-error");
            				elem.closest(".form-group").find(".help-block").text("That url didn't work.").show();
            				$(cardElem).removeAttr("style");
        				}
        			});
                }
            }
        }
        function updateLeftBar(elem) {
            if ($(elem).length > 0) {
                var use_left_bar = $(elem).val();
                var card_bar = $("#card-designer-preview .card-bar");
                
                if (use_left_bar == 1) {
                    card_bar.show();
                } else {
                    card_bar.hide();
                }
            }
        }
        function updateCardBarColor(elem, cardElem) {
            if ($(elem).length > 0 && $(cardElem).length > 0) {
                // rgb the color
                var color = $(elem).val();
                
                var rgb_result = new RGBColor(color);
                if (rgb_result.ok) {
                    // 'Red: ' + color.r
                    // 'Green: ' + color.g
                    // 'Blue: ' + color.b
                    // 'RGB: ' + color.toRGB()
                    // 'Hex: ' + color.toHex()
                } else {
                    rgb_result = new RGBColor("#000000");
                }

                var red = rgb_result.r;
                var green = rgb_result.g;
                var blue = rgb_result.b;
                var opacity = 0;
                
                var color1 = "rgba(" + red + ", " + green + ", " + blue + ", " + opacity + ")";
                var color2 = "rgba(" + red + ", " + green + ", " + blue + ", 0.75)";
                var color_stops_string = color1 + " 0%, " + color1 + " 8%, " + color2 + " 43%, " + color2 + " 56%, " + color1 + " 76%, " + color1 + " 100%";
            
                $(cardElem).css({
                    "background": "linear-gradient(to bottom, " + color_stops_string + ")"
                });
            }
        }
        function updateDividerLines(elem) {
            if ($(elem).length > 0) {
                var use_divider_lines = $(elem).val();
                var divider_lines = $("#card-designer-preview .playercard:not(.card-mini) .attr-divider");
                
                if (use_divider_lines == 1) {
                    divider_lines.show();
                } else {
                    divider_lines.hide();
                }
            }
        }
        
        function updateDividerLinesColor(elem, cardElem) {
            if ($(elem).length > 0 && $(cardElem).length > 0) {
                $(cardElem).css("border-color", $(elem).val());
            }
        }
        
        function updateColor(elem, cardElem) {
            if ($(elem).length > 0 && $(cardElem).length > 0) {
                $(cardElem).css("color", $(elem).val());
            }
        }
        
        function updateYear(elem) {
            var years = window.card_designer_form_fields.year.options;
            if ($(elem).length > 0) {
                var selected_year = $(elem).val();
                // change card class to 'fut18' or whatever
                Object.keys(years).forEach(function(key) {
                    $("#card-designer-preview .playercard").removeClass("fut" + key);
                });
                $("#card-designer-preview .playercard").addClass("fut" + selected_year);
                
                showHideDependencies(selected_year);
                
                // change to proper template if image url has not been changed before
                var image_url = $("#form_card_image_url").val();
                if (image_url.startsWith("https://www.fifarosters.com/assets/cards/fifa")) {
                    $("#form_card_image_url").val("https://www.fifarosters.com/assets/cards/fifa" + selected_year + "/templates/hd-special.png").trigger("change");
                }
                var mini_image_url = $("#form_mini_card_image_url").val();
                if (mini_image_url.startsWith("https://www.fifarosters.com/assets/cards/fifa")) {
                    $("#form_mini_card_image_url").val("https://www.fifarosters.com/assets/cards/fifa" + selected_year + "/templates/mini/hd-special.png").trigger("change");
                }

                if (selected_year > 23) {
                    $("[name=card_font][value=2]").trigger("click");
                }
            }
        }
        
        function showHideDependencies(year) {
            if (year < 19) {
                var dependent_fields = $("[name='use_left_bar'], #form_left_bar_color, [name='use_divider_lines'], #form_top_divider_lines, #form_attr_divider_lines");
            }
            if (year > 23) {
                $("[name='use_divider_lines']").val(0);
                var dependent_fields = $("[name='use_divider_lines'], #form_top_divider_lines, #form_attr_divider_lines");
            }
            if (dependent_fields) {
                dependent_fields.closest(".form-group").hide();
            } else {
                $("#card-designer-fields .form-group").show();
            }
        }

        function initializeCard() {
            $("#card-designer-preview .card-mini .playercard-name").hide();
            
            // Both
            updateYear($("input[name='year']:checked"));
            
            // Full
            updateImage($("#form_card_image_url"), $("#card-designer-preview .playercard:not(.card-mini)"));
            updateColor($("#form_left_sidebar_text_color"), "#card-designer-preview .playercard:not(.card-mini) .playercard-rating, #card-designer-preview .playercard:not(.card-mini) .playercard-position");
            updateColor($("#form_player_name_text_color"), "#card-designer-preview .playercard-name");
            updateColor($("#form_stat_numbers_text_color"), "#card-designer-preview .fut-rating");
            updateColor($("#form_stat_labels_text_color"), "#card-designer-preview .fut-label");
            updateColor($("#form_card_bottom_text_color"), "#card-designer-preview .playercard:not(.card-mini) .playercard-chemistry, #card-designer-preview .playercard:not(.card-mini) .playercard-fifarosters");
            
            // Mini
            updateImage($("#form_mini_card_image_url"), $("#card-designer-preview .playercard.card-mini"));
            updateColor($("#form_mini_main_text_color"), "#card-designer-preview .playercard.card-mini .playercard-rating, #card-designer-preview .playercard.card-mini .playercard-position");
            updateColor($("#form_mini_card_bottom_text_color"), "#card-designer-preview .playercard.card-mini .playercard-chemistry, #card-designer-preview .playercard.card-mini .playercard-fifarosters");
            updateLeftBar($("input[name='use_left_bar']"));
            updateCardBarColor($("#form_left_bar_color"), "#card-designer-preview .card-bar");
            updateDividerLines($("input[name='use_divider_lines']"));
            updateDividerLinesColor($("#form_top_divider_lines"), "#card-designer-preview .attr-divider-1, #card-designer-preview .attr-divider-2");
            updateDividerLinesColor($("#form_attr_divider_lines"), "#card-designer-preview .attr-divider-3, #card-designer-preview .attr-divider-4, #card-designer-preview .attr-divider-5");
        }

        function prepareFormForEdit(design_num) {
            var card_design_data = card_designs[design_num];
            
            // change save button to "Update Design"
            $("#save_design").text("Update Design");
            
            // add button for "Create New Design" -- reverts form to original state / reloads page?
            
            
            // add notice alert about "Editing Design #"
            if ($("#edit_alert").length) {
                $("#edit_alert").html("Editing Design #" + design_num);
            } else {
                var edit_alert = "<div class=\"alert alert-info\" id=\"edit_alert\">Editing Design #" + design_num + "</div>";
                $("#card-designer-fields").prepend(edit_alert);
            }
            
            $("#edit_alert").append("<a href=\"card-designer\" class=\"pull-right\">Cancel Edit</a>");
            
            // populate form inputs with db data
            Object.keys(card_designer_form_fields).forEach(function (key) {
                $("#form_" + key).val(card_design_data[key]);
                $("#form_" + key + ".color-picker").spectrum("set", card_design_data[key]);
            });
            
            
            // initializeCard() to update previews
            initializeCard();
            
            // switch to Design Card tab
            $("#tab-designer").click();
        }
        
        function disallowedDesignUrl(url) {
            var disallowed_url = false;
            var disallowed_domains = [
                "http://futwatch.com",
                "https://futwatch.com",
                "http://fut-watch.com",
                "https://fut-watch.com"
            ];
            $.each(disallowed_domains, function(index, val) {
                if (url.startsWith(val)) {
                    disallowed_url = true;
                }
            });
            var disallowed_urls = ["https://preview.ibb.co/f0Aw9y/otw.png"];
            if ($.inArray(url, disallowed_urls) > -1) {
                disallowed_url = true;
            }
            return disallowed_url;
        }
        
        function validationStatus(elem, status, message) {
            var form_group = elem.closest(".form-group");
            if (status=="default") {
				form_group.removeClass("has-error has-success");
				form_group.find(".help-block").text("").hide();
			} else {
				form_group.addClass("has-"+status);
				form_group.find(".help-block").text(message).show();
			}
        }
        
		function validateImage(form_input) {
    		// fix url fields
    		var $this = form_input;
            var disallowedUrl = disallowedDesignUrl($this.val());
    		
            if ($this.attr("id") == "form_designer_url"
                || $this.attr("id") == "form_card_image_url"
                || $this.attr("id") == "form_mini_card_image_url") {
                    var field_url = $this.val();
                    var url_fileType = field_url.split('.').pop(); 
                    if (field_url !== "") {
                        $this.val(fixUrl(field_url));
                    }
            }
            if ($this.attr("id") == "form_card_image_url"
                || $this.attr("id") == "form_mini_card_image_url") {
                    var validation_type = null,
                        validation_msg = "";
                    if (field_url !== "") {
                        if (field_url == "https://i.imgur.com/3h9LF7y.png"
                            || field_url == "https://i.imgur.com/uq3ozvm.png") {
                                validation_type = "error";
                                validation_msg += "Don't use the default template url. ";
                        }
                        if (!(url_fileType.includes("png")
                            || url_fileType.includes("jpg")
                            || url_fileType.includes("jpeg")
                            || url_fileType.includes("bmp")
                            || url_fileType.includes("gif")
                            || url_fileType.includes("webp")
                            || url_fileType.includes("svg"))) {
                                validation_type = "error";
                                validation_msg += "The url must be a direct link with an image type file extension (.png, .jpg, etc). ";
                        }
                        if (disallowedUrl) {
                            validation_type = "error";
                            validation_msg += "Please only use designs that you own. ";
                        }
                    } else {
                        validation_type = "error";
                        validation_msg = "Card design URL cannot be empty.";
                    }
                    if (validation_type) {
                        validationStatus($this, validation_type, validation_msg);
                        return false;
                    } else {
                        validationStatus($this, "default", "");
                        return true;
                    }
            }
            
		}

        $(document).ready(function() {
            $("input.color-picker").spectrum({
    			showInput: true,
    			replacerClassName: "spectrum-picker",
    			containerClassName: "spectrum-palette",
    			showInitial: true,
    			showPaletteOnly: false,
    			showPalette: true,
    			allowEmpty: false,
    			showSelectionPalette: true,
    			localStorageKey: "fifarosters.carddesigner",
    			maxSelectionSize: 10,
    			showAlpha: true,
    			hideAfterPaletteSelect: true,
    			preferredFormat: "rgb",
    			change: function(color) {
    				// $("#basic-log").text("change called: " + color.toHexString());
    				//updateBackgroundItemTextColor(next_child);
    			}
    		});
    		
    		initializeCard();
    		
            $("input[name='year']").on("keyup click change", function() {
                updateYear(this);
            });
            $("#form_card_image_url").on("keyup click change", function() {
                updateImage(this, $("#card-designer-preview .card-large.playercard"));
            });
            $("#form_left_sidebar_text_color").change(function() {
                updateColor(this, "#card-designer-preview .playercard-rating, #card-designer-preview .playercard-position");
            });
            $("input[name='use_left_bar']").on("keyup click change", function() {
                updateLeftBar(this);
            });
            $("#form_left_bar_color").change(function() {
                updateCardBarColor(this, "#card-designer-preview .card-bar");
            });
            $("input[name='use_divider_lines']").on("keyup click change", function() {
                updateDividerLines(this);
            });
            $("#form_top_divider_lines").change(function() {
                updateDividerLinesColor(this, "#card-designer-preview .attr-divider-1, #card-designer-preview .attr-divider-2");
            });
            $("#form_player_name_text_color").change(function() {
                updateColor(this, "#card-designer-preview .playercard-name");
            });
            $("#form_stat_numbers_text_color").change(function() {
                updateColor(this, "#card-designer-preview .fut-rating");
            });
            $("#form_stat_labels_text_color").change(function() {
                updateColor(this, "#card-designer-preview .fut-label");
            });
            $("#form_attr_divider_lines").change(function() {
                updateDividerLinesColor(this, "#card-designer-preview .attr-divider-3, #card-designer-preview .attr-divider-4, #card-designer-preview .attr-divider-5");
            });
            $("#form_card_bottom_text_color").change(function() {
                updateColor(this, "#card-designer-preview .playercard-chemistry, #card-designer-preview .playercard-fifarosters");
            });
            $("#form_mini_card_image_url").on("keyup click change", function() {
                updateImage(this, $("#card-designer-preview .card-mini.playercard"));
            });
            $("#form_mini_main_text_color").change(function() {
                updateColor(this, "#card-designer-preview .card-mini .playercard-rating, #card-designer-preview .card-mini .playercard-position");
            });
            $("#form_mini_card_bottom_text_color").change(function() {
                updateColor(this, "#card-designer-preview .card-mini .playercard-name, #card-designer-preview .card-mini .playercard-chemistry, #card-designer-preview .card-mini .playercard-fifarosters");
            });
            $("#save_design").on("click", function(e) {
                e.preventDefault();
                var elem = $(this),
                    feedback = elem.siblings(".form-feedback").first(),
                    form_id = $("#form_id"),
                    edit_mode = (form_id.val()!=""?true:false),
                    save_text = (edit_mode ? "Update Design" : "Save Design"),
                    saving_text = (edit_mode ? "Updating Design..." : "Saving Design...");

                // disable save button
                elem.text(saving_text).attr("disabled", "disabled");

                // ajax post to card-designer-save.php
        		$.ajax({
            		type: "post",
        			url: "card-designer-save.php",
        			data: $("#card_designer_form").serialize(),
        			success: function(data, textStatus, jqXHR) {
            			// display message
            			//console.log(data, textStatus, jqXHR);
            			if (data.status == "error") {
                			var status_class = "text-danger";
            			} else {
                			var status_class = "text-" + data.status;
            			}
            			feedback.addClass(status_class).text(data.message).delay(2000).fadeOut("fast").removeClass("text-success");
            			if (data.status == "success") {
                			window.location.href = "card-designer?design_id=" + data.design_id;
                        }
        			},
        			error: function(jqXHR, textStatus, errorThrown) {
            			//console.log("error:", errorThrown, textStatus);
            			feedback.addClass("text-danger").text("There was an error").delay(2000).fadeOut("fast").removeClass("text-danger");
        			},
        			complete: function(jqXHR, textStatus, errorThrown) {
            			//console.log(jqXHR, textStatus, errorThrown);
            			// re-enable save button
                        elem.text(save_text).removeAttr("disabled");
                        loadUserDesignsCss($("#user_designs_css"));
                        loadUserDesigns($("#user_designs_container"));
        			}
        		});
            });
            
            $("#confirm_delete_btn").on("click", function(e) {
                var elem = $(this),
                    feedback = elem.siblings(".form-feedback").first(),
                    design_id = elem.closest("#card-designer-delete-form").find("input[name=design_id]").val();
                
                e.preventDefault();
                elem.attr("disabled", "disabled");
                $.ajax({
                    type: "post",
                    url: "card-designer-delete.php",
                    data: $("#card-designer-delete-form").serialize(),
        			success: function(data, textStatus, jqXHR) {
            			elem.text("Deleting Design...");
            			if (data.status == "error") {
                			var status_class = "text-danger";
            			} else {
                			var status_class = "text-" + data.status;
            			}
            			feedback.addClass(status_class).text(data.message).delay(2000).fadeOut("fast").removeClass("text-success");
            			if (data.status == "success") {
                            window.location.href = "card-designer-gallery?user_id=" + $("#design_user_id").val();
                        }
                    },
        			error: function(jqXHR, textStatus, errorThrown) {
            			feedback.addClass("text-danger").text("There was an error").delay(2000).fadeOut("fast").removeClass("text-danger").text("");
        			},
        			complete: function(jqXHR, textStatus, errorThrown) {
            			// re-enable delete button
                        elem.removeAttr("disabled");
        			}
               });
            });
            
            loadUserDesignsCss($("#user_designs_css"));
            loadUserDesigns($("#user_designs_container"));
            
            $("body").on("click", "#designer .edit_button", function() {
                var $this = $(this),
                    design_id = $this.attr("design-id");
                prepareFormForEdit(design_id);
            });
            
            $("body").on("click", "#designer .delete_button", function(e) {
                var $this = $(this),
                    design_id = $this.attr("design-id"),
                    delete_modal = $("#delete_design_modal"),
                    card_placeholder = delete_modal.find(".card-placeholder"),
                    delete_card = $("#card-designer-preview .player").eq(0).clone();
                e.preventDefault();

                delete_modal.find("input[name=design_id]").val(design_id);
                delete_modal.find(".modal_design_num").html(design_id);
                if (card_placeholder.children("div").length) {
                    card_placeholder.children("div").remove();
                }
                var placeholder_content = $("<div class=\"design-" + design_id + "\">");
                placeholder_content.html(delete_card);
                card_placeholder.append(placeholder_content);
                
                delete_modal.modal('show');
            });
        });