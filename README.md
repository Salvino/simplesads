# Simplesads
Wikipedia and wiktionary access data

Para realizar a divisão do Dataset da WIKIPEDIA em vários arquivo basta executar o arquivo (quebrarArquivo.js)

***on the client-side:***
```html
<script src="https://unpkg.com/wtf_wikipedia@latest/builds/wtf_wikipedia.min.js"></script>
<script>
  //(follows redirect)
  wtf.fetch('On a Friday', 'en', function(err, doc) {
    var val = doc.infobox(0).get('current_members');
    val.links().map(link => link.page);
    //['Thom Yorke', 'Jonny Greenwood', 'Colin Greenwood'...]
  });
</script>
```


Para realizar a inserção dos dados no Elasticsearch basta executar o arquivo (armazenarDados.js)
