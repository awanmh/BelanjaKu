import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

class SocketGateway {
  private io!: SocketIOServer;

  /**
   * Initialize Socket.io
   */
  public init(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*", // Configure properly in production
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket: any) => {
      console.log("User connected:", socket.id);

      // Authenticate socket here (extract token from query or headers)
      // socket.join(userId);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  /**
   * Send notification to a specific user
   */
  public sendNotification(userId: string, event: string, payload: any) {
    if (this.io) {
      this.io.to(userId).emit(event, payload);
    }
  }
}

export default new SocketGateway();
