const textEditor = document.querySelector(".editor-textinput");
const editorOptions = document.querySelectorAll(".editor-options [data-el]");
const newElementBtn = document.getElementsByClassName("insert-newEl");
const newStyleBtn = document.getElementsByClassName("insert-newStyle");
const applyAlignBtn = document.getElementsByClassName("apply-alignment");

class Editor {
  constructor(editor, options) {
    this.editor = editor;
    this.options = options;
    this.isEmpty = true;

    // Event Listeners
    this.editor.addEventListener("keydown", this.editorNavigator.bind(this))

    for (let opt in options) {
      const option = options[opt];

      for (let i = 0; i < option.length; i++) {
        switch (opt) {
          case "element":
            option[i].addEventListener("click", this.insertElement.bind(this))
            break;
          case "style":
            option[i].addEventListener("click", this.applyStyle.bind(this))
            break;
          case "align":
            option[i].addEventListener("click", this.applyAlign.bind(this))
            break;
        }
      }
    }

    // Auto Focus
    setTimeout(() => this.editor.focus(), 0)
  }

  insertElement(e) {
    const v = e.currentTarget.getAttribute("data-editValue");
    const headingRx = /h\d/;

    if (headingRx.test(v)) {
      document.execCommand("formatBlock", false, `<${v}>`)
      document.execCommand("insertBrOnReturn", true, null)
    }

    if (v === "hr") {
      document.execCommand("insertHorizontalRule", true, null)
    }
  }

  applyStyle(e) {
    const v = e.currentTarget.dataset["editValue"]
  }

  applyAlign(e) {
    const v = e.currentTarget.dataset["editValue"]
  }

  editorNavigator(e) {
    if ((e.keyCode == 8 && this.isEmpty) || (e.keyCode == 13 && this.isEmpty)) {
      e.preventDefault()
    }

    setTimeout(() => {

      if (this.editor.children.length == 1) {
        if (this.editor.firstElementChild.textContent.length == 0) {
          this.editor.classList.add("isEmpty")
          this.isEmpty = true;
        } else {

          this.editor.classList.remove("isEmpty")
          this.isEmpty = false;
        }
      } else {
        this.editor.classList.remove("isEmpty")
        this.isEmpty = false;
      }
    }, 0)
  }
}

new Editor(textEditor, {
  element: newElementBtn,
  style: newStyleBtn,
  align: applyAlignBtn
})
