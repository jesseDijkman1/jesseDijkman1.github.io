const textArea = document.getElementById("text-area");
const textDisplay = document.querySelector(".editor-textinput .live-display");
const editorButtons = document.querySelectorAll(".editor-options section button");

(() => {
  for (let i = 0; i < editorButtons.length; i++) {
    editorButtons[i].addEventListener("click", findSelection)
  }


  textArea.addEventListener("keydown", keyHandler);
  textArea.addEventListener("keypress", keyHandler);
  // textArea.addEventListener("keyup", keyHandler);
})()

function findSelection(e) {
  const selection = window.getSelection()
  const range = selection.getRangeAt(0);
  range.deleteContents()

  updateAreaTxt()
}

function focusHandler() {
  textDisplay.addEventListener("mouseup", e => {
    const selection = window.getSelection()

    if (selection.toString().length) {
      // Some text is selected
    } else {
      textArea.focus()
    }
  })
}

focusHandler()

function keyHandler(e) {
  console.log(e)
  console.log("wtf")
  setTimeout(() => {
    const value = textArea.value;
    updateDisplay(value)
  }, 0)
}

function updateDisplay(text) {
  textDisplay.innerHTML = text
}

function updateAreaTxt() {
  textArea.value = textDisplay.innerHTML;
}
