const express = require(`express`);
const app = express();
const elasticsearch = require('elasticsearch');

let client = new elasticsearch.Client({
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
					let o = {} 
					let key = 'Encyclopedia';
          let img = 'Imagem';
					o[key] = []; 
					for(let i = 0; i < resposta.hits.hits.length;i++){
    					 o[key].push({Termo:resposta.hits.hits[i]._source.Titulo, Descricao:resposta.hits.hits[i]._source.Descricao, Url:resposta.hits.hits[i]._source.Url, Imagem: resposta.hits.hits[i]._source.Imagem});
    				}
    				res.json(o);
					}, function(err) {
    				console.trace(err.message);
			});

});

app.listen(3000, () => {
	console.log("Servidor Ativo!");
});
