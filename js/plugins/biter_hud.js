//=============================================================================
// biter_hud.js
//=============================================================================

/*:
 * @plugindesc v1.14 Show a HUD active on the map scene
 * @author Lantiz
 *
 * @param Visible
 * @desc HUD starts visible? / true | false
 * Default: true
 * @default true
 *
 * @param Background Type
 * @desc window | dimmer | none
 * Default: window
 * @default window
 *
 * @param Exp HUD
 * @desc top | bottom | false
 * Default: bottom
 * @default bottom
 *
 * @param Gold HUD
 * @desc top-left | top-right | bottom-left | bottom-right | false
 * Default: top-right
 * @default top-right
 *
 * @param Actor HUD
 * @desc top-left | top-right | bottom-left | bottom-right | false
 * Default: top-left
 * @default top-left
 *
 * @param Show Face
 * @desc true | false
 * Default: true
 * @default true
 *
 * @param Show HP
 * @desc true | false
 * Default: true
 * @default true
 *
 * @param Show MP
 * @desc true | false
 * Default: true
 * @default true
 *
 * @param Show TP
 * @desc true | false
 * Default: true
 * @default true
 *
 * @param Minimap HUD
 * @desc top-left | top-right | bottom-left | bottom-right | false
 * Default: bottom-right
 * @default bottom-right
 *
 * @param Map Name
 * @desc top | bottom | false
 * Default: bottom
 * @default bottom
 *
 * @param Fog Of War
 * @desc true | false
 * Default: false
 * @default false
 *
 * @param Notification HUD
 * @desc top-left | top-right | bottom-left | bottom-right | false
 * Default: bottom-left
 * @default bottom-left
 *
 * @param Line Amount
 * @desc 1..10 (number of visible lines at the notification window)
 * Default: 5
 * @default 5
 *
 * @param Line Numbers
 * @desc true | false (display line numbers)
 * Default: false
 * @default false
 *
 * @param Exp Gain Text
 * @desc Text of the notification for exp gains (false to disable)
 * Default: +[exp] Exp
 * @default +[exp] Exp
 *
 * @param Exp Gain Text Color
 * @desc 1..31 | See "img\system\Window.png"
 * Default: 14
 * @default 14
 *
 * @param Exp Lose Text
 * @desc Text of the notification for exp gains (false to disable)
 * Default: -[exp] Exp
 * @default -[exp] Exp
 *
 * @param Exp Lose Text Color
 * @desc 1..31 | See "img\system\Window.png"
 * Default: 14
 * @default 14
 *
 * @param Level Gain Text
 * @desc Text of the notification for level gains (false to disable)
 * Default: Level up!
 * @default Level up!
 *
 * @param Level Gain Text Color
 * @desc 1..31 | See "img\system\Window.png"
 * Default: 29
 * @default 29
 *
 * @param Level Gain Sound
 * @desc SE name
 * Default: Magic10
 * @default Magic10
 *
 * @param Level Lose Text
 * @desc Text of the notification for level lose (false to disable)
 * Default: Level down...
 * @default Level down...
 *
 * @param Level Lose Text Color
 * @desc 1..31 | See "img\system\Window.png"
 * Default: 29
 * @default 29
 *
 * @param Level Lose Sound
 * @desc SE name
 * Default: Darkness7
 * @default Darkness7
 *
 * @param Gold Gain Text
 * @desc Text of the notification for gold gains (false to disable)
 * Default: Obtained [gold] gold
 * @default Obtained [gold] gold
 *
 * @param Gold Gain Text Color
 * @desc 1..31 | See "img\system\Window.png"
 * Default: 6
 * @default 6
 *
 * @param Gold Gain Sound
 * @desc SE name
 * Default: Coin
 * @default Coin
 *
 * @param Gold Lose Text
 * @desc Text of the notification for gold lose (false to disable)
 * Default: Lost [gold] gold
 * @default Lost [gold] gold
 *
 * @param Gold Lose Text Color
 * @desc 1..31 | See "img\system\Window.png"
 * Default: 6
 * @default 6
 *
 * @param Gold Lose Sound
 * @desc SE name
 * Default: Coin
 * @default Coin
 *
 * @param Item Gain Text
 * @desc Text of the notification for item gains (false to disable)
 * Default: Obtained [amount] [item]
 * @default Obtained [amount] [item]
 *
 * @param Item Gain Text Color
 * @desc 1..31 | See "img\system\Window.png"
 * Default: 23
 * @default 23
 *
 * @param Item Gain Sound
 * @desc SE name
 * Default: Item1
 * @default Item1
 *
 * @param Item Lose Text
 * @desc Text of the notification for item lose (false to disable)
 * Default: Lost [amount] [item]
 * @default Lost [amount] [item]
 *
 * @param Item Lose Text Color
 * @desc 1..31 | See "img\system\Window.png"
 * Default: 23
 * @default 23
 *
 * @param Item Lose Sound
 * @desc SE name
 * Default: Equip1
 * @default Equip1
 *
 * @param Center Map Name
 * @desc true | false
 * Default: true
 * @default true
 *
 * @param Player Name
 * @desc Display event name? true | false
 * Default: false
 * @default false
 *
 * @param Follower Name
 * @desc Display event name? true | false
 * Default: false
 * @default false
 *
 * @param Event Name
 * @desc Display event name? true | false
 * Default: false
 * @default false
 *
 * @help
 * =============================================================================
 * biter_hud by Lantiz from http://biterswitch.com
 * =============================================================================
 * This plugin adds a complete (or almost) HUD that is visible on the map,
 * outside battle.
 * =============================================================================
 * Terms of use
 * =============================================================================
 * This plugin is free to use in any game made with RPG Maker MV
 * Credits must be given to Lantiz, inside the game (like in a credits scene)
 * =============================================================================
 * Features
 * =============================================================================
 * - Start visible or not
 * - Three types of background (plus one for event texts)
 * - Experience number and bar (hideable)
 * - Gold count (hideable)
 * - Actor (hideable)
 *   - Party leader face (hideable)
 *   - Party leader name
 *   - Party leader HP number and bar (hideable)
 *   - Party leader MP number and bar (hideable)
 *   - Party leader TP number and bar (hideable)
 * - Minimap - use tile tags
 *   - Map name (hideable)
 *   - Fog of war (hideable)
 * - Scrollable notification window
 *   - Visible lines amount
 *   - Display line numbers
 *   - Customizable Exp gain/lose text and color (optional)
 *   - Customizable Level gain/lose text color and sound (optional)
 *   - Customizable Gold gain/lose text color and sound (optional)
 *   - Customizable Item/Weapon/Armor gain/lose text color and sound (optional)
 * - Center map name (optional, to take it out from behind of the other windows)
 * - Player name (above the character)
 * - Follower name (above the character)
 * - Event name (above the event)
 * - Text popup over player, followers and/or events (like chat booble)
 *   - Change message backgroud, color, fontsize
 *   - Can be set up by a custom notification sent to the notification window
 * =============================================================================
 * Script calls
 * =============================================================================
 * - biterHud_show - display all enabled HUD items
 * - biterHud_hide - hide all enabled HUD items
 * - biterHud_notify - add a notification to the notification window
 *   - Parameters: eventId/name, text, color, sound, bubbleFontSize, bubbleBackground
 *   - If sent a valid  event id/name at the first parameter, will display
 *     its name and launch a popup text above the player/follower/event
 * - biterHud_bubble - launch a popup text above the player/follower/event sent
 *   at the first parameter
 *   - Parameters: eventId/name, text, color, fontSize, back
 * - biterHud_showFoW - enable the Fog of War on the minimap
 * - biterHud_hideFoW - disable the Fog of War on the minimap
 * =============================================================================
 * Plugin commands
 * =============================================================================
 * - biterhud show - display all enabled HUD items
 * - biterhud hide - hide all enabled HUD items
 * - biterhud notify - add a notification to the notification window
 *   - Parameters: eventId/name color sound bubbleFontSize bubbleBackground text...
 *   - If sent a valid  event id/name at the first parameter, will display its name
 *     and launch a popup text above the player/follower/event
 * - biterhud bubble - launch a popup text above the player/follower/event sent
 *   at the first parameter
 *   - Parameters: eventId/name color fontSize background text...
 * - biterhud showfow - enable the Fog of War on the minimap
 * - biterhud hidefow - disable the Fog of War on the minimap
 * =============================================================================
 */

var Imported = Imported || {};
Imported.biter_hud = true;

var biterswitch = biterswitch || {};
biterswitch.hud = biterswitch.hud || {};

(function() {

//==============================================================================
// ** PLUGIN PARAMETERS
//==============================================================================
var parameters = PluginManager.parameters('biter_hud');
var background = {'window': 0, 'dimmer': 1, 'none': 2};

biterswitch.hud.visible = String(parameters['Visible'] || 'true') === 'true';
biterswitch.hud.back =  background[String(parameters['Background Type'] || 'window')];
biterswitch.hud.exp = String(parameters['Exp HUD'] || 'bottom');
biterswitch.hud.gold = String(parameters['Gold HUD'] || 'top-right');
biterswitch.hud.actor = String(parameters['Actor HUD'] || 'top-left');
biterswitch.hud.actor_showFace = String(parameters['Show Face'] || 'true') === 'true';
biterswitch.hud.actor_showHP = String(parameters['Show HP'] || 'true') === 'true';
biterswitch.hud.actor_showMP = String(parameters['Show MP'] || 'true') === 'true';
biterswitch.hud.actor_showTP = String(parameters['Show TP'] || 'true') === 'true';
biterswitch.hud.minimap = String(parameters['Minimap HUD'] || 'bottom-right');
biterswitch.hud.minimap_mapName = String(parameters['Map Name'] || 'bottom');
biterswitch.hud.minimap_fow = String(parameters['Fog Of War'] || 'false') === 'true';
biterswitch.hud.notification = String(parameters['Notification HUD'] || 'bottom-left');
biterswitch.hud.notification_lineAmount = String(parameters['Line Amount'] || '5');
biterswitch.hud.notification_showLineNumbers = String(parameters['Line Numbers'] || 'false') === 'true';
biterswitch.hud.notification_expGainText = String(parameters['Exp Gain Text'] || '+[exp] exp');
biterswitch.hud.notification_expGainTextColor = String(parameters['Exp Gain Text Color'] || '14');
biterswitch.hud.notification_expLoseText = String(parameters['Exp Lose Text'] || '+[exp] exp');
biterswitch.hud.notification_expLoseTextColor = String(parameters['Exp Lose Text Color'] || '14');
biterswitch.hud.notification_levelGainText = String(parameters['Level Gain Text'] || 'Level up!');
biterswitch.hud.notification_levelGainTextColor = String(parameters['Level Gain Text Color'] || '29');
biterswitch.hud.notification_levelGainSound = String(parameters['Level Gain Sound'] || 'Magic10');
biterswitch.hud.notification_levelLoseText = String(parameters['Level Lose Text'] || 'Level up!');
biterswitch.hud.notification_levelLoseTextColor = String(parameters['Level Lose Text Color'] || '29');
biterswitch.hud.notification_levelLoseSound = String(parameters['Level Lose Sound'] || 'Darkness7');
biterswitch.hud.notification_goldGainText = String(parameters['Gold Gain Text'] || 'Obtained [gold] gold');
biterswitch.hud.notification_goldGainTextColor = String(parameters['Gold Gain Text Color'] || '6');
biterswitch.hud.notification_goldGainSound = String(parameters['Gold Gain Sound'] || 'Coin');
biterswitch.hud.notification_goldLoseText = String(parameters['Gold Lose Text'] || 'Lost [gold] gold');
biterswitch.hud.notification_goldLoseTextColor = String(parameters['Gold Lose Text Color'] || '6');
biterswitch.hud.notification_goldLoseSound = String(parameters['Gold Lose Sound'] || 'Coin');
biterswitch.hud.notification_itemGainText = String(parameters['Item Gain Text'] || 'Obtained [amount] [item]');
biterswitch.hud.notification_itemGainTextColor = String(parameters['Item Gain Text Color'] || '23');
biterswitch.hud.notification_itemGainSound = String(parameters['Item Gain Sound'] || 'Item1');
biterswitch.hud.notification_itemLoseText = String(parameters['Item Lose Text'] || 'Lost [amount] [item]');
biterswitch.hud.notification_itemLoseTextColor = String(parameters['Item Lose Text Color'] || '23');
biterswitch.hud.notification_itemLoseSound = String(parameters['Item Lose Sound'] || 'Equip1');
biterswitch.hud.centerMapName = String(parameters['Center Map Name'] || 'true') === 'true';
biterswitch.hud.playerName = String(parameters['Player Name'] || 'true') === 'true';
biterswitch.hud.followerName = String(parameters['Follower Name'] || 'true') === 'true';
biterswitch.hud.eventName = String(parameters['Event Name'] || 'true') === 'true';
biterswitch.hud.tempMap = null;
biterswitch.hud.UIFontSize = 16;
biterswitch.hud.bubbleFontSize = 16;
biterswitch.hud.bubbleOffset = -72;
biterswitch.hud.nameFontSize = 12;
biterswitch.hud.nameOffset = 24;

//==============================================================================
// ** Game_System
//==============================================================================
var biter_hud_game_system_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    biter_hud_game_system_initialize.call(this);
    //HUD options
    //visibility
    this._hud_optionVisible = biterswitch.hud.visible;
    this._hud_visible = biterswitch.hud.visible;
    //background
    this._hud_back = biterswitch.hud.back;
    //exp
    this._hud_exp = biterswitch.hud.exp;
    this._hud_exp_height = 0;
    //gold
    this._hud_gold = biterswitch.hud.gold;
    this._hud_goldWidth = 0;
    //actor
    this._hud_actor = biterswitch.hud.actor;
    this._hud_actor_showFace = biterswitch.hud.actor_showFace;
    this._hud_actor_showHP = biterswitch.hud.actor_showHP;
    this._hud_actor_showMP = biterswitch.hud.actor_showMP;
    this._hud_actor_showTP = biterswitch.hud.actor_showTP;
    //minimap
    this._hud_minimap = biterswitch.hud.minimap;
    this._hud_minimap_fow = biterswitch.hud.minimap_fow;
    this._hud_minimap_mapName = biterswitch.hud.minimap_mapName;
    //notifications
    this._hud_notificationList = [];
    this._hud_notification = biterswitch.hud.notification;
    this._hud_notification_lineAmount = biterswitch.hud.notification_lineAmount;
    this._hud_notification_showLineNumbers = biterswitch.hud.notification_showLineNumbers;
    //exp notification
    this._hud_notification_expGainText = biterswitch.hud.notification_expGainText;
    this._hud_notification_expGainTextColor = biterswitch.hud.notification_expGainTextColor;
    this._hud_notification_expLoseText = biterswitch.hud.notification_expLoseText;
    this._hud_notification_expLoseTextColor = biterswitch.hud.notification_expLoseTextColor;
    //level notification
    this._hud_notification_levelGainText = biterswitch.hud.notification_levelGainText;
    this._hud_notification_levelGainTextColor = biterswitch.hud.notification_levelGainTextColor;
    this._hud_notification_levelGainSound = biterswitch.hud.notification_levelGainSound;
    this._hud_notification_levelLoseText = biterswitch.hud.notification_levelLoseText;
    this._hud_notification_levelLoseTextColor = biterswitch.hud.notification_levelLoseTextColor;
    this._hud_notification_levelLoseSound = biterswitch.hud.notification_levelLoseSound;
    //gold notification
    this._hud_notification_goldGainText = biterswitch.hud.notification_goldGainText;
    this._hud_notification_goldGainTextColor = biterswitch.hud.notification_goldGainTextColor;
    this._hud_notification_goldGainSound = biterswitch.hud.notification_goldGainSound;
    this._hud_notification_goldLoseText = biterswitch.hud.notification_goldLoseText;
    this._hud_notification_goldLoseTextColor = biterswitch.hud.notification_goldLoseTextColor;
    this._hud_notification_goldLoseSound = biterswitch.hud.notification_goldLoseSound;
    //item notification
    this._hud_notification_itemGainText = biterswitch.hud.notification_itemGainText;
    this._hud_notification_itemGainTextColor = biterswitch.hud.notification_itemGainTextColor;
    this._hud_notification_itemGainSound = biterswitch.hud.notification_itemGainSound;
    this._hud_notification_itemLoseText = biterswitch.hud.notification_itemLoseText;
    this._hud_notification_itemLoseTextColor = biterswitch.hud.notification_itemLoseTextColor;
    this._hud_notification_itemLoseSound = biterswitch.hud.notification_itemLoseSound;
    //map name
    this._hud_centerMapName = biterswitch.hud.centerMapName;
    //names
    this._hud_playerName = biterswitch.hud.playerName;
    this._hud_followerName = biterswitch.hud.followerName;
    this._hud_eventName = biterswitch.hud.eventName;
    //temp
    this._minimap_bitmap = [];
};

Game_System.prototype.biterHud_buildNotificationList = function(clear) {
    if(clear || !this._hud_notificationList) {
        this._hud_notificationList = [];
    }
};

Game_System.prototype.biterHud_hasNotification = function() {
    this.biterHud_buildNotificationList();
    return this._hud_notificationList.length > 0;
};

Game_System.prototype.biterHud_getFirstNotification = function() {
    if(this.biterHud_hasNotification()) {
        var ret = this._hud_notificationList[0]
        this._hud_notificationList.shift();
        return ret;
    }
    return false;
};

Game_System.prototype.biterHud_notify = function(text, color, sound) {
    var param = {
        'text': '',
        'color': color || 0,
        'sound': sound || 'false'
    };

    if(text && text !== '') {
        param.text = text;
        this.biterHud_buildNotificationList();
        this._hud_notificationList.push(param);
    }
};

//==============================================================================
// ** Game_Interpreter
//==============================================================================
Game_Interpreter.prototype.biterHud_show = function(){
    $gameSystem._hud_optionVisible = true;
};

Game_Interpreter.prototype.biterHud_hide = function(){
    $gameSystem._hud_optionVisible = false;
};

Game_Interpreter.prototype.biterHud_notify = function(eventId, text, color, sound, bubbleFontSize, bubbleBack) {
    var char = null;

    if(typeof eventId == 'string') {
        char = this.biterHud_characterByName(eventId);
    } else {
        char = this.biterHud_characterById(eventId);
    }

    var notifyText = char && char._hud_name ? char._hud_name + ': ' + text : text;

    this.biterHud_bubble(eventId, text, color, bubbleFontSize, bubbleBack);
    $gameSystem.biterHud_notify(notifyText, color || 0, sound || 'false');
};

Game_Interpreter.prototype.biterHud_bubble = function(eventId, text, color, fontSize, back) {
    var char = null;

    if(typeof eventId == 'string') {
        char = this.biterHud_characterByName(eventId);
    } else {
        char = this.biterHud_characterById(eventId);
    }

    if(char && char._bubbles) {
        char._bubbles.push({
            'window': new Window_Bubble(text, color || 0, fontSize || biterswitch.hud.bubbleFontSize, biterswitch.hud.bubbleOffset, back || 'window'),
            'frames': 240,
            'showing': false
        });
    }
}

Game_Interpreter.prototype.biterHud_showFoW = function() {
    $gameSystem._hud_minimap_fow = true;
}

Game_Interpreter.prototype.biterHud_hideFoW = function() {
    $gameSystem._hud_minimap_fow = false;
}

Game_Interpreter.prototype.biterHud_showPlayerName = function() {
    $gameSystem._hud_playerName = true;
}

Game_Interpreter.prototype.biterHud_showFollowerName = function() {
    $gameSystem._hud_followerName = true;
}

Game_Interpreter.prototype.biterHud_showEventName = function() {
    $gameSystem._hud_eventName = true;
}

Game_Interpreter.prototype.biterHud_hidePlayerName = function() {
    $gameSystem._hud_playerName = false;
}

Game_Interpreter.prototype.biterHud_hideFollowerName = function() {
      $gameSystem._hud_followerName = false;
}

Game_Interpreter.prototype.biterHud_hideEventName = function() {
    $gameSystem._hud_eventName = false;
}

Game_Interpreter.prototype.biterHud_characterById = function(eventId) {
    if(eventId >= 0) {
        return $gameMap.event(eventId > 0 ? eventId : this._eventId);
    } else {
        return $gameParty.members()[-(eventId + 1)];
    }
}

Game_Interpreter.prototype.biterHud_characterByName = function(eventName) {
    var char = null;

    //search party members name
    $gameParty.members().filter(function(evt) {
        if(!char && evt._name == eventName) {
            char = evt;
        }
    });

    //search events
    if(!char) {
        $gameMap.events().filter(function(evt) {
            if(!char && evt.event().name == eventName) {
                char = evt;
            }
        });
    }

    return char;
}

var biter_hud_game_interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  	biter_hud_game_interpreter_pluginCommand.call(this, command, args);

    command = command.toLowerCase();
  	if(command === 'biterhud' && args[0]) {
        var option = args[0].toLowerCase();
        switch (option) {
          case 'show':
              this.biterHud_show();
              break;
          case 'hide':
              this.biterHud_hide();
              break;
          case 'notify': //biterhud notify eventId/name color sound bubbleFontSize bubbleBackground text...
              if(args[6]) {
                  var eventId = args[1] === 'null' ? -10 : parseInt(args[1]);
                  var color = args[2] === 'null' ? 0 : parseInt(args[2]);
                  var sound = args[3] === 'null' ? 'false' : args[3];
                  var bubbleFontSize = args[4] === 'null' ? biterswitch.hud.bubbleFontSize : parseInt(args[4]);
                  var bubbleBackground = args[5] === 'null' ? 'window' : args[5];
                  var text = '';
                  for(var idx = 6; idx < args.length; idx++) {
                      text += args[idx] + ' ';
                  }
                  this.biterHud_notify(eventId, text.trim(), color, sound, bubbleFontSize, bubbleBackground);
              }
              break;
          case 'bubble': //biterhud bubble eventId/name color fontSize background text...
              if(args[5]) {
                  var eventId = args[1] === 'null' ? -10 : parseInt(args[1]);
                  var color = args[2] === 'null' ? 0 : parseInt(args[2]);
                  var fontSize = args[3] === 'null' ? biterswitch.hud.bubbleFontSize : parseInt(args[3]);
                  var background = args[4] === 'null' ? 'window' : args[4];
                  var text = '';
                  for(var idx = 5; idx < args.length; idx++) {
                      text += args[idx] + ' ';
                  }
                  this.biterHud_bubble(eventId, text.trim(), color, fontSize, background);
              }
              break;
          case 'showfow':
              this.biterHud_showFoW();
              break;
          case 'hidefow':
              this.biterHud_hideFoW();
              break;
          case 'hideplayername':
              this.biterHud_hidePlayerName();
              break;
          case 'hidefollowername':
              this.biterHud_hideFollowerName();
              break;
          case 'hideeventname':
              this.biterHud_hideEventName();
              break;
          case 'showplayername':
              this.biterHud_showPlayerName();
              break;
          case 'showfollowername':
              this.biterHud_showFollowerName();
              break;
          case 'showeventname':
              this.biterHud_showEventName();
              break;
          default: return false;
        }
    }
};

//==============================================================================
// ** Window_MapName
//==============================================================================
Window_MapName.prototype.initialize = function() {
    var x = 0;
    var y = 0;
    var width = this.windowWidth();
    var height = this.windowHeight();
    if($gameSystem._hud_centerMapName) {
        x = Math.floor(Graphics.boxWidth / 2) - Math.floor(width / 2);
        y = Math.floor(Graphics.boxHeight / 2) - Math.floor(height / 2);
    }
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.opacity = 0;
    this.contentsOpacity = 0;
    this._showCount = 0;
    this.refresh();
};

//==============================================================================
// ** Game_Screen
//==============================================================================
Game_Screen.prototype.isFading = function() {
    return this._brightness < 255;
};

//==============================================================================
// ** Game_Actor
//==============================================================================
var biter_game_actor_initialize = Game_Actor.prototype.initialize;
Game_Actor.prototype.initialize = function(actorId) {
    biter_game_actor_initialize.call(this, actorId);
    this._hud_name = this._name;
    this._bubbles = [];
}

//change exp
var biter_game_actor_changeExp = Game_Actor.prototype.changeExp;
Game_Actor.prototype.changeExp = function(exp, show) {
    var value = exp - this.currentExp();
    if(value > 0) {
        var text = $gameSystem._hud_notification_expGainText.replace('[exp]', value);
        $gameSystem.biterHud_notify('[' + this._name + '] ' + text,
                                      $gameSystem._hud_notification_expGainTextColor);
    } else {
        var text = $gameSystem._hud_notification_expLoseText.replace('[exp]', -value);
        $gameSystem.biterHud_notify('[' + this._name + '] ' + text,
                                      $gameSystem._hud_notification_expLoseTextColor);
    }
    biter_game_actor_changeExp.call(this, exp, show);
};

//level up
var biter_game_actor_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
    if($gameSystem._hud_notification_levelGainText !== 'false') {
        $gameSystem.biterHud_notify('[' + this._name + '] ' +
                                    $gameSystem._hud_notification_levelGainText,
                                    $gameSystem._hud_notification_levelGainTextColor,
                                    $gameSystem._hud_notification_levelGainSound);
    }
    biter_game_actor_levelUp.call(this);
};

//level down
var biter_game_actor_levelDown = Game_Actor.prototype.levelDown;
Game_Actor.prototype.levelDown = function() {
    if($gameSystem._hud_notification_levelLoseText !== 'false') {
        $gameSystem.biterHud_notify('[' + this._name + '] ' +
                                    $gameSystem._hud_notification_levelLoseText,
                                    $gameSystem._hud_notification_levelLoseTextColor,
                                    $gameSystem._hud_notification_levelLoseSound);
    }
    biter_game_actor_levelDown.call(this);
};

//==============================================================================
// ** Game_Party
//==============================================================================
//gain / lose gold
var biter_game_party_gainGold = Game_Party.prototype.gainGold;
Game_Party.prototype.gainGold = function(amount) {
    if(amount > 0) {
        var text = $gameSystem._hud_notification_goldGainText.replace('[gold]', amount);
        $gameSystem.biterHud_notify(text, $gameSystem._hud_notification_goldGainTextColor,
                                    $gameSystem._hud_notification_goldGainSound);
    } else if(this.gold() > 0){
        var text = $gameSystem._hud_notification_goldLoseText.replace('[gold]', -amount);
        $gameSystem.biterHud_notify(text, $gameSystem._hud_notification_goldLoseTextColor,
                                    $gameSystem._hud_notification_goldLoseSound);
    }
    biter_game_party_gainGold.call(this, amount);
};

//gain / lose item
var biter_game_party_gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    if(item) {
      if(amount > 0) {
        var text = $gameSystem._hud_notification_itemGainText.replace('[amount]', amount);
        text = text.replace('[item]', item.name);

        $gameSystem.biterHud_notify(text, $gameSystem._hud_notification_itemGainTextColor,
          $gameSystem._hud_notification_itemGainSound);
        } else if(this.hasItem(item)) {
          var text = $gameSystem._hud_notification_itemLoseText.replace('[amount]', -amount);
          text = text.replace('[item]', item.name);

          $gameSystem.biterHud_notify(text, $gameSystem._hud_notification_itemLoseTextColor,
            $gameSystem._hud_notification_itemLoseSound);
          }
    }

    biter_game_party_gainItem.call(this, item, amount, includeEquip);
};

//==============================================================================
// ** Window_Base
//==============================================================================
Window_Base.prototype.expGaugeColor1 = function() {
    return this.textColor(14);
};

Window_Base.prototype.expGaugeColor2 = function() {
    return this.textColor(6);
};

//==============================================================================
// ** Window_Exp
//==============================================================================
function Window_Exp() {
    this.initialize.apply(this, arguments);
}
Window_Exp.prototype = Object.create(Window_Base.prototype);
Window_Exp.prototype.constructor = Window_Exp;

Window_Exp.prototype.initialize = function(x, y) {
    Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this.setBackgroundType($gameSystem._hud_back);
    this.refresh();
};
Window_Exp.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_Exp.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};
    
Window_Exp.prototype.standardPadding = function() {
    return 10;
};

Window_Exp.prototype.drawActorLevel = function(actor, x, y) {
  this.changeTextColor(this.systemColor());
  this.drawText(TextManager.levelA, x, y, 48);
  this.resetTextColor();
  this.drawText(actor.level, x + 50, y, 36, 'left');
};

Window_Exp.prototype.drawActorExp = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
    var width = width || this.windowWidth();

    var value1 = actor.currentExp();
    var value2 = actor.nextLevelExp();
    var owned = value1 - actor.currentLevelExp();
    var needed = actor.nextLevelExp() - actor.currentLevelExp();
    var rate = owned > 0 ? owned / needed : 0;

    if (actor.isMaxLevel()) {
        value1 = '-------';
        value2 = '-------';
    }

    this.drawGauge(x + 30, y, width, rate, this.expGaugeColor1(), this.expGaugeColor2());
    this.changeTextColor(this.systemColor());
    this.drawText('Exp', x + 30, y, 40);
    this.resetTextColor();
    this.drawText(value1, x + 80, y);
    this.drawText(value2, x, y, width - 100, 'right');
};

Window_Exp.prototype.refresh = function() {
    var actor = $gameParty.members()[0];

    this.contents.clear();
    this.drawActorLevel(actor, 0, 0);
    this.drawActorExp(actor, 80, 0);
};

//==============================================================================
// ** Window_HudGold
//==============================================================================
function Window_HudGold() {
    this.initialize.apply(this, arguments);
}
Window_HudGold.prototype = Object.create(Window_Gold.prototype);
Window_HudGold.prototype.constructor = Window_HudGold;

Window_HudGold.prototype.initialize = function(x, y) {
    Window_Gold.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this.setBackgroundType($gameSystem._hud_back);
    this.refresh();
};

Window_HudGold.prototype.windowWidth = function() {
    return 240 + 2 * this.standardPadding();
};
    
Window_HudGold.prototype.standardFontSize = function () {
    return biterswitch.hud.UIFontSize;
}
        
Window_HudGold.prototype.standardPadding = function() {
    return 10;
};

Window_HudGold.prototype.refresh = function() {
    this.contents.clear();
    this.drawCurrencyValue(this.value(), this.currencyUnit(), this.textPadding(), 0, this.contents.width - this.textPadding() * 2);
};

//==============================================================================
// ** Window_Actor
//==============================================================================
function Window_Actor() {
    this.initialize.apply(this, arguments);
}
Window_Actor.prototype = Object.create(Window_Base.prototype);
Window_Actor.prototype.constructor = Window_Actor;

Window_Actor.prototype.initialize = function(x, y) {
    Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this.setBackgroundType($gameSystem._hud_back);
    this.refresh();
};

Window_Actor.prototype.windowWidth = function() {
    return $gameSystem._hud_actor_showFace ? 384 : 230 - this.standardPadding();
};
    
Window_Actor.prototype.standardPadding = function() {
    return 10;
};
    
Window_Actor.prototype.standardFontSize = function() {
    return biterswitch.hud.UIFontSize;
};

Window_Actor.prototype.windowHeight = function() {
    if($gameSystem._hud_actor_showFace) {
        return this.fittingHeight(4);
    } else {
       var h = 1;
       if($gameSystem._hud_actor_showHP) {
          h++;
       }
       if($gameSystem._hud_actor_showMP) {
          h++;
       }
       if($gameSystem._hud_actor_showTP) {
          h++;
       }
       return this.fittingHeight(h);
    }
};

Window_Actor.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
    var x2 = x + $gameSystem._hud_actor_showFace ? 160 : 0;
    var y2 = y + lineHeight;
    var resetY2 = function() {
        y2 = y + lineHeight;
    }
    var checkHp = function() {
        if($gameSystem._hud_actor_showHP) {
            y2 += lineHeight;
        }
    }

    this.drawActorIcons(actor, x, y + lineHeight * 2);
    this.drawActorName(actor, x2, y);

    if($gameSystem._hud_actor_showTP) {
        if($gameSystem._hud_actor_showMP) {
            y2 += lineHeight;
        }
        checkHp();
        this.drawActorTp(actor, x2, y2, 200);
    }

    if($gameSystem._hud_actor_showMP) {
        resetY2();
        checkHp();
        this.drawActorMp(actor, x2, y2, 200);
    }

    if($gameSystem._hud_actor_showHP) {
        resetY2();
        this.drawActorHp(actor, x2, y2, 200);
    }
};

Window_Actor.prototype.refresh = function() {
    this.contents.clear();

    var actor = $gameParty.members()[0];

    //define face image to be loaded
    var bitmap = ImageManager.loadFace(actor.faceName());

    //run the function when the image is done loading
    if($gameSystem._hud_actor_showFace) {
        bitmap.addLoadListener(function() {
            this.drawActorFace(actor, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight);
        }.bind(this));
    }

    this.drawActorSimpleStatus(actor, 0, 0, (this.width - this.textPadding() * 2) - 180 - this.textPadding());
};

//==============================================================================
// ** Window_Minimap
//==============================================================================
function Window_Minimap() {
    this.initialize.apply(this, arguments);
}
Window_Minimap.prototype = Object.create(Window_Base.prototype);
Window_Minimap.prototype.constructor = Window_Minimap;

Window_Minimap.prototype.initialize = function(x, y, playerSprite) {
    Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this.setBackgroundType($gameSystem._hud_back);
    this._playerSprite = playerSprite;
};

Window_Minimap.prototype.windowWidth = function() {
    return 240 + 2 * this.standardPadding();
};
    
Window_Minimap.prototype.standardFontSize = function() {
    return biterswitch.hud.UIFontSize;
};

Window_Minimap.prototype.windowHeight = function() {
    return this.fittingHeight(5);
};
    
Window_Minimap.prototype.standardPadding = function() {
    return 10;
};

Window_Minimap.prototype.positionOnMap = function(sender, realX, realY, w, h) {
  	var x = (realX * sender._tileInfo.w + sender._tileInfo.hw) *
              sender._aspectRatio.deltaX * sender._aspectRatio.w - w / 2.0 + sender._aspectRatio.offsetX;
  	var y = (realY * sender._tileInfo.h + sender._tileInfo.hh) *
              sender._aspectRatio.deltaY * sender._aspectRatio.h - h / 2.0 + sender._aspectRatio.offsetY;
  	return {'x': x, 'y': y};
};

Window_Minimap.prototype.refresh = function() {
    this.contents.clear();

    this._lastMapName = $gameMap.displayName();

    //draw map name
    if($gameSystem._hud_minimap_mapName !== 'false') {
        var y = ($gameSystem._hud_minimap_mapName === 'bottom'
                    ? (this.windowHeight() - this.fittingHeight(1)) : 0);

        this.drawText(this._lastMapName, 0, y, this.windowWidth() - 2 * this.standardPadding(), 'center');
    }

    //draw minimap
    this._aspectRatio = {
        w: 0.0,
        h: 0.0,
        offsetX: 0.0,
        offsetY: 0.0,
        deltaX: 0.0,
        deltaY: 0.0
    };

    var w = $gameMap.width();
    var h = $gameMap.height();
    var y = ($gameSystem._hud_minimap_mapName === 'top') ? 0 : this.fittingHeight(1);

    var drawAreaWidth = this.windowWidth() - 2 * this.standardPadding();
    var drawAreaHeight = this.windowHeight() - ($gameSystem._hud_minimap_mapName === 'false' ? 0 : y);

    if(w == h) {
        this._aspectRatio.w = 1.0;
        this._aspectRatio.h = 1.0;
    } else if(w > h) {
        this._aspectRatio.w = 1.0;
        this._aspectRatio.h = h / parseFloat(w);
    } else {
        this._aspectRatio.w = w / parseFloat(h);
        this._aspectRatio.h = 1.0;
    }

    this._tileInfo = {
        w: $gameMap.tileWidth(),
        hw: $gameMap.tileWidth() / 2.0,
        zhw: ($gameMap.tileWidth() / 2.0) * this._aspectRatio.w,
        h: $gameMap.tileHeight(),
        hh: $gameMap.tileHeight() / 2.0,
        zhh: ($gameMap.tileHeight() / 2.0) * this._aspectRatio.h
    };

    this._aspectRatio.deltaX = drawAreaWidth / parseFloat($gameMap.width() * $gameMap.tileWidth());
    this._aspectRatio.deltaY = drawAreaHeight / parseFloat($gameMap.height() * $gameMap.tileHeight());

    var destinationW = drawAreaWidth  * this._aspectRatio.w;
    var destinationH = drawAreaHeight * this._aspectRatio.h;

    this._aspectRatio.offsetX = 0.0;
    this._aspectRatio.offsetX = 0.0;

    if(this._aspectRatio.w < 1.0) {
        this._aspectRatio.offsetX = (drawAreaWidth  - destinationW) / 2.0;
    }
    if (this._aspectRatio.h < 1.0) {
        this._aspectRatio.offsetY = (drawAreaHeight - destinationH) / 2.0;
    }

    if(!this._minimapBitmap) {
        
        //generate map and fow bitmap
        var colors = {
            0: '#000000', //black/shadow
            1: '#1a8cff', //blue/water
            2: '#2eb82e', //green/grass
            3: '#ffe066', //yellow/sand
            4: '#b36b00', //brown/clif
            5: '#999999', //grey/stone
            6: '#ff0000', //red/roof
            7: '#ffffff'  //white/none
        }

        var w = $gameMap.tileWidth();
        var h = $gameMap.tileHeight();
        var mapBmp = new Bitmap($gameMap.width() * w, $gameMap.height() * h);
        var fowBmp = new Bitmap($gameMap.width() * w, $gameMap.height() * h);

        for (var y = 0; y < $dataMap.height; y++)	{
            for (var x = 0; x < $dataMap.width; x++) {
                mapBmp.fillRect(x * w, y * h, w, h, colors[$gameMap.terrainTag(x, y)]);
                fowBmp.fillRect(x * w, y * h, w, h, '#000000'); //black bitmap
            }
        }

        this._minimapBitmap = mapBmp;
        this._fowBitmap = fowBmp;

        this.contents.blt(  this._minimapBitmap, 0, 0,
                            this._minimapBitmap.width,
                            this._minimapBitmap.height,
                            this._aspectRatio.offsetX,
                            this._aspectRatio.offsetY,
                            destinationW, destinationH);

        this._minimapBitmap = new Bitmap(this.contents.width, this.contents.height);
        this._minimapBitmap.blt(this.contents, 0, 0, this.contents.width, this.contents.height,
                                0, 0, this.contents.width, this.contents.height);

        if($gameSystem._hud_minimap_fow) {

            //snapshot used to clear the map when the player walks
            this.contents.blt(  fowBmp, 0, 0,
                                this._fowBitmap.width,
                                this._fowBitmap.height,
                                this._aspectRatio.offsetX,
                                this._aspectRatio.offsetY,
                                destinationW, destinationH);

            this._fowBitmap = new Bitmap(this.contents.width, this.contents.height);
            this._fowBitmap.blt(this.contents, 0, 0, this.contents.width, this.contents.height,
                                    0, 0, this.contents.width, this.contents.height);
        }
        //---
    }
    //---

    var playerPosition = this.positionOnMap(this, $gamePlayer._realX, $gamePlayer._realY, 16, 16);
    
    this._hasFow = false;

    //draw fog of War
    if($gameSystem._minimap_bitmap[$gameMap.mapId()]) {
        this._fowBitmap = $gameSystem._minimap_bitmap[$gameMap.mapId()];
        $gameSystem._minimap_bitmap[$gameMap.mapId()] = null;
        this._hasFow = true;
    } else if($gameSystem._hud_minimap_fow) {
        this._hasFow = true;

        //clear around player
        var playerRadius = [
            {x: playerPosition.x - 8, y: playerPosition.y},     //left
            {x: playerPosition.x - 4, y: playerPosition.y - 4}, //diagonal top left
            {x: playerPosition.x, y: playerPosition.y - 8},     //top
            {x: playerPosition.x + 4, y: playerPosition.y - 8}, //diagonal top right
            {x: playerPosition.x + 8, y: playerPosition.y},     //right
            {x: playerPosition.x + 4, y: playerPosition.y + 4}, //diagonal bottom right
            {x: playerPosition.x, y: playerPosition.y + 8},     //bottom
            {x: playerPosition.x - 4, y: playerPosition.y + 4}, //diagonal bottom left
        ];

        for(var idx = 0; idx < playerRadius.length; idx++) {
            this._fowBitmap.blt(this._minimapBitmap,
                                playerRadius[idx].x,
                                playerRadius[idx].y,
                                16, 16,
                                playerRadius[idx].x,
                                playerRadius[idx].y,
                                16, 16);
        }

        this.contents.blt(this._fowBitmap, 0, 0, this._fowBitmap.width, this._fowBitmap.height,
                                0, 0, this._fowBitmap.width, this._fowBitmap.height);
    } else {
        this.contents.blt(this._minimapBitmap, 0, 0, this._minimapBitmap.width, this._minimapBitmap.height,
                                0, 0, this._minimapBitmap.width, this._minimapBitmap.height);
    }

    //draw player
    this.contents.blt(  this._playerSprite._bitmap,
                        this._playerSprite._frame.x,
                        this._playerSprite._frame.y,
                        this._playerSprite._frame.width,
                        this._playerSprite._frame.height,
                        playerPosition.x, playerPosition.y - 8, 16, 16);
    //---
};

//==============================================================================
// ** Window_Notification
//==============================================================================
function Window_Notification() {
    this.initialize.apply(this, arguments);
}
Window_Notification.prototype = Object.create(Window_Command.prototype);
Window_Notification.prototype.constructor = Window_Notification;

Window_Notification.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this.setBackgroundType($gameSystem._hud_back);
};

Window_Notification.prototype.select = function(index) {
};

Window_Notification.prototype.processOk = function() {
};

Window_Notification.prototype.processCancel = function() {
};

Window_Notification.prototype.windowWidth = function() {
    return 400;
};
    
Window_Notification.prototype.standardFontSize = function() {
    return biterswitch.hud.UIFontSize;
};
    
Window_Notification.prototype.lineHeight = function() {
    return (this.standardFontSize() + 8);
};
    
Window_Notification.prototype.standardPadding = function() {
    return 10;
};

Window_Notification.prototype.windowHeight = function() {
    var h = ($gameSystem._hud_notification_lineAmount > 0) 
                ? $gameSystem._hud_notification_lineAmount 
                : biterswitch.hud.notification_lineAmount;
    if(h > 10) {
        h = biterswitch.hud.notification_lineAmount;
    }
    
    return this.fittingHeight(h);
};

Window_Notification.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    this.changeTextColor(this.textColor(this.commandSymbol(index)));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, this.itemTextAlign());
};

Window_Notification.prototype.drawAllItems = function() {
    var topIndex = this.topIndex();
    for (var i = 0; i < this.maxPageItems(); i++) {
        var index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItem(index);
            if($gameSystem.biterHud_hasNotification()) {
                this.scrollDown();
            }
        }
    }
};

Window_Notification.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
    var content = $gameSystem.biterHud_getFirstNotification();

    if(content) {
        var se = {
                name: 'false',
                pitch: 100,
                volume: 100,
                pan: 0
              };

        se.name = content.sound;
        if(se.name && se.name !== 'false') {
            AudioManager.playSe(se);
        }

        if($gameSystem._hud_notification_showLineNumbers) {
            content.text = (this.maxItems() +1) + '. ' + content.text;
        } else {
            content.text = '. ' + content.text;
        }

        this.addCommand(content.text, content.color);
        this.drawItem(this.maxItems() -1);
        this.scrollDown();
    }
};

//==============================================================================
// ** Sprite_Bubble
//==============================================================================
function Window_Bubble() {
    this.initialize.apply(this, arguments);
}

Window_Bubble.prototype = Object.create(Window_Base.prototype);
Window_Bubble.prototype.constructor = Window_Bubble;

Window_Bubble.prototype.windowWidth = function() {
    return this._textWidth + 2 * this.standardPadding();
};
    
Window_Bubble.prototype.standardFontSize = function() {
    return this._textFontSize;
};

Window_Bubble.prototype.lineHeight = function() {
    return (this.standardFontSize() + 8);
};
    
Window_Bubble.prototype.standardPadding = function() {
    return 10;
};
    
Window_Bubble.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_Bubble.prototype.createHorizontalDimmer = function() {
    //looks like this draws out of center if set on x = 0
    this.contents.gradientFillRect(-40, 0, this.windowWidth() / 2 + 30, this.windowHeight(), this.dimColor2(), this.dimColor1());
    this.contents.gradientFillRect(this.windowWidth() / 2 -10, 0, this.windowWidth() / 2 + 40, this.windowHeight(), this.dimColor1(), this.dimColor2());
}

Window_Bubble.prototype.initialize = function(text, textColor, fontSize, offsetY, back) {
    this._text = text;
    this._textColor = textColor || 0;
    this._textFontSize = fontSize || biterswitch.hud.bubbleFontSize;
    this._textWidth = text.length * this.standardPadding() + this.textPadding();
    this._offsetY = offsetY || biterswitch.hud.bubbleOffset;

    if(back) {
        this._textBackground = background[back] || $gameSystem._hud_back;
    } else {
        this._textBackground = 2;
    }

    Window_Base.prototype.initialize.call(this,
                                          -Math.floor(this.windowWidth() / 2),
                                          -this.windowHeight() + this._offsetY + 16,
                                          this.windowWidth(),
                                          this.windowHeight());
    this.contents.fontSize = fontSize;

    //0: window | 1: dimmer | 2: none (horizontalDimmer)
    this.setBackgroundType(this._textBackground);

    if(this._textBackground === 2) {
        this.createHorizontalDimmer();
    }

    this.changeTextColor(this.textColor(this._textColor));
    this.drawText(this._text, 0, 0, this._textWidth, 'center');
};

//==============================================================================
// ** Game_Event
//==============================================================================
var biter_hud_game_event_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
    biter_hud_game_event_initialize.call(this, mapId, eventId);

    this._bubbles = [];

    if($gameSystem._hud_eventName) {
        this._hud_name = '';
        this._hud_nameColor = 0;

        var note = this.event().note;
        if(note) {
            note = note.split('|');
            if(note[0]) {
                this._hud_name = note[0].trim();
                this._hud_nameColor = note[1] ? note[1].trim() : 0;
            }
        }
    }
}

//==============================================================================
// ** Spriteset_Map
//==============================================================================
Spriteset_Map.prototype.createExpHUD = function(placement) {
    this._windowExp = new Window_Exp(0, 0);
    switch(placement) {
        case 'top':
            this._windowExp.x = 0;
            this._windowExp.y = 0;
            break;
        default: //bottom
            this._windowExp.x = 0;
            this._windowExp.y = Graphics.boxHeight - this._windowExp.height;
    };
    $gameSystem._hud_exp_height = this._windowExp.height;
    this.addChild(this._windowExp);
};

Spriteset_Map.prototype.createGoldHUD = function(placement) {
    this._windowGold = new Window_HudGold(0, 0);
    switch(placement) {
        case 'top-right':
            this._windowGold.x = Graphics.boxWidth - this._windowGold.width;
            this._windowGold.y = $gameSystem._hud_exp === 'top'
                                    ? $gameSystem._hud_exp_height
                                    : 0;
            break;
        case 'bottom-left':
            this._windowGold.y = $gameSystem._hud_exp === 'bottom'
                                    ? Graphics.boxHeight - this._windowGold.height -
                                        $gameSystem._hud_exp_height
                                    : Graphics.boxHeight - this._windowGold.height;
            break;
        case 'bottom-right':
            this._windowGold.x = Graphics.boxWidth - this._windowGold.width;
            this._windowGold.y = $gameSystem._hud_exp === 'bottom'
                                    ? Graphics.boxHeight - this._windowGold.height -
                                        $gameSystem._hud_exp_height
                                    : Graphics.boxHeight - this._windowGold.height;
            break;
        default: //top-left
            this._windowGold.x = 0;
            this._windowGold.y = $gameSystem._hud_exp === 'top'
                                    ? $gameSystem._hud_exp_height
                                    : 0;
    };
    $gameSystem._hud_goldWidth = this._windowGold.width;
    this.addChild(this._windowGold);
};

Spriteset_Map.prototype.createActorHUD = function(placement) {
    this._windowActor = new Window_Actor(0, 0);
    switch(placement) {
        case 'top-right':
            this._windowActor.x = Graphics.boxWidth - this._windowActor.width;
            this._windowActor.y = $gameSystem._hud_exp === 'top'
                                    ? $gameSystem._hud_exp_height
                                    : 0;
            break;
        case 'bottom-left':
            this._windowActor.y = $gameSystem._hud_exp === 'bottom'
                                    ? Graphics.boxHeight - this._windowActor.height -
                                        $gameSystem._hud_exp_height
                                    : Graphics.boxHeight - this._windowActor.height;
            break;
        case 'bottom-right':
            this._windowActor.x = Graphics.boxWidth - this._windowActor.width;
            this._windowActor.y = $gameSystem._hud_exp === 'bottom'
                                    ? Graphics.boxHeight - this._windowActor.height -
                                        $gameSystem._hud_exp_height
                                    : Graphics.boxHeight - this._windowActor.height;
            break;
        default: //top-left
            this._windowActor.x = 0;
            this._windowActor.y = $gameSystem._hud_exp === 'top'
                                    ? $gameSystem._hud_exp_height
                                    : 0;
    };
    this.addChild(this._windowActor);
};

Spriteset_Map.prototype.createMinimapHUD = function(placement) {
    for (var i = this._characterSprites.length - 1; i >= 0; i--) {
        if (this._characterSprites[i]._character == $gamePlayer) {
            this._windowMinimap = new Window_Minimap(0, 0, this._characterSprites[i]);
            break;
        }
    }

    switch(placement) {
        case 'top-right':
            this._windowMinimap.x = Graphics.boxWidth - this._windowMinimap.width;
            this._windowMinimap.y = $gameSystem._hud_exp === 'top'
                                    ? $gameSystem._hud_exp_height
                                    : 0;
            break;
        case 'bottom-left':
            this._windowMinimap.y = $gameSystem._hud_exp === 'bottom'
                                    ? Graphics.boxHeight - this._windowMinimap.height -
                                        $gameSystem._hud_exp_height
                                    : Graphics.boxHeight - this._windowMinimap.height;
            break;
        case 'bottom-right':
            this._windowMinimap.x = Graphics.boxWidth - this._windowMinimap.width;
            this._windowMinimap.y = $gameSystem._hud_exp === 'bottom'
                                    ? Graphics.boxHeight - this._windowMinimap.height -
                                        $gameSystem._hud_exp_height
                                    : Graphics.boxHeight - this._windowMinimap.height;
            break;
        default: //top-left
            this._windowMinimap.x = 0;
            this._windowMinimap.y = $gameSystem._hud_exp === 'top'
                                    ? $gameSystem._hud_exp_height
                                    : 0;
    };

    this.addChild(this._windowMinimap);
};

Spriteset_Map.prototype.createNotificationHUD = function(placement) {
    this._windowNotification = new Window_Notification(0, 0);
    switch(placement) {
        case 'top-right':
            this._windowNotification.x = Graphics.boxWidth - this._windowNotification.width;
            this._windowNotification.y = $gameSystem._hud_exp === 'top'
                                          ? $gameSystem._hud_exp_height
                                          : 0;
            break;
        case 'bottom-left':
            this._windowNotification.y = $gameSystem._hud_exp === 'bottom'
                                          ? Graphics.boxHeight - this._windowNotification.height -
                                              $gameSystem._hud_exp_height
                                          : Graphics.boxHeight - this._windowNotification.height;
            break;
        case 'bottom-right':
            this._windowNotification.x = Graphics.boxWidth - this._windowNotification.width;
            this._windowNotification.y = $gameSystem._hud_exp === 'bottom'
                                          ? Graphics.boxHeight - this._windowNotification.height -
                                              $gameSystem._hud_exp_height
                                          : Graphics.boxHeight - this._windowNotification.height;
            break;
        default: //top-left
            this._windowNotification.x = 0;
            this._windowNotification.y = $gameSystem._hud_exp === 'top'
                                          ? $gameSystem._hud_exp_height
                                          : 0;
    };
    this.addChild(this._windowNotification);
};

var biter_hud_spriteset_map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer
Spriteset_Map.prototype.createUpperLayer = function() {
    biter_hud_spriteset_map_createUpperLayer.call(this);

    if($gameSystem._hud_exp !== 'false') {
        this.createExpHUD($gameSystem._hud_exp);
    }
    if($gameSystem._hud_gold !== 'false') {
        this.createGoldHUD($gameSystem._hud_gold);
    }
    if($gameSystem._hud_actor !== 'false') {
        this.createActorHUD($gameSystem._hud_actor);
    }
    if($gameSystem._hud_minimap !== 'false') {
        this.createMinimapHUD($gameSystem._hud_minimap);
    }
    if($gameSystem._hud_notification !== 'false') {
        this.createNotificationHUD($gameSystem._hud_notification);
    }
};

Spriteset_Map.prototype.updateBubble = function(event, spriteIndex) {
    if(event && event._bubbles && event._bubbles.length > 0) {
        if(event._bubbles[0].showing) {
            if(event._bubbles[0].frames > 0) {
                if(event._bubbles[0].frames < 30) {
                    event._bubbles[0].window.opacity -= 8.5;
                }

                event._bubbles[0].frames--;
            } else {
                this._characterSprites[spriteIndex].removeChild(event._bubbles[0].window);
                event._bubbles.shift();
            }
        } else {
            this._characterSprites[spriteIndex].addChild(event._bubbles[0].window);
            event._bubbles[0].showing = true;
        }
    }
}

var biter_hud_spriteset_map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
    biter_hud_spriteset_map_update.call(this);
    this.updateHud();
};

Spriteset_Map.prototype.updateHud = function() {    
    $gameSystem._hud_visible = $gameSystem._hud_optionVisible &&
                                  !$gameScreen.isFading() &&
                                  !$gameMessage.isBusy() &&
                                  !SceneManager.isSceneChanging();

    if($gameSystem._hud_visible) {
        this.showHud();
    } else {
        this.hideHud();
    }
    
    //player bubble
    this.updateBubble($gameParty.members()[0], this._characterSprites.length - 1);
    
    //followers bubble
    var characterSpriteIndex = this._characterSprites.length - 1;
    $gamePlayer.followers().forEach(function(event, idx) {
        characterSpriteIndex--;
        this.updateBubble($gameParty.members()[event._memberIndex], characterSpriteIndex);
    }, this);
    
    //events bubble
    $gameMap.events().forEach(function(event, idx) {
        this.updateBubble(event, idx);
    }, this);    
};
    
Spriteset_Map.prototype.showHud = function() {
    if(this._windowExp) {
        this._windowExp.refresh();
        if(!this._windowExp.visible) {
            this._windowExp.show();
        }
    }
    if(this._windowGold) {
        this._windowGold.refresh();
        if(!this._windowGold.visible) {
            this._windowGold.show();
        }
    }
    if(this._windowActor) {
        this._windowActor.refresh();
        if(!this._windowActor.visible) {
            this._windowActor.show();
        }
    }
    if(this._windowMinimap) {
        this._windowMinimap.refresh();
        if(!this._windowMinimap.visible) {
            this._windowMinimap.show();
        }
    }
    if(this._windowNotification) {
        this._windowNotification.refresh();
        if(!this._windowNotification.visible) {
            this._windowNotification.show();
        }
    }
};

Spriteset_Map.prototype.hideHud = function() {
    if(this._windowExp && this._windowExp.visible) {
        this._windowExp.hide();
    }
    if(this._windowGold && this._windowGold.visible) {
        this._windowGold.hide();
    }
    if(this._windowActor && this._windowActor.visible) {
        this._windowActor.hide();
    }
    if(this._windowMinimap && this._windowMinimap.visible) {
        this._windowMinimap.hide();
    }
    if(this._windowNotification && this._windowNotification.visible) {
        this._windowNotification.hide();
    }
};
 
var biter_hud_spriteset_map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
    biter_hud_spriteset_map_createLowerLayer.call(this);
    
    //player name
    if($gameSystem._hud_playerName && $gameParty.members()[0]._hud_name !== '') {
        this._characterSprites[this._characterSprites.length - 1].addChild(new Window_Bubble($gameParty.members()[0]._hud_name, 3, biterswitch.hud.nameFontSize, biterswitch.hud.nameOffset));
    }

    //follower name
    if($gameSystem._hud_followerName) {
        var characterSpriteIndex = this._characterSprites.length - 1;
        $gamePlayer.followers().forEach(function(event, idx) {
            characterSpriteIndex--;            
            if($gameParty.members()[event._memberIndex] && $gameParty.members()[event._memberIndex]._hud_name !== '') {
                this._characterSprites[characterSpriteIndex].addChild(new Window_Bubble($gameParty.members()[event._memberIndex]._hud_name, 3, biterswitch.hud.nameFontSize, biterswitch.hud.nameOffset));
            }

        }, this);
    }

    //event name
    if($gameSystem._hud_eventName) {        
        $gameMap.events().forEach(function(event, idx) {
            if(event._hud_name !== '') {
                this._characterSprites[idx].addChild(new Window_Bubble(event._hud_name, event._hud_nameColor, biterswitch.hud.nameFontSize, biterswitch.hud.nameOffset));
            }
        }, this);
    }
};

//==============================================================================
// ** Scene_Map
//==============================================================================
var biter_hud_scene_map_callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function() {
    if(this._spriteset._windowMinimap && this._spriteset._windowMinimap._hasFow) {
        $gameSystem._minimap_bitmap[$gameMap.mapId()] = this._spriteset._windowMinimap.contents;
    }

    biter_hud_scene_map_callMenu.call(this);
};

//==============================================================================
// ** DataManager
//==============================================================================
//It isn't possible to serialize a bitmap
var biter_hud_dataManager_saveGame = DataManager.saveGame;
DataManager.saveGame = function(savefileId) {
    biterswitch.hud.tempMap     = $gameSystem._minimap_bitmap;
    $gameSystem._minimap_bitmap = [];
    var ret                     = biter_hud_dataManager_saveGame.call(this, savefileId);
    $gameSystem._minimap_bitmap = biterswitch.hud.tempMap;
    
    return ret;
};

})();
