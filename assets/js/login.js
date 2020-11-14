import { initSockets } from "./sockets";

const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

const NICKNAME = "nickname";
const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";

const nickname = localStorage.getItem(NICKNAME);

const logIn = (nickname) => {
  //const socket = io("/");
  //socket.emit("setNickname", { nickname });

  //window.socket = io("/"); //window.socket은 클라이언트의 전역 변수, io는 따로 import하지 않음
  //window.socket.emit(window.events.setNickname, { nickname });

  // eslint-disable-next-line no-undef
  const socket = io("/");
  socket.emit(window.events.setNickname, { nickname });
  initSockets(socket);
};

if (nickname === null) {
  body.className = LOGGED_OUT;
} else {
  body.className = LOGGED_IN;
  logIn(nickname);
}

const handleFormSubmit = (e) => {
  e.preventDefault(); //새로고침은 안되는데 js파일은 다시 실행됨
  const input = loginForm.querySelector("input");
  const { value } = input;
  input.value = "";
  localStorage.setItem(NICKNAME, value);
  body.className = LOGGED_IN; //이 문장이 새로고침 없이 로그인하게 해줌
  logIn(value);
};

if (loginForm) {
  loginForm.addEventListener("submit", handleFormSubmit);
}
