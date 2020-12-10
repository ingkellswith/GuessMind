import { join } from "path";
import express from "express";
import socketIO from "socket.io";
import logger from "morgan";
import socketController from "./socketController";
import events from "./events";

const PORT = 4000;
const app = express();
app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));
app.use(logger("dev"));
app.use("/", express.static(join(__dirname, "static")));
//https://stackoverflow.com/questions/53002671/what-is-express-static-in-express
//참고
app.get("/", (req, res) =>
  res.render("home", { events: JSON.stringify(events) })
);

const handleListening = () =>
  console.log(`✅ Server running: http://localhost:${PORT}`);

const server = app.listen(PORT, handleListening);

const io = socketIO(server);
io.on("connection", (socket) => socketController(socket, io));
//io는 서버라고 생각하면 됨(이름 상관 없음)
//socket은 연결되어 있는 소켓들을 의미

//let sockets = [];
//io.on("connection", (socket) => sockets.push(socket.id));
//socket은 request객체라고 함
//setInterval(() => console.log(sockets), 1000);
