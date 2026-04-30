//=============================================================================
// StatesPositionCorrector.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2019 Tsumio
// 当ファイルの複製・改変・再配布を固く禁じます。
// No reproduction or republication without written permission.
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2019/02/01 公開。
// ----------------------------------------------------------------------------
// [GitHub] : https://github.com/Tsumio/rmmv-plugins
// [Blog]   : http://ntgame.wpblog.jp/
// [Twitter]: https://twitter.com/TsumioNtGame
//=============================================================================

/*:ja
 * @plugindesc エネミーのステートのY座標を設定できるようにします。
 * @author ツミオ
 *
 * @param ----基本的な設定----
 * @desc 
 * @default 
 * 
 * @param ステートのY座標
 * @desc デフォルト値として使用するエネミーのステートのY座標を指定します。
 * @type number
 * @max 9999
 * @min -9999
 * @default 0
 * 
 * 
 * @help エネミーのステートのY座標を設定できるようにします。
 * 
 * このプラグインはアクティブゲーミングメディア様向けに制作されたプラグインです。
 * いかなる理由があろうとも、許可されていない場合の複製・改変・再配布を認めません。
 * 
 * 【特徴】
 * ・エネミーのステートのY座標を設定できるようにします
 * ・メモ欄で個別に指定することも可能です
 * 
 * 【使用方法】
 * プラグインの導入後、プラグインパラメーターを設定してください。
 * 位置補正の必要がある場合、エネミーのデータベースのメモ欄を設定してください。
 * 
 * 【エネミーのメモ欄】
 * エネミーのメモ欄に以下のように記述することにより、ステートの位置を調整できます。
 * <statesPosY:Y座標>
 * 例えば位置を-130にしたい場合、以下のように記述します。
 * <statesPosY:-130>
 * 
 * なお、座標はエネミーのスプライトの原点を0とします。
 * 
 * 【更新履歴】
 * 1.0.0 2019/02/01 公開。
 * 
 * 【備考】
 * 当プラグインを利用したことによるいかなる損害に対しても、制作者は一切の責任を負わないこととします。
 * 
 * 【利用規約】
 * いかなる理由があろうとも、許可されていない場合の複製・改変・再配布を認めません。
 * No reproduction or republication without written permission.
 */

(function() {

    'use strict';
    var pluginName = 'StatesPositionCorrector';

////=============================================================================
//// Local function
////  These functions checks & formats pluguin's command parameters.
////  I borrowed these functions from Triacontane.Thanks!
////=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //This function is not written by Triacontane.Tsumio wrote this function !
    var getParamDouble = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return Number(value);
    };

    //This function is not written by Triacontane.Tsumio wrote this function !
    var convertParam = function(param) {
        if(param !== undefined){
            try {
                return JSON.parse(param);
            }catch(e){
                console.group();
                console.error('%cParameter is invalid ! You should check the following parameter !','background-color: #5174FF');
                console.error('Parameter:' + eval(param));
                console.error('Error message :' + e);
                console.groupEnd();
            }
        }
    };

    //This function is not written by Triacontane.Tsumio wrote this function !
    var convertArrayParam = function(param) {
        if(param !== undefined){
            try {
                const array = JSON.parse(param);
                for(let i = 0; i < array.length; i++) {
                    array[i] = JSON.parse(array[i]);
                }
                return array;
            }catch(e){
                console.group();
                console.error('%cParameter is invalid ! You should check the following parameter !','background-color: #5174FF');
                console.error('Parameter:' + eval(param));
                console.error('Error message :' + e);
                console.groupEnd();
            }
        }
    };

    /**
     * Convert to number.Receive converted JSON object.
     * @param {Object} obj
     * 
     */
    //This function is not written by Triacontane.Tsumio wrote this function !
    var convertToNumber = function(obj) {
        for(var prop in obj) {
            obj[prop] = Number(obj[prop]);
        }
        return obj;
    }

////=============================================================================
//// Get and set pluguin parameters.
////=============================================================================
    var param                          = {};
    //ステートのY座標
    param.statesYPos = getParamNumber(['ステートのY座標', 'ステートのY座標']);
    
//////=============================================================================
///// Sprite_Enemy
/////  エネミーのステート位置を調整する
/////==============================================================================

    //ステートのY座標を値としてプールしておく。
    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.apply(this, arguments);

        this._statesYPos = this._enemy.fetchStatesPositionY();
    };

    //位置を強制的に変更する。
    const _Sprite_Enemy_updateStateSprite = Sprite_Enemy.prototype.updateStateSprite;
    Sprite_Enemy.prototype.updateStateSprite = function() {
        _Sprite_Enemy_updateStateSprite.call(this);

        this._stateIconSprite.y = this._statesYPos;
    };

//////=============================================================================
///// Game_Enemy
/////  ステートの位置を調整するためのメモタグを取得する
/////==============================================================================

    //ステートを表示するべきY座標をメモタグから取得。できなければデフォルト値を返す。
    Game_Enemy.prototype.fetchStatesPositionY = function() {
        return this.enemy().meta['statesPosY'] || param.statesYPos;
    };

})();