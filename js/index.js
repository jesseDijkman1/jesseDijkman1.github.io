const submit = document.getElementById("send-message")
const input = document.getElementById("message")
const chat = document.getElementById("chat")

function _createMessage(text) {
  return `
    <li class="chat-messages__message message message--right">
      <p class="message__text">${text}</p>
    </li>
  `
}

function _postMessage(message) {
  chat.innerHTML += message
}

submit.onclick = () => {
  if (input.value.length == 0) return
  const msg = _createMessage(input.value)
  _postMessage(msg)
}
