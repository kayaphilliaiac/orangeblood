//=============================================================================
// TMVplugin - つちけむり
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 1.0
// 最終更新日: 2016/07/14
//=============================================================================

/*:
 * @plugindesc ジャンプとダッシュに土煙のエフェクトを追加します。
 * 任意のタイミングで土煙を表示することもできます。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param dustImage
 * @desc 土煙として利用する画像ファイル名
 * 初期値: Dust1
 * @default Dust1
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param maxDusts
 * @desc 同時に表示できるスプライトの数
 * 初期値: 64
 * @default 64
 *
 * @param jumpDusts
 * @desc ジャンプの着地時に表示するスプライト数
 * 初期値: 6
 * @default 6
 *
 * @param dashDusts
 * @desc ダッシュ時に表示するスプライト数
 * 初期値: 3
 * @default 3
 *
 * @help
 * 準備:
 *
 *   プラグインと一緒に配布している土煙の画像を img/system フォルダに保存し
 *   てください。ファイル名は Dust1.png となっています。
 *   ファイル名を変更しなければならない場合はプラグインパラメータの dustImage
 *   も一緒に変更してください。
 *
 *
 * 使い方:
 *
 *   プラグインを有効にすると、キャラクターがジャンプ後に着地したタイミング
 *   で土煙が表示されるようになります。
 *   また、プレイヤーがダッシュ（shiftキー押しながら or クリック）で移動する
 *   ときにも土煙が表示されます。
 *
 *   プラグインコマンドを使用することによって任意のタイミングで指定した座標
 *   に土煙を表示することもできます。
 *
 *
 * プラグインコマンド:
 *
 *   setDustXy 5 8
 *     指定した座標に土煙を表示します。数値はイベントコマンド『場所移動』で
 *     利用する座標と同じです、画面のドット数ではありません。
 *     setDustXy 5.5 8  のように小数点以下を入力することによって座標(5, 8)と
 *     座標(6, 8)の中間を指定することもできます。
 *
 *   setDustXy 5 8 3.14
 *     表示する土煙の移動方向を限定します。数値は右を 0 として、時計回りに
 *     6.28 で１周となります。
 *     上記のように3.14を指定した場合は土煙が左に向かって少し移動します。
 *
 *   setDustEvent 3
 *     ３番のイベントの足元に土煙を表示します。0 を指定した場合はイベントを
 *     実行しているキャラクター、-1 を指定した場合はプレイヤーが対象になり
 *     ます。
 *
 *   setDustEvent 3 3.14
 *     表示する土煙の移動方向を限定します。setDustXy と同じです。
 *
 *
 * プラグインパラメータ:
 *
 *   dustImage
 *     土煙の画像ファイル名を拡張子抜きで指定します。ファイルは img/system
 *     フォルダに保存してください。
 *
 *   maxDusts
 *     このパラメータに指定した数を超える土煙を同時に表示しようとした場合は
 *     何も表示されず、プラグインコマンドは無視されます。
 *     数値を大きくすればたくさんの土煙を表示することができますが、その分だ
 *     け処理が重くなり、低スペック環境ではFPSが低下する原因になります。
 *
 *   jumpDusts
 *     キャラクターをイベントコマンド『移動ルートの設定』などでジャンプさせ
 *     た後、着地の際に表示する土煙の数です。数値の分だけ土煙が重なり、より
 *     濃い土煙になります。
 *     0 を指定すれば着地時の土煙は表示されなくなります。
 * 
 *   dashDusts
 *     プレイヤーがダッシュで移動した際に表示する土煙の数です。数値の分だけ
 *     土煙が重なり、より濃い土煙になります。
 *     0 を指定すればダッシュ時の土煙は表示されなくなります。
 * 
 */

var Imported = Imported || {};
Imported.TMCloudDust = true;

(function() {

  var parameters = PluginManager.parameters('TMCloudDust');
  var dustImage = parameters['dustImage'];
  var maxDusts  = +parameters['maxDusts'];
  var jumpDusts = +parameters['jumpDusts'];
  var dashDusts = +parameters['dashDusts'];
  
  //-----------------------------------------------------------------------------
  // Game_Map
  //

  var _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId);
    this.setupCloudDusts();
  };

  Game_Map.prototype.setupCloudDusts = function() {
    this._cloudDusts = [];
    for (var i = 0; i < maxDusts; i++) {
      this._cloudDusts.push(new Game_CloudDust());
    }
  };

  Game_Map.prototype.cloudDusts = function() {
    return this._cloudDusts;
  };
  
  Game_Map.prototype.addCloudDust = function(x, y, radian) {
    for (var i = 0; i < maxDusts; i++) {
      if (!this._cloudDusts[i].exists()) {
        this._cloudDusts[i].setup(x, y, radian);
        return;
      }
    }
  };

  var _Game_Map_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function(sceneActive) {
    _Game_Map_update.call(this, sceneActive);
    this.updateCloudDusts();
  };

  Game_Map.prototype.updateCloudDusts = function() {
    this.cloudDusts().forEach(function(cloudDust) {
      cloudDust.update();
    });
  };
  
  //-----------------------------------------------------------------------------
  // Game_CharacterBase
  //

  Game_CharacterBase.prototype.addCloudDust = function(radian) {
    $gameMap.addCloudDust(this._realX + 0.5, this._realY + 1.0, radian);
  };

  var _Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
  Game_CharacterBase.prototype.updateJump = function() {
    _Game_CharacterBase_updateJump.call(this);
    if (this._jumpCount === 0) {
      for (var i = 0; i < jumpDusts; i++) {
        this.addCloudDust(i % 2 * Math.PI);
      }
    }
};

  //-----------------------------------------------------------------------------
  // Game_Player
  //

  var _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
  Game_Player.prototype.moveStraight = function(d) {
    if (this.isDashing() && this.canPass(this.x, this.y, d)) {
      if (d === 2) {
        var radian = Math.PI *1.5;
      } else if (d === 4) {
        var radian = 0;
      } else if (d === 6) {
        var radian = Math.PI;
      } else {
        var radian = Math.PI / 2;
      }
      for (var i = 0; i < dashDusts; i++) {
        this.addCloudDust(radian);
      }
    }
    _Game_Player_moveStraight.call(this, d);
  };

  //-----------------------------------------------------------------------------
  // Game_CloudDust
  //

  function Game_CloudDust() {
    this.initialize.apply(this, arguments);
  }

  Game_CloudDust.prototype.initialize = function() {
    this._x = 0;
    this._y = 0;
    this._count = 0;
    this._scale = new Point(1.0, 1.0);
  };

  Game_CloudDust.prototype.setup = function(x, y, radian) {
    this._x = x;
    this._y = y;
    this._opacity = 180;
    this._count = 30;
    if (radian === undefined) {
      radian = Math.random() * Math.PI * 2;
    } else {
      radian += Math.random() * 1.5 - 0.75;
    }
    this._vx = Math.cos(radian) * 0.02;
    this._vy = Math.sin(radian) * 0.02;
    this._rotation = radian;
    this._scale.x = 1.0;
    this._scale.y = 1.0;
  };
  
  Game_CloudDust.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.round($gameMap.adjustX(this._x) * tw);
  };
  
  Game_CloudDust.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    return Math.round($gameMap.adjustY(this._y) * th);
  };
  
  Game_CloudDust.prototype.opacity = function() {
    return this._opacity;
  };
  
  Game_CloudDust.prototype.rotation = function() {
    return this._rotation;
  };
  
  Game_CloudDust.prototype.scale = function() {
    return this._scale;
  };
  
  Game_CloudDust.prototype.exists = function() {
    return this._count > 0;
  };
  
  Game_CloudDust.prototype.update = function() {
    if (this._count > 0) {
      this._count--;
      this._x += this._vx;
      this._y += this._vy;
      this._vy -= 0.0008;
      this._opacity -= 6;
      this._scale.x += 0.02;
      this._scale.y += 0.02;
    }
  };
  
  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'setDustXy') {
      var radian = args[2] === undefined ? args[2] : +args[2];
      $gameMap.addCloudDust(+args[0], +args[1], radian);
    } else if (command === 'setDustEvent') {
      var character = this.character(+args[0]);
      if (character) {
        var radian = args[1] === undefined ? args[1] : +args[1];
        character.addCloudDust(radian);
      }
    }
  };
  
  //-----------------------------------------------------------------------------
  // Sprite_CloudDust
  //

  function Sprite_CloudDust() {
    this.initialize.apply(this, arguments);
  }

  Sprite_CloudDust.prototype = Object.create(Sprite.prototype);
  Sprite_CloudDust.prototype.constructor = Sprite_CloudDust;

  Sprite_CloudDust.prototype.initialize = function(cloudDust) {
    Sprite.prototype.initialize.call(this);
    this._cloudDust = cloudDust;
    this.scale = this._cloudDust.scale();
    this.visible = false;
    this.createBitmap();
  };

  Sprite_CloudDust.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._cloudDust.exists()) {
      this.visible = true;
      this.x = this._cloudDust.screenX();
      this.y = this._cloudDust.screenY();
      this.opacity = this._cloudDust.opacity();
      this.rotation = this._cloudDust.rotation();
    } else {
      this.visible = false;
    }
  };

  Sprite_CloudDust.prototype.createBitmap = function() {
    this.bitmap = ImageManager.loadSystem(dustImage);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.z = 3;
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map
  //

  var _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    _Spriteset_Map_createLowerLayer.call(this);
    this.createCloudDust();
  };

  Spriteset_Map.prototype.createCloudDust = function() {
    this._cloudDustSprites = [];
    $gameMap.cloudDusts().forEach(function(cloudDust) {
      this._cloudDustSprites.push(new Sprite_CloudDust(cloudDust));
    }, this);
    for (var i = 0; i < this._cloudDustSprites.length; i++) {
      this._tilemap.addChild(this._cloudDustSprites[i]);
    }
  };
  
})();
