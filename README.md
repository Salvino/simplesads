# Simplesads
Wikipedia and wiktionary access data

Para realizar a divisão do Dataset da WIKIPEDIA em vários arquivo basta executar o arquivo (split.js)

***on the client-side:***
```html
// Carrega o arquivo para leitura
let input = fs.createReadStream('path_dataset'),
    chunker = new SizeChunker({
        chunkSize:64 //tamanha do arquivo
    }),
    output;
```


Para realizar a inserção dos dados no Elasticsearch basta executar o arquivo (armazenarDados.js)
