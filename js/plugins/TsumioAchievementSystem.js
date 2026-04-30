//=============================================================================
// TsumioAchievementSystem.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2019 Tsumio
// 当ファイルの複製・改変・再配布を固く禁じます。
// No reproduction or republication without written permission.
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2019/03/21 公開。
// ----------------------------------------------------------------------------
// [GitHub] : https://github.com/Tsumio/rmmv-plugins
// [Blog]   : http://ntgame.wpblog.jp/
// [Twitter]: https://twitter.com/TsumioNtGame
//=============================================================================

/*:ja
 * @plugindesc Steamの実績機能を使用するためのプラグイン。
 * @author ツミオ
 * 
 * @param ----基本的な設定----
 * @desc 
 * @default 
 * 
 * 
 * @help Steamの実績機能を使用するためのプラグイン。
 * 
 * このプラグインはアクティブゲーミングメディア様向けに制作されたプラグインです。
 * いかなる理由があろうとも、許可されていない場合の複製・改変・再配布を認めません。
 * 
 * 【特徴】
 * ・Steamの実績機能を使用できるようにします
 * ・Steamから起動していない場合は単に無視されます
 * 
 * 【使用方法】
 * 1．プラグインを導入する
 * 2．Steam側で実績を登録する(「API名」を当プラグインで使用します）
 * 3．greenworksを導入する
 * 4．index.htmlを編集する
 * 5．スクリプトコマンドからスクリプトを実行する
 * 
 * なお前提として、Steamworks SDKは導入済みとします。
 * 
 * 【GreenWorksの導入方法】
 * GitHubからGreenWorksを落としてきます。
 * https://github.com/greenheartgames/greenworks/releases
 * 種類がいくつかありますが「greenworks-v0.13.0-nw-v0.29.4-win-ia32」を利用します。
 * DL後、解凍した中身をゲームプロジェクトが存在するフォルダ（通常はGame.rpgprojectがあるフォルダ）に配置します。
 * 
 * 【index.htmlの編集】
 * ゲームプロジェクトフォルダに存在するindex.htmlを開きます。
 * <script type="text/javascript" src="js/main.js"></script>
 * の1行下に
 * <script type="text/javascript" src="./greenworks.js"></script>
 * を挿入します。
 * 
 * 【スクリプトコマンド】
 * 以下のスクリプトコマンドで実績を取得できます。
 * SteamUtils.getAchievement('API名', 実行したいコモンイベント番号);
 * 
 * 例えばSteam側で用意しておいた「API名」が「hasMasterSword」で
 * 実績取得時にコモンイベント10番を同時に実行したい場合は以下のように書きます。
 * SteamUtils.getAchievement('hasMasterSword', 10);
 * 
 * コモンイベントを実行したくない場合は第二引数に0を指定してください。
 * すなわち、以下のようになります。
 * SteamUtils.getAchievement('hasMasterSword', 0);
 * 
 * 【注意点】
 * ユーザーがすでに実績を取得していた場合に再度同じ実績を取得した場合、コモンイベントは実行されません。
 * セーブデータごとに実績が保存されるわけではなく、SteamIDごとに実績が保存されることに注意してください。
 * 必要であれば全セーブデータで共通する変数値の保存機能を持つプラグインを使用することをお勧めします。
 * 
 * また、上記の性質から、コモンイベントは「Steamの実績を取得した」ことを示すコモンイベントを実行することを想定しています。
 * セーブデータごとに実行すべきコモンイベントイベントを登録しないでください。
 * すなわち、セーブデータごとに実行すべきアトミックな処理については
 * 例えばツクールイベント内の条件分岐の中に書くようにします。
 * 少なくとも、本プラグインのコモンイベント呼び出し機能を介さないよう注意してください。
 * 
 * 【更新履歴】
 * 1.0.0 2019/03/21 公開。
 * 
 * 【備考】
 * 当プラグインを利用したことによるいかなる損害に対しても、制作者は一切の責任を負わないこととします。
 * 
 * 【利用規約】
 * いかなる理由があろうとも、許可されていない場合の複製・改変・再配布を認めません。
 * No reproduction or republication without written permission.
 * 
 */

////=============================================================================
//// 初期化用処理
////  Steam用の初期化処理を実行する
////==============================================================================

try {
    var steamApiValid = true;
    greenworks.init();
    var cSteamId      = greenworks ? greenworks.getSteamId() : 0;
    var steamUserName = greenworks ? cSteamId.screenName : 'None';
}catch(e) {
    //テスト時はSteamAPIの初期化ができないので、ここで握りつぶしている。
    var steamApiValid = false;
}


////=============================================================================
//// SteamUtils
////  SteamAPI用の処理
////==============================================================================
class SteamUtils {
    static get canUse() {
        return Utils.isInvokedBySteam();
    }

    /**
     * すでに取得済みでない場合のみ、実績を取得する
     * @param {String} achievement Steam側で宣言されている実績名
     * @param {Number} comonEventId 実績取得時に実行したいコモンイベントID
     */
    static getAchievement(achievement, comonEventId) {
        if(!this.canUse) {
            return;
        }

        greenworks.getAchievement(achievement, isAchieved => {
            if (isAchieved) {
                return;
            }

            greenworks.activateAchievement(achievement, () => {
                if(comonEventId > 0) {
                    $gameTemp.reserveCommonEvent(comonEventId);
                }
            });
        });
    }
}

(function() {
    'use strict';
    var pluginName = 'TsumioAchievementSystem';
    

////=============================================================================
//// Local function
////  These functions checks & formats pluguin's command parameters.
////  I borrowed these functions from Triacontane.Thanks!
////==============================================================================
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
//// Utils
////  Steamから起動されたことをチェックする機能を追加
////==============================================================================

    //Steamから起動されたかどうか
    Utils.isInvokedBySteam = function() {
        return steamApiValid;
    };

})();