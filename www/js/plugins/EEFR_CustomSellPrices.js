/*:
 * ==============================================================================
 *  EEFR_CustomSellPrices.js
 * ==============================================================================
 * @plugindesc A plugin for setting custom prices and modifying the default price.
 * @author FDSuprema - Ed Engine FR
 * ------------------------------------------------------------------------------
 *   
 * @param Sell Percentage
 * @desc The default sell percentage for all items without a custom sell cost. Default is 50 percent.
 * @default 50
 *  
 * ------------------------------------------------------------------------------
 * @help
 * #============================================================================#
 * # Ed Engine FR - Custom Sell Prices                                          #
 * #============================================================================#                                                          
 * # Website: http://oldorenia.wordpress.com                                    #
 * # Last update: 11/1/15                                                       #
 * # Requires: MVCommons                                                        #
 * # Version: 1.0.0                                                             #
 * #============================================================================#
 * # This plugin allows you to set the default sell percentage of items, armor, #
 * # and weapons as well as setting their sell price individually using a note  #
 * # tag.                                                                       #
 * #----------------------------------------------------------------------------#
 * # Instructions:                                                              #
 * # You can modify the default sell value of all items by modifying the        #
 * # parameter "Sell Percentage" provided with this plugin. This value changes  #
 * # the sell value by multiplying the item's cost by the percent provided.     #
 * # Eg. An item's cost is 200, and the Sell Percentage is 25, its sell price   #
 * # would be 50.                                                               #
 * #----------------------------------------------------------------------------#
 * # Item, Weapon, and Armor Note Tags:                                         #
 * # <Sell Price: X>                                                            #
 * # Replace X with an integer value. This value will be used as the selling    #
 * # price for the item, that is, the shop will pay you X amount when you sell  #
 * # the item.                                                                  #
 * #----------------------------------------------------------------------------#
 * # Plugin Commands:                                                           #
 * # This plugin does not define any plugin commands.                           #
 * #----------------------------------------------------------------------------#
 * # Changelog                                                                  #
 * # Version 1.0.0, 11/1/15: Plugin released!                                   #
 * #----------------------------------------------------------------------------#
 * # Compatibility Notes:                                                       #
 * # Overwrites: Scene_Item.prototype.sellingPrice                              #
 * # Reason: Reworks how the selling price is calculated.                       #
 * #============================================================================#                                                                 
 */
// #+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=#
// # You shouldn't edit stuff beyond this point unless you know what you're doing,#
// # cause if you do something wrong, you might break everything. Which is bad.   #
// # Unless you like breaking stuff, in which case by all means, edit away.       #
// #+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=#

//Set the "Imported" module up and set this Plugin to true.
var Imported = Imported || {};
Imported.EEFR_CustomSellPrices = true;
//Define the Ed Engine FR Module and all Sub-Modules
var EdEngineFR = EdEngineFR || {};
EdEngineFR.Config = EdEngineFR.Config || {};
EdEngineFR.CustomSellPrices = {};


//Setup the plugin parameters.
EdEngineFR.Parameters = PluginManager.parameters('EEFR_CustomSellPrices');
EdEngineFR.Config.DefaultSellPercent = 
	Number(EdEngineFR.Parameters['Sell Percentage'] || 50);

/*
#=============================================================================#
#  EdEngineFR.CustomSellPrices                                                #
#-----------------------------------------------------------------------------#
#  New Method: *.getPriceTag()                                                #
#=============================================================================#
*/
EdEngineFR.CustomSellPrices.getPriceTag = function(item) {
	var priceTag;
	var price;
	var items;
	//Yanfly Item Core individual items fail-safe.
	if (Imported.YEP_ItemCore) {
		//Get the note tag value for the base items for all items and individual items.
		priceTag = MVC.getTag(DataManager.getBaseItem(item).note, "Sell Price");
	}
	//All other instances use this
	else {
		//Get the note tag value of all items, armor, and weapons.
		priceTag = MVC.getTag(item.note, "Sell Price");
	}
	//If the note tag exists and provides the value, set the price to that.
	if (priceTag != null) {
		price = priceTag.params[0]
	}
	//Set the price to return null if the value doesn't exist.
	else {
		price = null
	}
	return price;
}



/*
#=============================================================================#
#  Scene_Shop                                                                 #
#-----------------------------------------------------------------------------#
#  Overwriting: *.sellingPrice                                                #
#=============================================================================#
*/

Scene_Shop.prototype.sellingPrice = function() {
	// Check for a sell price note tag, and get the value inside it.
	var price = EdEngineFR.CustomSellPrices.getPriceTag(this._item)
	// If one exists use the price it contains.
	if (price != null) {
		return price;
	}
	// If one does not exist, use the default percentage as defined in
	// the plugin parameters.
	else {
		var sellPercent = EdEngineFR.Config.DefaultSellPercent
		return Math.floor((sellPercent / 100) * this._item.price);
	}
};

PluginManager.register("EEFR_CustomSellPrices",						//Plugin Name
						"1.0.0", 									//Version
						"A plugin for setting custom sell prices " +
						"and modifying the default sell price.",	//Description
						"FDSuprema",								//Author
						"11/1/2015",								//Last Modified
						"MVCommons",								//Requires
						true);										//Exit if unloaded?





