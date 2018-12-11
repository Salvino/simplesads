# Simplesads
Wikipedia and wiktionary access data

Para realizar a divisão do Dataset da WIKIPEDIA em vários arquivo basta executar o arquivo (<b>split.js</b>)

***Código:***
```html
// Carrega o arquivo para leitura
let input = fs.createReadStream('arquivo_dataset'),
    chunker = new SizeChunker({
        chunkSize:64 // tamanho que deseja quebrar o arquivo em Kbytes
    }),output;

chunker.on('chunkStart', function (id, done) {
    output = fs.createWriteStream("arquivo-"+id".txt"); // escrita do arquivo
    done();
});

```


Para realizar a inserção dos dados no Elasticsearch do Wikipedia basta executar o arquivo (<b>wikipedia.js</b>)

***Código:***
```html
// inserir arquivo para ser carregado no elasticsearch
fs.readFile('nome_dataset', function (err, data){
	if (err) {
		console.log(err);
	...

```


Para realizar a inserção dos dados no Elasticsearch do Wiktionary basta executar o arquivo (<b>wiktionary.js</b>)

***Código:***
```html
// inserir arquivo para ser carregado no elasticsearch
fs.readFile('nome_dataset', function (err, data){
	if (err) {
		console.log(err);
	...

```
Para consumir os dados no Elasticsearch basta executar o arquivo (<b>server.js</b>)

***Wiki de um termo:***
```html
/encyclopedia/v1/[linguaorigem]/[termo]
Ex. /encyclopedia/v1/pt/Anarcocapitalismo

Saída:
{
	Encyclopedia: [
		{
			Termo: [
					"Anarcocapitalismo"
					],
				Descricao: "Anarcocapitalismo (também conhecido como anarquismo de livre mercado, anarquismo libertário, 								anarquismo de propriedade privada ou anarcoliberalismo) é uma filosofia política capitalista que 								promove a anarquia entendida como a eliminação do Estado e a proteção a soberania do indivíduo 								através da propriedade privada e do mercado livre.",
				Url: "https://pt.wikipedia.org/wiki/Anarcocapitalismo",
				Imagem: "https://commons.wikimedia.org/wiki/Special:FilePath/Gadsden%20flag.svg"
		}
	]
}

```
***Wiki abstract de um termo:***
```html
/encyclopedia/v12/[linguaorigem]/[termo]/[campo]
Ex. /encyclopedia/v2/pt/Anarcocapitalismo/descricao

Saída:
{
	Encyclopedia: [
		{
			Termo: [
					"Anarcocapitalismo"
					],
				Descricao: "Anarcocapitalismo (também conhecido como anarquismo de livre mercado, anarquismo libertário, 								anarquismo de propriedade privada ou anarcoliberalismo) é uma filosofia política capitalista que 							promove a anarquia entendida como a eliminação do Estado e a proteção a soberania do indivíduo 							   através da propriedade privada e do mercado livre."
		}
	]
}

```
***Dicionario de um termo:***
```html
/dictionary/[linguaorigem]/[termo]
Ex. /dictionary/v1/pt/Lembrança

Saída:
{
	Titulo: [
		"Lembrança"
	],
	linguagem: "pt",
	definições: [
			{
				Substantivo: [
						" ato ou efeito de lembrar(-se) ",
						" algo presente na memória ou a próprio|própria memória ",
						" sugestão ",
						" presente ",
						" brinde ",
						" algo que subsistir|subsiste e exemplificar|exemplifica testemunhando um fato ocorrido ",
						" ideia de realizar algo ",
						" algum artifício para ajudar a memória e recordação "
					]
			},
			{
				Sinônimos: [
						"recordação",
						"reminiscência",
						"sequela",
						"inspiração",
						"alvitre",
						"lembrete"
					]
			},
			{
				Tradução: [
						"de|Erinnerung",
						"en|memory",
						"it|ricordo",
						"ja|思い出",
						"mwl|lhembráncia|mimória"
					]
			}
		]
}

```
***Dicionario específico de um termo:***
```html
/dictionary/[linguaorigem]/[termo]/[campo]
Ex. /dictionary/v2/pt/Lembrança/sinonimo

Saída:
{
	Sinônimos: [
			"recordação",
			"reminiscência",
			"sequela",
			"inspiração",
			"alvitre",
			"lembrete"
		]
}

```
***Traduzir uma palavra:***
```html
 /translate/[termo]/[linguaorigem]/[linguadestino]
Ex. /translate/Lembrança/pt/ja

Saída:
{
	Tradução: {
		lingua: "ja",
		palavra: "思い出"
	}
}

```
