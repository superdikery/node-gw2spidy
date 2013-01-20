var util = require('./utilities.js');
var fs = require('fs');

var craftList = JSON.parse(fs.readFileSync("./craftList.json"));

var itemIds = [];
for(var i in craftList) {
  if(craftList.hasOwnProperty(i)) {
    itemIds.push(craftList[i]);
  }
}

util.craftingProfitReport(itemIds, function(results) {
  if(results === null) {
    console.log("crafting report failed!");
  } else {
    var sorter = [];
    for(var item in results) {
      if(results.hasOwnProperty(item)) {
        sorter.push([item, Math.round(results[item].profit), Math.round(100*results[item].roi)/100]);
      }
    }
    sorter.sort(function(a, b) {
      return b[1] - a[1];
    });
    console.log(sorter);
  }
});
