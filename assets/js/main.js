/*import { handleMessageNotif } from "./chat";
const socket = io("/");

function sendMessage(message) {
  socket.emit("newMessage", { message });
  console.log(`You: ${message}`);
}

function setNickname(nickname) {
  socket.emit("setNickname", { nickname });
}
export function handleMessageNotif(data) {
  const { message, nickname } = data;
  console.log(`${nickname}: ${message}`);
}

socket.on("messageNotif", handleMessageNotif);*/

import "./login";
