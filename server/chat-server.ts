import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { Message } from '../models';

export class ChatServer {
    public static readonly PORT:number = 8080;
    private _app?: express.Application;
    private _server?: Server;
    private _io?: SocketIO.Server;
    private _port?: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this._app = express();
    }

    private createServer(): void {
        this._server = createServer(this._app);
    }

    private config(): void {
        this._port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this._io = socketIo(this._server);
    }

    private listen(): void {
        if (this._server) this._server.listen(this._port, () => {
            console.log('Running server on port %s', this._port);
        });

        if (this._io) this._io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this._port);
            socket.on('message', (m: Message) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this._io ? this._io.emit('message', m) : null;
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    public getApp(): express.Application {
        if (this._app) return this._app;
        throw Error('Error on chat server')
    }
}