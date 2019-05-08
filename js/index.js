const textEditorRaw = document.querySelector(".editor-section.editor textarea");
const newElementBtn = document.getElementsByClassName("insert-newEl");
const newStyleBtn = document.getElementsByClassName("insert-newStyle");
const prevTab = document.getElementById("preview-tab");



(() => {
  for (let i = 0; i < newStyleBtn.length; i++) {
    newStyleBtn[i].addEventListener("click", e => addToText(e, true)) // true == place double
  }

  for (let i = 0; i < newElementBtn.length; i++) {
    newElementBtn[i].addEventListener("click", e => addToText(e, false))
  }

prevTab.addEventListener("change", () => parseToMarkDown(textEditorRaw.value))
})()


function addToText(e, double) {
  let selStart = textEditorRaw.selectionStart,
      selEnd = textEditorRaw.selectionEnd,
      preserved = "";


  const v = e.currentTarget.getAttribute("data-editValue");
  const singleLine = e.currentTarget.getAttribute("data-singleLine") == undefined ? false : true;
  const vLength = v.length;

  if (selEnd > selStart) {
    const sel = window.getSelection();
    preserved = sel.toString();
  }

  if (double) {
    document.execCommand("insertText", false, `${v}${preserved}${v}`)

    selStart = textEditorRaw.selectionStart;
    selEnd = textEditorRaw.selectionEnd;

    textEditorRaw.selectionStart = selStart - vLength;
    textEditorRaw.selectionEnd = selEnd - vLength;
  } else if (singleLine) {
    if (!new RegExp(".").test(textEditorRaw.value.charAt(textEditorRaw.selectionStart - 1))) {
      document.execCommand("insertText", false, `${v} ${preserved}`)
    } else {
      document.execCommand("insertText", false, `\n${v} `)
    }
  } else {
    document.execCommand("insertText", false, `${v} ${preserved}`) // Space is required
  }
}

function parseToMarkDown(text) {
  let save = text;

  const headingsRx = /^(#{1,6})\s(.+)$/gm;
  const boldItalicsRx = /(\*+)([\w\d\s\\\*][^\n]+?)\1/g;
  const line = /^-{3}$/gm;

  // Replace all the headings
  save = save.replace(headingsRx, (...g) => `<h${g[1].length}>${g[2]}</h${g[1].length}>`);

  // Create bold and italics
  save = save.replace(boldItalicsRx, (...g) => {
    switch (g[1].length) {
      case 1:
        return `<em>${g[2]}</em>`
        break;
      case 2:
        return `<strong>${g[2]}</strong>`
        break;
      case 3:
        return `<strong><em>${g[2]}</em></strong>`
        break;
    }
  })


  console.log(save)
  // console.log(save)

}

// const textEditor = document.querySelector(".editor-textinput");
// const editorOptions = document.querySelectorAll(".editor-options [data-el]");

// const applyAlignBtn = document.getElementsByClassName("apply-alignment");
//
// class Editor {
//   constructor(editor, options) {
//     this.editor = editor;
//     this.options = options;
//     this.isEmpty = true;
//
//     // Event Listeners
//     this.editor.addEventListener("keydown", this.editorNavigator.bind(this))
//
//     for (let opt in options) {
//       const option = options[opt];
//
//       for (let i = 0; i < option.length; i++) {
//         switch (opt) {
//           case "element":
//             option[i].addEventListener("click", this.insertElement.bind(this))
//             break;
//           case "style":
//             option[i].addEventListener("click", this.applyStyle.bind(this))
//             break;
//           case "align":
//             option[i].addEventListener("click", this.applyAlign.bind(this))
//             break;
//         }
//       }
//     }
//
//     // Auto Focus
//     setTimeout(() => this.editor.focus(), 0)
//   }
//
//   insertElement(e) {
//     const v = e.currentTarget.getAttribute("data-editValue");
//     const headingRx = /h\d/;
//
//     if (headingRx.test(v)) {
//       document.execCommand("formatBlock", false, `<${v}>`)
//       document.execCommand("insertText", true, "\n")
//
//       setTimeout(() => document.execCommand("forwardDelete", true, null),0)
//
//       // document.execCommand("insertParagraph", true, null)
//       // Maybe add code that checks if the button was pressed before text was added
//     }
//
//     if (v === "hr") {
//       document.execCommand("insertHorizontalRule", true, null)
//     }
//   }
//
//   applyStyle(e) {
//     const v = e.currentTarget.dataset["editValue"]
//   }
//
//   applyAlign(e) {
//     const v = e.currentTarget.dataset["editValue"]
//   }
//
//   editorNavigator(e) {
//     if ((e.keyCode == 8 && this.isEmpty) || (e.keyCode == 13 && this.isEmpty)) {
//       e.preventDefault()
//     }
//
//     setTimeout(() => {
//       console.log(this.editor.children)
//
//       if (this.editor.children.length == 1) {
//         if (this.editor.firstElementChild.textContent.length == 0 || !this.editor.firstElementChild.textContent) {
//           this.editor.classList.add("isEmpty")
//           this.isEmpty = true;
//         } else {
//           this.editor.classList.remove("isEmpty")
//           this.isEmpty = false;
//         }
//       } else {
//         console.log("two children")
//         if (this.editor.firstElementChild.nodeName == "HR") {
//           this.editor.classList.remove("isEmpty")
//           this.isEmpty = false;
//         }
//
//         this.editor.classList.remove("isEmpty")
//         this.isEmpty = false;
//       }
//     }, 0)
//   }
// }
//
// new Editor(textEditor, {
//   element: newElementBtn,
//   style: newStyleBtn,
//   align: applyAlignBtn
// })
