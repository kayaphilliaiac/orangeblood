//=============================================================================
// MoveRouteEX.js
//=============================================================================
// Copyright (c) 2015 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【MPP ver.1.1】移動ルートの実行を可能な限り１フレーム以内に行います。（通常は１フレームに１行ずつしか実行しません。）
 * @author 木星ペンギン
 * 
 * @help 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 */

(function() {

//6905
var _Game_Character_updateRoutineMove = Game_Character.prototype.updateRoutineMove;
Game_Character.prototype.updateRoutineMove = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        if (this._waitCount > 0) {
            return;
        }
    }
    _Game_Character_updateRoutineMove.call(this);
    if (this._moveRouteForcing && this.isMovementSucceeded() &&
            this.isStopping() && this._waitCount === 0 &&
            this._moveRouteIndex >= 0) {
        this.updateRoutineMove();
    }
};

//6918
var _Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
Game_Character.prototype.processMoveCommand = function(command) {
    switch (command.code) {
    case Game_Character.ROUTE_WAIT:
        this._waitCount = command.parameters[0];
        return;
    }
    _Game_Character_processMoveCommand.call(this, command);
};

})();
