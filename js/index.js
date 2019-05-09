const textEditorRaw = document.querySelector(".editor-section.editor textarea");
const textEditorPreview = document.querySelector(".editor-section.preview");
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
  const pSepRx = /\n/g
  const headingsRx = /^(#{1,6})\s(.+)$/gm;
  const boldItalicsRx = /(\*+)([\w\d\s\\\*][^\n]+?)\1/g;
  const linesRx = /^-{3}$/gm;
  // const codeRx = /(```)\w*\n?([\w\d\n\s\t\r\D]+)\1/g;\
  const codeRx = /(?:`{3}\w*\n?([\w\d\s\t\r\D]+)`{3}|`{1}(.+)`{1})/g
  const linksRx = /\[(.+)\]\((.+)\)/;
  const globalListItemRx = /^(\s*[^\n])?\-\s{1}(.+)/gm

  // Create paragraphs
  function liJoiner(data) {
    let storage = (typeof data === "object" ? data : data.split(pSepRx))
    let liRx = /^(\s*[^\n])?\-\s{1}(.+)/m;
    let reRun = false;

    storage.forEach((d, i, all) => {
      if (i > 0) {
        if (liRx.test(all[i - 1]) && !liRx.test(d)) {
          if (d.length) {
            all[i - 1] += ` ${d}`;
            all.splice(i, 1);

            reRun = true;
          }
        }
      }
    })

    if (reRun == true) {
      return liJoiner(storage);
    } else {
      return storage.join("\n")
    }
  }

  save = liJoiner(save)

  function paragrapher(data) {
    let storage = (typeof data === "object" ? data : data.split(pSepRx));
    const paraRx = /^[\w].+$/m;
    let reRun = false;

    storage.forEach((d, i, all) => {
      if (i > 0) {
        if ((paraRx.test(all[i - 1]) && paraRx.test(d)) || (boldItalicsRx.test(all[i - 1]) && paraRx.test(d))) {
          if (d.length) {
            all[i - 1] += ` ${d}`;
            all.splice(i, 1);

            reRun = true;
          }
        }
      }
    })

    if (reRun == true) {
      return paragrapher(storage);
    } else {

      storage = storage.map((s, i, all) => {
        if (i > 0 && i < all.length - 1) {
          if ((/^(\*|\w).+/m).test(s)) {
            if (!all[i - 1].length || headingsRx.test(all[i - 1])) {
              if (!(/^(\*+).+\1$/m).test(s)) {
                return `<p>${s}</p>`
              }
            }
          }
        }
        return s
      })

      return storage.join("\n")
    }
  }

  save = paragrapher(save)

  // Create code blocks
  save = save.replace(codeRx, (...g) => {
    if (g[2]) {
      return `<pre style="display: inline-block"><code>${g[2]}</code></pre>`
    }

    if (g[1]) {
      return `<pre><code>${g[1]}</code></pre>`
    }

  })

  // Replace all the headings
  save = save.replace(headingsRx, (...g) => `<h${g[1].length}>${g[2]}</h${g[1].length}>`);

  // Create lines
  save = save.replace(linesRx, () => "<hr>")

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

  // Create links
  save = save.replace(linksRx, (...g) => `<a href="${g[2]}">${g[1]}</a>`)

  function createLists() {
    let i = 0;
    let temp = [...save.matchAll(globalListItemRx)];

    function tracker() {
      let c = 0;
      temp = temp.map((a) => {
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
      let el = `${temp[i].newUl}${temp[i].newSubUl}<li>${g[2]}</li>${temp[i].endSubUl}${temp[i].closeUl}`

      i++

      return el
    })
  }

  createLists()



  textEditorPreview.innerHTML = save;

  console.log(textEditorPreview.innerHTML)
  // console.log(save)
}
