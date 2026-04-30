//=============================================================================
// 
// TP100skill.js
// 
// Copyright (c) kotonoha*
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//
// 2016/01/12 ver1.0 プラグイン公開
// 
//=============================================================================

/*:
 * @plugindesc TPが100になるまでTP技を使用不可にするプラグイン
 * @author kotonoha*（http://ktnh5108.pw/）
 *
 * @help TPが100ポイントたまるまで、TP技のコマンドを選べない様にします。
 * TPを100消費する必殺技が使える様になった時にコマンドが使用可能となり、欄には「必殺技★」と表示されます。
 * 
 * @param TP_stypeID
 * @desc 必殺技に使用するスキルID（データベース＞タイプ＞スキルタイプ の左側の数値）を指定
 * @default 02
 * 
 * @param TP_mark
 * @desc TP100になったらTP技のコマンドの横に表示するマーク
 * @default ★
 *
 */

(function() {

    var parameters = PluginManager.parameters('TP100skill');
	var TP_stypeID = String(parameters['TP_stypeID']);
	var TP_mark = String(parameters['TP_mark']);

	Window_ActorCommand.prototype.addSkillCommands = function() {

	    var skillTypes = this._actor.addedSkillTypes();

		skillTypes.forEach(function(stypeId) {

		var name = $dataSystem.skillTypes[stypeId];
		
		if (stypeId == TP_stypeID && this._actor.tp == 100) {
			var name = name + TP_mark;
			this.addCommand(name, 'skill', true, stypeId);
		} 
		else if (stypeId == TP_stypeID && this._actor.tp != 100) {
			this.addCommand(name, 'skill', false, stypeId);
		}
		else {
			this.addCommand(name, 'skill', true, stypeId);
		}

	}, this);

	};

})();