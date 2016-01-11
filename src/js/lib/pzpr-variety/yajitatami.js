/*! @license pzpr.js v3.6.0-pre (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["yajitatami"],{MouseEvent:{mouseinput:function(){this.puzzle.playmode?(this.mousestart||this.mousemove)&&(this.btn.Left&&this.isBorderMode()?this.inputborder():this.inputQsubLine()):this.puzzle.editmode&&(this.mousestart||this.mousemove?this.isBorderMode()?this.inputborder():this.inputdirec():this.mouseend&&this.notInputted()&&this.inputqnum())}},KeyEvent:{enablemake:!0,moveTarget:function(a){return a.match(/shift/)?!1:this.moveTCell(a)},keyinput:function(a){this.key_inputdirec(a)||this.key_inputqnum(a)}},Board:{cols:8,rows:8,hasborder:1},BoardExec:{adjustBoardData:function(a,b){this.adjustNumberArrow(a,b)}},AreaRoomGraph:{enabled:!0},Graphic:{gridcolor_type:"DLIGHT",bordercolor_func:"qans",paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawQansBorders(),this.drawQuesBorders(),this.drawArrowNumbers(),this.drawBorderQsubs(),this.drawChassis(),this.drawTarget()}},Encode:{decodePzpr:function(a){this.decodeArrowNumber16(),this.decodeBorder()},encodePzpr:function(a){this.encodeArrowNumber16(),this.encodeBorder_if_exist()},encodeBorder_if_exist:function(){for(var a=0;a<this.board.border.length;a++)if(1===this.board.border[a].ques){this.encodeBorder();break}}},FileIO:{decodeData:function(){this.decodeCellDirecQnum(),this.decodeBorderQues(),this.decodeBorderAns()},encodeData:function(){this.encodeCellDirecQnum(),this.encodeBorderQues(),this.encodeBorderAns()}},AnsCheck:{checklist:["checkBorderCross","checkArrowNumber_border","checkTatamiLength","checkArrowNumber_tatami","checkNumberAndSize","checkTatamiBreadth"],checkTatamiLength:function(){this.checkAllArea(this.board.roommgr,function(a,b,c,d){return c>1},"bkSize1")},checkTatamiBreadth:function(){this.checkAllArea(this.board.roommgr,function(a,b,c,d){return 1===a||1===b},"bkWidthGt1")},checkArrowNumber_tatami:function(){for(var a=this.board,b=0;b<a.cell.length;b++){var c=a.cell[b];if(c.isValidNum()){var d,e=c.bx,f=c.by,g=c.qdir;if(g===c.UP)d=a.borderinside(e,a.minby,e,f);else if(g===c.DN)d=a.borderinside(e,f,e,a.maxby);else if(g===c.LT)d=a.borderinside(a.minbx,f,e,f);else{if(g!==c.RT)continue;d=a.borderinside(e,f,a.maxbx,f)}if(c.qnum!==d.filter(function(a){return a.isBorder()}).length){if(this.failcode.add("anTatamiNe"),this.checkOnly)break;c.seterr(1)}}}},checkArrowNumber_border:function(){for(var a=this.board,b=0;b<a.cell.length;b++){var c=a.cell[b],d=c.qdir;if(c.isValidNum()&&d&&!c.reldirbd(d,1).isBorder()){if(this.failcode.add("anNoAdjBd"),this.checkOnly)break;c.seterr(1)}}}},FailCode:{bkSizeNe:["数字とタタミの大きさが違います。","The size of tatami and the number written in Tatami is different."],bkSize1:["長さが１マスのタタミがあります。","The length of the tatami is one."],anTatamiNe:["矢印の方向にあるタタミの数が正しくありません。","The number of tatamis are not correct."],anNoAdjBd:["矢印の方向に境界線がありません。","There is no border in front of the arrowed number."]}});