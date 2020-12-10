import events from "./events";
import { chooseWord } from "./words";

//서버의 소켓 코드

let sockets = [];
let inProgress = false;
let word = null;
let leader = null;
let timeout = null;

const chooseLeader = () => sockets[Math.floor(Math.random() * sockets.length)];

const socketController = (socket, io) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  const superBroadcast = (event, data) => io.emit(event, data); //broadcast와는 달리 모든 소켓에게 보냄
  const sendPlayerUpdate = () =>
    superBroadcast(events.playerUpdate, { sockets });

  const startGame = () => {
    if (sockets.length > 1) {
      if (inProgress === false) {
        inProgress = true;
        leader = chooseLeader();
        word = chooseWord();
        superBroadcast(events.gameStarting);
        setTimeout(() => {
          superBroadcast(events.gameStarted);
          io.to(leader.id).emit(events.leaderNotif, { word });
          superBroadcast(events.clock);
          timeout = setTimeout(endGame, 30000);
        }, 5000);
      }
    }
  };

  const endGame = () => {
    inProgress = false;
    superBroadcast(events.gameEnded);
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    setTimeout(() => startGame(), 2000);
  };

  const addPoints = (id) => {
    sockets = sockets.map((socket) => {
      if (socket.id === id) {
        socket.points += 10;
      }
      return socket;
    });
    sendPlayerUpdate();
    endGame();
  };

  socket.on(events.setNickname, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, points: 0, nickname: nickname });
    broadcast(events.newUser, { nickname });
    sendPlayerUpdate();
    startGame();
  });

  socket.on(events.disconnect, () => {
    sockets = sockets.filter((aSocket) => aSocket.id !== socket.id);
    if (sockets.length === 1) {
      endGame();
    } else if (leader) {
      //이 시점에 리더가 없을 수도 있기 때문에 추가한 코드
      if (leader.id === socket.id) {
        //4명일 때 리더가 종료하면 게임 종료
        endGame();
      }
    }
    broadcast(events.disconnected, { nickname: socket.nickname });
    superBroadcast(events.resetClock);
    sendPlayerUpdate();
  });
  socket.on(events.sendMsg, ({ message }) => {
    if (message === word) {
      superBroadcast(events.newMsg, {
        message: `Winner is ${socket.nickname}, word was: ${word}`,
        nickname: "Bot",
      });
      addPoints(socket.id);
      superBroadcast(events.resetClock);
    } else {
      broadcast(events.newMsg, { message, nickname: socket.nickname });
    }
  });
  /*const {
    user: { _id: id },
    body: { name, email },
    file,
  } = req;위 message는 여기에서 req.body가 없는  name,email이 작동하는 방식과 같다.*/
  //객체인데 이름이 없는 객체이므로 {message}로 주고 {message}로 받는 것이 가능하다.

  socket.on(events.beginPath, ({ x, y }) =>
    broadcast(events.beganPath, { x, y })
  );

  socket.on(events.strokePath, ({ x, y, color }) => {
    broadcast(events.strokedPath, { x, y, color });
  });

  socket.on(events.fill, ({ color }) => {
    broadcast(events.filled, { color });
  });
};

export default socketController;

/* io.on(
  "connection",
  (socket) => {
    socket.on("newMessage", (data) => {
      console.log(data);//data로 오브젝트 형식으로 값이 전달됨 socket역시 오브젝트다
    });
    socket.on("newMessage", ({ message }) => {
      socket.broadcast.emit("messageNotif", {
        message,
        nickname: socket.nickname || "Anon",
      });
    }); //broadcast는 방금 접속한 socket빼고 다 전달함

    socket.on("setNickname", ({ nickname }) => {
      socket.nickname = nickname;
      //socket은 기본적으로 객체이기 때문에 socket.nickname이 가능함 socket.potato또한 가능함
    });
  }
  //socket.on("helloGuys", () => console.log("the client said hello"))//이 콘솔 로그는 터미널 창에 뜬다.
); //(socket)=>에서 socket은 방금 접속한 socket을 의미함 */
