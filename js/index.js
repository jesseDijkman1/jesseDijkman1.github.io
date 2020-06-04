const submit = document.getElementById("send-message")
const input = document.getElementById("message")
const chat = document.getElementById("chat")
const emptyChat = document.getElementById("empty-chat")
let messages = 0

function _createMessage(text) {
  const li = document.createElement("LI")
  const p = document.createElement("P")
  const content = document.createTextNode(text)

  li.className = "chat-messages__message message message--right"
  p.className = "message__text"

  p.appendChild(content)

  li.appendChild(p)

  return li
}

function responseMessage(greet) {
  if (greet) return _createMessage("Heeeeeyyyy!")
  return _createMessage("Uhm ... Hi?!")
}

function checkIfGreet(message) {
  const greetings = ["hey", "hi", "hello"]
  if (greetings.includes(message.toLowerCase())) return true

  return false
}

function _postMessage(message) {
  if (!messages) emptyChat.remove()

  chat.appendChild(message)
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
