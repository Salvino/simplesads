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
Ex. /encyclopedia/v1/pt/astronomia

```
***Wiki abstract de um termo:***
```html
/encyclopedia/v12/[linguaorigem]/[termo]/[campo]
Ex. /encyclopedia/v2/pt/astronomia/descricao

```
***Dicionario de um termo:***
```html
/dictionary/[linguaorigem]/[termo]
Ex. /dictionary/v1/pt/Lembrança

```
***Dicionario específico de um termo:***
```html
/dictionary/[linguaorigem]/[termo]/[campo]
Ex. /dictionary/v1/pt/Lembrança/sinonimo

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
