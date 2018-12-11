require('dotenv').config();
const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');

let client = new elasticsearch.Client({
    host: process.env.DB_HOST + ':' + process.env.DB_PORT,
    log: 'trace'
});

app.get("/", (req, res) => {
    console.log("RESPONDENDO AO ROUTER");
    res.send("HELLO WORD!");
});

app.get("/encyclopedia/v1/:linguaorigem/:termo", (req, res) => {

    console.log("Pegando parametro palavra: " + req.params.linguaorigem);
    console.log("Pegando parametro lingua: " + req.params.termo);

    client.search({
        index: 'wikipedia',
        type: 'Titulos',
        q: 'Titulo:' + req.params.termo
    }).then(function (resposta) {
        let o = {}
        let key = 'Encyclopedia';
        let img = 'Imagem';
        o[key] = [];
        for (let i = 0; i < resposta.hits.hits.length; i++) {
            o[key].push({Termo: resposta.hits.hits[i]._source.Titulo, Descricao: resposta.hits.hits[i]._source.Descricao, Url: resposta.hits.hits[i]._source.Url, Imagem: resposta.hits.hits[i]._source.Imagem});
        }
        res.json(o);
    }, function (err) {
        console.trace(err.message);
    });

});

app.get("/encyclopedia/v2/:linguaorigem/:termo/:campo", (req, res) => {

    console.log("Pegando parametro palavra: " + req.params.linguaorigem);
    console.log("Pegando parametro lingua: " + req.params.termo);

    client.search({
        index: 'wikipedia',
        type: 'Titulos',
        q: 'Titulo:' + req.params.termo
    }).then(function (resposta) {
        let o = {}
        let key = 'Encyclopedia';
        let img = 'Imagem';
        o[key] = [];
        if (req.params.campo === "descricao") {
            for (let i = 0; i < resposta.hits.hits.length; i++) {
                o[key].push({Descricao: resposta.hits.hits[i]._source.Descricao});
            }
        } else if (req.params.campo === "url") {
            for (let i = 0; i < resposta.hits.hits.length; i++) {
                o[key].push({Url: resposta.hits.hits[i]._source.Url});
            }
        } else if (req.params.campo === "imagem") {
            for (let i = 0; i < resposta.hits.hits.length; i++) {
                o[key].push({Imagem: resposta.hits.hits[i]._source.Imagem});
            }
        }

        res.json(o);
    }, function (err) {
        console.trace(err.message);
    });

});

app.get("/dictionary/v1/:linguaorigem/:termo/", (req, res) => {

    console.log("Pegando parametro palavra: " + req.params.linguaorigem);
    console.log("Pegando parametro lingua: " + req.params.termo);

    client.search({
        index: 'wiktionary',
        type: 'Titulos',
        q: 'Titulo:' + req.params.termo
    }).then(function (resposta) {
        let o = {}
        let key = 'dictionary';
        let img = 'Imagem';
        o[key] = [];

        res.json(resposta.hits.hits[0]._source);
    }, function (err) {
        console.trace(err.message);
    });

});

app.get("/dictionary/v2/:linguaorigem/:termo/:campo", (req, res) => {

    console.log("Pegando parametro palavra: " + req.params.linguaorigem);
    console.log("Pegando parametro lingua: " + req.params.campo);

    client.search({
        index: 'wiktionary',
        type: 'Titulos',
        q: 'Titulo:' + req.params.termo
    }).then(function (resposta) {
        let o = {}
        let key = 'dictionary';
        let img = 'Imagem';
        o[key] = [];

        if (req.params.campo === "sinonimo") {
            res.json(resposta.hits.hits[0]._source.definições[1]);
        }
        if (req.params.campo === "significado") {
            res.json(resposta.hits.hits[0]._source.definições[0]);
        }

    }, function (err) {
        console.trace(err.message);
    });

});

app.get("/translate/v1/:termo/:linguaorigem/:linguadestino", (req, res) => {

    console.log("Pegando parametro palavra: " + req.params.linguaorigem);
    console.log("Pegando parametro lingua: " + req.params.campo);

    client.search({
        index: 'wiktionary',
        type: 'Titulos',
        q: 'Titulo:' + req.params.termo
    }).then(function (resposta) {
        let o = {}
        let key = 'dictionary';
        let img = 'Imagem';
        o[key] = [];

        let tam = (resposta.hits.hits[0]._source.definições.length) - 1;
        let traducaoJson;
        
        for (let i = 0; i < resposta.hits.hits[0]._source.definições[tam].Tradução.length; i++) {
            let lg = resposta.hits.hits[0]._source.definições[tam].Tradução[i];
            lg = lg.split("|");
            if(lg[0] === req.params.linguadestino){
                res.json({ Tradução: { lingua: lg[0], palavra: lg[1] }});
            }
        }
        res.json({ Tradução: { }});

    }, function (err) {
        console.trace(err.message);
    });

});

app.listen(process.env.SERVER_PORT, () => {
    console.log("Servidor Ativo!");
});