import {
  disableCanvas,
  hideControls,
  enableCanvas,
  showControls,
  resetCanvas,
} from "./paint";
import { disableChat, enableChat } from "./chat";

const board = document.getElementById("jsPBoard");
const notifs = document.getElementById("jsNotifs");
const clock = document.getElementById("clock");

let timeLeft = 30;
let timer = null;

const getTime = () => {
  if (timeLeft == -1) {
    timeLeft = 30;
    clearInterval(timer);
    timer = null;
  } else {
    clock.innerHTML = timeLeft + " seconds remaining";
    timeLeft--;
  }
};

export const handleClock = () => {
  clock.style.display = "flex";
  getTime();
  timer = setInterval(getTime, 1000);
};

export const clockReset = () => {
  clock.style.display = "none";
  timeLeft = 30;
  clearInterval(timer);
  timer = null;
};

const addPlayers = (players) => {
  board.innerHTML = "";
  players.forEach((player) => {
    const playerElement = document.createElement("span");
    playerElement.innerText = `${player.nickname}: ${player.points}`;
    board.appendChild(playerElement);
  });
};

const setNotifs = (text) => {
  notifs.innerText = "";
  notifs.innerText = text;
};

export const handlePlayerUpdate = ({ sockets }) => addPlayers(sockets);
export const handleGameStarted = () => {
  setNotifs("");
  disableCanvas();
  hideControls();
  enableChat();
};
export const handleLeaderNotif = ({ word }) => {
  enableCanvas();
  showControls();
  disableChat();
  notifs.innerText = `You are the leader, paint: ${word}`;
};
export const handleGameEnded = () => {
  setNotifs("Game ended.");
  disableCanvas();
  hideControls();
  resetCanvas();
};
export const handleGameStarting = () => setNotifs("Game will start soon");
