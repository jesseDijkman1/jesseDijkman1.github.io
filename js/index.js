const textEditor = document.querySelector(".editor-textinput");

textEditor.addEventListener("keydown", editorNavigator);

let isEmpty;

function editorNavigator(e) {
  const current = e.currentTarget;


  if (e.keyCode == 8 && isEmpty) {
    e.preventDefault()
  }

  setTimeout(() => {
    if (current.children.length == 1) {
      if (current.firstElementChild.textContent.length == 0) {
        current.classList.add("isEmpty")
        isEmpty = true;
      } else {
        current.classList.remove("isEmpty")
        isEmpty = false;
      }
    } else {
      current.classList.remove("isEmpty")
      isEmpty = false;
    }
  }, 0)


}


// const textArea = document.getElementById("text-area");
// const textDisplay = document.querySelector(".editor-textinput .live-display");
// const editorButtons = document.querySelectorAll(".editor-options section button");

// (() => {
//   for (let i = 0; i < editorButtons.length; i++) {
//     editorButtons[i].addEventListener("click", findSelection)
//   }
//
//   textDisplay.addEventListener("click", caretPositioner)
//
//   textArea.addEventListener("keydown", keyHandler);
//   textArea.addEventListener("keypress", keyHandler);
//   // textArea.addEventListener("keyup", keyHandler);
// })()
//
//
// function selectionUpdater(event, txt) {
//   const dataEl = event.target.dataset["el"];
//
//   if (dataEl) {
//     const el = document.createElement(dataEl);
//     el.appendChild(document.createTextNode(`${txt}`))
//
//     return el
//   }
// }
//
// function findSelection(e) {
//   const classes = e.target.className.split(" ");
//   const selection = window.getSelection()
//   const txt = selection.toString()
//
//   if (!txt.length) {
//     e.target.classList.toggle("isActive");
//
//     const dataEl = e.target.getAttribute("data-el");
//   } else {
//     const range = selection.getRangeAt(0);
//     const newEl = selectionUpdater(e, txt)
//
//     range.deleteContents();
//     range.insertNode(newEl);
//   }
//
//
//
//   updateAreaTxt()
// }
//
// function focusHandler() {
//   textDisplay.addEventListener("mouseup", e => {
//     const selection = window.getSelection()
//
//     if (selection.toString().length) {
//       // Some text is selected
//     } else {
//       textArea.focus()
//     }
//   })
// }
//
// focusHandler()
//
// function caretPositioner(e) {
//   // if (e.target !== textDisplay) {
//   //   const target.nodeName)
//   // }
//
//   let range;
//   let textNode;
//   let offset;
//
//   if (document.caretPositionFromPoint) {
//
//     range = document.caretPositionFromPoint(e.clientX, e.clientY);
//     textNode = range.offsetNode;
//     offset = range.offset;
//   } else if (document.caretRangeFromPoint) {
//     range = document.caretRangeFromPoint(e.clientX, e.clientY);
//     textNode = range.startContainer;
//     offset = range.startOffset;
//   }
//   console.log(offset)
//
//   textArea.selectionStart = offset;
//   textArea.selectionEnd = offset;
// }
//
//
// function keyHandler(e) {
//
//   setTimeout(() => {
//
//     if (e.keyCode == 13)   {
//       textArea.value = textArea.value.replace(/\n/, "<br>")
//     }
//
//     updateDisplay(textArea.value)
//     // caretPositioner()
//   }, 0)
// }
//
// function updateDisplay() {
//   textDisplay.innerHTML = textArea.value
// }
//
// function updateAreaTxt() {
//   textArea.value = textDisplay.innerHTML;
//
//   setTimeout(updateDisplay(textArea.value), 0)
// }
