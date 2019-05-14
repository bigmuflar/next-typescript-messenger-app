import { createServer, Server } from 'http';
import { Application, Response, Request } from 'express';
import { Message } from './models';
import * as socketIo from "socket.io";
import * as next from 'next';
import * as express from 'express';

const port: string | number = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()
const messages: Message[] = []
const app: Application = express();
const server: Server = createServer(app);
const io: SocketIO.Server = socketIo(server);

io.on('connection', (socket: SocketIO.Socket) => {
    console.log('Connected client on port %s.', port);
    socket.on('message', (m: Message) => {
        console.log('[server](message): %s', JSON.stringify(m));
        messages.push(m)
        socket.broadcast.emit('message', m)
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
})

nextApp.prepare().then(() => {
  app.get('/messages', (req: Request, res: Response) => {
    console.log('req', req)
    res.json(messages)
  })

  app.get('*', (req: Request, res: Response) => {
    return nextHandler(req, res)
  })

  server.listen(port, () => {
    console.log('Running server on port %s', port);
  })
})