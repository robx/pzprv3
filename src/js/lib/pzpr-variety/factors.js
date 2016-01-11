/*! @license pzpr.js v3.6.0-pre (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["factors"],{MouseEvent:{mouseinput:function(){this.puzzle.playmode?this.mousestart&&this.inputqnum():this.puzzle.editmode&&(this.mousestart||this.mousemove?this.btn.Left&&this.inputborder():this.mouseend&&this.notInputted()&&this.inputqnum())},inputqnum_main:function(a){this.puzzle.editmode&&(a=a.room.top);var b=a.getmaxnum(),c=a.getminnum(),d=this.puzzle.editmode?a.qnum:a.anum,e=-1;this.btn.Left?e=d>=b?-1:-1===d?1:d+1:this.btn.Right&&(e=-1===d?b:c>=d?-1:d-1),a.setNum(e),a.draw()}},KeyEvent:{enablemake:!0,enableplay:!0},Cell:{disInputHatena:!0,maxnum:function(){return this.puzzle.editmode?999999:Math.max(this.board.cols,this.board.rows)},setNum:function(a){0!==a&&(this.puzzle.editmode?this.setQnum(a):this.setAnum(a))}},CellList:{getProduct:function(){for(var a=1,b=0,c=this.length;c>b;b++){var d=this[b].anum;a*=d>0?d:0}return a}},Board:{cols:9,rows:9,hasborder:1},AreaRoomGraph:{enabled:!0,hastop:!0},Graphic:{gridcolor_type:"DLIGHT",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawNumbers_factors(),this.drawBorders(),this.drawChassis(),this.drawCursor()},drawNumbers_factors:function(){for(var a=this.vinc("cell_number","auto"),b={ratio:[.45,.45,.45,.45,.36,.3],position:this.TOPLEFT},c=this.range.cells,d=0;d<c.length;d++){var e=c[d],f=e.bx*this.bw,g=e.by*this.bh;a.vid="cell_text_qans_"+e.id,-1!==e.anum?(a.fillStyle=1===e.error?this.fontErrcolor:this.fontAnscolor,this.disptext(""+e.anum,f,g)):a.vhide(),a.vid="cell_text_qnum_"+e.id,-1!==e.qnum?(a.fillStyle=this.fontcolor,this.disptext(""+e.qnum,f,g,b)):a.vhide()}}},Encode:{decodePzpr:function(a){this.decodeBorder(),this.decodeRoomNumber16()},encodePzpr:function(a){this.encodeBorder(),this.encodeRoomNumber16()}},FileIO:{decodeData:function(){this.decodeBorderQues(),this.decodeCellQnum(),this.decodeCellAnumsub()},encodeData:function(){this.encodeBorderQues(),this.encodeCellQnum(),this.encodeCellAnumsub()}},AnsCheck:{checklist:["checkOtherAnsNumberInLine","checkProductNumber","checkNoAnumCell+"],checkOtherAnsNumberInLine:function(){this.checkRowsCols(this.isDifferentAnsNumberInClist,"nmDupRow")},checkNoAnumCell:function(){this.checkAllCell(function(a){return-1===a.anum},"ceNoNum")},checkProductNumber:function(){for(var a=this.board.roommgr.components,b=0;b<a.length;b++){var c=a[b],d=c.clist,e=d.getProduct();if(0!==e&&e!==c.top.qnum){if(this.failcode.add("nmProduct"),this.checkOnly)break;d.seterr(1)}}}},FailCode:{nmProduct:["ブロックの数字と数字の積が同じではありません。","A number of room is not equal to the product of these numbers."]}});