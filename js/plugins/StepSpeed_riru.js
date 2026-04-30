//=============================================================================
// StepSpeed_riru.js
//=============================================================================
/*:
 * @plugindesc キャラクターの歩幅（1マス動くごとに何歩歩くか）を変えられます。足踏み時も同様。
 * @author riru
 *小数点可。
 * @param Step Speed
 * @desc 歩幅補正値。大きいほど小股に、小さい（マイナス）ほど大股になります。
 * @default 0
 *
 * @help 
 *＜使い方＞
 *
 *全てのイベントにパラメータの歩幅補正値は適応されます。
 *個別に設定したい場合、移動ルートのカスタムからスクリプトでthis.setstepSpeedcor(歩幅補正値);と記入するか
 *例）this.setstepSpeedcor(10);
 *イベントコマンドスクリプトからthis.character(イベントId).setstepSpeedcor(歩幅補正値);と記入してください
 *例）this.character(30).setstepSpeedcor(5.7);
 *イベントIdは、このイベントの場合は0、プレイヤーなら-1です。
 *フォロワーの歩幅を変えたいときはイベントコマンドスクリプトから$gamePlayer.followers().setstepSpeedcor(歩幅補正値);と記入してください
 *歩幅補正値は小数点ありでもOKです。
 *ただし個別で設定したもの（特にカスタムの場合）はラグが発生する場合があるので、問題がなければ移動頻度を最高にしてください。
 *
 * ＜規約＞
 * 有償無償問わず使用できます。改変もご自由にどうぞ。仕様報告もいりません。２次配布はだめです
 *著作権は放棄していません。使用する場合は以下の作者とURLをreadmeなどどこかに記載してください
 *
 * ＜作者情報＞
 *作者：riru 
 *HP：ガラス細工の夢幻
 *URL：http://garasuzaikunomugen.web.fc2.com/index.html
 *
 *＜更新情報＞
 *2016年5月27日Ver1.00公開
 *7月1日Ver1.01。フォロワーの歩幅も変更できるように修正。
 */

(function() {
    var parameters = PluginManager.parameters('StepSpeed_riru');
    var step_speed_cor = Number(parameters['Step Speed'] || 0);

var _riru_step_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _riru_step_Game_CharacterBase_initMembers.call(this);
    this._riru_step_speed_cor = step_speed_cor;
};
Game_CharacterBase.prototype.stepSpeedcor = function() {
    return this._riru_step_speed_cor;
};
Game_CharacterBase.prototype.setstepSpeedcor = function(stepSpeedcor) {
    this._riru_step_speed_cor = stepSpeedcor;
};


Game_CharacterBase.prototype.updateAnimationCount = function() {
    if (this.isMoving() && this.hasWalkAnime()) {
        this._animationCount += 1.5+this._riru_step_speed_cor;
    } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
        this._animationCount += 1+this._riru_step_speed_cor;
    }
};
//フォロワーの処理
Game_Followers.prototype.setstepSpeedcor = function(stepSpeedcor) {
        for (var i = 0; i < this._data.length; i++) {
            var follower = this._data[i];
            follower.setstepSpeedcor(stepSpeedcor);
        }
};
Game_Follower.prototype.setstepSpeedcor = function(stepSpeedcor) {
    this._riru_step_speed_cor = stepSpeedcor;
};
Game_Follower.prototype.stepSpeedcor = function() {
    return this._riru_step_speed_cor;
};

})();

