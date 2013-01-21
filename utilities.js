var spidy = require('./node-gw2spidy');

// Takes as input an array of items ids, and reports the most profitable
// items to craft at current market proices from within that list
function craftingProfitReport(itemIds, callback) {
  var itemResults = {};
  var totalItems = itemIds.length;
  var processedItems = 0;
  for(var i = 0; i < totalItems; ++i) {
    spidy.recipeDataByItem(itemIds[i], function(result) {
      if(result === null) {
        console.log("Item not found!");
      } else {
        var jResult = JSON.parse(result).result;
        var currItem = {};
        itemResults[jResult.name] = currItem;
        currItem.min_sale = jResult.result_item_min_sale_unit_price;
        currItem.craft_cost = jResult.crafting_cost;
        currItem.profit = (currItem.min_sale * 0.85) - currItem.craft_cost;
        currItem.roi = currItem.profit / currItem.min_sale;
      }
      processedItems++;
      if(processedItems >= totalItems) {
        callback(itemResults);
      }
    });
  }
}

// Takes as input an array of item ids, and reports the most profitable
// items to flip at current market proices from within that list
function flipProfitReport(itemIds, callback) {

}

exports.craftingProfitReport = craftingProfitReport;
exports.flipProfitReport = flipProfitReport;
