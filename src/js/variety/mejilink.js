//
// パズル固有スクリプト部 メジリンク版 mejilink.js v3.4.1
//
pzpr.classmgr.makeCustom(['mejilink'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.puzzle.playmode){
			if(this.btn.Left){
				if(this.mousestart || this.mousemove){ this.inputLine();}
				else if(this.mouseend && this.notInputted()){
					this.prevPos.reset();
					this.inputpeke();
				}
			}
			else if(this.btn.Right){
				if(this.mousestart || this.mousemove){ this.inputpeke();}
			}
		}
		else if(this.puzzle.editmode){
			if(this.mousestart || this.mousemove){ this.inputborder();}
		}
	}
},

//---------------------------------------------------------
// 盤面管理系
Border:{
	ques : 1,

	enableLineNG : true,

	isGround : function(){ return this.ques>0;},

	// 線を引かせたくないので上書き
	isLineNG : function(){ return (this.ques===1);}
},
BorderList:{
	allclear : function(isrec){
		/* quesは共通ルーチンを使用しない */
		var bd = this.board;
		for(var i=0;i<this.length;i++){
			var border = this[i];
			/* border.quesの真の初期値は↓ */
			var def = (border.id<bd.bdinside ? 1 : 0);
			if(border.ques!==def){
				if(isrec){ border.addOpe('ques', border.ques, def);}
				border.ques = def;
			}
		}

		this.propclear(['line', 'qsub'], isrec);
	}
},
Board:{
	qcols : 8,
	qrows : 8,

	hasborder : 2,
	borderAsLine : true,

	initialize : function(){
		this.common.initialize.call(this);

		this.tilegraph = this.addInfoList(this.klass.AreaTileGraph);
	},

	initBoardSize : function(col,row){
		this.common.initBoardSize.call(this,col,row);

		this.border.allclear(false);
	}
},

LineGraph:{
	enabled : true,
	pointgroup : 'cross'
},
"AreaTileGraph:AreaGraphBase":{
	enabled : true,
	setComponentRefs : function(obj, component){ obj.tile = component;},
	getObjNodeList   : function(nodeobj){ return nodeobj.tilenodes;},
	resetObjNodeList : function(nodeobj){ nodeobj.tilenodes = [];},
	
	isnodevalid : function(nodeobj){ return true;},
	isedgevalidbylinkobj : function(border){ return border.isGround();}
},

Flags:{
	redline : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	gridcolor_type : "LIGHT",

	borderQuescolor : "white",

	paint : function(){
		this.drawBGCells();
		this.drawDashedGrid(false);
		this.drawBorders();
		this.drawLines();

		this.drawBaseMarks();

		this.drawPekes();
	},

	// オーバーライド
	getBorderColor : function(border){
		if(border.ques===1){
			var cell2=border.sidecell[1];
			return ((cell2.isnull || cell2.error===0) ? this.borderQuescolor : this.errbcolor1);
		}
		return null;
	},

	repaintParts : function(blist){
		this.range.crosses = blist.crossinside();

		this.drawBaseMarks();
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeMejilink();
	},
	encodePzpr : function(type){
		this.encodeMejilink();
	},

	decodeMejilink : function(){
		var bstr = this.outbstr, bd = this.board, twi=[16,8,4,2,1];
		var pos = (bstr?Math.min((((bd.bdmax+4)/5)|0),bstr.length):0), id=0;
		for(var i=0;i<pos;i++){
			var ca = parseInt(bstr.charAt(i),32);
			for(var w=0;w<5;w++){
				if(id<bd.bdmax){
					bd.border[id].ques = (ca&twi[w]?1:0);
					id++;
				}
			}
		}
		this.outbstr = bstr.substr(pos);
	},
	encodeMejilink : function(){
		var count = 0, bd = this.board;
		for(var id=bd.bdinside;id<bd.bdmax;id++){ if(bd.border[id].isGround()){ count++;}}
		var num=0, pass=0, cm="", twi=[16,8,4,2,1];
		for(var id=0,max=(count===0?bd.bdinside:bd.bdmax);id<max;id++){
			if(bd.border[id].isGround()){ pass+=twi[num];} num++;
			if(num===5){ cm += pass.toString(32); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(32);}
		this.outbstr += cm;
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeBorder( function(border,ca){
			if     (ca==="2" ){ border.ques = 0; border.line = 1;}
			else if(ca==="-1"){ border.ques = 0; border.qsub = 2;}
			else if(ca==="1" ){ border.ques = 0;}
			else              { border.ques = 1;}
		});
	},
	encodeData : function(){
		this.encodeBorder( function(border){
			if     (border.line===1){ return "2 ";}
			else if(border.qsub===2){ return "-1 ";}
			else if(border.ques===0){ return "1 ";}
			else                    { return "0 ";}
		});
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		"checkBranchLine",
		"checkCrossLine",
		"checkDotLength",
		"checkDeadendLine",
		"checkOneLoop"
	],

	checkDotLength : function(){
		var bd = this.board, tiles = bd.tilegraph.components;
		var numerous_value = 999999;
		for(var r=0;r<tiles.length;r++){ tiles[r].count=0;}
		for(var id=0;id<bd.bdmax;id++){
			var border = bd.border[id], cell1 = border.sidecell[0], cell2 = border.sidecell[1];
			if(border.isGround() && id>=bd.bdinside){
				if(!cell1.isnull){ cell1.tile.count -= numerous_value;}
				if(!cell2.isnull){ cell2.tile.count -= numerous_value;}
			}
			else if(!border.isGround() && !border.isLine()){
				if(!cell1.isnull){ cell1.tile.count++;}
				if(!cell2.isnull){ cell2.tile.count++;}
			}
		}
		for(var r=0;r<tiles.length;r++){
			var clist = tiles[r].clist, count = tiles[r].count;
			if(count<0 || count===clist.length){ continue;}
			
			this.failcode.add("bkNoLineNe");
			if(this.checkOnly){ break;}
			clist.seterr(1);
		}
	}
},

FailCode:{
	bkNoLineNe : ["タイルと周囲の線が引かれない点線の長さが異なります。","The size of the tile is not equal to the total of length of lines that is remained dotted around the tile."]
}
});
