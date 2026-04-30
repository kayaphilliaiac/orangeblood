/*:
 * @plugindesc スキル発動時のモーションを通常攻撃のものにできます。
 さらに、待機時の詠唱モーションを行わないようにもできます。
 * @author 茶の助
 *
 * @help 発動モーションを通常攻撃のものにしたい場合、
 スキルのメモ欄に<motionAttack>と記入してください。
 
 魔法スキルでも詠唱モーションを行わせたくない場合、
 スキルのメモ欄に<noChant>と記入してください。
 */
 
(function() {

    Game_Action.prototype.isMagicSkill = function() {
        if (this.isSkill()) {
            if ($dataSystem.magicSkills.contains(this.item().stypeId)) {
                if (this.item().meta.noChant) {
                    return false
                } else {
                    return true
                }
            }
        } else {
            return false;
        }
    };

    Game_Actor.prototype.performAction = function(action) {
        Game_Battler.prototype.performAction.call(this, action);
        if (action.isAttack()) {
            this.performAttack();
        } else if (action.isGuard()) {
            this.requestMotion('guard');
        } else if (action.isMagicSkill()) {
            this.requestMotion('spell');
        } else if (action.isSkill()) {
            if (action.item().meta.motionAttack) {
                this.performAttack();
            } else {
                this.requestMotion('skill');
            }
        } else if (action.isItem()) {
            this.requestMotion('item');
        }
    };

})();

