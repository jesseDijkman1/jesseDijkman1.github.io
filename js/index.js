const submit = document.getElementById("send-message")
const input = document.getElementById("message")
const chat = document.getElementById("chat")
const emptyChat = document.getElementById("empty-chat")
let messages = 0

function _createMessage(text) {
  return `
    <li class="chat-messages__message message message--right">
      <p class="message__text">${text}</p>
    </li>
  `
}

function responseMessage(greet) {
  if (greet)
    return `<li class="chat-messages__message message message--left"><p class="message__text">Heeeeeyyyy! :)</p></li>`

  return `<li class="chat-messages__message message message--left"><p class="message__text">What???</p></li>`
}

function checkIfGreet(message) {
  const greetings = ["hey", "hi", "hello"]
  if (greetings.includes(message.toLowerCase())) return true

  return false
}

function _postMessage(message) {
  if (!messages) emptyChat.remove()
  chat.innerHTML += message
}

submit.onclick = () => {
  if (input.value.length == 0) return
  const msg = _createMessage(input.value)
  _postMessage(msg)
  if (checkIfGreet(input.value)) {
    const response = responseMessage(true)
    _postMessage(response)
  } else {
    const response = responseMessage(false)
    _postMessage(response)
  }

  input.value = ""
}
