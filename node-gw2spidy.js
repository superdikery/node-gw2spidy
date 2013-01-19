var http = require('http');
var fs = require('fs');

var version = 'v0.9';
var format = 'json';
var basePath = '/api/' + version + '/' + format;
var recipeIndexPath = './recipe-index.json';
var recipeIndex;

function getData(url, callback) {
  var options = {
    hostname: 'www.gw2spidy.com',
    port: 80,
    path: url,
    method: 'GET'
  }

  var req = http.get(options, function(res) {
    if(res.statusCode == '404') {
      callback(null);
    }
    res.setEncoding('utf8');
  
    var result = ''
  
    res.on('data', function(chunk) {
      result += chunk;
    });

    res.on('end', function() {
      callback(result);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    callback(null);
  });
}

function processResult(result, callback) {
    if(callback) {
      callback(result);
    } else {
      console.log(JSON.stringify(result, null, '\t'));
    }
}

function itemData(id, callback) {
  getData(basePath + '/item/' + id, function(result) {
    processResult(result, callback);
  });
}

function itemSearch(name, callback) {
  getData(basePath + '/item-search/' + name + '/1', function(result) {
    processResult(result, callback);
  });
}

function recipeDataByItem(id, callback) {
  if(recipeIndex === undefined) {
    loadRecipeIndex();    
  }
  if(recipeIndex[id] !== undefined) {
    getData(basePath + '/recipe/' + recipeIndex[id], function(result) {
      processResult(result, callback);
    });
  } else {
    processResult(null, callback);
  } 
}

function recipeList(type, page, callback) {
  getData(basePath + '/recipes/' + type + '/' + page, function(result) {
    processResult(result, callback);
  });
}

// TEMP: Until an API is available to query a recipe from item ID,
// this builds a local index to reference from.
function buildRecipeIndex(callback) {
  fs.writeFileSync(recipeIndexPath, '{}');
  console.log('Building recipe index...');
  recipeList('all', 1, function(result) {
    if(result) {
      jsonResult = JSON.parse(result);
      var pages = jsonResult.last_page;
      var processCount = 0;
      for(var i = 1; i <= pages; ++i) {
        recipeList('all', i, function(result) {
          if(result) {
            var jResult = JSON.parse(result);
            var list = JSON.parse(fs.readFileSync(recipeIndexPath));
            for(var index in jResult.results) {
              list[jResult.results[index].result_item_data_id] = jResult.results[index].data_id;
            }
            fs.writeFileSync(recipeIndexPath, JSON.stringify(list));
            processCount++;
            if(processCount > pages) {
              callback(true);
            }
          } else {
            callback(null);
          }
        });
      }
    } else {
      callback(null);
    }
  });
}

// Assumes that a recipeIndex has already been compiled by a previous
// call to buildRecipeIndex()
function loadRecipeIndex() {
  recipeIndex = JSON.parse(fs.readFileSync(recipeIndexPath));
}

exports.itemData = itemData;
exports.itemSearch = itemSearch;
exports.recipeDataByItem = recipeDataByItem;
exports.recipeList = recipeList;

// TEMP
exports.buildRecipeIndex = loadRecipeIndex;
