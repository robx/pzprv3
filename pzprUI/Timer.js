// Timer.js v3.4.0
(function(){

var k = pzprv3.consts;

//---------------------------------------------------------------------------
// ★Timerクラス
//---------------------------------------------------------------------------
pzprv3.createCoreClass('Timer',
{
	initialize : function(targetpuzzle){
		// ** 一般タイマー
		this.TID;				// タイマーID
		this.timerInterval = 100;
		if(pzprv3.browser.IE6 || pzprv3.browser.IE7 || pzprv3.browser.IE8){ this.timerInterval *= 2;}

		this.targetpuzzle = targetpuzzle;

		this.st       = 0;		// タイマースタート時のgetTime()取得値(ミリ秒)
		this.current  = 0;		// 現在のgetTime()取得値(ミリ秒)

		// 経過時間表示用変数
		this.bseconds = 0;		// 前回ラベルに表示した時間(秒数)
		this.timerEL = pzprv3.getEL('timerpanel');

		// 自動正答判定用変数
		this.lastAnsCnt  = 0;	// 前回正答判定した時の、OperationManagerに記録されてた問題/回答入力のカウント
		this.worstACtime = 0;	// 正答判定にかかった時間の最悪値(ミリ秒)
		this.nextACtime  = 0;	// 次に自動正答判定ルーチンに入ることが可能になる時間
	},

	//---------------------------------------------------------------------------
	// tm.reset()      タイマーのカウントを0にして、スタートする
	// tm.start()      update()関数を200ms間隔で呼び出す
	// tm.update()     200ms単位で呼び出される関数
	//---------------------------------------------------------------------------
	reset : function(){
		this.worstACtime = 0;
		this.timerEL.innerHTML = this.label()+"00:00";

		clearInterval(this.TID);
		this.start();
	},
	start : function(){
		this.st = pzprv3.currentTime();
		var self = this;
		this.TID = setInterval(function(){ self.update();}, this.timerInterval);
	},
	update : function(){
		this.current = pzprv3.currentTime();

		if(pzprv3.PLAYER){ this.updatetime();}
		if(this.targetpuzzle.getConfig('autocheck')){ this.ACcheck();}
	},

	//---------------------------------------------------------------------------
	// tm.updatetime() 秒数の表示を行う
	// tm.label()      経過時間に表示する文字列を返す
	//---------------------------------------------------------------------------
	updatetime : function(){
		var seconds = ((this.current - this.st)/1000)|0;
		if(this.bseconds == seconds){ return;}

		var hours   = (seconds/3600)|0;
		var minutes = ((seconds/60)|0) - hours*60;
		seconds = seconds - minutes*60 - hours*3600;

		if(minutes < 10) minutes = "0" + minutes;
		if(seconds < 10) seconds = "0" + seconds;

		this.timerEL.innerHTML = [this.label(), (!!hours?hours+":":""), minutes, ":", seconds].join('');

		this.bseconds = seconds;
	},
	label : function(){
		return this.targetpuzzle.menu.selectStr("経過時間：","Time: ");
	},

	//---------------------------------------------------------------------------
	// tm.ACcheck()    自動正解判定を呼び出す
	//---------------------------------------------------------------------------
	ACcheck : function(){
		if(this.current>this.nextACtime && this.lastAnsCnt!=this.targetpuzzle.opemgr.anscount && !this.targetpuzzle.checker.inCheck){
			this.lastAnsCnt = this.targetpuzzle.opemgr.anscount;
			if(!this.targetpuzzle.checker.autocheck()){ return;}

			this.worstACtime = Math.max(this.worstACtime, (pzprv3.currentTime()-this.current));
			this.nextACtime = this.current + (this.worstACtime<250 ? this.worstACtime*4+120 : this.worstACtime*2+620);
		}
	}
});

//---------------------------------------------------------------------------
// ★UndoTimerクラス
//---------------------------------------------------------------------------
pzprv3.createCoreClass('UndoTimer',
{
	initialize : function(targetpuzzle){
		// ** Undoタイマー
		this.TID           = null;	// タイマーID
		this.timerInterval = 25
		if(pzprv3.browser.IE6 || pzprv3.browser.IE7 || pzprv3.browser.IE8){ this.timerInterval *= 2;}

		this.targetpuzzle = targetpuzzle;

		this.inUNDO = false;
		this.inREDO = false;
		this.ismouse = false;

		// Undo/Redo用変数
		this.undoWaitTime  = 300;	// 1回目にwaitを多く入れるための値
		this.undoWaitCount = 0;
	},

	//---------------------------------------------------------------------------
	// ut.startUndo() Undo呼び出しを開始する
	// ut.startRedo() Redo呼び出しを開始する
	// ut.startProc() Undo/Redo呼び出しを開始する
	// 
	// ut.stop()      Undo/Redo呼び出しを終了する
	//---------------------------------------------------------------------------
	startUndo : function(){ if(!this.inUNDO){ this.inUNDO=true; this.startProc();}},
	startRedo : function(){ if(!this.inREDO){ this.inREDO=true; this.startProc();}},
	startProc : function(){
		this.undoWaitCount = this.undoWaitTime/this.timerInterval;
		var self = this;
		if(!this.TID){ this.TID = setInterval(function(){ self.proc();}, this.timerInterval);}
		this.exec();
	},

	stop : function(){
		this.inUNDO = false;
		this.inREDO = false;
		this.ismouse = false;

		clearInterval(this.TID);
		this.TID = null;
	},

	//---------------------------------------------------------------------------
	// ut.startMouseUndo() 碁石拾いの石がない場所のマウスクリックでUndoする
	// ut.startMouseRedo() 碁石拾いの石がない場所のマウスクリックでRedoする
	//---------------------------------------------------------------------------
	startMouseUndo : function(){ this.ismouse=true; this.startUndo();},
	startMouseRedo : function(){ this.ismouse=true; this.startRedo();},

	//---------------------------------------------------------------------------
	// ut.proc()  Undo/Redo呼び出しを実行する
	// ut.exec()  Undo/Redo関数を呼び出す
	//---------------------------------------------------------------------------
	proc : function(){
		if (!this.inUNDO && !this.inREDO){ this.stop();}
		else if(this.undoWaitCount>0){ this.undoWaitCount--;}
		else{ this.exec();}
	},
	exec : function(){
		var opemgr = this.targetpuzzle.opemgr;
		if(!!this.ismouse && this.targetpuzzle.pid==='goishi'){
			if(this.inUNDO){
				var prop = (opemgr.current>-1 ? opemgr.ope[opemgr.current].property : '');
				if(prop!==k.ANUM){ this.stop();}
			}
			else if(this.inREDO){
				var prop = (opemgr.current+1<opemgr.ope.length ? opemgr.ope[opemgr.current+1].property : '');
				if(prop!==k.ANUM){ this.stop();}
			}
		}
		
		if(!!this.TID){
			if(this.inUNDO){
				opemgr.undo(1);
				if(!opemgr.enableUndo){ this.stop();}
			}
			else if(this.inREDO){
				opemgr.redo(1);
				if(!opemgr.enableRedo){ this.stop();}
			}
		}
	}
});

})();