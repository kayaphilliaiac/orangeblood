//
//  アクターフェイス改造 ver1.00
//
// ------------------------------------------------------
// Copyright (c) 2016 Yana
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------
//
// author Yana
//

var Imported = Imported || {};
Imported['ActorFaceR'] = 1.00;
/*:
 * @plugindesc ver1.00/メニュー画面等のフェイスの表示を変更します。
 * @author Yana
 *
 * @param FaceImage
 * @desc フェイスに何を使用するかの設定です。
 * walkだと歩行グラ、battlerだとSVグラ、standだと立ち絵です。
 * @default walk
 *
 * @param Offsets
 * @desc クラス毎のオフセット値です。
 * クラス名,x,y クラス名,x,y…というように記述してください。
 * @default Window_FormationStatus,0,-48
 *
 * @noteParam StandPicture
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData actors
 *
 * @noteParam 立ち絵
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData actors
 *
 * @help ------------------------------------------------------
 * プラグインコマンド
 * ------------------------------------------------------
 * このプラグインには、プラグインコマンドはありません。
 * ------------------------------------------------------
 * 使い方
 * ------------------------------------------------------
 * プラグインを導入し、プラグインパラメータを設定することで動作します。
 * FaceImageを変更することで、それぞれのイメージをアクターフェイスの代わりに使用します。
 *
 * FaceImageにStandを指定した場合、アクターのメモに立ち絵画像指定用の記述が必要になります。
 *
 * <立ち絵:xxx>
 * <StandPicture:xxx>
 * <ステータスピクチャ:xxx>
 * <StatusPicture:xxx>
 *
 * のいずれかをアクターのメモに記述すると、そのアクターの立ち絵をxxxの画像に指定します。
 * この画像は、img/pictures/に用意してください。
 *
 * また、アクターのメモに以下のいずれかを記述することで、表示領域の関係で立ち絵が小さくなったとき
 * 立ち絵の表示される範囲を補正することができます。
 *
 * X座標を補正:
 * <立ち絵X:x>
 * <StandPictureX:x>
 * <ステータスピクチャX:x>
 * <StatusPictureX:x>
 *
 * Y座標を補正:
 * <立ち絵Y:y>
 * <StandPictureY:y>
 * <ステータスピクチャY:y>
 * <StatusPictureY:y>
 *
 * ------------------------------------------------------
 * 利用規約
 * ------------------------------------------------------
 * 当プラグインはMITライセンスで公開されています。
 * 使用に制限はありません。商用、アダルト、いずれにも使用できます。
 * 二次配布も制限はしませんが、サポートは行いません。
 * 著作表示は任意です。行わなくても利用できます。
 * 要するに、特に規約はありません。
 * バグ報告や使用方法等のお問合せはネ実ツクールスレ、または、Twitterにお願いします。
 * https://twitter.com/yanatsuki_
 * 素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.00:
 * 公開
 */

(function() {
    ////////////////////////////////////////////////////////////////////////////////////

    var parameters = PluginManager.parameters('ActorFaceR');
    var faceImage = parameters['FaceImage'];
    var offsets = parameters['Offsets'].split(' ');
    var spriteLayer = 2;

    offsets = offsets.reduce(function(r,o){
        var ary = o.split(',');
        r[ary[0]] = {x:Number(ary[1]), y:Number(ary[2])};
        return r;
    },{});

    ////////////////////////////////////////////////////////////////////////////////////

    Game_Actor.prototype.standPictureName = function() {
        var name = this.actor().meta['StandPicture'] || this.actor().meta['立ち絵'] ||
                    this.actor().meta['StatusPicture'] || this.actor().meta['ステータスピクチャ'];
        return name ? name : '';
    };

    Game_Actor.prototype.standPictureX = function() {
        var x = this.actor().meta['StandPictureX'] || this.actor().meta['立ち絵X'] ||
            this.actor().meta['StatusPictureX'] || this.actor().meta['ステータスピクチャX'];
        return Number(x ? x : 0);
    };

    Game_Actor.prototype.standPictureY = function() {
        var y = this.actor().meta['StandPictureY'] || this.actor().meta['立ち絵Y'] ||
            this.actor().meta['StatusPictureY'] || this.actor().meta['ステータスピクチャY'];
        return Number(y ? y : 0);
    };

    ////////////////////////////////////////////////////////////////////////////////////

    var __WBase_initialize = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function(x, y, width, height) {
        this._spriteFrameCount = 0;
        this._isSpriteClear = true;
        __WBase_initialize.call(this,x,y,width,height)
    };

    // エイリアスだけど実質再定義
    var __WBase_drawActorFace = Window_Base.prototype.drawActorFace;
    Window_Base.prototype.drawActorFace = function(actor, x, y, width, height) {
        if (this._isSpriteClear) this.clearSprites();
        switch(faceImage) {
            case 'walk':
                this.drawActorGraphicSprite(actor, x, y, width, height);
                break;
            case 'battler':
                this.drawActorSvSprite(actor, x, y, width, height);
                break;
            case 'stand':
                this.drawActorStSprite(actor, x, y, width, height);
                break;
            default:
                __WBase_drawActorFace.call(this, actor, x, y, width, height);
                break;
        }
    };

    var __WBase_update = Window_Base.prototype.update;
    Window_Base.prototype.update = function() {
        if (Imported['SceneFormation'] && this._setRefresh) this.clearSprites();
        __WBase_update.call(this);
        this.updateFaceSprites();
    };

    Window_Base.prototype.updateFaceSprites = function() {
        if (this._tvSprites && this._spriteFrameCount % 12 === 0) {
            var ary = [0,1,2,1];
            var frame = ary[(this._spriteFrameCount / 12) % 4];
            for (var i in this._tvSprites){
                if (!this._tvSprites[i]) continue;
                var sprite = this._tvSprites[i];
                var actor = $gameActors.actor(i);
                var index = actor.characterIndex();
                var big = ImageManager.isBigCharacter(actor.characterName());
                var sw = Math.floor(sprite.bitmap.width / (big ? 3 : 12));
                var sh = Math.floor(sprite.bitmap.height / (big ? 4 : 8));
                var ox = 0;
                var oy = 0;
                var x = sw * frame + ox * sw + sw * (index % 4) * 3;
                var y = oy * sh + sh * Math.floor(index / 4) * 4;
                sprite.setFrame(x, y, sw, sh);
            }
        } else if (this._svSprites && this._spriteFrameCount % 12 === 0) {
            var frame = (this._spriteFrameCount / 12) % 3;
            var sFrame = (this._spriteFrameCount / 12) % 8;
            for (var i in this._svSprites){
                if (!this._svSprites[i]) continue;
                var sprite = this._svSprites[i];
                var actor = $gameActors.actor(i);
                var sw = sprite.bitmap.width / 9;
                var sh = sprite.bitmap.height / 6;
                var ox = 0;
                var oy = 0;
                if (this._index !== undefined && this._index === actor.index()) { ox = 6; oy = 1; }
                if (actor.isDying()){ ox = 6; oy = 2; }
                switch (actor.stateMotionIndex()) {
                    case 1: ox = 6; oy = 3; break;
                    case 2: ox = 6; oy = 4; break;
                    case 3: ox = 6; oy = 5; break;
                }
                sprite.setFrame(sw * frame + ox * sw, oy * sh, sw, sh);
                if (actor.stateOverlayIndex() > 0) {
                    var sSprite = this._stateSprites[i];
                    var sx = 96 * sFrame;
                    var sy = 96 * (actor.stateOverlayIndex() - 1);
                    sSprite.setFrame(sx, sy, 96, 96);
                }
            }
        }
        this._spriteFrameCount++;
    };

    Window_Base.prototype.drawActorGraphicSprite = function(actor, x, y, width, height) {
        if (!this._tvSprites) this.initActorGraphicSprites();
        if (!width) width = 144;
        if (!height) height = 144;
        var sprite = this._tvSprites[actor.actorId()];
        var opacity = this.contents.paintOpacity;
        if (sprite) {
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.x = x + Math.floor(width / 2) + 20;
            sprite.y = y + Math.floor(height / 2) + 20;
            sprite.opacity = opacity;
        }
    };

    Window_Base.prototype.drawActorSvSprite = function(actor, x, y, width, height) {
        if (!this._svSprites) this.initActorSvSprites();
        if (!width) width = 144;
        if (!height) height = 144;
        var sprite = this._svSprites[actor.actorId()];
        var opacity = this.contents.paintOpacity;
        var name = JsonEx._getConstructorName(this);
        var ox = 0;
        var oy = 0;
        if (offsets[name]) {
            ox = offsets[name].x;
            oy = offsets[name].y;
        }
        if (sprite) {
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 1.0;
            sprite.x = x + Math.floor(width / 2) + 20 + ox;
            sprite.y = y + height + 8 + oy;
            sprite.opacity = opacity;
            var oSprite = this._stateSprites[actor.actorId()];
            oSprite.x = sprite.x - 48;
            oSprite.y = sprite.y - 96;
            if (actor.stateOverlayIndex() > 0) oSprite.opacity = opacity;
            var sSprite = this._shadowSprites[actor.actorId()];
            sSprite.x = sprite.x - 41;
            sSprite.y = sprite.y - 20;
            sSprite.opacity = opacity;
        }
    };

    Window_Base.prototype.drawActorStSprite = function(actor, x, y, width, height) {
        if (!this._stSprites) this.initActorStSprites();
        if (!width) width = 144;
        if (!height) height = 144;
        var sprite = this._stSprites[actor.actorId()];
        var opacity = this.contents.paintOpacity;
        if (sprite) {
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 1.0;
            sprite.x = x + Math.floor(width / 2) + 20;
            sprite.y = y + height + 16;
            var sx = actor.standPictureX() + sprite.bitmap.width / 2 - width / 2;
            var sy = actor.standPictureY();
            if (height >= sprite.bitmap.height) sy = 0;
            sprite.setFrame(sx, sy, width, height);
            sprite.opacity = actor.standPictureName() ? opacity : 0;
        }
    };

    Window_Base.prototype.initActorGraphicSprites = function() {
        this._tvSprites = {};
        for (var i=$gameParty.size()-1;i>=0;i--) {
            var actor = $gameParty.members()[i];
            var bitmap = ImageManager.loadCharacter(actor.characterName());
            var sprite = new Sprite(bitmap);
            var index = actor.characterIndex();
            sprite.setFrame(48 + 144*(index % 4),192 * Math.floor(index / 4),48,48);
            sprite.opacity = 0;
            this.addChildAt(sprite, spriteLayer);
            this._tvSprites[actor.actorId()] = sprite;
        }
    };

    Window_Base.prototype.initActorSvSprites = function() {
        this._svSprites = {};
        this._stateSprites = {};
        this._shadowSprites = {};
        for (var i=$gameParty.size()-1;i>=0;i--) {
            var actor = $gameParty.members()[i];

            var bitmap = ImageManager.loadSvActor(actor.battlerName());
            var sprite = new Sprite(bitmap);
            sprite.setFrame(0,0,64,64);
            sprite.opacity = 0;
            this.addChildAt(sprite, spriteLayer);
            this._svSprites[actor.actorId()] = sprite;

            var oBitmap = ImageManager.loadSystem('States');
            var sSprite = new Sprite(oBitmap);
            sSprite.setFrame(0,0,0,96);
            sSprite.opacity = 0;
            this.addChildAt(sSprite, spriteLayer+1);
            this._stateSprites[actor.actorId()] = sSprite;

            var hBitmap = ImageManager.loadSystem('Shadow2');
            var hSprite = new Sprite(hBitmap);
            hSprite.setFrame(0,0,82,38);
            hSprite.opacity = 0;
            this.addChildAt(hSprite, spriteLayer);
            this._shadowSprites[actor.actorId()] = hSprite;
        }
    };

    Window_Base.prototype.initActorStSprites = function() {
        this._stSprites = {};
        for (var i=$gameParty.size()-1;i>=0;i--) {
            var actor = $gameParty.members()[i];
            var bitmap = ImageManager.loadPicture(actor.standPictureName());
            var sprite = new Sprite(bitmap);
            sprite.setFrame(sprite.width / 2, sprite.height, sprite.width, sprite.height);
            sprite.opacity = 0;
            this.addChildAt(sprite, spriteLayer);
            this._stSprites[actor.actorId()] = sprite;
        }
    };

    Window_Base.prototype.clearSprites = function() {
        if (this._tvSprites){
            for (var i in this._tvSprites){
                if (this._tvSprites[i]) this._tvSprites[i].opacity = 0;
            }
        } else if (this._svSprites){
            for (var i in this._svSprites){
                if (this._svSprites[i]) this._svSprites[i].opacity = 0;
                if (this._stateSprites[i]) this._stateSprites[i].opacity = 0;
                if (this._shadowSprites[i]) this._shadowSprites[i].opacity = 0;
            }
        } else if (this._stSprites){
            for (var i in this._stSprites){
                if (this._stSprites[i]) this._stSprites[i].opacity = 0;
            }
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////

    var __WSelectable_refresh = Window_Selectable.prototype.refresh;
    Window_Selectable.prototype.refresh = function() {
        this._isSpriteClear = false;
        this.clearSprites();
        __WSelectable_refresh.call(this);
    };

    ////////////////////////////////////////////////////////////////////////////////////
}());