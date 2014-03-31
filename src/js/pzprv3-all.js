
/* concat前のテスト用スクリプト */

(function(){
	var files = [
		"lib/candle",
		"pzpr/core",
		"pzpr/classmgr",
		"pzpr/env",
		"pzpr/variety",
		"pzpr/parser",
		"pzpr/util",
		"puzzle/Puzzle",
		"puzzle/BoardPiece",
		"puzzle/Board",
		"puzzle/BoardExec",
		"puzzle/LineManager",
		"puzzle/AreaManager",
		"puzzle/Graphic",
		"puzzle/MouseInput",
		"puzzle/KeyInput",
		"puzzle/Encode",
		"puzzle/FileData",
		"puzzle/Answer",
		"puzzle/Operation",
		"variety-common/Graphic",
		"variety-common/KeyInput",
		"variety-common/MouseInput",
		"variety-common/Answer",
		"variety-common/BoardExec",
		"variety-common/Encode",
		"variety-common/FileData",
		"ui/Boot",
		"ui/UI",
		"ui/Menu",
		"ui/MenuArea",
		"ui/PopupMenu",
		"ui/ToolArea",
		"ui/KeyPopup",
		"ui/DataBase",
		"ui/Timer",
		"ui/Debug",
		"variety/amibo",
		"variety/bag",
		"variety/barns",
		"variety/bdblock",
		"variety/bonsan",
		"variety/bosanowa",
		"variety/box",
		"variety/cbblock",
		"variety/country",
		"variety/creek",
		"variety/factors",
		"variety/fillmat",
		"variety/fillomino",
		"variety/firefly",
		"variety/goishi",
		"variety/gokigen",
		"variety/hakoiri",
		"variety/hanare",
		"variety/hashikake",
		"variety/heyawake",
		"variety/hitori",
		"variety/icebarn",
		"variety/ichimaga",
		"variety/kaero",
		"variety/kakuro",
		"variety/kakuru",
		"variety/kinkonkan",
		"variety/kouchoku",
		"variety/kramma",
		"variety/kurochute",
		"variety/kurodoko",
		"variety/kurotto",
		"variety/kusabi",
		"variety/lightup",
		"variety/lits",
		"variety/lookair",
		"variety/loopsp",
		"variety/loute",
		"variety/mashu",
		"variety/mejilink",
		"variety/minarism",
		"variety/nagenawa",
		"variety/nanro",
		"variety/nawabari",
		"variety/numlin",
		"variety/nurikabe",
		"variety/paintarea",
		"variety/pipelink",
		"variety/reflect",
		"variety/renban",
		"variety/ripple",
		"variety/roma",
		"variety/shakashaka",
		"variety/shikaku",
		"variety/shimaguni",
		"variety/shugaku",
		"variety/slalom",
		"variety/slither",
		"variety/snakes",
		"variety/sudoku",
		"variety/sukoro",
		"variety/tasquare",
		"variety/tatamibari",
		"variety/tateyoko",
		"variety/tawa",
		"variety/tentaisho",
		"variety/tilepaint",
		"variety/toichika",
		"variety/triplace",
		"variety/wblink",
		"variety/yajikazu",
		"variety/yajirin",
		"variety/yajitatami",
		"variety/yosenabe"
	];

	var isbrowser = true;
	try{ isbrowser = !exports;}
	catch(e){}
	
	if(isbrowser){
		var dir = (function getpath(){
			var srcs=document.getElementsByTagName('script');
			for(var i=0;i<srcs.length;i++){
				var result = srcs[i].src.match(/^(.*\/)pzprv3\-all\.js$/);
				if(result){ return result[1] + (!result[1].match(/\/$/) ? '/' : '');}
			}
			return "";
		})();
		
		for(var i=0;i<files.length;i++){
			document.write('<script type="text/javascript" src="'+dir+files[i]+'"></script>');
		}
	}
	else{ exports.component = files;}
})();
