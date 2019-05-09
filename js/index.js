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
  const linesRx = /^-{3}$/gm;
  const codeRx = /(```)\w*\n?([\w\d\n\s\t\r\D]+)\1/g;
  const linksRx = /\[(.+)\]\((.+)\)/;
  // const globalListItemRx = /^(\s[^\n])*\-\s{1}(.+)/gm;
  const globalListItemRx = /^(\s*[^\n])?\-\s{1}(.+)/gm
  // Create code blocks
  save = save.replace(codeRx, (...g) => `<pre><code>${g[2]}</code></pre>`)

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

  // Create lines
  save = save.replace(linesRx, () => "<hr>")

  // Create links
  save = save.replace(linksRx, (...g) => `<a href="${g[2]}">${g[1]}</a>`)

  function createLists() {
    let i = 0;
    let l = [...save.matchAll(globalListItemRx)];
    let temp;

    function tracker() {
      let c = 0;
      temp = l.map((a) => {
        a["newSubUl"] = ""
        a["endSubUl"] = ""
        a["closeUl"] = ""
        a["newUl"] = ""

        a["depth"] = a[1] ? a[1].split("").length / 2: 0
        return a
      })

      temp = temp.map((a, b, all) => {
        if (b > 0) {
          let prevDepth = all[b - 1].depth;
          let thisDepth = a.depth;

          if (thisDepth > prevDepth) {
            a["newSubUl"] = "<li>\n<ul>\n"
          } else if (thisDepth < prevDepth) {
            all[b - 1]["endSubUl"] = "\n</ul>\n</li>"
          }
        }

        if (c + 1 !== a.index) {
          // New Big Ul
          if (all[b - 1]) {
          // If there is a previous one close that
            all[b - 1]["closeUl"] = "\n</ul>"
          }

          a["newUl"] = "<ul>\n"
        } else if (b == all.length - 1) {
          // End Item Reached
          let end = "";

          for (let e = 0; e < a.depth; e++) {
            end += "\n</ul>\n</li>"
          }

          a["closeUl"] = `${end}\n</ul>`
        }

        c = a[0].length + a.index;
        return a
      })
    }
    tracker()

    save = save.replace(globalListItemRx, (...g) => {
      // let el = `${temp[i].newUl ? temp[i].newUl : ""}${temp[i].newSubUl ? temp[i].newSubUl : ""}<li>${g[2]}</li>${temp[i].endSubUl ? temp[i].endSubUl : ""}${temp[i].closeUl ? temp[i].closeUl : ""}`

      let el = `${temp[i].newUl}${temp[i].newSubUl}<li>${g[2]}</li>${temp[i].endSubUl}${temp[i].closeUl}`
      i++

      return el

    })
    console.log(save)
  }

  createLists()


}
