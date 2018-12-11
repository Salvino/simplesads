# Simplesads
Wikipedia and wiktionary access data

Para realizar a divisão do Dataset da WIKIPEDIA em vários arquivo basta executar o arquivo (<b>split.js</b>)

***on the client-side:***
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


Para realizar a inserção dos dados no Elasticsearch basta executar o arquivo (<b>wikipedia.js</b>)


```html
// inserir arquivo para ser carregado no elasticsearch
fs.readFile('nome_dataset', function (err, data){
	if (err) {
		console.log(err);
	...

```


