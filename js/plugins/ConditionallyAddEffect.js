//
//  条件付き追加効果 ver1.021
//
// author yana
//

var Imported = Imported || {};
Imported['ConditionallyAddEffect'] = 1.021;

/*:
 * @plugindesc ver1.021/条件を満たすと発動する追加効果を設定できるようになります。
 * @author Yana
 * 
 * @param Display Add Effect Text
 * @desc 追加効果が発動した時のメッセージ。_nameが発動元スキル名に、
 * _mes1,_mes2が追加効果のメッセージ1、2行目に置き換わります。
 * @default _userの_nameの追加効果が発動した！
 * 
 * @help プラグインコマンドはありません。
 * 
 * ※YEP_BattleEngineCoreよりも下に配置してください。
 * 
 * スキルやアイテムのメモ欄に
 * 
 * <追加効果:I○,×%>
 * 発動条件
 * </追加効果>
 * または、
 * <追加効果:S○,×%>
 * 発動条件
 * </追加効果>
 * と記述してください。
 * 
 * I○の場合は○番のアイテム、S○の場合は○番のスキルが条件を満たした時、×%の確率で追加効果として発動します。
 * 
 * 発動条件の詳細はConditionallyCoreのヘルプを参照してください。
 * 発動時の表示メッセージはnullにすることで表示を無効化することができます。
 * 発動時のメッセージは_userを発動者の名前に変換します。
 * 
 * ------------------------------------------------------
 * 利用規約：特になし。素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.021:
 * コンソールの表示を削除。
 * ver1.02:
 * YEP_BattleEngineCore_ver1.28dとの併用化処理を追加。
 * メモ欄に記述のSIにsiも使用できるように追加。
 * ver1.01:
 * メッセージを非表示にする機能が正常に動作していなかったバグを修正。
 * メッセージの変換順を変更。
 * メッセージの制御文字に_userを追加。
 * ver1.00:
 * 公開
 */

(function(){
	
	var parameters = PluginManager.parameters('ConditionallyAddEffect');
	var displayAddEffectText = String(parameters['Display Add Effect Text'] || '_nameの追加効果が発動！');
	
	function AddEffectManager() {
    	throw new Error('This is a static class');
	}
	
	AddEffectManager.initCond = function(note){
		var texts = note.split('\n');
		var flag = false;
		var result = [];
		for(var i=0;i<texts.length;i++){
			if (flag){
				if (texts[i].match(/^<\/追加効果>/)){
					result.push(effect);
					flag = false;
				}else{
					effect['conditions'].push(ConditionallyManager.makeCondition(texts[i]));
				}
			}else if (texts[i].match(/^<追加効果:([ISis])(\d+),(\d+)[%％]>/)){
				var effect = {
					'type':RegExp.$1,
					'id':parseInt(RegExp.$2),
					'rate':parseInt(RegExp.$3),
					'conditions':[]
					};
				flag = true;
			}
		}
		return result;
	};
	
	var _CAef_BManager_startAction = BattleManager.startAction;
	BattleManager.startAction = function(){
		_CAef_BManager_startAction.call(this);
		this._subject._endAddEffect = false;
	};
	
	var _CAef_BManager_endAction = BattleManager.endAction;
	BattleManager.endAction = function(){
		this._isAddEffect = true;
		_CAef_BManager_endAction.call(this);
		if (this._subject && !this._subject._endAddEffect){
			this.executeAddEffect();
			if(this._phase === 'turn'){
				this._isAddEffect = false;
			}
		}else{
			this._isAddEffect = false;
		}
	}
	
	BattleManager.executeAddEffect = function(){
		if ($gameTroop.aliveMembers().length === 0){ return }
		var item = this._lastAction.item();
		if (!item){ return }
		item._condAddEffects = item._condAddEffects || AddEffectManager.initCond(item.note);
		var cEff = item._condAddEffects;
		var user = this._subject;
		var targets = this._lastTargets;
		if (!targets[0]){ return }
		if (!targets[0]._lastHit){ return }
		for(var i=0;i<cEff.length;i++){
			if (Math.random() < (cEff[i]['rate'] / 100)){
				if (ConditionallyManager.checkConditions(user,targets[0],cEff[i]['conditions'])){
					var action = new Game_Action(user);
					switch(cEff[i]['type']){
					case 'I':
					case 'i':
						action.setItem(cEff[i]['id']);
						break;
					case 'S':
					case 's':
						action.setSkill(cEff[i]['id']);
						break;
					}
					if (action.item().scope === item.scope){
						var r = targets.filter(function(t){ return t.isDead() })
						if (r.length !== targets.length){	
							this.startActionC(user,action,targets);
						}
					}else if (action.isForOne() && action.isForFriend()){
						if (user.isAlive()){
							this.startActionC(user,action,[user]);
						}
					}else if (action.isForOne() && action.isForOpponent){
						for(var j=0;j<targets.length;j++){
							if (targets[j].isAlive()){
								this.startActionC(user,action,[targets[j]]);
								break;
							}
						}
					}else{
						targets = action.makeTargets();
						this.startActionC(user,action,targets);
					}
				}
			}
		}
	};
	
	if(Imported.YEP_BattleEngineCore){
	BattleManager.startActionC = function(subject,action,targets) {
    	this._action = action;
    	this.setTargets(targets);
    	this._allTargets = targets.slice();
    	this._individualTargets = targets.slice();
    	this._phase = 'phaseChange';
    	this._phaseSteps = ['setup', 'whole', 'target', 'follow', 'finish'];
    	this._returnPhase = '';
    	this._actionList = [];
    	//subject.useItem(this._action.item());
    	this._action.applyGlobal();
    	this._logWindow.displayAddEffect(subject,this._lastAction.item());
    	this._logWindow.startAction(this._subject, this._action, this._targets);
		this._subject._endAddEffect = true;
	}; 
	}else{
	BattleManager.startActionC = function(subject,action,targets) {
    	this._phase = 'action';
   		this._action = action;
    	this._targets = targets;
    	//subject.useItem(action.item());// 追加効果は消費が発生しない
    	this._action.applyGlobal();
    	this.refreshStatus();
    	this._logWindow.displayAddEffect(subject,this._lastAction.item());
    	this._logWindow.startActionC(subject, action, targets);
		this._subject._endAddEffect = true;
	};
	};
	
	Window_BattleLog.prototype.displayAddEffect = function(subject,item){
    	var text = displayAddEffectText;
    	if (text != 'null') {
    		if (DataManager.isSkill(item)){
    			text = text.replace('_mes1',item.message1);
    			text = text.replace('_mes2',item.message2);
    		}
    		text = text.replace('_user',subject.name());
    		text = text.replace('_name',item.name);
        	this.push('addText', text);
        	this.push('wait');
        	this.push('clear');
    	}
	};
	
	Window_BattleLog.prototype.startActionC = function(subject, action, targets) {
    	var item = action.item();
    	this.push('performActionStart', subject, action);
    	this.push('waitForMovement');
    	this.push('performAction', subject, action);
    	this.push('showAnimation', subject, targets.clone(), item.animationId);
        this.push('wait');
	};
	
	var _CAef_GAction_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
		$gameTemp._tmpTarget = target;
		_CAef_GAction_apply.call(this,target);
	}
	
	var _CAef_GActionResult_isHit = Game_ActionResult.prototype.isHit;
	Game_ActionResult.prototype.isHit = function() {
		var result = _CAef_GActionResult_isHit.call(this);
		$gameTemp._tmpTarget._lastHit = result;
		return result;	
	};
	
	var _CAef_SActor_stepBack = Sprite_Actor.prototype.stepBack;
	Sprite_Actor.prototype.stepBack = function() {
    	if (!BattleManager._isAddEffect){ _CAef_SActor_stepBack.call(this) }
	};
}());
