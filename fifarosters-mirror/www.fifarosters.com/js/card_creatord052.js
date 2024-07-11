var logging = false;

var selected_card_year = DEFAULT_CARD_YEAR;

var canvas_initialized = false;
var cors_server = 'https://fifarosters-cors-anywhere.herokuapp.com/';

var css_card;
var css_card_elements = {};
var serializer = new XMLSerializer();
var imgCanvas = new fabric.Canvas('image-canvas', { preserveObjectStacking: true });

if (selected_card_year > 18) {
    var imgCanvasCard = new fabric.Canvas('card-canvas', { width: 540, height: 820, preserveObjectStacking: true });
    var imgCanvasCard2 = new fabric.Canvas('card-canvas-2', { width: 540, height: 820, preserveObjectStacking: true });
} else {
    var imgCanvasCard = new fabric.Canvas('card-canvas', { width: 540, height: 810, preserveObjectStacking: true });
    var imgCanvasCard2 = new fabric.Canvas('card-canvas-2', { width: 540, height: 810, preserveObjectStacking: true });
}

var bgImage = new fabric.Image();
var bgImageCard = new fabric.Image();
var playerImageCard = new fabric.Image();
var playerImageTemp = new Image();
var playerImageFilters = fabric.Image.filters;
var bgImageCardOverlay = new fabric.Image();
var txtCardOverlay = new fabric.Textbox(
	'99',
	{
		originX: 'left',
		originY: 'top',
		editable: false,
		selectable: false,
		visible: false,
	}
);

var curveShine = false;

var curveShineNode = $(".card-curve-shine svg path")[0];

if(curveShineNode) {
	new fabric.Path.fromElement(curveShineNode, function(obj) {
		curveShine = obj;
		curveShine.set({
			fill: 'black',
			opacity: 0.3,
			visible: false
		});
	}, {
		globalCompositeOperation: 'source-atop'
	});
}

var bgImageCardShine = new fabric.Image();
var oldFadeImage = new fabric.Image();
var oldPlayerFade;
var playerFadeImageObj = new fabric.Image();
var playerGradientImageObj = new fabric.Image();
var playerGradientMask;
var playerFade;
var cloneBg;

var cardStar = false;
new fabric.loadSVGFromString('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>', function (objects, options) {
    var obj = fabric.util.groupSVGElements(objects, options);
    cardStar = obj;
    cardStar.set({
        fill: 'black',
        scaleY: 1.4,
        scaleX: 1.4,
        top: 0,
        left: 0,
        originX: 'left',
        originY: 'top'
    })
    .setCoords();
});

var cardGemini = false;
new fabric.loadSVGFromString('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><style>.cls-1 { fill-rule: evenodd; }</style></defs><path id="Color_Fill_1" data-name="Color Fill 1" class="cls-1" d="M2.48,1.2a19.73,19.73,0,0,0,19.04,0,8.582,8.582,0,0,1,.96,1.68,18.168,18.168,0,0,1-4.4,1.92L18,19.28a13.842,13.842,0,0,1,4.48,1.92,6.09,6.09,0,0,1-1.04,1.6,19.61,19.61,0,0,0-18.96,0,8.046,8.046,0,0,1-.96-1.76,21.849,21.849,0,0,1,4.4-1.84L6.08,4.8A17.477,17.477,0,0,1,1.52,2.88C1.8,2.363,1.909,2.116,2.48,1.2Zm5.6,4.08a21.2,21.2,0,0,0,7.92,0s0.008,12.56,0,13.52a17.889,17.889,0,0,0-7.92,0S7.983,6.968,8.08,5.28Z" transform="translate(0)"/></svg>', function (objects, options) {
    var obj = fabric.util.groupSVGElements(objects, options);
    cardGemini = obj;
    cardGemini.set({
        fill: 'black',
        scaleY: 1.4,
        scaleX: 1.4,
        top: 0,
        left: 0,
        originX: 'left',
        originY: 'top'
    })
    .setCoords();
});

var cardPlaystyle = [];

cardPlaystyle[1] = false;
cardPlaystyle[2] = false;
cardPlaystyle[3] = false;
cardPlaystyle[4] = false;

var playstyleSvgEl = document.querySelectorAll('.playercard-playstyle svg')[0];
var playstyleEl = document.querySelectorAll('.playercard-playstyle')[0];
var playstyleElStyles = window.getComputedStyle(playstyleEl);
var playstyleSvgStyles = window.getComputedStyle(playstyleSvgEl);
var playstylePathStyles = window.getComputedStyle(playstyleSvgEl.children[0]);

var playstyleSvgStr = serializer.serializeToString(playstyleSvgEl);

//new fabric.loadSVGFromString('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M12.813,104.953L68.157,21.862H188.143l55.045,83.091L128,235.138Z" fill-opacity="1" stroke-linejoin="round" stroke-width="8" stroke="#f5f0d8" fill="#3c2222"></path></svg>'
new fabric.loadSVGFromString(playstyleSvgStr, function (objects, options) {
    var obj = fabric.util.groupSVGElements(objects, options);
    cardPlaystyle[1] = obj;
	//var playstyleScale = parseInt(playstyleElStyles.getPropertyValue('width')) / cardPlaystyle[1].width;

	var width, height;

	if (playstyleSvgEl.parentNode.style.display === 'none') {
		playstyleSvgEl.parentNode.style.display = 'block';
		width = playstyleSvgEl.children[0].getBoundingClientRect().width;
		height = playstyleSvgEl.children[0].getBoundingClientRect().height;
		playstyleSvgEl.parentNode.style.display = 'none';
	} else {
		width = playstyleSvgEl.children[0].getBoundingClientRect().width;
		height = playstyleSvgEl.children[0].getBoundingClientRect().height;
	}

    cardPlaystyle[1].set({
        fill: playstylePathStyles.getPropertyValue('fill'),
				stroke: playstylePathStyles.getPropertyValue('stroke'),
        top: parseFloat(playstyleElStyles.getPropertyValue('top')),
        left: parseFloat(playstyleElStyles.getPropertyValue('left')),
				scaleX: parseFloat(width / .4) / cardPlaystyle[1].width,
				scaleY: parseFloat(height / .4) / cardPlaystyle[1].height,
        originX: 'left',
        originY: 'top',
		visible: false
    })
    .setCoords();
});

var cardPlaystyleIcon = [];
cardPlaystyleIcon[1] = false;
cardPlaystyleIcon[2] = false;
cardPlaystyleIcon[3] = false;
cardPlaystyleIcon[4] = false;

var playstyleIconEl = document.querySelectorAll('.playercard-playstyle .icon')[0];
var playstyleIconElStyles = window.getComputedStyle(playstyleIconEl);
var cardPlaystyleIcon = [];

cardPlaystyleIcon[1] = new fabric.Textbox(
	'',
	{
		originX: 'left',
		originY: 'top',
		textAlign: 'center',
        top: parseFloat(playstyleElStyles.getPropertyValue('top')) + parseFloat(playstyleIconElStyles.getPropertyValue('padding-top')),
        left: parseFloat(playstyleElStyles.getPropertyValue('left')),
		fontSize: parseFloat(playstyleIconElStyles.getPropertyValue('font-size')),
		width: parseFloat(playstyleSvgEl.children[0].getBoundingClientRect().width/.4),
		visible: false,
	}
);



cardPlaystyle[2] = fabric.util.object.clone(cardPlaystyle[1]);
cardPlaystyle[3] = fabric.util.object.clone(cardPlaystyle[1]);
cardPlaystyle[4] = fabric.util.object.clone(cardPlaystyle[1]);

cardPlaystyleIcon[2] = fabric.util.object.clone(cardPlaystyleIcon[1]);
cardPlaystyleIcon[3] = fabric.util.object.clone(cardPlaystyleIcon[1]);
cardPlaystyleIcon[4] = fabric.util.object.clone(cardPlaystyleIcon[1]);

var cardSquadChemistry = new fabric.Image();
var cardSquadPosition = new fabric.Image();
var cardSquadPositionText = new fabric.Textbox(
	'',
	{
		top: 650,
		left: imgCanvasCard.width/2,
		originX: 'center',
		originY: 'top',
		editable: false,
		selectable: false,
		visible: false,
	}
)

var copyright_group = null;

var items = [];
var itemsImgs = [];
var itemsImgsCustom = [];

var faceImg = new fabric.Image();
var imgCardClub = new fabric.Image();
var imgCardLeague = new fabric.Image();
var imgCardNation = new fabric.Image();

var cardBar = new fabric.Rect({
		originX: 'left',
		originY: 'top',
		visible: false,
		editable: false,
		selectable: false,
		evented: false,
    });

var txtName = new fabric.Textbox(
	'',
	{
		originX: 'left',
		originY: 'top',
		editable: false,
		selectable: false,
		evented: false,
	}
);
var txtRating = new fabric.Textbox(
	'',
	{
		originX: 'left',
		originY: 'top',
		editable: false,
		selectable: false,
		evented: false,
	}
);
var txtPosition = new fabric.Textbox(
	'',
	{
		originX: 'left',
		originY: 'top',
		editable: false,
		selectable: false,
		evented: false,
	}
);
var txtSecondaryIcon = new fabric.Textbox(
	'',
	{
		originX: 'left',
		originY: 'top',
		textAlign: 'center',
		editable: false,
		selectable: false,
		evented: false,
	}
);
var txtChemistry = new fabric.Textbox(
	'',
	{
		originX: 'left',
		originY: 'top',
		textAlign: 'center',
		editable: false,
		selectable: false,
		evented: false,
		visible: false,
	}
);

var txtSkillLabel = new fabric.Textbox(
    'SKILL',
    {
        originX: 'left',
        originY: 'top',
        textAlign: 'center',
        fontCharacterStyle: 'Caps',
        editable: false,
        selectable: false,
		evented: false,
    }
);
var txtWeakLabel = new fabric.Textbox(
    'WEAK',
    {
        originX: 'left',
        originY: 'top',
        textAlign: 'center',
        editable: false,
        selectable: false,
		evented: false,
    }
);
var txtFootLabel = new fabric.Textbox(
    'FOOT',
    {
        originX: 'left',
        originY: 'top',
        textAlign: 'center',
        editable: false,
        selectable: false,
		evented: false,
    }
);
var txtWorkRatesLabel = new fabric.Textbox(
    'WORK',
    {
        originX: 'left',
        originY: 'top',
        textAlign: 'center',
        editable: false,
        selectable: false,
		evented: false,
    }
);
var txtSkillVal = new fabric.Textbox(
    '0',
    {
        originX: 'left',
        originY: 'top',
        textAlign: 'center',
        editable: false,
        selectable: false,
		evented: false,
    }
);
var txtWeakVal = new fabric.Textbox(
    '0',
    {
        originX: 'left',
        originY: 'top',
        textAlign: 'center',
        editable: false,
        selectable: false,
		evented: false,
    }
);
var txtFootVal = new fabric.Textbox(
    '-',
    {
        originX: 'left',
        originY: 'top',
        textAlign: 'center',
        editable: false,
        selectable: false,
		evented: false,
    }
);
var txtWorkRatesVal = new fabric.Textbox(
    '-/-',
    {
        originX: 'left',
        originY: 'top',
        textAlign: 'center',
        editable: false,
        selectable: false,
		evented: false,
    }
);

var divider2019 = [];

var txtAttr = [];
var txtAttrDesc = [];

var bMini = false;

var g_fonts = [
    "CruyffSansBold",
    "CruyffSansLight",
    "CruyffSansMedium",
    "CruyffSansRegular",
	"DinProCondensed",
	"DinProCondensedLight",
	"DinProCondensedMedium",
	"DinProCondensedBold",
	"DinPro",
	"DinProLight",
	"DinProMedium",
	"DinProBold",
	"Champions",
	"fifa-chemistry",
    "Knul",
    "Knul-Bold",
	"Qatar2022-Medium"
];
var secondary_fonts = [
	"Dusha",
	"EASans-Curves",
	"EASans",
	"EASans-Bold",
	"EASans-Black",
	"EASans-BlackItalic",
	"exo 2",
	"FontAwesome"
];

var current_card_color;
var current_card_rgb;
var all_card_colors;

function setCurrentCardColors(custom) {
    if (typeof custom !== 'undefined') {
        current_card_color = custom;
    } else if (typeof all_card_colors !== 'undefined' && all_card_colors !== '') {
        current_card_color = all_card_colors[$("#form-card-color").val()].card;
    } else {
        current_card_color = '#000000';
    }
    current_card_rgb = new RGBColor(current_card_color);
    if ($("#form-fade-color").length > 0) {
        $("#form-fade-color").spectrum("set", current_card_color);
    }
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

function initCanvas() {
	// this.canvas = new fabric.Canvas('canvas', {
	// 	width: this.width,
	// 	height: this.height,
	// 	backgroundColor: '#fff',
	// 	preserveObjectStacking: true
	// });
	
    setCurrentCardColors();

	var card_year = $("#form-card-year").val();
	var card_colors_year = card_year > 22 ? card_year : 22;

    readTextFile("data/fifa" + card_colors_year + "/cardColors.json", function(text){
        all_card_colors = JSON.parse(text);
        setCurrentCardColors();
    });

    canvas_initialized = true;

	fabric.Image.fromURL('assets/backgrounds/FIFA_19/Stadium-Background.jpg', function(obj){
		obj.set({
			top: imgCanvas.width / 2,
			left: imgCanvas.height / 2,
			originX: 'center',
			originY: 'center',
			editable: false,
			selectable: false,
			evented: false,
		});
		bgImage = obj;
		imgCanvas.add(bgImage);
		bgImage.moveTo(0);
	}, {
		crossOrigin: 'Anonymous'
	});

	// card creator //
	imgCanvasCard.setWidth(parseFloat(css_card.width()));
	imgCanvasCard.setHeight(parseFloat(css_card.height()));

	imgCanvasCard2.setWidth(parseFloat(css_card.width()));
	imgCanvasCard2.setHeight(parseFloat(css_card.height()));
	
    // Create mask
    playerGradientMask = new fabric.Rect({
        top: 0,
        left: 0,
        width: imgCanvasCard.width,
        height: imgCanvasCard.height,
        fill: 'rgba(0, 0, 0, 1)',
        visible: false,
        editable: false,
        selectable: false,
        evented: false,
    });

    playerFade = new fabric.Rect({
        top: 0,
        left: 0,
        width: imgCanvasCard.width,
        height: imgCanvasCard.height, 
        fill: 'rgba(0, 0, 0, 1)',
        visible: false,
        editable: false,
        selectable: false,
        evented: false,
    });
    
    // Old Fade
    oldPlayerFade = new fabric.Circle({
        radius: imgCanvasCard.width*0.75,
        top: (card_year < 24 ? -450 : -350),
        left: -imgCanvasCard.width/4,
        fill: 'rgba(200, 200, 200, .5)',
        visible: true,
        editable: false,
        selectable: false,
        evented: false,
     });
    
    oldPlayerFade.setGradient('fill', {
        type: 'radial',
        x1: oldPlayerFade.width/2,
        y1: oldPlayerFade.height/2,
        x2: oldPlayerFade.width/2,
        y2: oldPlayerFade.height/2,
        r1: oldPlayerFade.width/2,
        r2: 100,
        colorStops: {
            0: 'transparent',
            0.25: 'green',
            1: 'green'
        }
    });

    //imgCanvasCard.add(playerGradientMask);
    //imgCanvasCard.add(playerFade);
    imgCanvasCard.renderAll();


	imgCanvasCard.add(cardSquadPosition);
	cardSquadPosition.moveTo(0);
	


	cardSquadPosition.setSrc('assets/squad-builder/pos_base_oval.png', function(obj) {
		var scaleFactor = 3.2;
		obj.set({
			top: 650,
			left: imgCanvasCard.width/2,
			originX: 'center',
			originY: 'top',
			editable: true,
			selectable: true,
			evented: true,
			scaleX:  scaleFactor,
			scaleY:  scaleFactor,
			visible: false
		});
		
		imgCanvasCard.add(obj);
		obj.moveTo(0);
		imgCanvasCard.sendToBack(obj);
		imgCanvasCard.renderAll();
	}, {
		crossOrigin: 'Anonymous'
	});
	// background image
	/*
	var bg = css_card.css('background-image');
	bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
	*/
	bg = "assets/cards/fifa20/cards_bg_e_1_3_3.png";
	
	bgImageCard.setSrc(bg, function(obj){
    	var scaleFactor = imgCanvasCard.width / obj.width;
		obj.set({
			top: 0,
			left: 0,
			originX: 'left',
			originY: 'top',
			scaleX: scaleFactor,
			scaleY: scaleFactor,
			editable: false,
			selectable: false,
			evented: false,
		});
		imgCanvasCard.add(obj);
		obj.moveTo(1);
		imgCanvasCard.renderAll();
	}, {
		crossOrigin: 'Anonymous'
	});
	
	oldFadeImage.set({
    	visible: false,
    });

	playerFadeImageObj.set({
		visible: false,
	});
	
	playerGradientImageObj.set({
		visible: false,
		editable: false,
		selectable: false,
		evented: false
	});

	imgCanvasCard.add(playerImageCard);
	playerImageCard.moveTo(5);

    imgCanvasCard.add(oldFadeImage);
	oldFadeImage.moveTo(6);

	imgCanvasCard.add(playerFadeImageObj);
	playerFadeImageObj.moveTo(6);

	imgCanvasCard.add(playerGradientImageObj);
	playerGradientImageObj.moveTo(6);

	imgCanvasCard.add(cardBar);
	cardBar.moveTo(10);
	
	loadFonts();
	
	imgCanvasCard.on('object:scaled', function(options) {
        if (options.target.cacheKey == "texture2") {
            updatePlayerImageSizeFormInput(options.target.scaleX);
        }
	});
}

var loadTry = 0;
function loadFonts() {
    Promise.all(
        g_fonts.map(font_ => new FontFaceObserver(font_).load(null, 5000))
	).then(function() {
		var txtCopyright1 = new fabric.Text(
			'MADE ON',
			{
				originX: 'right',
				originY: 'bottom',
				fill: "white",
				fontSize: 14,
				editable: false,
		    	fontFamily: "DinProCondensed",
		    	left: imgCanvas.width - 126,
		    	opacity: 0.6,
		    	top: imgCanvas.height
		});
		var txtCopyright2 = new fabric.Text(
			'FifaRosters.com',
			{
				originX: 'right',
				originY: 'bottom',
				fill: "white",
				fontStyle: 'italic',
				fontSize: 14,
				editable: false,
		    	fontFamily: "exo 2",
		    	left: imgCanvas.width - 16,
		    	opacity: 0.6,
		    	top: imgCanvas.height
		});
	    copyright_group = new fabric.Group([ txtCopyright1, txtCopyright2 ], {
		});
    	imgCanvas.add(copyright_group);

		cardSquadPositionText.set({
			text: 'CAM',
			fontFamily: 'DinProCondensed',
			fontSize: 30,
			fill: 'white'
		});

        // add card elements
        imgCanvasCard.add(curveShine);
        imgCanvasCard.add(cardStar);
        imgCanvasCard.add(cardGemini);
        imgCanvasCard.add(cardPlaystyle[1]);
        imgCanvasCard.add(cardPlaystyle[2]);
        imgCanvasCard.add(cardPlaystyle[3]);
        imgCanvasCard.add(cardPlaystyle[4]);
        imgCanvasCard.add(cardPlaystyleIcon[1]);
        imgCanvasCard.add(cardPlaystyleIcon[2]);
        imgCanvasCard.add(cardPlaystyleIcon[3]);
        imgCanvasCard.add(cardPlaystyleIcon[4]);
		imgCanvasCard.add(cardSquadChemistry);
		imgCanvasCard.add(cardSquadPositionText);
        imgCanvasCard.add(txtName);
        imgCanvasCard.add(txtRating);
        imgCanvasCard.add(txtPosition);
        imgCanvasCard.add(imgCardClub);
        imgCanvasCard.add(imgCardLeague);
        imgCanvasCard.add(imgCardNation);
        imgCanvasCard.add(txtSecondaryIcon);
        imgCanvasCard.add(txtChemistry);
        imgCanvasCard.add(txtSkillLabel);
        imgCanvasCard.add(txtWeakLabel);
        imgCanvasCard.add(txtFootLabel);
        imgCanvasCard.add(txtWorkRatesLabel);
        imgCanvasCard.add(txtSkillVal);
        imgCanvasCard.add(txtWeakVal);
        imgCanvasCard.add(txtFootVal);
        imgCanvasCard.add(txtWorkRatesVal);

		cardSquadPositionText.moveTo(2);

        curveShine.moveTo(7);
        cardStar.moveTo(14);
        cardGemini.moveTo(14);
		cardSquadChemistry.moveTo(16);
        txtName.moveTo(15);
        txtRating.moveTo(15);
        txtPosition.moveTo(15);
        imgCardClub.moveTo(15);
        imgCardLeague.moveTo(15);
        imgCardNation.moveTo(15);
        txtSecondaryIcon.moveTo(15);
        txtChemistry.moveTo(15);
        txtSkillLabel.moveTo(15);
        txtWeakLabel.moveTo(15);
        txtFootLabel.moveTo(15);
        txtWorkRatesLabel.moveTo(15);
        txtSkillVal.moveTo(15);
        txtWeakVal.moveTo(15);
        txtFootVal.moveTo(15);
        txtWorkRatesVal.moveTo(15);

        //attributes
        $.each([1, 2, 3, 4, 5, 6], function(index, value) {
            var txtAttr_ = new fabric.Textbox(
                '',
                {
                    originX: 'left',
                    originY: 'top',
                    fontSize: 56,
                    editable: false,
                    selectable: false,
                    evented: false,
                });
            var txtAttrDesc_ = new fabric.Textbox(
                '',
                {
                    originX: 'left',
                    originY: 'top',
                    fontSize: 52,
                    editable: false,
                    selectable: false,
                    evented: false,
                });
    		txtAttr.push(txtAttr_);
    		txtAttrDesc.push(txtAttrDesc_);
    		
    		imgCanvasCard.add(txtAttr_);
    		imgCanvasCard.add(txtAttrDesc_);
            txtAttr_.moveTo(15);
            txtAttrDesc_.moveTo(15);
    	});
    
        //dividers
    	$.each([1, 2, 3, 4, 5], function(index, value) {
    		var divider2019_ = new fabric.Line([0, 0, 10, 0], {
        		fill: 'black',
        		stroke: 'black',
        		strokeWidth: 1,
    		    selectable: false,
    		    editable: false,
    		    evented: false,
    		});
    		divider2019.push(divider2019_);
    		imgCanvasCard.add(divider2019_);
            divider2019_.moveTo(15);
    	});

    	// shine
        bgImageCardShine.setSrc('assets/cards/fifa19/hd-special-shine.png', function(obj){
    		obj.set({
    			top: 0,
    			left: 0,
    			editable: false,
    			selectable: false,
    			evented: false,
    			scaleX:  imgCanvasCard.width / parseFloat(obj.width),
    			scaleY:  imgCanvasCard.height / parseFloat(obj.height),
    			visible: false
    		});
    		imgCanvasCard.add(obj);
    		obj.moveTo(20);
    		imgCanvasCard.renderAll();
    	}, {
    		crossOrigin: 'Anonymous'
    	});
    
    	// overlay
        bgImageCardOverlay.setSrc('assets/cards/fifa19/overlays/overlay_specials_expired.png', function(obj){
    		obj.set({
    			top: 0,
    			left: 0,
    			originX: 'left',
    			originY: 'top',
    			editable: true,
    			selectable: true,
    			evented: true,
    			scaleX:  imgCanvasCard.width / parseFloat(obj.width),
    			scaleY:  imgCanvasCard.height / parseFloat(obj.height),
    			visible: false
    		});
    		
    		imgCanvasCard.add(obj);
    		obj.moveTo(25);
    		imgCanvasCard.add(txtCardOverlay);
    		txtCardOverlay.moveTo(30);
    		imgCanvasCard.renderAll();
    	}, {
    		crossOrigin: 'Anonymous'
    	});

		// chemistry
		cardSquadChemistry.setSrc('assets/cards/fifa23/extras/chemistry-3.png', function(obj){
			obj.set({
				top: 0,
				left: 0,
				originX: 'left',
				originY: 'top',
				editable: true,
				selectable: true,
				evented: true,
				scaleX:  1,
				scaleY:  1,
				visible: false
			});
			
			imgCanvasCard.add(obj);
			obj.moveTo(25);
			imgCanvasCard.renderAll();
		}, {
			crossOrigin: 'Anonymous'
		});

    	imgCanvasCard.renderAll();
    
        updateCardFormatCanvas();
	}, function() {
        if (loadTry > 4) {
            alert("Fonts did not load properly. Please try refreshing the page.");
        } else {
            console.log("Fonts didn't load in time, trying again.");
            loadTry++;
            loadFonts();
        }
	});
}

function addItem(){
	var itemImg = new fabric.Image();
	imgCanvas.add(itemImg);
	itemsImgs.push(itemImg);

	var itemImgCustom = new fabric.Image();
	imgCanvas.add(itemImgCustom);
	itemsImgsCustom.push(itemImgCustom);

	var item = new fabric.Text(
		'TEXT',
		{
			top: imgCanvas.width / 2,
			left: imgCanvas.height / 2,
			originX: 'center',
			originY: 'center',
			fill: 'white',
			fontSize: 50,
			fontFamily: "Champions"
		}
	);
	
	itemImg.visible = false;
	itemImgCustom.visible = false;

	items.push(item);
	imgCanvas.add(item);

	imgCanvas.renderAll();
}

function updateDirect(value) {
    var elem = css_card_elements[value];
    elem.html($("#form-card-" + value).val());
    if (canvas_initialized) {
    	switch(value){
    		case 'rating':
    			updateRatingCanvas();
    			break;
    		case 'position':
    			updatePlayerPositionCanvas();
    			break;
    		case 'name':
    			updateNameCanvas();
				break;
    		case 'attackingworkrate':
    		case 'defensiveworkrate':
    			updateSkillWorkWeakCanvas();
    			break;
    		default:
    			break;
    	}
    }
}

function updateYear() {
    if (logging) {
        console.log("updateYear");
    }
	var card_year = $("#form-card-year").val(),
	    card_format_container = $(".card-format-group");
	$("#playercard_container_wrap .playercard, .card-color-widget .card_style_choices .playercard")
		.removeClass("fut15 fut16 fut17 fut18 fut19 fut20 fut21 fut22 fut23 fut24").addClass("fut" + card_year);
	if (card_year > 16) {
		css_card.removeAttr("style");
		if (!css_card.hasClass("xl-to-large")) {
    		css_card.addClass("xl-to-large");
		}
		css_card.find(".playercard")
			.removeClass("card-large").addClass("card-xl");
	} else {
		// $("#playercard_container .player").attr("style", "transform:none");
		css_card.removeClass("xl-to-large");
		css_card.find(".playercard")
			.removeClass("card-xl").addClass("card-large");
	}

	$("#card_selector_btn").attr("target", "card_selector_modal_" + card_year);
	$("#card_selector_btn").attr("data-target", "#card_selector_modal_" + card_year);

    // Mini format only available for FIFA 17+
    if (card_year == 16) {
        $("input[name='form-card-format'][value='full']").prop("checked", true).trigger("click");
        card_format_container.hide();
    } else {
        card_format_container.show();
    }

	// First owner only for FIFA 24+
	if (card_year > 23) {
		$("#form-card-secondary-icon-toggle").prop("checked", true).trigger("change");
		$("#form-card-secondary-icon-toggle").closest("label").show();
		$("#form-card-playstyle-toggle").prop("disabled", false).trigger("change");
    } else {
		$("#form-card-secondary-icon-toggle").prop("checked", false).trigger("change");
		$("#form-card-secondary-icon-toggle").closest("label").hide();
		$("#form-card-playstyle-toggle").prop({
			"disabled": true,
			"checked": false
		}).trigger("change");
    }
    
    selected_card_year = card_year;

	updateCardFormat();
	updateFormCardOverlay();
	updateFormCardDynamicCover();
	
	var community_designs_container = $("#card-designer-community-designs");
	if (community_designs_container.attr("loaded-year") !== card_year) {
        community_designs_container.html("");
    }
}

function setCardTxtFontAndColor(){
	var baseFont = css_card_elements.name.css('font-family');

	var fontName = css_card_elements.name.css('font-family');
	var colorName = css_card_elements.name.css('color');

	var fontRating = css_card_elements.rating.css('font-family');
	var colorRating = css_card_elements.rating.css('color');

	var fontPosition = css_card_elements.position.css('font-family');
	var colorPosition = css_card_elements.position.css('color');

	var fontAttrRating = css_card.find(".fut-rating").css('font-family');
	var colorAttrRating = css_card.find(".fut-rating").css('color');

	var fontAttrDesc = css_card.find(".fut-label").css('font-family');
	var colorAttrDesc = css_card.find(".fut-label").css('color');

	var colorSkill = css_card_elements.skillmoves.css('color');

	var colorSecondaryIcon = css_card_elements.secondaryIcon.find(".text").css('color');
	var fontChemistry = css_card_elements.chemistry.find(".icon").css('font-family');
	var colorChemistry = css_card_elements.chemistry.find(".chemistry-label").css('color');

/*
	Promise.all(
	  g_fonts.map(font_ => new FontFaceObserver(font_).load())
	).then(function() {
    	*/
    	txtName.set({ 'fill': colorName, 'fontFamily': fontName, });
		txtRating.set({ 'fill': colorRating, 'fontFamily': fontRating, });
		txtPosition.set({ 'fill': colorPosition, 'fontFamily': fontPosition, });
		txtSecondaryIcon.set({ 'fill': colorChemistry, 'fontFamily': fontChemistry, });
		txtChemistry.set({ 'fill': colorChemistry, 'fontFamily': fontChemistry, });

		txtSkillLabel.set({ 'fill': colorSkill, 'fontFamily': baseFont,});
		txtWeakLabel.set({ 'fill': colorSkill, 'fontFamily': baseFont,});
		txtFootLabel.set({ 'fill': colorSkill, 'fontFamily': baseFont,});
		txtWorkRatesLabel.set({ 'fill': colorSkill, 'fontFamily': baseFont,});
		txtSkillVal.set({
            'fill': colorSkill,
            styles: {
                0: {
                    0: {
                        'fontFamily': baseFont,
                    },
                    1: {
                        'fontFamily': baseFont,
                    },
                    2: {
                        'fontFamily': 'FontAwesome'
                    }
                }
            }
        });
		txtWeakVal.set({
            'fill': colorSkill,
            styles: {
                0: {
                    0: {
                        'fontFamily': baseFont,
                    },
                    1: {
                        'fontFamily': baseFont,
                    },
                    2: {
                        'fontFamily': 'FontAwesome'
                    }
                }
            }
        });
		txtFootVal.set({ 'fill': colorSkill, 'fontFamily': baseFont,});
		txtWorkRatesVal.set({ 'fill': colorSkill, 'fontFamily': baseFont,});

		$.each([1, 2, 3, 4, 5, 6], function(index, value) {
			txtAttr[index].set({
				'fill': colorAttrRating,
				'fontFamily': fontAttrRating,
			});
			txtAttrDesc[index].set({
				'fill': colorAttrDesc,
				'fontFamily': fontAttrDesc,
			});
		});
		
		cardStar.set({ 'fill': colorRating });
        cardGemini.set({ 'fill': colorRating });
		cardPlaystyle[1].set({ 'fill': current_card_color, 'stroke': colorRating });
		cardPlaystyleIcon[1].set({ 'fill': colorRating, 'fontFamily': fontChemistry });
		cardPlaystyle[2].set({ 'fill': current_card_color, 'stroke': colorRating });
		cardPlaystyleIcon[2].set({ 'fill': colorRating, 'fontFamily': fontChemistry });
		cardPlaystyle[3].set({ 'fill': current_card_color, 'stroke': colorRating });
		cardPlaystyleIcon[3].set({ 'fill': colorRating, 'fontFamily': fontChemistry });
		cardPlaystyle[4].set({ 'fill': current_card_color, 'stroke': colorRating });
		cardPlaystyleIcon[4].set({ 'fill': colorRating, 'fontFamily': fontChemistry });
		
		imgCanvasCard.renderAll();
//	});
}

function toggle3dCard() {
	var card_year = $("#form-card-year").val(),
	    card_3d = $("#form-card-3d-toggle").prop("checked"),
	    card_container = css_card,
		css_class = card_colors[$("#form-card-color").val()].css_class;
	card_container.removeClass(all_card_classes);
    if (card_3d) {
        card_container.toggleClass("card-3d", true).addClass(css_class);
    } else {
        card_container.toggleClass("card-3d", false);
    }
}

function updateCardShine() {
	var card_shine = $("#form-card-shine").prop("checked"),
	    card = css_card.find(".playercard");
    card.toggleClass("card-shine", card_shine);
    if (canvas_initialized) {
        updateCardShineCanvas();
    }
}

function updateCardShineCanvas(){
	var card_shine = $("#form-card-shine").prop("checked"),
	    card = css_card.find(".playercard");
	if(card.hasClass('card-shine')){
	    bgImageCardShine.visible = true;
	} else {
		bgImageCardShine.visible = false;
	}
    imgCanvasCard.renderAll();
}
function updateCurveShineCanvas() {
	var card_curve_shine = $("#form-card-curve-shine-toggle").prop("checked"),
	    card = css_card.find(".playercard"),
	    curveShineContainer = card.find(".card-curve-shine");
    curveShineContainer.toggle(card_curve_shine);
    
    var elem_styles = window.getComputedStyle(curveShineContainer[0]);
    
	// curve shine
	var curveShineNode = $(".card-curve-shine svg path")[0];
	var curveShineColor = elem_styles.getPropertyValue('color');
	if (curveShine.path) {
        curveShine.set({
            fill: curveShineColor,
            visible: card_curve_shine
        });
	} else {
        new fabric.Path.fromElement(curveShineNode, function(obj) {
            curveShine = obj;
            curveShine.set({
                fill: curveShineColor,
                opacity: 0.3,
                visible: card_curve_shine
            });
            imgCanvasCard.add(curveShine);
            curveShine.moveTo(7);
        }, {
            globalCompositeOperation: 'source-atop'
        });
    }
    
    imgCanvasCard.renderAll();
}


function updateFormCardCurveShine() {
	var card_year = $("#form-card-year").val(),
	    card_format = $("input[name='form-card-format']:checked").val(),
	    card_curve_shine = $("#form-card-curve-shine-toggle"),
	    card_curve_shine_label = card_curve_shine.closest("label");
    if (card_year > 18 && card_format == 'full') {
        card_curve_shine.removeAttr("disabled");
    } else {
        // Card shine only available on full size FIFA 17 and up
        card_curve_shine_label.find("input").attr("disabled", "disabled");
        card_curve_shine.prop("checked", false);
    }
    if (canvas_initialized) {
        updateCurveShineCanvas();
    }
}

function updateFormCardShine() {
	var card_year = $("#form-card-year").val(),
	    card_format = $("input[name='form-card-format']:checked").val(),
	    card_shine = $("#form-card-shine-toggle"),
	    card_shine_label = card_shine.closest("label");
    if (card_year > 17) {
        card_shine.removeAttr("disabled");
    } else {
        // Card shine only available on full size FIFA 17 and up
        card_shine_label.find("input").attr("disabled", "disabled");
        card_shine.prop("checked", false);
    }
    updateCardShine();
}

var dynamicCoverTimeout;
var oldFadeImageTemp = new Image();
var playerFadeImageTemp = new Image();
var playerGradientImageTemp = new Image();

function updateDynamicImageCoverCanvas() {
    if (logging) {
        console.log("updateDynamicImageCoverCanvas");
    }
	var card_year = $("#form-card-year").val(),
	    card_format = $("input[name='form-card-format']:checked").val(),
	    dynamic_cover = css_card_elements.dynamicCover,
	    bg = dynamic_cover.css('background-image'),
	    use_fade_image = $("#form-dynamic-image-cover").prop("checked"),
	    use_old_fade_image = $("#form-dynamic-image-cover-old").prop("checked");

	bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");

    if (!use_fade_image && !use_old_fade_image) {
        oldFadeImage.visible = false;
        playerImageCard.visible = true;
        playerGradientImageObj.visible = false;
        imgCanvasCard.renderAll();
        imgCanvasCard2.remove(cloneBg);
        imgCanvasCard2.remove(oldPlayerFade);
        imgCanvasCard2.clear();
        imgCanvasCard2.renderAll();
    } else {
        if (card_year < 20) {
            if (bg == "none") {
                oldFadeImage.visible = false;
                playerFadeImageObj.visible = false;
                imgCanvasCard.renderAll();
                imgCanvasCard2.clear();
                imgCanvasCard2.renderAll();
            } else {
                // Use dynamic cover image
                oldFadeImage.setSrc(bg, function(obj) {
                    var scaleFactor = imgCanvasCard.width / obj.width;
                    obj.set({
                        visible: dynamic_cover.css('display') !== 'none',
                        top: 0,
                        left: 0,
                        originX: 'left',
                        originY: 'top',
                        scaleX: scaleFactor,
                        scaleY: scaleFactor,
                        editable: false,
                        selectable: false,
                        evented: false,
                    });
                    imgCanvasCard.renderAll();
                }, {
                    crossOrigin: 'Anonymous'
                });
            }
        } else {
            // FIFA 20 or newer
            // clearTimeout prevents mask bug when is called more than once too quickly
            clearTimeout(dynamicCoverTimeout);
            dynamicCoverTimeout = setTimeout((function() {
                
                if (use_old_fade_image) {
                    // Clone card bg onto canvas2
                    bgImageCard.clone(function(cloned) {
                        // Reset clone canvas workspace
                        imgCanvasCard2.clear();
                        imgCanvasCard2.renderAll();
        
                        imgCanvasCard2.add(oldPlayerFade);
                        imgCanvasCard2.renderAll();
    
                        cloneBg = cloned;
                        imgCanvasCard2.add(cloneBg);
                        cloned.set({
                            globalCompositeOperation: 'source-out'
                        });
                        imgCanvasCard2.renderAll();
                        
                        // export canvas2 faded image to canvas1
                        if (oldFadeImageTemp.hasOwnProperty("src") && oldFadeImageTemp.src != "") {
                            window.URL.revokeObjectURL(oldFadeImageTemp.src);
                        }
                        try {
                            var blob = dataURLtoBlob(imgCanvasCard2.toDataURL());
                            var objectURL = window.URL.createObjectURL(blob);
                            oldFadeImageTemp.src = objectURL;
                            oldFadeImageTemp.onload = function () {
                                oldFadeImage.setSrc(oldFadeImageTemp.src, function(obj) {
                            	    var scaleFactor = imgCanvasCard.width / obj.width;
                            		obj.set({
                            			visible: true,
                            			top: 0,
                            			left: 0,
                            			originX: 'left',
                            			originY: 'top',
                            			scaleX: scaleFactor,
                            			scaleY: scaleFactor,
                            			editable: false,
                            			selectable: false,
                            			evented: false,
                            		});
                            		imgCanvasCard.renderAll();
                            	}, {
                            		crossOrigin: 'Anonymous',
                            		globalCompositeOperation: 'source-over'
                            	});
                            };
                        } catch (e) {
                            console.log("Something failed. " + e);
                        }
                    });
                }
                
                if (use_fade_image) {
					if (card_year < 24) {
						var playerGradientMaskStops_full = {
							0: 'transparent',
							0.47: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 0)',
							0.54: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', .7)',
							1: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', .7)'
						};
						var playerFadeStops_full = {
							0: 'transparent',
							0.58: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 0)',
							0.66: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 1)',
							1: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 1)'
						};
						var playerGradientMaskStops_mini = {
							0: 'transparent',
							0.62: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 0)',
							0.69: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', .7)',
							1: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', .7)'
						};
						var playerFadeStops_mini = {
							0: 'transparent',
							0.74: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 0)',
							0.81: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 1)',
							1: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 1)'
						};
					} else {
						var playerGradientMaskStops_full = {
							0: 'transparent',
							0.55: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 0)',
							0.62: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', .7)',
							1: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', .7)'
						};
						var playerFadeStops_full = {
							0: 'transparent',
							0.62: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 0)',
							0.72: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 1)',
							1: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 1)'
						};
						var playerGradientMaskStops_mini = {
							0: 'transparent',
							0.65: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 0)',
							0.77: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', .7)',
							1: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', .7)'
						};
						var playerFadeStops_mini = {
							0: 'transparent',
							0.77: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 0)',
							0.88: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 1)',
							1: 'rgba(' + current_card_rgb.r + ', ' + current_card_rgb.g + ', ' + current_card_rgb.b + ', 1)'
						};
					}

                    playerGradientMask.setGradient('fill', {
                        type: 'linear',
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: playerGradientMask.height,
                        colorStops: bMini ? playerGradientMaskStops_mini : playerGradientMaskStops_full
                    });
                    
                    playerFade.setGradient('fill', {
                        type: 'linear',
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: playerFade.height,
                        colorStops: bMini ? playerFadeStops_mini : playerFadeStops_full
                    });
                    
                    // Clone card player image onto canvas2
                    playerImageCard.clone(function(cloned) {
                        // crop playerGradientMask - source-atop
    
                        // Reset clone canvas workspace
                        imgCanvasCard2.clear();
                        imgCanvasCard2.renderAll();
    
                        // Add cloned player image
                        cloned.visible = true;
                        imgCanvasCard2.add(cloned);
                        imgCanvasCard2.renderAll();
    
                        // Add gradient rect on top of player image
                        imgCanvasCard2.add(playerGradientMask);
                        playerGradientMask.set({
                            visible: true,
                            globalCompositeOperation: 'source-atop'
                        });
                        imgCanvasCard2.renderAll();
                        
                        imgCanvasCard2.add(playerFade);
                        playerFade.set({
                            visible: true,
                            globalCompositeOperation: 'destination-out'
                        });
                        imgCanvasCard2.renderAll();
                        
                        // export canvas2 gradient image to temp img on canvas1
                        if (playerGradientImageTemp.hasOwnProperty("src") && playerGradientImageTemp.src != "") {
                            window.URL.revokeObjectURL(playerGradientImageTemp.src);
                        }
                        try {
                            var blob = dataURLtoBlob(imgCanvasCard2.toDataURL());
                            var objectURL = window.URL.createObjectURL(blob);
                            playerGradientImageTemp.src = objectURL;
                            playerGradientImageTemp.onload = function () {
                                playerGradientImageObj.visible = true;
                                playerGradientImageObj.setSrc(playerGradientImageTemp.src, function(obj) {
                            	    var scaleFactor = imgCanvasCard.width / obj.width;
                            		obj.set({
                            			visible: true,
                            			top: 0,
                            			left: 0,
                            			originX: 'left',
                            			originY: 'top',
                            			scaleX: scaleFactor,
                            			scaleY: scaleFactor,
                            			editable: false,
                            			selectable: false,
                            			evented: false
                            		}).setCoords();
                            		
                                    playerImageCard.visible = false;
                            		imgCanvasCard.renderAll();
                            	}, {
                            		crossOrigin: 'Anonymous',
                            		globalCompositeOperation: 'source-over'
                            	});
                            };
                        } catch (e) {
                            console.log("Something failed. " + e);
                        }
                    });
                }
            }), 0);
        }
    }
}

function updateDynamicImageCover() {
	var dynamic_image_cover = $("#form-dynamic-image-cover").prop("checked");
    css_card_elements.dynamicCover.toggle(dynamic_image_cover);
    
    if (canvas_initialized) {
        playerGradientMask.set({
            width: imgCanvasCard.width,
            height: imgCanvasCard.height
        });
        playerFade.set({
            width: imgCanvasCard.width,
            height: imgCanvasCard.height
        });
        updateDynamicImageCoverCanvas();
    }
}

function updateFormCardDynamicCover() {
	var card_year = $("#form-card-year").val(),
	    card_format = $("input[name='form-card-format']:checked").val(),
	    dynamic_image_cover = $("input[name='form-dynamic-image-cover']"),
	    dynamic_image_cover_label = $(".dynamic-image-cover-label");
    if (card_year > 18) {
        dynamic_image_cover.removeAttr("disabled");
    } else {
        $("#form-dynamic-image-cover-none").trigger("click");
        dynamic_image_cover.attr("disabled", "disabled");
    }
    $("#form-fade-color-container").toggle($("#form-dynamic-image-cover").prop("checked"));
    updateDynamicImageCover();
}

function resetFadeImageColor() {
    setCurrentCardColors();
    updateDynamicImageCover();
}

function updateImageFilterCanvas() {
    var obj = playerImageCard;

    // initialize empty filters
    obj.filters = [];
    
    // get checkbox and range ids
    var preset_filter = $("input[name='form-image-filter']:checked").val(),
        sepia_checkbox = $("#image-filter-sepia"),
        grayscale_checkbox = $("#image-filter-grayscale"),
        blackwhite_checkbox = $("#image-filter-blackwhite"),
        brightness_checkbox = $("#image-filter-brightness"),
        contrast_checkbox = $("#image-filter-contrast"),
        saturation_checkbox = $("#image-filter-saturation"),
        brightness_value = $("#image-filter-brightness-value"),
        contrast_value = $("#image-filter-contrast-value"),
        saturation_value = $("#image-filter-saturation-value");

    // set checkboxes and range inputs
    if (preset_filter != 'none') {
    
        if (preset_filter == 'icon') {
            blackwhite_checkbox.prop("checked", false);
            grayscale_checkbox.prop("checked", false);
            brightness_checkbox.prop("checked", false);
            
            sepia_checkbox.prop("checked", true);
            saturation_checkbox.prop("checked", true);
            saturation_value.val(-0.4);
            contrast_checkbox.prop("checked", true);
            contrast_value.val(0.05);
        }
            
        if (sepia_checkbox.prop("checked") == true) {
            var sepia = new playerImageFilters.Sepia();
            obj.filters[1] = sepia;
        }
            
        if (blackwhite_checkbox.prop("checked") == true) {
            var blackwhite = new playerImageFilters.BlackWhite();
            obj.filters[2] = blackwhite;
        }
            
        if (grayscale_checkbox.prop("checked") == true) {
            var grayscale = new playerImageFilters.Grayscale();
            obj.filters[3] = grayscale;
        }
        
        if (saturation_checkbox.prop("checked") == true) {
            var saturation = new playerImageFilters.Saturation({
                    saturation: parseFloat(saturation_value.val())
                });
            obj.filters[4] = saturation;
        }
    
        if (contrast_checkbox.prop("checked") == true) {
            var contrast = new playerImageFilters.Contrast({
                    contrast: parseFloat(contrast_value.val())
                });
            obj.filters[5] = contrast;
        }
        
        if (brightness_checkbox.prop("checked") == true) {
            var brightness = new playerImageFilters.Brightness({
                    brightness: parseFloat(brightness_value.val())
                });
            obj.filters[6] = brightness;
        }
    }
    
    // Apply Filters
    obj.applyFilters();
    imgCanvasCard.renderAll();
}

function updateCardOverlay() {
	var card_overlay_status = $("#form-card-overlay-toggle").prop("checked"),
	    card_overlay_form = $(".overlay-group"),
	    card_overlay_text_form_group = $(".overlay-text-group"),
	    card_overlay_form_select = $("#form-card-overlay"),
	    card_overlay = css_card_elements.overlay,
	    card_overlay_text_form = $("#form-card-overlay-text");
	    card_overlay_text = card_overlay.find(".overlay-text");
    card_overlay_form.toggle(card_overlay_status);
    card_overlay.toggle(card_overlay_status);
    card_overlay_text_form_group.toggle(card_overlay_status);
    card_overlay.removeAttr("class").addClass("overlay").addClass(card_overlay_form_select.val());
    if (card_overlay_status && card_overlay_form_select.val() == "loan") {
        card_overlay_text_form_group.show();
        card_overlay_text.show();
        card_overlay_text.html(card_overlay_text_form.val());
    } else {
        card_overlay_text_form_group.hide();
        card_overlay_text.hide();
    }
    
    if (canvas_initialized) {
        updateOverlayCanvas();
    }
}

function updateOverlayCanvas() {
    var overlay = css_card.find(".playercard .overlay");
    var bg = overlay.css('background-image');
	var text = overlay.find(".overlay-text");
	var text_styles = window.getComputedStyle(text[0]);

	bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
    if (bg == 'none') {
        bgImageCardOverlay.set({
            visible: false
        });
        txtCardOverlay.set({
            visible: false
        });
        
        imgCanvasCard.renderAll();
    } else {
        bgImageCardOverlay.setSrc(bg, function(obj) {
            var scaleFactor = imgCanvasCard.width / obj.width;
        	obj.set({
        		scaleX: scaleFactor,
        		scaleY: scaleFactor,
        		visible: overlay.css('display') != 'none',
        	});
        	txtCardOverlay.set({
            	text: text.text(),
				width: parseFloat(text_styles.getPropertyValue('width')),
				textAlign: 'center',
            	left: parseFloat(text_styles.getPropertyValue('left')),
            	fontFamily: text_styles.getPropertyValue("font-family"),
            	fontSize: parseFloat(text_styles.getPropertyValue("font-size")),
            	lineHeight: parseFloat(text_styles.getPropertyValue("line-height")),
            	fill: text.css("color"),
				top: parseFloat(text_styles.getPropertyValue('top')) + (txtCardOverlay.lineHeight - txtCardOverlay.fontSize)/2,
                visible: text.css('display') !== 'none',
        	}).setCoords();

    		imgCanvasCard.renderAll();
        }, {
    		crossOrigin: 'Anonymous'
    	});
    }
}

function updateCardFeatureIconCanvas() {
	var card_feature_icon = $("#form-card-feature-icon-toggle").prop("checked");
	if (!bMini) {
        cardStar.set({
            top: 96, //imgCanvasCard.height/10.71428, // 84
            left: 195, //imgCanvasCard.width/3.51912 // 183
        }).setCoords();
        cardGemini.set({
            top: 96, //imgCanvasCard.height/10.71428, // 84
            left: 195, //imgCanvasCard.width/3.51912 // 183
        }).setCoords();
    } else {
        cardStar.set({
            top: 135, //imgCanvasCard.height/6.17073, // 135
            left: 160, //imgCanvasCard.width/4.293333 // 160
        }).setCoords();
        cardGemini.set({
            top: 135, //imgCanvasCard.height/6.17073, // 135
            left: 160, //imgCanvasCard.width/4.293333 // 160
        }).setCoords();
    }
	if (card_feature_icon) {
		$(".feature-icon-group").show();
        var icon = $("input[name='form-card-feature-icon']:checked").val();
	    cardStar.visible = false;
        cardGemini.visible = false;
        if (icon == 'star') {
            cardStar.visible = true;
        } else {
            cardGemini.visible = true;
        }
	} else {
		$(".feature-icon-group").hide();
        cardStar.visible = false;
        cardGemini.visible = false;
	}
    imgCanvasCard.renderAll();
}

function updateCardPlaystyleCanvas() {
	
	// Toggle Playstyle Selector
	var card_playstyle = $("#form-card-playstyle-toggle").prop("checked");
	var all_playstyle_classes = "two-playstyles three-playstyles four-playstyles first second third fourth chip-shot finesse-shot power-header power-shot dead-ball incisive-pass pinged-pass long-ball-pass tiki-taka whipped-pass first-touch flair press-proven rapid technical trickster block bruiser intercept jockey slide-tackle anticipate acrobatic aerial trivela relentless quick-step long-throw far-throw footwork cross-claimer rush-out far-reach quick-reflexes";

	var playstyle = [];
	var container = [];
	var icon = [];
	var icon_content = [];

	// read how many playstyles are set, count and create value array
	var playstyle_count = 0;
	var playstyle_vals = [];
	for (i=0; i<4; i++) {
		if ($("#form-card-playstyle" + (i+1)).val() !== '') {
			playstyle_vals.push($("#form-card-playstyle" + (i+1)).val());
			playstyle_count++;
		}
	}

	var playstyle_count_class = playstyle_count == 2 ? "two-playstyles" : 
														  (playstyle_count == 3 ? "three-playstyles" : 
														  (playstyle_count == 4 ? "four-playstyles" : ""));

	var playstyles_order = ["first", "second", "third", "fourth"];

	// Update css class
	for (i=0; i<4; i++) {

		playstyle[i] = playstyle_vals[i];
		container[i] = css_card_elements.playstyle[i];
		
		container[i].removeClass(all_playstyle_classes).hide();
		 
		container[i].addClass("playercard-playstyle " + playstyle_count_class + " " + playstyles_order[i] + " " + playstyle[i]);
		if (i+1<=playstyle_count) {
			container[i].show();
		}
		icon[i] = document.querySelectorAll("#playercard_container .playercard-playstyle." + playstyles_order[i] + " .icon");
		icon_content[i] = window.getComputedStyle(icon[i][0], ':before').getPropertyValue('content');
		icon_content[i] = icon_content[i].replace(/['"]+/g, '');

		cardPlaystyleIcon[i+1].set({
			'text': icon_content[i]
		});
		
		var playstyleEl = document.querySelectorAll("#playercard_container .playercard-playstyle." + playstyles_order[i])[0];
		var playstyleElStyles = window.getComputedStyle(playstyleEl);

		var canvasWidth = imgCanvasCard.getWidth();
		var canvasHeight = imgCanvasCard.getHeight();
		
		cardPlaystyle[i+1].set({
			top: convertPercentToPixel(playstyleElStyles.getPropertyValue('top'), canvasHeight),
			left: convertPercentToPixel(playstyleElStyles.getPropertyValue('left'), canvasWidth)
		}).setCoords();
		cardPlaystyleIcon[i+1].set({
			top: convertPercentToPixel(playstyleElStyles.getPropertyValue('top'), canvasHeight) + parseFloat(playstyleIconElStyles.getPropertyValue('padding-top'))/2.5,
			left: convertPercentToPixel(playstyleElStyles.getPropertyValue('left'), canvasWidth),
			fontSize: parseFloat(playstyleIconElStyles.getPropertyValue('font-size')),
			width: parseFloat(playstyleSvgEl.children[0].getBoundingClientRect().width/.4)
		}).setCoords();

		if (card_playstyle) {
			$(".playstyle-group").show();
			// Handle ALL playstyle visibilities
			cardPlaystyle[i+1].visible = playstyleEl.style.display !== 'none';
			cardPlaystyleIcon[i+1].visible = playstyleEl.style.display !== 'none';
		} else {
			$(".playstyle-group").hide();
			cardPlaystyle[i+1].visible = false;
			cardPlaystyleIcon[i+1].visible = false;
		}
	}

	setCardTxtFontAndColor();
    imgCanvasCard.renderAll();
}

function convertPercentToPixel(prop, value) {
	return prop.indexOf('px') >= 0 ? parseFloat(prop) : (value * parseFloat(prop) / 100);
}

function updateFormSquadChemistry() {
	var card_year = $("#form-card-year").val();
	var card_squad_chemistry_toggle = $("#form-card-squad-chemistry-toggle");
	if (card_year > 22) {
		card_squad_chemistry_toggle.prop("disabled", false);
	} else {
		$("#form-card-squad-chemistry-toggle").prop({
			"disabled": true,
			"checked": false
		});
	}
	updateCardSquadChemistryCanvas();
}

function updateCardSquadChemistryCanvas() {
	var card_year = $("#form-card-year").val(),
		card_squad_chemistry = $("#form-card-squad-chemistry-toggle").prop("checked");
	if (card_squad_chemistry) {
		$(".squad-chemistry-group").show();
	} else {
		$(".squad-chemistry-group").hide();
	}
	if (!bMini) {
		if (card_year > 23) {
			cardSquadChemistry.set({
				top: 737,
				left: 45,
				scaleX: .9,
				scaleY: .9
			}).setCoords();
		} else {
			cardSquadChemistry.set({
				top: 749,
				left: 160,
				scaleX: 1,
				scaleY: 1
			}).setCoords();
		}
    } else {
		if (card_year > 23) {
			cardSquadChemistry.set({
				top: 600,
				left: 10,
				scaleX: 1,
				scaleY: 1
			}).setCoords();
		} else {
			cardSquadChemistry.set({
				top: 575,
				left: 125,
				scaleX: 1,
				scaleY: 1
			}).setCoords();
		}
    }
	if (card_squad_chemistry) {
	    cardSquadChemistry.visible = true;
	} else {
		cardSquadChemistry.visible = false;
	}
    imgCanvasCard.renderAll();
}

function updateCardSquadChemistryOptions() {
	var card_squad_chemistry_option = $("#form-card-squad-chemistry").val();
	cardSquadChemistry.setSrc('assets/cards/fifa23/extras/chemistry-' + card_squad_chemistry_option + '.png', function(obj) {
		imgCanvasCard.renderAll();
	}, {
		crossOrigin: 'Anonymous'
	});
}

function updateFormSquadPosition() {
	var card_year = $("#form-card-year").val(),
		card_squad_position_toggle = $("#form-card-squad-position-toggle"),
		card_format = $("input[name='form-card-format']:checked").val();
	if (card_year == 23 && card_format == 'mini') {
		card_squad_position_toggle.prop("disabled", false);
	} else {
		$("#form-card-squad-position-toggle").prop({
			"disabled": true,
			"checked": false
		});
	}
	updateCardSquadPositionCanvas();
}

function updateCardSquadPositionCanvas() {
	var card_squad_position = $("#form-card-squad-position-toggle").prop("checked");
	if (card_squad_position) {
		$(".squad-position-group").show();
	} else {
		$(".squad-position-group").hide();
	}
    
	if (card_squad_position) {
	    cardSquadPosition.visible = true;
		cardSquadPositionText.visible = true;
	} else {
		cardSquadPosition.visible = false;
		cardSquadPositionText.visible = false;
	}
    imgCanvasCard.renderAll();
}

function updateCardSquadPositionText() {
	cardSquadPositionText.set({
		text: $("#form-card-squad-position-text").val()
	}).setCoords();

	imgCanvasCard.renderAll();
}

function updateDividerCanvas(){
	var card_year = $("#form-card-year").val();

	$.each([1, 2, 3, 4, 5], function(index, value) {
    	// get css dividers
    	var divider_elem = css_card_elements["divider" + value];
    	var border_side = 'bottom';
    	if (parseInt(divider_elem.css('border-width-bottom')) == 0) {
        	border_side = 'right';
    	}
    	var dividerColor = divider_elem.css('border-' + border_side + '-color');
    	var divider_position = {
        	top: parseFloat(divider_elem.css("top")),
        	left: parseFloat(divider_elem.css("left")),
        	width: parseFloat(divider_elem.css("width")),
        	height: parseFloat(divider_elem.css("height")),
    	};

		divider2019[index].set({
			'x1': divider_position.left,
			'y1': divider_position.top,
			'stroke': dividerColor,
			visible: (divider_elem.css("display") !== "none") ? true : false
		});

    	if (index !== 3) {
    		divider2019[index].set({
    			'x2': divider_position.left + divider_position.width,
    			'y2': divider_position.top, // + divider_position.height,
    		});
        } else {
    		divider2019[index].set({
    			'x2': divider_position.left, // + divider_position.width,
    			'y2': divider_position.top + divider_position.height,
    		});
        }
	});
		
    imgCanvasCard.renderAll();
}

function updateFormCardOverlay() {
	var card_year = $("#form-card-year").val(),
	    card_format = $("input[name='form-card-format']:checked").val(),
	    card_overlay = $("#form-card-overlay-toggle"),
	    card_overlay_label = $(".card-overlay-label"),
	    card_overlay_text_form_group = $(".overlay-text-group");
    if (card_year > 17) {
        card_overlay.removeAttr("disabled");
    } else {
        // Card overlay only available on fifa 18+
        card_overlay_label.find("input").attr("disabled", "disabled");
        card_overlay.prop("checked", false);
    }
    updateCardOverlay();
}

function updateCardFormat() {
    if (logging) {
        console.log("updateCardFormat");
    }
	var card_year = $("#form-card-year").val(),
	    card_format = $("input[name='form-card-format']:checked").val(),
	    card_sizes = "card-xl card-large card-small card-mini",
	    card = css_card.find(".playercard"),
		form_card_player_name = $("input[name='form-card-player-name-toggle']"),
		form_card_player_name_container = form_card_player_name.closest("label");
    card.removeClass(card_sizes);
    if (card_format == "mini") {
        card.addClass("card-mini");
        $("#attribute-calc-selections-container, .fut-attribute-container, .full-attribute-container").hide();
		
		if (card_year !== "16") {
			form_card_player_name.prop("checked", false);
			form_card_player_name_container.show();
		} else {
			form_card_player_name_container.hide();
			form_card_player_name.prop("checked", false);
		}
		updateFormCardExtras('player-name');
    } else {
        card.addClass("card-xl");
        $("#attribute-calc-selections-container").show();
        updateFormAttributes();
		
		form_card_player_name_container.hide();
		form_card_player_name.prop("checked", true);
		updateFormCardExtras('player-name');
    }
    
    updateFormCardExtras();
    
    if (canvas_initialized) {
        updateCardFormatCanvas();
    }
}

function updateCardFormatCanvas() {
    if (logging) {
        console.log("updateCardFormatCanvas");
    }
    var card_format = $("input[name='form-card-format']:checked").val(),
        card_year = $("#form-card-year").val();
    bMini = (card_format == "mini");

	var player_card = css_card.find(".playercard");

    if (logging) {
    	console.log("updateCardFormatCanvas before render", css_card, imgCanvasCard);
    }
    
    var cardWidth = parseFloat(css_card.width()),
        cardHeight = parseFloat(css_card.height());

	imgCanvasCard.setWidth(cardWidth);
	imgCanvasCard.setHeight(cardHeight);

	imgCanvasCard2.setWidth(cardWidth);
	imgCanvasCard2.setHeight(cardHeight);
	
	imgCanvasCard.renderAll();
	
    if (logging) {
    	console.log("updateCardFormatCanvas after render", css_card, imgCanvasCard);
    }

    updateCardCanvas();
}

function updateNameCanvas() {
	var elem = css_card_elements.name;

	var fontName = elem.css('font-family');
	var colorName = elem.css('color');
	
    var elem_styles = window.getComputedStyle(elem[0]),
        elem_fontSize = parseFloat(elem_styles.getPropertyValue('font-size')),
        elem_lineHeight = parseFloat(elem_styles.getPropertyValue('line-height')),
        elem_heightPadding = (elem_lineHeight - elem_fontSize),
	    width = parseFloat(elem.width()),
	    left = parseFloat(elem.css("left")),
		top = parseFloat(elem.css("top")) + elem_heightPadding/2,
        uppercase = elem.css("text-transform") == "uppercase",
        name_text = (uppercase ? $("#form-card-name").val().toUpperCase() : $("#form-card-name").val());
		
    if (elem.is(":visible")) {
//    	Promise.all(
//    	  g_fonts.map(font_ => new FontFaceObserver(font_).load())
//    	).then(function() {
    		txtName.set({
        		'fill': colorName,
        		'fontFamily': fontName,
    			'text': name_text,
    			'width': width,
    			'left': left,
    			'top': top,
    			'fontSize': elem_fontSize,
    			'textAlign': 'center',
    			visible: true,
    		});
//        });
    } else {
        txtName.visible = false;
    }
	
	imgCanvasCard.renderAll();
}

function updateSkillWorkWeakCanvas() {
    // get css elements for skillmoves, weakfoot, workrates
    
	var mid_bar = css_card_elements.midBar;
	var mid_bar_styles = {
        top: parseFloat(mid_bar.css("top")),
        left: parseFloat(mid_bar.css("margin-left")) + parseFloat(mid_bar.css("left")),
        paddingTop: parseFloat(mid_bar.css("padding-top")),
        height: parseFloat(mid_bar.height()),
        width: parseFloat(mid_bar.width()),
	};
	
	$.each(['skillmoves', 'weakfoot', 'workrate', 'foot'], function(index, value) {
        
    	var elem_container = css_card_elements[value],
			canvas_label_elem,
			canvas_elem,
			elem_styles = {},
			elem_data,
			elem_data_styles,
			elem_text,
			elem_font_styles;

        if (value == 'skillmoves') {
            canvas_label_elem = txtSkillLabel;
            canvas_elem = txtSkillVal;
        }
        
        if (value == 'weakfoot') {
            canvas_label_elem = txtWeakLabel;
            canvas_elem = txtWeakVal;
        }

		if (value == 'foot') {
            canvas_label_elem = txtFootLabel;
            canvas_elem = txtFootVal;
        }
        
        if (value == 'workrate') {
            canvas_label_elem = txtWorkRatesLabel;
            canvas_elem = txtWorkRatesVal;
        }

    	if (elem_container.is(":visible")) {
        
            var elem_color = elem_container.css('color');
            var elem_font = elem_container.css('font-family');

            if (bMini == true) {
                elem_styles = {
                    top: parseFloat(elem_container[0].offsetTop),
                    left: parseFloat(elem_container[0].offsetLeft),
                    width: parseFloat(elem_container[0].offsetWidth) + 1,
                    height: parseFloat(elem_container[0].offsetHeight)
                };
            } else {
                elem_styles = {
                    top: parseFloat(elem_container.css("top")),
                    left: parseFloat(elem_container.css("left")),
                    width: parseFloat(elem_container.width()),
                    height: parseFloat(elem_container.height()),
					backgroundColor: elem_container.css("background-color"),
					stroke: elem_container.css("border-color"),
					strokeWidth: elem_container.css("border-width")
                };
            }
            
        	var elem_label = elem_container.find(".midbar-label");
            var elem_label_styles = window.getComputedStyle(elem_label[0]);
    
            if (value == 'skillmoves' || value == 'weakfoot') {
            	elem_data = elem_container.find(".data-value");
                elem_data_styles = window.getComputedStyle(elem_data[0]);
                
                // Get Star
                var elem_icon = elem_container.find(".fa");
                var elem_icon_content = window.getComputedStyle(elem_icon[0], ':before').getPropertyValue('content');
                elem_icon_content = elem_icon_content.replace(/['"]+/g, '');
                var elem_icon_styles = window.getComputedStyle(elem_icon[0]);
                var elem_icon_color = elem_icon_styles.getPropertyValue('color');
                var elem_icon_font = elem_icon_styles.getPropertyValue('font-family');
                var elem_icon_fontSize = parseFloat(elem_icon_styles.getPropertyValue('font-size'));
                var elem_icon_lineHeight = parseFloat(elem_icon_styles.getPropertyValue('line-height'));
                
                elem_font = elem_font.substring(0, elem_font.indexOf(","));
                
                elem_text = elem_data.text() + " " + elem_icon_content;
                elem_font_styles = {
                    0: {
                        0: {
                            'fontFamily': elem_font,
                        },
                        1: {
                            'fontFamily': elem_font,
                        },
                        2: {
                            'fontFamily': 'FontAwesome'
                        }
                    }
                };
            
            } else { // value == 'workrate'
                elem_data = css_card_elements.attackingworkrate;
                elem_data_styles = window.getComputedStyle(elem_data[0]);
                elem_text = css_card_elements.attackingworkrate.text() + "/" + css_card_elements.defensiveworkrate.text();
            }
        
//        	Promise.all(
//        	  g_fonts.map(font_ => new FontFaceObserver(font_).load())
//        	).then(function() {
        		canvas_label_elem.set({
                    'fill': elem_color,
        			'text': elem_label.text().toUpperCase(),
        			'top': mid_bar_styles.top + elem_styles.top,
        			'left': mid_bar_styles.left + elem_styles.left,
        			'height': parseFloat(elem_label.height()),
        			'width': parseFloat(elem_container.width()),
        			'fontSize': parseFloat(elem_label_styles.getPropertyValue('font-size')),
					'backgroundColor': elem_styles.backgroundColor,
        			visible: true,
        		});
        		
        		canvas_elem.set({
                    'fill': elem_color,
        			'text': elem_text,
        			'top': mid_bar_styles.top + elem_styles.top + canvas_label_elem.height,
        			'left': mid_bar_styles.left + elem_styles.left,
        			'height': parseFloat(elem_styles.height - elem_label.height()),
        			'width': parseFloat(elem_styles.width),
        			'fontSize': parseFloat(elem_data_styles.getPropertyValue('font-size')),
					'backgroundColor': elem_styles.backgroundColor,
        			visible: true,
        		});
        		
        		if (value == 'skillmoves' || value == 'weakfoot') {
                    canvas_elem.set({
                        'styles': elem_font_styles,
                    });
                }
//            });
        } else {
            canvas_label_elem.visible = false;
            canvas_elem.visible = false;
        }
    
    });
    
	imgCanvasCard.renderAll();
}

function updateSecondaryIcon() {
	var secondary_icon_toggle = $("#form-card-secondary-icon-toggle").prop("checked");
	var secondary_icon_container = css_card_elements.secondaryIcon;
	var secondary_icon = secondary_icon_container.find(".icon");
	var icon_val = 'first-owner';
	secondary_icon.attr("class", "icon icn-chem-" + icon_val);

	if (secondary_icon_toggle) {
		secondary_icon_container.show();
	} else {
		secondary_icon_container.hide();
	}
	
	if (canvas_initialized) {
		setTimeout(function() {
            updateSecondaryIconCanvas();
		}, 100);
    }
}

function updateSecondaryIconCanvas() {
//	if (selected_card_year > 18) {
    	
    	var chem_container = css_card_elements.secondaryIcon;
    	
    	if (chem_container.is(":visible")) {
        	var mid_bar = css_card_elements.midBar;
        	var mid_bar_styles = {
                top: parseFloat(mid_bar.css("top")),
                left: parseFloat(mid_bar.css("left")) + parseFloat(mid_bar.css("margin-left")),
                paddingTop: parseFloat(mid_bar.css("padding-top")),
                height: parseFloat(mid_bar.height()),
                width: parseFloat(mid_bar.width()),
        	};

            var chem_icon = chem_container.find(".icon");
            var chem_icon_content = window.getComputedStyle(chem_icon[0], ':before').getPropertyValue('content');
            chem_icon_content = chem_icon_content.replace(/['"]+/g, '');
    
            var colorSecondaryIcon = css_card_elements.secondaryIcon.find(".text").css('color');
            var fontChemistry = css_card_elements.chemistry.find(".icon").css('font-family');
            var colorChemistry = css_card_elements.chemistry.find(".chemistry-label").css('color');
            
            var elem_styles = window.getComputedStyle(chem_icon[0]);
            var elem_fontSize = parseFloat(elem_styles.getPropertyValue('font-size'));
            var elem_lineHeight = parseFloat(elem_styles.getPropertyValue('line-height'));
    
    //    	Promise.all(
    //    	  g_fonts.map(font_ => new FontFaceObserver(font_).load())
    //    	).then(function() {
				txtSecondaryIcon.set({
                    'fill': colorChemistry,
                    'fontFamily': fontChemistry,
        			'text': chem_icon_content,
        			'top': mid_bar_styles.top + mid_bar_styles.paddingTop + parseFloat(elem_styles.getPropertyValue('margin-top')) + parseFloat(chem_container.css("top")) + parseFloat(chem_container.css("padding-top")),
        			'left': mid_bar_styles.left + parseFloat(chem_container.css("left")),
        			'height': parseFloat(chem_container.height()),
        			'width': parseFloat(chem_container.width()),
        			'fontSize': elem_fontSize,
        			visible: true
        		});
    //        });
        } else {
            txtSecondaryIcon.visible = false;
        }
	imgCanvasCard.renderAll();
}

function updateRatingCanvas() {
	var rating_elem = css_card_elements.rating;

	var rating_styles = window.getComputedStyle(rating_elem[0]);
	var rating_fontSize = parseFloat(rating_styles.getPropertyValue('font-size'));
	var rating_lineHeight = parseFloat(rating_styles.getPropertyValue('line-height'));
	var rating_heightPadding = (rating_lineHeight - rating_fontSize);

	txtRating.set({
		'text': $("#form-card-rating").val(),
		'width': parseFloat(rating_elem.width()),
		'left': parseFloat(rating_elem.css("left")),
		'top': parseFloat(rating_elem.css("top")) + rating_heightPadding/2,
		'fontSize': rating_fontSize,
		'textAlign': 'center',
		'originX': 'left',
		'originY': 'top',
	});
	
	imgCanvasCard.renderAll();
}

function updatePlayerPositionCanvas() {
	var elem = css_card_elements.position;

	var elem_styles = window.getComputedStyle(elem[0]);
	var elem_fontSize = parseFloat(elem_styles.getPropertyValue('font-size'));
	var elem_lineHeight = parseFloat(elem_styles.getPropertyValue('line-height'));
	var elem_heightPadding = (elem_lineHeight - elem_fontSize);

	txtPosition.set({
		'text': $("#form-card-position").val(),
		'width': parseFloat(elem.width()),
		'left': parseFloat(elem.css("left")),
		'top': parseFloat(elem.css("top")) + elem_heightPadding/2,
		'fontSize': elem_fontSize,
		'textAlign': 'center',
		'originX': 'left',
		'originY': 'top',
	});
	
	imgCanvasCard.renderAll();
}

function updateAttributesCanvas() {
	$.each([1, 2, 3, 4, 5, 6], function(index, value) {
    	if (!bMini) {
    		var container = css_card_elements["attr" + value];
    		
    		var elem = container.find(".fut-rating");
    
    		var elem_styles = window.getComputedStyle(elem[0]);
    		var elem_fontSize = parseFloat(elem_styles.getPropertyValue('font-size'));
    		var elem_lineHeight = elem_styles.getPropertyValue('line-height');
    
    		if (elem_lineHeight == 'normal') {
                elem_lineHeight = 1.2 * elem_fontSize;
            } else {
                elem_lineHeight = parseFloat(elem_lineHeight);
            }
    		
    		var elem_heightPadding = elem_lineHeight - elem_fontSize;

			var rating_top = 0;
			if (selected_card_year <= 23) {
				rating_top = parseFloat(container.css("top")) + elem_heightPadding/2;
			} else {
				rating_top = parseFloat(container.css("top")) + parseFloat(elem.css("top"));
			}
    
    		txtAttr[index].set({
    			'text': $("#form-card-attr" + value).val(),
    			'width': parseFloat(elem.width()),
    			'left': parseFloat(container.css("left")),
    			'top': rating_top,
    			'fontSize': elem_fontSize,
    			'textAlign': elem_styles.getPropertyValue("text-align"),
    			'originX': 'left',
    			'originY': 'top',
    			visible: true,
    		});
    		
    		var elem2 = container.find(".fut-label");
    
    		var elem2_styles = window.getComputedStyle(elem2[0]);
    		var elem2_fontSize = parseFloat(elem2_styles.getPropertyValue('font-size'));
    		var elem2_lineHeight = elem2_styles.getPropertyValue('line-height');
    
    		if (elem2_lineHeight == 'normal') {
                elem2_lineHeight = 1.2 * elem2_fontSize;
            } else {
                elem2_lineHeight = parseFloat(elem2_lineHeight);
            }
    		
    		var elem2_heightPadding = elem2_lineHeight - elem2_fontSize;

			var label_left = parseFloat(container.css("left"));
			var label_top = 0;
			if (selected_card_year <= 23) {
				label_left += parseFloat(elem.width());
				label_top = parseFloat(container.css("top")) + elem2_heightPadding/2;
			} else {
				label_top = parseFloat(container.css("top")) + parseFloat(elem2.css("top"));
			}
    
    		txtAttrDesc[index].set({
    			'text': $("#form-card-attr" + value + "-text").val().toUpperCase(),
    			'width': parseFloat(elem2.width()),
    			'left': label_left,
    			'top': label_top,
    			'fontSize': elem2_fontSize,
    			'textAlign': elem2_styles.getPropertyValue("text-align"),
    			'originX': 'left',
    			'originY': 'top',
    			visible: true,
    		});
        } else {
            txtAttr[index].set({
                visible: false,
            });
            txtAttrDesc[index].set({
                visible: false,
            });
        }
	});
	imgCanvasCard.renderAll();
}

function updateClubNationCanvas(value, custom) {
    if (typeof custom === 'undefined') {
        custom = false;
    }
	//update card
	var clubImg_container = css_card_elements[value];
	var clubImg_img = clubImg_container.find("img");
	var clubImg = clubImg_img.attr("src");
	var obj1 = (value == 'club') ? imgCardClub : (value == 'league' ? imgCardLeague : imgCardNation);
	
    if (logging) {
        console.log("updateClubNationCanvas", value, clubImg, obj1);
    }

	// showHide league
	if (value == 'league') {
		if (selected_card_year > 23) {
			clubImg_container.css("display", "block");
		} else {
			clubImg_container.css("display", "none");
		}
	}

    var club_top = parseFloat(clubImg_container.css("top"));
    var club_left = parseFloat(clubImg_container.css("left")) + (parseFloat(clubImg_container.css("width"))/2);
    var img_width = obj1.width;
    var img_height = obj1.height;
    var img_ratio = parseFloat(clubImg_img.css("width")) / img_width;
    
    if (custom) {
        clubImg = cors_server + clubImg;
    }

	obj1.setSrc(clubImg, function(obj){
        var scaleFactor = parseFloat(clubImg_img.width()) / obj.width;
		obj.set({
			top: club_top,
			left: club_left,
			scaleX: scaleFactor,
            scaleY: scaleFactor,
			originX: 'center',
			originY: 'top',
			editable: false,
			selectable: false,
			evented: false,
			visible: clubImg_container.css("display") !== 'none'
		});
		imgCanvasCard.renderAll();
	}, {
		crossOrigin: 'Anonymous'
	});
}

function updateClubNation(value) {
    if (logging) {
        console.log("updateClubNation", value, $("#form-card-" + value).val());
    }
	var card_year = $("#form-card-year").val(),
		clubNationId = $("#form-card-" + value).val(),
		img_url,
		onerror;
	if (Number.isInteger(parseInt(clubNationId)) && clubNationId !== 0) {
		if (value == "club") {
			img_url = TEAM_CREST_URL[card_year];
			if (css_card.find(".playercard").hasClass("dark-card")) {
                if (card_year > 18) {
                    img_url += "dark/";
                }
                if (card_year == 18 && (clubNationId == 18 || clubNationId == 45)) {
                    // FIFA 18 only Tottenham and Juventus have light logos
                    img_url += "light/";
                }
			}
		} else if (value == "nation") {
    		if ($("#form-card-color").val().indexOf("world_cup") == 0) {
        		img_url = "assets/nations/world-cup/";
        		onerror = "this.onerror=null;this.src='" + NATION_FLAG_URL + clubNationId + ".png'";
    		} else {
    			img_url = NATION_FLAG_URL;
    			onerror = '';
    		}
		} else if (value == "league") {
			img_url = LEAGUE_LOGO_URL + "fifa" + card_year + "/";
			if (css_card.find(".playercard").hasClass("dark-card")) {
                if (card_year > 18) {
                    img_url += "dark/";
                }
			}
		}
		var badge_img = img_url + clubNationId + ".png";
		css_card_elements[value].find("img").attr("src", badge_img).attr("onerror", onerror);
		css_card.attr("data-" + value + "-id", clubNationId);
	} else if (isNaN(clubNationId)) {
        css_card_elements[value].find("img").attr("src", clubNationId);
    } else {
		css_card_elements[value].find("img").attr("src", "images/spacer.gif");
	}

	if (logging) {
		console.log(badge_img);
	}
	
	if (canvas_initialized) {
		setTimeout(function() {
            updateClubNationCanvas(value);
		}, 100);
    }
}

function customClubNation(elem, value) {
	if (logging) {
		console.log("customClubNation");
	}
	var text = elem.val();
	if (text.match("^http")) {
		$.get("utils/getImage.php", {image: text}, function(data) {
			if (data.is_image) {
				elem.closest(".form-group").removeClass("has-error");
				elem.closest(".form-group").find(".help-block").text("").hide();
				css_card_elements[value].find("img").attr("src", text);
				if (canvas_initialized) {
    				updateClubNationCanvas(value, true);
                }
			} else {
    			elem.closest(".form-group").addClass("has-error");
    			elem.closest(".form-group").find(".help-block").text("That url didn't work.").show();
    			$(cardElem).removeAttr("style");
    		}
		});
	}
}

function removeCardClasses() {
    var all_card_classes = window.all_card_classes;
    css_card.find(".playercard").removeClass(all_card_classes);
}

function removeCustomDesignCss() {
    css_card.removeClass(function (index, className) {
        return (className.match (/(^|\s)design-\S+/g) || []).join(' ');
    });
}

function changeCardColor(color, css_class) {
    if (logging) {
        console.log("changeCardColor");
    }
    removeCustomDesignCss();
    removeCardClasses();
	$("#form-card-color").val(color);
	$("#form-card-color").trigger("change");
	$("input[name='form-card-color-type'][value='official']").trigger("click");
	var card_year = $("#form-card-year").val();
	var caller = $(event.target);
	caller.parent(".card_container").addClass("active").siblings(".card_container").removeClass("active");
	updateCardType(css_class);
	$(".modal[id^=card_selector_modal]").modal("hide");
}

function changeCardColorCanvas() {
    if (logging) {
        console.log("changeCardColorCanvas");
    }
    var player_card = $("#playercard_container .playercard");

	setTimeout(() => {
		// Timeout to give css card a chance to change before js tries to read the background image
		var bg = player_card.css('background-image');
		bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
		if (logging) {
			console.log("changeCardColorCanvas", "bg is:", bg);
		}
		
		if ($("input[name='form-card-color-type']").val() === "custom") {
			bg = cors_server + bg;
		}
		
		bgImageCard.setSrc(bg, function(obj){
			var scaleFactor = imgCanvasCard.width / obj.width;
			obj.set({
				top: 0,
				left: 0,
				originX: 'left',
				originY: 'top',
				scaleX: scaleFactor,
				scaleY: scaleFactor,
				editable: false,
				selectable: false,
				evented: false,
			});
			imgCanvasCard.renderAll();
			if (logging) {
				console.log("changeCardColorCanvas", "bgImageCard src updated to:", bg);
			}
			
			updateDividerCanvas();
			updateOverlayCanvas();
			setCardTxtFontAndColor();
			updateCardBarCanvas();
			updateCurveShineCanvas();
			updateDynamicImageCover();
		}, {
			crossOrigin: 'Anonymous'
		});
	}, 50);
}

function changeCardColorCustom(css_class) {
	if (logging) {
        console.log("changeCardColorCustom");
    }
    removeCustomDesignCss();
    // removeCardClasses();
    css_card.addClass(css_class);
    $("#form-card-color-custom-id").val(css_class);
    $("input[name='form-card-color-type'][value='custom']").trigger("click");
	$(".modal[id^=card_selector_modal_user_designs]").modal("hide");
    updateAvailableTextFormats();

	updateYear();
	// ^ calls canvas side updates
}

function updateCardType(css_class) {
    if (logging) {
        console.log("updateCardType");
    }
	var card_year = $("#form-card-year").val();
	if (typeof css_class == "undefined") {
		css_class = card_colors[$("#form-card-color").val()].css_class;
	}
	removeCustomDesignCss();
    removeCardClasses();
	css_card.find(".playercard").addClass(css_class);
	$(".card-color-widget .card_style_choices .playercard").attr("class", "playercard card-small fut" + card_year + " " + css_class);

    if (css_class.startsWith('world_cup')) {
        updateForWorldCup(true);
    } else {
    	updateForWorldCup(false);
    }
    
    setTimeout(function() {
        updateAvailableTextFormats();
        setCurrentCardColors();
		setCardTxtFontAndColor();
    }, 100);
	
    if (canvas_initialized) {
        setTimeout(updateCardFormatCanvas(), 500);
    }
}
function updatePlayerImageCanvas() {
    var isDirectEAImage = false;
	var isdynamic = $("#form-is-dynamic-image").is(':checked');
	var clipEdges = $("#form-clip-edges-image").is(':checked');
    var img_container = css_card_elements.picture;
	var img_elem = img_container.find("img");
	var img_url = img_elem.attr("src");
	var card_year = $("#form-card-year").val();
	var custom_image = ($("input[name='form-image-type']:checked").val() !== "player");
	var custom_url = ($("input[name='form-image-type']:checked").val() == "custom");
	var uploaded_image = ($("input[name='form-image-type']:checked").val() == "upload");
	var img_container_styles = {
    	top: parseFloat(img_container.css("top")),
    	left: parseFloat(img_container.css("left")),
    	width: parseFloat(img_container.css("width")),
    	height: parseFloat(img_container.css("height")),
	};
	var img_styles = {
    	width: parseFloat(img_elem.width()),
    	height: parseFloat(img_elem.height()),
	};
	
	imgCanvasCard.controlsAboveOverlay = true;
	
	// Check if player image is coming direct from EA
    const regex = /^https:\/\/fifa[1-9][0-9]\.content\.easports\.com/g;
    var matches = img_url.match(regex);
    isDirectEAImage = (matches && matches.length > 0);
	
    if (custom_url || isDirectEAImage) {
        img_url = cors_server+img_url;
    }
    
    if (uploaded_image) {
        img_url = playerImageTemp.src;
        playerImageCard.setElement(playerImageTemp);
    }
    
    playerImageCard.setSrc(img_url, processImage, {crossOrigin: 'Anonymous'});
    imgCanvasCard.renderAll();
}

function processImage(obj) {
	var isdynamic = $("#form-is-dynamic-image").is(':checked');
	var clipEdges = $("#form-clip-edges-image").is(':checked');
    var img_container = css_card_elements.picture;
	var img_elem = img_container.find("img");
	var img_url = img_elem.attr("src");
	var card_year = $("#form-card-year").val();
	var custom_image = ($("input[name='form-image-type']:checked").val() !== "player");
	var image_size_input;
	var custom_url = ($("input[name='form-image-type']:checked").val() == "custom");
	var uploaded_image = ($("input[name='form-image-type']:checked").val() == "upload");
	var img_container_styles = {
    	top: parseFloat(img_container.css("top")),
    	left: parseFloat(img_container.css("left")),
    	width: parseFloat(img_container.css("width")),
    	height: parseFloat(img_container.css("height")),
	};
	var img_styles = {
    	width: parseFloat(img_elem.width()),
    	height: parseFloat(img_elem.height()),
	};
	var scaleFactor = img_styles.width / obj.width;
	obj.set({
		top: img_container_styles.top + (!isdynamic ? (img_container_styles.height - img_styles.height) : 0),
		left: img_container_styles.left,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        lockUniScaling: true,
        cornerSize: 24,
        transparentCorners: false,
        cornerStyle: "circle",
        editable: true,
		selectable: true,
		evented: true,
	});
	obj.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false,
    });
	if (custom_image) {
		playerImageCard.setCoords();
		if ($("input[name='form-image-type']:checked").val() == "custom") {
            image_size_input = $("#form-card-custom-size");
        } else {
            image_size_input = $("#form-card-upload-size");
        }
        image_size_input.val(Math.round(scaleFactor * 100));
    }
    
    if (selected_card_year > 23 && isdynamic && clipEdges) {
        var imgClipPath = new fabric.Rect({
            top: img_container_styles.top + 60,
            left: img_container_styles.left + 72,
            width: img_container_styles.width - 141,
            height: img_container_styles.height - 170,
            absolutePositioned: true,
            editable: false,
            selectable: false,
            evented: false,
        });
    } else {
        var imgClipPath = new fabric.Rect({
            top: img_container_styles.top,
            left: img_container_styles.left,
            width: img_container_styles.width,
            height: img_container_styles.height - (isdynamic ? 30 : 0),
            absolutePositioned: true,
            editable: false,
            selectable: false,
            evented: false,
        });
    }

    playerImageCard.clipPath = imgClipPath;
        
	imgCanvasCard.renderAll();
}

function updatePlayerImageSizeFormInput(scale) {
	var img_size_form_input;
    if ($("input[name='form-image-type']:checked").val() == "custom") {
        img_size_form_input = $("#form-card-custom-size");
    } else {
        img_size_form_input = $("#form-card-upload-size");
    }
    img_size_form_input.val(Math.round(scale*100));
}

function updateImage() {
    // Uncheck Fade Image
    $("#form-dynamic-image-cover-none").prop("checked", true);
    
	css_card_elements.picture.find("img").draggable();
	$(".player-image-type, .custom-image-type, .upload-image-type").hide();
	
	var status = "default";
	var errorMsg = "";

	if ($("input[name='form-image-type']:checked").val() == "player") {
    	// clear inline styles
		css_card_elements.picture.find("img").draggable("destroy").attr("style", "");
		$(".player-image-type").show();
		$("#form-card-image").each(function() {
			var $thisimage = $(this);
			var $img = $thisimage.val();
			var $formelem = $("#form-card-image-text");
			$.get("utils/getImage.php", {image: $img}, function(data) {
				if (data.is_image) {
					css_card_elements.picture.find("img").attr("src", $img);
					setTimeout(updatePlayerImageCanvas(), 0);
				} else {
                    status = "error";
    				errorMsg = "Error: URL must be a direct link to an image.";
    				//console.log(data);
				}
				setFormFieldStatus($formelem, status, errorMsg);
			});
		});
		resetImagePosition();
	} else if ($("input[name='form-image-type']:checked").val() == "custom") {
		css_card_elements.picture.find("img").draggable("enable").css({"max-width":"none", "width":$("#form-card-custom-size").val()+"%"});
		$(".custom-image-type").show();
		$("#form-card-custom-image").each(function() {
			var $formelem = $(this);
			var $img = $formelem.val();

			if ($img !== "") {
    			$img = fixUrl($img);
    			$formelem.val($img);
            }

        	if ($img.match("^http")) {
                if ($img.indexOf("footyrenders.com") > -1 && $img.substr($img.length - 3) !== "png") {
                    $img.replace("http://", "https://");
                    
                    var footyrenders_url_prefix = "https://www.footyrenders.com/api/render.php?url=" + $img;
                    
                    $.ajax({
                		"url": footyrenders_url_prefix,
                		"method": "GET",
                        "headers": {
                            "content-type": "application/json",
                            "authorization": "Bearer 6a7be0bb785adb6cabffa3cc184297e49c6e5a26479dd2916d16118227b80f1c"
                        }
                    })
            		.success(function(data) {
            			css_card_elements.picture.find("img").attr("src", data.data.image_url);
                        setFormFieldStatus($formelem, status, errorMsg);
                        updatePlayerImageCanvas();
            		})
            		.error(function(data) {
                		status = "error";
                		errorMsg = "Something went wrong. Couldn't import URL from FootyRenders.";
                        setFormFieldStatus($formelem, status, errorMsg);
            		});
                } else {
                    css_card_elements.picture.find("img").attr("src", $img);
                    updatePlayerImageCanvas();
                    setFormFieldStatus($formelem, status, errorMsg);
                }
        	}
		});
	} else if ($("input[name='form-image-type']:checked").val() == "upload") {
		$(".upload-image-type").show();
    	var file_input = $("#form-card-upload-image");
    	file_input.on("change", function (e) {
            var file = e.target.files[0];
            if ($.inArray(file.type, ["image/png", "image/jpg", "image/jpeg", "image/gif"]) > -1) {
                setFormFieldStatus(file_input, "default", "");
                if (playerImageTemp.hasOwnProperty("src") && playerImageTemp.src != "") {
                    window.URL.revokeObjectURL(playerImageTemp.src);
                }
                try {
                    var objectURL = window.URL.createObjectURL(file);
                    playerImageTemp.src = objectURL;
                    playerImageTemp.onload = function () {
                        css_card_elements.picture.find("img").attr("src", objectURL);
                        updatePlayerImageCanvas();
                    };
                } catch(e) {
                    try {
                        // Fallback if createObjectURL is not supported
                        var reader = new FileReader();
                        reader.onload = function (f) {
                            var data = f.target.result;
                            playerImageTemp.src = data;
                            playerImageTemp.onload = function () {
                                css_card_elements.picture.find("img").attr("src", data);
                                updatePlayerImageCanvas();
                            };
                        };
                        reader.readAsDataURL(file);
                    } catch(e) {
                        setFormFieldStatus(file_input, "error", "File upload not supported. ${e}");
                    }
                }
            } else {
                setFormFieldStatus(file_input, "error", "Please choose a valid image file.");
            }
        });
	}
}
function updateDynamic() {
    var isdynamic = $("#form-is-dynamic-image").is(':checked');
    if (isdynamic) {
        css_card_elements.picture.addClass("is-dynamic");
    } else {
        css_card_elements.picture.removeClass("is-dynamic");
    }
    updatePlayerImageCanvas();
}

function updateImageSize() {
    var image_type = $("input[name='form-image-type']:checked").val();
	var custom_size;
    if (image_type == "custom") {
        custom_size = $("#form-card-custom-size").val();
    } else if (image_type == "upload") {
        custom_size = $("#form-card-upload-size").val();
    }
    css_card_elements.picture.find("img").css({
        "width" : custom_size+"%",
        "height" : "auto",
        "cursor" : "move"
    });
	var isdynamic = $("#form-is-dynamic-image").is(':checked');

	var img_url = css_card_elements.picture.find("img").attr("src");
	var card_year = $("#form-card-year").val();

	playerImageCard.set({
    		scaleX: custom_size / 100,
    		scaleY: custom_size / 100,
    	});
	playerImageCard.setCoords();
	imgCanvasCard.renderAll();
}
function resetImagePosition() {
    // clear inline styles -- (too broad??)
	css_card_elements.picture.find("img").attr("style", "");
	$("#form-card-custom-size").val(100).trigger("change");
	updatePlayerImageCanvas();
}

function updateSkillWorkWeak() {
    var card_year = $("#form-card-year").val(),
        form_workrate = $(".workrates-group"),
        form_skillmoves = $(".skillmoves-group"),
        form_weakfoot = $(".weakfoot-group"),
        card_workrate = css_card_elements.workrate,
        card_skillmoves = css_card_elements.skillmoves,
        card_weakfoot = css_card_elements.weakfoot;
	
	if ($("input[name='form-card-work-skill-weak-toggle']:checked").val()) {
		$([form_workrate, form_skillmoves, form_weakfoot, card_workrate, card_skillmoves, card_weakfoot]).each(function() {
    		$(this).show();
        });
	} else {
		$([form_workrate, form_skillmoves, form_weakfoot, card_workrate, card_skillmoves, card_weakfoot]).each(function() {
    		$(this).hide();
        });
	}
	
	if (canvas_initialized) {
        updateSkillWorkWeakCanvas();
	}
}

function updateWorkRates() {

}

function updateSkillMoves() {
	css_card_elements.skillmoves.find(".data-value").html($("#form-card-skillmoves").val());
	if (canvas_initialized) {
    	updateSkillWorkWeakCanvas();
    }
}

function updateWeakFoot() {
	css_card_elements.weakfoot.find(".data-value").html($("#form-card-weakfoot").val());
	if (canvas_initialized) {
    	updateSkillWorkWeakCanvas();
    }
}

function updateChemistryType() {
	var chem_type = $("#form-card-chemistry").val().toLowerCase();
	var chem_label = $("#form-card-chemistry option:selected").text().toLowerCase();
	css_card_elements.chemistry
		.removeClass("fifarosters basic attacker midfielder defender special gk sniper finisher deadeye marksman hawk artist architect powerhouse maestro engine sentinel guardian gladiator backbone anchor hunter catalyst shadow gk_wall gk_shield gk_cat gk_glove gk_basic")
		.addClass(chem_type);
	$("#form-card-chemistry-text").val($("#form-card-chemistry option:selected").text());
	updateChemistryText();
}

function updatePlaystyleIcon() {
	var chem_type = $("#form-card-chemistry").val().toLowerCase();
	var chem_label = $("#form-card-chemistry option:selected").text().toLowerCase();
	css_card_elements.chemistry
		.removeClass("fifarosters basic attacker midfielder defender special gk sniper finisher deadeye marksman hawk artist architect powerhouse maestro engine sentinel guardian gladiator backbone anchor hunter catalyst shadow gk_wall gk_shield gk_cat gk_glove gk_basic")
		.addClass(chem_type);
	$("#form-card-chemistry-text").val($("#form-card-chemistry option:selected").text());
	updateChemistryText();
}

function updateChemistryTextCanvas(){
	var chem_container = css_card_elements.chemistry;

    if (chem_container.is(":visible")) {
//	if (selected_card_year > 18) {
    	var mid_bar = css_card_elements.midBar;
    	var mid_bar_styles = {
            top: parseFloat(mid_bar.css("top")),
            paddingTop: parseFloat(mid_bar.css("padding-top")),
            left: parseFloat(mid_bar.css("left")) + parseFloat(mid_bar.css("margin-left")),
            height: parseFloat(mid_bar.height()),
            width: parseFloat(mid_bar.width()),
    	};
    	
        var chem_label = $("#form-card-chemistry-text").val();
        var chem_icon = chem_container.find(".icon");
        var chem_icon_content = window.getComputedStyle(chem_icon[0], ':before').getPropertyValue('content');
        chem_icon_content = chem_icon_content.replace(/['"]+/g, '');

        var fontChemistry = chem_icon.css('font-family');
        var colorChemistry = css_card_elements.chemistry.find(".chemistry-label").css('color');
        
        var elem_styles = window.getComputedStyle(chem_icon[0]);
        var elem_fontSize = parseFloat(elem_styles.getPropertyValue('font-size'));
        var elem_lineHeight = parseFloat(elem_styles.getPropertyValue('line-height'));

//    	Promise.all(
//    	  g_fonts.map(font_ => new FontFaceObserver(font_).load())
//    	).then(function() {
    		txtChemistry.set({
                'fill': colorChemistry,
                'fontFamily': fontChemistry,
    			'text': chem_icon_content,
    			'top': mid_bar_styles.top + mid_bar_styles.paddingTop + parseFloat(elem_styles.getPropertyValue('margin-top')) + parseFloat(chem_container.css("top")) + parseFloat(chem_container.css("padding-top")),
    			'left': mid_bar_styles.left + parseFloat(chem_container.css("left")),
    			'height': parseFloat(chem_container.height()),
    			'width': parseFloat(chem_container.width()),
    			'fontSize': elem_fontSize, //chem_icon.css("font-size"),
                visible: true
    		});
//        });
    } else {
        txtChemistry.visible = false;
    }
/*
    } else {
		txtChemistry.set({
			'text': chem_label.toUpperCase(),
			'left': imgCanvasCard.width * posTexts[19 - selected_card_year].chemistry.full.left,
			'top': imgCanvasCard.height * posTexts[19 - selected_card_year].chemistry.full.top,
			'fill': $(".playercard-chemistry .text").css('color'),
			'fontFamily': 'DinProCondensedMedium',
			'fontSize': fontSizes[19 - selected_card_year].chemistry.full,
		});
    }
*/    
    imgCanvasCard.renderAll();
}

function updateChemistryText() {
	var chem_label = $("#form-card-chemistry-text").val();
	css_card_elements.chemistry.find(".chemistry-label").text(chem_label);
    
	if (canvas_initialized) {
    	updateChemistryTextCanvas();
    }
}

function updateAttributes() {
	$.each([1, 2, 3, 4, 5, 6], function(index, value) {
		css_card_elements["attr" + value].find(".fut-rating").html($("#form-card-attr" + value).val());
		css_card_elements["attr" + value].find(".fut-label").html($("#form-card-attr" + value + "-text").val());
	});
	if ($("#form-attrib-type-full").is(":checked")) {
		var form_data = $("#createCardForm").serialize();
		//console.log(form_data);
		//console.log("utils/getFUTRatings.php?form_data="+form_data);
		$.ajax({
			url: "utils/getFUTRatings.php?form_data="+form_data,
			success: function(data) {
				var futattr = data;
				//console.log(data);
				if ($("#form-card-position").val().toLowerCase() == "gk") {
					$("#form-card-attr1").val(futattr.div);
					$("#form-card-attr2").val(futattr.han);
					$("#form-card-attr3").val(futattr.kic);
					$("#form-card-attr4").val(futattr.ref);
					$("#form-card-attr5").val(futattr.spe);
					$("#form-card-attr6").val(futattr.pos);
				} else {
					$("#form-card-attr1").val(futattr.pac);
					$("#form-card-attr2").val(futattr.sho);
					$("#form-card-attr3").val(futattr.pas);
					$("#form-card-attr4").val(futattr.dri);
					$("#form-card-attr5").val(futattr.def);
					$("#form-card-attr6").val(futattr.phy);
				}
			}
		});
	}
	if (canvas_initialized) {
    	updateAttributesCanvas();
	}
}

function updateFormCardTypes() {
	var card_year = $("#form-card-year").val();
	
	$("#form-card-color option").each(function () {
		// OPTION VALUE USES UNDERSCORE
		$(this).removeAttr("disabled");
		if (card_year == "17") {
			if (jQuery.inArray($(this).val(), ["euro"]) > -1) {
				$(this).attr("disabled", "disabled");
				if ($(this).is(":selected")) {
					$(this).prop("selected", false);
					$("#form-card-color").trigger("change");
				}
			}
		} else if (card_year == "18") {
			if (jQuery.inArray($(this).val(), ["euro", "imotm", "black_gold", "movember"]) > -1) {
				$(this).attr("disabled", "disabled");
				if ($(this).is(":selected")) {
					$(this).prop("selected", false);
					$("#form-card-color").trigger("change");
				}
			}
        } else if (card_year == "19") {
			if (jQuery.inArray($(this).val(), ["tots_bronze", "tots_silver", "imotm", "euro", "confederation_champions_motm", "black_gold", "movember", "gotm", "refresh_bronze", "refresh_silver", "refresh_gold", "refresh_rare_bronze", "refresh_rare_silver", "refresh_rare_gold", "marquee", "rtr_selected", "rtrc", "rtrs", "rtrw_gold", "rtrw_silver", "fut_united", "fut_championship", "championship", "fof", "world_cup", "world_cup_icon"]) > -1) {
				$(this).attr("disabled", "disabled");
				if ($(this).is(":selected")) {
					$(this).prop("selected", false);
					$("#form-card-color").trigger("change");
				}
            }
		} else if (card_year == "20") {
    		// Check current value against list of valid card colors
			if (jQuery.inArray($(this).val(), ["bronze", "silver", "gold", "rare_bronze", "rare_silver", "rare_gold", "totw_bronze", "totw_silver", "totw_gold", "fut_champions_bronze", "fut_champions_silver", "fut_champions_gold", "ones_to_watch", "halloween", "legend", "purple", "teal", "motm", "record_breaker", "sbc_base", "sbc_premium", "sbc_flashback", "ucl_rare", "ucl_nonrare", "ucl_motm", "ucl_sbc", "ucl_live", "ucl_tott", "europa_motm", "europa_sbc", "europa_tott", "potm_bundesliga", "potm_pl", "mls_potm", "award_winner", "fut_mas", "toty", "toty_nominees", "fut_future_stars", "fut_future_stars_upgrade", "ucl_showdown", "ligue_1_potm", "winter_upgrade", "prime_icon_moments", "league_objective", "la_liga_potm", "player_moments", "objectives_reward", "icon_swaps_1", "icon_swaps_2", "icon_swaps_3", "concept", "headliners", "headliners_upgrade", "shapeshifters", "libertadores", "libertadores_gold", "libertadores_motm", "sudamericana", "totw_moments", "totw_moments_silver", "fut_birthday", "tots_gold", "tots_moments", "summer_heat_nominees", "summer_heat", "summer_showdown", "summer_showdown_boost"]) == -1) {
				$(this).attr("disabled", "disabled");
				if ($(this).is(":selected")) {
					$(this).prop("selected", false);
					$("#form-card-color").trigger("change");
				}
            }
		} else if (card_year == "21") {
    		// Check current value against list of valid card colors
    		var valid21 = [
    	        "bronze",
    	        "silver",
    	        "gold",
    	        "rare_bronze",
    	        "rare_silver",
    	        "rare_gold",
    	        "totw_bronze",
    	        "totw_silver",
    	        "totw_gold",
    	        "fut_champions_bronze",
    	        "fut_champions_silver",
    	        "fut_champions_gold",
    	        "ones_to_watch",
    	        "halloween",
    	        "legend",
    	        "purple",
    	        "teal",
    	        "motm",
    	        "pink",
    	        "futties_winner",
    	        "record_breaker",
    	        "sbc_base",
    	        "sbc_premium",
    	        "sbc_flashback",
    	        "ucl_rare",
    	        "ucl_nonrare",
    	        "ucl_motm",
    	        "ucl_sbc",
    	        "ucl_live",
    	        "ucl_tott",
    	        "europa_motm",
    	        //"europa_sbc",
    	        "europa_tott",
    	        "europa_live",
    	        "potm_bundesliga",
    	        "potm_pl",
    	        //"mls_potm",
    	        "award_winner",
    	        "fut_mas",
    	        "toty",
    	        "toty_nominees",
    	        "fut_future_stars",
    	        //"fut_future_stars_upgrade",
    	        "ligue_1_potm",
    	        //"winter_upgrade",
    	        "prime_icon_moments",
    	        "league_objective",
    	        "la_liga_potm",
    	        "player_moments",
    	        "objectives_reward",
    	        "icon_swaps_1",
    	        "icon_swaps_2",
    	        "icon_swaps_3",
    	        "concept",
    	        "headliners",
    	        "headliners_upgrade",
    	        //"shapeshifters",
    	        "libertadores",
    	        //"libertadores_gold",
    	        "libertadores_motm",
    	        "sudamericana",
    	        /*
    	        "totw_moments",
    	        "totw_moments_silver",
    	        */
    	        "fut_birthday",
    	        "tots_gold",
    	        "tots_moments",
    	        //"summer_heat_nominees",
    	        "summer_heat",
    	        /*
    	        "summer_showdown",
    	        "summer_showdown_boost"
    	        */
    	        "dual_entitlement",
    	        "fgs_swaps_1",
    	        "fgs_swaps_2",
    	        "objectives_reward_2",
                "sudamericana_motm",
                "beckham",
                "kit_promo",
                "stadium_assets",
                "fut_showdown_boost",
                "fut_showdown",
                "whatif",
                "whatif_2",
        	    "libertadores_tott",
        	    "sudamericana_tott",
        	    "libertadores_flashback",
        	    "fof",
        	    "fof_2"
    	    ];
			if (jQuery.inArray($(this).val(), valid21) == -1) {
				$(this).attr("disabled", "disabled");
				if ($(this).is(":selected")) {
					$(this).prop("selected", false);
					$("#form-card-color").trigger("change");
				}
            }
        } else if (card_year == "22") {
    		// Check current value against list of valid card colors
    		var valid22 = [
				"bronze",
				"silver",
				"gold",
				"rare_bronze",
				"rare_silver",
				"rare_gold",
				"concept",
				"concept_special",
				"totw_bronze",
				"totw_silver",
				"totw_gold",
				"fut_champions_bronze",
				"fut_champions_silver",
				"fut_champions_gold",
				"ones_to_watch",
				"halloween",
				"legend",
				"prime_icon_moments",
				"purple",
				"teal",
				"motm",
				"pink",
				"futties_winner",
				"record_breaker",
				"sbc_flashback",
				"sbc_base",
				"sbc_premium",
				"ucl_rare",
				"ucl_nonrare",
				"ucl_motm",
				//"ucl_sbc",
				"ucl_live",
				"ucl_tott",
				"ucl_rttf",
				"player_moments",
				"europa_motm",
				"europa_sbc",
				"europa_tott",
				"europa_live",
				"europa_rttf",
				"mls_potm",
				//"award_winner",
				//"fut_mas",
				"toty",
				"toty_nominees",
				"fut_future_stars",
				//"fut_future_stars_upgrade",
				"fut_future_stars_token",
				"potm_bundesliga",
				"potm_pl",
				"ligue_1_potm",
				"la_liga_potm",
				//"winter_upgrade",
				"league_objective",
				"fgs_swaps_1",
				"objectives_reward",
				"objectives_reward_2",
				"icon_swaps_1",
				"icon_swaps_2",
				"icon_swaps_3",
				"headliners",
				"headliners_upgrade",
				"shapeshifters",
				"libertadores",
				"libertadores_gold",
				"libertadores_motm",
				//"libertadores_tott",
				//"libertadores_flashback",
				"sudamericana",
				"sudamericana_motm",
				//"sudamericana_tott",
				"fut_birthday",
				"fut_birthday_token",
				"tots_gold",
				"tots_moments",
				"tots_token",
				"tots_token_2",
				//"dual_entitlement",
				"fgs_swaps_1",
				//"fgs_swaps_2",
				//"beckham",
				//"kit_promo",
				"stadium_assets",
				"fut_showdown_boost",
				"fut_showdown",
				//"whatif",
				//"whatif_2",
				//"fof",
				//"fof_2",
				//"summer_heat",
				"fut_heroes",
				"aged_stone",
				"infinite_mirror_1",
				"infinite_mirror_2",
				"powered_by_football",
				"adidas",
				"signature_signings",
				"potm_serie_a",
				"potm_eredivisie",
				"europa_conference_league",
				"europa_conference_league_2",
				"europa_conference_league_3",
				"europa_conference_league_motm",
				"fut_versus_ice",
				"fut_versus_fire",
				"next_generation",
				"winter_wildcard",
				"winter_wildcard_token",
				"silver_special",
				"fut_fantasy_blue",
				"fut_fantasy_red",
				"fut_captains",
				"fut_captains_upgrade",
				"libertadores_totgs",
				"summer_swaps_token_1",
				"summer_swaps_token_2",
				"shapeshifters_heroes",
				"futties_premium"
        	];
			if (jQuery.inArray($(this).val(), valid22) == -1) {
				$(this).attr("disabled", "disabled");
				if ($(this).is(":selected")) {
					$(this).prop("selected", false);
					$("#form-card-color").trigger("change");
				}
            }
        } else if (card_year == "23") {
    		// Check current value against list of valid card colors
    		var valid23 = [
				"bronze",
				"silver",
				"gold",
				"rare_bronze",
				"rare_silver",
				"rare_gold",
				"concept",
				"concept_rare",
				"concept_special",
				"totw_bronze",
				"totw_silver",
				"totw_gold",
				"fut_champions_bronze",
				"fut_champions_silver",
				"fut_champions_gold",
				"ones_to_watch",
				"halloween",
				"legend",
				"cover_star_icons",
				// "prime_icon_moments",
				// "purple",
				"teal",
				"motm",
				"pink",
				"futties_premium",
                "futties_heroes",
				// "record_breaker",
				"sbc_flashback",
				"sbc_base",
				"sbc_premium",
				"sbc_icon",
				"ucl_rare",
				"ucl_nonrare",
				"ucl_motm",
				// //"ucl_sbc",
				"ucl_live",
				// "ucl_tott",
				"ucl_rttf",
				"player_moments",
				"europa_motm",
				// "europa_sbc",
				// "europa_tott",
				"europa_live",
				"europa_rttf",
				"europa_conference_league",
				"europa_conference_league_2",
				"europa_conference_league_3",
				"europa_conference_league_motm",
				"mls_potm",
				"award_winner",
				// //"fut_mas",
				"toty",
				"toty_nominees",
				"fut_future_stars",
				// //"fut_future_stars_upgrade",
				"fut_future_stars_token",
				"potm_bundesliga",
				"potm_pl",
				"ligue_1_potm",
				"la_liga_potm",
				// //"winter_upgrade",
				// "league_objective",
				"objectives_reward",
				"objectives_reward_2",
				"icon_swaps_1",
				"icon_swaps_2",
				"icon_swaps_3",
				"icon_swaps_4",
				// "headliners",
				// "headliners_upgrade",
				"shapeshifters",
				// "shapeshifters_heroes",
				"shapeshifters_icons",
				"premium_shapeshifters",
				"out_of_position",
				"libertadores",
				// "libertadores_gold",
				"libertadores_motm",
				// //"libertadores_tott",
				// //"libertadores_flashback",
				// "libertadores_totgs",
				"libertadores_squad_foundations",
				"sudamericana",
				"sudamericana_motm",
				// //"sudamericana_tott",
				"fut_birthday",
				// "fut_birthday_token",
				"tots_gold",
				"tots_nominees",
				"tots_champions",
				// "tots_token",
				// "tots_token_2",
				// //"dual_entitlement",
				"fgs_swaps_1",
				// //"fgs_swaps_2",
				// //"beckham",
				// //"kit_promo",
				"stadium_assets",
				"teal_assets",
				"orange_assets",
				"fut_showdown_boost",
				"fut_showdown",
				// //"whatif",
				// //"whatif_2",
				// //"fof",
				// //"fof_2",
				// //"summer_heat",
				"fut_heroes",
				"aged_stone",
				"infinite_mirror_1",
				"infinite_mirror_2",
				// "powered_by_football",
				// "adidas",
				// "signature_signings",
				"potm_serie_a",
				"potm_eredivisie",
				// "fut_versus_ice",
				// "fut_versus_fire",
				// "next_generation",
				"winter_wildcard",
				"winter_wildcard_token",
				// "silver_special",
				"fut_fantasy_blue",
				"fut_fantasy_heroes",
				// "fut_fantasy_red",
				// "fut_captains",
				// "fut_captains_upgrade",
				// "summer_swaps_token_1",
				"dynamic_duo",
				"wc_player",
				"wc_icon",
				"wc_path_to_glory",
				"wc_star",
				"wc_swap_token",
				"wc_fut_heroes",
				"wc_tott",
				"wc_road_to_wc",
				"wc_stories",
				"wc_phenoms",
				"wc_showdown",
				"wc_showdown_boost",
				"fut_centurions",
				"history_makers",
				"toty_icons",
				"fut_birthday_token",
				"fut_ballers",
				"fut_birthday_icons",
				"trophy_titans",
				"trophy_titan_icons",
				"level_up",
				"premium_level_up"
            ];
			if (jQuery.inArray($(this).val(), valid23) == -1) {
				$(this).attr("disabled", "disabled");
				if ($(this).is(":selected")) {
					$(this).prop("selected", false);
					$("#form-card-color").trigger("change");
				}
            }
        } else if (card_year == "24") {
    		// Check current value against list of valid card colors
    		var valid24 = [
				// "concept",
				// "concept_rare",
				// "concept_special",
				"bronze",
				"silver",
				"gold",
				"rare_bronze",
				"rare_silver",
				"rare_gold",
				"totw_bronze",
				"totw_silver",
				"totw_gold",
				"fut_champions_bronze",
				"fut_champions_silver",
				"fut_champions_gold",
				"ones_to_watch",
				"halloween",
				"legend",
				// "prime_icon_moments",
				// "purple",
				"teal",
				"motm",
				// "pink",
				// "futties_winner",
				"record_breaker",
				"sbc_flashback",
				// "sbc_base",
				"sbc_premium",
				// "sbc_icon",
				// "ucl_rare",
				// "ucl_nonrare",
				"ucl_motm",
				// "ucl_sbc",
				"ucl_live",
				// "ucl_tott",
				"ucl_rttf",
				"ucl_totgs",
				"ucl_heroes",
				"uwcl_heroes",
				"uwcl_motm",
				"uwcl_rttk",
				"uwcl_rttf",
				"player_moments",
				"europa_motm",
				// "europa_sbc",
				// "europa_tott",
				"europa_live",
				"europa_rttf",
				"europa_totgs",
				"europa_conference_league",
				//"europa_conference_league_2",
				"europa_conference_league_3",
				//"europa_conference_league_motm",
				"europa_conference_league_totgs",
				"triple_threat",
				"triple_threat_heroes",
				// "fut_mas",
				"toty",
				"toty_nominees",
				"toty_icons",
				"fut_future_stars",
				// "fut_future_stars_upgrade",
				// "fut_future_stars_token",
				"fut_future_stars_evolutions",
				"fut_future_stars_evolutions_premium",
				"fut_future_stars_evolutions_icons",
				"potm_bundesliga",
				"potm_pl",
				"ligue_1_potm",
				"la_liga_potm",
				"potm_serie_a",
				"potm_eredivisie",
				"mls_potm",
				// "winter_upgrade",
				// "league_objective",
				"objectives_reward",
				"objectives_reward_2",
				"dynamic_duo",
				// "icon_swaps_1",
				// "icon_swaps_2",
				// "icon_swaps_3",
				// "icon_swaps_4",
				//  "headliners",
				// "headliners_upgrade",
				// "out_of_position",
				// "shapeshifters",
				// "shapeshifters_heroes",
				// "shapeshifters_icons",
				// "premium_shapeshifters",
				"libertadores",
				// "libertadores_gold",
				"libertadores_motm",
				// "libertadores_tott",
				// "libertadores_flashback",
				// "libertadores_totgs",
				// "libertadores_squad_foundations",
				"sudamericana",
				"sudamericana_motm",
				// "sudamericana_tott",
				"fut_birthday",
				// "fut_birthday_token",			
				"fut_birthday_icons",
				"fut_birthday_evolutions",
				"fut_birthday_evolutions_premium",
				"tots_gold",
				"tots_gold_plus",
				"tots_gold_live",
				"tots_moments",
				"tots_moments_evolutions",
				"tots_champions",
				"tots_champions_plus",
				// "tots_token",
				// "tots_token_2",
				// "dual_entitlement",
				// "fgs_swaps_1",
				// "fgs_swaps_2",
				// "beckham",
				// "kit_promo",
				// "stadium_assets",
				// "teal_assets",
				// "orange_assets",
				"fut_showdown_boost",
				"fut_showdown",
				// "whatif",
				// "whatif_2",
				// "fof",
				// "fof_2",
				// "summer_heat",
				"fut_heroes",
				"aged_stone",
				// "infinite_mirror_1",
				// "infinite_mirror_2",
				// "powered_by_football",
				// "adidas",
				// "signature_signings",
				"fut_versus_ice",
				"fut_versus_fire",
				// "next_generation",
				"winter_wildcard",
				"winter_evolutions",
				"winter_icons",
				// "winter_wildcard_token",
				// "silver_special",
				"fut_fantasy_blue",
				"fut_fantasy_heroes",
				// "fut_fantasy_red",
				// "fut_captains",
				// "fut_captains_upgrade",
				// "summer_swaps_token_1",
				// "wc_player",
				// "wc_icon",
				// "wc_path_to_glory",
				// "wc_star",
				// "wc_swap_token",
				// "wc_fut_heroes",
				// "wc_tott",
				// "wc_road_to_wc",
				// "wc_stories",
				// "wc_phenoms",
				// "wc_showdown",
				// "wc_showdown_boost",
				"fut_centurions",
				"fut_centurions_2",
				"fut_centurions_3",
				"fut_centurions_icons",
				// "history_makers",
				// "fut_ballers",
				// "trophy_titans",
				// "trophy_titan_icons",
				// "level_up",
				// "premium_level_up",
				"evolutions_1",
				"evolutions_2",
				"evolutions_3",
				"evolutions_premium",
				"founders_evolutions_1",
				"founders_evolutions_premium",
				"nike_mad_ready",
				"pundit_picks",
				"fc_pro",
				"fc_pro_boost",
				"fc_pro_champions",
				"fc_pro_champions_icon",
				"thunderstruck",
				"thunderstruck_icon",
				"radioactive",
				"radioactive_evolutions",
				"euros",
				"euros_special",
				"ultimate_dynasties",
				"ultimate_dynasties_icons",
				"special_edition",
				"virtual_bundesliga",
				"golazo_heroes",
				"golazo_icons",
				"greats_of_the_game_hero",
				"greats_of_the_game_icon",
				"euro_path_to_glory",
				"copa_america_path_to_glory",
				"euro_make_your_mark",
				"euro_make_your_mark_plus",
				"copa_america_make_your_mark",
				"copa_america_make_your_mark_plus",
				"fut_vip",
				"euro_tott",
				"copa_america_tott",
				"euro_fof",
				"copa_america_fof"
            ];
			if (jQuery.inArray($(this).val(), valid24) == -1) {
				$(this).attr("disabled", "disabled");
				if ($(this).is(":selected")) {
					$(this).prop("selected", false);
					$("#form-card-color").trigger("change");
				}
            }
        } else {
			if (jQuery.inArray($(this).val(), ["sbc_base", "sbc_premium", "ones_to_watch", "movember", "gotm", "halloween", "confederation_champions_motm", "award_winner", "fut_birthday"]) > -1) {
				$(this).attr("disabled", "disabled");
				if ($(this).is(":selected")) {
					$(this).prop("selected", false);
					$("#form-card-color").trigger("change");
				}
			}
		}
		if (logging) {
			console.log("updateFormCardTypes", $("#form-card-color").val());
		}
	});

	$(".card-type > label > input").each(function () {
		$(this).removeAttr("disabled");
		if (card_year != "17") {
			if (jQuery.inArray($(this).val(), ["futchamp"]) > -1) {
				$(this).attr("disabled", "disabled");
				if ($(this).is(":selected")) {
					$(this).prop("selected", false);
					$(this).trigger("change");
				}
			}
		}
	});
}

function updateFormAttributes() {
	$(".fut-attribute-container, .full-attribute-container").hide();
	if ($("input[name='form-attrib-type']:checked").val() == "fut") {
		$(".fut-attribute-container").show();
	} else {
		$(".full-attribute-container").show();
	}
}

function updateAvailableTextFormats() {
    var text_font = window.getComputedStyle(css_card.find(".playercard-rating")[0]).getPropertyValue('font-family');
    var text_format_radios = $("input[name='form-letter-format'], input[name='form-number-format']");
    if (text_font.indexOf('Cruyff') > -1 || text_font.indexOf('Champion') > -1 || text_font.indexOf('Qatar2022') > -1 || text_font.indexOf('Dusha') > -1) {
        // hide text formats
        text_format_radios.closest(".form-group").hide();
        css_card.find(".playercard-attr .fut-label, .playercard-attr .fut-rating").removeAttr('style');
    } else {
        // show text formats
        text_format_radios.closest(".form-group").show();
    }
}

function updateLetterFormat() {
    var letterFont;
    var letterFormatSetting = $("input[name='form-letter-format']:checked").val();
	if (letterFormatSetting == 'medium') {
    	letterFont = "DinProCondensedMedium";
	}
    if (letterFormatSetting == 'thin') {
    	letterFont = "DinProCondensed";
	}
	
    css_card.find(".playercard-attr .fut-label").attr('style', 'font-family: ' + letterFont + ' !important' );
    setCardTxtFontAndColor();
}

function updateNumberFormat() {
    var numberFont;
    var numberFormatSetting = $("input[name='form-number-format']:checked").val();
	if (numberFormatSetting == 'medium') {
    	numberFont = "DinProCondensedMedium";
	}
    if (numberFormatSetting == 'bold') {
    	numberFont = "DinProCondensedBold";
	}
	
    css_card.find(".playercard-attr .fut-rating").attr('style', 'font-family: ' + numberFont + ' !important' );
    setCardTxtFontAndColor();
}

function updateFormCardExtras(extra) {
	if (typeof extra == 'undefined') {
		// Run all
		updateFormCardExtras('player-name');
		updateFormCardExtras('chemistry-style');
		updateFormCardExtras('work-skill-weak');
		updateFormCardExtras('secondary-icon');
	} else {
		var card_extra = $("input[name='form-card-" + extra + "-toggle']:checked").val(),
			extra_group = $("." + extra + "-group");

		if (extra_group.length > 0) {
			if (card_extra) {
				extra_group.show();
			} else {
				extra_group.hide();
			}
		}

		var card_year = $("#form-card-year").val(),
			card_format = $("input[name='form-card-format']:checked").val(),
			form_card_player_name_toggle = $("input[name='form-card-player-name-toggle']"),
			form_card_player_name = $("input[name='form-card-player-name-toggle']:checked").val(),
			form_card_player_name_container = form_card_player_name_toggle.closest("label"),
			form_card_bottom = $("input[name='form-card-bottom-toggle']:checked").val(),
			form_workrate = $(".workrates-group"),
			form_skillmoves = $(".skillmoves-group"),
			form_weakfoot = $(".weakfoot-group"),
			form_chemistry = $(".chemistry-group"),
			card_workrate = css_card_elements.workrate,
			card_skillmoves = css_card_elements.skillmoves,
			card_weakfoot = css_card_elements.weakfoot,
			card_chemistry = css_card_elements.chemistry,
			card_secondary_icon = css_card_elements.secondaryIcon;
			/*
			$([form_workrate, form_skillmoves, form_weakfoot, form_chemistry, form_card_player_name_container, card_workrate, card_skillmoves, card_weakfoot, card_chemistry, card_secondary_icon, card_name]).each(function() {
				$(this).hide();
			});
			*/
		
		if (extra == 'player-name') {
			if (card_extra) {
				css_card_elements.name.show();
			} else {
				css_card_elements.name.hide();
			}
		}
		
		if (extra == 'chemistry-style') {
			if (card_extra && card_year > 18) {
				card_chemistry.show();
				updateChemistryType();
			} else {
				card_chemistry.hide();
			}
		}
		
		if (extra == 'secondary-icon') {
			if (card_extra) {
				card_secondary_icon.show();
				updateSecondaryIcon();
			} else {
				card_secondary_icon.hide();
			}
		}

		if (extra == 'work-skill-weak') {
			if (card_extra) {
				$([form_workrate, form_skillmoves, form_weakfoot, card_workrate, card_skillmoves, card_weakfoot]).each(function() {
					$(this).show();
				});
			} else {
				$([form_workrate, form_skillmoves, form_weakfoot, card_workrate, card_skillmoves, card_weakfoot]).each(function() {
					$(this).hide();
				});
			}
		}
		
		if (canvas_initialized) {
			updateCardBottomCanvas();
		}

	}
}
	
function updateCardBottomCanvas() {
	updateNameCanvas();
    updateSkillWorkWeakCanvas();
    updateSecondaryIconCanvas();
    updateChemistryTextCanvas();
}

function setConfederation(confederation) {
	if (logging) {
		console.log("setConfederation " + confederation);
	}
    if ($("#form-card-color").val() == "world_cup") {
        $("#form-card-club").val("https://fifarosters.com/assets/confederations/fifa18/" + confederation + ".png").trigger("change");
        $("#form-card-club-text").attr("value", confederation);
    }
}

function updateForWorldCup(on) {
	if (logging) {
		console.log("updateForWorldCup " + on);
	}
    var card = css_card;
    if (on) {
        // swap club for confederation using nation
        // first check for data-confederation, else lookup (save queries)
        if (card.attr("data-confederation") && card.attr("data-confederation") != "") {
            var confederation = card.attr("data-confederation").toUpperCase();
            setConfederation(confederation);
        } else {
            // ajax lookup of confederation
            $.getJSON("lookupnationid.php",
                {
                    term: $("#form-card-nation").val(),
                    year: $(".load_card_year").val()
                })
                .done(function(data) {
                	$("#form-card-nation-text").val(data[0].nation);
                	if (data[0].hasOwnProperty('confederation')) {
                    	card.attr("data-confederation", data[0].confederation);
        	            var confederation = card.attr("data-confederation").toUpperCase();
                        setConfederation(confederation);
                	}
                })
                .fail(function(data) {
                    console.log(data);
                });
            // 
        }
        var nation_id = $("#form-card-nation").val();
        card.find(".playercard-nation img").attr("src", "assets/nations/world-cup/" + nation_id + ".png");
    } else {
        // unset world cup stuff
        // confederation -> club
        $("#form-card-club").val(card.attr("data-club-id")).trigger("change");
        $("#form-card-club-text").attr("value", card.attr("data-club-name")).trigger("change");
        updateClubNation("nation");
		updateClubNation("league");
    }
}

function updateCardBarCanvas() {
    var cardbar_elem = css_card_elements.cardBar;
    
    if (cardbar_elem.css("display") !== "none") {
        cardBar.set({
            top: parseFloat(cardbar_elem.css("top")),
            left: parseFloat(cardbar_elem.css("left")),
            height: parseFloat(cardbar_elem.height()),
            width: parseFloat(cardbar_elem.width()),
            visible: true
        });

        var elem_styles = window.getComputedStyle(cardbar_elem[0]);
        
        var gradient = cardbar_elem.css("background-image");
        
        if (gradient.startsWith("linear-gradient")) {
            var gradient_array = getGradientArray(gradient);
            var color_stops_obj = {};
			var dec_loc;
            
            gradient_array.forEach(function(val, idx) {
                if (val.location.indexOf("%")>-1) {
                    dec_loc = parseFloat(val.location) / 100;
                } else {
                    dec_loc = parseFloat(val.location);
                }
                color_stops_obj[dec_loc] = val.color;
            });
            
            cardBar.setGradient(
                'fill',
                {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: cardBar.height,
                    colorStops: color_stops_obj
                }
            );
        } else {
            cardBar.visible = false;
            console.log("May have been an error reading cardBar");
        }
        imgCanvasCard.renderAll();
    } else {
        cardBar.visible = false;
        imgCanvasCard.renderAll();
    }
}

function getGradientArray(gradient) {
    var color_stops_string = gradient.replace("linear-gradient(", "");
    color_stops_string = color_stops_string.slice(0, -1);
    
    var rgbRegEx = /rgba\((.*?)\)\s(.*?)(\,|$)/gm;
    var rgbParts = color_stops_string.match(rgbRegEx);
    var color_stops_array = [];
    
    rgbParts.forEach(function (color_stop) {
        var colorRegEx = /rgba\((.*?)\)/g;
        var color_portion = color_stop.match(colorRegEx)[0];
        var location_portion = color_stop.replace(color_portion, "");
        location_portion = location_portion.replace(",", "");
        location_portion = location_portion.trim();
        var color_stop_entry = { "color": color_portion, "location": location_portion };
        color_stops_array.push(color_stop_entry);
    });
    
    return color_stops_array;
}

function instantUpdateCard() {
	if (logging) {
		console.log("instantUpdateCard");
	}
	updateYear();
	updateFormCardTypes();
	updateCardType();
	updateImage();
	updateDirect("name");
	updateDirect("rating");
	updateDirect("position");
	updateClubNation("club");
	updateClubNation("nation");
	updateClubNation("league");
	updateFormAttributes();
	updateAttributes();
	updateFormCardExtras();
	updateDirect("attackingworkrate");
	updateDirect("defensiveworkrate");
	updateSkillMoves();
	updateWeakFoot();
	updateFormCardOverlay();
	updateFormCardDynamicCover();

    if (!canvas_initialized) {
        initCanvas();
    }
}

function updateCardCanvas() {
    if (logging) {
        console.log("updateCardCanvas");
    }
	updateNameCanvas();
	updateRatingCanvas();
	updatePlayerPositionCanvas();
	updateClubNationCanvas('club');
	updateClubNationCanvas('nation');
	updateClubNationCanvas('league');
	updateAttributesCanvas();
    updateCardBottomCanvas();
    updateCardShineCanvas();
    updateFormCardCurveShine();
    updatePlayerImageCanvas();
    updateCardFeatureIconCanvas();
	updateFormSquadChemistry();
    updateFormCardDynamicCover();
	updateFormSquadPosition();
    changeCardColorCanvas();
}

function handleAutocomplete(playerdata, ui) {
    // Reset Imge type to 'Player Image'
    $("#form-image-type-player").prop("checked", true);

    // Turn off Fade Image
    $("#form-dynamic-image-cover-none").prop("checked", true);
    
    //console.log(playerdata);
    var card_year = $("#form-card-year"),
        autocomplete_year = parseInt($("#createCardForm .load_card_year").val()),
        playercard = $("#playercard_container .player");
        
    $("#form-card-year").val(autocomplete_year);
    $("#form-card-player-image-year").val(autocomplete_year).trigger("change");

	$.each(playerdata, function(key, value) {
		var myElemName = "",
			myElem,
			img_url;
		if (key == "weakfootabilitytypecode") {
			myElemName = "weakfoot";
		} else if (key == "preferredposition1") {
			myElemName = "position";
		} else if (key == "clubid") {
			myElemName = "club";
		} else if (key == "nationid") {
			myElemName = "nation";
		} else if (key == "leagueid") {
			myElemName = "league";
		} else if (key == "atkworkrate") {
			myElemName = "attackingworkrate";
			value = value.substring(0, 1);
		} else if (key == "defworkrate") {
			myElemName = "defensiveworkrate";
			value = value.substring(0, 1);
		} else if (key == "color") {
			$("#form-card-color").val(value);
			$("#form-card-color").css("background-color", "#ccffba");
			$("#form-card-color").animate({
				backgroundColor: "#fff"
			}, 1500);
		} else {
			myElemName = key;
		}
		
		if (playerdata.position.toLowerCase() == "gk") {
			if (key == "div") {
				myElemName = "attr1";
				$("#form-card-" + myElemName + "-text").val("div");
			} else if (key == "han") {
				myElemName = "attr2";
				$("#form-card-" + myElemName + "-text").val("han");
			} else if (key == "kic") {
				myElemName = "attr3";
				$("#form-card-" + myElemName + "-text").val("kic");
			} else if (key == "ref") {
				myElemName = "attr4";
				$("#form-card-" + myElemName + "-text").val("ref");
			} else if (key == "spd") {
				myElemName = "attr5";
				$("#form-card-" + myElemName + "-text").val("spe");
			} else if (key == "pos") {
				myElemName = "attr6";
				$("#form-card-" + myElemName + "-text").val("pos");
			}
		} else {
			if (key == "pac") {
				myElemName = "attr1";
				$("#form-card-" + myElemName + "-text").val("pac");
			} else if (key == "sho") {
				myElemName = "attr2";
				$("#form-card-" + myElemName + "-text").val("sho");
			} else if (key == "pas") {
				myElemName = "attr3";
				$("#form-card-" + myElemName + "-text").val("pas");
			} else if (key == "dri") {
				myElemName = "attr4";
				$("#form-card-" + myElemName + "-text").val("dri");
			} else if (key == "def") {
				myElemName = "attr5";
				$("#form-card-" + myElemName + "-text").val("def");
			} else if (key == "phy") {
				myElemName = "attr6";
				$("#form-card-" + myElemName + "-text").val("phy");
			}
		}
		
		if (myElemName == "club_name") {
			myElem = $("#form-card-club-text");
		} else if (myElemName == "league_name") {
			myElem = $("#form-card-league-text");
		} else if (myElemName == "nation_name") {
			myElem = $("#form-card-nation-text");
		} else {
			myElem = $("#form-card-" + myElemName);
		}
		if (myElem.prop("tagName")=="INPUT" && (myElem.attr("type")=="text" || myElem.attr("type")=="number" || myElem.attr("type")=="hidden")) {
			myElem.attr("value", value);
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
	
	if (playerdata.playstylesplus !== "") {
		$("#form-card-playstyle-toggle").prop("checked", true);
	}
	setPlayStyleForm(playerdata.playstylesplus);
	
	// image
	if (playerdata.specialimgurl !== "") {
    	/*
    	if (playerdata.color.startsWith("world_cup") || autocomplete_year == '19') {
        	var img_url = playerdata.specialimgurl;
        } else {
    		var img_url = PLAYER_AVATAR_URL_SPECIAL_XL[autocomplete_year] + playerdata.id + ".png";
        }
        */
        img_url = playerdata.specialimgurl;
	} else if (playerdata.headshotimgurl !== "") {
		img_url = playerdata.headshotimgurl; //PLAYER_AVATAR_URL[autocomplete_year] + playerdata.baseid + ".png";
	} else {
    	img_url = ui.item.img_url;
	}
	
	$("#form-card-image").val(img_url);
	$("#form-card-image-text").val(playerdata.name).css("background-color", "#ccffba").animate({
		backgroundColor: "#fff"
	}, 1500);
    $("#form-is-dynamic-image").prop("checked", parseInt(playerdata.isdynamicportrait)>0).trigger("change");

	playercard.attr("data-club-name", playerdata.club_name);
	playercard.attr("data-club-id", playerdata.clubid);
	playercard.attr("data-league-name", playerdata.league_name);
	playercard.attr("data-league-id", playerdata.leagueid);
	playercard.attr("data-nation-name", playerdata.nation_name);
	playercard.attr("data-nation-id", playerdata.nationid);
	
	// Nation name
    $.getJSON("lookupnationid.php",
        {
            term: playerdata.nationid,
            year: $(this.element).attr("fut-year")
        })
        .done(function(data) {
        	$("#form-card-nation-text").val(data[0].nation).css("background-color", "#ccffba").animate({
        		backgroundColor: "#fff"
        	}, 1500);
        	if (data[0].hasOwnProperty('confederation')) {
            	playercard.attr("data-confederation", data[0].confederation);
        	}
        })
        .fail(function(data) {
            console.log(data);
        });
}

function setPlayStyleForm(playstylesplus) {
	var regex = /'([^']+)'/g;
	var playstylesArray = [];
	var match;
	while ((match = regex.exec(playstylesplus)) !== null) {
		playstylesArray.push(match[1].toLowerCase().replace(/\s+/g, '-'));
	}
	for (i=0; i<4; i++) {
		$("#form-card-playstyle" + (i+1)).val(playstylesArray[i] ?? '');
	}
}

function updateBackgroundImage() {
    var bg_type = $("[name='form-background-type']:checked").val(),
	    $bg_container = $("#card-creator-square-background"),
	    preview_html = "",
	    preview_color = "transparent",
	    bg_alignment_container = $(".background-form-item-background-alignment"),
		$background_input;

    if (bg_type == "select") {
        $background_input = $("#form-background-image");
    } else {
        $background_input = $("#form-background-custom");
    }
    
    var background_val = $background_input.val();
	
	if (bg_type == "select" && background_val == "solid-color") {
		var bg_color = $("input#background_selector_solid_color").val();
		$bg_container.css({
    		"background-image" : "none",
			"background-color" : bg_color
		});
		// update preview
		preview_color = bg_color;
		bg_alignment_container.hide();

		imgCanvas.backgroundColor = bg_color;
		bgImage.visible = false;
		bgImage.setSrc(background_val, function(){
			imgCanvas.renderAll();
		});
    } else if (bg_type == "select" && background_val == "transparent") {
		$bg_container.css({
			"background" : "transparent"
		});
		bg_alignment_container.hide();
	} else {
		fabric.Image.fromURL(background_val, function(obj){
			var min = Math.min(obj.width, obj.height);
			var scale_x = (min == obj.width ? imgCanvas.width / obj.width : imgCanvas.height / obj.height);
			obj.set({
				top: imgCanvas.width / 2,
				left: imgCanvas.height / 2,
				originX: 'center',
				originY: 'center',
				scaleX: scale_x,
				scaleY: scale_x,
				editable: false,
				selectable: false,
				evented: false,
			});
			imgCanvas.remove(bgImage);
			bgImage = obj;
			imgCanvas.add(bgImage);
			bgImage.moveTo(0);
            imgCanvas.renderAll();
		}, {
			crossOrigin: 'Anonymous'
		});
	}
	
	// update preview
    $(".background-form-item-background .preview")
        .html(preview_html)
        .css({
            "background" : preview_color
        });
}
function updateBackgroundAlignment() {
	var bg_alignment = $("[name='form-background-alignment']:checked").val(),
	    $bg_container = $("#card-creator-square-background");
    // $bg_container.css("background-position", bg_alignment);
    switch(bg_alignment){
    	case 'top left':
    		bgImage.set({
    			originX: 'left',
    			originY: 'top',
    			left: 0,
    			top: 0
    		});
    		break;
    	case 'top center':
    		bgImage.set({
    			originX: 'center',
    			originY: 'top',
    			left: imgCanvas.width / 2,
    			top: 0
    		});
    		break;
    	case 'top right':
    		bgImage.set({
    			originX: 'right',
    			originY: 'top',
    			left: imgCanvas.width,
    			top: 0
    		});
    		break;
    	case 'center left':
    		bgImage.set({
    			originX: 'left',
    			originY: 'center',
    			left: 0,
    			top: imgCanvas.height / 2
    		});
    		break;
    	case 'center center':
    		bgImage.set({
    			originX: 'center',
    			originY: 'center',
    			left: imgCanvas.width / 2,
    			top: imgCanvas.height / 2
    		});
    		break;
    	case 'center right':
    		bgImage.set({
    			originX: 'right',
    			originY: 'center',
    			left: imgCanvas.width,
    			top: imgCanvas.height / 2
    		});
    		break;

    	case 'bottom left':
    		bgImage.set({
    			originX: 'left',
    			originY: 'bottom',
    			left: 0,
    			top: imgCanvas.height
    		});
    		break;
    	case 'bottom center':
    		bgImage.set({
    			originX: 'center',
    			originY: 'bottom',
    			left: imgCanvas.width / 2,
    			top: imgCanvas.height
    		});
    		break;
    	case 'bottom right':
    		bgImage.set({
    			originX: 'right',
    			originY: 'bottom',
    			left: imgCanvas.width,
    			top: imgCanvas.height
    		});
    		break;
    	default:
    		break;
    }
    imgCanvas.renderAll();
    
}
function toggleFifaLogo() {
	if ($("#form-background-fifa-logo").is(":checked")) {
		$("#fifa-logo").show();
	} else {
		$("#fifa-logo").hide();
	}
}
function toggleFifaRostersTag() {
	if ($("#form-background-fifarosters-tag").is(":checked")) {
		$("#fifarosters-tag").show();
		copyright_group.visible = true;
	} else {
		$("#fifarosters-tag").hide();
		copyright_group.visible = false;
	}
	imgCanvas.renderAll();
}
function toggleBackgroundForm() {
	$(".bg-effects-form").toggle("slide", "fast");
}

function deleteBackgroundFormItem(item) {
	var $form_item = $(item).parents(".list-group-item");
	
	var $item_id = $form_item.attr("id");
	var item_num = $item_id.replace("child-form-item-", "");
	$form_item.remove();
	$("#child-" + item_num).remove();

	imgCanvas.remove(items[item_num - 1]);
	imgCanvas.remove(itemsImgs[item_num - 1]);
	imgCanvas.remove(itemsImgsCustom[item_num - 1]);

	imgCanvas.renderAll();
}

var backgroundItemArray = [];

function addBackgroundFormItem(isCard) {
	if (typeof isCard == "undefined") {
		isCard = false;
	}
	
	var $bg_container = $("#card-creator-square-background");
	var $bg_form = $("#addBackground .bg-effects-form .form");
	var $sortable_container = $bg_form.find(".sortable-items");
	var num_children = backgroundItemArray.length;
	var next_child = num_children+1;
	backgroundItemArray.push(next_child);
	
	// create child item on background
	$bg_container.append("<div id=\"child-" + next_child + "\" class=\"child-item\" data-id=\"" + next_child + "\"></div>");
	var $new_child_container = $("#child-" + next_child);
	$new_child_container.css({ "position" : "absolute", "top" : "0", "left" : "250px" });
	// add placeholders for types
	$new_child_container.append("<div class=\"child-inner\"><div class=\"child-item-text\"></div><div class=\"child-item-image\"><img src=\"\"></div></div>");
	
	// setup form item
	var $new_child = $("#addBackground #child-item-clone").children().eq(0).clone();
	$new_child.attr("id", "child-form-item-" + next_child).attr("data-id", next_child);
	$new_child.find("[data-target=\"#child-content\"]").attr("data-target", "#child-content-" + next_child);
	$new_child.find("#child-content").attr("id", "child-content-" + next_child);
	$new_child.find(".form-item-number").html(next_child);
	$new_child.appendTo($sortable_container);
	$sortable_container.sortable("refresh");

	$new_child_container.draggable({
    	stop: function( event, ui ) {
        	$new_child.find(".background-form-item-position-x").val(ui.position.top);
        	$new_child.find(".background-form-item-position-y").val(ui.position.left);
    	}
	});

	var $new_child_item_type = $new_child.find(".background-form-item-type");

	/*
	var caller = $(elem);
	if (caller.attr("data-download") == "background") {
		var downloadElement = $("#card-creator-square-background");
	} else {
		var element_css = $("#playercard_container .player").css("transform");
		
		var downloadElement = $("#playercard_container .player .playercard");
	}
	*/

	if (isCard) {
		var current_item_html = $new_child.find(".form-item-number").html();
		var player_name = $("#form-card-name").val();
		var card_name = $new_child.find(".form-item-number").html(current_item_html + " (" + player_name.substr(0, 15) + ")");
		var clonedCard = $("#playercard_container .player").clone();
		clonedCard.attr("id", "clonedCard").appendTo("body");
		
		var $form_item = $new_child.find(".background-form-item-text input[type='text']");
		//$new_child_container.find(".child-item-image img").remove();
		var appendTo = $new_child_container.find(".child-item-image");
		
		// var cardFormItemSetup = function(data) {
		// 	appendTo.find("img").attr("src", data).on("load", function () {
		// 		$new_child.find(".background-form-item-size input[type='number']").val(40);
		// 		updateSize("background-form-item-size", next_child);
		// 		recenterItem($new_child_item_type);
		// 	});
		// 	$new_child.find(".background-form-item-text-color").addClass("hidden");
		// 	$new_child.find(".background-form-item-font").addClass("hidden");
		// 	$new_child.find(".background-form-item-font-size").addClass("hidden");
		// 	$new_child.find(".background-form-item-text").addClass("hidden");
		// 	$new_child.find(".background-form-item-image").addClass("hidden");
		// 	$new_child_item_type.addClass("hidden");
			
		// 	$("body > .player").remove();
		// 	$("body > canvas").remove();
		// }
		// var cardFormItemSetup = function(data) {
		// 	appendTo.find("img").attr("src", data).on("load", function () {
		// 		$new_child.find(".background-form-item-size input[type='number']").val(40);
		// 		updateSize("background-form-item-size", next_child);
		// 		recenterItem($new_child_item_type);
		// 	});
			$new_child.find(".background-form-item-text-color").addClass("hidden");
			$new_child.find(".background-form-item-font").addClass("hidden");
			$new_child.find(".background-form-item-font-size").addClass("hidden");
			$new_child.find(".background-form-item-text").addClass("hidden");
			$new_child.find(".background-form-item-image").addClass("hidden");
			$new_child.find(".background-form-item-text-shadow").addClass("hidden");
			$new_child_item_type.addClass("hidden");
			
			$("body > .player").remove();
			$("body > canvas").remove();
		// }
		// generateImage($("#tab-addbackground a")[0], $("#clonedCard"), null, null, cardFormItemSetup, null);
		var item1 = new fabric.Text('TEXT', { visible: false, });
		var item2 = new fabric.Text('TEXT', { visible: false, });

		imgCanvas.add(item1);
		imgCanvas.add(item2);

		itemsImgsCustom.push(item1);
		items.push(item2);

		var itemImg = fabric.Image.fromURL(imgCanvasCard.toDataURL(), function(img) {
		    img.left = imgCanvas.width / 2;
		    img.top = imgCanvas.height / 2;
		    img.scaleX = (imgCanvas.width / 3 ) /img.width;
			img.scaleY = (imgCanvas.width / 3 ) /img.width;
			img.originX = 'center';
			img.originY = 'center';
		    imgCanvas.add(img);
		    img.bringToFront();
		    imgCanvas.renderAll();
			itemsImgs.push(img);
			img.setCoords();
			updateLayers();
			updateFormXY(next_child);
		});
	} else {
		updateBackgroundItemType($new_child_item_type, "text");
		$new_child.find(".background-form-item-text-color input").spectrum({
			color: "#fff",
			showInput: true,
			replacerClassName: "spectrum-picker",
			containerClassName: "spectrum-palette",
			showInitial: true,
			showPaletteOnly: true,
			togglePaletteOnly: true,
			togglePaletteMoreText: 'More',
			togglePaletteLessText: 'Less',
			allowEmpty: false,
			showSelectionPalette: true,
			localStorageKey: "fifarosters.createcard",
			maxSelectionSize: 10,
			showAlpha: true,
			hideAfterPaletteSelect: true,
			preferredFormat: "rgb",
			change: function(color) {
				// $("#basic-log").text("change called: " + color.toHexString());
				updateBackgroundItemTextColor(next_child);
			}
		});
        $new_child.find(".background-form-item-text-shadow-color input").spectrum({
			color: "rgba(0,0,0,.5)",
			showInput: true,
			replacerClassName: "spectrum-picker",
			containerClassName: "spectrum-palette",
			showInitial: true,
			showPaletteOnly: true,
			togglePaletteOnly: true,
			togglePaletteMoreText: 'More',
			togglePaletteLessText: 'Less',
			allowEmpty: false,
			showSelectionPalette: true,
			localStorageKey: "fifarosters.createcard",
			maxSelectionSize: 10,
			showAlpha: true,
			hideAfterPaletteSelect: true,
			preferredFormat: "rgb",
			change: function(color) {
				// $("#basic-log").text("change called: " + color.toHexString());
				updateTextShadow(next_child);
			}
		});
		toggleTextShadow(next_child);
		addItem();
		updateLayers();
		updateFormXY(next_child);
	}
}

function getBackgroundFormId(elem) {
	var container = $(elem).parents(".child-form-item");
	return getElementFormId(container);
}

function getElementFormId(elem) {
	return $(elem).attr("data-id");
}

function updateBackgroundItemType(elem, type) {
	var form_item_id = getBackgroundFormId(elem);
	var $form_item_container = $("#child-form-item-" + form_item_id);
	var $item_text = $form_item_container.find(".background-form-item-text");
	var $item_font_controls = $form_item_container.find(".background-form-item-text .bold-control, .background-form-item-text .italic-control");
	var $item_font_size = $form_item_container.find(".background-form-item-font-size");
	var $item_font = $form_item_container.find(".background-form-item-font");
	var $item_size = $form_item_container.find(".background-form-item-size");
	var $item_text_label = $form_item_container.find(".background-form-item-text label");
	var $item_color = $form_item_container.find(".background-form-item-text-color");
	var $item_image = $form_item_container.find(".background-form-item-image");
	var $item_opacity = $form_item_container.find(".background-form-item-opacity");
	var $background_item = $("#child-" + form_item_id);
	
	// disable draggable while type updates contents
	
	$background_item.draggable("disable").css({ "width":"auto", "height":"auto" });

	if (type == "text") {
		// show text, bold/italic buttons, color, font size
		$item_text.removeClass("hidden");
		$item_font_controls.removeClass("hidden");
		$item_color.removeClass("hidden");
		$item_font_size.removeClass("hidden");
		$item_font.removeClass("hidden");
		// set text label to "text"
		$item_text_label.html("Text:");
		// hide image select, item size
		$item_image.addClass("hidden");
		$item_size.addClass("hidden");
		
		$background_item.find(".child-item-text").removeClass("hidden");
		$background_item.find(".child-item-image").addClass("hidden");
		updateBackgroundItemText(form_item_id);

		if(items[form_item_id - 1] != undefined){
			items[form_item_id - 1].visible = true;
			itemsImgs[form_item_id - 1].visible = false;
			itemsImgsCustom[form_item_id - 1].visible = false;
			imgCanvas.renderAll();
		}
	}
	if (type == "image") {
		// show image select, item size
		$item_image.removeClass("hidden");
		$item_size.removeClass("hidden");
		// hide text, color, font size
		$item_text.addClass("hidden");
		$item_color.addClass("hidden");
		$item_font_size.addClass("hidden");
		$item_font.addClass("hidden");
		
		$background_item.find(".child-item-text").addClass("hidden");
		$background_item.find(".child-item-image").removeClass("hidden");
		updateBackgroundItemImage(form_item_id);

		items[form_item_id - 1].visible = false;
		itemsImgsCustom[form_item_id - 1].visible = false;
		itemsImgs[form_item_id - 1].visible = true;

		imgCanvas.renderAll();
	}
	if (type == "custom-image") {
		// show text, item size
		$item_text.removeClass("hidden");
		$item_size.removeClass("hidden");
		// hide bold/italic buttons, image select, color, font size
		$item_font_controls.addClass("hidden");
		$item_font_size.addClass("hidden");
		$item_font.addClass("hidden");
		$item_image.addClass("hidden");
		$item_color.addClass("hidden");
		// set text label to "Image URL"
		$item_text_label.html("Image URL:");
		
		$background_item.find(".child-item-text").addClass("hidden");
		$background_item.find(".child-item-image").removeClass("hidden");
		updateBackgroundItemImage(form_item_id);

		items[form_item_id - 1].visible = false;
		itemsImgsCustom[form_item_id - 1].visible = true;
		itemsImgs[form_item_id - 1].visible = false;
		imgCanvas.renderAll();
	}
	// re-enable draggable to reset properties with new contents
	$background_item.draggable("enable");
}

function updateBackgroundItemText(id) {
	var $form_item_container = $("#child-form-item-" + id),
		$item_type = $form_item_container.find(".background-form-item-type select").val(),
		$form_item,
		$child_item;
	if ($item_type == "text") {
		$form_item = $("#child-form-item-" + id + " .background-form-item-text input[type='text']");
		$child_item = $("#child-" + id + " .child-item-text");
		if ($form_item.val() == "http://i.imgur.com/8SBuJrH.png") {
			$form_item.val("Text");
		}
		// $child_item.html($form_item.val());
		if(items[id - 1] != undefined){
			items[id - 1].set('text', $form_item.val());
			imgCanvas.renderAll();
		}
	} else if ($item_type == "custom-image") {
		$form_item = $("#child-form-item-" + id + " .background-form-item-text input[type='text']");
		$child_item = $("#child-" + id + " .child-item-image img");
		$child_item.attr("src", $form_item.val());
	}
}

function updateBackgroundItemImage(id) {
	var $form_item_container = $("#child-form-item-" + id);
	var $item_type = $form_item_container.find(".background-form-item-type select").val();
	var $form_item;
	var $child_item = $("#child-" + id + " .child-item-image img");
	if ($item_type == "image") {
		$form_item = $form_item_container.find(".background-form-item-image input[type='hidden']");
		// update preview
		// $form_item_container.find(".background-form-item-image .preview").html("<img src=\"" + $form_item.val() + "\">");

		itemsImgs[id - 1].setSrc($form_item.val(), function(img){
			img.set({
				scaleX: (imgCanvas.width / 3 ) /img.width,
				scaleY: (imgCanvas.width / 3 ) /img.width,
				top: imgCanvas.width / 2,
				left: imgCanvas.height / 2,
				originX: 'center',
				originY: 'center',
			});
			itemsImgs[id - 1].setCoords();
			imgCanvas.renderAll();
		});
	} else if ($item_type == "custom-image") {
		$form_item = $form_item_container.find(".background-form-item-text input[type='text']");
		if ($form_item.val() == "Text") {
			$form_item.val("http://i.imgur.com/8SBuJrH.png");
		}

		imgCanvas.remove(itemsImgsCustom[id - 1]);
		fabric.Image.fromURL($form_item.val(), function(img){
			img.set({
				scaleX: (imgCanvas.width / 3 ) /img.width,
				scaleY: (imgCanvas.width / 3 ) /img.width,
				top: imgCanvas.width / 2,
				left: imgCanvas.height / 2,
				originX: 'center',
				originY: 'center',
			});
			itemsImgsCustom[id - 1] = img;
			imgCanvas.add(itemsImgsCustom[id - 1]);
			itemsImgsCustom[id - 1].setCoords();
			imgCanvas.renderAll();
		}, {
			crossOrigin: 'Anonymous'
		});
	}

	$child_item.attr("src", $form_item.val());
}

function updateBackgroundItemTextColor(id) {
	var $form_item_container = $("#child-form-item-" + id);
	var $form_item = $form_item_container.find(".background-form-item-text-color input");
	// var $child_item = $("#child-" + id + " .child-item-text");
	// $child_item.css("color", $form_item.val());
	items[id - 1].set('fill', $form_item.val());
	imgCanvas.renderAll();

}

function toggleBoldText(id) {
	var $form_item_container = $("#child-form-item-" + id);
	var $form_item = $form_item_container.find(".background-form-item-text button.bold-control");
	var $child_item = $("#child-" + id + " .child-item-text");
	if ($form_item.hasClass("active")) {
		// turn off
		$form_item.removeClass("active");
		// $child_item.removeClass("text-bold");
		items[id - 1].set('fontWeight', 'normal');
	} else {
		// turn on
		$form_item.addClass("active");
		// $child_item.addClass("text-bold");
		items[id - 1].set('fontWeight', 'bold');
	}
	imgCanvas.renderAll();
}

function toggleItalicText(id) {
	var $form_item_container = $("#child-form-item-" + id);
	var $form_item = $form_item_container.find(".background-form-item-text button.italic-control");
	var $child_item = $("#child-" + id + " .child-item-text");
	if ($form_item.hasClass("active")) {
		// turn off
		$form_item.removeClass("active");
		// $child_item.removeClass("text-italic");
		items[id - 1].set('fontStyle', 'normal');
	} else {
		// turn on
		$form_item.addClass("active");
		// $child_item.addClass("text-italic");
		items[id - 1].set('fontStyle', 'italic');
	}
	imgCanvas.renderAll();
}

function increaseSize(elem) {
	// get form item id and child item id
	var id = getBackgroundFormId(elem);
	var form_group;
	if ($(elem).closest(".form-group").hasClass("background-form-item-size")) {
		form_group = "background-form-item-size";
	} else {
		form_group = "background-form-item-font-size";
	}
	var $form_item = $("#child-form-item-" + id + " ." + form_group + " input");
	var size = $form_item.val();
	
	size++;
	
	// set input to new size
	$form_item.val(size);
	
	// update child to new size
	updateSize(form_group, id);
}
function decreaseSize(elem) {
	// get form item id and child item id
	var id = getBackgroundFormId(elem);
	var form_group;
	if ($(elem).closest(".form-group").hasClass("background-form-item-size")) {
		form_group = "background-form-item-size";
	} else {
		form_group = "background-form-item-font-size";
	}
	var $form_item = $("#child-form-item-" + id + " ." + form_group + " input");
	var size = $form_item.val();
	// check if size is at max (smallest)
	if (size > 0) {
		size--;
	}
	
	// set input to new size
	$form_item.val(size);
	
	// update child to new size
	updateSize(form_group, id);
}
function updateSize(form_group, id) {
	// get form item id and child item id
	var $form_item_container = $("#child-form-item-" + id);
	var $size_input = $form_item_container.find("." + form_group + " input");
	var $child_item;
	var dimensions;
	if (form_group == "background-form-item-font-size") {
		$child_item = $("#child-" + id + " .child-item-text");
		$child_item.css("font-size", $size_input.val() + "px");
	} else {
		$child_item = $("#child-" + id);
		if ($child_item.find("img").length > 0) {
			var $child_item_img = $("#child-" + id + " img");
			dimensions = getNativeImageSize($child_item_img.attr("src"));
		} else {
			var $child_item_canvas = $("#child-" + id + " canvas");
			dimensions = { "height" : $child_item_canvas.attr("height"), "width" : $child_item_canvas.attr("width") };
		}
		// multiply image_size by val as percentage
		var new_width = dimensions.width*($size_input.val()/100);
		$child_item.css("width", new_width + "px");
	}
}

function updateFont(form_group, id) {
	// get form item id and child item id
	var $form_item_container = $("#child-form-item-" + id);
	var $font_input = $form_item_container.find("." + form_group + " select");
	if (form_group == "background-form-item-font") {
		var $child_item = $("#child-" + id + " .child-item-text");
		
		Promise.all(
		  g_fonts.map(font_ => new FontFaceObserver(font_).load())
		).then(function() {
			items[id - 1].set({
				fontFamily: $font_input.val(),
			});
			imgCanvas.renderAll();
		});

		// $child_item.removeClass(function(index, className) {
		// 	// Remove any classes that start with "font-"
		// 	return (className.match (/(^|\s)font-\S+/g) || []).join(' ');
		// }).addClass($font_input.val());
	}
}

function getNativeImageSize(src) {
	// Create new offscreen image to test
	var theImage = new Image();
	theImage.src = src;
	
	// Get accurate measurements from that.
	var imageWidth = theImage.width;
	var imageHeight = theImage.height;
	var dimensions = {"height":imageHeight, "width":imageWidth};
	return dimensions;
}
function recenterItem(elem) {
	var id = getBackgroundFormId(elem),
	    $child_item = $("#child-" + id),
	    background_container = $("#card-creator-square-background"),
	    half_ht = background_container.height()/2,
	    half_wt = background_container.width()/2;
	
	$child_item.css({ "top":(half_ht - ($child_item.height()/2)) + "px", "left":(half_wt - ($child_item.width()/2)) + "px" });
	items[id - 1].set({
		left: imgCanvas.width / 2,
		top: imgCanvas.height / 2
	});
	items[id - 1].setCoords();
	itemsImgs[id - 1].set({
		left: imgCanvas.width / 2,
		top: imgCanvas.height / 2
	});
	itemsImgs[id - 1].setCoords();
	itemsImgsCustom[id - 1].set({
		left: imgCanvas.width / 2,
		top: imgCanvas.height / 2
	});
	itemsImgsCustom[id - 1].setCoords();
	imgCanvas.renderAll();
	updateFormXY(id);
}

function increaseRotation(id) {
	// fetch input value
	var $form_item = $("#child-form-item-" + id + " .background-form-item-rotation input");
	var rotation = $form_item.val();
	
	// check if size is at max (smallest)
	if (rotation == 359) {
		rotation = 0;
	} else {
		rotation++;
	}
	
	// set input to new rotation
	$form_item.val(rotation);
	
	// update child to new rotation
	updateTransform(id);
}
function decreaseRotation(id) {
	// fetch input value
	var $form_item = $("#child-form-item-" + id + " .background-form-item-rotation input");
	var rotation = $form_item.val();
	
	// check if size is at max (smallest)
	if (rotation == 0) {
		rotation = 359;
	} else {
		rotation--;
	}
	
	// set input to new rotation
	$form_item.val(rotation);
	
	// update child to new rotation
	updateTransform(id);
}
function updateTransform(id) {
	// get form item id and child item id
	var $form_item_container = $("#child-form-item-" + id);
	var $size_input = $form_item_container.find(".background-form-item-size input");
	var $rotation_input = $form_item_container.find(".background-form-item-rotation input");
	var $child_item = $("#child-" + id + " .child-inner");
	// adapt numbers
	var degrees = "rotate(" + $rotation_input.val() + "deg)";
	var size = "scale(" + $size_input.val()/100 + ")";
	// change rotation
	$child_item.css({
			"-ms-transform" : degrees + " " + size,
			"-webkit-transform" : degrees + " " + size,
			"transform" : degrees + " " + size
		});
}

function updateLayers() {
    var $sortable_container = $("#addBackground .sortable-items"),
        sort_items = $sortable_container.children().not(".ui-sortable-placeholder"),
        sort_count = sort_items.length;
    $.each(sort_items, function(index, sort_item) {
        var id = getElementFormId($(sort_item)),
            $child_item = $("#child-" + id),
            layer = (sort_count+2)-index,
            $form_item_container = $("#child-form-item-" + id);
        $child_item.css("zIndex", layer);

    	// if(items[id - 1] != null){
    		items[id - 1].moveTo(index + 1);
    	// }
    	// console.log(itemsImgs);
    	// if(itemsImgs[id - 1] != null){
    		itemsImgs[id - 1].moveTo(index + 1);
    	// }
    	// if(itemsImgsCustom[id - 1] != null){
    		itemsImgsCustom[id - 1].moveTo(index + 1);
    	// }

    	imgCanvas.renderAll();

        $form_item_container.find("input.background-form-item-layer").val(layer);
    });
}

function updateOpacity(id) {
	// get form item id and child item id
	var $form_item_container = $("#child-form-item-" + id);
	var $opacity_input = $form_item_container.find(".background-form-item-opacity input");
	// var $child_item = $("#child-" + id);
    // $child_item.css("opacity", $opacity_input.val()/100);

    items[id - 1].set('opacity', $opacity_input.val()/100);
    itemsImgs[id - 1].set('opacity', $opacity_input.val()/100);
    itemsImgsCustom[id - 1].set('opacity', $opacity_input.val()/100);

    imgCanvas.renderAll();
}

function updateTextShadow(id) {
	// get form item id and child item id
	var $form_item_container = $("#child-form-item-" + id);
	var textshadow_toggle = $form_item_container.find(".background-form-item-text-shadow-toggle").is(":checked");
	var textshadow_offsetx = $form_item_container.find(".background-form-item-text-shadow-x").val();
	var textshadow_offsety = $form_item_container.find(".background-form-item-text-shadow-y").val();
	var textshadow_blur = $form_item_container.find(".background-form-item-text-shadow-blur input").val();
	var textshadow_color = $form_item_container.find(".background-form-item-text-shadow-color input").val();
	var $child_item = $("#child-" + id);
	
	$.each([textshadow_offsetx, textshadow_offsety, textshadow_blur], function(index, value) {
        if (value == null) {
            value = 0;
        }
	});
	
	// var text_shadow_output = textshadow_offsetx + "px " + textshadow_offsety + "px " + textshadow_blur + "px " + textshadow_color;
	var text_shadow_output = textshadow_color + ' ' + textshadow_offsetx + "px " + textshadow_offsety + "px " + textshadow_blur + "px";
	
	if(items[id - 1] != undefined){
		if (textshadow_toggle) {
	        // $child_item.css("text-shadow", text_shadow_output);
	        items[id - 1].set('shadow', text_shadow_output);
	    } else {
	        // $child_item.css("text-shadow", "none");
	        items[id - 1].set('shadow', 'none');
	    }
	}

    imgCanvas.renderAll();
}

function toggleTextShadow(id) {
	// get form item id and child item id
	var $form_item_container = $("#child-form-item-" + id);
	var textshadow_details = $form_item_container.find(".background-form-item-text-shadow-details");
	var textshadow_toggle = $form_item_container.find(".background-form-item-text-shadow-toggle").is(":checked");
	
	if (textshadow_toggle) {
        textshadow_details.show();
        $form_item_container.find(".background-form-item-text-shadow-color input").spectrum("reflow");
    } else {
        textshadow_details.hide();
    }
    updateTextShadow(id);
}

function updateFormXY(id) {
	// get form item id and child item id
	var $form_item_container = $("#child-form-item-" + id);
	var $child_item = $("#child-" + id);

    // Update x and y form inputs
    // $form_item_container.find("input.background-form-item-position-x").val($child_item.position().top);
    // $form_item_container.find("input.background-form-item-position-y").val($child_item.position().left);
}

function updatePosition(id) {
	// get form item id and child item id
	var $form_item_container = $("#child-form-item-" + id);
	var $child_item = $("#child-" + id);
    $child_item.css({
            "top": $form_item_container.find("input.background-form-item-position-x").val() + "px",
            "left": $form_item_container.find("input.background-form-item-position-y").val() + "px"
        });
}

function updateBackgroundType() {
    var bg_type = $("[name='form-background-type']:checked").val();
    $(".select-background-type, .custom-background-type").hide();
    $("." + bg_type + "-background-type").show();
    updateBackgroundImage();
}

function saveCreatedCard() {
    $.ajax({
        type: "post",
        url: "utils/saveCreatedCard.php",
        data: $("#createCardForm").serialize()
    })
        .done(function(response) {
            console.log( "success" );
            console.log(response);
        })
        .fail(function() {
            console.log( "error" );
        })
        .always(function() {
            console.log( "complete" );
        });
}

function updateDownloadSize(e, elem) {
    e.preventDefault();
    var value = elem.attr("data-value");
    $("#form-card-download-size-button").text(value + "x");
    $("#form-card-download-size").val(value);
}

function isolateField(elem) {
    // get current isolation status
    var btn = $(elem),
        isolated = btn.attr("data-isolated");

    // initialize or toggle
    if (typeof isolated == "undefined" || isolated == "off") {
        btn.attr("data-isolated", "on");
        isolated = "on";
        btn.find(".fa").removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
        btn.attr("data-isolated", "off");
        isolated = "off";
        btn.find(".fa").removeClass("fa-eye-slash").addClass("fa-eye");
    }
    
    btn.closest(".form-group").siblings().each(function() {
        var formGroup = $(this),
            previous_state = formGroup.attr("data-previous-state");
            
        // check previous state, set if not set
        if (typeof previous_state == "undefined" || isolated == "on") {
            if (formGroup.is(":visible")) {
                formGroup.attr("data-previous-state", "visible");
                formGroup.hide();
            } else {
                formGroup.attr("data-previous-state", "hidden");
            }
        }
        
        if (isolated == "off") {
            if (previous_state == "visible") {
                formGroup.show();
            }
            if (previous_state == "hidden") {
                formGroup.hide();
            }
        }
    });
}

$(document).ready(function() {
    
    displayAdBlockMessage();

    // Setup single reference for main card and internal elements
	css_card = $("#playercard_container .player");
	css_card_elements = {
        "hover": css_card.find(".hover"),
        "overlay": css_card.find(".overlay"),
        "cardBar": css_card.find(".card-bar"),
        "rating": css_card.find(".playercard-rating"),
        "name": css_card.find(".playercard-name"),
        "position": css_card.find(".playercard-position"),
        "nation": css_card.find(".playercard-nation"),
        "club": css_card.find(".playercard-club"),
        "league": css_card.find(".playercard-league"),
        "dynamicCover": css_card.find(".playercard-dynamic-cover"),
        "picture": css_card.find(".playercard-picture"),
        "midBar": css_card.find(".playercard-mid-bar"),
        "workrate": css_card.find(".playercard-workrate"),
        "attackingworkrate": css_card.find(".playercard-attackingworkrate"),
        "defensiveworkrate": css_card.find(".playercard-defensiveworkrate"),
        "skillmoves": css_card.find(".playercard-skillmoves"),
        "weakfoot": css_card.find(".playercard-weakfoot"),
				"foot": css_card.find(".playercard-foot"),
        "chemistry": css_card.find(".playercard-chemistry"),
        "secondaryIcon": css_card.find(".playercard-fifarosters"),
        "attr1": css_card.find(".playercard-attr1"),
        "attr2": css_card.find(".playercard-attr2"),
        "attr3": css_card.find(".playercard-attr3"),
        "attr4": css_card.find(".playercard-attr4"),
        "attr5": css_card.find(".playercard-attr5"),
        "attr6": css_card.find(".playercard-attr6"),
        "divider1": css_card.find(".attr-divider-1"),
        "divider2": css_card.find(".attr-divider-2"),
        "divider3": css_card.find(".attr-divider-3"),
        "divider4": css_card.find(".attr-divider-4"),
        "divider5": css_card.find(".attr-divider-5"),
				"playstyle": {
					0: css_card.find(".playercard-playstyle.first"),
					1: css_card.find(".playercard-playstyle.second"),
					2: css_card.find(".playercard-playstyle.third"),
					3: css_card.find(".playercard-playstyle.fourth")
				}
	};

	txtWorkRatesLabel.set('text', css_card_elements['workrate'].find(".midbar-label").text());
	txtSkillLabel.set('text', css_card_elements['skillmoves'].find(".midbar-label").text());
	txtWeakLabel.set('text', css_card_elements['weakfoot'].find(".midbar-label").text());
	txtFootLabel.set('text', css_card_elements['foot'].find(".midbar-label").text());

	// backup original handler
	var _mouseStart = $.ui.draggable.prototype._mouseStart;
	
	$.ui.draggable.prototype._mouseStart = function(event) {
	
		//remove the transform
		var transform = this.element.css('transform');
		this.element.css('transform', 'none');
		
		// call original handler
		var result = _mouseStart.call(this, event);
		
		//restore the transform
		this.element.css('transform', transform);
		
		return result;
	};
	
	// Setup background solid color widget
	$("input#background_selector_solid_color").spectrum({
		    flat: true,
			color: "#fff",
			showInput: true,
			replacerClassName: "spectrum-picker",
			containerClassName: "spectrum-palette",
			showInitial: true,
			allowEmpty: false,
			showPalette: true,
			showSelectionPalette: true,
			localStorageKey: "fifarosters.createcard",
			maxSelectionSize: 6,
			showAlpha: true,
			preferredFormat: 'rgb',
			palette: [
				// FIFA 18 palette
				//["#B9F840", "#EFB439", "#BA1D3A", "#CF206A", "#201D56"],
				["#144ee3", "#f8336d", "#4efed9", "#d423bd", "#053188"],
                ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
            ]
		});

    $("input#background_selector_solid_color").on("change", function (e) {
        var bg_form_element = $("#form-background-image"),
            prev_color = bg_form_element.attr("data-color"),
            current_color = $(this).val();
        // prevent initializing onchange from screwing up modal
		if (prev_color != current_color) {
			ImageCreator_SelectBackground(e, $(this));
			bg_form_element.attr("data-color", current_color);
        } else {
            e.preventDefault();
            return false;
        }
    });
	
	// Load initial background
	$("#form-background-image").trigger("change");
	
	instantUpdateCard();
	//checkCardScroll();
	//$("#createCardForm input, #createCardForm select").on("keydown keyup click change", instantUpdateCard);
	
	$("#form-card-starter").on("change", function() {
		setTimeout(instantUpdateCard(), 1);
	});
	$("#form-card-year").on("change", function() {
        removeCustomDesignCss();
		setTimeout(function() {
			updateYear();
			updateFormCardTypes();
		}, 0);
	});
	//$("#form-card-color, input[name='form-card-type']").on("keyup click change", function() {
	$("#form-card-color").on("keyup click change", function() {
		updateFormCardTypes();
		updateCardType();
	});

	$("#form-card-3d-toggle").on("change", function() {
		setTimeout(function() {
			toggle3dCard();
		}, 0);
	});

	$("#form-card-shine-toggle").on("change", function() {
		setTimeout(function() {
			updateCardShine();
		}, 0);
	});

	$("#form-card-curve-shine-toggle").on("change", function() {
		setTimeout(function() {
			updateCurveShineCanvas();
		}, 0);
	});
	
	$("input[name='form-dynamic-image-cover']").on("keyup click change", function() {
        setTimeout(function() {
            updateFormCardDynamicCover();
        }, 0);
	});

    $("#form-fade-color").spectrum({
		showInput: true,
		color: current_card_color,
		replacerClassName: "spectrum-picker",
		containerClassName: "spectrum-palette",
		showInitial: true,
		showPaletteOnly: false,
		showPalette: true,
		allowEmpty: false,
		showSelectionPalette: true,
		localStorageKey: "fifarosters.createcard",
		maxSelectionSize: 10,
		showAlpha: true,
		hideAfterPaletteSelect: true,
		preferredFormat: "rgb"
	});

    $("#form-fade-color").on("change", function (e) {
        var current_color = $(this).val();
        setCurrentCardColors(current_color);
        updateDynamicImageCover();
    });
	
    $("input[name='form-image-filter']").on("keyup click change", function() {
        if ($(this).val() == "custom") {
            $("#advFilters").collapse("toggle");
        } else {
            $("#advFilters").collapse("hide");
        }
        setTimeout(function() {
            updateImageFilterCanvas();
        }, 0);
    });
    
    $("#image-filter-sepia, #image-filter-grayscale, #image-filter-blackwhite, #image-filter-brightness, #image-filter-brightness-value, #image-filter-contrast, #image-filter-contrast-value, #image-filter-saturation, #image-filter-saturation-value").on("keyup click change", function() {
        setTimeout(function() {
            updateImageFilterCanvas();
        }, 0);
    });

	$("#form-card-overlay-toggle").on("change", function() {
		setTimeout(function() {
			updateFormCardOverlay();
		}, 0);
	});

	$("#form-card-overlay").on("change", function() {
		setTimeout(function() {
			updateCardOverlay();
		}, 0);
	});
	
	$("#form-card-overlay-text").on("keyup click change", function() {
		setTimeout(function() {
			updateCardOverlay();
		}, 0);
	});

	$("#form-card-feature-icon-toggle, input[name='form-card-feature-icon']").on("change", function() {
		setTimeout(function() {
			updateCardFeatureIconCanvas();
		}, 0);
	});

	$("#form-card-playstyle-toggle, input[name='form-card-playstyle1'], #form-card-playstyle1, input[name='form-card-playstyle2'], #form-card-playstyle2, input[name='form-card-playstyle3'], #form-card-playstyle3, input[name='form-card-playstyle4'], #form-card-playstyle4").on("change", function() {
		setTimeout(function() {
			updateCardPlaystyleCanvas();
		}, 0);
	});

	$("#form-card-secondary-icon-toggle").on("change", function() {
		setTimeout(function() {
            updateSecondaryIcon();
		}, 0);
	});

    $("#form-card-squad-chemistry-toggle").on("change", function() {
		setTimeout(function() {
			updateCardSquadChemistryCanvas();
		}, 0);
	});

	$("#form-card-squad-chemistry").on("change", function() {
		setTimeout(function() {
			updateCardSquadChemistryOptions();
		}, 0);
	});

	$("#form-card-squad-position-toggle").on("change", function() {
		setTimeout(function() {
			updateCardSquadPositionCanvas();
		}, 0);
	});

	$("#form-card-squad-position-text").on("keyup click change", function() {
		setTimeout(function() {
			updateCardSquadPositionText();
		}, 0);
	});

	$("input[name='form-card-format']").on("keyup click change", updateCardFormat);
	
	$("input[name='form-image-type'], #form-card-image, #form-card-custom-image").on("keyup click change", updateImage);
	$("#form-is-dynamic-image").on("change", updateDynamic);
	$("#form-clip-edges-image").on("change", updatePlayerImageCanvas);
	$("#form-card-custom-size, #form-card-upload-size").on("keyup change", function() {
		if ($("input[name='form-image-type']:checked").val() !== "player") {
			updateImageSize();
		}
	});
	$("#form-card-reset-position").on("click", resetImagePosition);
	$("#form-card-name").on("keyup click change", function(){
		updateDirect("name");
	});
	$("#form-card-rating").on("keyup click change", function() {
		updateDirect("rating");
	});
	$("#form-card-position").on("keyup click change", function() {
		updateDirect("position");
	});
	$("#form-card-club").on("change", function() {
		updateClubNation("club");
	});
	$("#form-card-club-text").on("keyup click change", function() {
		customClubNation($(this), "club");
	});
	$("#form-card-league").on("change", function() {
		updateClubNation("league");
	});
	$("#form-card-league-text").on("keyup click change", function() {
		customClubNation($(this), "league");
	});
	$("#form-card-nation").on("change", function() {
		updateClubNation("nation");
	});
	$("#form-card-nation-text").on("keyup click change", function() {
		customClubNation($(this), "nation");
	});
	$("input[name='form-attrib-type']").on("keyup click change", updateFormAttributes);
	$("input[name='form-letter-format']").on("keyup click change", updateLetterFormat);
	$("input[name='form-number-format']").on("keyup click change", updateNumberFormat);
	$(".fut-attribute-container input.form-control, .full-attribute-container input.form-control").on("keyup click change", updateAttributes);
	$("input[name='form-card-work-skill-weak-toggle']").on("keyup click change", updateSkillWorkWeak);
	$("#form-card-attackingworkrate").on("keyup click change", function() {
		updateDirect("attackingworkrate");
	});
	$("#form-card-defensiveworkrate").on("keyup click change", function() {
		updateDirect("defensiveworkrate");
	});
	$("#form-card-skillmoves").on("keyup click change", updateSkillMoves);
	$("#form-card-weakfoot").on("keyup click change", updateWeakFoot);
	$("#form-card-chemistry").on("change", updateChemistryType);
	$("#form-card-chemistry-style-toggle").on("change", function() {
		updateFormCardExtras("chemistry-style");
	});
	$("#form-card-chemistry-text").on("keyup change", updateChemistryText);
	$("#form-card-player-name-toggle").on("change", function() {
		updateFormCardExtras("player-name");
	});
	$("#form-card-download-size-menu a").on("click", function(e) {
    	updateDownloadSize(e, $(this));
	});
	
	$("#cardCreatorSections a[role='tab']").on("click", function() {
		setTimeout((function() {
			if ($("#addBackground").is(":visible")) {
				
				updateBackgroundImage();
				var $bg_container = $("#card-creator-square-background");

				//addBackgroundFormItem(true);
				/*
				// check if background-card-container exists
				if ($("#background-card-container").length) {
					// if so, empty it out
					$("#background-card-container").empty().attr("data-new", "0");
				} else {
					// if not, append it
					$bg_container.append("<div id=\"background-card-container\" data-title=\"card\" data-new=\"1\"></div>");
				}

				// append player card to background-card-container
				$("#playercard_container .player").clone().appendTo("#background-card-container");
				var $cloned_card = $("#background-card-container");
				if ($cloned_card.attr("data-new") == 1) {
					// Only set if card is new, allowing the card to change and come back to the same progress
					$cloned_card.css({
							"left" : (($bg_container.width()/2) - ($cloned_card.width()/2)),
							"top" : (($bg_container.height()/2) - ($cloned_card.height()/2))
						}).draggable();
				}
				*/
				
				$("#fifarosters-tag").draggable();
				
			}
		}), 0);
	});
	
	$("#form-background-image").on("change", updateBackgroundImage);
	$("#form-background-custom").on("keyup change blur", updateBackgroundImage);
	$("[name='form-background-alignment']").on("change", updateBackgroundAlignment);
	$("#form-background-fifarosters-tag").on("change", toggleFifaRostersTag);
	
	$(document).on("change", ".background-form-item-type select", function() {
		updateBackgroundItemType($(this).closest(".background-form-item-type"), $(this).val());
	});
	
	$(document).on("change", ".background-form-item-image input[type='hidden']", function() {
		var this_id = getBackgroundFormId(this);
		updateBackgroundItemImage(this_id);
	});
	
	$(document).on("keyup change blur", ".background-form-item-text input[type='text']", function() {
		var this_id = getBackgroundFormId(this);
		updateBackgroundItemText(this_id);
	});
	
	$(document).on("click", ".background-form-item-text .bold-control", function() {
		var this_id = getBackgroundFormId(this);
		toggleBoldText(this_id);
	});
	
	$(document).on("click", ".background-form-item-text .italic-control", function() {
		var this_id = getBackgroundFormId(this);
		toggleItalicText(this_id);
	});
	
	$(document).on("click", ".background-form-item-size-smaller", function() {
		decreaseSize(this);
	});
	
	$(document).on("click", ".background-form-item-size-bigger", function() {
		increaseSize(this);
	});
	
	$(document).on("keyup change blur", ".background-form-item-font select", function() {
		var this_id = getBackgroundFormId(this);
		updateFont("background-form-item-font", this_id);
	});
	
	$(document).on("keyup change blur", ".background-form-item-font-size input", function() {
		var this_id = getBackgroundFormId(this);
		updateSize("background-form-item-font-size", this_id);
	});
	
	$(document).on("keyup change blur", ".background-form-item-size input", function() {
		var this_id = getBackgroundFormId(this);
		updateSize("background-form-item-size", this_id);
	});
	
	$(document).on("click", ".background-form-item-rotation .background-form-item-rotation-left", function() {
		var this_id = getBackgroundFormId(this);
		decreaseRotation(this_id);
	});
	
	$(document).on("click", ".background-form-item-rotation .background-form-item-rotation-right", function() {
		var this_id = getBackgroundFormId(this);
		increaseRotation(this_id);
	});
	
	$(document).on("keyup change blur", ".background-form-item-rotation input", function() {
		var this_id = getBackgroundFormId(this);
		updateTransform(this_id);
	});
	
	$("input[name='form-background-type']").on("keyup click change", updateBackgroundType);
	
	$("#addBackground .sortable-items").sortable({
    	handle: ".form-item-grip",
    	update: function (event, ui) {
        	    updateLayers();
        	}
	});
    $("#addBackground .sortable-items").disableSelection();
    
    $(document).on("keyup change blur", ".background-form-item-opacity input", function() {
        var this_id = getBackgroundFormId(this);
        updateOpacity(this_id);
    });
    
    $(document).on("keyup change blur", ".background-form-item-text-shadow-toggle", function() {
        var this_id = getBackgroundFormId(this);
        toggleTextShadow(this_id);
    });

    $(document).on("keyup change blur", ".background-form-item-text-shadow-x, .background-form-item-text-shadow-y, .background-form-item-text-shadow-blur input, .background-form-item-text-shadow-color input", function() {
        var this_id = getBackgroundFormId(this);
        updateTextShadow(this_id);
    });

    $(document).on("keyup change blur", "input.background-form-item-position-x, input.background-form-item-position-y", function() {
        var this_id = getBackgroundFormId(this);
        updatePosition(this_id);
    });
	
	/*
	background-form-item-text
	background-form-item-text-color
	background-form-item-font-size
		background-form-item-size-smaller
		background-form-item-size-bigger
	background-form-item-image
	background-form-item-size
		background-form-item-size-smaller
		background-form-item-size-bigger
	background-form-item-rotation
		background-form-item-rotation-left
		background-form-item-rotation-right
	*/
	
	$('#card_selector_modal_user_designs').on('shown.bs.modal', function () {
        if ($("#card-designer-community-designs-tab").parent().hasClass("active") && $("#card-designer-community-designs").html() == "") {
            $("#card-designer-community-designs").html('<span><img src="images/loader.gif"> Loading</span>');
            loadCardDesigns();
        }
    });
    
    $('#form-save-card').on('click', function() {
        saveCreatedCard();
    });

	$(".card_search_filter").on("keyup", function() {
		var filter_input = this.value;
		var thisModal = $(this).closest(".modal");

		var filteredResults = $(".card_style_choices .card_container span").filter(function() {
			var reg = new RegExp(filter_input, "i");
			return reg.test($(this).text());
		});

		thisModal.find(".card_style_choices .card_container").hide();
		filteredResults.parent().show();
	});
});

function downloadCanvasCard(elem, imageElem, filename) {
	// var data = generateImage(elem, imageElem, filename, null, download);
	/*
	var dataURL = imgCanvasCard.toDataURL({
            multiplier: 2,
            enableRetinaScaling: true
    	});
	elem.href = dataURL;
	*/
	imgCanvasCard.discardActiveObject().renderAll();
	
	var playername = css_card_elements.name.text();
	
	if (filename === undefined) {
    	filename = playername;
	}
	
	var download_multiplier = $("#form-card-download-size").val();
    
    /*
    $("#card-canvas").get(0).toBlob(function(blob){
        saveAs(blob, filename + ".png");
    });
    */

    var imgData = imgCanvasCard.toDataURL({
          format: 'png',
          multiplier: download_multiplier
      });
    var blob = dataURLtoBlob(imgData);
    saveAs(blob, filename + ".png");

    var designYearElem = $("#form-card-year");
    var designCategoryElem = $("input[name=form-card-color-type]:checked");
    var designFormatElem = $("input[name=form-card-format]:checked");
    var designIdElem = designCategoryElem.val() == "custom" ? $('#form-card-color-custom-id') : $("#form-card-color");

    $.post("card-design-download-log.php", {
        designid: designIdElem.val(),
        designcategory: designCategoryElem.val(),
        designyear: designYearElem.val(),
        downloadscale: $('#form-card-download-size').val(),
        designformat: designFormatElem.val()
    });
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function downloadCanvasImage(elem){
	var dataURL = imgCanvas.toDataURL({
            multiplier: 2,
            enableRetinaScaling: true,
            format: "jpeg",
        });
	elem.href = dataURL;
}