//=============================================================================
// MPP_EquipStatusEX_OP1.js
//=============================================================================
// Copyright (c) 2019 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.1.3】拡張表示をショップのステータスにも反映させます。
 * @author 木星ペンギン
 *
 * @help ▼ 概要
 * --------------------------------
 *  〇 1ページ内に表示される人数が多いほど、表示されるステータスの行数が減ります。
 *     デフォルトの画面サイズでは全部で9行です。
 *     2人の場合は一人4行、3人の場合は一人3行、4人の場合は一人2行となります。
 *  
 *  〇 歩行グラの表示を有効にした場合、グラフィックの幅だけ表示が右にずれます。
 *  
 *  〇 [装備中表示]は同じアイテムを装備している場合に表示されます。
 * 
 *  〇 その他プラグインパラメータで設定する値は[MPP_EquipStatusEX]と同じです。
 * 
 *   > 能力値
 *     0:最大ＨＰ, 1:最大ＭＰ, 2:攻撃力, 3:防御力,
 *     4:魔法力,   5:魔法防御, 6:敏捷性, 7:運,
 *  
 *     8:命中率,      9:回避率,     10:会心率, 11:会心回避率,
 *    12:魔法回避率, 13:魔法反射率, 14:反撃率, 15:ＨＰ再生率,
 *    16:ＭＰ再生率, 17:ＴＰ再生率,
 *  
 *    18:狙われ率,   19:防御効果率,     20:回復効果率,   21:薬の知識,
 *    22:ＭＰ消費率, 23:ＴＰチャージ率, 24:物理ダメージ, 25:魔法ダメージ,
 *    26:床ダメージ, 27:経験獲得率
 *  
 *   > 表示タイプ
 *    0 : 非表示
 *    1 : [固定ステータス]として表示
 *    2 : [装備ステータス]として表示
 *    3 : [変動ステータス]として表示
 *    4 : [装備ステータス]または[変動ステータス]として表示
 * 
 *  
 * ================================================================
 * ▼プラグインパラメータ詳細
 * --------------------------------
 *  〇 プラグインパラメータの配列
 *   数値を配列で設定する際、
 *   n-m と表記することでnからmまでの数値を指定できます。
 *   (例 : 1-4,8,10-12 => 1,2,3,4,8,10,11,12)
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 *
 * @param === Status ===
 * 
 * @param Weapon Fixing Status
 * @desc 武器選択時の固定ステータスの配列
 * @default 2
 * @parent === Status ===
 * 
 * @param Armor Fixing Status
 * @desc 防具選択時の固定ステータスの配列
 * @default 3
 * @parent === Status ===
 * 
 * @param Item Status
 * @desc 変更後のアイテムを選択中、装備品に含まれる場合に表示されるステータス
 * @default 2-7
 * @parent === Status ===
 * 
 * @param Flow Status
 * @desc 変更後のアイテムを選択中、ステータスに変更がある場合に表示されるステータス
 * @default 0-27
 * @parent === Status ===
 * 
 * 
 * @param === Trait ===
 * 
 * @param Element Rate Type
 * @type number
 * @max 4
 * @desc 属性有効度の表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 4
 * @parent === Trait ===
 * 
 * @param Debuff Rate Type
 * @type number
 * @max 4
 * @desc 弱体有効度の表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 4
 * @parent === Trait ===
 * 
 * @param State Rate Type
 * @type number
 * @max 4
 * @desc ステート有効度の表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 4
 * @parent === Trait ===
 * 
 * @param State Resist Type
 * @type number
 * @max 4
 * @desc ステート無効化の表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 3
 * @parent === Trait ===
 * 
 * @param Original Trait Type
 * @type number
 * @max 4
 * @desc オリジナルパラメータの表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 3
 * @parent === Trait ===
 * 
 * 
 * @param === Shop Window ===
 * 
 * @param Members Size
 * @type number
 * @min 1
 * @max 4
 * @desc １ページに表示する人数
 * @default 4
 * @parent === Shop Window ===
 * 
 * @param Actor Name Draw?
 * @type boolean
 * @desc アクターの名前を表示するかどうか
 * @default true
 * @parent === Shop Window ===
 * 
 * @param Character Draw?
 * @type boolean
 * @desc アクターの歩行グラを表示するかどうか
 * @default false
 * @parent === Shop Window ===
 * 
 * @param Current Item Draw?
 * @type boolean
 * @desc 装備中のアイテム名を表示するかどうか
 * @default false
 * @parent === Shop Window ===
 * 
 * @param Equipping Pos
 * @type number
 * @max 2
 * @desc [装備中表示]の表示位置
 * (0:非表示, 1:名前の右, 2:歩行グラに重ねて)
 * @default 1
 * @parent === Shop Window ===
 * 
 * @param Equipping Text
 * @desc 装備中表示
 * @default Ｅ
 * @parent Equipping Pos
 * 
 * @param Equipping Font Size
 * @type number
 * @desc [装備中表示]の文字サイズ
 * @default 24
 * @parent Equipping Pos
 * 
 * @param Equipping Ox
 * @type number
 * @min -99999999
 * @desc [装備中表示]の表示位置 X軸補正
 * @default 0
 * @parent Equipping Pos
 * 
 * @param Equipping Oy
 * @type number
 * @min -99999999
 * @desc [装備中表示]の表示位置 Y軸補正
 * @default 0
 * @parent Equipping Pos
 * 
 * 
 * 
 */

(function() {

const MPPlugin = {};

{
    
    let parameters = PluginManager.parameters('MPP_EquipStatusEX_OP1');
    
    MPPlugin.contains = {};
    MPPlugin.contains['EquipStatusEX'] = $plugins.some(function(plugin) {
        return (plugin.name === 'MPP_EquipStatusEX' && plugin.status);
    });
    
    function convertParam(name) {
        var param = parameters[name];
        var result = [];
        if (param) {
            var data = param.split(',');
            for (var i = 0; i < data.length; i++) {
                if (/(\d+)\s*-\s*(\d+)/.test(data[i])) {
                    var min = Number(RegExp.$1);
                    var max = Number(RegExp.$2);
                    for (var n = min; n <= max; n++) {
                        result.push(n);
                    }
                } else {
                    result.push(Number(data[i]));
                }
            }
        }
        return result;
    };

    // Status
    MPPlugin.WeaponFixingStatus = convertParam('Weapon Fixing Status');
    MPPlugin.ArmorFixingStatus = convertParam('Armor Fixing Status');
    MPPlugin.itemStatus = convertParam('Item Status');
    MPPlugin.flowStatus = convertParam('Flow Status');

    // Traits
    MPPlugin.elementRateType = Number(parameters['Element Rate Type'] || 4);
    MPPlugin.debuffRateType = Number(parameters['Debuff Rate Type'] || 4);
    MPPlugin.stateRateType = Number(parameters['State Rate Type'] || 4);
    MPPlugin.stateResistType = Number(parameters['State Resist Type'] || 3);
    MPPlugin.OriginalTraitType = Number(parameters['Original Trait Type'] || 3);

    // Shop Status
    MPPlugin.MembersSize = Number(parameters['Members Size'] || 4);
    MPPlugin.ActorNameDraw = !!eval(parameters['Actor Name Draw?']);
    MPPlugin.CharacterDraw = !!eval(parameters['Character Draw?']);
    MPPlugin.CurrentItemDraw = !!eval(parameters['Current Item Draw?']);
    MPPlugin.EquippingPos = Number(parameters['Equipping Pos'] || 0);
    MPPlugin.EquippingFontSize = Number(parameters['Equipping Font Size'] || 24);
    MPPlugin.EquippingOx = Number(parameters['Equipping Ox'] || 0);
    MPPlugin.EquippingOy = Number(parameters['Equipping Oy'] || 0);

    // Terms
    MPPlugin.terms = {};
    MPPlugin.terms.Equipping = parameters['Equipping Text'];
    
};

if (!MPPlugin.contains['EquipStatusEX']) {
    return;
}

const Alias = {};

//-----------------------------------------------------------------------------
// Window_ShopStatus

Window_ShopStatus._directionPattern = [2, 4, 8, 6];

//14
Alias.WiShSt_initialize = Window_ShopStatus.prototype.initialize;
Window_ShopStatus.prototype.initialize = function(x, y, width, height) {
    this._createDrawer = false;
    this._mppEqStGaugeCount = 0;
    this._animeCount = 0;
    this._animeIndex = 0;
    this._animePattern = 0;
    Alias.WiShSt_initialize.apply(this, arguments);
};

//21
Alias.WiShSt_refresh = Window_ShopStatus.prototype.refresh;
Window_ShopStatus.prototype.refresh = function() {
    this.clearUpdateDrawer();
    this._createDrawer = true;
    this._mppEqStGaugeCount = 28;
    Alias.WiShSt_refresh.apply(this, arguments);
    this._createDrawer = false;
};

Window_ShopStatus.prototype.currentSlotId = function(actor, etypeId, item) {
    var equips = actor.equips();
    var slots = actor.equipSlots();
    for (var i = 0; i < slots.length; i++) {
        if (slots[i] === etypeId && equips[i] === item) return i;
    }
    return -1;
};

//50
Window_ShopStatus.prototype.drawEquipInfo = function(x, y) {
    var members = this.statusMembers();
    var itemHeight = this.itemHeight();
    for (var i = 0; i < members.length; i++) {
        this.drawActorEquipInfo(x, y + itemHeight * i, members[i]);
    }
};

//63
Window_ShopStatus.prototype.pageSize = function() {
    return MPPlugin.MembersSize;
};

Window_ShopStatus.prototype.itemHeight = function() {
    return (this.contentsHeight() - this.lineHeight() * 2) / this.pageSize();
};

//71
Window_ShopStatus.prototype.drawActorEquipInfo = function(x, y, actor) {
    this._enabled = actor.canEquip(this._item);
    
    var height = this.lineHeight();
    var maxRow = Math.floor(this.itemHeight() / height);
    var row = 0;
    
    this._actor = actor;
    this._tempActor = JsonEx.makeDeepCopy(actor);
    var curItem = null;
    if (this._enabled)
        curItem = this.currentEquippedItem(actor, this._item.etypeId);
    this._equippng = (curItem === this._item);
    if (!this._equippng) {
        var slotId = this.currentSlotId(actor, this._item.etypeId, curItem);
        if (slotId >= 0) this._tempActor.forceChangeEquip(slotId, this._item);
    }
    
    if (MPPlugin.CharacterDraw) {
        this.drawActorCharacter(this._tempActor || this._actor, x + 24, y + 48);
        x += 48;
    }
    this.changePaintOpacity(this._enabled);
    this.resetTextColor();
    if (MPPlugin.ActorNameDraw) {
        var width = this.contentsWidth() - x - this.textPadding();
        this.drawActorName(actor, x, y + row * height, width);
        row++;
        if (!MPPlugin.CharacterDraw) x += 24;
    }
    if (this._enabled && row < maxRow) {
        if (MPPlugin.CurrentItemDraw) {
            this.drawItemName(curItem, x, y + row * height);
            row++;
        }
        if (row < maxRow)
            this.drawParameters(x, y + row * height, maxRow - row);
    }
};

Window_ShopStatus.prototype.drawEquipping = function(x, y, width) {
    var text = MPPlugin.terms.Equipping;
    if (text) {
        this.changeTextColor(this.systemColor());
        this.contents.fontSize = MPPlugin.EquippingFontSize;
        this.drawText(text, x, y, width, 'right');
        this.contents.fontSize = this.standardFontSize();
    }
};

//
Window_ShopStatus.prototype.drawCharacter = function(characterName, characterIndex, x, y) {
    var bitmap = ImageManager.loadCharacter(characterName);
    var big = ImageManager.isBigCharacter(characterName);
    var pw = bitmap.width / (big ? 3 : 12);
    var ph = bitmap.height / (big ? 4 : 8);
    var n = characterIndex;
    var p = this._animePattern % 4;
    p = (p < 3 ? p : 1);
    var d = Window_ShopStatus._directionPattern[this._animeIndex];
    d = (d - 2) / 2;
    var sx = (n % 4 * 3 + p) * pw;
    var sy = (Math.floor(n / 4) * 4 + d) * ph;
    var rate = 1.0;
    this.contents.blt(bitmap, sx, sy, pw, ph,
                        x - pw * rate / 2, y - ph * rate, pw * rate, ph * rate);
};

//
Window_ShopStatus.prototype.drawActorCharacter = function(actor, x, y) {
    var pattern = this._animePattern;
    if (!this._enabled) this._animePattern = 1;
    this.changePaintOpacity(this._enabled);
    Window_Base.prototype.drawActorCharacter.call(this, actor, x, y);
    this._animePattern = pattern;
    this.changePaintOpacity(true);
    if (this._equippng && MPPlugin.EquippingPos === 2) {
        var height = this.lineHeight();
        var sy = Math.floor((height - MPPlugin.EquippingFontSize) / 2);
        this.drawEquipping(x - 24, y - height + sy, 48);
    }
    
    if (this._createDrawer) {
        this.createActorCharacterDrawer(actor, x, y, this._enabled, this._equippng);
    }
};

Window_ShopStatus.prototype.createActorCharacterDrawer = function(actor, x, y, enabled, equippng) {
    this.addUpdateDrawer(() => {
        if (this._animeCount === 0) {
            this.contents.clearRect(x - 24, y - 48, 48, 48);
            this._enabled = enabled;
            this._equippng = equippng;
            this.drawActorCharacter(actor, x, y);
        }
        return true;
    });
};

//
Window_ShopStatus.prototype.drawActorName = function(actor, x, y, width) {
    Window_Base.prototype.drawActorName.call(this, actor, x, y, width);
    if (this._equippng && MPPlugin.EquippingPos === 1) {
        this.drawEquipping(x, y, width);
    }
};

//117
Alias.WiShSt_update = Window_ShopStatus.prototype.update;
Window_ShopStatus.prototype.update = function() {
    if (this._mppEqStGaugeCount > 0) this._mppEqStGaugeCount--;
    if (MPPlugin.CharacterDraw && this.isEquipItem()) {
        this.updateAnime();
    }
    Alias.WiShSt_update.apply(this, arguments);
};

Window_ShopStatus.prototype.updateAnime = function() {
    this._animeCount++;
    if (this._animeCount === 24) {
        this._animeCount = 0;
        this._animePattern++;
        if (this._animePattern === 8) {
            this._animePattern = 0;
            this._animeIndex = (this._animeIndex + 1) % 4;
        }
    }
};

//EqStEX
Window_ShopStatus.prototype.convertList = function(list, type) {
    return list.map( id => ({ type:type, value:id,
                    actor:this._actor, tempActor:this._tempActor }) );
};

//EqStEX
Window_ShopStatus.prototype.getFixingStatus = function() {
    if (DataManager.isWeapon(this._item)) {
        return MPPlugin.WeaponFixingStatus;
    } else {
        return MPPlugin.ArmorFixingStatus;
    }
};
Window_ShopStatus.prototype.getItemStatus = function() {
    return MPPlugin.itemStatus;
};
Window_ShopStatus.prototype.getFlowStatus = function() {
    return MPPlugin.flowStatus;
};
Window_ShopStatus.prototype.getElementRateType = function() {
    return MPPlugin.elementRateType;
};
Window_ShopStatus.prototype.getDebuffRateType = function() {
    return MPPlugin.debuffRateType;
};
Window_ShopStatus.prototype.getStateRateType = function() {
    return MPPlugin.stateRateType;
};
Window_ShopStatus.prototype.getStateResistType = function() {
    return MPPlugin.stateResistType;
};
Window_ShopStatus.prototype.getOriginalTraitType = function() {
    return MPPlugin.OriginalTraitType;
};

Window_ShopStatus.prototype.drawItem = function(x, y, data) {
    this._actor = data.actor;
    this._tempActor = data.tempActor;
    this.changePaintOpacity(true);
    Window_EquipStatus.prototype.drawItem.call(this, x, y, data)
};

{
    
    let ShopStatus = Window_ShopStatus.prototype;
    let EquipStatus = Window_EquipStatus.prototype;
    
    ShopStatus.drawRightArrow = EquipStatus.drawRightArrow;
    
    ShopStatus.drawParameters = EquipStatus.drawParameters;
    ShopStatus.makeStatusList = EquipStatus.makeStatusList;
    ShopStatus.createEquipParamsList = EquipStatus.createEquipParamsList;
    ShopStatus.isChangedParam = EquipStatus.isChangedParam;
    ShopStatus.isChangedRate = EquipStatus.isChangedRate;
    ShopStatus.createElementRateList = EquipStatus.createElementRateList;
    ShopStatus.createDebuffRateList = EquipStatus.createDebuffRateList;
    ShopStatus.createStateRateList = EquipStatus.createStateRateList;
    ShopStatus.createStateResistList = EquipStatus.createStateResistList;
    ShopStatus.createOriginalTraitList = EquipStatus.createOriginalTraitList;
    ShopStatus.createDefaultParamsList = EquipStatus.createDefaultParamsList;
    
    ShopStatus.createItemDrawer = EquipStatus.createItemDrawer;
    
    ShopStatus.drawParamGauge = EquipStatus.drawParamGauge;
    ShopStatus.drawFlatGauge = EquipStatus.drawFlatGauge;
    ShopStatus.drawFlatLine = EquipStatus.drawFlatLine;
    ShopStatus.drawFlatShadow = EquipStatus.drawFlatShadow;
    ShopStatus.drawArcGauge = EquipStatus.drawArcGauge;
    ShopStatus.drawArcLine = EquipStatus.drawArcLine;
    ShopStatus.drawArcShadow = EquipStatus.drawArcShadow;
    ShopStatus.draw2LineGauge = EquipStatus.draw2LineGauge;
    
    ShopStatus.drawParam = EquipStatus.drawParam;
    ShopStatus.drawParamName = EquipStatus.drawParamName;
    ShopStatus.drawCurrentParam = EquipStatus.drawCurrentParam;
    ShopStatus.drawNewParam = EquipStatus.drawNewParam;
    ShopStatus.includeParam = EquipStatus.includeParam;
    ShopStatus.includeTrait = EquipStatus.includeTrait;
    ShopStatus.includeRate = EquipStatus.includeRate;
    ShopStatus.getActorParam = EquipStatus.getActorParam;
    ShopStatus.getParamMax = EquipStatus.getParamMax;
    ShopStatus.drawElement = EquipStatus.drawElement;
    ShopStatus.drawDebuff = EquipStatus.drawDebuff;
    ShopStatus.drawState = EquipStatus.drawState;
    ShopStatus.drawRate = EquipStatus.drawRate;
    ShopStatus.drawResist = EquipStatus.drawResist;
    ShopStatus.drawOriginal = EquipStatus.drawOriginal;
    ShopStatus.drawTraitText = EquipStatus.drawTraitText;
    
}


})();