import React, { useState, useEffect, useRef } from "react";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import 'quill-mention'; 
const ReactQuillMention = ({placeholder,commentText,onChange,allOrgUsersName,isSubmitText}) => {
  const [editorContent, setEditorContent] = useState(commentText);
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = new Quill('#editor', {
      debug: 'info',
      theme: 'snow',
      placeholder: placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["link"],
          ["clean"], 
          ["code-block"], 
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
        ],
        mention: {
          allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
          mentionDenotationChars: ['@'],
          source: function (searchTerm, renderList, mentionChar) {
            let values = allOrgUsersName;
            if (searchTerm.length === 0) {
              renderList(values, searchTerm);
            } else {
              const matches = [];
              for (let i = 0; i < values.length; i++)
                if (
                  ~values[i].value
                    .toLowerCase()
                    .indexOf(searchTerm.toLowerCase())
                )
                  matches.push(values[i]);
              renderList(matches, searchTerm);
            }
          },
        },
        history: {
          delay: 2000,
          maxStack: 500,
          userOnly: true,
        },
      },
    });

     // Store the quill instance in the ref
       quillRef.current = quill;
    // Set initial content
    quill.root.innerHTML = editorContent;

    // Handle text change event
    quill.on('text-change', () => {
      // setEditorContent(quill.root.innerHTML);
      onChange(quill.root.innerHTML)
    });

    // Enable redo (Ctrl+Y) by default if not overridden
    const undoManager = quill.getModule('history');
    quill.keyboard.addBinding(
      { key: 'y', shortKey: true },
      function () {
        undoManager.redo();
      }
    );

  }, []);

  useEffect(() => {
    if (isSubmitText) {
      // Clear the editor content
      if (quillRef.current) {
        quillRef.current.root.innerHTML = '';
        setEditorContent(''); 
      }
    }
  }, [isSubmitText]);

  return (
    <div>
      <div id="editor"></div>
    </div>
  );
};

export default ReactQuillMention;
