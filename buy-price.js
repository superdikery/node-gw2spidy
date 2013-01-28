var util = require('./utilities.js');
var fs = require('fs');

if(process.argv[2] === undefined) {
  console.log("Usage: node buy-price.js <JSON list of items>");
  process.exit();
}

if(!fs.existsSync(process.argv[2])) {
  console.log("Error: " + process.argv[2] + " does not exist");
  process.exit();
}

var itemList = JSON.parse(fs.readFileSync(process.argv[2]));

//console.log(itemList);

processGroup(itemList);

function processGroup(itemGroup) {
  var itemIds = [];
  for(var item in itemGroup) {
    if(itemGroup.hasOwnProperty(item)) {
      itemIds.push(itemGroup[item]);
    }
  }
  util.priceReport(itemIds, function(results) {
    if(results === null) {
      console.log("price report failed!");
    } else {
      var sorter = [];
      for(var item in results) {
        if(results.hasOwnProperty(item)) {
          sorter.push([item, results[item].min_sale, results[item].max_offer]);
        }
      }
      sorter.sort(function(a, b) {
        return b[0] - a[0];
      });
      console.log(sorter);
    }
  });
}
