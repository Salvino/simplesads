const fs = require('fs');
const chunkingStreams = require('chunking-streams');

const SizeChunker = chunkingStreams.SizeChunker;

// Carrega o arquivo para leitura
const input = fs.createReadStream('lib.txt');


const chunker = new SizeChunker({
	chunkSize: 64, // tamanha do arquivo
});


let output;

chunker.on('chunkStart', function (id, done) {

	output = fs.createWriteStream('split/file-' + id + '.txt'); // escrita do arquivo
	done();

});

chunker.on('chunkEnd', function (id, done) {

	output.end();
	done();

});

chunker.on('data', function (chunk) {

	output.write(chunk.data);

});

input.pipe(chunker);
