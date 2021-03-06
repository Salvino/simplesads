require('dotenv').config();
const wtf = require('wtf_wikipedia');
const parseString = require('xml2js').parseString;
const elasticsearch = require('elasticsearch');
const URI = require('uri-js');
const fs = require('fs');
const S = require('string');
const requestImageSize = require('request-image-size');

const client = new elasticsearch.Client({ host: process.env.DB_HOST + ':' + process.env.DB_PORT, log: 'trace' });

const inserirDados = function (ti, txt, i, u, callback) {

	if (i === 'Não possui imagem') {

		client.index({
			index: 'wikipedia',
			type: 'Titulos',
			body: {
				Titulo: ti,
				Descricao: txt,
				Url: u,
				Imagem: {},
			},
		}, function (err, resp) {

			console.log(resp);
			callback(resp);

		});

	} else {

		const options = {
			url: i,
			headers: {
				'User-Agent': 'request-image-size',
			},
		};

		requestImageSize(options).then(size => client.index({
			index: 'wikipedia',
			type: 'Titulos',
			body: {
				Titulo: ti,
				Descricao: txt,
				Url: u,
				Imagem: { Url: i, Width: size.width, Height: size.height },
			},
		}, function (err, resp) {

			console.log(resp);
			callback(resp);

		})).catch(
			client.index({
				index: 'wikipedia',
				type: 'Titulos',
				body: {
					Titulo: ti,
					Descricao: txt,
					Url: u,
					Imagem: { Url: i },
				},
			}, function (err, resp) {

				console.log(resp);
				callback(resp);

			}),
		);

	}

};

const inserirDadosR = function (ti, r, u, callback) {

	client.index({
		index: 'wikipedia',
		type: 'Titulos',
		body: {
			Titulo: ti,
			redirecionamento: r,
			Url: u,
		},
	}, function (err, resp) {

		console.log(resp);
		callback(resp);

	});

};

const aux = function (error, result) {

	const redirecionamento = result.page.redirect;
	const titulo = result.page.title;
	let url;
	let urlImagem;

	if (Array.isArray(redirecionamento)) {

		const tituloRedirecionamento = result.page.redirect[0].$.title;
		url = URI.serialize(URI.parse('https://pt.wikipedia.org/wiki/' + tituloRedirecionamento));
		inserirDadosR(titulo, tituloRedirecionamento, url, function (resposta) {

			console.log(resposta);

		});

	} else {

		let texto = result.page.revision[0].text[0]._;
		const textoSemTramento = result.page.revision[0].text[0]._;
		let ImgFinal;
		let img;
		url = URI.serialize(URI.parse('https://pt.wikipedia.org/wiki/' + titulo));
		texto = wtf(texto).text();
		texto = S(texto).between('', '\n').s;

		if (S(textoSemTramento).include('{{Info/')) {

			const Timg = S(textoSemTramento).between('{{Info/', '\n}}').s;
			if (S(Timg).include('imagem')) {

				if (S(Timg).include('[[Imagem:')) {

					img = S(Timg).between('[[Imagem:', '|').s;
					ImgFinal = img;

				} else if (S(Timg).include('imagem ')) {

					img = S(Timg).between('imagem ', '\n').s;
					img = S(img).between('=').s;
					ImgFinal = img;

				} else if (S(Timg).include('imagem_')) {

					img = S(Timg).between('imagem_', '\n').s;
					img = S(img).between('=').s;
					ImgFinal = img;

				} else if (S(Timg).include('imagem')) {

					img = S(Timg).between('imagem', '\n').s;
					img = S(img).between('=').s;
					ImgFinal = img;

				} else if (S(Timg).include('img')) {

					img = S(Timg).between('img', '\n').s;
					img = S(img).between('=').s;
					ImgFinal = img;

				}

			} else if (S(Timg).include('localização')) {

				img = S(Timg).between('localização', '\n').s;
				img = S(img).between('=').s;
				ImgFinal = img;

			} else if (S(Timg).include('localizacao')) {

				img = S(Timg).between('localizacao', '\n').s;
				img = S(img).between('=').s;
				ImgFinal = img;

			} else {

				ImgFinal = 'Não possui imagem';

			}

		} else if (S(textoSemTramento).include('{{info/')) {

			const Timg = S(textoSemTramento).between('{{info/', '\n}}').s;
			if (S(Timg).include('imagem')) {

				if (S(Timg).include('[[Imagem:')) {

					img = S(Timg).between('[[Imagem:', '|').s;
					ImgFinal = img;

				} else if (S(Timg).include('imagem')) {

					img = S(Timg).between('imagem', '\n').s;
					img = S(img).between('=').s;
					ImgFinal = img;

				} else if (S(Timg).include('imagem ')) {

					img = S(Timg).between('imagem ', '\n').s;
					img = S(img).between('=').s;
					ImgFinal = img;

				} else if (S(Timg).include('img')) {

					img = S(Timg).between('img', '\n').s;
					img = S(img).between('=').s;
					ImgFinal = img;

				}

			} else if (S(Timg).include('localização')) {

				img = S(Timg).between('localização', '\n').s;
				img = S(img).between('=').s;
				ImgFinal = img;

			} else {

				ImgFinal = 'Não possui imagem';

			}

		} else if (S(textoSemTramento).include('[[Imagem:')) {

			img = S(textoSemTramento).between('[[Imagem:', '|').s;
			ImgFinal = img;

		} else if (S(textoSemTramento).include('[[File:')) {

			img = S(textoSemTramento).between('[[File:', '|').s;
			ImgFinal = img;

		} else if (S(textoSemTramento).include('[[Ficheiro:')) {

			img = S(textoSemTramento).between('[[Ficheiro:', '|').s;
			ImgFinal = img;

		} else {

			ImgFinal = 'Não possui imagem';

		}

		if (ImgFinal === 'Não possui imagem') {

			urlImagem = 'Não possui imagem';

		} else {

			ImgFinal = S(ImgFinal).collapseWhitespace().s;
			urlImagem = URI.serialize(URI.parse('https://commons.wikimedia.org/wiki/Special:FilePath/' + ImgFinal));

		}

		inserirDados(titulo, texto, urlImagem, url, function (resposta) {

			console.log(resposta);

		});

	}

};

client.indices.create({ index: 'wikipedia' }, function (err, resp) {

	if (err) {

		console.log(err);

	} else {

		console.log('create', resp);

	}

});

fs.readFile('wikiartigo.xml', function (err, data) {

	if (err) {

		console.log(err);

	}
	let body = data.toString('utf8');

	while ((S(body).count('<page>')) > 0) {

		const ttl = S(body).between('<page>', '</page>').s;
		const content = '<page> ' + ttl + ' </page>';

		parseString(content, aux);

		body = body.replace('<page>' + ttl + '</page>', '');

	}

});
