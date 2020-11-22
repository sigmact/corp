$(function(){

	// ページ内アンカーへの移動
	$("a[href^=#]").click(function(){
		if(this.hash !== ""){
			var speed = 500;
			var target = $(this).attr("href");
			var position = target=="#top" ? 0 : $(target).offset().top;
			$("html, body").animate({scrollTop:position}, speed, "swing");
		}
		return false;
	});
	
});


/* 要素をフェードさせる */
$(function() {
	
	fadeInOut($(".imgFade"), 0.7, 1, 200);
	
	$(".logo").hover(
		function() {
			$(this).addClass("hover");
		},
		function() {
			$(this).removeClass("hover");
		}
	)
	
});
function fadeInOut(target, opcOverNum, opcOutNum, durNum) {

	$(target).hover(
		// マウスオーバー時
		function() {
			if($(this).hasClass("disabled")) {
				return false;
			} else {
				$(this).stop(true).animate({opacity:opcOverNum},{duration:durNum, easing:"swing"});
			}
		},
		// マウスアウト時
		function() {
			$(this).animate({opacity:opcOutNum},{duration:durNum, easing:"swing"});
		}
	);

}


/* 要素をトグルさせる */
$(function (){

	$(".spMenu a").click(
		function() {
			$(this).toggleClass("active");
			$(".globalNavi").stop(true).slideToggle(300);
		}
	);
	
});


/* 「ページの先頭へ」の設置 */
$(function(){
	
	// 「ページの先頭へ」の取得
	var $backTop = $(".back-top");
	
	// 最初は非表示
	$backTop.hide();
	
	// Y軸のスクロール量100pxを閾値して切替え
	$(window).scroll(function() {
		if($(this).scrollTop() > 100) {
			$backTop.fadeIn();
		} else {
			$backTop.fadeOut();
		}
	});
	
	// クリック時の処理（WebKitではbodyに効き、それ以外のブラウザではhtmlに効く）
	$backTop.click(function() {
		$('body, html').animate({
			scrollTop: 0
		}, 300);
		return false;
	});

});


/* ページ読み込み時の処理 */
$(window).load(function() {
	processEqualize();
	
	// ウインドウ幅変更時の処理
	var timer = false;
	var windowWidth = $(window).width();
	var resizedWindowWidth;
	$(window).on("resize", function(){
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			resizedWindowWidth = $(window).width();
			if(windowWidth != resizedWindowWidth) {
				windowWidth = $(window).width();
				processEqualize();
			}
		}, 500);
	});
	
});

function processEqualize() {
	$(".columnizedBlock").each(function() {
		var items = $(this).find(".column");
		var itemTitles = items.find(".columnTitle");
		if($(this).hasClass("columnizedBy3x1")) {
			equalizeHeight(itemTitles, 3);
			equalizeHeight(items, 3);
		} else if($(this).hasClass("columnizedBy2x1")) {
			equalizeHeight(itemTitles, 2);
			equalizeHeight(items, 2);
		} else {
			equalizeHeight(items, 99);
		}
	});
}

function equalizeHeight($items, itemNumInRow) {
	// 最初に高さを開放
	freeEqualizedHeight($items);
	// 行ごとに高さを比較し、一番高いものに合わせる
	for(var i = 0; i<Math.ceil($items.length / itemNumInRow); i++) {
		var maxHeight = 0;
		for (var j = 0; j < itemNumInRow; j++) {
			var height = $items.eq(i*itemNumInRow + j).height();
			maxHeight = height > maxHeight ? height : maxHeight;
		}
		// 高さを揃える
		for (var k = 0; k < itemNumInRow; k++) {
			$items.eq(i*itemNumInRow + k).height(maxHeight)
		}
	}
}

function freeEqualizedHeight($items) {
	$items.css({"height":"auto"});
}



/* レスポンシブテーブル */
$(function() {
	$(".verticalTable").each(function() {
		var titleArray = [];
		$(">thead>tr>th", this).each(function() {
			titleArray.push($(this).html());
		});
		$(">tbody>tr", this).each(function() {
			var totalCellNum = $(">td", this).length;
			var titleCount = 0;
			for(var i = 0; i < totalCellNum; i++) {
				var targetCell = $(">td:eq(" + i + ")", this);
				targetCell.attr("data-title", titleArray[titleCount]);
				if (targetCell.attr("colspan") > 1) {
					titleCount += Number(targetCell.attr("colspan"));
				} else {
					titleCount++;
				}
			}
		});
	});
});


/* ソーシャルプラグインの読み込み */
$(function() {
		window.fbAsyncInit = function() {
			FB.init({
				xfbml			: true,
				version		: 'v2.5'
			});
		};
	 if($("#fb-root").length) {
		(function (w, d) {
			w.___gcfg = {lang: "ja"};
			var s, e = d.getElementsByTagName("script")[0],
				a = function (u, i) {
					if (!d.getElementById(i)) {
						s = d.createElement("script");
						s.async =!0;
						s.src = u;
						if (i) {s.id = i;}
						e.parentNode.insertBefore(s, e);
					}
				};
			//a("//platform.twitter.com/widgets.js", "twitter-wjs");
			a("//connect.facebook.net/ja_KS/sdk.js", "facebook-jssdk");
		})(this, document);
	}
	// Instagram
	/*
	var userFeed = new Instafeed({
		get: 'user',
		userId: 2865508122,
		accessToken: '2865508122.a581504.e9174d0b832b430cbc493b04725b5f59',
		target: "footer-insta",
		limit: 8,
		template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /></a>'
	});
	userFeed.run();	*/
});


/* ソーシャルボタン */
$(function() {
	facebookShare.init();
	twitterShare.init();
	lineShare.init();
});
var facebookShare = (function() {
	return {
		init: function() {
			this.open();
			var requestUrl = "https://graph.facebook.com/?id=" + encodeURIComponent(location.href);
			var target = $(".bt_fb");
			$.ajax({
				url: requestUrl,
				dataType: "jsonp",
				success: function(json) {
					var count = json.shares ? json.shares : "";
					var html = "<span  class=\"count\">" + count + "</span>";
					target.append(html);
				}
			});
		},
		open: function() {
			var target = $(".bt_fb").find(">a");
			var requestUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(location.href);
			target.on("click", function(e) {
				e.preventDefault();
				window.open(requestUrl, "facebook", "width=670, height=400, menubar=no, toolbar=no, scrollbars=yes");
			});
		}
	}
})();

var twitterShare = (function() {
	return {
		init: function() {
			this.open();
			var requestUrl = location.href;
			var target = $(".bt_tw");
			$.ajax({
				url: "https://jsoon.digitiminimi.com/twitter/count.json",
				dataType: "jsonp",
				data: {
					url: requestUrl
				},
				success: function(json) {
					var count = json.count ? json.count : "";
					var html = "<span  class=\"count\">" + count + "</span>";
					target.append(html);
				}
			});
		},
		open: function() {
			var target = $(".bt_tw").find(">a");
			var url = "https://twitter.com/share?url=" + encodeURIComponent(location.href) + "&text=" + encodeURIComponent($("title").html());
			target.on("click", function(e) {
				e.preventDefault();
				window.open(url, "Twitterで共有する", "width=550, height=400, menubar=no, toolbar=no, scrollbars=yes");
			});
		}
	}
})();

var lineShare = (function() {
	return {
		init: function() {
			this.open();
		},
		open: function() {
			var target = $(".bt_line").find(">a");
			var url = "http://line.me/R/msg/text/?" + encodeURIComponent($("title").html()) + "%0D%0A" + encodeURIComponent(location.href);
			target.on("click", function(e) {
				e.preventDefault();
				window.open(url);
			});
		}
	}
})();


/* Google Mapsの埋め込み */
function initMap() {
	var centerLatLng = {lat:35.685256, lng:139.782108};
	var sigmaLatLng = {lat:35.684160, lng:139.782197};
	var mapOptions = {
		center: centerLatLng,
		zoom:17,
		disableDefaultUI:true,
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, "map_style"]
		}
	};
	var styleOptions = [
		{
			stylers: [
				{hue: "#00a0af"},
				{saturation: -40}
			]
		},{
			featureType: "road",
			elementType: "geometry",
			stylers: [
				{lightness: 100},
				{visibility: "simplified"}
			]
		},{
			featureType: "road",
			elementType: "labels",
			stylers: [
				{visibility: "off"}
			]
		},{
			featureType: "poi.business",
			elementType: "labels",
			stylers: [
				{visibility: "off"}
			]
		}
	];
	
	var styledMap = new google.maps.StyledMapType(styleOptions, {
		name: "sigmact map"
	});
	var icon = {
		url: "images/flag.png",
		scaledSize: new google.maps.Size(52, 61),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(24, 50)
	}
	
	$(".mapCanvas").each(function() {
		var canvas = $(this);
		var map = new google.maps.Map(canvas.get(0), mapOptions);
		var marker = new google.maps.Marker({
			position: sigmaLatLng,
			map: map,
			icon: icon
		});
		map.mapTypes.set("map_style", styledMap);
		map.setMapTypeId("map_style");
	});
};

