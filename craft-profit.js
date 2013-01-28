var util = require('./utilities.js');
var fs = require('fs');

if(process.argv[2] === undefined) {
  console.log("Usage: node craft-profit.js <JSON list of items>");
  process.exit();
}

if(!fs.existsSync(process.argv[2])) {
  console.log("Error: " + process.argv[2] + " does not exist");
  process.exit();
}

var craftList = JSON.parse(fs.readFileSync(process.argv[2]));

//console.log(craftList);

for(var category in craftList) {
  if(craftList.hasOwnProperty(category)) {
    for(var group in craftList[category]) {
      if(craftList[category].hasOwnProperty(group)) {
        processGroup(craftList[category][group]);
      }
    }
  }
}

function processGroup(itemGroup) {
  var itemIds = [];
  for(var item in itemGroup) {
    if(itemGroup.hasOwnProperty(item)) {
      itemIds.push(itemGroup[item]);
    }
  }
  util.craftingProfitReport(itemIds, function(results) {
    if(results === null) {
      console.log("crafting report failed!");
    } else {
      console.log();
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
}
