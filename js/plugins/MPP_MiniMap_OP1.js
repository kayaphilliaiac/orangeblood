//=============================================================================
// MPP_MiniMap_OP1.js
//=============================================================================
// Copyright (c) 2019 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.1.7】近くを通ったことのある範囲のみ、ミニマップに標示します。
 * @author 木星ペンギン
 * 
 * @help プラグインコマンド:
 *   SetMappingRadius r           # マッピング半径をrに設定
 *   FillMapping mapId x y r      # 座標(x,y)を中心に半径rマスをマッピング
 *   MappingImg mapId mode        # マッピング画像を使用するかどうか
 *   MappingEvent mapId mode      # イベントマーカーを表示する範囲
 *   ClearMapping mapId           # 指定したマップのマッピング情報を初期化
 *   
 * スクリプト全般:
 *   $gameMinimap.isFilled(x, y)  # 座標(x,y)がマッピングされているかどうか
 * 
 * ================================================================
 * ▼ プラグインコマンド 詳細
 * --------------------------------
 *  〇 プラグインコマンド全般
 *   指定する値には変数が使用できます。
 *   v[n] と記述することでn番の変数の値を参照します。
 * 
 * --------------------------------
 *  〇 FillMapping mapId x y r
 *       mapId : マップID(0で現在のマップ)
 *       x     : 中心X座標
 *       y     : 中心Y座標
 *       r     : 半径(マス)
 *  
 *   座標(x,y)を中心に半径rマスをマッピングします。
 *   マッピングを行えるのは、ミニマップとして表示したことのあるマップのみです。
 * 
 * --------------------------------
 *  〇 MappingImg mapId mode
 *       mapId : マップID(0で現在のマップ)
 *       mode  : 0:マッピング画像, 1:通常
 *   
 *   マッピング中の画像か通常のミニマップ画像かを切り替えます。
 *   画像が切り替わるだけで、内部ではマッピングを行っています。
 *   modeのデフォルト値は0です。
 * 
 * --------------------------------
 *  〇 MappingEvent mapId mode
 *       mapId : マップID(0で現在のマップ)
 *       mode  : 0:マッピングした範囲, 1:全て
 *   
 *   イベントのマーカーアイコンの表示範囲を変更します。
 *   乗り物とマーキングは全て表示されます。
 *   modeのデフォルト値は0です。
 *  
 * --------------------------------
 *  〇 Plugin Commands
 * 
 *   プラグインコマンド名を変更できます。
 *   コマンドを短くしたり日本語化等が可能です。
 *   
 *   コマンド名を変更してもデフォルトのコマンドは使用できます。
 * 
 * 
 * ================================================================
 * ▼ スクリプト全般 詳細
 * --------------------------------
 *  〇 $gameMinimap.isFilled(x, y)
 *       x : X座標
 *       y : Y座標
 *   
 *   現在表示されているミニマップの座標(x,y)がマッピングされているかどうかを
 *   取得します。
 * 
 * 
 * ================================
 * ▼ 補足
 *  マッピング情報はマップのサイズが変更されると初期化されます。
 * 
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param Default Mapping Radius
 * @type number
 * @desc マッピング半径のデフォルト値
 * @default 10
 *
 * @param Out Color
 * @desc マッピングしていない範囲の色
 * @default 0,0,0,0.375
 *
 * @param === Command ===
 * @default === コマンド関連 ===
 * 
 * @param Plugin Commands
 * @type struct<Plugin>
 * @desc プラグインコマンド名
 * @default {"SetMappingRadius":"SetMappingRadius","FillMapping":"FillMapping","MappingImg":"MappingImg","MappingEvent":"MappingEvent","ClearMapping":"ClearMapping"}
 * @parent === Command ===
 * 
 * 
 */

/*~struct~Plugin:
 * @param SetMappingRadius
 * @desc マッピング半径をrに設定
 * @default SetMappingRadius
 *
 * @param FillMapping
 * @desc 座標(x,y)を中心に半径rマスをマッピング
 * @default FillMapping
 *
 * @param MappingImg
 * @desc マッピング画像を使用するかどうか
 * @default MappingImg
 *
 * @param MappingEvent
 * @desc イベントマーカーを表示する範囲
 * @default MappingEvent
 *
 * @param ClearMapping
 * @desc 指定したマップのマッピング情報を初期化
 * @default ClearMapping
 *
 */

function Minimap_Table() {
    this.initialize.apply(this, arguments);
}

(function() {

var MPPlugin = {};

(function() {
    
    var parameters = PluginManager.parameters('MPP_MiniMap_OP1');
    
    MPPlugin.contains = {};
    MPPlugin.contains['Minimap'] = $plugins.some(function(plugin) {
        return (plugin.name === 'MPP_MiniMap' && plugin.status);
    });
    
    MPPlugin.DefaultMappingRadius = Number(parameters['Default Mapping Radius'] || 10);
    MPPlugin.OutColor = 'rgba(%1)'.format(parameters['Out Color'] || '0,0,0,0.375');
    
    MPPlugin.PluginCommands = JSON.parse(parameters['Plugin Commands']);
    
})();

if (!MPPlugin.contains['Minimap']) {
    alert('MPP_MiniMap プラグインが導入されていません。\nMPP_MiniMap_OP1 は機能しません。');
    return;
}

var Alias = {};

//-----------------------------------------------------------------------------
// MPPlugin

MPPlugin.compress = function(array) {
    var lastValue = array[0] || 0;
    var result = [];
    for (var i = 1; i < array.length; i++) {
        var value = array[i] || 0;
        if (lastValue !== value) {
            result.push(i, lastValue);
            lastValue = value;
        }
    }
    result.push(array.length, lastValue);
    return result;
};

MPPlugin.decompress = function(array) {
    var result = [];
    while (array.length > 0) {
        var i = array.shift();
        var value = array.shift();
        while (result.length < i) {
            result.push(value);
        }
    }
    return result;
};

//-----------------------------------------------------------------------------
// Minimap_Table

Minimap_Table.prototype.initialize = function(minimap) {
    this.width = minimap.width();
    this.height = minimap.height();
    this.loopHorizontal = minimap.isLoopHorizontal();
    this.loopVertical = minimap.isLoopVertical();
    this._table = [];
    this._compress = false;
};

Minimap_Table.prototype.isEnabled = function(minimap) {
    return this.width === minimap.width() && this.height === minimap.height();
};

Minimap_Table.prototype.value = function(x, y) {
    if (x >= this.width) return 0;
    this.decompress();
    return this._table[y * this.width + x] || 0;
};

Minimap_Table.prototype.setValue = function(x, y, value) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.decompress();
        this._table[y * this.width + x] = value;
    }
};

Minimap_Table.prototype.compress = function() {
    if (!this._compress) {
        this._table = MPPlugin.compress(this._table);
        this._compress = true;
    }
};

Minimap_Table.prototype.decompress = function() {
    if (this._compress) {
        this._table = MPPlugin.decompress(this._table);
        this._compress = false;
    }
};

//-----------------------------------------------------------------------------
// DataManager

//425
Alias.DaMa_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    $gameMinimap.compress();
    return Alias.DaMa_makeSaveContents.apply(this, arguments);
};

//-----------------------------------------------------------------------------
// Game_MiniMap

//522
Alias.GaMiMa_initialize = Game_MiniMap.prototype.initialize;
Game_MiniMap.prototype.initialize = function() {
    Alias.GaMiMa_initialize.call(this);
    this._mappingTables = {};
    this.mapOpenFlag = {};
    this.eventOpenFlag = {};
    this.drawPos = [];
    this.mappingRadius = MPPlugin.DefaultMappingRadius;
};

Game_MiniMap.prototype.compress = function() {
    for (var mapId in this._mappingTables) {
        this._mappingTables[mapId].compress();
    }
};

//648
Alias.GaMiMa_onMinimapLoaded = Game_MiniMap.prototype.onMinimapLoaded;
Game_MiniMap.prototype.onMinimapLoaded = function() {
    Alias.GaMiMa_onMinimapLoaded.call(this);
    var table = this._mappingTables[this.mapId];
    if (!table || !table.isEnabled(this)) {
        this.clearMapping(this.mapId);
    }
    $gamePlayer.onMapping();
};

Game_MiniMap.prototype.mapping = function(mapId, x, y, r) {
    mapId = mapId || $gameMap.mapId();
    var table = this._mappingTables[mapId];
    if (!table || r <= 0) return;
    var width = table.width;
    var height = table.height;
    var topX = Math.floor(x - r - 1);
    var bottomX = Math.ceil(x + r + 1);
    if (!table.loopHorizontal) {
        topX = Math.max(topX, 0);
        bottomX = Math.min(bottomX, width - 1);
    }
    var topY = Math.floor(y - r - 1);
    var bottomY = Math.ceil(y + r + 1);
    if (!table.loopVertical) {
        topY = Math.max(topY, 0);
        bottomY = Math.min(bottomY, height - 1);
    }
    for (var dx = topX; dx <= bottomX; dx++) {
        var rx = dx.mod(width);
        for (var dy = topY; dy <= bottomY; dy++) {
            var ry = dy.mod(height);
            var value = Math.floor(4 * (r - 1 - Math.hypot(x - dx, y - dy)));
            value = Math.min(value, 8);
            if (table.value(rx, ry) < value) {
                table.setValue(rx, ry, value);
                this.drawPos.push(ry * width + rx);
            }
        }
    }
    if ($gameMap.mapId() !== this.mapId) {
        this.drawPos.length = 0;
    }
};

Game_MiniMap.prototype.isOpenMap = function() {
    return (this.mapOpenFlag[this.mapId] || 0) > 0;
};

Game_MiniMap.prototype.isOpenEvent = function() {
    return (this.eventOpenFlag[this.mapId] || 0) > 0;
};

Game_MiniMap.prototype.clearMapping = function(mapId) {
    if (this.mapId === mapId && $dataMinimap) {
        this._mappingTables[mapId] = new Minimap_Table(this);
    } else {
        delete this._mappingTables[mapId];
    }
};

Game_MiniMap.prototype.isFilled = function(x, y) {
    return this.getOpacity(this.mapId, x, y) >= 192;
};

Game_MiniMap.prototype.getOpacity = function(mapId, x, y) {
    var table = this._mappingTables[mapId || this.mapId];
    return (table ? table.value(x, y) * 32 : 0);
};

//-----------------------------------------------------------------------------
// Game_Player

//162
Alias.GaPl_locate = Game_Player.prototype.locate;
Game_Player.prototype.locate = function(x, y) {
    Alias.GaPl_locate.apply(this, arguments);
    this.onMapping();
};

//172
Alias.GaPl_increaseSteps = Game_Player.prototype.increaseSteps;
Game_Player.prototype.increaseSteps = function() {
    Alias.GaPl_increaseSteps.apply(this, arguments);
    this.onMapping();
};

Game_Player.prototype.onMapping = function() {
    $gameMinimap.mapping(0, this._x, this._y, $gameMinimap.mappingRadius);
};

//-----------------------------------------------------------------------------
// Game_Event

Alias.GaEv_marker = Game_Event.prototype.marker;
Game_Event.prototype.marker = function() {
    var result = Alias.GaEv_marker.apply(this, arguments);
    if (result >= 0 && ($gameMinimap.isOpenEvent() ||
            $gameMinimap.isFilled(this._x, this._y))) {
        return result;
    } else {
        return 0;
    }
};

//-----------------------------------------------------------------------------
// Game_Interpreter

//1722
Alias.GaIn_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Alias.GaIn_pluginCommand.apply(this, arguments);
    var args2 = args.map(function(arg) {
        return arg.replace(/v\[(\d+)\]/g, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        });
    });
    switch (command) {
        case MPPlugin.PluginCommands.SetMappingRadius:
        case 'SetMappingRadius':
            $gameMinimap.mappingRadius = eval(args2[0]);
            break;
        case MPPlugin.PluginCommands.FillMapping:
        case 'FillMapping':
            for (var i = 0; i < args2.length; i++) {
                args2[i] = eval(args2[i]);
            }
            $gameMinimap.mapping(args2[0], args2[1], args2[2], args2[3]);
            break;
        case MPPlugin.PluginCommands.MappingImg:
        case 'MappingImg':
            var mapId = eval(args2[0]) || $gameMap.mapId();
            $gameMinimap.mapOpenFlag[mapId] = eval(args2[1]);
            break;
        case MPPlugin.PluginCommands.MappingEvent:
        case 'MappingEvent':
            var mapId = eval(args2[0]) || $gameMap.mapId();
            $gameMinimap.eventOpenFlag[mapId] = eval(args2[1]);
            $gameMinimap.requestMarker = true;
            break;
        case MPPlugin.PluginCommands.ClearMapping:
        case 'ClearMapping':
            var mapId = eval(args2[0]) || $gameMap.mapId();
            $gameMinimap.clearMapping(mapId);
            $gameMinimap.requestMarker = true;
            break;
    }
};

//-----------------------------------------------------------------------------
// Sprite_MiniMap

//875
Alias.SpMiMa_isReady = Sprite_MiniMap.prototype.isReady;
Sprite_MiniMap.prototype.isReady = function() {
    return Alias.SpMiMa_isReady.call(this) && this._mappingCreated;
};

//883
Alias.SpMiMa_onMinimapLoaded = Sprite_MiniMap.prototype.onMinimapLoaded;
Sprite_MiniMap.prototype.onMinimapLoaded = function() {
    Alias.SpMiMa_onMinimapLoaded.call(this);
    var baseBitmap = this._baseBitmap;
    this._mappingBitmap = new Bitmap(baseBitmap.width, baseBitmap.height);
    this._openMap = $gameMinimap.isOpenMap();
    this.redrawMappingMinimap();
};

//888
Alias.SpsetMiMa_update = Sprite_MiniMap.prototype.update;
Sprite_MiniMap.prototype.update = function() {
    Alias.SpsetMiMa_update.call(this);
    if (!this.visible) return;
    if (this._openMap !== $gameMinimap.isOpenMap()) {
        this._openMap = $gameMinimap.isOpenMap();
        this.redrawMappingMinimap();
    } else if (!this._openMap) {
        var drawPos = $gameMinimap.drawPos;
        if (drawPos.length === 0) return;
        var width = $gameMinimap.width();
        for (var i = 0; i < drawPos.length; i++) {
            var n = drawPos[i];
            this.drawMapping(n % width, Math.floor(n / width));
        }
        drawPos.length = 0;
    }
};

Sprite_MiniMap.prototype.redrawMappingMinimap = function() {
    this._mappingCreated = false;
    setTimeout(this.drawAllMapping.bind(this), 1);
};

Sprite_MiniMap.prototype.drawAllMapping = function() {
    if (this._openMap) {
        this._miniMapSprite.bitmap = this._baseBitmap;
    } else {
        this._mappingBitmap.fillAll(MPPlugin.OutColor);
        var width = $gameMinimap.width();
        var height = $gameMinimap.height();
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                this.drawMapping(x, y);
            }
        }
        this._miniMapSprite.bitmap = this._mappingBitmap;
    }
    $gameMinimap.drawPos.length = 0;
    this._mappingCreated = true;
};

Sprite_MiniMap.prototype.drawMapping = function(x, y) {
    var opacity = $gameMinimap.getOpacity(0, x, y);
    if (opacity === 0) return;
    var bw = this._baseBitmap.width;
    var bh = this._baseBitmap.height;
    var mw = $gameMinimap.width();
    var mh = $gameMinimap.height();
    var dx = Math.floor(bw * x / mw);
    var dy = Math.floor(bh * y / mh);
    var dw = Math.floor(bw * (x + 1) / mw) - dx;
    var dh = Math.floor(bh * (y + 1) / mh) - dy;
    var context = this._mappingBitmap.context;
    context.clearRect(dx, dy, dw, dh);
    context.save();
    context.globalAlpha = opacity / 255;
    context.globalCompositeOperation = 'lighter';
    context.drawImage(this._baseBitmap._canvas, dx, dy, dw, dh, dx, dy, dw, dh);
    if (opacity < 255) {
        context.globalAlpha = (255 - opacity) / 255;
        context.fillStyle = MPPlugin.OutColor;
        context.fillRect(dx, dy, dw, dh);
    }
    context.restore();
    this._mappingBitmap._setDirty();
};





})();