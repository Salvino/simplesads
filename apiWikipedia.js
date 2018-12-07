const express = require('express');
const request = require('request');
const app = express();
var http = require('http');
var parseString = require('xml2js').parseString;
xmlReader = require('read-xml');
const camaro = require('camaro');
var lineReader = require('line-reader');
var count = 1;
var elasticsearch = require('elasticsearch');
var URI = require("uri-js");


var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});


client.indices.create({
     index: 'wikipedia'
 }, function(err, resp, status) {
     if (err) {
         console.log(err);
     } else {
         console.log("create", resp);
     }
 });
 

lineReader.eachLine('lib.txt', function(line, last) {
	tema = line.split("	"); 
 	var path = "https://pt.wikipedia.org/w/api.php?action=opensearch&search="+tema[1]+"&limit=500&namespace=0&format=xml"
	path = URI.serialize(URI.parse(`${path}`))
    request(`${path}`, (err, response, body) => {
    	console.log(count++);
		parseString(body, function (err, result) {
            
			if(Array.isArray(result.SearchSuggestion.Section)){
    			for(var i = 0; i < result.SearchSuggestion.Section[0].Item.length;i++){
    				var descricaoXml;
    				var imagemXml;
                    var imagemXmlW;
                    var imagemXmlH;
    				if(Array.isArray(result.SearchSuggestion.Section[0].Item[i].Description)){
				 		descricaoXml = result.SearchSuggestion.Section[0].Item[i].Description[0]._;
					}else{
						descricaoXml = "Sem Drecrição";
					}
					if(Array.isArray(result.SearchSuggestion.Section[0].Item[i].Image)){
				 		//console.log(result.SearchSuggestion.Section[0].Item[i].Image[0].$.source);
				 		imagemXml = result.SearchSuggestion.Section[0].Item[i].Image[0].$.source;
                        imagemXmlW = result.SearchSuggestion.Section[0].Item[i].Image[0].$.width;
                        imagemXmlH = result.SearchSuggestion.Section[0].Item[i].Image[0].$.height;
					}else{
						imagemXml = "Sem Imagem";
					}
                	client.index({
     							index: 'wikipedia',
     							type: 'Titulos',
     								body: {
     					    			"Titulo": result.SearchSuggestion.Section[0].Item[i].Text[0]._,
        								"Descricao": descricaoXml,
         								"Url": result.SearchSuggestion.Section[0].Item[i].Url[0]._,
         								"Imagem":{"Url": imagemXml, "Width": imagemXmlW, "Height": imagemXmlH},
										}
 								}, function(err, resp, status) {
     								console.log(resp);
 							});
                }
            }
		});
	});
 });

