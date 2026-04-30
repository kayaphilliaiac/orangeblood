//=============================================================================
// SAN_AnalogMove2.js
//=============================================================================
// Copyright (c) 2016 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

var Imported = Imported || {};
Imported.SAN_AnalogMove2 = true;

var Sanshiro = Sanshiro || {};
Sanshiro.AnalogMove2 = Sanshiro.AnalogMove2 || {};
Sanshiro.AnalogMove2.version = '0.0.0';

(function(SAN) {

'use strict';

//-----------------------------------------------------------------------------
// Input
//
// インプットクラス

// フレーム更新
var _Input_update = Input.update;
Input.update = function() {
    _Input_update.call(this);
    this.updateSticks();
};

Input.leftStick  = {dir: 0.0, tilt: 0.0};
Input.rightStick = {dir: 0.0, tilt: 0.0};

// ゲームパッドアナログスティックの更新
Input.updateSticks = function() {
    var axes = [0.0, 0.0, 0.0, 0.0];
    if (!!navigator.getGamepads && !!navigator.getGamepads()) {
        // 接続されたゲームパッドのうち最も傾きの大きいアナログスティック値を採用
        var pads = navigator.getGamepads();
        for (var i = 0; i < pads.length; i++) {
            var pad = pads[i];
            if (!pad || !pad.connected) {
                continue;
            }
            // 左アナログスティック
            if (Math.pow(axes[0], 2) + Math.pow(axes[1], 2) <
                Math.pow(pad.axes[0], 2) + Math.pow(pad.axes[1], 2))
            {
                axes[0] = pad.axes[0];
                axes[1] = pad.axes[1];
            }
            // 右アナログスティック
            if (Math.pow(axes[2], 2) + Math.pow(axes[3], 2) <
                Math.pow(pad.axes[2], 2) + Math.pow(pad.axes[3], 2))
            {
                axes[2] = pad.axes[2];
                axes[3] = pad.axes[3];
            }
        }
    }
    this.leftStick.dir = this.stickDir(axes[0], axes[1]);
    this.leftStick.tilt = this.stickTilt(axes[0], axes[1]);
    this.rightStick.dir = this.stickDir(axes[2], axes[3]);
    this.rightStick.tilt = this.stickTilt(axes[2], axes[3]);
};

// アナログスティックの傾き
Input.stickTilt = function(x, y) {
    var tilt = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var tTh  = 0.2; // 入力検知閾値
    return (
        tilt < tTh ? 0.0 :
        tilt > 1.0 ? 1.0 : tilt
    );
};

// アナログスティックの方向
Input.stickDir = function(x, y) {
    return Math.atan2(y, x);
};

//-----------------------------------------------------------------------------
// SoundManaber
//
// サウンドマネージャ

// リープSE演奏
SoundManager.playLeap = function() {
    var se = {
        name: "Evasion1",
        pan: 0,
        pitch: 100,
        volume: 90
    };
    AudioManager.playSe(se);
};

// ノックバックSE演奏
SoundManager.playKnockback = function() {
    var se = {
        name: "Damage1",
        pan: 0,
        pitch: 100,
        volume: 90
    };
    AudioManager.playSe(se);
};

//-----------------------------------------------------------------------------
// CollisionMap
//
// 衝突マップ

function CollisionMap() {
    throw new Error('This is a static class');
}

// マップID
CollisionMap._mapId = 0;

// エリア
CollisionMap._areas = [];

// 境界ライン
CollisionMap._leftBorderLine   = null;
CollisionMap._rightBorderLine  = null;
CollisionMap._topBorderLine    = null;
CollisionMap._bottomBorderLine = null;

// セットアップ
CollisionMap.setup = function() {
    this._mapId = $gameMap.mapId();
    this.initAreas();
    this.initBorderLines();
    this.initPassable();
};

// 衝突エリアの初期化
CollisionMap.initAreas = function() {
    this._areas = [];
    for (var x = 0; x < $gameMap.width(); x++) {
        this._areas.push([]);
        for (var y = 0; y < $gameMap.height(); y++) {
            this._areas[x].push(new CollisionArea());
        }
    }
};

// マップ境界ラインの初期化
CollisionMap.initBorderLines = function() {
    this._leftBorderLine = new SegmentCollider(
        new RectVector(0.0, 0.0),
        new RectVector(0.0, $gameMap.height())
    );
    this._rightBorderLine = new SegmentCollider(
        new RectVector($gameMap.width(), 0.0),
        new RectVector(0.0, $gameMap.height())
    );
    this._topBorderLine = new SegmentCollider(
        new RectVector(0.0, 0.0),
        new RectVector($gameMap.width(), 0.0)
    );
    this._bottomBorderLine = new SegmentCollider(
        new RectVector(0.0, $gameMap.height()),
        new RectVector($gameMap.width(), 0.0)
    );
    if (!$gameMap.isLoopHorizontal()) {
        this._leftBorderLine.registrateKeys();
        this._rightBorderLine.registrateKeys();
    }
    if (!$gameMap.isLoopVertical()) {
        this._topBorderLine.registrateKeys();
        this._bottomBorderLine.registrateKeys();
    }
};

// 通行判定の初期化
CollisionMap.initPassable = function() {
    for (var x = 0; x < $gameMap.width(); x++) {
        for (var y = 0; y < $gameMap.height(); y++) {
            if (!$gameMap.isPassable(x, y, 8)) {
                new SegmentCollider(
                    new RectVector(x, y),
                    new RectVector(1, 0)
                ).registrateKeys();
            }
            if (!$gameMap.isPassable(x, y, 4)) {
                new SegmentCollider(
                    new RectVector(x, y),
                    new RectVector(0, 1)
                ).registrateKeys();
            }
            if (!$gameMap.isPassable(x, y, 6)) {
                new SegmentCollider(
                    new RectVector(x + 1, y),
                    new RectVector(0, 1)
                ).registrateKeys();
            }
            if (!$gameMap.isPassable(x, y, 2)) {
                new SegmentCollider(
                    new RectVector(x, y + 1),
                    new RectVector(1, 0)
                ).registrateKeys();
            }
        }
    }
};

// リフレッシュ
CollisionMap.refresh = function() {
    this.setup();
};

// 左端境界ライン
CollisionMap.leftBorderLine = function() {
    return this._leftBorderLine;
};

// 右端境界ライン
CollisionMap.rightBorderLine = function() {
    return this._rightBorderLine;
};

// 上端境界ライン
CollisionMap.topBorderLine = function() {
    return this._topBorderLine;
};

// 下端境界ライン
CollisionMap.bottomBorderLine = function() {
    return this._bottomBorderLine;
};

// コライダーの登録
CollisionMap.addCollider = function(x, y, collider) {
    var idx = this._areas[x][y].addCollider(collider);
    var key = {x: x, y: y, idx: idx};
    return key;
};

// コライダーの削除
CollisionMap.removeCollider = function(key) {
    this._areas[key.x][key.y].removeCollider(key.idx);
};

// コライダーの取得
CollisionMap.getCollider = function(key) {
    return this._areas[key.x][key.y].getCollider(key.idx);
};

// コライダーの取得
CollisionMap.getKeys = function(x, y) {
    var keys = [];
    this._areas[x][y].getIdxes().forEach(function(idx) {
        var key = {x: x, y: y, idx: idx};
        keys.push(key);
    });
    return keys;
};

//-----------------------------------------------------------------------------
// CollisionArea
//
// 衝突マップ区画

function CollisionArea() {
    this.initialize.apply(this, arguments);
}

// オブジェクト初期化
CollisionArea.prototype.initialize = function() {
    this._colliders = []; // コライダー配列
};

// コライダーの登録
CollisionArea.prototype.addCollider = function(collider) {
    var idx = 0;
    while (!!this._colliders[idx]) { idx++; }
    this._colliders[idx] = collider;
    return idx;
};

// コライダーの削除
CollisionArea.prototype.removeCollider = function(idx) {
    this._colliders[idx] = undefined;
};

// コライダーの取得
CollisionArea.prototype.getCollider = function(idx) {
    return this._colliders[idx];
};

// コライダーインデックスリストの取得
CollisionArea.prototype.getIdxes = function() {
    var idxes = [];
    this._colliders.forEach(function(collider, idx) {
        if (!!this._colliders[idx]) {
            idxes.push(idx);
        }
    }, this);
    return idxes;
};

//-----------------------------------------------------------------------------
// RectVector
//
// 直交座標系ベクトル

function RectVector () {
    this.initialize.apply(this, arguments);
}

// オブジェクト初期化
RectVector.prototype.initialize = function(x, y) {
    this._x = x;
    this._y = y;
};

// X座標
RectVector.prototype.x = function() {
    return this._x;
};

// Y座標
RectVector.prototype.y = function() {
    return this._y;
};

// 長さ2乗
RectVector.prototype.lenSq = function() {
    return Math.pow(this.x(), 2) + Math.pow(this.y(), 2);
};

// 長さ
RectVector.prototype.len = function() {
    return Math.sqrt(this.lenSq());
};

// 角度ラジアン
RectVector.prototype.dir = function() {
    return Math.atan2(this.y(), this.x());
};

// X座標の設定
RectVector.prototype.setX = function(x) {
    this._x = x;
};

// Y座標の設定
RectVector.prototype.setY = function(y) {
    this._y = y;
};

// 長さの設定
RectVector.prototype.setLen = function(len) {
    var orgLen = this.len();
    if (orgLen !== 0.0) {
        this.setX(this.x() * (len / orgLen));
        this.setY(this.y() * (len / orgLen));
    } else {
        this.setX(len);
        this.setY(0.0);
    }
};

// 角度ラジアンの設定
RectVector.prototype.setDir = function(dir) {
    var len = this.len();
    this.setX(len * Math.cos(dir));
    this.setY(len * Math.sin(dir));
};

// 加算ベクトル
RectVector.prototype.add = function(vec) {
    return new RectVector(this.x() + vec.x(), this.y() + vec.y());
};

// 加算ベクトル(ループマップ考慮)
RectVector.prototype.add2 = function(vec) {
    return new RectVector(
        $gameMap.roundX(this.x() + vec.x()),
        $gameMap.roundY(this.y() + vec.y())
    );
};

// 減算ベクトル
RectVector.prototype.sub = function(vec) {
    return new RectVector(this.x() - vec.x(), this.y() - vec.y());
};

// 減算ベクトル(ループマップ考慮)
RectVector.prototype.sub2 = function(vec) {
    return new RectVector(
        $gameMap.deltaX(this.x(), vec.x()),
        $gameMap.deltaY(this.y(), vec.y())
    );
};

// 乗算ベクトル
RectVector.prototype.mul = function(scl) {
    return new RectVector(this.x() * scl, this.y() * scl);
};

// 除算ベクトル
RectVector.prototype.div = function(scl) {
    return new RectVector(this.x() / scl, this.y() / scl);
};

// 長さ指定ベクトル
RectVector.prototype.scl = function(len) {
    if (this.len() === 0.0) {
        return new RectVector(len, 0.0);
    } else {
        return this.mul(len / this.len());
    }
};

// 逆ベクトル
RectVector.prototype.inv = function() {
    return new RectVector(-this.x(), -this.y());
};

// 正規化ベクトル
RectVector.prototype.norm = function() {
    if (this.len === 0.0) {
        return new RectVector(1.0, 0.0);
    } else {
        return this.mul(1.0 / this.len());
    }
};

// 法線ベクトル
RectVector.prototype.perp = function() {
    return new RectVector(-this.y(), this.x());
};

// 複製ベクトル
RectVector.prototype.clone = function() {
    return new RectVector(this.x(), this.y());
};

// 極座標系ベクトル
RectVector.prototype.toPolar = function() {
    return new PolarVector(this.len(), Math.atan2(this.y(), this.x()));
};

// 内積
RectVector.prototype.dot = function(vec) {
    return this.x() * vec.x() + this.y() * vec.y();
};

// 外積
RectVector.prototype.cross = function(vec) {
    return this.x() * vec.y() - this.y() * vec.x();
};

// cos
RectVector.prototype.cos = function(vec) {
    return this.norm().dot(vec.norm());
};

// sin
RectVector.prototype.sin = function(vec) {
    return this.norm().cross(vec.norm());
};

// tan
RectVector.prototype.tan = function(vec) {
    return this.sin(vec) / this.cos(vec);
};

// 垂直判定
RectVector.prototype.isVert = function(vec) {
    return Math.abs(this.cos(vec)) <= Collider.errMargin;
};

// 平行判定
RectVector.prototype.isPara = function(vec) {
    return Math.abs(this.sin(vec)) <= Collider.errMargin;
};

// 鋭角判定
RectVector.prototype.isSharp = function(vec) {
    return this.dot(vec) >= 0.0;
};

// デバッグ用表示
RectVector.prototype.disp = function() {
    console.log(this.x(), this.y());
};

//-----------------------------------------------------------------------------
// PolarVector
//
// 極座標系ベクトル

function PolarVector() {
    this.initialize.apply(this, arguments);
}

PolarVector.prototype = Object.create(RectVector.prototype);
PolarVector.prototype.constructor = PolarVector;

PolarVector.prototype.initialize = function(len, dir) {
    this._len = len;
    this._dir = dir;
};

// 長さ
PolarVector.prototype.len = function() {
    return this._len;
};

// 長さ2乗
PolarVector.prototype.lenSq = function() {
    return Math.pow(this.len(), 2);
};

// 角度ラジアン
PolarVector.prototype.dir = function() {
    return this._dir;
};

// Y座標
PolarVector.prototype.y = function() {
    return this.len() * Math.sin(this.dir());
};

// X座標
PolarVector.prototype.x = function() {
    return this.len() * Math.cos(this.dir());
};

// X座標の設定
PolarVector.prototype.setX = function(x) {
    var len = Math.sqrt(Math.pow(x, 2) + Math.pow(this.y(), 2));
    var dir = Math.atan2(this.y(), x);
    this.setLen(len);
    this.setDir(dir);
};

// Y座標の設定
PolarVector.prototype.setY = function(y) {
    var len = Math.sqrt(Math.pow(this.x(), 2) + Math.pow(y, 2));
    var dir = Math.atan2(y, this.x());
    this.setLen(len);
    this.setDir(dir);
};

// 長さの設定
PolarVector.prototype.setLen = function(len) {
    this._len = len;
};

// 角度ラジアンの設定
PolarVector.prototype.setDir = function(dir) {
    this._dir = dir;
};

// 加算ベクトル
PolarVector.prototype.add = function(vec) {
    var x = this.x() + vec.x();
    var y = this.y() + vec.y();
    var len = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var dir = Math.atan2(y, x);
    return new PolarVector(len, dir);
};

// 減算ベクトル
PolarVector.prototype.sub = function(vec) {
    var x = this.x() - vec.x();
    var y = this.y() - vec.y();
    var len = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var dir = Math.atan2(y, x);
    return new PolarVector(len, dir);
};

// 減算ベクトル(ループマップ考慮)
PolarVector.prototype.sub2 = function(vec) {
    var x = $gameMap.deltaX(this.x(), vec.x());
    var y = $gameMap.deltaY(this.y(), vec.y());
    var len = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var dir = Math.atan2(y, x);
    return new PolarVector(len, dir);
};

// 乗算ベクトル
PolarVector.prototype.mul = function(scl) {
    var x = this.x() * scl;
    var y = this.y() * scl;
    var len = this.len() * scl;
    var dir = Math.atan2(y, x);
    return new PolarVector(len, dir);
};

// 除算ベクトル
PolarVector.prototype.div = function(scl) {
    var x = this.x() / scl;
    var y = this.y() / scl;
    var len = this.len() / scl;
    var dir = Math.atan2(y, x);
    return new PolarVector(len, dir);
};

// 長さ指定ベクトル
PolarVector.prototype.scl = function(len) {
    return new PolarVector(len, this.dir());
};

// 逆ベクトル
PolarVector.prototype.inv = function() {
    var x = -this.x();
    var y = -this.y();
    var dir = Math.atan2(y, x);
    return new PolarVector(this.len(), dir);
};

// 正規化ベクトル
PolarVector.prototype.norm = function() {
    return new PolarVector(1.0, this.dir());
};

// 法線ベクトル
PolarVector.prototype.perp = function() {
    var x = Math.cos(this.dir() + Math.PI / 2.0);
    var y = Math.sin(this.dir() + Math.PI / 2.0);
    var dir = Math.atan2(y, x);
    return new PolarVector(this.len(), dir);
};

// 複製ベクトル
PolarVector.prototype.clone = function() {
    return new PolarVector(this.len(), this.dir());
};

// 直交座標系ベクトル
PolarVector.prototype.toRect = function() {
    return new RectVector(this.x(), this.y());
};

//-----------------------------------------------------------------------------
// Collider
//
// コライダー

function Collider() {
    this.initialize.apply(this, arguments);
}

// 定数
// 許容誤差
Collider.errMargin = Math.pow(0.5, 16);

// ポイントとポイントの距離
Collider.distancePointToPoint = function(point1, point2) {
    var relPosVec = point2.posVec().sub2(point1.posVec());
    return relPosVec.len();
};

// ポイントとサークルの距離
Collider.distancePointToCircle = function(point, circle) {
    return this.distancePointToPoint(point, circle) - circle.r();
};

// ポイントとラインの距離
Collider.distancePointToLine = function(point, line) {
    var relPosVec = line.posVec().sub2(point.posVec());
    var normDirVec = line.dirVec().norm();
    return Math.abs(normDirVec.cross(relPosVec));
};

// ポイントとセグメントの距離
Collider.distancePointToSegment = function(point, segment) {
    var relPosVec = segment.posVec().sub2(point.posVec());
    var relEndVec = segment.endVec().sub2(point.posVec());
    if (segment.dirVec().len() === 0.0) {
        // セグメントが実質ポイントのとき
        return relPosVec.len();
    } else if (segment.dirVec().isSharp(relPosVec)) {
        // ポイントがセグメントの始点側よりはみ出ている場合
        return relPosVec.len();
    } else if (!segment.dirVec().isSharp(relEndVec)) {
        // ポイントがセグメントの終点側よりはみ出ている場合
        return relEndVec.len();
    } else {
        // ポイントがセグメントの始点と終点の間にある場合
        return this.distancePointToLine(point, segment);
    }
};

// ポイントとカプセルの距離
Collider.distancePointToCapsule = function(point, capsule) {
    return (capsule.dirVec().len() > 0.0 ?
        this.distancePointToSegment(point, capsule) - capsule.r() :
        this.distancePointToCircle(point, capsule)
    );
};

// サークルとサークルの距離
Collider.distanceCircleToCircle = function(circle1, circle2) {
    return this.distancePointToCircle(circle1, circle2) - circle1.r();
};

// サークルとラインの距離
Collider.distanceCircleToLine = function(circle, line) {
    return this.distancePointToLine(circle, line) - circle.r();
};

// サークルとセグメントの距離
Collider.distanceCircleToSegment = function(circle, segment) {
    return this.distancePointToSegment(circle, segment) - circle.r();
};

// サークルとカプセルの距離
Collider.distanceCircleToCapsule = function(circle, capsule) {
    return (capsule.dirVec().len() > 0.0 ?
        this.distancePointToCapsule(circle, capsule) - circle.r() :
        this.distanceCircleToCircle(circle, capsule)
    );
};

// ラインとラインの距離
Collider.distanceLineToLine = function(line1, line2) {
    if (line2.dirVec().isPara(line1.dirVec())) {
        // 平行時
        return this.distancePointToLine(line1, line2);
    } else {
        // 交差時
        return 0.0;
    }
};

// ラインとセグメントの距離
Collider.distanceLineToSegment = function(line, segment) {
    if (line.dirVec().isPara(segment.dirVec())) {
        // 平行時
        return this.distancePointToLine(segment, line);
    }
    var relPosVec = segment.posVec().sub2(line.posVec());
    var relEndVec = segment.endVec().sub2(line.posVec());
    var normDirVec = line.dirVec().norm();
    var normDirCrossPos = normDirVec.cross(relPosVec);
    var normDirCrossEnd = normDirVec.cross(relEndVec);
    if (normDirCrossPos * normDirCrossEnd < 0.0) {
        // 交差時
        return 0.0;
    } else {
        // 非平行非交差時
        return Math.min(
            Math.abs(normDirCrossPos),
            Math.abs(normDirCrossEnd)
        );
    }
};

// ラインとカプセルの距離
Collider.distanceLineToCapsule = function(line, capsule) {
    return (capsule.dirVec().len() > 0.0 ? 
        this.distanceLineToSegment(line, capsule) - capsule.r():
        this.distanceCircleToLine(capsule, line)
    );
};

// セグメントとセグメントの距離
Collider.distanceSegmentToSegment = function(segment1, segment2) {
    var dirVec1 = segment1.dirVec();
    var dirVec2 = segment2.dirVec();
    var relPosVec12 = segment2.posVec().sub2(segment1.posVec());
    var relEndVec12 = segment2.endVec().sub2(segment1.posVec());
    var relPosVec21 = segment1.posVec().sub2(segment2.posVec());
    var relEndVec21 = segment1.endVec().sub2(segment2.posVec());
    if (dirVec1.cross(relPosVec12) * dirVec1.cross(relEndVec12) < 0.0 &&
        dirVec2.cross(relPosVec21) * dirVec2.cross(relEndVec21) < 0.0) 
    {
        // 交差時
        return 0.0;
    } else {
        // 非交差時
        var endPoint1 = new PointCollider(segment1.endVec());
        var endPoint2 = new PointCollider(segment2.endVec());
        return Math.min(
            this.distancePointToSegment(segment1,  segment2),
            this.distancePointToSegment(segment2,  segment1),
            this.distancePointToSegment(endPoint1, segment2),
            this.distancePointToSegment(endPoint2, segment1)
        );
    }
};

// セグメントとカプセルの距離
Collider.distanceSegmentToCapsule = function(segment, capsule) {
    return (capsule.dirVec().len() > 0.0 ?
        this.distanceSegmentToSegment(segment, capsule) - capsule.r() :
        this.distanceCircleToSegment(capsule, segment)
    );
};

// カプセルとカプセルの距離
Collider.distanceCapsuleToCapsule = function(capsule1, capsule2) {
    return (capsule1.dirVec().len() > 0.0 ?
        this.distanceSegmentToCapsule(capsule1, capsule2) - capsule1.r() :
        this.distanceCircleToCapsule(capsule1, capsule2)
    );
};

// ラインとラインの交差位置ベクトル
Collider.intersectionPosVecLineToLine = function(line1, line2) {
    if (line2.dirVec().isPara(line1.dirVec())) {
        // 平行時
        return null;
    }
    var relPosVec = line2.posVec().sub2(line1.posVec());
    var relEndVec = line2.posVec().sub2(line1.posVec().add(line1.dirVec()));
    var dirCrossPos = line2.dirVec().cross(relPosVec);
    var dirCrossEnd = line2.dirVec().cross(relEndVec);
    var intScl = dirCrossPos / (dirCrossPos - dirCrossEnd);
    var intPosVec = line1.posVec().add(line1.dirVec().mul(intScl));
    return intPosVec;
};

// オブジェクト初期化
Collider.prototype.initialize = function() {
    this._version = SAN.AnalogMove2.version; // プラグインバージョン
    this.initKeys();
    this.initFlags();
};

// 衝突マップキーの初期化
Collider.prototype.initKeys = function() {
    this._keys = []; // 衝突マップキー
};

// 衝突フラグの初期化
Collider.prototype.initFlags = function() {
    this._through = false; // すり抜け
    this._push = false; // 押し込み
};

// プラグインバージョン一致判定
Collider.prototype.isCurrentVersion = function() {
    return this._version === SAN.AnalogMove2.version;
};

// すり抜け判定
Collider.prototype.isThrough = function() {
    return this._through;
};

// すり抜け設定
Collider.prototype.setThrough = function(through) {
    this._through = through;
};

// 押し込み判定
Collider.prototype.isPushable = function() {
    return this._push;
};

// 押し込み設定
Collider.prototype.setPushable = function(pushable) {
    this._push = pushable;
};

// プライオリティタイプ
Collider.prototype.priorityType = function() {
    return undefined;
};

// オブジェクトとの距離
Collider.prototype.distanceTo = function(collider) {
    return (
        collider.isCapsuleCollider() ? this.distanceToCapsule(collider) :
        collider.isSegmentCollider() ? this.distanceToSegment(collider) :
        collider.isLineCollider()    ? this.distanceToLine(collider)    :
        collider.isCircleCollider()  ? this.distanceToCircle(collider)  :
        collider.isPointCollider()   ? this.distanceToPoint(collider)   :
        null
    );
};

// オブジェクトとの交差位置ベクトル
Collider.prototype.intersectionPosVecTo = function(collider) {
    if (this.isLineCollider() && collider.isLineCollider()) {
        return Collider.intersectionPosVecLineToLine(this, collider);
    } else {
        return null;
    }
};

// ポイントとの距離
Collider.prototype.distanceToPoint = function(point) {
    return null;
};

// サークルとの距離
Collider.prototype.distanceToCircle = function(circle) {
    return null;
};

// ラインとの距離
Collider.prototype.distanceToLine = function(line) {
    return null;
};

// セグメントとの距離
Collider.prototype.distanceToSegment = function(segment) {
    return null;
};

// カプセルとの距離
Collider.prototype.distanceToCapsule = function(capsule) {
    return null;
};

// X座標最小値
Collider.prototype.minX = function() {
    return 0.0;
};

// Y座標最小値
Collider.prototype.minY = function() {
    return 0.0;
};

// X座標最大値
Collider.prototype.maxX = function() {
    return 0.0;
};

// Y座標最大値
Collider.prototype.maxY = function() {
    return 0.0;
};

// 衝突マップへの登録
Collider.prototype.registrateKeys = function() {
    var minX = Math.floor(this.minX() - Collider.errMargin);
    var minY = Math.floor(this.minY() - Collider.errMargin);
    var maxX = Math.floor(this.maxX());
    var maxY = Math.floor(this.maxY());
    for (var x = minX; x <= maxX; x++) {
        for (var y = minY; y <= maxY; y++) {
            var rX = x.mod($gameMap.width());
            var rY = y.mod($gameMap.height());
            var key = CollisionMap.addCollider(rX, rY, this);
            this._keys.push(key);
        }
    }
};

// 衝突マップからの登録解除
Collider.prototype.deregistrateKeys = function() {
    this._keys.forEach(function(key) {
        CollisionMap.removeCollider(key);
    });
    this._keys = [];
};

// キーリストから探索したキーのインデックス(array.prototype.findIndex代替)
Collider.prototype.indexOfKey = function(keys, key) {
    var collider1 = CollisionMap.getCollider(key);
    for (var index = 0; index < keys.length; index++) {
        var collider2 = CollisionMap.getCollider(keys[index]);
        if (collider1 === collider2) {
            return index;
        }
    }
    return -1;
};

// コライダーの距離の比較(ソート用)
Collider.prototype.compareColliderDistance = function(key1, key2) {
    var collider1 = CollisionMap.getCollider(key1);
    var collider2 = CollisionMap.getCollider(key2);
    return this.distanceTo(collider1) - this.distanceTo(collider2);
};

// コライダーの座標の比較(ソート用)
Collider.prototype.compareColliderPosition = function(key1, key2) {
    var collider1 = CollisionMap.getCollider(key1);
    var collider2 = CollisionMap.getCollider(key2);
    return (
        collider1.minX() - collider2.minX() ||
        collider1.minY() - collider2.minY() ||
        collider1.maxX() - collider2.maxX() ||
        collider1.maxY() - collider2.maxY()
    );
};

// 衝突ポイントオブジェクト判定
Collider.prototype.isPointCollider = function() {
    return (this instanceof PointCollider);
};

// 衝突サークルオブジェクト判定
Collider.prototype.isCircleCollider = function() {
    return (this instanceof CircleCollider);
};

// 衝突ラインオブジェクト判定
Collider.prototype.isLineCollider = function() {
    return (this instanceof LineCollider);
};

// 衝突セグメントオブジェクト判定
Collider.prototype.isSegmentCollider = function() {
    return (this instanceof SegmentCollider);
};

// 衝突カプセルオブジェクト判定
Collider.prototype.isCapsuleCollider = function() {
    return (this instanceof CapsuleCollider);
};

// キャラクタームーバー判定
Collider.prototype.isCharacterMover = function() {
    return (this instanceof CharacterMover);
};

// プレイヤームーバー判定
Collider.prototype.isPlayerMover = function() {
    return (this instanceof PlayerMover);
};

// ビークルムーバー判定
Collider.prototype.isVehicleMover = function() {
    return (this instanceof VehicleMover);
};

// 小型船ムーバー判定
Collider.prototype.isBoatMover = function() {
    return this.isVehicleMover() && this.content().isBoat();
};

// 大型船ムーバー判定
Collider.prototype.isShipMover = function() {
    return this.isVehicleMover() && this.content().isShip();
};

// 飛行船ムーバー判定
Collider.prototype.isAirshipMover = function() {
    return this.isVehicleMover() && this.content().isAirship();
};

// フォロワームーバー判定
Collider.prototype.isFollowerMover = function() {
    return (this instanceof FollowerMover);
};

// イベントムーバー判定
Collider.prototype.isEventMover = function() {
    return (this instanceof EventMover);
};

// プライオリティ一致判定
Collider.prototype.isSamePriority = function(collider) {
    return (
        this.priorityType() === undefined ||
        collider.priorityType() === undefined ||
        collider.priorityType() === this.priorityType()
    );
};

// すり抜け可否判定
Collider.prototype.canThrough = function(collider) {
    return (
        this.isThrough() || 
        collider.isThrough() ||
        !collider.isSamePriority(this)
    );
};

// 衝突可否判定
Collider.prototype.canCollide = function(collider) {
    return (
        !this.canThrough(collider) &&
        !this.canPush(collider) &&
        this.isSamePriority(collider)
    );
};

// 押し出し可否判定
Collider.prototype.canPush = function(collider) {
    return (
        !this.canThrough(collider) &&
        collider.isPushable()
    );
};

//-----------------------------------------------------------------------------
// PointCollider
//
// 衝突ポイントオブジェクト

function PointCollider() {
    this.initialize.apply(this, arguments);
};

PointCollider.prototype = Object.create(Collider.prototype);
PointCollider.prototype.constructor = PointCollider;

// オブジェクト初期化
PointCollider.prototype.initialize = function(posVec) {
    Collider.prototype.initialize.call(this);
    this._posVec = posVec;  // 位置ベクトル
};

// 位置ベクトル
PointCollider.prototype.posVec = function() {
    return this._posVec;
};

// 位置ベクトルの設定
PointCollider.prototype.setPosVec = function(posVec) {
    this._posVec = posVec
};

// ポイントとの距離
PointCollider.prototype.distanceToPoint = function(point) {
    return Collider.distancePointToPoint(this, point);
};

// サークルとの距離
PointCollider.prototype.distanceToCircle = function(circle) {
    return Collider.distancePointToCircle(this, circle);
};

// ラインとの距離
PointCollider.prototype.distanceToLine = function(line) {
    return Collider.distancePointToLine(this, line);
};

// セグメントとの距離
PointCollider.prototype.distanceToSegment = function(segment) {
    return Collider.distancePointToSegment(this, segment);
};

// カプセルとの距離
PointCollider.prototype.distanceToCapsule = function(capsule) {
    return Collider.distancePointToCapsule(this, capsule);
};

// X座標最小値
PointCollider.prototype.minX = function() {
    return this.posVec().x();
};

// Y座標最小値
PointCollider.prototype.minY = function() {
    return this.posVec().y();
};

// X座標最大値
PointCollider.prototype.maxX = function() {
    return this.posVec().x();
};

// Y座標最大値
PointCollider.prototype.maxY = function() {
    return this.posVec().y();
};

//-----------------------------------------------------------------------------
// CircleCollider
//
// 衝突サークルオブジェクト

function CircleCollider() {
    this.initialize.apply(this, arguments);
};

CircleCollider.prototype = Object.create(PointCollider.prototype);
CircleCollider.prototype.constructor = CircleCollider;

// オブジェクト初期化
CircleCollider.prototype.initialize = function(posVec, r) {
    PointCollider.prototype.initialize.call(this, posVec);
    this._r = r;    // 半径
};

// 半径
CircleCollider.prototype.r = function() {
    return this._r;
};

// 半径の設定
CircleCollider.prototype.setR = function(r) {
    this._r = r;
};

// ポイントとの距離
CircleCollider.prototype.distanceToPoint = function(point) {
    return Collider.distancePointToCircle(point, this);
};

// サークルとの距離
CircleCollider.prototype.distanceToCircle = function(circle) {
    return Collider.distanceCircleToCircle(this, circle);
};

// ラインとの距離
CircleCollider.prototype.distanceToLine = function(line) {
    return Collider.distanceCircleToLine(this, line);
};

// セグメントとの距離
CircleCollider.prototype.distanceToSegment = function(segment) {
    return Collider.distanceCircleToSegment(this, segment);
};

// カプセルとの距離
CircleCollider.prototype.distanceToCapsule = function(capsule) {
    return Collider.distanceCircleToCapsule(this, capsule);
};

// X座標最小値
CircleCollider.prototype.minX = function() {
    return this.posVec().x() - this.r();
};

// Y座標最小値
CircleCollider.prototype.minY = function() {
    return this.posVec().y() - this.r();
};

// X座標最大値
CircleCollider.prototype.maxX = function() {
    return this.posVec().x() + this.r();
};

// Y座標最大値
CircleCollider.prototype.maxY = function() {
    return this.posVec().y() + this.r();
};

//-----------------------------------------------------------------------------
// LineCollider
//
// 衝突ラインオブジェクト

function LineCollider() {
    this.initialize.apply(this, arguments);
};

LineCollider.prototype = Object.create(PointCollider.prototype);
LineCollider.prototype.constructor = LineCollider;

// オブジェクト初期化
LineCollider.prototype.initialize = function(posVec, dirVec) {
    PointCollider.prototype.initialize.call(this, posVec);
    this._dirVec = dirVec;  // 方向ベクトル
};

// 方向ベクトル
LineCollider.prototype.dirVec = function() {
    return this._dirVec;
};

// 方向ベクトルの設定
LineCollider.prototype.setDirVec = function(dirVec) {
    this._dirVec = dirVec;
};

// 直線上の位置ベクトル
LineCollider.prototype.sclVec = function(scl) {
    return this.posVec().add(this.dirVec().mul(scl));
};

// ポイントとの距離
LineCollider.prototype.distanceToPoint = function(point) {
    return Collider.distancePointToLine(point, this);
};

// サークルとの距離
LineCollider.prototype.distanceToCircle = function(circle) {
    return Collider.distanceCircleToLine(circle, this);
};

// ラインとの距離
LineCollider.prototype.distanceToLine = function(line) {
    return Collider.distanceLineToLine(this, line);
};

// セグメントとの距離
LineCollider.prototype.distanceToSegment = function(segment) {
    return Collider.distanceLineToSegment(this, segment);
};

// カプセルとの距離
LineCollider.prototype.distanceToCapsule = function(capsule) {
    return Collider.distanceLineToCapsule(this, capsule);
};

// X座標最小値
LineCollider.prototype.minX = function() {
    if (this.dirVec().isPara(CollisionMap.topBorderLine().dirVec())) {
        return 0.0;
    } else {
        var tIntPosVec = this.intersectionPosVecTo(CollisionMap.topBorderLine());
        var bIntPosVec = this.intersectionPosVecTo(CollisionMap.bottomBorderLine());
        return Math.min(tIntPosVec.x(), bIntPosVec.x());
    }
};

// Y座標最小値
LineCollider.prototype.minY = function() {
    if (this.dirVec().isPara(CollisionMap.leftBorderLine().dirVec())) {
        return 0.0;
    } else {
        var lIntPosVec = this.intersectionPosVecTo(CollisionMap.leftBorderLine());
        var rIntPosVec = this.intersectionPosVecTo(CollisionMap.rightBorderLine());
        return Math.min(lIntPosVec.y(), rIntPosVec.y());
    }
};

// X座標最大値
LineCollider.prototype.maxX = function() {
    if (this.dirVec().isPara(CollisionMap.topBorderLine().dirVec())) {
        return $gameMap.width();
    } else {
        var tIntPosVec = this.intersectionPosVecTo(CollisionMap.topBorderLine());
        var bIntPosVec = this.intersectionPosVecTo(CollisionMap.bottomBorderLine());
        return Math.max(tIntPosVec.x(), bIntPosVec.x());
    }
};

// Y座標最大値
LineCollider.prototype.maxY = function() {
    if (this.dirVec().isPara(CollisionMap.leftBorderLine().dirVec())) {
        return $gameMap.height();
    } else {
        var lIntPosVec = this.intersectionPosVecTo(CollisionMap.leftBorderLine());
        var rIntPosVec = this.intersectionPosVecTo(CollisionMap.rightBorderLine());
        return Math.max(lIntPosVec.y(), rIntPosVec.y());
    }
};

//-----------------------------------------------------------------------------
// SegmentCollider
//
// 衝突セグメントオブジェクト

function SegmentCollider() {
    this.initialize.apply(this, arguments);
};

SegmentCollider.prototype = Object.create(LineCollider.prototype);
SegmentCollider.prototype.constructor = SegmentCollider;

// オブジェクト初期化
SegmentCollider.prototype.initialize = function(posVec, dirVec) {
    LineCollider.prototype.initialize.call(this, posVec, dirVec);
};

// 終点ベクトル
SegmentCollider.prototype.endVec = function() {
    return this.posVec().add(this.dirVec());
};

// ポイントとの距離
SegmentCollider.prototype.distanceToPoint = function(point) {
    return Collider.distancePointToSegment(point, this);
};

// サークルとの距離
SegmentCollider.prototype.distanceToCircle = function(circle) {
    return Collider.distanceCircleToSegment(circle, this);
};

// ラインとの距離
SegmentCollider.prototype.distanceToLine = function(line) {
    return Collider.distanceLineToSegment(line, this);
};

// セグメントとの距離
SegmentCollider.prototype.distanceToSegment = function(segment) {
    return Collider.distanceSegmentToSegment(this, segment);
};

// カプセルとの距離
SegmentCollider.prototype.distanceToCapsule = function(capsule) {
    return Collider.distanceSegmentToCapsule(this, capsule);
};

// X座標最小値
SegmentCollider.prototype.minX = function() {
    return Math.min(this.posVec().x(), this.endVec().x());
};

// Y座標最小値
SegmentCollider.prototype.minY = function() {
    return Math.min(this.posVec().y(), this.endVec().y());
};

// X座標最大値
SegmentCollider.prototype.maxX = function() {
    return Math.max(this.posVec().x(), this.endVec().x());
};

// Y座標最大値
SegmentCollider.prototype.maxY = function() {
    return Math.max(this.posVec().y(), this.endVec().y());
};

//-----------------------------------------------------------------------------
// CapsuleCollider
//
// 衝突カプセルオブジェクト

function CapsuleCollider() {
    this.initialize.apply(this, arguments);
};

CapsuleCollider.prototype = Object.create(SegmentCollider.prototype);
CapsuleCollider.prototype.constructor = CapsuleCollider;

// オブジェクト初期化
CapsuleCollider.prototype.initialize = function(posVec, dirVec, r) {
    SegmentCollider.prototype.initialize.call(this, posVec, dirVec);
    this._r = r;    // 半径
};

// 半径
CapsuleCollider.prototype.r = function() {
    return this._r;
};

// 半径の設定
CapsuleCollider.prototype.setR = function(r) {
    this._r = r;
};

// ポイントとの距離
CapsuleCollider.prototype.distanceToPoint = function(point) {
    return Collider.distancePointToCapsule(point, this);
};

// サークルとの距離
CapsuleCollider.prototype.distanceToCircle = function(circle) {
    return Collider.distanceCircleToCapsule(circle, this);
};

// ラインとの距離
CapsuleCollider.prototype.distanceToLine = function(line) {
    return Collider.distanceLineToCapsule(line, this);
};

// セグメントとの距離
CapsuleCollider.prototype.distanceToSegment = function(segment) {
    return Collider.distanceSegmentToCapsule(segment, this);
};

// カプセルとの距離
CapsuleCollider.prototype.distanceToCapsule = function(capsule) {
    return Collider.distanceCapsuleToCapsule(this, capsule);
};

// X座標最小値
CapsuleCollider.prototype.minX = function() {
    return Math.min(
        this.posVec().x() - this.r(),
        this.endVec().x() - this.r()
    );
};

// Y座標最小値
CapsuleCollider.prototype.minY = function() {
    return Math.min(
        this.posVec().y() - this.r(),
        this.endVec().y() - this.r()
    );
};

// X座標最大値
CapsuleCollider.prototype.maxX = function() {
    return Math.max(
        this.posVec().x() + this.r(),
        this.endVec().x() + this.r()
    );
};

// Y座標最大値
CapsuleCollider.prototype.maxY = function() {
    return Math.max(
        this.posVec().y() + this.r(),
        this.endVec().y() + this.r()
    );
};

//-----------------------------------------------------------------------------
// Mover
//
// ムーバー

function Mover() {
    this.initialize.apply(this, arguments);
};

Mover.prototype = Object.create(CircleCollider.prototype);
Mover.prototype.constructor = Mover;

// オブジェクト初期化
Mover.prototype.initialize = function() {
    var posVec = this.contentPosVec();
    var r = this.contentSize() / 2;
    CircleCollider.prototype.initialize.call(this, posVec, r);
    this.initVectors();
};

// ベクトルの初期化
Mover.prototype.initVectors = function() {
    this._tarPosVec = this.posVec().clone(); // 目標位置ベクトル
    this._dirVec = new PolarVector(0.0, this.contentDir()); // オブジェクト方向ベクトル
    this._velVec = new PolarVector(0.0, this.contentDir()); // 速度ベクトル
    this._tarVelVec = new PolarVector(0.0, this.contentDir()); // 目標速度ベクトル
    this._innVelVec = new PolarVector(0.0, this.contentDir()); // 内部移動ベクトル
    this._effVelVec = new PolarVector(0.0, this.contentDir()); // 効果速度ベクトル
    this._accVelVec = new PolarVector(100.0, Math.PI); // 加速度ベクトル
    // this._accVelVec = new PolarVector(1.0, Math.PI / 16.0);
};

// コライダーキーリストの初期化
Mover.prototype.initKeys = function() {
    CircleCollider.prototype.initKeys.call(this);
    this._nearbyColliderKeys = [];  // 影響距離のコライダー
    this._matchColliderKeys = [];   // 一致距離のコライダー
    this._touchColliderKeys = [];   // 接触距離のコライダー
    this._collideColliderKeys = []; // 衝突距離のコライダー
    this._overlapColliderKeys = []; // 重複距離のコライダー
};

// 位置ベクトル
Mover.prototype.posVec = function() {
    return (new RectVector(
        $gameMap.roundX(this._posVec.x()),
        $gameMap.roundY(this._posVec.y())
    ));
};

// 位置ベクトルの設定
Mover.prototype.setPosVec = function(vec) {
    this._posVec = new RectVector(
        $gameMap.roundX(vec.x()),
        $gameMap.roundY(vec.y())
    );
};

// 方向ベクトル
Mover.prototype.dirVec = function() {
    return this._dirVec;
};

// 方向ベクトルの設定
Mover.prototype.setDirVec = function(dirVec) {
    this._dirVec = dirVec;
};

// 速度ベクトル
Mover.prototype.velVec = function() {
    return this._velVec;
};

// 速度ベクトルの設定
Mover.prototype.setVelVec = function(velVec) {
    this._velVec = velVec;
};

// 目標位置ベクトル
Mover.prototype.tarPosVec = function() {
    return this._tarPosVec;
};

// 目標位置ベクトルの設定
Mover.prototype.setTarPosVec = function(tarPosVec) {
    this._tarPosVec = tarPosVec;
};

// 目標位置座標の設定
Mover.prototype.setTarPos = function(x, y) {
    this.setTarPosVec(new RectVector(x, y));
};

// 目標速度ベクトル
Mover.prototype.tarVelVec = function() {
    return this._tarVelVec;
};

// 目標速度ベクトルの設定
Mover.prototype.setTarVelVec = function(tarVel) {
    this._tarVelVec = tarVel;
};

// 内部速度ベクトル
Mover.prototype.innVelVec = function() {
    return this._innVelVec;
};

// 内部速度ベクトルの設定
Mover.prototype.setInnVelVec = function(innVelVec) {
    this._innVelVec = innVelVec;
};

// 効果速度ベクトル
Mover.prototype.effVelVec = function() {
    return this._effVelVec;
};

// 効果速度ベクトルの設定
Mover.prototype.setEffVelVec = function(effVelVec) {
    this._effVelVec = effVelVec;
};

// 加速度ベクトル
Mover.prototype.accVelVec = function() {
    return this._accVelVec;
};

// 加速度ベクトルの設定
Mover.prototype.setAccVelVec = function(accVelVec) {
    this._accVelVec = accVelVec;
};

// 移動結果位置ベクトル
Mover.prototype.movVec = function() {
    return this.posVec().add(this.velVec());
};

// 移動結果位置コライダー
Mover.prototype.movCollider = function() {
    return new CircleCollider(this.movVec(), this.r());
};

// X座標最大値
Mover.prototype.maxX = function() {
    return (
        CircleCollider.prototype.maxX.call(this) +
        this.velVec().len() + 
        this.touchDistance()
    );
};

// Y座標最大値
Mover.prototype.maxY = function() {
    return (
        CircleCollider.prototype.maxY.call(this) +
        this.velVec().len() +
        this.touchDistance()
    );
};

// X座標最大値
Mover.prototype.minX = function() {
    return (
        CircleCollider.prototype.minX.call(this) -
        this.velVec().len() -
        this.touchDistance()
    );
};

// Y座標最大値
Mover.prototype.minY = function() {
    return (
        CircleCollider.prototype.minY.call(this) -
        this.velVec().len() - 
        this.touchDistance()
    );
};

// 位置固定判定
Mover.prototype.isAnchor = function() {
    return this._anchor;
};

// 位置固定設定
Mover.prototype.setAnchor = function(anchor) {
    this._anchor = anchor;
};

// オブジェクト実体
Mover.prototype.content = function() {
    return null;
};

// オブジェクト実体のX座標
Mover.prototype.contentRealX = function() {
    return 0.0;
};

// オブジェクト実体のY座標
Mover.prototype.contentRealY = function() {
    return 0.0;
};

// オブジェクト実体の位置ベクトル
Mover.prototype.contentPosVec = function() {
    return new RectVector(
        this.contentRealX() + this.contentSize() / 2,
        this.contentRealY() + this.contentSize() / 2
    );
};

// オブジェクト実体のフレーム間移動距離
Mover.prototype.contentDpf = function() {
    return 0.0;
};

// オブジェクト実体の方向ラジアン
Mover.prototype.contentDir = function() {
    return 0.0;
};

// オブジェクト実体のサイズ(タイル)
Mover.prototype.contentSize = function() {
    return 0.0;
};

// 内部X座標
Mover.prototype.currentX = function() {
    return this.posVec().x();
};

// 内部Y座標
Mover.prototype.currentY = function() {
    return this.posVec().y();
};

// X座標
Mover.prototype.realX = function() {
    return this.currentX() - this.r();
};

// Y座標
Mover.prototype.realY = function() {
    return this.currentY() - this.r();
};

// コライダーとの距離
Mover.prototype.distanceTo = function(collider) {
    return this.movCollider().distanceTo(collider);
};

// すり抜け判定
Mover.prototype.isThrough = function() {
    return this.content().isThrough();
};

// すり抜け設定
Mover.prototype.setThrough = function(through) {
    this.content().setThrough(through);
};

// プライオリティタイプ
Mover.prototype.priorityType = function() {
    return this.content().priorityType();
};

// 移動中判定
Mover.prototype.isMoving = function() {
    return this.velVec().len() !== 0.0;
};

// 目標座標への到達判定
Mover.prototype.isReachedTargetPosition = function() {
    return (
        this.tarPosVec() === null ||
        this.tarPosVec().sub2(this.posVec()).len() <= Collider.errMargin
    );
};

// フレーム更新
Mover.prototype.update = function() {
    this.updateTargetPosition();
    this.updateTargetVelocity();
    this.updateInnerVelocity();
    this.updateVelocity();
    this.updateNearbyColliderKeys();
    this.updateMatchColliderKeys();
    this.updateMove();
    this.updateDirection();
    this.updateColliderAction();
    this.updateEffectVelocity();
    this.updateColliderKeys();
    this.updateCollisionMap();
};

// 影響距離のコライダーキーリストの更新
Mover.prototype.updateNearbyColliderKeys = function() {
    this._nearbyColliderKeys = [];
    var minX = Math.floor(this.minX() - Collider.errMargin);
    var minY = Math.floor(this.minY() - Collider.errMargin);
    var maxX = Math.floor(this.maxX());
    var maxY = Math.floor(this.maxY());
    for (var x = minX; x <= maxX; x++) {
        for (var y = minY; y <= maxY; y++) {
            var rX = x.mod($gameMap.width());
            var rY = y.mod($gameMap.height());
            var keys = CollisionMap.getKeys(rX, rY);
            keys.forEach(function(key) {
                this._nearbyColliderKeys.push(key);
            }, this);
        }
    }
    // 自身と重複除外
    this._nearbyColliderKeys = this._nearbyColliderKeys.filter(
        function(key, index, keys) {
            return (
                CollisionMap.getCollider(key) !== this &&
                this.indexOfKey(keys, key) === index
            );
        }, this
    );
    // 衝突判定優先度でソート
    this._nearbyColliderKeys.sort(this.compareColliderDistance.bind(this));
};

// 一致距離のキャラクタームーバーキーの更新
Mover.prototype.updateMatchColliderKeys = function() {
    this._nearbyColliderKeys.forEach(function(key) {
        var collider = CollisionMap.getCollider(key);
        var relPosVec = collider.posVec().sub2(this.posVec());
        if (this.isCharacterMover(collider) &&
            Math.abs(relPosVec.len()) <= Collider.errMargin &&
            this.indexOfKey(this._matchColliderKeys, key) === -1)
        {
            this._matchColliderKeys.push(key);
        }
    }, this);
    // 衝突距離より遠いコライダーを除外
    this._matchColliderKeys = this._matchColliderKeys.filter(
        function(key) {
            var collider = CollisionMap.getCollider(key);
            return (
                !!collider &&
                this.distanceTo(collider) < this.collideDistance()
            );
        }, this
    );
}

// 目標座標の更新
Mover.prototype.updateTargetPosition = function() {
    if (this.isReachedTargetPosition()) {
        if (this.isAnchor()) {
            this.setTarPosVec(this.posVec());
        } else {
            this.setTarPosVec(null);
        }
    }
};

// 目標速度の更新
Mover.prototype.updateTargetVelocity = function() {
    if (this.isReachedTargetPosition()) {
        this.tarVelVec().setLen(0.0);
    } else {
        var tarRelVec = this.tarPosVec().sub2(this.posVec());
        var tarVelVecLen = Math.min(tarRelVec.len(), this.contentDpf());
        var tarVelVecDir = tarRelVec.dir();
        this.tarVelVec().setLen(tarVelVecLen);
        this.tarVelVec().setDir(tarVelVecDir);
    }
};

// 内部速度の更新
Mover.prototype.updateInnerVelocity = function() {
    this.updateInnerVelocityLength();
    this.updateInnerVelocityDirection();
};

// 内部速度の長さの更新
Mover.prototype.updateInnerVelocityLength = function() {
    if (this.innVelVec().len() < this.tarVelVec().len()) {
        this.innVelVec().setLen(Math.min(
            this.innVelVec().len() + this.accVelVec().len(),
            this.tarVelVec().len()
        ));
    } else {
        this.innVelVec().setLen(Math.max(
            this.innVelVec().len() - this.accVelVec().len(),
            this.tarVelVec().len()
        ));
    }
};

// 内部速度の方向の更新
Mover.prototype.updateInnerVelocityDirection = function() {
    var difDir = this.tarVelVec().dir() - this.innVelVec().dir();
    if (Math.cos(this.accVelVec().dir()) < Math.cos(difDir)) {
        this.innVelVec().setDir(this.tarVelVec().dir());
    } else if (Math.sin(difDir) < 0.0) {
        this.innVelVec().setDir(this.innVelVec().dir() - this.accVelVec().dir());
    } else {
        this.innVelVec().setDir(this.innVelVec().dir() + this.accVelVec().dir());
    }
};

// 速度ベクトルの更新
Mover.prototype.updateVelocity = function() {
    this.setVelVec(this.innVelVec().add(this.effVelVec()));
};

// 移動の更新
Mover.prototype.updateMove = function() {
    var orgVelVec = this.velVec();
    var splVelVecs = this.splitedVelocityVectors();
    splVelVecs.forEach(function(splVelVec) {
        this.setVelVec(splVelVec);
        this.updatePosition();
    }, this);
    this.setVelVec(orgVelVec);
};

// 現在位置ベクトルの更新
Mover.prototype.updatePosition = function() {
    this.checkColliders();
    this.setPosVec(this.movVec());
};

// 分割速度ベクトル
Mover.prototype.splitedVelocityVectors = function() {
    var velVec = this.velVec().clone();
    var velVecDir = velVec.dir();
    var splLen = this.r() > 0.0 ? this.r() / 4.0 : 1.0 / 16.0;
    var splVelVecs = [new PolarVector(0.0, velVecDir)];
    while (velVec.len() > 0.0) {
        var splVelVeclen = Math.min(velVec.len(), splLen);
        var splVelVec = new PolarVector(splVelVeclen, velVecDir);
        splVelVecs.push(splVelVec);
        velVec.setLen(Math.max(0.0, velVec.len() - splVelVeclen));
    }
    return splVelVecs;
};

// コライダーの確認
Mover.prototype.checkColliders = function() {
    this._touchColliderKeys = [];
    this._collideColliderKeys = [];
    this._overlapColliderKeys = [];
    for (var i = 0; i < this._nearbyColliderKeys.length; i++) {
        // if (this.velVec().len() <= Collider.errMargin) { return; }
        var key = this._nearbyColliderKeys[i];
        var collider = CollisionMap.getCollider(key);
        var distance = this.distanceTo(collider);
        if (distance <= this.touchDistance()) {
            // 接触距離の場合
            if (this.indexOfKey(this._touchColliderKeys, key) === -1) {
                this._touchColliderKeys.push(key);
            }
        }
        if (distance <= this.collideDistance()) {
            // 衝突距離の場合
            if (this.indexOfKey(this._collideColliderKeys, key) === -1) {
                this._collideColliderKeys.push(key);
            }
            if (this.canCollide(collider)) {
                this.slideByCollider(collider);
            }
        }
        if (distance <= this.overlapDistance()) {
            // 重複距離の場合
            if (this.indexOfKey(this._overlapColliderKeys, key) === -1) {
                this._overlapColliderKeys.push(key);
            }
        }
    }
};

// 衝突によるスライド
Mover.prototype.slideByCollider = function(collider) {
    if (this.velVec().len() === 0.0) { return; }
    var stopPosVec = this.stopPosVecTo(collider);
    var stopDist = this.posVec().sub2(stopPosVec).len();
    var restDist = Math.max(0.0, this.velVec().len() - stopDist);
    var slideDirVec = this.slideDirVecTo(collider);
    this.setPosVec(stopPosVec);
    this.velVec().setLen(restDist * this.velVec().cos(slideDirVec));
    this.velVec().setDir(slideDirVec.dir());
};

// コライダーとの衝突停止位置ベクトル
Mover.prototype.stopPosVecTo = function(collider) {
    return (
        collider.isSegmentCollider() ? this.stopPosVecToSegment(collider) :
        collider.isLineCollider()    ? this.stopPosVecToLine(collider)    :
        collider.isCircleCollider()  ? this.stopPosVecToCircle(collider)  :
        collider.isPointCollider()   ? this.stopPosVecToPoint(collider)   :
        null
    );
};

// ポイントとの衝突停止位置ベクトル
Mover.prototype.stopPosVecToPoint = function(point) {
    var relPosVec = point.posVec().sub2(this.posVec());
    var rSin = this.velVec().norm().cross(relPosVec);
    var rCos = Math.sqrt(Math.max(0.0, Math.pow(this.r(), 2) - Math.pow(rSin, 2)));
    if (this.velVec().dot(relPosVec) < 0) {
        rCos *= -1;
    }
    var rSinVec = this.velVec().perp().scl(rSin);
    var rCosVec = this.velVec().scl(rCos);
    var rVec = rSinVec.add(rCosVec);
    var stopPosVec = point.posVec().sub2(rVec);
    return stopPosVec;
};

// サークルとの衝突停止位置ベクトル
Mover.prototype.stopPosVecToCircle = function(circle) {
    var relPosVec = circle.posVec().sub2(this.posVec());
    var rr = this.r() + circle.r();
    var rrSin = this.velVec().norm().cross(relPosVec);
    var rrCos = Math.sqrt(Math.max(0.0, Math.pow(rr, 2) - Math.pow(rrSin, 2)));
    if (this.velVec().dot(relPosVec) < 0) {
        rrCos *= -1;
    }
    var rrSinVec = this.velVec().perp().scl(rrSin);
    var rrCosVec = this.velVec().scl(rrCos);
    var rrVec = rrSinVec.add(rrCosVec);
    var stopPosVec = circle.posVec().sub2(rrVec);
    return stopPosVec;
};

// ラインとの衝突停止位置ベクトル
Mover.prototype.stopPosVecToLine = function(line) {
    var relPosVec = line.posVec().sub2(this.posVec());
    var relMovVec = line.posVec().sub2(this.movVec());
    var lienDirNormVec = line.dirVec().norm();
    var lineDirNormCrossRelPos = lienDirNormVec.cross(relPosVec);
    var lineDirNormCrossRelMov = lienDirNormVec.cross(relMovVec);
    var lineNorVec = line.dirVec().perp();
    if (lineDirNormCrossRelPos >= 0) {
        lineNorVec = lineNorVec.inv();
    }
    var dist = -this.r();
    if (lineDirNormCrossRelPos * lineDirNormCrossRelMov < 0) {
        dist -= Math.abs(lineDirNormCrossRelMov);
    } else {
        dist += Math.min(
            Math.abs(lineDirNormCrossRelPos),
            Math.abs(lineDirNormCrossRelMov)
        );
    }
    var stopPosVec = this.movVec().add(lineNorVec.scl(Math.abs(dist)));
    return stopPosVec;
};

// セグメントとの衝突停止位置ベクトル
Mover.prototype.stopPosVecToSegment = function(segment) {
    var relPosVec = segment.posVec().sub2(this.posVec());
    var relEndVec = segment.endVec().sub2(this.posVec());
    if (segment.dirVec().len() === 0.0) {
        // セグメントが実質ポイントのとき
        return this.stopPosVecToPoint(new PointCollider(segment.posVec()));
    } else if (segment.dirVec().isSharp(relPosVec)) {
        // ムーバーがセグメントの始点側よりはみ出ている場合
        return this.stopPosVecToPoint(new PointCollider(segment.posVec()));
    } else if (!segment.dirVec().isSharp(relEndVec)) {
        // ムーバーがセグメントの終点側よりはみ出ている場合
        return this.stopPosVecToPoint(new PointCollider(segment.endVec()));
    } else {
        // ムーバーがセグメントの始点と終点の間にある場合
        return this.stopPosVecToLine(segment);
    }
};

// コライダーとのスライド方向ベクトル
Mover.prototype.slideDirVecTo = function(collider) {
    return (
        collider.isSegmentCollider() ? this.slideDirVecToSegment(collider) :
        collider.isLineCollider()    ? this.slideDirVecToLine(collider)    :
        collider.isCircleCollider()  ? this.slideDirVecToCircle(collider)  :
        collider.isPointCollider()   ? this.slideDirVecToPoint(collider)   :
        null
    );
};

// ポイントとのスライド方向ベクトル
Mover.prototype.slideDirVecToPoint = function(point) {
    var relPosVec = point.posVec().sub2(this.posVec());
    if (relPosVec.len() === 0.0) {
        return this.velVec().norm().inv();
    }
    var slideDirVec = relPosVec.perp().norm();
    if (this.velVec().cross(relPosVec) >= 0) {
        slideDirVec = slideDirVec.inv();
    }
    return slideDirVec;
};

// サークルとのスライド方向ベクトル
Mover.prototype.slideDirVecToCircle = function(circle) {
    return this.slideDirVecToPoint(circle);
};

// ラインとのスライド方向ベクトル
Mover.prototype.slideDirVecToLine = function(line) {
    var slideDirVec = line.dirVec().norm();
    if (this.velVec().dot(line.dirVec()) < 0) {
        slideDirVec = slideDirVec.inv();
    }
    return slideDirVec;
};

// セグメントとの衝突停止位置ベクトル
Mover.prototype.slideDirVecToSegment = function(segment) {
    var relPosVec = segment.posVec().sub2(this.posVec());
    var relEndVec = segment.endVec().sub2(this.posVec());
    if (segment.dirVec().len() === 0.0) {
        // セグメントが実質ポイントのとき
        return this.slideDirVecToPoint(new PointCollider(segment.posVec()));
    } else if (segment.dirVec().isSharp(relPosVec)) {
        // ムーバーがセグメントの始点側よりはみ出ている場合
        return this.slideDirVecToPoint(new PointCollider(segment.posVec()));
    } else if (!segment.dirVec().isSharp(relEndVec)) {
        // ムーバーがセグメントの終点側よりはみ出ている場合
        return this.slideDirVecToPoint(new PointCollider(segment.endVec()));
    } else {
        // ムーバーがセグメントの始点と終点の間にある場合
        return this.slideDirVecToLine(segment);
    }
};

// 接触距離
Mover.prototype.touchDistance = function() {
    return this.r();
};

// 衝突距離
Mover.prototype.collideDistance = function() {
    return 0.0;
};

// 重複距離
Mover.prototype.overlapDistance = function() {
    return -this.r();
};

// 方向ベクトルの更新
Mover.prototype.updateDirection = function() {
    this.dirVec().setDir(this.innVelVec().dir());
};

// コライダーアクションの更新
Mover.prototype.updateColliderAction = function() {
    return;
};

// コライダーキーの更新
Mover.prototype.updateColliderKeys = function() {
    return;
};

// 衝突マップ情報の更新
Mover.prototype.updateCollisionMap = function() {
    this.deregistrateKeys();
    this.registrateKeys();
};

// 効果速度ベクトルの更新
Mover.prototype.updateEffectVelocity = function() {
    this.effVelVec().setLen(0.0);
    if (this.isAnchor()) { return; }
    this._collideColliderKeys.forEach(function(key) {
        var collider = CollisionMap.getCollider(key);
        if (collider.canPush(this)) {
            var pushEffVelVec = this.pushEffectVelocity(collider);
            this.setEffVelVec(this.effVelVec().add(pushEffVelVec));
        }
    }, this);
};

// 効果速度ベクトルの更新
Mover.prototype.pushEffectVelocity = function(collider) {
    var distance = this.distanceTo(collider);
    var pushVecLen = Math.max(
        Math.min(1.0 / 64.0, Math.abs(distance)),
        Math.abs(distance) / 4.0
    );
    var pushVecDir = this.posVec().sub2(collider.posVec()).dir();
    return new PolarVector(pushVecLen, pushVecDir);
};

// 正面判定(ポイントとサークルのみ対応)
Mover.prototype.isFrontOf = function(collider) {
    if (!collider.dirVec) { return false; }
    var relPosVec = this.posVec().sub2(collider.posVec());
    return collider.dirVec().cos(relPosVec) >= Math.cos(Math.PI / 4.0);
};

// 座標一致判定
Mover.prototype.isMatch = function(collider) {
    return (
        this._matchColliderKeys.some(function(key) {
            return CollisionMap.getCollider(key) === collider;
        }, this)
    );
};

// 目標座標接触判定(サークルのみ対応)
Mover.prototype.isOnDestination = function() {
    if (!$gameTemp.isDestinationValid()) { return false; }
    var destPosVec = new RectVector(
        $gameTemp.destinationX() + 0.5,
        $gameTemp.destinationY() + 0.5
    );
    var relPosVec = this.posVec().sub2(destPosVec);
    return relPosVec.len() <= this.r();
};

//-----------------------------------------------------------------------------
// CharacterMover
//
// キャラクタームーバー

function CharacterMover() {
    this.initialize.apply(this, arguments);
};

CharacterMover.prototype = Object.create(Mover.prototype);
CharacterMover.prototype.constructor = CharacterMover;

// ラジアン方向を8方向に変換
CharacterMover.dirToDir8 = function(radian) {
    var piDiv8 = Math.PI / 8.0;
    return (
        radian < piDiv8 * -7.0 ? 4 :
        radian < piDiv8 * -5.0 ? 7 :
        radian < piDiv8 * -3.0 ? 8 :
        radian < piDiv8 * -1.0 ? 9 :
        radian < piDiv8 *  1.0 ? 6 :
        radian < piDiv8 *  3.0 ? 3 :
        radian < piDiv8 *  5.0 ? 2 :
        radian < piDiv8 *  7.0 ? 1 :
        4
    );
};

// 8方向をラジアン方向に変換
CharacterMover.dir8ToDir = function(dir8) {
    var x = (dir8 % 3 === 0 ? 1.0 : (dir8 % 3 === 1 ? -1.0 : 0.0));
    var y = (dir8 / 3 <=  1 ? 1.0 : (dir8 / 3 >   2 ? -1.0 : 0.0));
    return Math.atan2(y, x);
};

// ラジアン方向を4方向に変換
CharacterMover.dirToDir4 = function(radian) {
    var piDiv4 = Math.PI / 4.0;
    return (
        radian < piDiv4 * -3.0 ? 4 :
        radian < piDiv4 * -1.0 ? 8 :
        radian < piDiv4 *  1.0 ? 6 :
        radian < piDiv4 *  3.0 ? 2 :
        4
    );
};

// 4方向をラジアン方向に変換
CharacterMover.dir4ToDir = function(dir4) {
    return this.dir8ToDir(dir4);
};

// 8方向を4方向に変換
CharacterMover.dir8ToDir4 = function(dir8, dir4) {
    return (
        dir8 % 2 === 0 ? dir8 :
        dir8 === 7 ? (dir4 === 6 ? 8 : 4) :
        dir8 === 9 ? (dir4 === 2 ? 6 : 8) :
        dir8 === 3 ? (dir4 === 4 ? 2 : 6) :
        dir8 === 1 ? (dir4 === 8 ? 4 : 2) :
        2
    );
};

// オブジェクト初期化
CharacterMover.prototype.initialize = function() {
    Mover.prototype.initialize.call(this);
    this.initMoveState(); // 移動状態の初期化
    this.initLeapingMoveParameter(); // リープ移動パラメータの初期化
    this.initKnockingbackMoveParameter(); // ノックバック移動パラメータの初期化
    this._iDpf = 0.0; // フレーム間累積移動距離
};

// 衝突フラグの初期化
CharacterMover.prototype.initFlags = function() {
    this._through = false; // すり抜け 
    this._push = false; // 押し込み
    this._anchor = false; // 位置固定
};

// ベクトルの初期化
CharacterMover.prototype.initVectors = function() {
    Mover.prototype.initVectors.call(this);
    this._lastPosVec = this.posVec().clone(); // 前回フレームの位置ベクトル
};

// 移動状態の初期化
CharacterMover.prototype.initMoveState = function() {
    this._moveState = ['normal', 'leaping', 'knockingback'][0]; // 移動状態
};

// リープ状態パラメータの初期化
CharacterMover.prototype.initLeapingMoveParameter = function() {
    this._leapingDur = 0; // リープ状態継続時間
    this._leapingCnt = 0; // リープ状態フレームカウント
};

// ノックバック状態パラメータの初期化
CharacterMover.prototype.initKnockingbackMoveParameter = function() {
    this._knockingbackDur = 0; // ノックバック状態継続時間
    this._knockingbackCnt = 0; // ノックバック状態フレームカウント
};

// 前回フレームの位置ベクトル
CharacterMover.prototype.lastPosVec = function() {
    return this._lastPosVec;
};

// 前回フレームの位置ベクトルの設定
CharacterMover.prototype.setLastPosVec = function(lastPosVec) {
    this._lastPosVec = lastPosVec;
};

// オブジェクト実体
CharacterMover.prototype.content = function() {
    return $gamePlayer;
};

// フレーム間累積移動距離
CharacterMover.prototype.integralDpf = function() {
    return this._iDpf;
};

// リープ状態フレーム間移動距離
CharacterMover.prototype.leapingMoveDpf = function() {
    return this.content().leapDistancePerFrame();
};

// オブジェクト実体のX座標
CharacterMover.prototype.contentRealX = function() {
    return this.content().realX();
};

// オブジェクト実体のY座標
CharacterMover.prototype.contentRealY = function() {
    return this.content().realY();
};

// オブジェクト実体のフレーム間移動距離
CharacterMover.prototype.contentDpf = function() {
    if (this.content().isJumping()) {
        return this.content().jumpDistancePerFrame();
    } else {
        return this.content().distancePerFrame();
    }
};

// オブジェクト実体の方向ラジアン
CharacterMover.prototype.contentDir = function() {
    return CharacterMover.dir8ToDir(this.content().direction());
};

// オブジェクト実体のサイズ(タイル)
CharacterMover.prototype.contentSize = function() {
    return 1.0;
};

// 8方向
CharacterMover.prototype.dir8 = function() {
    return CharacterMover.dirToDir8(this.dirVec().dir());
};

// 4方向
CharacterMover.prototype.dir4 = function() {
    return CharacterMover.dirToDir4(this.dirVec().dir());
};

// 内部状態
CharacterMover.prototype.moveState = function() {
    return this._moveState;
};

// 内部状態の設定
CharacterMover.prototype.setMoveState = function(moveState) {
    this._moveState = moveState;
};

// オブジェクト実体の移動可能判定
CharacterMover.prototype.canMove = function() {
    return (
        this.content().canMove() &&
        !SceneManager.isSceneChanging()
    );
};

// 移動中判定
CharacterMover.prototype.isMoving = function() {
    return this.posVec().sub2(this.lastPosVec()).len() >= Collider.errMargin;
};

// 通常状態判定
CharacterMover.prototype.isNormalMoveState = function() {
    return this._moveState === 'normal';
};

// リープ状態判定
CharacterMover.prototype.isLeapingMoveState = function() {
    return this._moveState === 'leaping';
};

// リープ状態継続判定
CharacterMover.prototype.checkLeapingMoveState = function() {
    return this._leapingCnt < this._leapingDur;
};

// ノックバック状態判定
CharacterMover.prototype.isKnockingbackMoveState = function() {
    return this._moveState === 'knockingback';
};

// ノックバック状態継続判定
CharacterMover.prototype.checkKnockingbackMoveState = function() {
    return this._knockingbackCnt < this._knockingbackDur;
};

// 残像必要判定
CharacterMover.prototype.needsResidual = function() {
    return this.isLeapingMoveState() && this._leapingCnt % 2 === 0;
};

// コライダー押出判定
CharacterMover.prototype.canPush = function(collider) {
    return (
        Mover.prototype.canPush.call(this, collider) &&
        collider.isCharacterMover() &&
        !collider.isMatch(this)
    );
};

// フレーム更新
CharacterMover.prototype.update = function() {
    this.updateLastPosVec();
    Mover.prototype.update.call(this);
    this.updateState();
    this.updateIntegralDpf();
};

// 内部速度の更新
CharacterMover.prototype.updateInnerVelocity = function() {
    if (this.isNormalMoveState()) {
        Mover.prototype.updateInnerVelocity.call(this);
    }
};

// フレーム間累積移動距離の更新
CharacterMover.prototype.updateIntegralDpf = function() {
    if (this.isNormalMoveState()) {
        this._iDpf = this.posVec().sub2(this.lastPosVec()).len();
    } else if (this.isLeapingMoveState()){
        this._iDpf = 0.0;
    } else if (this.isKnockingbackMoveState()) {
        this._iDpf = 0.0;
    }
};

// 前回フレームの位置ベクトルの更新
CharacterMover.prototype.updateLastPosVec = function() {
    this.setLastPosVec(this.posVec().clone());
};

// 内部状態による更新
CharacterMover.prototype.updateState = function() {
    if (this.isNormalMoveState()) {
        this.updateNormalMove();
    } else if (this.isLeapingMoveState()) {
        this.updateLeapingMove();
    } else if (this.isKnockingbackMoveState()) {
        this.updateKnockingbackMove();
    }
};

// 通常状態の更新
CharacterMover.prototype.updateNormalMove = function() {
    return;
};

// リープ状態の更新
CharacterMover.prototype.updateLeapingMove = function() {
    if (this.checkLeapingMoveState()) {
        this.checkAnotherCharacterStartKnockingback();
        this._leapingCnt++;
    } else {
        this.endLeapingState();
    }
};

// ノックバック状態の更新
CharacterMover.prototype.updateKnockingbackMove = function() {
    if (this.checkKnockingbackMoveState()) {
        this.checkAnotherCharacterStartKnockingback();
        this._knockingbackCnt++;
    } else {
        this.endKnockingbackState();
    }
};

// 他キャラクターのノックバック開始確認
CharacterMover.prototype.checkAnotherCharacterStartKnockingback = function() {
    this._collideColliderKeys.forEach(function(key) {
        var collider = CollisionMap.getCollider(key);
        if (collider.isCharacterMover() &&
            this.canCollide(collider) &&
            !collider.isKnockingbackMoveState() &&
            !collider.isLeapingMoveState())
        {
            var relPosVec = collider.posVec().sub2(this.posVec());
            var nkVel = this.innVelVec().len();
            var nkDir = relPosVec.dir();
            var nkDur = 10;
            collider.startKnockingbackMove(nkVel, nkDir, nkDur);
        }
    }, this);
};

// リープ状態開始
CharacterMover.prototype.startLeapingMove = function(vel, dir, dur) {
    this.setInnVelVec(new PolarVector(vel, dir));
    this._leapingDur = dur;
    this._leapingCnt = 0;
    SoundManager.playLeap();
    this.setMoveState('leaping');
};

// リープ状態終了
CharacterMover.prototype.endLeapingState = function() {
    this._leapingDur = 0;
    this._leapingCnt = 0;
    this.setMoveState('normal');
};

// ノックバック状態開始
CharacterMover.prototype.startKnockingbackMove = function(vel, dir, dur) {
    this.setInnVelVec(new PolarVector(vel, dir));
    this._knockingbackDur = dur;
    this._knockingbackCnt = 0;
    SoundManager.playKnockback();
    this.setMoveState('knockingback');
};

// ノックバック状態終了
CharacterMover.prototype.endKnockingbackState = function() {
    this._knockingbackDur = 0;
    this._knockingbackCnt = 0;
    this.setMoveState('normal');
};

//-----------------------------------------------------------------------------
// PlayerMover
//
// プレイヤームーバー

function PlayerMover() {
    this.initialize.apply(this, arguments);
};

PlayerMover.prototype = Object.create(CharacterMover.prototype);
PlayerMover.prototype.constructor = PlayerMover;

// コライダーキーの初期化
PlayerMover.prototype.initKeys = function() {
    CharacterMover.prototype.initKeys.call(this);
    this._touchEventMoverKeys = []; // 接触距離のイベントムーバー
    this._collideEventMoverKeys  = []; // 衝突距離のイベントムーバー
    this._overlapEventMoverKeys  = []; // 重複距離のイベントムーバー
    this._destTouchEventMoverKeys = []; // 目標座標接触距離のイベントムーバー
    this._destOverlapEventMoverKeys  = []; // 目標座標重複距離のイベントムーバー
    this._touchStartedEventMoverKeys = []; // 起動済接触距離のイベントムーバー
    this._collideStartedEventMoverKeys  = []; // 起動済衝突距離のイベントムーバー
    this._overlapStartedEventMoverKeys  = []; // 起動済重複距離のイベントムーバー
    this._touchVihecleMoverKeys = []; // 接触距離の乗り物ムーバー
    this._overlapVihecleMoverKeys  = []; // 重複距離の乗り物ムーバー
};

// 起動済接触距離のイベントムーバーキー
PlayerMover.prototype.touchStartedEventMoverKeys = function() {
    return this._touchStartedEventMoverKeys;
};

// 起動済衝突距離のイベントムーバーキー
PlayerMover.prototype.collideStartedEventMoverKeys = function() {
    return this._collideStartedEventMoverKeys;
};

// 起動済重複距離のイベントムーバーキー
PlayerMover.prototype.overlapStartedEventMoverKeys = function() {
    return this._overlapStartedEventMoverKeys;
};

// イベントの取得
PlayerMover.prototype.getEvent = function(key) {
    return this.getCharacter(key)
};

// 乗り物の取得
PlayerMover.prototype.getVehicle = function(key) {
    return this.getCharacter(key)
};

// キャラクターの取得
PlayerMover.prototype.getCharacter = function(key) {
    if (!key) { return null; }
    var mover = CollisionMap.getCollider(key);
    if (!mover) { return null; }
    return mover.content();
};

// フレーム更新
PlayerMover.prototype.update = function() {
    CharacterMover.prototype.update.call(this);
    this.updateDestination();
    // this.checkEventTrigger();
};

// 目標座標の更新
PlayerMover.prototype.updateTargetPosition = function() {
    CharacterMover.prototype.updateTargetPosition.call(this);
    if (this.canMove()) {
        if ($gameTemp.isDestinationValid()) {
            // タッチパッドによる目標座標
            var tarX = $gameTemp.destinationX() + this.r();
            var tarY = $gameTemp.destinationY() + this.r();
            var tarPosVec = new RectVector(tarX, tarY);
            this.setTarPosVec(tarPosVec);
        } else {
            // 入力なし時
            this.setTarPosVec(null);
        }
    }
};

// 目標速度の更新
PlayerMover.prototype.updateTargetVelocity = function() {
    CharacterMover.prototype.updateTargetVelocity.call(this);
    if (this.canMove()) {
        if (!!Input.leftStick.tilt) {
            // アナログスティック方向入力時
            this.tarVelVec().setLen(this.contentDpf() * Input.leftStick.tilt);
            this.tarVelVec().setDir(Input.leftStick.dir);
        } else if (!!Input.dir8) {
            // 方向キー入力時
            this.tarVelVec().setLen(this.contentDpf());
            this.tarVelVec().setDir(CharacterMover.dir8ToDir(Input.dir8));
        }
    }
};

// 目標速度の更新
PlayerMover.prototype.updateDestination = function() {
    if (!this.canMove() || !this.isMoving() ||
        !!Input.dir8 || !!Input.leftStick.tilt)
    {
        $gameTemp.clearDestination();
    }
};

// 通常状態の更新
PlayerMover.prototype.updateNormalMove = function() {
    if (Input.isTriggered('pagedown') && this.canMove()) {
        this.startLeapingMove(this.leapingMoveDpf(), this.tarVelVec().dir(), 10);
    }
};

// リープ状態の更新
PlayerMover.prototype.updateLeapingMove = function() {
    CharacterMover.prototype.updateLeapingMove.call(this);
    if (!Input.isPressed('pagedown') || !this.canMove()) {
        this.endLeapingState();
    }
};

// コライダーキーの更新
PlayerMover.prototype.updateColliderKeys = function() {
    CharacterMover.prototype.updateColliderKeys.call(this);
    // 接触距離のイベントムーバー
    this._touchEventMoverKeys = this._touchColliderKeys.filter(
        function(key) {
            var collider = CollisionMap.getCollider(key);
            return (
                this.indexOfKey(this._matchColliderKeys, key) === -1 &&
                this.indexOfKey(this._touchStartedEventMoverKeys, key) === -1 &&
                collider.isEventMover() &&
                collider.isFrontOf(this)
            );
        }, this
    );
    // 衝突距離のイベントムーバー
    this._collideEventMoverKeys = this._collideColliderKeys.filter(
        function(key) {
            var collider = CollisionMap.getCollider(key);
            return (
                this.indexOfKey(this._matchColliderKeys, key) === -1 &&
                this.indexOfKey(this._collideStartedEventMoverKeys, key) === -1 &&
                collider.isEventMover() &&
                !this.isThrough(collider)
            );
        }, this
    );
    // 重複距離のイベントムーバー
    this._overlapEventMoverKeys = this._overlapColliderKeys.filter(
        function(key) {
            var collider = CollisionMap.getCollider(key);
            return (
                this.indexOfKey(this._matchColliderKeys, key) === -1 &&
                this.indexOfKey(this._overlapStartedEventMoverKeys, key) === -1 &&
                collider.isEventMover()
            );
        }, this
    );
    // 目標座標接触距離のイベントムーバー
    this._destTouchEventMoverKeys = this._touchEventMoverKeys.filter(
        function(key) {
            var collider = CollisionMap.getCollider(key);
            return (
                collider.isOnDestination()
            );
        }, this
    );
    // 目標座標重複距離のイベントムーバー
    this._destOverlapEventMoverKeys = this._overlapEventMoverKeys.filter(
        function(key) {
            var collider = CollisionMap.getCollider(key);
            return (
                collider.isOnDestination()
            );
        }, this
    );
    // 起動済接触距離のイベントムーバー
    this._touchStartedEventMoverKeys = this._touchStartedEventMoverKeys.filter(
        function(key, index) {
            var collider = CollisionMap.getCollider(key);
            return (
                !!collider &&
                this.indexOfKey(this._touchStartedEventMoverKeys, key) === index &&
                collider.isFrontOf(this) &&
                this.distanceTo(collider) <= this.touchDistance()
            );
        }, this
    );
    // 起動済衝突距離のイベントムーバー
    this._collideStartedEventMoverKeys = this._collideStartedEventMoverKeys.filter(
        function(key, index) {
            var collider = CollisionMap.getCollider(key);
            return (
                !!collider &&
                this.indexOfKey(this._collideStartedEventMoverKeys, key) === index && 
                this.distanceTo(collider) <= this.collideDistance()
            );
        }, this
    );
    // 起動済重複距離のイベントムーバー
    this._overlapStartedEventMoverKeys = this._overlapStartedEventMoverKeys.filter(
        function(key, index) {
            var collider = CollisionMap.getCollider(key);
            return (
                !!collider &&
                this.indexOfKey(this._overlapStartedEventMoverKeys, key) === index && 
                this.distanceTo(collider) <= this.overlapDistance()
            );
        }, this
    );
    // 接触距離の乗り物ムーバー
    this._touchVihecleMoverKeys = this._touchColliderKeys.filter(
        function(key) {
            var collider = CollisionMap.getCollider(key);
            return (
                collider.isVehicleMover() &&
                collider.isFrontOf(this)
            );
        }, this
    );
    // 重複距離の乗り物ムーバー
    this._overlapVihecleMoverKeys = this._overlapColliderKeys.filter(
        function(key) {
            var collider = CollisionMap.getCollider(key);
            return (
                collider.isVehicleMover()
            );
        }, this
    );
};

// コライダーアクションの更新
PlayerMover.prototype.updateColliderAction = function() {
    CharacterMover.prototype.updateColliderAction.call(this);
    this.checkEventTrigger();
};

// イベントトリガーの確認
PlayerMover.prototype.checkEventTrigger = function() {
    if (!$gamePlayer.canMove() || !$gamePlayer.canStartLocalEvents()) { return false; }
    var key = null;
    var triggers = [];
    if (Input.isTriggered('ok')) {
        triggers = [0]; // 決定ボタントリガー
        key = this._overlapEventMoverKeys[0]; // 重複イベント
        if (this.checkEventStart(key, triggers, false)) {
            this._overlapEventMoverKeys.shift();
            return true;
        }
        key = this._touchEventMoverKeys[0]; // 接触イベント
        if (this.checkEventStart(key, triggers, true)) {
            this._touchEventMoverKeys.shift();
            return true;
        }
        key = this._touchVihecleMoverKeys[0]; // 接触乗り物
        if (this.checkVehicle(key)) {
            this._touchVihecleMoverKeys.shift();
            return true;
        }
        key = this._overlapVihecleMoverKeys[0]; // 重複乗り物
        if (this.checkVehicle(key)) {
            this._overlapVihecleMoverKeys.shift();
            return true;
        }
    }
    if ($gameTemp.isDestinationValid()) {
        triggers = [0]; // タッチ決定トリガー
        key = this._destOverlapEventMoverKeys[0]; // 目標座標重複イベント
        if (this.checkEventStart(key, triggers, false)) {
            // this._overlapStartedEventMoverKeys.push(key);
            this._destOverlapEventMoverKeys.shift();
            return true;
        }
        key = this._destTouchEventMoverKeys[0]; // 目標座標接触イベント
        if (this.checkEventStart(key, triggers, true)) {
            // this._touchStartedEventMoverKeys.push(key);
            this._destTouchEventMoverKeys.shift();
            return true;
        }
        triggers = [1, 2]; // タッチ接触トリガー
        key = this._destOverlapEventMoverKeys[0]; // 目標座標重複イベント
        if (this.checkEventStart(key, triggers, false)) {
            this._overlapStartedEventMoverKeys.push(key);
            this._destOverlapEventMoverKeys.shift();
            return true;
        }
        key = this._destTouchEventMoverKeys[0]; // 目標座標接触イベント
        if (this.checkEventStart(key, triggers, true)) {
            this._touchStartedEventMoverKeys.push(key);
            this._destTouchEventMoverKeys.shift();
            return true;
        }
    }
    triggers = [1, 2]; // 接触トリガー
    key = this._overlapEventMoverKeys[0]; // 重複イベント
    if (this.checkEventStart(key, triggers, false)) {
        this._overlapStartedEventMoverKeys.push(key);
        this._overlapEventMoverKeys.shift();
        return true;
    }
    key = this._collideEventMoverKeys[0]; // 衝突イベント
    if (this.checkEventStart(key, triggers, true))  {
        this._collideStartedEventMoverKeys.push(key);
        this._collideEventMoverKeys.shift();
        return true;
    }
    return false;
};

// イベント起動の確認
PlayerMover.prototype.checkEventStart = function(key, triggers, normal) {
    var event = this.getEvent(key);
    if (!!event &&
        event.isTriggerIn(triggers) &&
        event.isNormalPriority() === normal)
    {
        event.start();
        $gameMap.setupStartingEvent();
        return true;
    }
    return false;
};

// 乗り物の確認
PlayerMover.prototype.checkVehicle = function(key) {
    var vehicle = this.getVehicle(key);
    if (!!vehicle) {
        $gamePlayer.getOnOffVehicle();
        return true;
    }
    return false;
};

// 乗り物へ乗り込む(未実装)
PlayerMover.prototype.getOnVehicle = function() {
    return;
};

// 乗り物から降りる(未実装)
PlayerMover.prototype.getOffVehicle = function() {
    return;
};

// 衝突可否判定
PlayerMover.prototype.canCollide = function(collider) {
    return (
        CharacterMover.prototype.canCollide.call(this, collider) &&
        !collider.isFollowerMover() ||
        collider.isVehicleMover() &&
        !collider.isAirshipMover()
    );
};

//-----------------------------------------------------------------------------
// FollowerMover
//
// フォロワームーバー

function FollowerMover() {
    this.initialize.apply(this, arguments);
};

FollowerMover.prototype = Object.create(CharacterMover.prototype);
FollowerMover.prototype.constructor = FollowerMover;

// オブジェクト初期化
FollowerMover.prototype.initialize = function(memberIndex) {
    this._memberIndex = memberIndex;
    CharacterMover.prototype.initialize.call(this);
};

// オブジェクト実体
FollowerMover.prototype.content = function() {
    return $gamePlayer.followers().follower(this._memberIndex - 1);
};

// 前のキャラクター
FollowerMover.prototype.precedingCharacter = function() {
    return (this._memberIndex > 1 ?
        $gamePlayer.followers().follower(this._memberIndex - 2) :
        $gamePlayer
    );
};

// 目標座標の更新
FollowerMover.prototype.updateTargetPosition = function() {
    CharacterMover.prototype.updateTargetPosition.call(this);
    if ($gamePlayer.areFollowersGathering()) {
        // フォロワー集合時
        this.setTarPosVec($gamePlayer.mover().posVec());
    } else if (this.canMove()) {
        // 移動可能時
        var tarMov = this.precedingCharacter().mover();
        var tarRelPosVec = tarMov.posVec().sub2(this.posVec());
        var tarRelPosVecLen = this.r() + tarMov.r();
        if (tarRelPosVec.len() > tarRelPosVecLen) {
            var tarPosVec = tarMov.posVec().sub2(tarRelPosVec.scl(tarRelPosVecLen));
            this.setTarPosVec(tarPosVec);
        }
    }
};

// 衝突可否判定
FollowerMover.prototype.canCollide = function(collider) {
    return (
        CharacterMover.prototype.canCollide.call(this, collider) &&
        !collider.isCharacterMover() ||
        collider.isVehicleMover() &&
        !collider.isAirshipMover()
    );
};

// 押し出し可否判定
FollowerMover.prototype.canPush = function(collider) {
    return (
        CharacterMover.prototype.canPush.call(this, collider) &&
        !collider.isPlayerMover()
    );
};

//-----------------------------------------------------------------------------
// VehicleMover
//
// ビークルムーバー

function VehicleMover() {
    this.initialize.apply(this, arguments);
};

VehicleMover.prototype = Object.create(CharacterMover.prototype);
VehicleMover.prototype.constructor = VehicleMover;

// オブジェクト初期化
VehicleMover.prototype.initialize = function(type) {
    this._type = type;
    CharacterMover.prototype.initialize.call(this);
};

// オブジェクト実体
VehicleMover.prototype.content = function() {
    return $gameMap.vehicle(this._type);
};

// フレーム更新
VehicleMover.prototype.update = function() {
    this.updateMove();
    this.updateDirection();
};

// 移動の更新
VehicleMover.prototype.updateMove = function() {
    if ($gamePlayer.vehicleType() === this._type) {
        this.setPosVec($gamePlayer.mover().posVec());
    }
};

// 方向ベクトルの更新
VehicleMover.prototype.updateDirection = function() {
    if ($gamePlayer.vehicleType() === this._type) {
        this.setDirVec($gamePlayer.mover().dirVec());
    }
};

//-----------------------------------------------------------------------------
// EventMover
//
// イベントムーバー

function EventMover() {
    this.initialize.apply(this, arguments);
};

EventMover.prototype = Object.create(CharacterMover.prototype);
EventMover.prototype.constructor = EventMover;

// オブジェクト初期化
EventMover.prototype.initialize = function(eventId) {
    this._eventId = eventId;
    CharacterMover.prototype.initialize.call(this);
};

// コライダーキーの初期化
EventMover.prototype.initKeys = function() {
    CharacterMover.prototype.initKeys.call(this);
    this._touchPlayerMoverKey = null;   // 接触距離のプレイヤームーバー
    this._collidePlayerMoverKey = null; // 衝突距離のプレイヤームーバー
    this._overlapPlayerMoverKey = null; // 重複距離のプレイヤームーバー
};

// オブジェクト実体
EventMover.prototype.content = function() {
    return $gameMap.event(this._eventId);
};

// 接触距離のプレイヤームーバーキー
EventMover.prototype.touchPlayerMoverKey = function() {
    return this._touchPlayerMoverKey;
};

// 衝突距離のプレイヤームーバーキー
EventMover.prototype.collidePlayerMoverKey = function() {
    return this._collidePlayerMoverKey;
};

// 重複距離のプレイヤームーバーキー
EventMover.prototype.overlapPlayerMoverKey = function() {
    return this._overlapPlayerMoverKey;
};

// フレーム更新
EventMover.prototype.update = function() {
    CharacterMover.prototype.update.call(this);
};

// コライダーキーの更新
EventMover.prototype.updateColliderKeys = function() {
    CharacterMover.prototype.updateColliderKeys.call(this);
    // 接触距離のプレイヤームーバー
    this._touchPlayerMoverKey = this._touchColliderKeys.filter(
        function(key) {
            var collider = CollisionMap.getCollider(key);
            return (
                collider.isPlayerMover() &&
                collider.isFrontOf(this)
            );
        }, this
    )[0] || null;
    // 衝突距離のプレイヤームーバー
    this._collidePlayerMoverKey = this._collideColliderKeys.filter(
        function(key) {
            var collider = CollisionMap.getCollider(key);
            return (
                collider.isPlayerMover() &&
                !this.isThrough(collider)
            );
        }, this
    )[0] || null;
    // 重複距離のプレイヤームーバー
    this._overlapPlayerMoverKey = this._overlapColliderKeys.filter(
        function(key) {
            var collider = CollisionMap.getCollider(key);
            return (
                collider.isPlayerMover()
            );
        }, this
    )[0] || null;
};

//-----------------------------------------------------------------------------
// Game_CharacterBase
//
// キャラクターベース

// メンバ変数の初期化
var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this._stepDistance = 0.0;
    this._jumpDistancePerFrame = 0.0;
};

// アナログムーブの取得
Game_CharacterBase.prototype.mover = function() {
    if (!this._mover ||
        !this._mover.isCurrentVersion ||
        !this._mover.isCurrentVersion())
    {
        this.initMover();
    }
    return this._mover;
};

// ムーバーの初期化
Game_CharacterBase.prototype.initMover = function() {
    this._mover = new CharacterMover();
};

// 実X座標
Game_CharacterBase.prototype.realX = function() {
    return this._realX;
};

// 実Y座標
Game_CharacterBase.prototype.realY = function() {
    return this._realY;
};

// プライオリティタイプ
Game_CharacterBase.prototype.priorityType = function() {
    return this._priorityType;
};

// ジャンプ時のフレーム間移動距離
Game_CharacterBase.prototype.jumpDistancePerFrame = function() {
    return this._jumpDistancePerFrame;
};

// リープ時のフレーム間移動距離
Game_CharacterBase.prototype.leapDistancePerFrame = function() {
    return (Math.pow(2, this._moveSpeed) / 256) * 4;
};

// フレーム更新
var _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
    this.updateMover();
    this.updatePosition();
    this.updateDirection();
    this.updateWalkDistance();
    this.updateJump();
    this.updateStop();
    this.updateAnimation();
};

// ムーバーの更新
Game_CharacterBase.prototype.updateMover = function() {
    this.mover().update();
};

// XY座標の更新
Game_CharacterBase.prototype.updatePosition = function() {
    this._realX = this.mover().realX();
    this._realY = this.mover().realY();
    this._x = Math.round(this._realX);
    this._y = Math.round(this._realY);
};

// 方向の更新
Game_CharacterBase.prototype.updateDirection = function() {
    if (!this.isDirectionFixed()) {
        this._direction = this.isOnLadder() ? 8 : this.mover().dir4();
    }
};

// 停止時の更新
var _Game_CharacterBase_updateStop = Game_CharacterBase.prototype.updateStop;
Game_CharacterBase.prototype.updateStop = function() {
    if (!this.checkStop(this.stopCountThreshold()) && this.isStopping()) {
        this._stopCount++;
    }
};

// ジャンプ時の更新
var _Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
Game_CharacterBase.prototype.updateJump = function() {
    if (this.isJumping()) {
        this._jumpCount--;
    }
};

// 歩行アニメの更新
var _Game_CharacterBase_updatePattern = Game_CharacterBase.prototype.updatePattern;
Game_CharacterBase.prototype.updatePattern = function() {
    if (this.hasStepAnime() || !this.isStopping()) {
        this._pattern = (this._pattern + 1) % this.maxPattern();
    } else {
        this.resetPattern();
    }
};

// 歩行距離の更新
Game_CharacterBase.prototype.updateWalkDistance = function() {
    this._stepDistance += this.mover().integralDpf();
    while (this._stepDistance >= 1.0) {
        this.onStep();
        this._stepDistance -= 1.0;
    }
};

// 茂み深さ
Game_CharacterBase.prototype.bushDepth = function() {
    return this.isOnBush() && !this.isJumping() && this.isNormalPriority() ? 12 : 0;
};

// 歩行時の処理
Game_CharacterBase.prototype.onStep = function() {
    return;
};

// 停止カウント閾値
Game_CharacterBase.prototype.stopCountThreshold = function() {
    return 0;
}

// 移動中判定
var _Game_CharacterBase_isMoving = Game_CharacterBase.prototype.isMoving;
Game_CharacterBase.prototype.isMoving = function() {
    return this.mover().isMoving();
};

// 移動可能判定
Game_CharacterBase.prototype.canMove = function() {
    return $gamePlayer.canMove();
};

// 移動成功判定
Game_CharacterBase.prototype.isMovementSucceeded = function() {
    return !this.isMoving() && !this.isJumping();
};

// 位置の設定
var _Game_CharacterBase_setPosition = Game_CharacterBase.prototype.setPosition;
Game_CharacterBase.prototype.setPosition = function(x, y) {
    _Game_CharacterBase_setPosition.call(this, x, y);
    if (!!this._mover) {
        var newX = x + this.mover().r();
        var newY = y + this.mover().r();
        this.mover().setPosVec(new RectVector(newX, newY));
    }
};

// 位置のコピー
var _Game_CharacterBase_copyPosition = Game_CharacterBase.prototype.copyPosition;
Game_CharacterBase.prototype.copyPosition = function(character) {
    this.setPosition(character.realX(), character.realY());
    this.setDirection(character.direction());
};

// 方向の設定
var _Game_CharacterBase_setDirection = Game_CharacterBase.prototype.setDirection;
Game_CharacterBase.prototype.setDirection = function(dir8) {
    if (!!this._mover) {
        var dir = CharacterMover.dir8ToDir(dir8);
        this.setDirectionByRad(dir);
    }
};

// 方向の設定(ラジアン)
Game_CharacterBase.prototype.setDirectionByRad = function(dir) {
    this.mover().tarVelVec().setDir(dir);
    this.mover().innVelVec().setDir(dir);
    this.mover().dirVec().setDir(dir);
    this.resetStopCount();
};

// 移動(相対座標)
Game_CharacterBase.prototype.moveByRelPos = function(x, y) {
    var posVec = this.mover().posVec();
    var tarX = posVec.x() + x;
    var tarY = posVec.y() + y;
    this.mover().setTarPos(tarX, tarY);
    this.resetStopCount();
};

// 一歩移動(ラジアン)
Game_CharacterBase.prototype.moveByRad = function(dir) {
    var relPosVec = new PolarVector(1.0, dir).toRect();
    var tarPosVec = this.mover().posVec().add(relPosVec);
    this.mover().setTarPosVec(tarPosVec);
    this.resetStopCount();
};

// ジャンプ
var _Game_CharacterBase_jump = Game_CharacterBase.prototype.jump;
Game_CharacterBase.prototype.jump = function(x, y) {
    var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    this._jumpPeak = 10 + distance - this._moveSpeed;
    this._jumpCount = Math.round(this._jumpPeak * 2);
    this._jumpDistancePerFrame = distance / this._jumpCount;
    this.moveByRelPos(x, y);
    this.straighten();
    this.resetStopCount();
};

//-----------------------------------------------------------------------------
// Game_Character
//
// キャラクター

// 移動ルートコマンド
Game_Character.prototype.currentMoveCommand = function() {
    return this._moveRoute.list[this._moveRouteIndex];
};

// 停止中判定
Game_Character.prototype.isStopping = function() {
    return !this.isMoving() && !this.isJumping() && !this.isWaiting();
};

// ウェイト判定
Game_Character.prototype.isWaiting = function() {
    return this._waitCount > 0;
};

// 移動ルートコマンド処理中判定
Game_Character.prototype.isRouting = function() {
    return this.isMoving() || this.isJumping() || this.isWaiting();
};

// 移動ルートコマンドスキップ判定
Game_Character.prototype.shouldSkipMoveCommand = function() {
    return this._moveRoute.skippable && !this.isMoving();
};

// フレーム更新
var _Game_Character_update = Game_Character.prototype.update;
Game_Character.prototype.update = function() {
    Game_CharacterBase.prototype.update.call(this);
    this.updateMove();
};

// 停止時の更新
var _Game_Character_updateStop = Game_Character.prototype.updateStop;
Game_Character.prototype.updateStop = function() {
    // キャラクターベースのメソッドのみ実行
    Game_CharacterBase.prototype.updateStop.call(this);
};

// 移動ルートの更新
Game_Character.prototype.updateMove = function() {
    if (this.isMoveRouteForcing()) {
        this.updateRoutineMove();
    } else {
        this.updateSelfMovement();
    }
};

// ルート移動の更新
var _Game_Character_updateRoutineMove = Game_Character.prototype.updateRoutineMove;
Game_Character.prototype.updateRoutineMove = function() {
    if (this.isWaiting()) {
        this.updateWait();
    } else {
        if (!this.isRouting() || this.shouldSkipMoveCommand()) {
            if (!!this.currentMoveCommand()) {
                this.processMoveCommand(this.currentMoveCommand());
                this.advanceMoveRouteIndex();
            }
        }
    }
};

// ウェイト時の更新
Game_Character.prototype.updateWait = function() {
    this._waitCount--;
};

// 移動ルートコマンドインデックスを進める
var _Game_Character_advanceMoveRouteIndex = Game_Character.prototype.advanceMoveRouteIndex;
Game_Character.prototype.advanceMoveRouteIndex = function() {
    this._moveRouteIndex++;
    if (!!this._moveRoute && this._moveRoute.repeat) {
        this._moveRouteIndex %= this._moveRoute.list.length;
    }
};

// 自律移動ルートの更新
Game_Character.prototype.updateSelfMovement = function() {
    return;
};

// キャラクターに近づく
Game_Character.prototype.moveTowardCharacter = function(character) {
    var relPosVec = character.mover().posVec().sub(this.mover().posVec());
    var dir = relPosVec.dir();
    this.moveByRad(dir);
};

// キャラクターから近離れる
Game_Character.prototype.moveAwayFromCharacter = function(character) {
    var relPosVec = character.mover().posVec().sub(this.mover().posVec());
    var dir = relPosVec.dir() + Math.PI;
    this.moveByRad(dir);
};

// キャラクターの方を向く
Game_Character.prototype.turnTowardCharacter = function(character) {
    var relPosVec = character.mover().posVec().sub(this.mover().posVec());
    var dir = relPosVec.dir();
    this.setDirectionByRad(dir);
};

// キャラクターの逆を向く
Game_Character.prototype.turnAwayFromCharacter = function(character) {
    var relPosVec = character.mover().posVec().sub(this.mover().posVec());
    var dir = relPosVec.dir() + Math.PI;
    this.setDirectionByRad(dir);
};

// 一歩移動
var _Game_Character_moveStraight = Game_Character.prototype.moveStraight;
Game_Character.prototype.moveStraight = function(dir8) {
    var dir = CharacterMover.dir8ToDir(dir8);
    this.moveByRad(dir);
};

// 斜方一歩移動
var _Game_Character_moveDiagonally = Game_Character.prototype.moveDiagonally;
Game_Character.prototype.moveDiagonally = function(horz, vert) {
    var dir8 = 1 + (horz - 4) + (vert - 2);
    this.moveStraight(dir8);
};

// ランダムに移動
var _Game_Character_moveRandom = Game_Character.prototype.moveRandom;
Game_Character.prototype.moveRandom = function(dir) {
    var dir = 2.0 * Math.PI * Math.random();
    this.moveByRad(dir);
};

// プレイヤーに近づく
var _Game_Character_moveTowardPlayer = Game_Character.prototype.moveTowardPlayer;
Game_Character.prototype.moveTowardPlayer = function() {
    this.moveTowardCharacter($gamePlayer);
};

// プレイヤーから離れる
var _Game_Character_moveAwayFromPlayer = Game_Character.prototype.moveAwayFromPlayer;
Game_Character.prototype.moveAwayFromPlayer = function() {
    this.moveAwayFromCharacter($gamePlayer);
};

// 一歩前進
var _Game_Character_moveForward = Game_Character.prototype.moveForward;
Game_Character.prototype.moveForward = function() {
    var dir = this.mover().dirVec().dir();
    this.moveByRad(dir);
};

// 一歩後退
var _Game_Character_moveBackward = Game_Character.prototype.moveBackward;
Game_Character.prototype.moveBackward = function() {
    var dir = this.mover().dirVec().dir() + Math.PI;
    this.moveByRad(dir);
};

// 右に90度回転
var _Game_Character_turnRight90 = Game_Character.prototype.turnRight90;
Game_Character.prototype.turnRight90 = function() {
    var dir = this.mover().dirVec().dir() - (Math.PI / 2.0);
    this.setDirectionByRad(dir);
};

// 左に90度回転
var _Game_Character_turnLeft90 = Game_Character.prototype.turnLeft90;
Game_Character.prototype.turnLeft90 = function() {
    var dir = this.mover().dirVec().dir() + (Math.PI / 2.0);
    this.setDirectionByRad(dir);
};

// 180度回転
var _Game_Character_turn180 = Game_Character.prototype.turn180;
Game_Character.prototype.turn180 = function() {
    var dir = this.mover().dirVec().dir() + Math.PI;
    this.setDirectionByRad(dir);
};

// ランダムに方向転換
var _Game_Character_turnRandom = Game_Character.prototype.turnRandom;
Game_Character.prototype.turnRandom = function() {
    var dir = 2.0 * Math.PI * Math.random();
    this.setDirectionByRad(dir);
};

// プレイヤーの方を向く
var _Game_Character_turnTowardPlayer = Game_Character.prototype.turnTowardPlayer;
Game_Character.prototype.turnTowardPlayer = function() {
    var relPosVec = $gamePlayer.mover().posVec().sub(this.mover().posVec());
    var dir = relPosVec.dir();
    this.setDirectionByRad(dir);
};

// プレイヤーの逆を向く
var _Game_Character_turnAwayFromPlayer = Game_Character.prototype.turnAwayFromPlayer;
Game_Character.prototype.turnAwayFromPlayer = function() {
    var relPosVec = this.mover().posVec().sub($gamePlayer.mover().posVec());
    var dir = relPosVec.dir();
    this.setDirectionByRad(dir);
};

//-----------------------------------------------------------------------------
// Game_Player
//
// プレイヤー

// メンバ変数の初期化
var _Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
    _Game_Player_initMembers.call(this);
    this._lastScrolledX = 0;
    this._lastScrolledY = 0;
};

// ムーバーの初期化
Game_Player.prototype.initMover = function() {
    this._mover = new PlayerMover();
};

// 乗り物タイプ
Game_Player.prototype.vehicleType = function() {
    return this._vehicleType;
};

// 乗り物タイプの設定
Game_Player.prototype.setVehicleType = function(vehicleType) {
    this._vehicleType = vehicleType;
};

// マップリロード必要判定
Game_Player.prototype.needsMapReload = function() {
    return this._needsMapReload || this._newMapId !== $gameMap.mapId();
};

// フレーム更新
var _Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function(sceneActive) {
    this.updateDashing();
    Game_Character.prototype.update.call(this);
    this.updateVehicle();
    this.updateFollowers();
    this.updateScroll();
};

// ダッシュ状態の更新
var _Game_Player_updateDashing = Game_Player.prototype.updateDashing;
Game_Player.prototype.updateDashing = function() {
    this._dashing = (
        (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) &&
        (this.isDashButtonPressed() || $gameTemp.isDestinationValid())
    );
};

// スクロールの更新
var _Game_Player_updateScroll = Game_Player.prototype.updateScroll;
Game_Player.prototype.updateScroll = function() {
    var x1 = this._lastScrolledX;
    var y1 = this._lastScrolledY;
    var x2 = this.scrolledX();
    var y2 = this.scrolledY();
    if (x2 < x1 && x2 < this.centerX()) {
        $gameMap.scrollLeft(x1 - x2);
    } else if (x2 > x1 && x2 > this.centerX()) {
        $gameMap.scrollRight(x2 - x1);
    }
    if (y2 > y1 && y2 > this.centerY()) {
        $gameMap.scrollDown(y2 - y1);
    } else if (y2 < y1 && y2 < this.centerY()) {
        $gameMap.scrollUp(y1 - y2);
    }
    this._lastScrolledX = this.scrolledX();
    this._lastScrolledY = this.scrolledY();
};

// フォロワーズの更新
Game_Player.prototype.updateFollowers = function() {
    this._followers.update();
};

// プレイヤー入力による移動
var _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
Game_Player.prototype.moveByInput = function() {
    return;
};

// 場所移動の実行
var _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function() {
    if (this.needsMapReload()) {
        $gameMap.setup(this._newMapId);
        this.locate(this._newX, this._newY);
        this.setDirection(this._newDirection);
        this.refreshPartyCollisionKeys();
        this.refresh();
        this.clearTransferInfo();
        this._needsMapReload = false;
    } else {
        _Game_Player_performTransfer.call(this);
    }
};

// パーティキャラクターの衝突マップキーのリフレッシュ
Game_Player.prototype.refreshPartyCollisionKeys = function() {
    $gamePlayer.mover().initKeys();
    $gamePlayer.mover().registrateKeys();
    $gamePlayer.followers().forEach(function(follower) {
        follower.mover().initKeys();
        follower.mover().registrateKeys();
    }, this);
};

// 歩行時の処理
Game_Player.prototype.onStep = function() {
    Game_Character.prototype.onStep.call(this);
    this.updateEncounterCount();
    $gameParty.increaseSteps();
    $gameParty.onPlayerWalk();
};

//-----------------------------------------------------------------------------
// Game_Follower
//
// フォロワー

// ムーバーの初期化
Game_Follower.prototype.initMover = function() {
    this._mover = new FollowerMover(this._memberIndex);
};

// すり抜け判定
var _Game_Follower_isThrough = Game_Follower.prototype.isThrough;
Game_Follower.prototype.isThrough = function() {
    return !this.isVisible() || $gamePlayer.areFollowersGathering();
};

//-----------------------------------------------------------------------------
// Game_Followers
//
// フォロワーズ

// 移動の更新
Game_Followers.prototype.updateMove = function() {
    return;
};

// 集合完了判定
var _Game_Followers_areGathered = Game_Followers.prototype.areGathered;
Game_Followers.prototype.areGathered = function() {
    var playerMover = $gamePlayer.mover();
    return this.visibleFollowers().every(function(follower) {
        var relPosVec = follower.mover().posVec().sub2(playerMover.posVec());
        return relPosVec.len() <= Collider.errMargin;
    }, this);
};

//-----------------------------------------------------------------------------
// Game_Vehicle
//
// ビークル

// ムーバーの初期化
Game_Vehicle.prototype.initMover = function() {
    this._mover = new VehicleMover(this._type);
};

//-----------------------------------------------------------------------------
// Game_Event
//
// イベント

// メンバ変数の初期化
var _Game_Event_initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function() {
    _Game_Event_initMembers.call(this);
    this._prelockDirectionRad = 0.0;
};

// ムーバーの初期化
Game_Event.prototype.initMover = function() {
    this._mover = new EventMover(this._eventId);
};

// 停止時の更新
var _Game_Event_updateStop = Game_Event.prototype.updateStop;
Game_Event.prototype.updateStop = function() {
    if (!this._locked) {
        Game_CharacterBase.prototype.updateStop.call(this);
    }
};

// イベント開始によるロック
var _Game_Event_lock = Game_Event.prototype.lock;
Game_Event.prototype.lock = function() {
    if (!this._locked) {
        this._prelockDirection = this.direction();
        this._prelockDirectionRad = this.mover().dirVec().dir();
        this.turnTowardPlayer();
        $gamePlayer.turnTowardCharacter(this);
        $gamePlayer.mover().setTarPosVec($gamePlayer.mover().posVec());
        this._locked = true;
    }
};

// イベント完了によるアンロック
var _Game_Event_unlock = Game_Event.prototype.unlock;
Game_Event.prototype.unlock = function() {
    if (this._locked) {
        this._locked = false;
        this.setDirectionByRad(this._prelockDirectionRad);
    }
};

//-----------------------------------------------------------------------------
// Game_Map
//
// マップ

// セットアップ
var _Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId);
    this.setupCollisionMap();
};

// 衝突マップセットアップ
Game_Map.prototype.setupCollisionMap = function() {
    CollisionMap.setup();
};

// リフレッシュ
var _Game_Map_refresh = Game_Map.prototype.refresh;
Game_Map.prototype.refresh = function() {
    _Game_Map_refresh.call(this);
    this.refreshCollisionMap();
};

// 衝突マップリフレッシュ
Game_Map.prototype.refreshCollisionMap = function() {
    CollisionMap.refresh();
};

//-----------------------------------------------------------------------------
// Spriteset_Map
//
// マップスプライトセット

// タイルマップ
Spriteset_Map.prototype.tilemap = function() {
    return this._tilemap;
};

//-----------------------------------------------------------------------------
// Sprite_Residual
//
// 残像スプライト

function Sprite_Residual() {
    this.initialize.apply(this, arguments);
}

Sprite_Residual.prototype = Object.create(Sprite.prototype);
Sprite_Residual.prototype.constructor = Sprite_Residual;

// オブジェクト初期化
Sprite_Residual.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};

// メンバ変数の初期化
Sprite_Residual.prototype.initMembers = function() {
    this._realX = 0.0;
    this._realY = 0.0;
    this._shiftY = 0.0;
    this._orgOpacity = 0;
    this._duration = 0;
    this._aliveCount = 0;
};

// セットアップ
Sprite_Residual.prototype.setup = function(parentSprite, colorTone, opacity, duration) {
    var character = parentSprite.character();
    this.anchor.x = parentSprite.anchor.x;
    this.anchor.y = parentSprite.anchor.y;
    this._realX = character.realX() + this.anchor.x;
    this._realY = character.realY() + this.anchor.y;
    this._shiftY = character.shiftY();
    this.z = character.screenZ() - 1;
    this.bitmap = parentSprite.bitmap;
    this.setupFrame(parentSprite);
    this.setColorTone(colorTone);
    this._orgOpacity = opacity;
    this._duration = duration;
    this._aliveCount = 0;
};

// スプライトフレームのセットアップ
Sprite_Residual.prototype.setupFrame = function(parentSprite) {
    var pw = parentSprite.patternWidth();
    var ph = parentSprite.patternHeight();
    var sx = (parentSprite.characterBlockX() + parentSprite.characterPatternX()) * pw;
    var sy = (parentSprite.characterBlockY() + parentSprite.characterPatternY()) * ph;
    this.setFrame(sx, sy, pw, ph);
};

// 生存状態判定
Sprite_Residual.prototype.isAlive = function() {
    return this._aliveCount < this._duration;
};

// フレーム更新
Sprite_Residual.prototype.update = function() {
    this.updatePosition();
    this.updateOpacity();
    this.updateAlive();
    Sprite.prototype.update.call(this);
};

// 位置の更新
Sprite_Residual.prototype.updatePosition = function() {
    this.x = $gameMap.adjustX(this._realX) * $gameMap.tileWidth();
    this.y = $gameMap.adjustY(this._realY) * $gameMap.tileHeight() - this._shiftY;
};

// 不透明度の更新
Sprite_Residual.prototype.updateOpacity = function() {
    this.opacity = this._orgOpacity * (1.0 - (this._aliveCount / this._duration));
};

// 生存状態の更新
Sprite_Residual.prototype.updateAlive = function() {
    if (this.isAlive()) {
        this._aliveCount++;
    } else {
        this.parent.removeChild(this);
    }
};

//-----------------------------------------------------------------------------
// Sprite_Character
//
// キャラクタースプライト.

// キャラクター
Sprite_Character.prototype.character = function() {
    return this._character;
};

// フレーム更新
var _Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
    _Sprite_Character_update.call(this)
    this.updateResidual();
};

// 残像の更新
Sprite_Character.prototype.updateResidual = function() {
    if (this._character.mover().needsResidual()) {
        this.createResidualSprite();
    }
};

// 残像スプライトの生成
Sprite_Character.prototype.createResidualSprite = function() {
    var residualSprite = new Sprite_Residual();
    var colorTone = [0, 0, 255, 255]
    var opacity = 128;
    var duration = 15;
    residualSprite.setup(this, colorTone, opacity, duration);
    this.parent.addChild(residualSprite);
};

//-----------------------------------------------------------------------------
// Scene_Map
//
// マップシーン

// タイルセット
Scene_Map.prototype.spriteset = function() {
    return this._spriteset;
};

// マップロード時の処理
var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    $gameMap.requestRefresh();
};

//-----------------------------------------------------------------------------
// Game_Interpreter
//
// インタープリター

// プラグインコマンド
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'SAN_AnalogMove') {
        switch (args[0]) {
        case 'test':
            break;
        }
    }
};

Game_Map.prototype.update = function(sceneActive) {
    this.refreshIfNeeded();
    if (sceneActive) {
        this.updateInterpreter();
    }
    this.updateScroll();
    this.updateEvents();
    // this.updateVehicles();
    this.updateParallax();
};

Game_Party.prototype.maxBattleMembers = function() {
    return 1;
};

}) (Sanshiro);
