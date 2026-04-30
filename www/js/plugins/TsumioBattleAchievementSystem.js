//=============================================================================
// TsumioBattleAchievementSystem.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2019 Tsumio
// 当ファイルの複製・改変・再配布を固く禁じます。
// No reproduction or republication without written permission.
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2019/11/01 巨大ダメージの実績取得が正常におこなえるよう修正。
// 1.0.1 2019/11/01 即死攻撃時にも記録開始するようにした。
// 1.0.0 2019/10/24 公開。
// ----------------------------------------------------------------------------
// [GitHub] : https://github.com/Tsumio/rmmv-plugins
// [Twitter]: https://twitter.com/TsumioNtGame
//=============================================================================

/*:
 * @plugindesc バトル関連の実績システムを実装します。
 * @author ツミオ
 * 
 * @param ----基本的な設定----
 * @desc 
 * @default 
 * 
 * @param 実績取得の設定
 * @desc 実績取得の設定をおこないます。エネミーID・解除実績名・実行したいコモンイベント番号を設定します。
 * @type struct<AchievementSettings>[]
 * @default ["{\"enemyId\":\"1\",\"achievementName\":\"ACH01\",\"commonEventId\":\"0\"}","{\"enemyId\":\"3\",\"achievementName\":\"ACH02\",\"commonEventId\":\"3\"}"]
 * 
 * @param 特大ダメージ時の実績設定
 * @type struct<HugeDamageSettings>
 * @desc 特大ダメージ（デフォルト100万）を与えたときに得られる実績の設定
 * @default {"damage":"1000000","achievementName":"ACH05","commonEventId":"0"}
 * 
 * 
 * @param 金庫の値による実績設定
 * @type struct<SafeSettings>
 * @desc 金庫の値＋Viceを倒したときに得られる実績の設定
 * @default {"variableId":"54","money":"3000000","enemyId":"3","achievementName":"ACH07","commonEventId":"0"}
 * 
 * @help バトル関連の実績システムを実装します。
 * 
 * このプラグインはアクティブゲーミングメディア様向けに制作されたプラグインです。
 * いかなる理由があろうとも、許可されていない場合の複製・改変・再配布を認めません。
 * 
 * 【特徴】
 * ・Steamを介して戦闘時に実績を取得できるようにする
 * ・特定の敵を倒したときに実績を取得
 * ・特定ダメージ以上を出したときに実績取得
 * ・Viceを倒したとき（金庫）に実績取得
 * 
 * 【使用方法】
 * プラグインパラメータを設定してください。
 * プラグインパラメータの値が不正な場合、プラグインは動作しません。
 * 
 * また、以下のプラグインをこのプラグインより上に設置してください。
 * ・BattleRecord.js
 * ・TsumioAchievementSystem.js
 * これらのプラグインを導入していない場合、このプラグインは動作しません。
 * 
 * 【更新履歴】
 * 1.0.2 2019/11/01 巨大ダメージの実績取得が正常におこなえるよう修正。
 * 1.0.1 2019/11/01 即死攻撃時にも記録開始するようにした。
 * 1.0.0 2019/10/24 公開。
 * 
 * 【備考】
 * 当プラグインを利用したことによるいかなる損害に対しても、制作者は一切の責任を負わないこととします。
 * 
 * 【利用規約】
 * いかなる理由があろうとも、許可されていない場合の複製・改変・再配布を認めません。
 * No reproduction or republication without written permission.
 * 
 */
/*~struct~AchievementSettings:
 * 
 * @param enemyId
 * @type enemy
 * @desc エネミーID
 * @default 1
 * 
 * @param achievementName
 * @type string
 * @desc 解除する実績名
 * @default ACH01
 * 
 * @param commonEventId
 * @type number
 * @desc 実行するコモンイベントID
 * @default 0
 * 
 */
/*~struct~HugeDamageSettings:
 * 
 * @param damage
 * @type number
 * @desc 特大ダメージの値
 * @default 1000000
 * 
 * @param achievementName
 * @type string
 * @desc 解除する実績名
 * @default ACH05
 * 
 * @param commonEventId
 * @type number
 * @desc 実行するコモンイベントID
 * @default 0
 * 
 */
/*~struct~SafeSettings:
 * 
 * @param variableId
 * @type number
 * @desc 金庫として使う変数番号
 * @default 54
 * 
 * @param money
 * @type number
 * @desc 金庫として使う変数がこの値以上なら、Vice死亡時に実績取得
 * @default 3000000
 * 
 * @param enemyId
 * @type enemy
 * @desc Viceとして使用するエネミーID
 * @default 3
 * 
 * @param achievementName
 * @type string
 * @desc 解除する実績名
 * @default ACH07
 * 
 * @param commonEventId
 * @type number
 * @desc 実行するコモンイベントID
 * @default 0
 * 
 */

(function() {
    'use strict';
    var pluginName = 'TsumioBattleAchievementSystem';

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

//////=============================================================================
///// 共通の便利関数
/////  
//////=============================================================================

    //プラグインパラメータ用関数。破壊的な動作をするので注意。綺麗じゃない。
    const convertAchievementSettings = function(settings) {
        settings.forEach(x => {
            x.enemyId = Number(x.enemyId);
            x.commonEventId = Number(x.commonEventId);
        });
    };

    //プラグインパラメータ用関数。破壊的な動作をするので注意。綺麗じゃない。
    const convertHugeDamageSettings = function(settings) {
        settings.damage = Number(settings.damage);
        settings.commonEventId = Number(settings.commonEventId);
    };

    //プラグインパラメータ用関数。破壊的な動作をするので注意。綺麗じゃない。
    const convertSafeSettings = function(settings) {
        settings.variableId = Number(settings.variableId);
        settings.money = Number(settings.money);
        settings.enemyId = Number(settings.enemyId);
        settings.commonEventId = Number(settings.commonEventId);
    };

////=============================================================================
//// Get and set pluguin parameters.
////=============================================================================
    var param                          = {};
    //実績取得の設定
    param.achievementSettings  = getParamString(['実績取得の設定', '実績取得の設定']);
    param.achievementSettings  = convertArrayParam(param.achievementSettings);
    convertAchievementSettings(param.achievementSettings);
    //特大ダメージ時の実績設定
    param.hugeDamageSettings  = getParamString(['特大ダメージ時の実績設定', '特大ダメージ時の実績設定']);
    param.hugeDamageSettings  = convertParam(param.hugeDamageSettings);
    convertHugeDamageSettings(param.hugeDamageSettings);
    //金庫の値による実績設定
    param.safeSettings  = getParamString(['金庫の値による実績設定', '金庫の値による実績設定']);
    param.safeSettings  = convertParam(param.safeSettings);
    convertSafeSettings(param.safeSettings);

//////=============================================================================
///// AchievementSettings
/////  補完用に使う静的クラス
//////=============================================================================

    class AchievementSettings {

        /**
         * 実績データを取得する
         * @return {AchievementSettings}
         */
        static fetch(enemyId) {
            return param.achievementSettings.find(x => x.enemyId === enemyId) || null;
        }

        /**
         * エネミーID
         * @return {Number}
         */
        get enemyId() {
            return 0;
        }

        /**
         * コモンイベントID
         * @return {Number}
         */
        get commonEventId() {
            return 0;
        }

        /**
         * 取得実績名
         * @return {String}
         */
        get achievementName() {
            return '';
        }
    }

//////=============================================================================
///// HugeDamageSettings
/////  特大ダメージ用の補完クラス
//////=============================================================================

    class HugeDamageSettings {
        /**
         * 特大ダメージの値
         * @return {Number}
         */
        static get damage() {
            return param.hugeDamageSettings.damage;
        }

        /**
         * 実行するコモンイベントID
         * @return {Number}
         */
        static get commonEventId() {
            return param.hugeDamageSettings.commonEventId;
        }

        /**
         * 取得する実績名 
         * @return {String}
         */
        static get achievementName() {
            return param.hugeDamageSettings.achievementName;
        }
    }

//////=============================================================================
///// SafeSettings
/////  金庫用の補完クラス
//////=============================================================================

    class SafeSettings {
        /**
         * 金庫として使用する変数番号
         * @return {Number}
         */
        static get variableId() {
            return param.safeSettings.variableId;
        }

        /**
         * 金庫として使用する変数の値がmoney以上なら、Vice死亡時に実績取得
         * @return {Number}
         */
        static get money() {
            return param.safeSettings.money;
        }

        /**
         * Viceとして使用するエネミー番号
         * @return {Number}
         */
        static get enemyId() {
            return param.safeSettings.enemyId;
        }

        /**
         * 実行するコモンイベントID
         * @return {Number}
         */
        static get commonEventId() {
            return param.safeSettings.commonEventId;
        }

        /**
         * 取得する実績名 
         * @return {String}
         */
        static get achievementName() {
            return param.safeSettings.achievementName;
        }

        /**
         * 金庫のお金が特定位置以上かどうかチェック
         * @return {Boolean} 
         */
        static isSafeMax() {
            return $gameVariables.value(SafeSettings.variableId) >= SafeSettings.money;
        }
    }

//////=============================================================================
///// Game_BattlerBase
/////  エネミーの死亡数をカウントするとき処理をフックする
//////=============================================================================

    //ここをフックし、実績を取得するようにする
    const _Game_BattlerBase_recordKillEnemyCounter      = Game_BattlerBase.prototype.recordKillEnemyCounter;
    Game_BattlerBase.prototype.recordKillEnemyCounter = function(enemyId) {
        _Game_BattlerBase_recordKillEnemyCounter.apply(this, arguments);
        this.tryGetAchievement(enemyId);
        this.tryGetViceAchievement(enemyId);
    };

    //実績を取得すべきかどうか
    Game_BattlerBase.prototype.isEnemyDefeated = function(enemyId) {
        return this._killEnemyCounter[enemyId] >= 1;
    };

    //必要であれば、実績を取得しようとする
    Game_BattlerBase.prototype.tryGetAchievement = function(enemyId) {
        //敵が一度も倒されてなければ即リターン
        if(!this.isEnemyDefeated(enemyId)) {
            return;
        }

        //実績を解除する
        const achievementData = AchievementSettings.fetch(enemyId);
        if(achievementData) {
            SteamUtils.getAchievement(achievementData.achievementName, achievementData.commonEventId);
        }
    };

    //金庫の値＋Viceを倒したときに取得する実績
    Game_BattlerBase.prototype.tryGetViceAchievement = function(enemyId) {
        //エネミーがViceであるかどうか確認し、違うなら即リターン
        if(!this.isEnemyVice(enemyId)) {
            return;
        }
        //金庫の値が特定値以上であるかどうかチェック。違うなら即リターン
        if(!SafeSettings.isSafeMax()) {
            return;
        }
        //敵が一度も倒されてなければ即リターン
        if(!this.isEnemyDefeated(enemyId)) {
            return;
        }

        //実績を解除する
        SteamUtils.getAchievement(SafeSettings.achievementName, SafeSettings.commonEventId);
    };

    //敵がViceかどうかをチェック
    Game_BattlerBase.prototype.isEnemyVice = function(enemyId) {
        return enemyId === SafeSettings.enemyId;
    };

//////=============================================================================
///// Game_Enemy
/////  即死攻撃時にも記録開始するようにした
//////=============================================================================

    const _Game_Enemy_die      = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function() {
        //HP0以外のときだけ記録するようにすると、HP0でかつ即死攻撃のときに記録しなくなってしまう。
        //二重に記録されるが、BattleRecordの機能を使わないとのことでこのまま
        this.recordKillEnemyCounter(this.getBattlerId());
        this.recordDead();
        _Game_Enemy_die.call(this);
    };

//////=============================================================================
///// Game_Action
/////  最大ダメージを記録するための処理を追加
//////=============================================================================

    //処理をフック
    const _Game_Action_executeDamage      = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        _Game_Action_executeDamage.apply(this, arguments);

        this.tryGetAchievement(value);
    };

    //実績を取得する処理
    Game_Action.prototype.tryGetAchievement = function(value) {
        //アクター以外は無効
        if(!this.subject().isActor()) {
            return;
        }
        //特定ダメージ以上でなければ無効
        if(!this.canGetAchievement(value)) {
            return;
        }

        SteamUtils.getAchievement(HugeDamageSettings.achievementName, HugeDamageSettings.commonEventId);
    };

    //特定ダメージ以上のダメージが出たかどうかをチェック
    Game_Action.prototype.canGetAchievement = function(value) {
        return value >= HugeDamageSettings.damage;
    };


})();