//=============================================================================
// MPP_MiniMap.js
//=============================================================================
// Copyright (c) 2019 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.3.2】ミニマップを画面に表示させます。
 * @author 木星ペンギン
 * @help []内は表記しなくても動作します。
 * プラグインコマンド:
 *   MiniMap n                  # ミニマップの表示
 *   ChangeMinimap mapId        # 指定したマップIDのミニマップに変更
 *   SetMinimapZoom zoom        # ミニマップの拡大率のみ変更
 *   SetMinimapFrame n          # ミニマップの上にフレーム画像を表示
 *   
 *   Marking n mapId Ev  id  Cir r c    # イベントを中心に円形のマーキング
 *   Marking n mapId Pos x y Cir r c    # 座標を中心に円形のマーキングを表示
 *   Marking n mapId Pos x y Rec w h c  # 四角形のマーキングを表示
 *   Marking n mapId Ev  id  Ico m      # イベントの位置にマーカーアイコンを表示
 *   Marking n mapId Pos x y Ico m      # 座標(x,y)にマーカーアイコンを表示
 *   DeleteMarking n                    # マーキング番号 n を削除
 *   
 *   HighlightMarking n[ bool]    # マーキング番号 n を強調表示
 *   HighlightEvMarker id[ bool]  # イベントのマーカーアイコンを強調表示
 * 
 * マップのメモ:
 *   <Minimap:name>             # このマップのミニマップ画像のファイル名
 *   <MinimapZoom:n>            # このマップのミニマップ拡大率
 * 
 * イベントのメモ:
 *   <Marker:n>                 # このイベントのマーカーアイコン番号
 * 
 * ================================================================
 * ▼ プラグインコマンド 詳細
 * --------------------------------
 *  〇 プラグインコマンド全般
 *   指定する値には変数が使用できます。
 *   v[n] と記述することでn番の変数の値を参照します。
 * 
 *   ※ マーキング番号
 *    マーキング番号は任意の数値を指定してください。
 *    ピクチャの番号と同じで、同じ番号を使うと上書きされます。
 *   
 *   ※ 色番号
 *    色番号はプラグインパラメータ[Marking Colors]で設定した色の番号を
 *    指定してください。
 *   
 * --------------------------------
 *  〇 MiniMap n
 *       n : 呼び出すデータの番号
 *   
 *   ミニマップの表示位置や表示内容を変更します。
 *   プラグインパラメータ[Minimap Data]にてあらかじめ設定しておいたデータを
 *   呼び出します。
 *   0 を指定した場合、非表示となります。
 * 
 * --------------------------------
 *  〇 ChangeMinimap mapId
 *       mapId : 表示するマップID
 *   
 *   ミニマップを指定したマップのものに切り替えます。
 *   mapId に 0 を指定した場合、現在プレイヤーのいるマップとなります。
 *   
 *   現在のマップとは違うマップを表示した場合、マーキングは表示されますが、
 *   イベントのマーカーアイコンは表示されません。
 *   乗り物のマーカーアイコンは表示されます。
 * 
 * --------------------------------
 *  〇 SetMinimapFrame n
 *       n : フレーム画像の番号
 *   
 *   ミニマップの上に画像を重ねて表示する機能です。
 *   ミニマップのサイズに合わせてサイズを変更する機能はありません。
 *   使用する画像は img/pictures フォルダ内に入れてください。
 *  
 *   ここで使用する画像はプラグインパラメータ[Frame Images]に設定し、
 *   その番号を指定することで画像を表示させることができます。
 *   0 を指定した場合、非表示となります。
 * 
 * --------------------------------
 *  〇 Marking n mapId Ev id Cir r c1
 *       n     : マーキング番号 (任意の数値)
 *       mapId : マーキングするマップID (0で現在のマップ)
 *       id    : イベントID
 *       r     : 半径 (タイル)
 *       c     : 色番号
 *   
 *   指定したイベントを中心とした円形のマーキングをミニマップ上に表示します。
 *   Ev と Cir は変更する必要ありません。
 *   
 *   例： Marking 1 0 Ev 5 Cir 3 1
 *       マーキング番号 : 1
 *       マップID    : 現在のマップ
 *       イベントID  : 5
 *       半径        : 3タイル
 *       色番号      : 1
 * 
 * --------------------------------
 *  〇 Marking n mapId Pos x y Cir r c
 *       n     : マーキング番号 (任意の数値)
 *       mapId : マーキングするマップID (0で現在のマップ)
 *       x,y   : 中心となる座標(x,y)
 *       r     : 半径 (タイル)
 *       c     : 色番号
 *  
 *   指定した座標(x,y)を中心とした円形のマーキングをミニマップ上に表示します。
 *   Pos と Cir は変更する必要ありません。
 *   
 *   例： Marking 1 0 Pos 13 9 Cir 3 1
 *       マーキング番号 : 1
 *       マップID  : 現在のマップ
 *       中心座標  : X 13, Y 9
 *       半径      : 3タイル
 *       色番号    : 1
 *  
 * --------------------------------
 *  〇 Marking n mapId Pos x y Rec w h c
 *       n       : マーキング番号 (任意の数値)
 *       mapId   : マーキングするマップID (0で現在のマップ)
 *       x,y,w,h : 表示する座標(x,y)とサイズ(幅,高さ)
 *       c       : 色番号
 *  
 *   指定した四角形(x,y,w,h)のマーキングをミニマップ上に表示します。
 *   Pos と Rec は変更する必要ありません。
 *  
 * --------------------------------
 *  〇 Marking n mapId Ev id Ico m
 *       n     : マーキング番号 (任意の数値)
 *       mapId : マーキングするマップID (0で現在のマップ)
 *       id    : イベントID
 *       m     : マーカーアイコン番号
 *  
 *   ミニマップ上の指定したイベントの位置にマーカーアイコンを表示します。
 *   Ev と Ico は変更する必要ありません。
 *   
 *   マーカーアイコン番号については後述。
 *   
 *   例： Marking 1 0 Ev 5 Ico 4
 *       マーキング番号 : 1
 *       マップID      : 現在のマップ
 *       イベントID    : 5
 *       アイコン番号  : 4
 *  
 * --------------------------------
 *  〇 Marking n mapId Pos x y Ico m
 *       n     : マーキング番号 (任意の数値)
 *       mapId : マーキングするマップID (0で現在のマップ)
 *       x,y   : 表示する座標(x,y)
 *       m     : マーカーアイコン番号
 *  
 *   ミニマップ上の指定した座標(x,y)にマーカーアイコンを表示します。
 *   Pos と Ico は変更する必要ありません
 *   
 *   マーカーアイコン番号については後述。
 * 
 * --------------------------------
 *  〇 HighlightMarking n[ bool]
 *       n    : マーキング番号
 *       bool : 強調表示するかどうか(true/false/未設定はtrue)
 * 
 *   ミニマップの表示範囲に入っていなくても、ミニマップの隅にマーカーアイコンが
 *   表示されるようになります。
 *   強調表示できるのはマーカーアイコンのみです。
 *   
 *   bool に true を入れると強調表示され、falseを入れると強調表示が解除されます。
 *   未設定の場合は true となります。
 *   
 * --------------------------------
 *  〇 HighlightEvMarker id[ bool]
 *       id   : イベントID
 *       bool : 強調表示するかどうか(true/false/未設定はtrue)
 * 
 *   同上。
 *   現在のマップのイベントのみに対応しています。
 *   
 *   イベントコマンドの[場所移動]でマップを切り替えると
 *   強調表示の有効フラグはリセットされます。
 * 
 * 
 * ================================================================
 * ▼ マップのメモ 詳細
 * --------------------------------
 *  〇 <Minimap:name>
 *   このマップのミニマップ画像を指定したファイル名の画像にします。
 *   未設定の場合は自動生成されます。
 *   
 *   ミニマップ画像は img/system フォルダ内に入れてください。
 * 
 * 
 * ================================================================
 * ▼ イベントのメモ 詳細
 * --------------------------------
 *  〇 <Marker:n>
 *   このイベントの位置にマーカーアイコンを表示します。
 *   nでマーカーアイコン番号を指定します。
 *   
 *   マーカーアイコン番号については後述。
 *   
 *   このマーカーアイコンは以下の条件のうちどれか一つでも満たしている場合
 *   表示されません。
 *    ・イベントの[出現条件]が満たされていない場合
 *    ・[イベントの一時消去]によって消去されている場合
 *    ・透明化がONになっている場合
 * 
 * 
 * ================================================================
 * ▼ プラグインパラメータ 詳細
 * --------------------------------
 *  〇 範囲指定について
 *   プラグインパラメータ[Map IDs][Wall Region IDs][Floor Region IDs]では
 *   範囲指定が使用できます。
 *  
 *   n-m と表記することで、nからmまでの数値を指定できます。
 *   (例 : 1-4,8,10-12 => 1,2,3,4,8,10,11,12)
 * 
 * --------------------------------
 *  〇 Minimap Z
 *   ミニマップのZ座標を設定できます。
 *  
 *    0 : キャラクターや天候、画面の色調変更より上、ピクチャより下
 *    1 : ピクチャより上、タイマーより下
 *    2 : タイマーより上、画面暗転より下
 *    3 : 画面のフラッシュより上
 *    4 : 全スプライトより上
 * 
 * --------------------------------
 *  〇 Player Highlight?
 *   プレイヤーのマーカーアイコンを強調表示するかどうかを設定します。
 *   [強調表示したマーカーアイコンの拡大率]は適用されません。
 *  
 *   基本的にプレイヤーがミニマップの外に出ることはありませんが、
 *   画面のスクロールやオプション２を使用した場合に効果があります。
 * 
 * --------------------------------
 *  〇 Vehicle Highlight?
 *   乗り物のマーカーアイコンを強調表示するかどうかを設定します。
 *   [強調表示したマーカーアイコンの拡大率]は適用されません。
 *   
 * --------------------------------
 *  〇 Plugin Commands / Map Metadata / Event Metadata
 * 
 *   プラグインコマンド名やメモ欄で使用するコマンド名を変更できます。
 *   コマンドを短くしたり日本語化等が可能です。
 *   
 *   プラグインコマンドのみ、コマンド名を変更しても
 *   デフォルトのコマンドは使用できます。
 * 
 * 
 * ================================================================
 * ▼ その他
 * --------------------------------
 *  〇 マーカーアイコン
 *   マーカーアイコンを表示するにはマーカーアイコン画像が必要です。
 *   MinimapMarkerSet という画像ファイルを img/system フォルダ内に
 *   入れてください。
 *   
 *   マーカーアイコン画像は横方向に8個並べたものを1ブロックとし、
 *   そのブロックを必要なだけ縦に長くしたものです。
 *   画像の幅を8で割ったものが、マーカーアイコン1個の幅と高さになります。
 *   
 *   サンプル画像(フリー素材)はダウンロードページにあります。
 *   
 *   マーカーアイコン番号は通常のアイコンと同じで、
 *   一番左上を0とし右に向かって 1,2,3... となります。
 * 
 * --------------------------------
 *  〇 イベントコマンド[タイルセットの変更]
 *   本プラグインはイベントコマンドの[タイルセットの変更]には対応していません。
 *   マップ画像はシーン切り替え時に生成され、途中で変更されることはありません。
 *  
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param === Basic ===
 * @default === 基本的な設定 ===
 * 
 * @param Map IDs
 * @desc ミニマップを表示するマップIDの配列
 * (範囲指定可)
 * @default 1-5
 * @parent === Basic ===
 *
 * @param Minimap Data
 * @type struct<MinimapData>[]
 * @desc ミニマップ表示位置の配列
 * @default ["{\"x\":\"32\",\"y\":\"32\",\"width\":\"160\",\"height\":\"128\",\"type\":\"1\",\"opacity\":\"192\",\"zoom\":\"1.0\"}","{\"x\":\"0\",\"y\":\"0\",\"width\":\"816\",\"height\":\"624\",\"type\":\"0\",\"opacity\":\"192\",\"zoom\":\"1.0\"}","{\"x\":\"32\",\"y\":\"32\",\"width\":\"160\",\"height\":\"128\",\"type\":\"0\",\"opacity\":\"192\",\"zoom\":\"1.0\"}"]
 * @parent === Basic ===
 *
 * @param Default Data Index
 * @type number
 * @desc ミニマップ表示位置のデフォルト値
 * @default 1
 * @parent === Basic ===
 *
 * @param Minimap Z
 * @type number
 * @max 4
 * @desc ミニマップのZ座標(詳細はヘルプ参照)
 * @default 0
 * @parent === Basic ===
 *
 * @param Frame Images
 * @type file[]
 * @desc フレーム画像
 * @default []
 * @require 1
 * @dir img/pictures/
 * @parent === Basic ===
 *
 * @param Default Frame Index
 * @type number
 * @desc フレーム画像番号のデフォルト値
 * @default 0
 * @parent === Basic ===
 *
 *
 * @param === Advanced ===
 * @default === 細かな設定 ===
 *
 * @param Update Count
 * @type number
 * @desc 更新頻度
 * @default 80
 * @parent === Advanced ===
 *
 * @param Blink Duration
 * @type number
 * @desc 点滅時間
 * (0で点滅なし)
 * @default 80
 * @parent === Advanced ===
 *
 * @param Scroll Map Link?
 * @type boolean
 * @desc [マップのスクロール]を実行した際、ミニマップもスクロールさせるかどうか
 * @default false
 * @parent === Advanced ===
 *
 *
 * @param === Marker ===
 * @default === マーカー/マーキング ===
 * 
 * @param Player Marker _v3
 * @type struct<Marker>
 * @desc プレイヤーのマーカーアイコン
 * @default {"Icon Index":"1","oy":"0.5","turn?":"false"}
 * @parent === Marker ===
 *
 * @param Vehicle On Marker _v3
 * @type struct<Marker>
 * @desc 乗り物搭乗時のマーカーアイコン
 * @default {"Icon Index":"7","oy":"0.5","turn?":"true"}
 * @parent === Marker ===
 *
 * @param Player Highlight?
 * @type boolean
 * @desc プレイヤーのマーカーアイコンを強調表示するかどうか
 * @default true
 * @parent === Marker ===
 *
 * @param Vehicle Off Markers _v3
 * @type struct<Vehicle>
 * @desc 非搭乗時の乗り物のマーカーアイコン番号
 * @default {"boat":"2","ship":"2","airship":"2"}
 * @parent === Marker ===
 *
 * @param Marking Colors
 * @type string[]
 * @desc マーキングの色番号の配列
 * @default ["255,255,255,1.0","32,160,214,1.0","32,160,214,1.0","255,120,76,1.0","102,204,64,1.0","153,204,255,1.0","204,192,255,1.0","255,255,160,1.0","128,128,128,1.0"]
 * @parent === Marker ===
 *
 * @param Highlight Marker Blink?
 * @type boolean
 * @desc 強調表示したマーカーアイコンを点滅させるかどうか
 * @default false
 * @parent === Marker ===
 *
 * @param Highlight Marker Scale
 * @desc 強調表示したマーカーアイコンの拡大率
 * @default 1.5
 * @parent === Marker ===
 *
 *
 * @param === Auto Generate ===
 * @default === マップの自動生成 ===
 * 
 * @param Tile Size
 * @type number
 * @desc 1タイルの大きさ
 * @default 4
 * @parent === Auto Generate ===
 *
 * @param Blur Intensity
 * @type number
 * @desc ぼかし処理の強さ
 * @default 2
 * @parent === Auto Generate ===
 *
 *
 * @param ▽ Field Type ▽
 * @default ▽ モード:フィールドタイプ ▽
 * @parent === Auto Generate ===
 * 
 * @param Land Color
 * @desc 陸地の色
 * @default 224,224,224,1.0
 * @parent ▽ Field Type ▽
 *
 * @param Sea Color
 * @desc 深海の色
 * @default 0,0,0,0.5
 * @parent ▽ Field Type ▽
 *
 * @param Ford Color
 * @desc 浅瀬・沼の色
 * @default 64,64,64,0.75
 * @parent ▽ Field Type ▽
 *
 * @param Mountain Color
 * @desc 山の色
 * @default 128,128,128,1.0
 * @parent ▽ Field Type ▽
 *
 * @param Hill Color
 * @desc 丘の色
 * @default 160,160,160,1.0
 * @parent ▽ Field Type ▽
 *
 * @param Forest Color
 * @desc 森の色
 * @default 192,192,192,1.0
 * @parent ▽ Field Type ▽
 *
 *
 * @param ▽ Area Type ▽
 * @default ▽ モード:エリアタイプ ▽
 * @parent === Auto Generate ===
 * 
 * @param River Color
 * @desc 水辺（通行不可）の色
 * @default 128,128,128,0.5
 * @parent ▽ Area Type ▽
 *
 * @param Shallow Color
 * @desc 水辺（通行可能）の色
 * @default 160,160,160,0.75
 * @parent ▽ Area Type ▽
 *
 * @param Ladder Color
 * @desc 梯子の色
 * @default 160,160,160,1.0
 * @parent ▽ Area Type ▽
 *
 * @param Bush Color
 * @desc 茂みの色
 * @default 192,192,192,1.0
 * @parent ▽ Area Type ▽
 *
 * @param Counter Color
 * @desc カウンターの色
 * @default 160,160,160,0.5
 * @parent ▽ Area Type ▽
 *
 * @param Wall Color
 * @desc 通行不可タイルの色
 * @default 64,64,64,0.25
 * @parent ▽ Area Type ▽
 *
 * @param Floor Color
 * @desc 通行可能タイルの色
 * @default 224,224,224,1.0
 * @parent ▽ Area Type ▽
 *
 * @param Wall Region IDs
 * @desc 通行不可として表示するリージョンIDの配列
 * (範囲指定可)
 * @default 63
 * @parent ▽ Area Type ▽
 *
 * @param Floor Region IDs
 * @desc 通行可能として表示するリージョンIDの配列
 * (範囲指定可)
 * @default 
 * @parent ▽ Area Type ▽
 *
 * @param Dir4 Wall Width
 * @type number
 * @desc 通行(4方向)の壁の幅
 * @default 2
 * @parent ▽ Area Type ▽
 *
 *
 * @param === Command ===
 * @default === コマンド関連 ===
 * 
 * @param Plugin Commands
 * @type struct<Plugin>
 * @desc プラグインコマンド名
 * @default {"MiniMap":"MiniMap","ChangeMinimap":"ChangeMinimap","SetMinimapZoom":"SetMinimapZoom","SetMinimapFrame":"SetMinimapFrame","Marking":"Marking","DeleteMarking":"DeleteMarking","HighlightMarking":"HighlightMarking","HighlightEvMarker":"HighlightEvMarker"}
 * @parent === Command ===
 * 
 * @param Map Metadata
 * @type struct<MapMeta>
 * @desc マップメモ欄のデータ名
 * @default {"MiniMap":"MiniMap","MinimapZoom":"MinimapZoom"}
 * @parent === Command ===
 * 
 * @param Event Metadata
 * @type struct<EventMeta>
 * @desc イベントメモ欄のデータ名
 * @default {"Marker":"Marker"}
 * @parent === Command ===
 * 
 * 
 * @requiredAssets img/system/MinimapMarkerSet
 * 
 * @noteParam Minimap
 * @noteRequire 1
 * @noteDir img/system/
 * @noteType file
 * @noteData maps
 * 
 */

/*~struct~MinimapData:
 * @param x
 * @type number
 * @desc X座標
 * @default 32
 *
 * @param y
 * @type number
 * @desc Y座標
 * @default 32
 *
 * @param width
 * @type number
 * @min 1
 * @desc 幅
 * @default 160
 *
 * @param height
 * @type number
 * @min 1
 * @desc 高さ
 * @default 128
 *
 * @param type
 * @type number
 * @max 2
 * @desc 表示タイプ
 * 0:全体, 1:周辺(ループ適用), 2:周辺(ループなし)
 * @default 1
 *
 * @param opacity
 * @type number
 * @max 255
 * @desc 不透明度
 * @default 192
 *
 * @param zoom
 * @desc 拡大率
 * @default 1.0
 *
 */

/*~struct~Marker:
 * @param Icon Index
 * @type number
 * @desc アイコン番号
 * @default 1
 *
 * @param oy
 * @desc Y軸の原点座標
 * @default 0.5
 *
 * @param turn?
 * @type boolean
 * @desc 向きに合わせて画像を回転させるかどうか
 * @default false
 *
 */

/*~struct~Vehicle:
 * @param boat
 * @type number
 * @desc 小型船
 * @default 2
 *
 * @param ship
 * @type number
 * @desc 大型船
 * @default 2
 *
 * @param airship
 * @type number
 * @desc 飛行船
 * @default 2
 *
 */

/*~struct~Plugin:
 * @param MiniMap
 * @desc ミニマップの表示
 * @default MiniMap
 *
 * @param ChangeMinimap
 * @desc 指定したマップIDのミニマップに変更
 * @default ChangeMinimap
 *
 * @param SetMinimapZoom
 * @desc ミニマップの拡大率のみ変更
 * @default SetMinimapZoom
 *
 * @param SetMinimapFrame
 * @desc ミニマップの上にフレーム画像を表示
 * @default SetMinimapFrame
 *
 *
 * @param Marking
 * @desc マーキングを表示
 * @default Marking
 *
 * @param DeleteMarking
 * @desc マーキング番号 n を削除
 * @default DeleteMarking
 *
 *
 * @param HighlightMarking
 * @desc マーキング番号 n を強調表示
 * @default HighlightMarking
 *
 * @param HighlightEvMarker
 * @desc イベントのマーカーアイコンを強調表示
 * @default HighlightEvMarker
 *
 */

/*~struct~MapMeta:
 * @param MiniMap
 * @desc このマップのミニマップ画像のファイル名
 * @default MiniMap
 *
 * @param MinimapZoom
 * @desc このマップのミニマップ拡大率
 * @default MinimapZoom
 *
 */

/*~struct~EventMeta:
 * @param Marker
 * @desc ミニマップに表示するこのイベントのマーカー番号
 * @default Marker
 */

var $dataMinimap = null;
var $gameMinimap = null;

function Game_MiniMap() {
    this.initialize.apply(this, arguments);
}

function Sprite_MiniMap() {
    this.initialize.apply(this, arguments);
}

function MppSprite_Loop() {
    this.initialize.apply(this, arguments);
}

(function() {

var MPPlugin = {};

(function() {
    
    var parameters = PluginManager.parameters('MPP_MiniMap');
    
    function convertParam(name) {
        var param = parameters[name];
        var result = [];
        if (param) {
            var data = param.split(',');
            for (var i = 0; i < data.length; i++) {
                if (/(\d+)\s*-\s*(\d+)/.test(data[i])) {
                    for (var n = Number(RegExp.$1); n <= Number(RegExp.$2); n++) {
                        result.push(n);
                    }
                } else {
                    result.push(Number(data[i]));
                }
            }
        }
        return result;
    };
    function reviverParse(key, value) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    function reviverEval(key, value) {
        try {
            return eval(value);
        } catch (e) {
            return value;
        }
    }

    MPPlugin.MapIDs = convertParam('Map IDs');
    var minimapData = JSON.parse(parameters['Minimap Data'] || '[]');
    for (var i = 0; i < minimapData.length; i++) {
        minimapData[i] = JSON.parse(minimapData[i], reviverEval);
    }
    MPPlugin.MinimapData = minimapData;
    MPPlugin.DefaultDataIndex = Number(parameters['Default Data Index'] || 0);
    MPPlugin.MinimapZ = Number(parameters['Minimap Z'] || 0);
    MPPlugin.FrameImages = JSON.parse(parameters['Frame Images'] || '[]');
    MPPlugin.DefaultFrameIndex = Number(parameters['Default Frame Index'] || 0);
    
    MPPlugin.UpdateCount = Math.max(Number(parameters['Update Count'] || 80), 1);
    MPPlugin.BlinkDuration = Number(parameters['Blink Duration'] || 80);
    MPPlugin.ScrollMapLink = !!eval(parameters['Scroll Map Link?']);

    MPPlugin.PlayerMarker = JSON.parse(parameters['Player Marker _v3'], reviverEval);
    MPPlugin.VehicleOnMarker = JSON.parse(parameters['Vehicle On Marker _v3'], reviverEval);
    MPPlugin.PlayerHighlight = !!eval(parameters['Player Highlight?']);
    MPPlugin.VehicleOffMarkers = JSON.parse(parameters['Vehicle Off Markers _v3'], reviverEval);
    
    MPPlugin.TileSize = Math.max(Number(parameters['Tile Size']), 1);
    MPPlugin.BlurIntensity = Number(parameters['Blur Intensity'] || 2);

    function convertColor(rgba) {
        return 'rgba(' + rgba + ')';
    }
    MPPlugin.colors = {};
    MPPlugin.colors.Land = convertColor(parameters['Land Color']);
    MPPlugin.colors.Sea = convertColor(parameters['Sea Color']);
    MPPlugin.colors.Ford = convertColor(parameters['Ford Color']);
    MPPlugin.colors.Mountain = convertColor(parameters['Mountain Color']);
    MPPlugin.colors.Hill = convertColor(parameters['Hill Color']);
    MPPlugin.colors.Forest = convertColor(parameters['Forest Color']);

    MPPlugin.colors.River = convertColor(parameters['River Color']);
    MPPlugin.colors.Shallow = convertColor(parameters['Shallow Color']);
    MPPlugin.colors.Ladder = convertColor(parameters['Ladder Color']);
    MPPlugin.colors.Bush = convertColor(parameters['Bush Color']);
    MPPlugin.colors.Counter = convertColor(parameters['Counter Color']);
    MPPlugin.colors.Wall = convertColor(parameters['Wall Color']);
    MPPlugin.colors.Floor = convertColor(parameters['Floor Color']);
    MPPlugin.WallRegionIDs = convertParam('Wall Region IDs');
    MPPlugin.FloorRegionIDs = convertParam('Floor Region IDs');
    MPPlugin.Dir4WallWidth = Number(parameters['Dir4 Wall Width']);

    MPPlugin.mColors = JSON.parse(parameters['Marking Colors'] || "[]");
    MPPlugin.mColors = MPPlugin.mColors.map(convertColor);
    MPPlugin.mColors.unshift('rgba(0,0,0,0)');
    MPPlugin.HighlightMarkerBlink = !!eval(parameters['Highlight Marker Blink?']);
    MPPlugin.HighlightMarkerScale = Number(parameters['Highlight Marker Scale'] || 1.5);
    
    MPPlugin.PluginCommands = JSON.parse(parameters['Plugin Commands']);
    MPPlugin.MapMetadata = JSON.parse(parameters['Map Metadata']);
    MPPlugin.EventMetadata = JSON.parse(parameters['Event Metadata']);

})();

var Alias = {};

//-----------------------------------------------------------------------------
// MiniMap

var MiniMap = {
    image:null,
    createMinimap:function() {
        var name = MPPlugin.MapMetadata.Minimap || "Minimap";
        if ($dataMinimap.meta[name]) {
            MiniMap.image = ImageManager.loadSystem($dataMinimap.meta[name]);
            return;
        }
        var flags = $gameMinimap.tilesetFlags();
        var width = $gameMinimap.width();
        var height = $gameMinimap.height();
        var data = $gameMinimap.data();
        var overworld = $gameMinimap.isOverworld();
        var size = MPPlugin.TileSize;
        var colors = MPPlugin.colors;
        var wallIds = MPPlugin.WallRegionIDs;
        var floorIds = MPPlugin.FloorRegionIDs;
        var dir4W = MPPlugin.Dir4WallWidth;
        var image = new Bitmap(width * size, height * size);
        var tileId, color, wallDir;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                wallDir = 0;
                if (overworld) {
                    tileId = data[(0 * height + y) * width + x] || 0;
                    var index0 = Math.floor((tileId - 2048) / 48);
                    tileId = data[(1 * height + y) * width + x] || 0;
                    var index1 = Math.floor((tileId - 2048) / 48);
                    if (index0 < 16) {
                        color = (index1 === 1 ? colors.Sea : colors.Ford);
                    } else {
                        switch (index1) {
                        case 20: case 21: case 28: case 36: case 44:
                            color = colors.Forest;
                            break;
                        case 22: case 30: case 38: case 46:
                            color = colors.Hill;
                            break;
                        case 23: case 31: case 39: case 47:
                            color = colors.Mountain;
                            break;
                        default:
                            color = colors.Land;
                        }
                    }
                } else {
                    tileId = data[(5 * height + y) * width + x] || 0;
                    if (wallIds.contains(tileId)) {
                        color = colors.Wall;
                    } else if (floorIds.contains(tileId)) {
                        color = colors.Floor;
                    } else {
                        color = colors.Wall;
                        for (var z = 3; z >= 0; z--) {
                            tileId = data[(z * height + y) * width + x] || 0;
                            var flag = flags[tileId];
                            if ((flag & 0x10) !== 0) continue;
                            var index = Math.floor((tileId - 2048) / 48);
                            if (index >= 0 && index < 16) {
                                color = ((flag & 0x0f) === 0x0f ? colors.River : colors.Shallow);
                            } else if ((flag & 0x20) !== 0) {
                                color = colors.Ladder;
                            } else if ((flag & 0x40) !== 0) {
                                color = colors.Bush;
                            } else if ((flag & 0x80) !== 0) {
                                color = colors.Counter;
                            } else if ((flag & 0x0f) === 0x0f) {
                                color = colors.Wall;
                            } else {
                                color = colors.Floor;
                                wallDir = flag & 0x0f;
                            }
                            break;
                        }
                    }
                }
                image.fillRect(x * size, y * size, size, size, color);
                if (wallDir > 0 && dir4W > 0) {
                    color = colors.Wall;
                    if ((flag & 0x01) === 0x01) {
                        image.fillRect(x * size, (y + 1) * size - dir4W, size, dir4W, color);
                    }
                    if ((flag & 0x02) === 0x02) {
                        image.fillRect(x * size, y * size, dir4W, size, color);
                    }
                    if ((flag & 0x04) === 0x04) {
                        image.fillRect((x + 1) * size - dir4W, y * size, dir4W, size, color);
                    }
                    if ((flag & 0x08) === 0x08) {
                        image.fillRect(x * size, y * size, size, dir4W, color);
                    }
                }
            }
        }
        image.mpBlur();
        MiniMap.image = image;
    }
};

//-----------------------------------------------------------------------------
// Math

Math.hypot = Math.hypot || function() {
  var y = 0;
  var length = arguments.length;

  for (var i = 0; i < length; i++) {
    if (arguments[i] === Infinity || arguments[i] === -Infinity) {
      return Infinity;
    }
    y += arguments[i] * arguments[i];
  }
  return Math.sqrt(y);
};

//-----------------------------------------------------------------------------
// Bitmap

Bitmap.prototype.mpBlur = function() {
    var w = this.width;
    var h = this.height;
    var canvas = this._canvas;
    var context = this._context;
    var tempCanvas = document.createElement('canvas');
    var tempContext = tempCanvas.getContext('2d');
    tempCanvas.width = w + 2;
    tempCanvas.height = h + 2;
    context.save();
    for (var i = 0; i < MPPlugin.BlurIntensity; i++) {
        tempContext.clearRect(0, 0, w + 2, h + 2);
        tempContext.drawImage(canvas, 0, 0, w, h, 1, 1, w, h);
        tempContext.drawImage(canvas, 0, 0, w, 1, 1, 0, w, 1);
        tempContext.drawImage(canvas, 0, h - 1, w, 1, 0, h + 1, w, 1);
        tempContext.drawImage(tempCanvas, 1, 0, 1, h + 2, 0, 0, 1, h + 2);
        tempContext.drawImage(tempCanvas, w, 0, 1, h + 2, w + 1, 0, 1, h + 2);
        context.clearRect(0, 0, w, h);
        context.globalCompositeOperation = 'lighter';
        context.globalAlpha = 1 / 9;
        for (var n = 0; n < 9; n++) {
            var x = n % 3;
            var y = Math.floor(n / 3);
            context.drawImage(tempCanvas, x, y, w, h, 0, 0, w, h);
        }
    }
    context.restore();
    this._setDirty();
};

//-----------------------------------------------------------------------------
// DataManager

DataManager.loadMinimapData = function(mapId) {
    if (mapId === $gameMap.mapId()) {
        $dataMinimap = $dataMap;
    } else if (mapId > 0) {
        var filename = 'Map%1.json'.format(mapId.padZero(3));
        this.loadDataFile('$dataMinimap', filename);
    }
};

//125
Alias.DaMa_onLoad = DataManager.onLoad;
DataManager.onLoad = function(object) {
    if (object === $dataMinimap) {
        this.extractMetadata(object);
        var array = object.events;
        if (Array.isArray(array)) {
            for (var i = 0; i < array.length; i++) {
                var data = array[i];
                if (data && data.note !== undefined) {
                    this.extractMetadata(data);
                }
            }
        }
    } else {
        Alias.DaMa_onLoad.call(this, object);
    }
};

//195
Alias.DaMa_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    Alias.DaMa_createGameObjects.call(this);
    $gameMinimap       = new Game_MiniMap();
};

//425
Alias.DaMa_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    var contents = Alias.DaMa_makeSaveContents.call(this);
    contents.minimap      = $gameMinimap;
    return contents;
};

//441
Alias.DaMa_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    Alias.DaMa_extractSaveContents.call(this, contents);
    $gameMinimap       = contents.minimap || new Game_MiniMap();
    $gameMinimap.requestCreate = true;
};

//-----------------------------------------------------------------------------
// Game_Temp

//10
Alias.GaTe_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    Alias.GaTe_initialize.call(this);
    this.gameMinimapLoaded = false;
};

//-----------------------------------------------------------------------------
// Game_Map

//37
Alias.GaMa_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    Alias.GaMa_setup.call(this, mapId);
    if (MPPlugin.MapIDs.contains(mapId)) {
        $gameMinimap.setup(mapId);
    } else {
        $gameMinimap.clear();
    }
};

//-----------------------------------------------------------------------------
// Game_MiniMap

Game_MiniMap.prototype.initialize = function() {
    this.mapId = 0;
    $dataMinimap = null;
    this.tileset = null;
    this._dataIndex = MPPlugin.DefaultDataIndex;
    var data = MPPlugin.MinimapData[this.dataIndex];
    this.zoom = data ? data.zoom || 1 : 1;
    this.requestFrame = false;
    this.requestMarker = false;
    this.requestHighlight = false;
    this._dataLoaded = false;
    this._markingData = [];
    this._frameIndex = MPPlugin.DefaultFrameIndex;
    this.requestCreate = false;
    this._x = 0;
    this._y = 0;
    this._tileX = 1;
    this._tileY = 1;
    this._lastBaseX = 0;
    this._lastBaseY = 0;
};

Game_MiniMap.prototype.setup = function(mapId) {
    if (this.mapId !== mapId) {
        this.mapId = mapId;
        this.create();
    }
};

Game_MiniMap.prototype.clear = function() {
    this.mapId = 0;
    $dataMinimap = null;
    MiniMap.image = null;
    this.requestFrame = true;
    this.requestMarker = true;
    this.requestHighlight = true;
    this._dataLoaded = false;
    $gameTemp.gameMinimapLoaded = false;
};

Game_MiniMap.prototype.create = function() {
    $dataMinimap = null;
    MiniMap.image = null;
    DataManager.loadMinimapData(this.mapId);
    this.requestFrame = true;
    this.requestMarker = true;
    this.requestHighlight = true;
    this._dataLoaded = false;
    $gameTemp.gameMinimapLoaded = false;
};

Game_MiniMap.prototype.tilesetFlags = function() {
    return this.tileset ? this.tileset.flags : [];
};

Game_MiniMap.prototype.x = function() {
    return this._x;
};

Game_MiniMap.prototype.y = function() {
    return this._y;
};

Game_MiniMap.prototype.width = function() {
    return $dataMinimap.width;
};

Game_MiniMap.prototype.height = function() {
    return $dataMinimap.height;
};

Game_MiniMap.prototype.data = function() {
    return $dataMinimap.data;
};

Game_MiniMap.prototype.isLoopHorizontal = function() {
    return this.type() !== 2 &&
            ($dataMinimap.scrollType === 2 || $dataMinimap.scrollType === 3);
};

Game_MiniMap.prototype.isLoopVertical = function() {
    return this.type() !== 2 &&
            ($dataMinimap.scrollType === 1 || $dataMinimap.scrollType === 3);
};

Game_MiniMap.prototype.isOverworld = function() {
    return this.tileset && this.tileset.mode === 0;
};

Game_MiniMap.prototype.isOnCurrentMap = function() {
    return this.mapId === $gameMap.mapId();
};

Game_MiniMap.prototype.centerX = function() {
    return this._tileX / 2;
};

Game_MiniMap.prototype.centerY = function() {
    return this._tileY / 2;
};

Game_MiniMap.prototype.adjustX = function(x) {
    if (this.isLoopHorizontal() && x < this._x - 
            (this.width() - this._tileX) / 2) {
        return x - this._x + this.width();
    } else {
        return x - this._x;
    }
};

Game_MiniMap.prototype.adjustY = function(y) {
    if (this.isLoopVertical() && y < this._y -
            (this.height() - this._tileY) / 2) {
        return y - this._y + this.height();
    } else {
        return y - this._y;
    }
};

Game_MiniMap.prototype.posData = function() {
    return this._dataIndex > 0 ? MPPlugin.MinimapData[this._dataIndex - 1] : null;
};

Game_MiniMap.prototype.rectX = function() {
    var data = this.posData();
    return data ? data.x : 0;
};

Game_MiniMap.prototype.rectY = function() {
    var data = this.posData();
    return data ? data.y : 0;
};

Game_MiniMap.prototype.rectWidth = function() {
    var data = this.posData();
    return data ? data.width : 0;
};

Game_MiniMap.prototype.rectHeight = function() {
    var data = this.posData();
    return data ? data.height : 0;
};

Game_MiniMap.prototype.type = function() {
    var data = this.posData();
    return data ? data.type : 0;
};

Game_MiniMap.prototype.opacity = function() {
    var data = this.posData();
    return data ? data.opacity : 0;
};

Game_MiniMap.prototype.frameName = function() {
    return this._frameIndex > 0 ? MPPlugin.FrameImages[this._frameIndex - 1] || "" : "";
};

Game_MiniMap.prototype.setDataIndex = function(index) {
    if (this._dataIndex !== index) {
        this._dataIndex = index;
        var data = this.posData();
        this.zoom = data ? data.zoom || 1 : 1;
        this.requestFrame = true;
    }
};

Game_MiniMap.prototype.setupScale = function(tileX, tileY) {
    this._tileX = tileX;
    this._tileY = tileY;
    this.setCenter();
};

Game_MiniMap.prototype.setCenter = function() {
    this._lastBaseX = this.baseX();
    this._lastBaseY = this.baseY();
    this.setMinimapPos(this._lastBaseX - this.centerX(), this._lastBaseY - this.centerY());
};

Game_MiniMap.prototype.baseX = function() {
    if (this.type() === 0 || !this.isOnCurrentMap()) {
        return this.width() / 2;
    } else if (MPPlugin.ScrollMapLink) {
        return $gameMap.displayX() + $gamePlayer.centerX() + 0.5;
    } else {
        return $gamePlayer._realX + 0.5;
    }
};

Game_MiniMap.prototype.baseY = function() {
    if (this.type() === 0 || !this.isOnCurrentMap()) {
        return this.height() / 2;
    } else if (MPPlugin.ScrollMapLink) {
        return $gameMap.displayY() + $gamePlayer.centerY() + 0.5;
    } else {
        return $gamePlayer._realY + 0.5;
    }
};

Game_MiniMap.prototype.setMinimapPos = function(x, y) {
    if (this.isLoopHorizontal()) {
        this._x = x.mod(this.width());
    } else {
        this._x = x.clamp(0, this.width() - this._tileX);
    }
    if (this.isLoopVertical()) {
        this._y = y.mod(this.height());
    } else {
        this._y = y.clamp(0, this.height() - this._tileY);
    }
};

Game_MiniMap.prototype.scrollDown = function(distance) {
    if (this.isLoopVertical()) {
        this._y += distance;
        this._y %= this.height();
    } else if (this.height() > this._tileY) {
        this._y = Math.min(this._y + distance, this.height() - this._tileY);
    }
};

Game_MiniMap.prototype.scrollLeft = function(distance) {
    if (this.isLoopHorizontal()) {
        this._x += this.width() - distance;
        this._x %= this.width();
    } else if (this.width() >= this._tileX) {
        this._x = Math.max(this._x - distance, 0);
    }
};

Game_MiniMap.prototype.scrollRight = function(distance) {
    if (this.isLoopHorizontal()) {
        this._x += distance;
        this._x %= this.width();
    } else if (this.width() >= this._tileX) {
        this._x = Math.min(this._x + distance, this.width() - this._tileX);
    }
};

Game_MiniMap.prototype.scrollUp = function(distance) {
    if (this.isLoopVertical()) {
        this._y += this.height() - distance;
        this._y %= this.height();
    } else if (this.height() >= this._tileY) {
        this._y = Math.max(this._y - distance, 0);
    }
};

Game_MiniMap.prototype.isEnabled = function() {
    return this.isReady() && this._dataIndex > 0 &&
            this.zoom > 0 && this.rectWidth() > 0 && this.rectHeight() > 0;
};

Game_MiniMap.prototype.isReady = function() {
    if (!this._dataLoaded && !!$dataMinimap) {
        this.onMinimapLoaded();
        this._dataLoaded = true;
    }
    return !!$dataMinimap;
};

Game_MiniMap.prototype.onMinimapLoaded = function() {
    this.tileset = $dataTilesets[$dataMinimap.tilesetId];
    var name = MPPlugin.MapMetadata.MinimapZoom || "MinimapZoom";
    if ($dataMinimap.meta[name]) {
        this.zoom = Number($dataMinimap.meta[name]);
    }
    setTimeout(MiniMap.createMinimap, 1);
};

Game_MiniMap.prototype.allEvents = function() {
    if (this.isOnCurrentMap()) {
        return $gameMap.events().concat($gameMap.vehicles());
    } else {
        return $gameMap.vehicles();
    }
};

Game_MiniMap.prototype.markingData = function() {
    return this._markingData.filter(function(data, index) {
        if (index === 10) {
            console.log(data.mapId, this.mapId);
        }
        return data && data.mapId === this.mapId;
    }, this);
};

Game_MiniMap.prototype.setMarking = function(id, param) {
    this._markingData[id] = param;
    this.requestMarker = true;
    this.requestHighlight = true;
};

Game_MiniMap.prototype.removeMarking = function(id) {
    this._markingData[id] = null;
    this.requestMarker = true;
    this.requestHighlight = true;
};

Game_MiniMap.prototype.update = function() {
    if ($gameTemp.gameMinimapLoaded && this.mapId > 0 && this.type() !== 0) {
        this.updateScroll();
    }
};

Game_MiniMap.prototype.updateScroll = function() {
    var x1 = this.adjustX(this._lastBaseX);
    var y1 = this.adjustY(this._lastBaseY);
    var x2 = this.adjustX(this.baseX());
    var y2 = this.adjustY(this.baseY());
    if (y2 > y1 && y2 > this.centerY()) {
        this.scrollDown(y2 - y1);
    }
    if (x2 < x1 && x2 < this.centerX()) {
        this.scrollLeft(x1 - x2);
    }
    if (x2 > x1 && x2 > this.centerX()) {
        this.scrollRight(x2 - x1);
    }
    if (y2 < y1 && y2 < this.centerY()) {
        this.scrollUp(y1 - y2);
    }
    this._lastBaseX = this.baseX();
    this._lastBaseY = this.baseY();
};

Game_MiniMap.prototype.highlightMarking = function(id, bool) {
    var param = this._markingData[id];
    if (param && param.dType === 'Ico') {
        param.highlight = bool;
        this.requestHighlight = true;
    }
};

//-----------------------------------------------------------------------------
// Game_Player

Game_Player.prototype.minimapX = function() {
    return $gameMinimap.adjustX(this._realX + 0.5);
};

Game_Player.prototype.minimapY = function() {
    return $gameMinimap.adjustY(this._realY + 0.5);
};

//-----------------------------------------------------------------------------
// Game_Vehicle

Game_Vehicle.prototype.marker = function() {
    if (!this._driving && this._mapId === $gameMinimap.mapId) {
        return MPPlugin.VehicleOffMarkers[this._type] || 0;
    } else {
        return 0;
    }
};

//-----------------------------------------------------------------------------
// Game_Event

//14
Alias.GaEv_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
    Alias.GaEv_initialize.call(this, mapId, eventId);
    var name = MPPlugin.EventMetadata.Marker || "Marker";
    var marker = this.event().meta[name];
    this._marker = (marker ? Number(marker) : 0);
};

Game_Event.prototype.marker = function() {
    return (this._pageIndex >= 0 && !this.isTransparent() ? this._marker : 0);
};

//-----------------------------------------------------------------------------
// Game_Interpreter

//1722
Alias.GaIn_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Alias.GaIn_pluginCommand.call(this, command, args);
    var args2 = args.map(function(arg) {
        return arg.replace(/v\[(\d+)\]/g, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        });
    });
    switch (command) {
        case MPPlugin.PluginCommands.MiniMap:
        case 'MiniMap':
            $gameMinimap.setDataIndex(eval(args2[0] || 0));
            break;
        case MPPlugin.PluginCommands.ChangeMinimap:
        case 'ChangeMinimap':
            var mapId = eval(args2[0]) || $gameMap.mapId();
            $gameMinimap.setup(mapId);
            break;
        case MPPlugin.PluginCommands.SetMinimapFrame:
        case 'SetMinimapFrame':
            $gameMinimap._frameIndex = eval(args2[0]);
            break;
        case MPPlugin.PluginCommands.SetMinimapZoom:
        case 'SetMinimapZoom':
            var zoom = eval(args2[0]);
            if (zoom > 0) {
                $gameMinimap.zoom = zoom;
                $gameMinimap.requestFrame = true;
            }
            break;
        case MPPlugin.PluginCommands.Marking:
        case 'Marking':
            var id = eval(args2.shift());
            var param = {};
            param.mapId = eval(args2.shift()) || $gameMinimap.mapId;
            param.pType = args2.shift();
            if (param.pType === 'Ev') {
                param.id = eval(args2.shift() || 0);
            } else if (param.pType === 'Pos') {
                param.x = eval(args2.shift() || 0);
                param.y = eval(args2.shift() || 0);
            }
            param.dType = args2.shift();
            if (param.dType === 'Cir') {
                param.r = eval(args2.shift() || 0);
                param.c = eval(args2.shift() || 0);
            } else if (param.dType === 'Rec') {
                param.w = eval(args2.shift() || 0);
                param.h = eval(args2.shift() || 0);
                param.c = eval(args2.shift() || 0);
            } else if (param.dType === 'Ico') {
                param.m = eval(args2.shift() || 0);
            }
            $gameMinimap.setMarking(id, param);
            break;
        case MPPlugin.PluginCommands.DeleteMarking:
        case 'DeleteMarking':
            $gameMinimap.removeMarking(eval(args2[0]));
            break;
        case MPPlugin.PluginCommands.HighlightMarking:
        case 'HighlightMarking':
            var id = eval(args2[0] || 0);
            var bool = !!eval(args2[1] || 'true');
            $gameMinimap.highlightMarking(id, bool);
            break;
        case MPPlugin.PluginCommands.HighlightEvMarker:
        case 'HighlightEvMarker':
            var event = this.character(eval(args2[0] || 0));
            if (event && event !== $gamePlayer) {
                event.markerHighlight = !!eval(args2[1] || 'true');
                $gameMinimap.requestHighlight = true;
            }
            break;
    }
};

//-----------------------------------------------------------------------------
// Sprite_Loop

MppSprite_Loop.prototype = Object.create(Sprite.prototype);
MppSprite_Loop.prototype.constructor = MppSprite_Loop;

MppSprite_Loop.prototype.initialize = function(bitmap) {
    Sprite.prototype.initialize.call(this, bitmap);
    for (var i = 0; i < 4; i++) {
        this.addChild(new Sprite(bitmap));
    }
};

MppSprite_Loop.prototype._refresh = function() {
    var frameX = Math.floor(this._frame.x);
    var frameY = Math.floor(this._frame.y);
    var frameW = Math.floor(this._frame.width);
    var frameH = Math.floor(this._frame.height);
    var bitmapW = this._bitmap ? this._bitmap.width : 0;
    var bitmapH = this._bitmap ? this._bitmap.height : 0;
    var realX1 = frameX.clamp(0, bitmapW);
    var realY1 = frameY.clamp(0, bitmapH);
    var realW1 = (frameW - realX1 + frameX).clamp(0, bitmapW - realX1);
    var realH1 = (frameH - realY1 + frameY).clamp(0, bitmapH - realY1);
    var realX2 = 0;
    var realY2 = 0;
    var realW2 = (frameW - realW1).clamp(0, frameW);
    var realH2 = (frameH - realH1).clamp(0, frameH);
    var x1 = Math.floor(-frameW * this.anchor.x);
    var y1 = Math.floor(-frameH * this.anchor.y);
    var x2 = x1 + realW1;
    var y2 = y1 + realH1;
    var sprite = this.children[0];
    sprite.bitmap = this._bitmap;
    sprite.move(x1, y1);
    sprite.setFrame(realX1, realY1, realW1, realH1);
    sprite = this.children[1];
    sprite.bitmap = this._bitmap;
    sprite.move(x2, y1);
    sprite.setFrame(realX2, realY1, realW2, realH1);
    sprite = this.children[2];
    sprite.bitmap = this._bitmap;
    sprite.move(x1, y2);
    sprite.setFrame(realX1, realY2, realW1, realH2);
    sprite = this.children[3];
    sprite.bitmap = this._bitmap;
    sprite.move(x2, y2);
    sprite.setFrame(realX2, realY2, realW2, realH2);
};

//-----------------------------------------------------------------------------
// Sprite_MiniMap

Sprite_MiniMap.prototype = Object.create(Sprite.prototype);
Sprite_MiniMap.prototype.constructor = Sprite_MiniMap;

Sprite_MiniMap.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._updateCount = 0;
    this._blinkDuration = MPPlugin.BlinkDuration;
    this._markerSet = ImageManager.loadSystem('MinimapMarkerSet');
    this._markerSet.smooth = true;
    this._markerSize = Math.floor(this._markerSet.width / 8);
    this._playerMarker = 0;
    this._realRect = new Rectangle();
    this._tileWidth = 1;
    this._tileHeight = 1;
    this.createMiniMapSprite();
    this.createMarkerSprite();
    this.createPlayerSprite();
    this.createFrameSprite();
    this._highlightSprites = [];
    this.visible = false;
    this.show = true;
    $gameTemp.gameMinimapLoaded = false;
    $gameMinimap.requestHighlight = true;
};

Sprite_MiniMap.prototype.createMiniMapSprite = function() {
    this._miniMapSprite = new MppSprite_Loop();
    this._miniMapSprite.anchor.x = 0.5;
    this._miniMapSprite.anchor.y = 0.5;
    this.addChild(this._miniMapSprite);
};

Sprite_MiniMap.prototype.createMarkerSprite = function() {
    this._markerSprite = new MppSprite_Loop();
    this._markerSprite.anchor.x = 0.5;
    this._markerSprite.anchor.y = 0.5;
    this.addChild(this._markerSprite);
};

Sprite_MiniMap.prototype.createPlayerSprite = function() {
    this._playerSprite = new Sprite();
    this._playerSprite.bitmap = this._markerSet;
    this._playerSprite.anchor.x = 0.5;
    this.addChild(this._playerSprite);
    this._playerMarker = MPPlugin.PlayerMarker;
    this.refreshPlayer();
};

Sprite_MiniMap.prototype.createFrameSprite = function() {
    this._frameSprite = new Sprite();
    this._frameName = $gameMinimap.frameName();
    this._frameSprite.bitmap = ImageManager.loadPicture(this._frameName);
    this._frameSprite.anchor.x = 0.5;
    this._frameSprite.anchor.y = 0.5;
    this.addChild(this._frameSprite);
};

Sprite_MiniMap.prototype.isReady = function() {
    if (!$gameTemp.gameMinimapLoaded && MiniMap.image && MiniMap.image.isReady()) {
        this.onMinimapLoaded();
        $gameTemp.gameMinimapLoaded = true;
    }
    return $gameTemp.gameMinimapLoaded;
};

Sprite_MiniMap.prototype.onMinimapLoaded = function() {
    this._baseBitmap = MiniMap.image;
    this._miniMapSprite.bitmap = this._baseBitmap;
    this.refreshFrame();
};

Sprite_MiniMap.prototype.update = function() {
    Sprite.prototype.update.call(this);
    $gameMinimap.update();
    this.visible = $gameMinimap.isEnabled() && this.isReady() && this.show;
    if (!this.visible) return;
    if ($gameMinimap.requestFrame) {
        this.refreshFrame();
        $gameMinimap.requestFrame = false;
    }
    this._updateCount++;
    this._blinkDuration--;
    this.updateAllParts();
};

Sprite_MiniMap.prototype.refreshFrame = function() {
    var bw = this._baseBitmap.width;
    var bh = this._baseBitmap.height;
    var realRect = this._realRect;
    var rw = $gameMinimap.rectWidth();
    var rh = $gameMinimap.rectHeight();
    if ($gameMinimap.type() === 0) {
        $gameMinimap.zoom = Math.min(rw / bw, rh / bh);
    }
    var zoom = $gameMinimap.zoom;
    realRect.width = Math.round(Math.min(rw, bw * zoom));
    realRect.height = Math.round(Math.min(rh, bh * zoom));
    realRect.x = $gameMinimap.rectX() + Math.floor((rw - realRect.width) / 2);
    realRect.y = $gameMinimap.rectY() + Math.floor((rh - realRect.height) / 2);
    this._tileWidth = bw / $gameMinimap.width();
    this._tileHeight = bh / $gameMinimap.height();
    var tileX = realRect.width / (this._tileWidth * zoom);
    var tileY = realRect.height / (this._tileHeight * zoom);
    $gameMinimap.setupScale(tileX, tileY);
    
    this.x = realRect.x + realRect.width / 2;
    this.y = realRect.y + realRect.height / 2;
    this._miniMapSprite.scale.x = zoom;
    this._miniMapSprite.scale.y = zoom;
    this._miniMapSprite.opacity = $gameMinimap.opacity();
    var width = Math.floor(bw * zoom);
    var height = Math.floor(bh * zoom);
    this._markerSprite.bitmap = new Bitmap(width, height);
    this.redrawAllMarker();
};

Sprite_MiniMap.prototype.updateAllParts = function() {
    this.updatePlayer();
    this.updateMiniMap();
    this.updateMarker();
    this.updateMinimapFrame();
    this.updateHighlight();
};

Sprite_MiniMap.prototype.updatePlayer = function() {
    var sprite = this._playerSprite;
    sprite.visible = $gameMinimap.isOnCurrentMap();
    if (!sprite.visible) return;
    this.updatePlayerMarker();
    if (this._playerMarker['turn?']) {
        switch ($gamePlayer.direction()) {
        case 2:
            sprite.rotation = 180 * Math.PI / 180;
            break;
        case 4:
            sprite.rotation = 270 * Math.PI / 180;
            break;
        case 6:
            sprite.rotation = 90 * Math.PI / 180;
            break;
        case 8:
            sprite.rotation = 0 * Math.PI / 180;
            break;
        }
    } else {
        sprite.rotation = 0;
    }
    var rect = this._realRect;
    var zoom = $gameMinimap.zoom;
    var mx = $gamePlayer.minimapX();
    var my = $gamePlayer.minimapY();
    var hw = Math.floor(rect.width / 2);
    var hh = Math.floor(rect.height / 2);
    var px = Math.floor(mx * this._tileWidth * zoom - hw);
    var py = Math.floor(my * this._tileHeight * zoom - hh);
    if (MPPlugin.PlayerHighlight) {
        px = px.clamp(-hw, hw - 1);
        py = py.clamp(-hh, hh - 1);
    }
    sprite.x = px;
    sprite.y = py;
    sprite.visible = (px >= -hw && px < hw && py >= -hh && py < hh);
};

Sprite_MiniMap.prototype.updatePlayerMarker = function() {
    var marker;
    if ($gamePlayer.isInVehicle() &&
            !$gamePlayer._vehicleGettingOn && !$gamePlayer._vehicleGettingOff) {
        marker = MPPlugin.VehicleOnMarker;
    } else {
        marker = MPPlugin.PlayerMarker;
    }
    if (this._playerMarker !== marker) {
        this._playerMarker = marker;
        this.refreshPlayer();
    }
};

Sprite_MiniMap.prototype.refreshPlayer = function() {
    var marker = this._playerMarker;
    var index = marker['Icon Index'];
    var size = this._markerSize;
    var x = index % 8 * size;
    var y = Math.floor(index / 8) * size;
    this._playerSprite.anchor.y = marker.oy;
    this._playerSprite.setFrame(x, y, size, size);
};

Sprite_MiniMap.prototype.updateMiniMap = function() {
    var rect = this._realRect;
    var zoom = $gameMinimap.zoom;
    var x = $gameMinimap.x() * this._tileWidth;
    var y = $gameMinimap.y() * this._tileHeight;
    var w = Math.ceil(rect.width / zoom);
    var h = Math.ceil(rect.height / zoom);
    this._miniMapSprite.setFrame(x, y, w, h);
};

Sprite_MiniMap.prototype.updateMarker = function() {
    if ($gameMinimap.requestMarker || this._updateCount >= MPPlugin.UpdateCount) {
        this.redrawAllMarker();
        $gameMinimap.requestMarker = false;
        this._updateCount = 0;
    }
    var d = MPPlugin.BlinkDuration;
    if (d > 0) {
        if (this._blinkDuration < 0) {
            this._blinkDuration = d - 1;
        }
        this._markerSprite.opacity = 320 * (d - this._updateCount) / d;
    } else {
        this._markerSprite.opacity = 255;
    }
    var rect = this._realRect;
    var zoom = $gameMinimap.zoom;
    var x = $gameMinimap.x() * this._tileWidth * zoom;
    var y = $gameMinimap.y() * this._tileHeight * zoom;
    this._markerSprite.setFrame(x, y, rect.width, rect.height);
};

Sprite_MiniMap.prototype.redrawAllMarker = function() {
    var bitmap = this._markerSprite.bitmap;
    var markerSet = this._markerSet;
    var size = this._markerSize;
    bitmap.clear();
    var bw = bitmap.width;
    var bh = bitmap.height;
    var xRate = bw / $gameMinimap.width();
    var yRate = bh / $gameMinimap.height();
    var horizontal = $gameMinimap.isLoopHorizontal();
    var vertical = $gameMinimap.isLoopVertical();
    var colors = MPPlugin.mColors;
    
    function drawMarker(x, y, marker) {
        var dx = (x + 0.5) * xRate - size / 2;
        var dy = (y + 0.5) * yRate - size / 2;
        var mx = marker % 8 * size;
        var my = Math.floor(marker / 8) * size;
        bitmap.blt(markerSet, mx, my, size, size, dx, dy);
    }
    function drawCircle(x, y, r, c) {
        var color = colors[c];
        var dx1 = (x + 0.5) * xRate;
        var dy1 = (y + 0.5) * yRate;
        var dx2 = dx1 + (dx1 < bw / 2 ? bw : -bw);
        var dy2 = dy1 + (dy1 < bh / 2 ? bh : -bh);
        r *= xRate;
        bitmap.drawCircle(dx1, dy1, r, color);
        if (horizontal) {
            bitmap.drawCircle(dx2, dy1, r, color);
        }
        if (vertical) {
            bitmap.drawCircle(dx1, dy2, r, color);
        }
        if (horizontal && vertical) {
            bitmap.drawCircle(dx2, dy2, r, color);
        }
    }
    function drawRect(x, y, w, h, c) {
        var color = colors[c];
        var dx1 = x * xRate;
        var dy1 = y * yRate;
        var dx2 = dx1 + (dx1 < bw / 2 ? bw : -bw);
        var dy2 = dy1 + (dy1 < bh / 2 ? bh : -bh);
        w *= xRate;
        h *= yRate;
        bitmap.fillRect(dx1, dy1, w, h, color);
        if (horizontal) {
            bitmap.fillRect(dx2, dy1, w, h, color);
        }
        if (vertical) {
            bitmap.fillRect(dx1, dy2, w, h, color);
        }
        if (horizontal && vertical) {
            bitmap.fillRect(dx2, dy2, w, h, color);
        }
    }
    var data = $gameMinimap.markingData();
    for (var i = 0; i < data.length; i++) {
        var param = data[i];
        if (param.highlight) continue;
        var x, y;
        if (param.pType === 'Ev') {
            var event = $gameMap.event(param.id);
            if (event) {
                x = event.x;
                y = event.y;
            } else {
                continue;
            }
        } else {
            x = param.x;
            y = param.y;
        }
        if (param.dType === 'Cir') {
            drawCircle(x, y, param.r, param.c);
        } else if (param.dType === 'Rec') {
            drawRect(x, y, param.w, param.h, param.c);
        } else if (param.dType === 'Ico') {
            drawMarker(x, y, param.m);
        }
    }
    var allEvents = $gameMinimap.allEvents();
    for (var i = 0; i < allEvents.length; i++) {
        var event = allEvents[i];
        var marker = event.marker();
        if (!event.markerHighlight && marker > 0) {
            drawMarker(event.x, event.y, marker);
        }
    }
};

Sprite_MiniMap.prototype.updateMinimapFrame = function() {
    if (this._frameName !== $gameMinimap.frameName()) {
        this._frameName = $gameMinimap.frameName();
        this._frameSprite.bitmap = ImageManager.loadPicture(this._frameName);
    }
};

Sprite_MiniMap.prototype.updateHighlight = function() {
    var sprites = this._highlightSprites;
    if ($gameMinimap.requestHighlight) {
        var data = $gameMinimap.markingData().filter(function(param) {
            return param.highlight;
        });
        var allEvents = $gameMinimap.allEvents().filter(function(event) {
            return event.markerHighlight && event.marker() > 0;
        });;
        var max = data.length + allEvents.length;
        var sprite;
        while (sprites.length > max) {
            sprite = sprites.shift();
            this.removeChild(sprite);
        }
        var bitmap = this._markerSet;
        var size = this._markerSize;
        var dataMax = data.length;
        for (var i = 0; i < dataMax; i++) {
            var param = data[i];
            sprite = sprites[i];
            if (!sprite) {
                sprite = new Sprite_HighlightMarker(bitmap, size);
                this.addChild(sprite);
                sprites[i] = sprite;
            }
            sprite.setParam(param);
            sprite.setIcon(param.m);
        }
        for (var i = 0; i < allEvents.length; i++) {
            var event = allEvents[i];
            sprite = sprites[dataMax + i];
            if (!sprite) {
                sprite = new Sprite_HighlightMarker(bitmap, size);
                this.addChild(sprite);
                sprites[dataMax + i] = sprite;
            }
            sprite.setEvent(event.eventId());
            sprite.setIcon(event.marker());
        }
        $gameMinimap.requestHighlight = false;
    }
    var zoom = $gameMinimap.zoom;
    var hw = this._realRect.width / 2;
    var hh = this._realRect.height / 2;
    var xRate = this._tileWidth * zoom;
    var yRate = this._tileHeight * zoom;
    var type = 1;
    for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        var x = sprite.minimapX() * xRate - hw;
        var y = sprite.minimapY() * yRate - hh;
        if (type === 0) {
            if (x < -hw) {
                y *= -hw / x;
                x = -hw;
            } else if (x > hw) {
                y *= hw / x;
                x = hw;
            }
            if (y < -hh) {
                x *= -hh / y;
                y = -hh;
            } else if (y > hh) {
                x *= hh / y;
                y = hh;
            }
        } else {
            x = x.clamp(-hw, hw);
            y = y.clamp(-hh, hh);
        }
        sprite.x = x;
        sprite.y = y;
        if (MPPlugin.HighlightMarkerBlink && MPPlugin.BlinkDuration > 0) {
            var d = MPPlugin.BlinkDuration;
            sprite.opacity = 320 * (d - this._updateCount) / d;
        }
    }
};

Sprite_MiniMap.prototype.hide = function() {
    this.show = false;
};

//-----------------------------------------------------------------------------
// Sprite_HighlightMarker

function Sprite_HighlightMarker() {
    this.initialize.apply(this, arguments);
}

Sprite_HighlightMarker.prototype = Object.create(Sprite.prototype);
Sprite_HighlightMarker.prototype.constructor = Sprite_HighlightMarker;

Sprite_HighlightMarker.prototype.initialize = function(bitmap, size) {
    Sprite.prototype.initialize.call(this, bitmap);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.scale.x = MPPlugin.HighlightMarkerScale;
    this.scale.y = MPPlugin.HighlightMarkerScale;
    this._size = size;
    this._type = null;
    this._eventId = 0;
    this._mapX = 0;
    this._mapY = 0;
    this._marker = 0;
    this.setIcon(0);
};

Sprite_HighlightMarker.prototype.setParam = function(param) {
    this._type = param.pType;
    if (this._type === 'Ev') {
        this._eventId = param.id;
    } else if (this._type === 'Pos') {
        this._mapX = param.x;
        this._mapY = param.y;
    }
};

Sprite_HighlightMarker.prototype.setPos = function(x, y) {
    this._type = 'Pos';
    this._mapX = x;
    this._mapY = y;
};

Sprite_HighlightMarker.prototype.setEvent = function(eventId) {
    this._type = 'Ev';
    this._eventId = eventId;
};

Sprite_HighlightMarker.prototype.setIcon = function(marker) {
    this._marker = marker;
    this.refreshFrame();
};

Sprite_HighlightMarker.prototype.minimapX = function() {
    var x = 0;
    if (this._type === 'Ev') {
        if ($gameMinimap.isOnCurrentMap()) {
            var event = $gameMap.event(this._eventId);
            if (event) x = event._realX + 0.5;
        }
    } else if (this._type === 'Pos') {
        x = this._mapX + 0.5;
    }
    return $gameMinimap.adjustX(x);
};

Sprite_HighlightMarker.prototype.minimapY = function() {
    var y = 0;
    if (this._type === 'Ev') {
        if ($gameMinimap.isOnCurrentMap()) {
            var event = $gameMap.event(this._eventId);
            if (event) y = event._realY + 0.5;
        }
    } else if (this._type === 'Pos') {
        y = this._mapY + 0.5;
    }
    return $gameMinimap.adjustY(y);
};

Sprite_HighlightMarker.prototype.refreshFrame = function() {
    var marker = this._marker;
    var size = this._size;
    var x = marker % 8 * size;
    var y = Math.floor(marker / 8) * size;
    this.setFrame(x, y, size, size);
};

//-----------------------------------------------------------------------------
// Spriteset_Map

Spriteset_Map.prototype.addMinimap = function(minimap, z) {
    var index = -1;
    if (z === 0) {
        index = this.children.indexOf(this._pictureContainer);
    } else if (z === 1) {
        index = this.children.indexOf(this._timerSprite);
    } else if (z === 2) {
        index = this.children.indexOf(this._flashSprite);
    } else if (z === 3) {
        index = this.children.indexOf(this._fadeSprite) + 1;
    }
    if (index >= 0) {
        this.addChildAt(minimap, index);
    }
};

//-----------------------------------------------------------------------------
// Scene_Map

//36
Alias.ScMa_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    Alias.ScMa_onMapLoaded.call(this);
    if ($gameMinimap.requestCreate) {
        $gameMinimap.create();
        $gameMinimap.requestCreate = false;
    }
};

//107
Alias.ScMa_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function() {
    this._miniMap.hide();
    Alias.ScMa_terminate.call(this);
};

//195
Alias.ScMa_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    Alias.ScMa_createDisplayObjects.apply(this, arguments);
    this.createMinimap();
};

Scene_Map.prototype.createMinimap = function() {
    this._miniMap = new Sprite_MiniMap();
    if (MPPlugin.MinimapZ < 4) {
        this._spriteset.addMinimap(this._miniMap, MPPlugin.MinimapZ);
    } else {
        var index = this.children.indexOf(this._mapNameWindow);
        this.addChildAt(this._miniMap, index);
    }
};

//251
Alias.ScMa_callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function() {
    Alias.ScMa_callMenu.call(this);
    this._miniMap.hide();
};

//288
Alias.ScMa_launchBattle = Scene_Map.prototype.launchBattle;
Scene_Map.prototype.launchBattle = function() {
    Alias.ScMa_launchBattle.call(this);
    this._miniMap.hide();
};

//-----------------------------------------------------------------------------
// Scene_Boot

//29
Alias.ScBo_loadSystemImages = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function() {
    Alias.ScBo_loadSystemImages.call(this);
    ImageManager.reserveSystem('MinimapMarkerSet');
};


})();