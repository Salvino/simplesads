
const wtf = require('wtf_wikipedia');
const parseString = require('xml2js').parseString;
const elasticsearch = require('elasticsearch');
const URI = require("uri-js");
const fs = require('fs');
const S = require('string');

let client = new elasticsearch.Client({
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

fs.readFile('antraz.txt', function (err, data){
        
  let body = data.toString('utf8');
   
	while((S(body).count("<page>")) > 0){
		let titulo = S(body).between('<page>', '</page>').s;		
    let content = '<page> '+titulo+' </page>';
     
      parseString(content, function (err, result) {	
            
            let titulo2 = result.page.title;            
            let session = {
                'wiktionary': {
                    'palavra':titulo2,
                    'linguagem':'pt'
                },
               'definições': [],
               'state': true
               };
            
            let texto = result.page.revision[0].text[0]._;           
		    
            if(S(texto).include("==Substantivo==")){

                let match3 = new RegExp("==Substantivo[^]+").exec(texto);                            
                let substantivo  = S(match3[0]).between('==Substantivo==', '==').s                         
                let x = {} // empty Object
                let subK = 'Substantivo';
                x[subK] = []; 
                let s = 0;
                let sub = [];
            
                while((S(substantivo).count("#")) > 0){
                  if((S(substantivo).count("#")) == 1){
                       sub[s] = S(substantivo).between('#').s;
                       substantivo = substantivo.replace('#', '');
                    }else{
                        sub[s] = S(substantivo).between('#', '#').s;
                        substantivo = substantivo.replace('#'+sub[s], '');
                    }
            
                    while((S(sub[s]).count("[[")) > 0){
                        sub[s] = sub[s].replace('[[', '');
                        sub[s] = sub[s].replace(']]', '');
                    }
                    let strLen = sub[s].length;
                    sub[s] = sub[s].slice(0, -2);
                    
                     x[subK].push(sub[s]);
                     s++;
                }
                session.definições.push(x);
              }     

              if(S(texto).include("==Adjetivo==")){

                  let match5 = new RegExp("==Adjetivo==[^]+").exec(texto);
                  let Adjetivo  = S(match5).between('==Adjetivo==', '==').s
                  let a = {} // empty Object
                  let adjK = 'Adjetivo';
                  a[adjK] = []; 
                  let s = 0;
                  let adj = [];

                  while((S(Adjetivo).count("#")) > 0){
                    if((S(Adjetivo).count("#")) == 1){
                    adj[s] = S(Adjetivo).between('#').s;
                    Adjetivo = Adjetivo.replace('#', '');
                  }else{
                    adj[s] = S(Adjetivo).between('#', '#').s;
                    Adjetivo = Adjetivo.replace('#'+adj[s], '');
                  }
                  while((S(adj[s]).count("[[")) > 0){
                   adj[s] = adj[s].replace('[[', '');
                    adj[s] = adj[s].replace(']]', '');
                  }
                  let strLen = adj[s].length;
                  adj[s] = adj[s].slice(0, -2);
                  a[adjK].push(adj[s]);
                  s++;
                }
                console.log(a);
                session.definições.push(a);
              }

            if(S(texto).include("==Verbo==")){

                  let match4 = new RegExp("==Verbo==[^]+").exec(texto);
                  let Verbo  = S(match4).between('==Verbo==', '==').s
                  let v = {} // empty Object
                  let verK = 'Verbo';
                  v[verK] = []; 
                  let s = 0;
                  let ver = [];

              while((S(Verbo).count("#")) > 0){
                  if((S(Verbo).count("#")) == 1){
                      ver[s] = S(Verbo).between('#').s;
                      Verbo = Verbo.replace('#', '');
                  }else{
                      ver[s] = S(Verbo).between('#', '#').s;
                      Verbo = Verbo.replace('#'+ver[s], '');
                  }
                  while((S(ver[s]).count("[[")) > 0){
                      ver[s] = ver[s].replace('[[', '');
                      ver[s] = ver[s].replace(']]', '');
                  }
                  let strLen = ver[s].length;
                  ver[s] = ver[s].slice(0, -2);
                  v[verK].push(ver[s]);
                  s++;
              }
              console.log(v);
              session.definições.push(v);
            }
 
            if(S(texto).include("===Sinônimos===")){

                let match = new RegExp("===Sinônimos===[^]+").exec(texto);
                sinonimo = S(match).between('===Sinônimos===', '==').s
                let s = {} // empty Object
                let sinK = 'Sinônimos';
                s[sinK] = []; 
                let x = 0;
                let sin = [];

                while((S(sinonimo).count("* [[")) > 0){
                    sin[x] = S(sinonimo).between('* [[', ']]').s;
                    sinonimo = sinonimo.replace('* [['+sin[x]+']]', '');
                    s[sinK].push(sin[x]);
                    x++;
                }
                console.log(s);
                session.definições.push(s); 
            }       

              if(S(texto).include("===Tradução===")){

                let match2 = new RegExp("===Tradução===[^]+").exec(texto);
                traducao = S(match2[0]).between('===Tradução===', '==').s
                let t = {} // empty Object
                let traK = 'Tradução';
                t[traK] = []; 
                let s = 0;
                let tra = [];       

                while((S(traducao).count("* {{trad|")) > 0){
                     tra[s] = S(traducao).between('* {{trad|', '}}').s;
                     traducao = traducao.replace('* {{trad|'+tra[s]+'}}', '');
                     t[traK].push(tra[s]);
                     s++;
                }
                session.definições.push(t);
            }
            inserirDados(session, function (resposta){
                console.log(resposta);
            });
            session.definições = [];            
            body = body.replace('<page>'+titulo+'</page>', '');				
	   });     
   }
});

var inserirDados = function (dados, callback){
    client.index({
		index: 'wikipedia',
    type: 'wiktionary',
      body: {
        dados
         }
		}, function (err, resp, status) {
			console.log(resp);
			callback(resp);
	});	
    
};