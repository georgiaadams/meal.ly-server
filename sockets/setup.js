const socketIo = require("socket.io");

// const activeSockets = [];

function socketIOSetup(serverInstance) {
  const io = socketIo(serverInstance, {
    cors: {
      origin: process.env.PUBLIC_DOMAIN,
      methods: ["GET", "POST"],
      credientails: true,
    },
  });

  let interval;

  io.on("connection", (socket) => {
    console.log("New client connected");

    // add that socket id to the list of connected sockets
    // activeSockets.push(socket.id)

    // on - POST  emit - GET //
    socket.on("createOffer", (data) => {
      console.log(data);
      io.sockets.emit("newOffer", data);
    });

    socket.on("requestOffer", (data) => {
      io.sockets.emit("offerRequested", { companyName: data.companyName });
    });

    socket.on("acceptOffer", (data) => {
      console.log("Offer Accept Clicked");

      io.sockets.emit("offerAccepted", data);
    });

    socket.on("collectOffer", (data) => {
      console.log("Offer collected USER");

      io.sockets.emit("offerCollected", data);
      console.log("appear completed in provider");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
    });
  });
}

module.exports = socketIOSetup;
