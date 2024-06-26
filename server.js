const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');

/*
RUTAS
*/
const users = require('./routes/usersRoutes');

const port = process.env.PORT  || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.disable('x-powered-by');

app.set('port',port);

//LLAMANDO A LAS RUTAS
users(app);

server.listen(3000, '192.168.100.6' || 'localhost', function(){     //AQUI PONER IP DE TU PC
    console.log('Aplicacion de NodeJS ' + port + 'Iniciada...')
});

//error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}

//200 respuesta exitosa
//404 url no existe
//500 error interno de servidor
