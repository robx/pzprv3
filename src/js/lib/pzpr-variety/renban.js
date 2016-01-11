/*! @license pzpr.js v3.6.0-pre (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["renban"],{MouseEvent:{mouseinput:function(){this.puzzle.playmode?this.mousestart&&this.inputqnum():this.puzzle.editmode&&(this.mousestart||this.mousemove?this.btn.Left?this.inputborder():this.btn.Right&&this.inputQsubLine():this.mouseend&&this.notInputted()&&this.inputqnum())}},KeyEvent:{enablemake:!0,enableplay:!0},Board:{cols:6,rows:6,hasborder:1,getBorderLengthInfo:function(){for(var a=new this.klass.BorderInfo,b=0;b<this.border.length;b++)a.id[b]=this.border[b].isBorder()?0:null;for(var b=0;b<this.border.length;b++){var c=this.border[b];if(0===a.id[c.id]){for(var d=a.addPath(),e=c.getaddr(),f=c.isVert(),g=0;;){var h=e.getb();if(h.isnull||0!==a.id[h.id])break;d.blist[g++]=h,a.id[h.id]=d.id,f?e.move(0,2):e.move(2,0)}d.blist.length=g}}return a}},AreaRoomGraph:{enabled:!0},BorderInfo:{initialize:function(){this.max=0,this.id=[],this.path=[]},addPath:function(){var a=++this.max;return this.path[a]={blist:new this.klass.BorderList,id:a}}},Graphic:{gridcolor_type:"DLIGHT",borderQsubcolor:"black",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawNumbers(),this.drawBorders(),this.drawBorderQsubs(),this.drawChassis(),this.drawCursor()},getBorderColor:function(a){return 1===a.ques?1===a.error?this.errcolor1:this.borderQuescolor:null}},Encode:{decodePzpr:function(a){this.decodeBorder(),this.decodeNumber16()},encodePzpr:function(a){this.encodeBorder(),this.encodeNumber16()}},FileIO:{decodeData:function(){this.decodeBorderQues(),this.decodeCellQnum(),this.decodeCellAnumsub()},encodeData:function(){this.encodeBorderQues(),this.encodeCellQnum(),this.encodeCellAnumsub()}},AnsCheck:{checklist:["checkDifferentNumberInRoom","checkNumbersInRoom","checkBorderSideNumber","checkNoNumCell+"],checkNumbersInRoom:function(){for(var a=this.board.roommgr.components,b=0;b<a.length;b++){var c=a[b].clist;if(!(c.length<=1)){for(var d=-1,e=c[0].getmaxnum(),f=!1,g=0,h=c.length;h>g;g++){var i=c[g].getNum();if(-1===i||-2===i){f=!0;break}i>d&&(d=i),e>i&&(e=i)}if(f)break;if(c.length!==d-e+1){if(this.failcode.add("bkNotSeqNum"),this.checkOnly)break;c.seterr(1)}}}},checkBorderSideNumber:function(){for(var a=this.board,b=a.getBorderLengthInfo(),c=0;c<a.border.length;c++)if(null!==b.id[c]){var d=a.border[c],e=d.sidecell[0],f=d.sidecell[1],g=e.getNum(),h=f.getNum();if(!(0>=g||0>=h)){var i=b.path[b.id[c]].blist;if(Math.abs(g-h)!==i.length){if(this.failcode.add("cbDiffLenNe"),this.checkOnly)break;e.seterr(1),f.seterr(1),i.seterr(1)}}}}},FailCode:{bkDupNum:["1つの部屋に同じ数字が複数入っています。","A room has two or more same numbers."],bkNotSeqNum:["部屋に入る数字が正しくありません。","The numbers in the room are wrong."],cbDiffLenNe:["数字の差がその間にある線の長さと等しくありません。","The differnece between two numbers is not equal to the length of the line between them."]}});