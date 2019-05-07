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


function selectionUpdater(event, txt) {
  const dataEl = event.target.dataset["el"];

  if (dataEl) {
    const el = document.createElement(dataEl);
    el.appendChild(document.createTextNode(txt))

    return el
  }
}

function findSelection(e) {
  const classes = e.target.className.split(" ");
  const selection = window.getSelection()
  const txt = selection.toString()

  if (!txt.length) {
    e.target.classList.toggle("isActive");

    const dataEl = e.target.getAttribute("data-el");

    if (e.target.classList.contains("isActive")) {
      if (dataEl) {
        let attrs = textArea.getAttribute("data-el").split(" ");
        attrs.push(dataEl)
        attrs = attrs.join(" ")
        textArea.setAttribute("data-el", attrs)
      }
    } else {
      if (dataEl) {
        let attrs = textArea.getAttribute("data-el");
        attrs = attrs.replace(dataEl, "")

        textArea.setAttribute("data-el", attrs)
      }
    }

  } else {
    const range = selection.getRangeAt(0);
    const newEl = selectionUpdater(e, txt)

    range.deleteContents();
    range.insertNode(newEl);
  }



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
  setTimeout(() => {

    if (e.keyCode == 13)   {
      textArea.value = textArea.value.replace(/\n/, "<br>")
    }

    updateDisplay(textArea.value)
  }, 0)
}

function updateDisplay() {
  textDisplay.innerHTML = textArea.value
}

function updateAreaTxt() {
  console.log(textDisplay.innerHTML)
  textArea.value = textDisplay.innerHTML;

  setTimeout(updateDisplay(textArea.value), 0)

}
