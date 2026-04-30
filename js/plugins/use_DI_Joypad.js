//=============================================================================
// use_DI_Joypad.js
//=============================================================================
//Copyright (c) 2016 Trb
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//
//twitter https://twitter.com/Trb_surasura
/*:
 * @plugindesc DirectInput方式のジョイパッドが使えるようになります
 * @author Trb
 * @version 1.001 2016/2/26 微修正
 *          1.00  2016/2/26 初版
 * 
 * @help ジョイパッドにはDirect Input方式のものとX Input方式のものがあり、
 * ツクールMVでは通常はX Input方式のジョイパッドしか使えません。
 * それをどうにかDirect Inputのジョイパッドでも使えるようにしたプラグインです。
 * 
 */
(function () {

    Input._updateGamepadState = function(gamepad) {
        var lastState = this._gamepadStates[gamepad.index] || [];
        var newState = [];
        var buttons = gamepad.buttons;
        var axes = gamepad.axes;
        var threshold = 0.5;
        newState[12] = false;//追加した部分　ここから
        newState[13] = false;//||
        newState[14] = false;//||
        newState[15] = false;//ここまで
        for (var i = 0; i < buttons.length; i++) {
            newState[i] = buttons[i].pressed;
        }
        if (axes[1] < -threshold) {console.log(gamepad);
            newState[12] = true;    // up
        } else if (axes[1] > threshold) {
            newState[13] = true;    // down
        }
        if (axes[0] < -threshold) {
            newState[14] = true;    // left
        } else if (axes[0] > threshold) {
            newState[15] = true;    // right
        }
        for (var j = 0; j < newState.length; j++) {
            if (newState[j] !== lastState[j]) {
                var buttonName = this.gamepadMapper[j];
                if (buttonName) {
                    this._currentState[buttonName] = newState[j];
                }
            }
        }
        this._gamepadStates[gamepad.index] = newState;
    };

})();