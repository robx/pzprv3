/*! @license pzpr.js v3.6.0-pre (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["kinkonkan"],{MouseEvent:{mouseinput:function(){this.puzzle.playmode?(this.mousestart||this.mousemove&&null!==this.inputData)&&this.inputslash():this.puzzle.editmode&&(this.mousestart?this.inputedit_onstart():this.mousemove&&this.btn.Left&&this.inputborder())},inputslash:function(){var a=this.getcell();if(a.isnull)return void this.inputflash();var b=this.inputData;if(-1===b||0===b);else{if(null!==b)return;var c=a.getState();this.btn.Left?b=(c+6)%4-1:this.btn.Right&&(b=(c+4)%4-1)}a.setState(b),a.drawaround(),this.inputData=b},inputflash:function(){var a=this.getpos(0).getex(),b=this.puzzle,c=b.board;a.isnull||this.mouseCell===a||(11!==this.inputData&&null!==this.inputData||(a.id>=c.excell.length-4?c.lightclear():null===this.inputData&&1===a.qlight?(c.lightclear(),this.inputData=12):(c.flashlight(a),this.inputData=11)),this.mouseCell=a)},inputedit_onstart:function(){var a=this.getcell_excell(),b=this.board;if(!a.isnull)if("excell"!==a.group)this.inputborder();else if(a!==this.cursor.getex())this.setcursor(a),this.mousereset();else{var c=a;1!==c.qlight?b.flashlight(c):b.lightclear(),this.mousereset()}}},KeyEvent:{enablemake:!0,moveTarget:function(a){var b=this.cursor,c=b.getex(),d=!0,e=c.NDIR;return"up"===a?b.by===b.maxy&&b.minx<b.bx&&b.bx<b.maxx?b.by=b.miny:b.by>b.miny?e=c.UP:d=!1:"down"===a?b.by===b.miny&&b.minx<b.bx&&b.bx<b.maxx?b.by=b.maxy:b.by<b.maxy?e=c.DN:d=!1:"left"===a?b.bx===b.maxx&&b.miny<b.by&&b.by<b.maxy?b.bx=b.minx:b.bx>b.minx?e=c.LT:d=!1:"right"===a?b.bx===b.minx&&b.miny<b.by&&b.by<b.maxy?b.bx=b.maxx:b.bx<b.maxx?e=c.RT:d=!1:d=!1,d&&(e!==c.NDIR&&b.movedir(e,2),c.draw(),b.draw(),this.stopEvent()),d},keyinput:function(a){this.key_inputexcell(a)},key_inputexcell:function(a){var b=this.cursor.getex(),c=this.board;if(b.bx!==c.minbx+1&&b.bx!==c.maxbx-1||b.by!==c.minby+1&&b.by!==c.maxby-1){var d=b.qnum;if(a>="0"&&"9">=a){var e=+a,f=b.getmaxnum();0>=d||this.prev!==b?f>=e&&b.setQnum(e):f>=10*d+e?b.setQnum(10*d+e):f>=e&&b.setQnum(e)}else if(1===a.length&&a>="a"&&"z">=a){var e=parseInt(a,36)-10,g=b.qchar;(g-1)%26===e&&g>0&&79>g?b.setQchar(g+26):(g-1)%26===e?b.setQchar(0):b.setQchar(e+1)}else if("-"===a)-1!==d?b.setQnum(-1):(b.setQnum(-1),b.setQchar(0));else if("F4"===a)1!==b.qlight?c.flashlight(b):c.lightclear();else{if(" "!==a)return;b.setQnum(-1),b.setQchar(0)}this.prev=b,this.cursor.draw()}}},TargetCursor:{initCursor:function(){this.init(-1,-1)}},Cell:{qlight:0,propinfo:["error","qinfo","qlight"],propnorec:{color:1,error:1,qinfo:1,qlight:1},getState:function(){return this.qans>30?this.qans-30:0!==this.qsub?-1:0},setState:function(a){var b=[-1,0,31,32][a+1];-1!==b?(this.setQans(b),this.setQsub(0)):(this.setQans(0),this.setQsub(1))}},EXCell:{qlight:0,propinfo:["error","qinfo","qlight"],propnorec:{color:1,error:1,qinfo:1,qlight:1},minnum:0},Board:{cols:8,rows:8,hasborder:1,hasexcell:2,haslight:!1,lightclear:function(){if(this.haslight){for(var a=0;a<this.cell.length;a++)this.cell[a].qlight=0;for(var a=0;a<this.excell.length;a++)this.excell[a].qlight=0;this.haslight=!1,this.puzzle.redraw()}},flashlight:function(a){this.lightclear(),this.searchLight(a,!0),this.puzzle.redraw()},searchLight:function(a,b){for(var c=0,d=[],e=0;e<this.cell.length;e++)d[e]=0;var f=a.getaddr(),g=0;for(f.by===this.minby+1?g=2:f.by===this.maxby-1?g=1:f.bx===this.minbx+1?g=4:f.bx===this.maxbx-1&&(g=3);0!==g;){f.movedir(g,2);var h=f.getc();if(h.isnull)break;var i=h.qans,j=h.id;if(31===i)1===g?(d[j]=isNaN({4:1,1:1}[d[j]])?2:1,g=3):2===g?(d[j]=isNaN({2:1,1:1}[d[j]])?4:1,g=4):3===g?(d[j]=isNaN({2:1,1:1}[d[j]])?4:1,g=1):4===g&&(d[j]=isNaN({4:1,1:1}[d[j]])?2:1,g=2);else{if(32!==i){d[j]=1;continue}1===g?(d[j]=isNaN({5:1,1:1}[d[j]])?3:1,g=4):2===g?(d[j]=isNaN({3:1,1:1}[d[j]])?5:1,g=3):3===g?(d[j]=isNaN({5:1,1:1}[d[j]])?3:1,g=2):4===g&&(d[j]=isNaN({3:1,1:1}[d[j]])?5:1,g=1)}if(c++,c>this.cell.length)break}var k=f.getex().id;if(b){for(var e=0;e<this.excell.length;e++)this.excell[e].qlight=0;a.qlight=1,this.excell[k].qlight=1;for(var e=0;e<this.cell.length;e++)this.cell[e].qlight=d[e];this.haslight=!0}return{cnt:c,dest:k}}},BoardExec:{adjustBoardData:function(a,b){if(a&this.TURNFLIP)for(var c=this.board.cell,d=0;d<c.length;d++){var e=c[d];e.setQans({0:0,31:32,32:31}[e.qans])}}},AreaRoomGraph:{enabled:!0},Graphic:{gridcolor_type:"LIGHT",dotcolor_type:"PINK",errcolor1:"black",errcolor2:"black",lightcolor:"rgb(255, 255, 127)",paint:function(){this.drawBGCells_kinkonkan(),this.drawDotCells(!0),this.drawGrid(),this.drawBorders(),this.drawSlashes(),this.drawBGEXcells(),this.drawNumbers_kinkonkan(),this.drawChassis(),this.drawTarget()},drawBGCells_kinkonkan:function(){for(var a=this.vinc("cell_back","crispEdges"),b=this.range.cells,c=0;c<b.length;c++){var d=b[c],e=d.error||d.qlight,f=d.bx*this.bw,g=d.by*this.bh;a.fillStyle=0!==d.error?this.errbcolor1:this.lightcolor,a.vid="c_bglight_"+d.id,1===e?a.fillRectCenter(f,g,this.bw+.5,this.bh+.5):0!==e?this.drawTriangle1(f,g,d.qlight):a.vhide()}},getBGEXcellColor:function(a){return 1===a.qlight?this.lightcolor:null},drawNumbers_kinkonkan:function(){for(var a=this.vinc("excell_number","auto"),b=this.range.excells,c=0;c<b.length;c++){var d=b[c],e=d.qnum,f=d.qchar;if(a.vid="excell_text_"+d.id,0!==f||-1!==e){var g="";f>0&&26>=f?g+=(f+9).toString(36).toUpperCase():f>26&&52>=f?g+=(f-17).toString(36).toLowerCase():f>52&&78>=f?g+=(f-43).toString(36).toUpperCase():f>78&&104>=f&&(g+=(f-69).toString(36).toLowerCase()),e>=0&&(g+=e.toString(10)),a.fillStyle=this.fontErrcolor,1!==d.error&&(a.fillStyle=52>=f?this.fontcolor:this.fontAnscolor);var h={ratio:0===f||10>e?[.66]:[.55]};this.disptext(g,d.bx*this.bw,d.by*this.bh,h)}else a.vhide()}}},Encode:{decodePzpr:function(a){this.decodeBorder(),this.decodeKinkonkan()},encodePzpr:function(a){this.encodeBorder(),this.encodeKinkonkan()},decodeKinkonkan:function(){for(var a=[],b=0,c=0,d=this.outbstr,e=this.board,f=0;f<d.length;f++){var g=d.charAt(f),h=e.excell[b];if(this.include(g,"A","Z")?(a.push(b),h.qchar=parseInt(g,36)-9):this.include(g,"0","9")?(a.push(b),h.qchar=parseInt(g,36)-9+26*(parseInt(d.charAt(f+1),10)+1),f++):this.include(g,"a","z")&&(b+=parseInt(g,36)-10),b++,b>=e.excell.length-4){c=f+1;break}}b=0;for(var f=c;f<d.length;f++){var g=d.charAt(f),h=e.excell[a[b]];if("."===g?h.qnum=-2:"-"===g?(h.qnum=parseInt(d.substr(f+1,2),16),f+=2):h.qnum=parseInt(d.substr(f,1),16),b++,b>=a.length){c=f+1;break}}this.outbstr=d.substr(c)},encodeKinkonkan:function(){for(var a="",b="",c=this.board,d=0,e=0;e<c.excell.length-4;e++){var f="",g=c.excell[e].qchar,h=c.excell[e].qnum;g>0&&104>=g?(f=26>=g?(g+9).toString(36).toUpperCase():((g-1)/26-1|0).toString(10)+((g-1)%26+10).toString(16).toUpperCase(),b+=-2===h?".":16>h?""+h.toString(16):"-"+h.toString(16)):d++,0===d?a+=f:(f||26===d)&&(a+=(9+d).toString(36)+f,d=0)}d>0&&(a+=(9+d).toString(36)),this.outbstr+=a+b}},FileIO:{decodeData:function(){this.decodeAreaRoom();for(var a=this.board,b=this.getItemList(a.rows+2),c=0;c<b.length;c++){var d=b[c];if("."!==d){var e=c%(a.cols+2)*2-1,f=(c/(a.cols+2)<<1)-1,g=a.getex(e,f);if(g.isnull){if(1===this.filever){var h=a.getc(e,f);h.isnull||("+"===d?h.qsub=1:"1"===d?h.qans=31:"2"===d&&(h.qans=32))}}else{var i=d.split(",");""!==i[0]&&(g.qchar=+i[0]),""!==i[1]&&(g.qnum=+i[1])}}}0===this.filever&&this.decodeCell(function(a,b){"+"===b?a.qsub=1:"1"===b?a.qans=31:"2"===b&&(a.qans=32)})},encodeData:function(){this.filever=1,this.encodeAreaRoom();for(var a=this.board,b=-1;b<a.maxby;b+=2){for(var c=-1;c<a.maxbx;c+=2){var d=a.getex(c,b);if(d.isnull){var e=a.getc(c,b);e.isnull?this.datastr+=". ":31===e.qans?this.datastr+="1 ":32===e.qans?this.datastr+="2 ":1===e.qsub?this.datastr+="+ ":this.datastr+=". "}else{var f=d.qchar,g=d.qnum,h=0!==f?""+f:"",i=-1!==g?""+g:"";this.datastr+=""===h&&""===i?". ":h+","+i+" "}}this.datastr+="\n"}}},AnsCheck:{checklist:["checkSingleMirrorInRoom","checkPairMirror","checkReflectionCount","checkExistMirrorInRoom"],checkSingleMirrorInRoom:function(){this.checkAllBlock(this.board.roommgr,function(a){return 0!==a.qans},function(a,b,c,d){return 1>=c},"bkObjGe2")},checkExistMirrorInRoom:function(){this.checkAllBlock(this.board.roommgr,function(a){return 0!==a.qans},function(a,b,c,d){return 0!==c},"bkNoObj")},checkPairMirror:function(){this.checkMirrors(1,"pairedLetterNe")},checkReflectionCount:function(){this.checkMirrors(2,"pairedNumberNe")},checkMirrors:function(a,b){for(var c=[],d=this.board,e=0;e<d.excell.length-4;e++){var f=d.excell[e];if(isNaN(c[e])&&-1!==f.qnum&&0!==f.qchar){var g=d.searchLight(f,!this.checkOnly),h=d.excell[g.dest];if(1===a&&f.qchar!==h.qchar||2===a&&(f.qnum!==h.qnum||f.qnum!==g.cnt)){this.failcode.add(b);break}c[e]=1,c[g.dest]=1}}}},FailCode:{bkNoObj:["斜線の引かれていない部屋があります。","A room has no mirrors."],bkObjGe2:["斜線が複数引かれた部屋があります。","A room has plural mirrors."],pairedLetterNe:["光が同じ文字の場所へ到達しません。","Beam from a light doesn't reach one's pair."],pairedNumberNe:["光の反射回数が正しくありません。","The count of refrection is wrong."]}});