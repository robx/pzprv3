// CoreClass.js v3.4.0

(function(){

//----------------------------------------------------------------------------
// ★pzprv3オブジェクト (クラス作成関数等)
//---------------------------------------------------------------------------
var pzprv3 = {
	version : 'v3.4.0pre',

	EDITOR : true,	// エディタモード
	PLAYER : false,	// playerモード
	debugmode : false,	// デバッグ用モード

	core   : {},	// CoreClass保存用(継承元になれるのはここのみ)
	custom : {},	// パズル別クラス保存用

	commonlist : [],	// パズル別クラスのスーパークラスになるクラスを保存

	//---------------------------------------------------------------
	// スクリプトで使用する定数を定義する
	//---------------------------------------------------------------
	consts : {},
	addConsts : function(defines){
		for(var name in defines){
			if(!this.consts[name]){ this.consts[name] = defines[name];}
		}
	},

	//---------------------------------------------------------------
	// 共通クラス・パズル別クラスに継承させる親クラスを生成する
	//---------------------------------------------------------------
	createCoreClass : function(classname, proto){
		var rel = this._createClass(classname, proto, false);
		this.core[rel.name] = rel.body;
	},
	createCommonClass : function(classname, proto){
		var rel = this._createClass(classname, proto, true);
		this.core[rel.name] = rel.body;
		this.commonlist.push(rel.name);
	},
	extendCoreClass : function(classname, proto){
		var base = pzprv3.core[classname].prototype;
		for(var name in proto){ base[name] = proto[name];}
	},

	_createClass : function(classname, proto, iscommon){
		classname = classname.replace(/\s+/g,'');
		var colon = classname.indexOf(':'), basename = '';
		if(colon>=0){
			basename  = classname.substr(colon+1);
			classname = classname.substr(0,colon);
		}

		var NewClass = ((iscommon) ?
			function(owner, args){
				this.owner = owner;
				if(!!this.initialize){ this.initialize.apply(this,[].concat(args));}
			}
		:
			function(){
				if(!!this.initialize){ this.initialize.apply(this,arguments);}
			}
		);
		if(!!basename && !!this.core[basename]){
			var BaseClass = this.core[basename];
			for(var name in BaseClass.prototype){ NewClass.prototype[name] = BaseClass.prototype[name];}
			NewClass.prototype.SuperClass = BaseClass;
			NewClass.prototype.SuperFunc  = BaseClass.prototype;
		}
		for(var name in proto){ NewClass.prototype[name] = proto[name];}
		NewClass.prototype.constructor = NewClass;
		return {body:NewClass, name:classname};
	},

	//---------------------------------------------------------------
	// 読み込んだパズル別ファイルから生成できるパズル別クラスを全て生成する
	//---------------------------------------------------------------
	createCustoms : function(scriptid, custombase){
		var pidlist = this.PZLINFO.PIDlist(scriptid);
		for(var i=0;i<pidlist.length;i++){
			var pid=pidlist[i], customclass=this.PIDfilter(pid, custombase);
			this.createCustomSingle(pid, customclass);
		}
	},

	PIDfilter : function(pid, custombase){
		var customclass = {};
		for(var hashkey in custombase){
			var name = hashkey, pidcond = [], isexist = false;
			if(hashkey.match('@')){
				pidcond = hashkey.substr(hashkey.indexOf('@')+1).split(/,/);
				name    = hashkey.substr(0,hashkey.indexOf('@'));
				for(var n=0;n<pidcond.length;n++){ if(pidcond[n]===pid){ isexist=true; break;}}
				if(!isexist){ name = '';}
			}
			if(!!name){
				var proto = custombase[hashkey];
				if(!customclass[name]){ customclass[name]={};}
				for(var key in proto){ customclass[name][key] = proto[key];}
			}
		}
		return customclass
	},

	createCustomSingle : function(pid, customclass){
		// 追加があるクラス => 残りの共通クラスの順に継承
		var custom = {};
		for(var classname in customclass){
			var proto = customclass[classname];

			if(!custom[classname]){
				if(!!this.core[classname]){ classname = classname+":"+classname;}

				var rel = this._createClass(classname, proto, true);
				custom[rel.name] = rel.body;
			}
			else{
				for(var name in proto){ custom[classname].prototype[name] = proto[name];}
			}
		}
		for(var i=0;i<this.commonlist.length;i++){
			var classname = this.commonlist[i];
			if(!custom[classname]){ custom[classname] = this.core[classname];}
		}

		this.custom[pid] = custom;
	},

	//---------------------------------------------------------------
	parseURLType : function(url){ return parseURLType(url);},
	parseURLData : function(pzl){ return parseURLData(pzl);},
	getURLBase : function(type,pid){ return getURLBase(type,pid);},

	//---------------------------------------------------------------
	// 単体ファイルの読み込み
	includeFile : function(filename){
		if(!this.includedFile[filename]){
			var _script = document.createElement('script');
			_script.type = 'text/javascript';
			_script.src = filename;
			document.body.appendChild(_script);
			this.includedFile[filename] = true;
		}
	},
	// idを取得して、ファイルを読み込み
	includeCustomFile : function(pid){
		if(!this.custom[pid]){
			this.includeFile("src/"+this.PZLINFO.toScript(pid)+".js");
		}
	},
	includedFile : {},

	//---------------------------------------------------------------
	// 現在の時間を取得
	currentTime : function(){ return (new Date()).getTime();},

	//---------------------------------------------------------------
	// Elementの生成関連
	//---------------------------------------------------------------
	unselectable : function(el){
		el.style.MozUserSelect    = 'none';
		el.style.KhtmlUserSelect  = 'none';
		el.style.webkitUserSelect = 'none';
		el.style.msUserSelect     = 'none';
		el.style.userSelect       = 'none';
		el.unselectable = "on";
		return this;
	},
	getEL : function(id){
		return document.getElementById(id);
	},
	createEL : function(tagName){
		return document.createElement(tagName);
	},

	//--------------------------------------------------------------------------------
	// pzprv3.getRect()   エレメントの四辺の座標を返す
	//--------------------------------------------------------------------------------
	getRect : function(el){
		this.getRect = ((!!document.createElement('div').getBoundingClientRect) ?
			function(el){
				var rect = el.getBoundingClientRect(), _html, _body, scrollLeft, scrollTop;
				if(!window.scrollX==void 0){
					scrollLeft = window.scrollX;
					scrollTop  = window.scrollY;
				}
				else{
					_html = document.documentElement; _body = document.body;
					scrollLeft = (_body.scrollLeft || _html.scrollLeft) - _html.clientLeft;
					scrollTop  = (_body.scrollTop  || _html.scrollTop ) - _html.clientTop;
				}
				var left   = rect.left   + scrollLeft;
				var top    = rect.top    + scrollTop;
				var right  = rect.right  + scrollLeft;
				var bottom = rect.bottom + scrollTop;
				return { top:top, bottom:bottom, left:left, right:right};
			}
		:
			function(el){
				var left = 0, top = 0, el2 = el;
				while(!!el2){
					left += +(!isNaN(el2.offsetLeft) ? el2.offsetLeft : el2.clientLeft);
					top  += +(!isNaN(el2.offsetTop)  ? el2.offsetTop  : el2.clientTop );
					el2 = el2.offsetParent;
				}
				var right  = left + (el.offsetWidth  || el.clientWidth);
				var bottom = top  + (el.offsetHeight || el.clientHeight);
				return { top:top, bottom:bottom, left:left, right:right};
			}
		);
		return this.getRect(el);
	},

	//----------------------------------------------------------------------
	// Eventオブジェクト関連
	// 
	// stopPropagation() イベントの起こったエレメントより上にイベントを
	//                   伝播させないようにする
	// preventDefault()  イベントの起こったエレメントで、デフォルトの
	//                   イベントが起こらないようにする
	//----------------------------------------------------------------------
	stopPropagation : function(e){
		if(!!e.stopPropagation){ e.stopPropagation();}
		else{ e.cancelBubble = true;}
	},
	preventDefault : function(e){
		if(!!e.preventDefault){ e.preventDefault();}
		else{ e.returnValue = false;}
	}
};

/* extern */
window.pzprv3 = pzprv3;

// 定数の定義
var k = pzprv3.consts;
pzprv3.addConsts({
	// 定数(URL形式)
	PZPRV3  : 0,
	PZPRV3E : 3,
	PZPRAPP : 1,
	KANPEN  : 2,
	KANPENP : 5,
	HEYAAPP : 4
});

//---------------------------------------------------------------------------
// localStorageがなくてglobalStorage対応(Firefox3.0)ブラウザのハック
//---------------------------------------------------------------------------
try{ if(typeof localStorage != "object" && typeof globalStorage == "object"){
	localStorage = globalStorage[location.host];
}}catch(e){}

/******************/
/* 環境変数の定義 */
/******************/
pzprv3.browser = (function(){
	var UA  = navigator.userAgent;
	return {
		IE    : (!!document.uniqueID),
		Opera : (!!window.opera),
		WebKit: (UA.indexOf('AppleWebKit/') > -1),
		Gecko : (UA.indexOf('Gecko')>-1 && UA.indexOf('KHTML') == -1),

		IE6 : !!(UA.match(/MSIE (\d+)/) && parseInt(RegExp.$1)==6),
		IE7 : !!(UA.match(/MSIE (\d+)/) && parseInt(RegExp.$1)==7),
		IE8 : !!(UA.match(/MSIE (\d+)/) && parseInt(RegExp.$1)==8),
		IE9 : !!(UA.match(/MSIE (\d+)/) && parseInt(RegExp.$1)==9),
		IE10: !!(UA.match(/MSIE (\d+)/) && parseInt(RegExp.$1)==10)
	};
})();
pzprv3.OS = (function(){
	var UA  = navigator.userAgent;
	var ios     = (UA.indexOf('like Mac OS X') > -1);
	var android = (UA.indexOf('Android') > -1);
	return {
		iOS    : (ios),
		mobile : (ios || android)
	};
})();
pzprv3.env = (function(){
 	var touchevent = ((!!window.ontouchstart) || (!!document.createTouch));
	var mspointerevent = (!!navigator.msPointerEnabled);
	return {
		touchevent     : touchevent,
		mspointerevent : mspointerevent
	};
})();
pzprv3.storage = (function(){
	var val = 0x00;
	try{ if(!!window.sessionStorage){ val |= 0x10;}}catch(e){}
	try{ if(!!window.localStorage)  { val |= 0x08;}}catch(e){}
	try{ if(!!window.indexedDB)     { val |= 0x04;}}catch(e){}
	try{ if(!!window.openDatabase){ // Opera10.50対策
		var dbtmp = openDatabase('pzprv3_manage', '1.0', 'manager', 1024*1024*5);	// Chrome3対策
		if(!!dbtmp){ val |= 0x02;}
	}}catch(e){}

	// Firefoxはローカルだとデータベース系は使えない
	if(pzprv3.browser.Gecko && !location.hostname){ val = 0;}

	return {
		session : !!(val & 0x10),
		localST : !!(val & 0x08),
		WebIDB  : !!(val & 0x04),
		WebSQL  : !!(val & 0x02)
	};
})();


//---------------------------------------------------------------------------
// ★ parseURLType() 入力されたURLからどのパズルか、およびURLの種類を抽出する
//                   p.html?(pid)/(qdata)
//---------------------------------------------------------------------------
function parseURLType(url){
	url = url.replace(/(\r|\n)/g,""); // textarea上の改行が実際の改行扱いになるUAに対応(Operaとか)

	var pzl = {id:'',type:0,qdata:''};
	// カンペンの場合
	if(url.match(/www\.kanpen\.net/) || url.match(/www\.geocities(\.co)?\.jp\/pencil_applet/) ){
		url.match(/([0-9a-z]+)\.html/);
		pzl.id = RegExp.$1;
		// カンペンだけどデータ形式はへやわけアプレット
		if(url.indexOf("?heyawake=")>=0){
			pzl.qdata = url.substr(url.indexOf("?heyawake=")+10);
			pzl.type = k.HEYAAPP;
		}
		// カンペンだけどデータ形式はぱずぷれ
		else if(url.indexOf("?pzpr=")>=0){
			pzl.qdata = url.substr(url.indexOf("?pzpr=")+6);
			pzl.type = k.PZPRV3;
		}
		else{
			pzl.qdata = url.substr(url.indexOf("?problem=")+9);
			pzl.type = k.KANPEN;
		}
	}
	// へやわけアプレットの場合
	else if(url.match(/www\.geocities(\.co)?\.jp\/heyawake/)){
		pzl.id = 'heyawake';
		pzl.qdata = url.substr(url.indexOf("?problem=")+9);
		pzl.type = k.HEYAAPP;
	}
	// ぱずぷれアプレットの場合
	else if(url.match(/indi\.s58\.xrea\.com\/(.+)\/(sa|sc)\//)){
		pzl.id = RegExp.$1;
		pzl.qdata = url.substr(url.indexOf("?"));
		pzl.type = k.PZPRAPP;
	}
	// ぱずぷれv3の場合
	else{
		var qs = url.indexOf("/", url.indexOf("?"));
		if(qs>-1){
			pzl.id = url.substring(url.indexOf("?")+1,qs);
			pzl.qdata = url.substr(qs+1);
		}
		else{
			pzl.id = url.substr(1);
		}
		pzl.id = pzl.id.replace(/(m\+|_edit|_test|_play)/,'');
		pzl.type = k.PZPRV3;
	}
	pzl.id = pzprv3.PZLINFO.toPID(pzl.id);

	return pzl;
}

//---------------------------------------------------------------------------
// ★ parseURLData() URLを縦横・問題部分などに分解する
//                   qdata -> [(pflag)/](cols)/(rows)/(bstr)
//---------------------------------------------------------------------------
function parseURLData(pzl){
	var inp=pzl.qdata.split("/"), dat={pflag:'',cols:0,rows:0,bstr:''};
	switch(pzl.type){
	case k.KANPEN:
		if(pzl.id=="sudoku"){
			dat.rows = dat.cols = parseInt(inp.shift());
		}
		else{
			dat.rows = parseInt(inp.shift());
			dat.cols = parseInt(inp.shift());
			if(pzl.id=="kakuro"){ dat.rows--; dat.cols--;}
		}
		dat.bstr = inp.join("/");
		break;

	case k.HEYAAPP:
		var size = inp.shift().split("x");
		dat.cols = parseInt(size[0]);
		dat.rows = parseInt(size[1]);
		dat.bstr = inp.join("/");
		break;

	default:
		if(!isNaN(parseInt(inp[0]))){ inp.unshift("");}
		dat.pflag = inp.shift();
		dat.cols = parseInt(inp.shift());
		dat.rows = parseInt(inp.shift());
		dat.bstr = inp.join("/");
		break;
	}
	return dat;
}

//---------------------------------------------------------------------------
// ★ getURLBase() URLの元となる部分を取得する
//---------------------------------------------------------------------------
function getURLBase(type, pid){
	var str = {
		0: "http://%DOMAIN%/p.html?%PID%/",                   /* PZPRV3  */
		3: "http://%DOMAIN%/p.html?%PID%_edit/",              /* PZPRV3E */
		1: "http://indi.s58.xrea.com/%PID%/sa/q.html?",       /* PZPRAPP */
		2: "http://www.kanpen.net/%KID%.html?problem=",       /* KANPEN  */
		5: "http://www.kanpen.net/%KID%.html?pzpr=",          /* KANPENP */
		4: "http://www.geocities.co.jp/heyawake/?problem="    /* HEYAAPP */
	}[type];

	var domain = document.domain;
	if(!domain){ domain = "pzv.jp";}
	else if(domain == "indi.s58.xrea.com"){ domain = "indi.s58.xrea.com/pzpr/v3";}

	if(type===k.PZPRAPP){
		if     (pid==='pipelinkr'){ str=str.replace("%PID%","pipelink");}
		else if(pid==='heyabon')  { str=str.replace("%PID%","bonsan");}
	}
	return str.replace("%DOMAIN%", domain)
			  .replace("%PID%", pzprv3.PZLINFO.toURLID(pid))
			  .replace("%KID%", pzprv3.PZLINFO.toKanpen(pid));
}

//----------------------------------------------------------------------------
// ★Pointクラス  (px,py)pixel座標を扱う
//---------------------------------------------------------------------------
// Pointクラス
pzprv3.createCoreClass('Point',
{
	initialize : function(px,py){ this.px = px; this.py = py;},
	set : function(point){ this.px = point.px; this.py = point.py;},
	reset : function(){ this.px = null; this.py = null;},
	valid : function(){ return (this.px!==null && this.py!==null);}
});

})();