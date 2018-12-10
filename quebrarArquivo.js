xmlReader = require('read-xml');
var lineReader = require('line-reader');
var S = require('string');
var readline = require('readline');
var fs = require('fs');
var chunkingStreams = require('chunking-streams');
 
var LineCounter = chunkingStreams.LineCounter;
var SeparatorChunker = chunkingStreams.SeparatorChunker;
var SizeChunker = chunkingStreams.SizeChunker;

//Carrega o arquivo para leitura
var input = fs.createReadStream('nomeDoArquivo'),
    chunker = new SizeChunker({
        //separator: '</page>',
        chunkSize:96636764.16
        //chunkSize:322122547.2 //tamanha do arquivo
    }),
    output;
 
chunker.on('chunkStart', function(id, done) {
    output = fs.createWriteStream('quebra/arquivo-' + id+".txt"); //escrita do arquivo
    done();
});
 
chunker.on('chunkEnd', function(id, done) {
    output.end();
    done();
});
 
chunker.on('data', function(chunk) {
    output.write(chunk.data);
});
 
input.pipe(chunker);

/*
setTimeout(function () {
    
        }, 500);
*/


