var fs = require('fs');
var spidy = require('./node-gw2spidy');

var watchlistPath = './watchlist.json';

function addItem(list, name, callback) {
  spidy.itemSearch(name, function(result) {
    if(result) {  
      var jResult = JSON.parse(result);
      var watchlist;
      if(jResult.length > 0) {
        watchlist = JSON.parse(fs.readFileSync(watchlistPath));
        if(watchlist[list] === undefined) {
          watchlist[list] = {};
        }
        for(var key in jResult) {
          watchlist[list][jResult[name]] = jResult[data_id];
        }
        fs.writeFileSync(watchlistPath, JSON.stringify(watchlist));
      }
      callback(jResult.length);
    } else {
      callback(null);
    }
  });
}

function generateReport(list, callback) {
  var watchlist = JSON.parse(fs.readFileSync(watchlistPath));
  if(watchlist[list]) {
    var searchCount = 0
    var results = {};
    for(var key in watchlist[list]) {
      spidy.itemData(watchlist[list][key], function(res) {
        if(res) {
          var jRes = JSON.parse(res);
          var name = res.name;
          results[name].max_offer_unit_price = res.max_offer_unit_price;
          results[name].min_sale_unit_price = res.min_sale_unit_price;
          results[name].offer_availability = res.offer_availability;
          results[name].sale_availability = res.sale_availability;
          spidy.recipeDataByItem(res.data_id, function(res) {
            if(res) {
              var jRes = JSON.parse(res);
              results[name].crafting_cost = res.crafting_cost;
              searchCount++;
              if(searchCount >= watchlist[list].length) {
                callback(results);
              }
            } else {
              callback(null);
            }
          });
        } else {
          callback(null);
        }
      });
    }
  } else {
    callback(null);
  }
}

exports.addItem = addItem;
exports.generateReport = generateReport;
