const express = require('express');
const request = require('request');
var wtf = require('wtf_wikipedia');
const app = express();
var http = require('http');
var parseString = require('xml2js').parseString;
xmlReader = require('read-xml');
const camaro = require('camaro');
var lineReader = require('line-reader');
var count = 1;
var elasticsearch = require('elasticsearch');
var URI = require("uri-js");
var fs = require('fs');
var S = require('string');
var Wikid = require('wikid');
var striptags = require('striptags');
var eol = require('eol');
var lineReader = require('line-reader');
var readline = require('readline');
//https://commons.wikimedia.org/wiki/Special:FilePath/Charles Darwin by Julia Margaret Cameron 2.jpg

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

fs.readFile('z/saida-0.txt', function(err,data){
//fs.readFile('z/output-0.txt', function(err,data){
//fs.readFile('wikiartigo.xml', function(err,data){

	var body = data.toString('utf8');

	while((S(body).count("<page>")) > 0){
		titulo = S(body).between('<page>', '</page>').s;
		content = '<page> '+titulo+' </page>';

		parseString(content, function (err, result) {			
			
			var redirecionamento = result.page.redirect;
			var titulo = result.page.title;
			var url;
			var urlImagem;

		if(Array.isArray(redirecionamento)){
			var tituloRedirecionamento = result.page.redirect[0].$.title;
			//console.log(titulo);
			//console.log("");
			//console.log("Redirecionamento para: "+tituloRedirecionamento);
			url = URI.serialize(URI.parse("https://pt.wikipedia.org/wiki/"+tituloRedirecionamento));
			//console.log("");
			//console.log(url);

			inserirDadosR(titulo,tituloRedirecionamento,url,function(resposta){
				console.log(resposta);
			 });

		}else{			
			var IniTitulo = S(titulo).between('', ' ').s
			var texto = result.page.revision[0].text[0]._;
			var textoSemTramento = result.page.revision[0].text[0]._;
			var ImgFinal;
			url = URI.serialize(URI.parse("https://pt.wikipedia.org/wiki/"+titulo));
			texto = wtf(texto).text()
			texto = S(texto).between('', '\n').s
			
			if(S(textoSemTramento).include("{{Info/")){
				var Timg = S(textoSemTramento).between('{{Info/','\n}}').s
				//console.log(Timg);
				if(S(Timg).include("imagem")){
					if(S(Timg).include("[[Imagem:")){
						img = S(Timg).between('[[Imagem:', '|').s
						ImgFinal = img;
					}else{
						if(S(Timg).include("imagem ")){
							img = S(Timg).between('imagem ', '\n').s
							img = S(img).between('=').s
							ImgFinal = img;
						}else if(S(Timg).include("imagem_")){
							img = S(Timg).between('imagem_', '\n').s
							img = S(img).between('=').s
							ImgFinal = img;
						}else if(S(Timg).include("imagem")){
							img = S(Timg).between('imagem', '\n').s
							img = S(img).between('=').s
							ImgFinal = img;
						}else if(S(Timg).include("img")){
							img = S(Timg).between('img', '\n').s
							img = S(img).between('=').s
							ImgFinal = img;
						}						
					}					
				}else if(S(Timg).include("localização")){
					img = S(Timg).between('localização', '\n').s
					img = S(img).between('=').s
					ImgFinal = img;
				}else if(S(Timg).include("localizacao")){
					img = S(Timg).between('localizacao', '\n').s
					img = S(img).between('=').s
					ImgFinal = img;
				}else{
					ImgFinal = "Não possui imagem!";
				}				
				
			}else if(S(textoSemTramento).include("{{info/")){
				var Timg = S(textoSemTramento).between('{{info/','\n}}').s
				//console.log(Timg);
				if(S(Timg).include("imagem")){
					if(S(Timg).include("[[Imagem:")){
						img = S(Timg).between('[[Imagem:', '|').s
						ImgFinal = img;
					}else{
						if(S(Timg).include("imagem")){
							img = S(Timg).between('imagem', '\n').s
							img = S(img).between('=').s
							ImgFinal = img;
						}else if(S(Timg).include("imagem ")){
							img = S(Timg).between('imagem ', '\n').s
							img = S(img).between('=').s
							ImgFinal = img;
						}else if(S(Timg).include("img")){
							img = S(Timg).between('img', '\n').s
							img = S(img).between('=').s
							ImgFinal = img;
						}						
					}					
				}else if(S(Timg).include("localização")){
					img = S(Timg).between('localização', '\n').s
					img = S(img).between('=').s
					ImgFinal = img;
				}else{
					ImgFinal = "Não possui imagem!";
				}				
				
			}else if(S(textoSemTramento).include("[[Imagem:")){
				img = S(textoSemTramento).between('[[Imagem:', '|').s;
				ImgFinal = img;
			}else if(S(textoSemTramento).include("[[File:")){
				img = S(textoSemTramento).between('[[File:', '|').s;
				ImgFinal = img;
			}else if(S(textoSemTramento).include("[[Ficheiro:")){
				img = S(textoSemTramento).between('[[Ficheiro:', '|').s
				ImgFinal = img;
			}else{
				ImgFinal = "Não possui imagem!";
			}

			if(ImgFinal === "Não possui imagem!"){
				urlImagem = "Não possui imagem!";
			}else{
				urlImagem = URI.serialize(URI.parse("https://commons.wikimedia.org/wiki/Special:FilePath/"+ImgFinal));
			}

			inserirDados(titulo,texto,urlImagem,url,function(resposta){
				console.log(resposta);
			 });

		//console.log(titulo);
		//console.log("");
		//console.log(texto);
		//console.log("");
		//console.log(ImgFinal);
		//console.log("");
		//console.log(url);
		//console.log("-----------------------------------------");
		//console.log("");
		//console.log("");
		}	
	});
		body = body.replace('<page>'+titulo+'</page>', '');
	}
});

var inserirDados = function(ti,txt,i,u,callback){
    client.index({
		index: 'wikipedia',
		type: 'Titulos',
			body: {
				"Titulo": ti,
				"Descricao": txt,
				"Url": u,
				"Imagem":i,
				//"Imagem":{"Url": imagemXml, "Width": imagemXmlW, "Height": imagemXmlH},
			   }
		}, function(err, resp, status) {
			console.log(resp);
			callback(resp);
	});	
    
};

var inserirDadosR = function(ti,r,u,callback){
    client.index({
		index: 'wikipedia',
		type: 'Titulos',
			body: {
				"Titulo": ti,
				"redirecionamento": r,
				"Url": u,
			   }
		}, function(err, resp, status) {
			console.log(resp);
			callback(resp);
	});	
    
};







