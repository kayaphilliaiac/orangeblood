//=============================================================================
// ItemLockSystem.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2019 Tsumio
// 当ファイルの複製・改変・再配布を固く禁じます。
// No reproduction or republication without written permission.
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2019/03/11 公開。
// ----------------------------------------------------------------------------
// [GitHub] : https://github.com/Tsumio/rmmv-plugins
// [Blog]   : http://ntgame.wpblog.jp/
// [Twitter]: https://twitter.com/TsumioNtGame
//=============================================================================

/*:ja
 * @plugindesc アイテムの売買の可否を管理するプラグイン。
 * @author ツミオ
 * 
 * 
 * @help アイテムの売買の可否を管理するプラグイン。
 * 
 * このプラグインはアクティブゲーミングメディア様向けに制作されたプラグインです。
 * いかなる理由があろうとも、許可されていない場合の複製・改変・再配布を認めません。
 * 
 * 【特徴】
 * ・アイテムの売買の可否を設定できるようになります
 * ・武器・防具も同様に可能です
 * 
 * 【使用方法】
 * プラグインの導入後、ロックしたいアイテムのメモ欄（データベース）に以下のように書きます。
 * <lockItem:true>
 * 
 * この機能はアイテム・武器・防具に対して使用可能です。
 * 
 * 【更新履歴】
 * 1.0.0 2019/03/11 公開。
 * 
 * 【備考】
 * 当プラグインを利用したことによるいかなる損害に対しても、制作者は一切の責任を負わないこととします。
 * 
 * 【利用規約】
 * いかなる理由があろうとも、許可されていない場合の複製・改変・再配布を認めません。
 * No reproduction or republication without written permission.
 * 
 */

(function() {
    'use strict';
    var pluginName = 'ItemLockSystem';

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


////=============================================================================
//// 共通の便利関数
////  
////==============================================================================

    

////=============================================================================
//// Window_ShopSell
////  アイテムの売買可否を管理する
////=============================================================================

    const _Window_ShopSell_isEnabled = Window_ShopSell.prototype.isEnabled;
    Window_ShopSell.prototype.isEnabled = function(item) {
        const result = _Window_ShopSell_isEnabled.apply(this, arguments);
        if(item.originalBaseItemId) {
            const originalItem = this.fetchOriginalItem(item);
            return result && !originalItem.meta['lockItem'];
        }
        return result && !item.meta['lockItem'];
    };

    //オリジナルのアイテムを取得する
    Window_ShopSell.prototype.fetchOriginalItem = function(item) {
        switch (this._category) {
            case 'item':
                return $dataItems[item.originalBaseItemId];
            case 'weapon':
                return $dataWeapons[item.originalBaseItemId];
            case 'armor':
                return $dataArmors[item.originalBaseItemId];
            }
    }


})();