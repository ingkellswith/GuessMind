# GuessMind
Nodejs Realtime Chat Game

io.on(
  "connection",
  (socket) => {
    /*socket.on("newMessage", (data) => {
      console.log(data);//data로 오브젝트 형식으로 값이 전달됨 socket역시 오브젝트다
    });*/
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
); //(socket)=>에서 socket은 방금 접속한 socket을 의미함