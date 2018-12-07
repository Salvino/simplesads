const express = require(`express`);
const app = express();
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app.get("/", (req, res) => {
	console.log("RESPONDENDO AO ROUTER");
	res.send("HELLO WORD!");
});

app.get("/encyclopedia/:linguaorigem/:termo", (req, res) => {

	console.log("Pegando parametro palavra: "+ req.params.linguaorigem);
	console.log("Pegando parametro lingua: "+ req.params.termo);

	client.search({
    				index: 'wikipedia',
    				type: 'Titulos',
    				q: 'Titulo:'+req.params.termo
				}).then(function(resposta) {
					var o = {} // empty Object
					var key = 'Encyclopedia';
          var img = 'Imagem';
					o[key] = []; // empty Array, which you can push() values into
					for(var i = 0; i < resposta.hits.hits.length;i++){
    					 o[key].push({Termo:resposta.hits.hits[i]._source.Titulo, Descricao:resposta.hits.hits[i]._source.Descricao, Url:resposta.hits.hits[i]._source.Url, Imagem: resposta.hits.hits[i]._source.Imagem});
    				}
    				res.json(o);
    				//res.JSON.stringify(o);
    				//var text = resposta.hits.hits.length;
    				//res.json(text);
					}, function(err) {
    				console.trace(err.message);
			});

        //var text = {Linguaorigem:req.params.linguaorigem, Termo:req.params.termo}
  		//res.json(text);

});

app.listen(3000, () => {
	console.log("Servidor Ativo!");
});
