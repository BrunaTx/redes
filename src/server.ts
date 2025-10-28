import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';

class App {
  private app: Application;
  private http: http.Server;
  private io: Server;

  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new Server(this.http);
    this.setupRoutes();
    this.listenSocket();
  }

  listenServer() {
    this.http.listen(3000, () => console.log('Servidor rodando na porta 3000'));
  }

  listenSocket() {
    this.io.on('connection', (socket) => {
      console.log('Usuário conectado =>', socket.id);

      socket.on('join room', (room: string) => {
        socket.join(room);
        console.log(`${socket.id} entrou na sala ${room}`);
      });

      socket.on('switch room', ({ oldRoom, newRoom }) => {
        socket.leave(oldRoom);
        socket.join(newRoom);
        console.log(`${socket.id} saiu da sala ${oldRoom} e entrou na sala ${newRoom}`);
      });

      socket.on('chat message', (msgObj) => {
        socket.to(msgObj.room).emit('chat message', msgObj);
      });
    });
  }

  setupRoutes() {
    this.app.get('/', (req: Request, res: Response) => {
      res.sendFile(__dirname + '/index.html');
    });
  }
}

const app = new App();
app.listenServer();
