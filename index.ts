import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {Socket} from 'socket.io';

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const prettify = require('express-prettify');

dotenv.config();

const http = require('http');
const socketIO = require('socket.io');

const app: Express = express();
const port: string | undefined = process.env.PORT;

const server = http.createServer(app);
const io = socketIO(server);

app.use(prettify({
    always: true,
    spaces: 4,
}));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const apiRouter = require('./routes/api');

app.use('/api', apiRouter);

app.get('*', (request: Request, response: Response) => {
    response.status(404).json(
        {
            status: 404,
            message: 'Not found',
            error: 'Sorry, the data you requested for was not found',
        }
    );
});

io.on('connection', (socket: Socket) => {
    console.log('Client connected');
});

server.listen(port, () => {
    console.log(`⚡️[Niyo Task Manager API]: Server is running at http://localhost:${port}`);
});

export {io};