const { Server } = require("socket.io");

const setupChatSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4173",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // Existing chat functionality
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(chatId);
    });

    // Appointment notifications
    socket.on("join_broker", (brokerId) => {
      socket.join(`broker_${brokerId}`);
      console.log(`Broker room joined: ${brokerId}`);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = setupChatSocket;