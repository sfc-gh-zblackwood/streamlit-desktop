/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */


const {basicSetup} = require("codemirror")
const {EditorView, keymap} = require("@codemirror/view")
const {EditorState} = require("@codemirror/state")

const {python} = require("@codemirror/lang-python")
const {indentWithTab} = require("@codemirror/commands")
const fs = require('fs');

const updated = (newCode) => {
    console.log(newCode);
    fs.writeFileSync('/tmp/test-sync.py', newCode);
}

const editor = new EditorView({
  doc: `import streamlit as st
st.write("# Hello world!")`,
  extensions: [
      basicSetup,
      keymap.of([indentWithTab]),
      python(),
      EditorView.updateListener.of((viewUpdate) => {
        if (viewUpdate.docChanged) {
            const doc = viewUpdate.state.doc;
            const value = doc.toString();
            updated(value);
        }
    }),
  ],
  parent: document.getElementById('editor'),
});

// Update to initial state
updated(editor.state.doc.toString())

require('electron').ipcRenderer.on('serverLog', (event, message) => {
    // Send logs to the #logs div
    const logDiv = document.getElementById('logs');
    logDiv.value += message;
})

require('electron').ipcRenderer.on('processLog', (event, message) => {
    // Send logs to the #logs div
    const logDiv = document.getElementById('logs');
    logDiv.value += message;
})

require('electron').ipcRenderer.on('menuItemClick', (event, message) => {
    let contents = "";
    if (message == "Basic") {
        contents = `# Import python packages
import streamlit as st
import pandas as pd
import numpy as np

# Write directly to the app
st.title("Example Streamlit-Desktop App :balloon:")

st.write(
    """Replace this example with your own code!
    **And if you're new to Streamlit,** check
    out our easy-to-follow guides at
    [docs.streamlit.io](docs.streamlit.io).
    """
)

# Use an interactive slider to get user input
hifives_val = st.slider(
    "Number of votes :hand:",
    min_value=0,
    max_value=90,
    value=60,
    help="Use this to enter the number of high-fives you gave in Q3",
)
sql_data = pd.DataFrame(np.random.randint(10, size=(10,3)) * 10)
sql_data.columns = [f'Votes for {i}' for i in range(1,4)]

# Create a simple bar chart
# See docs.streamlit.io for more types of charts
st.subheader("Number of votes :white_check_mark:")
st.bar_chart(data=sql_data)

st.subheader("Underlying data :bar_chart:")
st.table(sql_data)

        `
    }
    else if (message == "Plot") {
        contents = `import streamlit as st
st.write('# Some charts')

st.line_chart({"a": [1,2,3], "b": [2,5,10]})
        `
    }
    else if (message == "Complex") {
        contents = `import streamlit as st

st.write('# Some More Streamlit Stuff')

tab1, tab2, tab3 = st.tabs(["These", "Are", "Tabs"])

with tab1:
    st.write("Some stuff")
with tab2:
    st.write("The middle tab!")

with tab3:
    st.write("Another tab???")

num = st.slider("Select number", 1, 10, 3)

st.write(f"{num}^{num}: ", num**num)
`
    }
    editor.setState(EditorState.create({
        doc: contents,
        extensions: [
            basicSetup,
            keymap.of([indentWithTab]),
            python(),
            EditorView.updateListener.of((viewUpdate) => {
                if (viewUpdate.docChanged) {
                    const doc = viewUpdate.state.doc;
                    const value = doc.toString();
                    updated(value);
                }
            }),
        ],
    }))

    updated(contents);
})


  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }