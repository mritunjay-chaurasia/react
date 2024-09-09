import React, { useEffect, useRef, useState } from "react";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/third_party/embedly.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/third_party/embedly.min.css";
import FroalaEditor from "react-froala-wysiwyg"; // Change import statement
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import Tribute from "tributejs";
import "tributejs/dist/tribute.css";
import { options } from "./options";

const MyFroalaEditor = ({model, setModel}) => {
  const ref = useRef({ editor: null });
  const [isFroalaInitialized, setIsFroalaInitialized] = useState(false);
  const tribute = new Tribute(options);
  const [editor, setEditor] = useState(undefined);

  const handleModelChange = (model) => {
    setModel(model);
  };

  // useEffect(() => {
  //   ref.current.editor.data._init = null;
  //   setEditor(ref.current.editor);
  //   editor && setIsFroalaInitialized(true);
  //   console.log("tes", <FroalaEditor />);
  // }, [ref.current]);

  useEffect(() => {
    if (isFroalaInitialized) {
      tribute.attach(editor.el);
      editor.html.set(model);
    }
  }, [isFroalaInitialized]);

  useEffect(() => {
    console.log("modelmodelmodel", model)
  }, [model])
  

  return (
      <FroalaEditor
        ref={ref}
        model={model}
        onModelChange={handleModelChange}
        tag="textarea"
        config={{
          attribution: false,
          placeholder: "Start typing...",
          borderRadius: "3px",
          toolbarButtons: {
            moreText: {
              buttons: [
                "bold",
                "italic",
                "underline",
                "strikeThrough",
                "subscript",
                "superscript",
                "fontFamily",
                "fontSize",
                "textColor",
                "backgroundColor",
                "inlineClass",
                "inlineStyle",
                "clearFormatting",
              ],
            },
            moreParagraph: {
              buttons: [
                "alignLeft",
                "alignCenter",
                "formatOLSimple",
                "alignRight",
                "alignJustify",
                "formatOL",
                "formatUL",
                "paragraphFormat",
                "paragraphStyle",
                "lineHeight",
                "outdent",
                "indent",
                "quote",
              ],
            },
            moreRich: {
              buttons: [
                "insertLink",
                "insertImage",
                "insertVideo",
                "insertTable",
                "emoticons",
                "fontAwesome",
                "specialCharacters",
                "embedly",
                "insertFile",
                "insertHR",
              ],
            },
            moreMisc: {
              buttons: [
                "undo",
                "redo",
                "fullscreen",
                "print",
                "getPDF",
                "spellChecker",
                "selectAll",
                "html",
                "help",
              ],
              align: "right",
              buttonsVisible: 2,
            },
          },
          pluginsEnabled: [
            "table",
            "spell",
            "quote",
            "save",
            "quickInsert",
            "paragraphFormat",
            "paragraphStyle",
            "help",
            "draggable",
            "align",
            "link",
            "lists",
            "file",
            "image",
            "emoticons",
            "url",
            "video",
            "embedly",
            "colors",
            "entities",
            "inlineClass",
            "inlineStyle",
            "imageTUI",
          ],
        }}
      />
  );
};

export default MyFroalaEditor;
