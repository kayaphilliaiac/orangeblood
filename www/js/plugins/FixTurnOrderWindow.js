//=============================================================================
// FixTurnOrderWindow.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2019 Tsumio
// 当ファイルの複製・改変・再配布を固く禁じます。
// No reproduction or republication without written permission.
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2019/02/04 行動順アイコンがポップアップしないときがある不具合を修正。
// 1.0.0 2019/02/01 公開。
// ----------------------------------------------------------------------------
// [GitHub] : https://github.com/Tsumio/rmmv-plugins
// [Blog]   : http://ntgame.wpblog.jp/
// [Twitter]: https://twitter.com/TsumioNtGame
//=============================================================================

/*:ja
 * @plugindesc YEP_X_TurnOrderDisplayとChangeEquipBattleの競合を解消します。
 * @author ツミオ
 *
 * @param ----基本的な設定----
 * @desc 
 * @default 
 * 
 * 
 * @help YEP_X_TurnOrderDisplayとChangeEquipBattleの競合を解消します。
 * 
 * このプラグインはアクティブゲーミングメディア様向けに制作されたプラグインです。
 * いかなる理由があろうとも、許可されていない場合の複製・改変・再配布を認めません。
 * 
 * 【特徴】
 * ・YEP_X_TurnOrderDisplayとChangeEquipBattleの競合を解消します
 * 
 * 【使用方法】
 * プラグインを導入すれば完了です。
 * 
 * 【更新履歴】
 * 1.0.1 2019/02/04 行動順アイコンがポップアップしないときがある不具合を修正。
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
    var pluginName = 'FixTurnOrderWindow';

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
    
//////=============================================================================
///// Scene_Battle
/////  順番表示ウィンドウの描画順序を調整する
/////==============================================================================

    const _Scene_Battle_setupTurnOrderDisplayWindow = Scene_Battle.prototype.setupTurnOrderDisplayWindow;
    Scene_Battle.prototype.setupTurnOrderDisplayWindow = function(win) {
        _Scene_Battle_setupTurnOrderDisplayWindow.apply(this, arguments);
        this.swapChildren(win, this._windowLayer);
    };

//////=============================================================================
///// Window_TurnOrderIcon
/////  YEP_X_TurnOrderDisplayの1ターン目にポップアップが実行されない不具合を修正する。
/////==============================================================================

    //ポップアップすべき高さを初期化しておく
    const _Window_TurnOrderIcon_initialize = Window_TurnOrderIcon.prototype.initialize;
    Window_TurnOrderIcon.prototype.initialize = function() {
        _Window_TurnOrderIcon_initialize.apply(this, arguments);
        this._selectHeight = Math.round(this.contents.height / 4);
    }

})();