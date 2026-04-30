
//上書き注意！（特にyanflyEngine系）
Sprite_Enemy.prototype.updateSVFrame = function() {
	Sprite_Battler.prototype.updateFrame.call(this);
	var bitmap = this._mainSprite.bitmap;
	if (!bitmap) return;
	if (bitmap.width <= 0) return;
	this._effectTarget = this._mainSprite;
	
	var flg = this.getRemake();
	if( flg === true && bitmap.width !==0){
		this.addMotionData(this._mainSprite);
		this.setMotionFps(this._mainSprite);
		this.setMotionArray();
		this.setRemake(false);
	}
	
	var ch = this.cs(this._mainSprite);
	var cw = this.cs(this._mainSprite);
	var cx = this.cx();
	var cy = this.cy();
	var cdh = 0;
	if (this._effectType === 'bossCollapse') {
		cdh = ch - this._effectDuration;
	}
	// this.setFrame(cx * cw, cy * ch, cw, ch);
	this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch - cdh);
	this.adjustMainBitmapSettings(bitmap);
	this.adjustSVShadowSettings();
};
