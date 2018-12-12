require('dotenv').config();
const parseString = require('xml2js').parseString;
const elasticsearch = require('elasticsearch');
const fs = require('fs');
const S = require('string');

const client = new elasticsearch.Client({
	host: process.env.DB_HOST + ':' + process.env.DB_PORT,
	log: 'trace',
});

const inserirDados = function (body, callback) {

	client.index({
		index: 'wiktionary',
		type: 'Titulos',
		body,
	}, function (err, resp) {

		console.log(resp);
		callback(resp);

	});

};

const aux = function (error, result) {

	const titulo2 = result.page.title;
	const session = {
		Titulo: titulo2,
		linguagem: 'pt',
		definições: [],
	};

	const texto = result.page.revision[0].text[0]._;

	if (S(texto).include('==Substantivo==')) {

		const match3 = new RegExp('==Substantivo[^]+').exec(texto);
		let substantivo = S(match3[0]).between('==Substantivo==', '==').s;
		const x = {};
		const subK = 'Substantivo';
		x[subK] = [];
		let s = 0;
		const sub = [];

		while ((S(substantivo).count('#')) > 0) {

			if ((S(substantivo).count('#')) === 1) {

				sub[s] = S(substantivo).between('#').s;
				substantivo = substantivo.replace('#', '');

			} else {

				sub[s] = S(substantivo).between('#', '#').s;
				substantivo = substantivo.replace('#' + sub[s], '');

			}
			while ((S(sub[s]).count('[[')) > 0) {

				sub[s] = sub[s].replace('[[', '');
				sub[s] = sub[s].replace(']]', '');

			}
			x[subK].push(sub[s]);
			s++;

		}
		session.definições.push(x);

	}

	if (S(texto).include('==Adjetivo==')) {

		const match5 = new RegExp('==Adjetivo==[^]+').exec(texto);
		let Adjetivo = S(match5).between('==Adjetivo==', '==').s;
		const a = {};
		const adjK = 'Adjetivo';
		a[adjK] = [];
		let s = 0;
		const adj = [];

		while ((S(Adjetivo).count('#')) > 0) {

			if ((S(Adjetivo).count('#')) === 1) {

				adj[s] = S(Adjetivo).between('#').s;
				Adjetivo = Adjetivo.replace('#', '');

			} else {

				adj[s] = S(Adjetivo).between('#', '#').s;
				Adjetivo = Adjetivo.replace('#' + adj[s], '');

			}
			while ((S(adj[s]).count('[[')) > 0) {

				adj[s] = adj[s].replace('[[', '');
				adj[s] = adj[s].replace(']]', '');

			}

			adj[s] = adj[s].slice(0, -2);
			a[adjK].push(adj[s]);
			s++;

		}
		console.log(a);
		session.definições.push(a);

	}

	if (S(texto).include('==Verbo==')) {

		const match4 = new RegExp('==Verbo==[^]+').exec(texto);
		let Verbo = S(match4).between('==Verbo==', '==').s;
		const v = {};
		const verK = 'Verbo';
		v[verK] = [];
		let s = 0;
		const ver = [];

		while ((S(Verbo).count('#')) > 0) {

			if ((S(Verbo).count('#')) === 1) {

				ver[s] = S(Verbo).between('#').s;
				Verbo = Verbo.replace('#', '');

			} else {

				ver[s] = S(Verbo).between('#', '#').s;
				Verbo = Verbo.replace('#' + ver[s], '');

			}
			while ((S(ver[s]).count('[[')) > 0) {

				ver[s] = ver[s].replace('[[', '');
				ver[s] = ver[s].replace(']]', '');

			}

			ver[s] = ver[s].slice(0, -2);
			v[verK].push(ver[s]);
			s++;

		}
		console.log(v);
		session.definições.push(v);

	}

	if (S(texto).include('===Sinônimos===')) {

		const match = new RegExp('===Sinônimos===[^]+').exec(texto);
		sinonimo = S(match).between('===Sinônimos===', '==').s;
		const s = {};
		const sinK = 'Sinônimos';
		s[sinK] = [];
		let x = 0;
		const sin = [];

		while ((S(sinonimo).count('* [[')) > 0) {

			sin[x] = S(sinonimo).between('* [[', ']]').s;
			sinonimo = sinonimo.replace('* [[' + sin[x] + ']]', '');
			s[sinK].push(sin[x]);
			x++;

		}
		console.log(s);
		session.definições.push(s);

	}

	if (S(texto).include('===Sinônimo===')) {

		const match = new RegExp('===Sinônimo===[^]+').exec(texto);
		sinonimo = S(match).between('===Sinônimo===', '==').s;
		const s = {};
		const sinK = 'Sinônimo';
		s[sinK] = [];
		let x = 0;
		const sin = [];

		while ((S(sinonimo).count('* [[')) > 0) {

			sin[x] = S(sinonimo).between('* [[', ']]').s;
			sinonimo = sinonimo.replace('* [[' + sin[x] + ']]', '');
			s[sinK].push(sin[x]);
			x++;

		}
		console.log(s);
		session.definições.push(s);

	}

	if (S(texto).include('===Tradução===')) {

		const match2 = new RegExp('===Tradução===[^]+').exec(texto);
		traducao = S(match2[0]).between('===Tradução===', '==').s;
		const t = {};
		const traK = 'Tradução';
		t[traK] = [];
		let s = 0;
		const tra = [];

		while ((S(traducao).count('* {{trad|')) > 0) {

			tra[s] = S(traducao).between('* {{trad|', '}}').s;
			traducao = traducao.replace('* {{trad|' + tra[s] + '}}', '');
			t[traK].push(tra[s]);
			s++;

		}
		session.definições.push(t);

	}
	inserirDados(session, function (resposta) {

		console.log(resposta);

	});

};

client.indices.create({ index: 'wiktionary' }, function (err, resp) {

	if (err) {

		console.log(err);

	} else {

		console.log('create', resp);

	}

});

fs.readFile('antraz.txt', function (data) {

	let body = data.toString('utf8');

	while ((S(body).count('<page>')) > 0) {

		const titulo = S(body).between('<page>', '</page>').s;
		const content = '<page> ' + titulo + ' </page>';
		parseString(content, aux);
		session.definições = [];
		body = body.replace('<page>' + titulo + '</page>', '');

	}

});
