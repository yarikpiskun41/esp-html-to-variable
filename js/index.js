const autocomplete = ace.require("ace/ext/language_tools");
const beautify = ace.require("ace/ext/beautify")
const editor = ace.edit("editor");
const convertButton = document.getElementById("convert-btn");
const idoc = document.getElementById("iframe").contentWindow.document;
const clearBtn = document.getElementById("clear-btn");
const beautifyBtn = document.getElementById("beautify-btn");
const saveBtn = document.getElementById("save-btn");
const newTabCodeOpen = document.getElementById("new-code-tab-open");
const newTabSiteOpen = document.getElementById("new-site-tab-open");
const area = document.getElementById("result-area");
const footerTurning = document.getElementById("footer-btn");


editor.setTheme("ace/theme/monokai");

editor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true
})


editor.session.setMode("ace/mode/html");


const updateIFrame = () => {
  idoc.open();
  idoc.write(editor.getValue());
  idoc.close();
}

const saveCode = () => {
  localStorage.setItem("espHtmlCode", editor.getValue())
}

const loadHtmlPreset = () => {
  editor.setValue(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title></title></head><body></body></html>`)
  beautify.beautify(editor.getSession())
}

const loadCode = () => {
  const espHtmlCode = localStorage.getItem("espHtmlCode")
  if (espHtmlCode) {
    editor.setValue(espHtmlCode);
  } else {
    loadHtmlPreset();
  }
}


document.addEventListener('keydown', e => {
  if (e.ctrlKey && (e.key === 's' || e.key === 'і' || e.key === 'ы')) {
    e.preventDefault();
    const prevPosition = editor.getCursorPosition();
    beautify.beautify(editor.getSession())
    editor.moveCursorTo(prevPosition.row, prevPosition.column);
    saveCode();
  }
});


convertButton.onclick = () => {
  const variable = document.getElementById("variable-input").value;
  const code = editor.getSession().getLines(0, editor.getSession().getLength() - 1);
  if (variable) {
    const resultCode = code.map(fragment => `${variable} += "${fragment.trim()}\\n";`).join("\n");
    area.value = resultCode;
  } else {
    const resultCode = code.map(fragment => `"${fragment.trim()}\\n+"`).join("\n");
    area.value = resultCode;
  }
}

clearBtn.onclick = () => {
  localStorage.removeItem("espHtmlCode");
  loadHtmlPreset();
}

beautifyBtn.onclick = () => {
  beautify.beautify(editor.getSession())
}

saveBtn.onclick = () => {
  saveCode();
}

newTabCodeOpen.onclick = () => {
  if (area.value) {
    const codeWindow = window.open("about:blank", '_blank');
    codeWindow.document.title = "HTML To Variable Result Code";
    codeWindow.document.body.innerText = area.value;
    codeWindow.document.close();
    codeWindow.focus();
  }
}

newTabSiteOpen.onclick = () => {
  const codeWindow = window.open("about:blank", '_blank');
  codeWindow.document.write(editor.getSession().getValue());
  codeWindow.document.title = "HTML To Variable Result Site";
  codeWindow.document.close();
  codeWindow.focus();
}

window.onload = () => {
  if (window.innerWidth <= 768) {
    const options = document.querySelector(".options");
    options.parentNode.removeChild(options);
    document.querySelector("main").prepend(options);
    document.querySelector("footer").style.display = "none";
  }
  loadCode();
};

footerTurning.onclick = () => {
  const footer = document.querySelector("footer");
  const footerDisplay = footer.style.display;
  if(footerDisplay === "none") {
    footer.style.display = "block";
  }
  if(footerDisplay === "block") {
    footer.style.display = "none";
  }
}

editor.getSession().on("change", updateIFrame)

