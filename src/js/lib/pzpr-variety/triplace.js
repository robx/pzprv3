/*! @license pzpr.js v3.6.0-pre (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["triplace"],{MouseEvent:{mouseinput:function(){this.puzzle.playmode?this.mousestart||this.mousemove?this.puzzle.key.isZ?this.inputBGcolor():this.btn.Left&&this.isBorderMode()?this.inputborder():this.inputQsubLine():this.mouseend&&this.notInputted()&&this.inputBGcolor():this.puzzle.editmode&&this.mousestart&&this.input51()},inputBGcolor:function(){var a=this.getcell();a.isnull||a.is51cell()||a===this.mouseCell||(null===this.inputData&&(this.btn.Left?0===a.qsub?this.inputData=1:1===a.qsub?this.inputData=2:this.inputData=0:this.btn.Right&&(0===a.qsub?this.inputData=2:1===a.qsub?this.inputData=0:this.inputData=1)),a.setQsub(this.inputData),this.mouseCell=a,a.draw())}},KeyEvent:{enablemake:!0,keyinput:function(a){this.inputnumber51(a,{2:this.board.cols-(this.cursor.bx>>1)-1,4:this.board.rows-(this.cursor.by>>1)-1})}},Cell:{disInputHatena:!0,minnum:0,set51cell:function(){this.setQues(51),this.setQnum(-1),this.setQnum2(-1),this.set51aroundborder()},remove51cell:function(){this.setQues(0),this.setQnum(-1),this.setQnum2(-1),this.set51aroundborder()},set51aroundborder:function(){for(var a=this.getdir4cblist(),b=0;b<a.length;b++){var c=a[b][0],d=a[b][1];d.isnull||d.setQues(this.is51cell()^c.is51cell()?1:0)}}},EXCell:{ques:51},Board:{hasborder:1,hasexcell:1},BoardExec:{adjustBoardData:function(a,b){this.adjustQues51_1(a,b)},adjustBoardData2:function(a,b){this.adjustQues51_2(a,b)}},AreaRoomGraph:{enabled:!0,isnodevalid:function(a){return!a.is51cell()},setExtraData:function(a){a.clist=new this.klass.CellList(a.getnodeobjs());var b=a.clist.getRectSize();a.is1x3=(b.x1===b.x2||b.y1===b.y2)&&3===b.cnt}},Graphic:{gridcolor_type:"LIGHT",bgcellcolor_func:"qsub2",borderQanscolor:"rgb(0, 160, 0)",paint:function(){this.drawBGCells(),this.drawBGEXcells(),this.drawQues51(),this.drawGrid(),this.drawQansBorders(),this.drawQuesBorders(),this.drawBorderQsubs(),this.drawChassis_ex1(!1),this.drawNumbersOn51(),this.drawTarget()}},Encode:{decodePzpr:function(a){this.decodeTriplace()},encodePzpr:function(a){this.encodeTriplace()},decodeTriplace:function(){var a=0,b=0,c=this.outbstr,d=this.board;d.disableInfo();for(var e=0;e<c.length;e++){var f=c.charAt(e),g=d.cell[a];if(f>="g"&&"z">=f?a+=parseInt(f,36)-16:(g.set51cell(),"_"===f||("%"===f?(g.qnum2=parseInt(c.charAt(e+1),36),e++):"$"===f?(g.qnum=parseInt(c.charAt(e+1),36),e++):"-"===f?(g.qnum2="."!==c.charAt(e+1)?parseInt(c.charAt(e+1),16):-1,g.qnum=parseInt(c.substr(e+2,2),16),e+=3):"+"===f?(g.qnum2=parseInt(c.substr(e+1,2),16),g.qnum="."!==c.charAt(e+3)?parseInt(c.charAt(e+3),16):-1,e+=3):"="===f?(g.qnum2=parseInt(c.substr(e+1,2),16),g.qnum=parseInt(c.substr(e+3,2),16),e+=4):(g.qnum2="."!==c.charAt(e)?parseInt(c.charAt(e),16):-1,g.qnum="."!==c.charAt(e+1)?parseInt(c.charAt(e+1),16):-1,e+=1))),a++,!d.cell[a]){b=e+1;break}}d.enableInfo(),a=0;for(var e=b;e<c.length;e++){var f=c.charAt(e),h=d.excell[a];if("."===f?h.qnum2=-1:"-"===f?(h.qnum2=parseInt(c.substr(e+1,2),16),e+=2):h.qnum2=parseInt(f,16),a++,a>=d.cols){b=e+1;break}}for(var e=b;e<c.length;e++){var f=c.charAt(e),h=d.excell[a];if("."===f?h.qnum=-1:"-"===f?(h.qnum=parseInt(c.substr(e+1,2),16),e+=2):h.qnum=parseInt(f,16),a++,a>=d.cols+d.rows){b=e+1;break}}this.outbstr=c.substr(b)},encodeTriplace:function(a){for(var b="",c=this.board,d=0,e=0;e<c.cell.length;e++){var f="",g=c.cell[e];51===g.ques?-1===g.qnum&&-1===g.qnum2?f="_":-1===g.qnum2&&g.qnum<35?f="$"+g.qnum.toString(36):-1===g.qnum&&g.qnum2<35?f="%"+g.qnum2.toString(36):(f+=g.qnum2.toString(16),f+=g.qnum.toString(16),g.qnum>=16&&g.qnum2>=16?f="="+f:g.qnum>=16?f="-"+f:g.qnum2>=16&&(f="+"+f)):d++,0===d?b+=f:(f||20===d)&&(b+=(d+15).toString(36)+f,d=0)}d>0&&(b+=(d+15).toString(36));for(var e=0;e<c.cols;e++){var h=c.excell[e].qnum2;0>h?b+=".":16>h?b+=h.toString(16):256>h&&(b+="-"+h.toString(16))}for(var e=c.cols;e<c.cols+c.rows;e++){var h=c.excell[e].qnum;0>h?b+=".":16>h?b+=h.toString(16):256>h&&(b+="-"+h.toString(16))}this.outbstr+=b}},FileIO:{decodeData:function(){this.decodeCellQnum51(),this.decodeBorderAns(),this.decodeCell(function(a,b){"+"===b?a.qsub=1:"-"===b&&(a.qsub=2)})},encodeData:function(){this.encodeCellQnum51(),this.encodeBorderAns(),this.encodeCell(function(a){return 1===a.qsub?"+ ":2===a.qsub?"- ":". "})}},AnsCheck:{checklist:["checkOverThreeCells","checkRowsColsTileCount","checkLessThreeCells"],checkOverThreeCells:function(){this.checkAllArea(this.board.roommgr,function(a,b,c,d){return c>=3},"bkSizeLt3")},checkLessThreeCells:function(){this.checkAllArea(this.board.roommgr,function(a,b,c,d){return 3>=c},"bkSizeGt3")},checkRowsColsTileCount:function(){this.checkRowsColsPartly(this.isTileCount,function(a){return a.is51cell()},"asLblockNe")},isTileCount:function(a,b){for(var c=b.key51num,d=0,e=0;e<a.length;e++){var f=a[e].room;f.is1x3&&!f.counted&&(d++,f.counted=!0)}var g=0>c||d===c;g||(b.keycell.seterr(1),a.seterr(1));for(var e=0;e<a.length;e++)a[e].room.counted=!1;return g}},FailCode:{bkSizeLt3:["サイズが3マスより小さいブロックがあります。","The size of block is smaller than three."],bkSizeGt3:["サイズが3マスより大きいブロックがあります。","The size of block is larger than three."],asLblockNe:["数字の下か右にあるまっすぐのブロックの数が間違っています。","The number of straight blocks underward or rightward is not correct."]}});