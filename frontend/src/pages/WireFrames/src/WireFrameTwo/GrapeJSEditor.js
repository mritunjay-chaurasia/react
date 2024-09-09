import React, { useEffect, useState, useRef } from "react";
import Grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import dynamicConfig from "./constants/WithGrapesjsConfig";
import "./GrapeJSEditor.css";
import { BACKEND_URL } from '../../../../constants/index';
import Drawer from "@mui/material/Drawer";
import { TuneOutlined } from "@mui/icons-material";
import { KeyboardBackspaceOutlined } from "@mui/icons-material";
import BackgroundImage from "../../../../assets/images/checkbg.gif";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { saveAs } from "file-saver";
import * as htmlToImage from "html-to-image";
import { Button, DialogTitle, IconButton, Typography, DialogActions, DialogContent, Dialog, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import juice from "juice"
import Plugin from "./grapejsmodule";

// const filterAssets = (assets, group) => {
//     const images = assets
//         ? assets.map(items => {
//             if (items.group === group) {
//                 return items.url;
//             }
//         })
//         : [];
//     const imageData = images.filter(items => {
//         if (!undefined) {
//             return items;
//         }
//     });
//     return imageData;
// };

const initialHtmlState = {
  html: `<div></div>`,
  css: ``,
  assets: [],
  custom_body: `<script>console.log('body')</script>`,
  custom_footer: `<script>console.log('footer')</script>`,
  custom_head: '<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">',
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function GrapeJSEditor(props) {
  console.log(props);
  /** props */
  const { data, setData } = props;

  /** initial mount ref */
  const isInitialMount = useRef(true);

  /** content from api */
  // const content =
  //   data && data.content ? JSON.parse(data.content) : initialHtmlState;
  const [initialComponents, setInitialComponents] = useState(initialHtmlState);
  const [editor, setEditor] = useState({});
  const [builder, setBuilder] = useState({
    panelRight: false,
  });
  const [settingOpen, setsettingOpen] = useState({
    name: "",
    domain: "",
    open: false,
  });

  const [open, setOpen] = React.useState(false);
  const [prevHtmlCss, setPrevdHtmlCss] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("png");

  const handleCloseSaveDialog = () => {
    setOpen(false);
    props.setIsManualMode(false);
  };

  useEffect(() => {
    // loadGrapesJs()
    setInitialComponents({
      ...initialComponents,
      html: data.content.html,
      css: data.content.css,
    });
    setsettingOpen({
      ...settingOpen,
      name: data.name,
      domain: data.customdomain,
    });
  }, [data]);

  // /** Grapes js Initialization */
  // const loadGrapesJs = async () => {
  //     const editor = await Grapesjs.init(dynamicConfig(data.configuration));
  //     const assetManager = editor.AssetManager;
  //     editor.on('component:selected', model => {
  //         model.set('resizable', true); // Enable resizing for selected component
  //     });
  //     setEditor(editor);
  //     addCommands(editor);
  //     addDevices(editor);
  //     isStylesOpen(editor);
  //     imageUploader(editor);
  //     addStyleManager(editor);
  //     onLoad(editor);
  //     const canvas = editor.Canvas;
  //     // assetManager.add(assets);
  //     // setTimeout(addStyleManager(editor),0);
  //     const selected = editor.getSelected();
  //     // console.log(editor.getSelected);
  //     // Scroll smoothly (this behavior can be polyfilled)
  //     // canvas.scrollTo(selected, { alignToTop : false });
  //     canvas.scrollTo(selected, { behavior: 'smooth' });
  //     // Force the scroll, even if the element is alredy visible
  //     canvas.scrollTo(selected, { force: true });
  //     // editor.StyleManager.getProperty('typography', 'Rubik');
  // };

  // /** handle open style container */
  // const handleopen = () => {
  //     console.log("inside open componenet")
  //     const rightPanel = document.querySelector('.gjs-sm-open')
  //     rightPanel.style.height = '0px'
  //     const element = document.querySelector('.gjs-sm-sector-title')
  //     element.style.display = 'none'
  //     setBuilder({ ...builder, panelRight: true })
  // }

  // /** handle close style container */
  // const handleClose = () => {
  //     const ele = window?.editor?.getSelected();
  //     window.editor?.selectToggle(ele);
  //     setBuilder({ ...builder, panelRight: false })
  // }

  // /** after loaading of grapejs  */
  // const onLoad = (editor) => {
  //     const categories = editor.BlockManager.getCategories();
  //     const catBlocks = editor.BlockManager.getAll();
  //     const customhead = editor.Canvas.getDocument()?.head;
  //     const custombody = editor.Canvas.getDocument()?.body;
  //     const customfooter = editor.Canvas.getDocument()?.body;

  //     /** set inital html in builder */
  //     editor.setComponents(initialComponents.html);

  //     // setting css
  //     editor.setStyle(initialComponents.css);

  //     /** find block categories and make default open false */
  //     // categories.forEach(category => {
  //     //   category.set('open', false).on('change:open', opened => {
  //     //     opened.get('open') &&
  //     //       categories.each(category => {
  //     //         category !== opened && category.set('open', false);
  //     //       });
  //     //   });
  //     // });
  //     setPrevdHtmlCss({
  //         html: editor.getHtml(),
  //         css: editor.getCss()
  //     })

  //     var elements = document.getElementsByClassName('gjs-blocks-no-cat');
  //     elements[0].style.height = 0;

  //     const documents = editor.Canvas.getDocument();
  //     if (documents) {
  //         const styleTag = documents.querySelector('body > style');
  //         if (styleTag) {
  //             styleTag.remove();
  //         }

  //         const styleEle = documents.createElement('style');
  //         const customCss = `
  //     /* Your custom CSS rules */
  //     /* [data-gjs-type="wrapper"] { */
  //     body {
  //       display:flex;
  //       min-height:100vh;
  //       justify-content:center;
  //       flex-direction:row;
  //       flex-wrap:wrap;
  //       background-image: url(${BackgroundImage});
  //       background-repeat: repeat;
  //       background-position: center;
  //       align-items:center
  //     }
  //    `;
  //         styleEle.textContent = customCss;
  //         styleEle.append(``);
  //         documents.head.appendChild(styleEle);
  //     }
  // };

  // /** Load custom data */
  // const loadCustomData = () => {
  //     const codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
  //     codeViewer.set({
  //         ...{ codeName: 'htmlmixed', theme: 'hopscotch', readOnly: 0 },
  //     });
  //     editor.on('load', onLoad);
  // };

  // /** add commands */
  // const addCommands = editor => {
  //     const commands = editor.Commands;
  //     commands.getAll();
  //     commands.add('set-device-xs', {
  //         run(editor) {
  //             editor.setDevice('Mobile');
  //         },
  //     });
  //     commands.add('set-device-sm', {
  //         run(editor) {
  //             editor.setDevice('Tablet');
  //         },
  //     });
  //     commands.add('set-device-md', {
  //         run(editor) {
  //             editor.setDevice('Medium');
  //         },
  //     });
  //     commands.add('set-device-lg', {
  //         run(editor) {
  //             editor.setDevice('Large');
  //         },
  //     });
  //     commands.add('set-device-xl', {
  //         run(editor) {
  //             editor.setDevice('Extra Large');
  //         },
  //     });
  //     commands.add('open-assset-manager', {
  //         run(editor) {
  //             // console.log(EventTarget);
  //             const myCommands = commands.get('core:open-assets');
  //             myCommands.run(editor, { target: '_blank' });
  //         },
  //     });
  // };

  // // add devices
  // const addDevices = editor => {
  //     const deviceManager = editor.DeviceManager;
  //     deviceManager.add('Mobile', '385px',
  //         {
  //             width: '385px',//width for mobile size
  //             name: 'Mobile',// device name
  //             widthMedia: '576px', // the width that will be used for the CSS media
  //         }
  //     );
  //     deviceManager.add('Extra Large', 'auto',
  //         {
  //             width: 'auto',//width for mobile size
  //             name: 'Extra Large',// device name
  //             widthMedia: 'auto', // the width that will be used for the CSS media
  //         }
  //     );
  // };

  // /** component and canvas action events */
  // const isStylesOpen = editor => {
  //     editor.on('component:selected', handleopen);
  //     editor.on('component:deselected', handleClose);
  //     editor.on('run:preview:before', function () {
  //     });
  // };

  // // add dynamic styles
  // const addStyleManager = editor => {
  //     const styleManager = editor.StyleManager;
  //     const sector = styleManager.getSector('advanced');
  //     /** added custom fonts */
  //     const fontProperty = styleManager.getProperty('appearence', 'font-family');
  //     // let list = fontProperty.get('list');
  //     // list.push({ value: 'Manrope, sans-serif', name: 'Manrope' });
  //     // list.push({ value: 'Nunito, sans-serif', name: 'Nunito' });
  //     // list.push({ value: 'Segoe UI', name: 'Segoe UI' });
  // };

  // // image upload
  // const imageUploader = editor => {
  //     editor.on('asset:upload:start', () => {
  //         //  console.log('start');
  //     });
  //     editor.on('asset:upload:error', err => {
  //         //  console.log('errrr', err);
  //     });
  //     editor.on('asset:add', () => {
  //         //  console.log('add');
  //     });
  //     editor.on('asset:upload:response', response => {
  //         const images = [];
  //         for (let i = 0; i < response.length; i++) {
  //             images.push({ type: 'image', src: response[i] });
  //         }
  //         editor.AssetManager.add(images);
  //     });
  //     editor.on('asset:upload:end', () => {
  //         // console.log('end');
  //     });
  //     editor.on('canvas:drop', function (e) { });
  //     editor.on('canvas:dragenter', function () {
  //         //console.log('dragenter');
  //         editor.runCommand('sw-visibility');
  //         editor.runCommand('core:component-outline');
  //         // console.log(document.getElementsByClassName('gjs-frame'));
  //     });
  //     editor.on('canvas:drop', function () {
  //         //console.log('drop');
  //         editor.stopCommand('sw-visibility');
  //         // document.getElementsByClassName('gjs-frame').classList.add('h-100');
  //     });
  // };
  // /** Life cycle method for loading grapesjs */
  // useEffect(() => {
  //     if (isInitialMount.current) {
  //         isInitialMount.current = false;
  //         loadGrapesJs();
  //     } else {
  //         loadCustomData();
  //     }
  // }, [editor]);

  useEffect(() => {
    if (props.checkedManualChanges) {
      compareHtmlAndCss();
    }
  }, [props.checkedManualChanges]);

  const handleClickOpenSaveDialog = () => {
    compareHtmlAndCss();
  };

  const compareHtmlAndCss = () => {
    const previousHtml = prevHtmlCss.html;
    const previousCss = prevHtmlCss.css;
    const currentHtml = editor?.getHtml();
    const currentCss = editor?.getCss();

    console.log(`comparisonnnnnnnnnnnnnnnnn html \n previousHtml \n ${previousHtml} \n currentHtml \n ${currentHtml}`);
    console.log(`comparisonnnnnnnnnnnnnnnnn css \n previousCss \n ${previousCss} \n currentCss \n ${currentCss}`);

    console.log("editor html css 222", previousHtml, currentHtml);
    console.log("editor html css 222", previousCss, currentCss);
    // Compare HTML and CSS
    const htmlChanged = previousHtml !== currentHtml;
    const cssChanged = previousCss !== currentCss;
    props.setCheckedManualChanges(false);
    console.log("changedhtml>>>>>>>>>>>>>", htmlChanged, "cssChanged>>>>>>>>>>>>", cssChanged);
    if (htmlChanged || cssChanged) {
      setOpen(true);
      return true;
    } else {
      setOpen(false);
      props.setIsManualMode(false);
      return false;
    }
  };

  // // const toggleDrawer = () => {
  // //   setsettingOpen({
  // //     ...settingOpen,
  // //     open: !settingOpen.open,
  // //   })
  // // }

  // // const handleUpdatePage = (e) => {
  // //   e.preventDefault();
  // //   props.updatePage(editor.getHtml())
  // //   // props.updatePage({
  // //   //   page_id:data._id,
  // //   //   body:{
  // //   //     name : settingOpen.name,
  // //   //     customdomain: settingOpen.domain
  // //   //   }
  // //   // })
  // //   toggleDrawer();
  // // }

  function applyInlineStyles(html, css) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const styleSheet = css.split("}").reduce((acc, rule) => {
      const [selectors, styles] = rule.split("{");
      if (selectors && styles) {
        selectors.split(",").forEach((selector) => {
          selector = selector.trim();
          if (selector) {
            acc[selector] = (acc[selector] ? acc[selector] + ";" : "") + styles.trim();
          }
        });
      }
      return acc;
    }, {});
  
    Object.entries(styleSheet).forEach(([selector, style]) => {
      try {
        const elements = doc.querySelectorAll(selector);
        elements.forEach((element) => {
          element.style.cssText += style;
        });
      } catch (error) {
        console.error(`Failed to apply styles for selector: ${selector}`);
        console.error(error);
      }
    });
  
    return doc.body.innerHTML;
  }
  

  const updatePage = () => {
    console.log("htm>>>>>and>>>>css>>>>>>>>>>>>>  HTML", editor.getHtml(), "CSS>>>>>>>>", editor.getCss());

    // Merge the HTML and CSS
    const tmpl = editor.getHtml() + `<style>${editor.getCss()}</style>`
  //   const htmlWithInlineStyles = juice(tmpl, { })
  // console.log("htmlWithInlineStyles htmlWithInlineStyles", htmlWithInlineStyles);


    // const inlinedHtml = applyInlineStyles(editor.getHtml(), editor.getCss());
    // props.updateHtmlwtihCss(inlinedHtml)
    console.log("htm>>>>>and>>>>css>>>>>>>>>>>>>  htmlWithCss", tmpl);
    props.updatePage(tmpl);
    handleCloseSaveDialog();
    // props.updatePage({
    //   page_id: data._id,
    //   body:{
    //     content :{
    //       html : editor.getHtml(),
    //       css : editor.getCss(),
    //       customheader: initialComponents.custom_head,
    //       customfooter: initialComponents.custom_footer,
    //     }
    //   }
    // })
  };

  // const previewPage = () => {
  //     window.open(data.live_url, data.live_url)
  // }

  useEffect(() => {
    // let editor = Grapesjs.init({
    //     height: '100%',
    //     storageManager: false,
    //     container: '#gjs',
    //     fromElement: true,
    //     dragMode: 'translate',
    //     plugins: [Plugin], // Path to the plugin folder
    //     pluginsOpts: {
    //         'grapesjs-preset-newsletter': {
    //             modalLabelImport: 'Paste all your code here below and click import',
    //             modalLabelExport: 'Copy the code and use it wherever you want',
    //             importPlaceholder: '<table class="table"><tr><td class="cell">Hello world!</td></tr></table>',
    //             cellStyle: {
    //                 'font-size': '12px',
    //                 'font-weight': 300,
    //                 'vertical-align': 'top',
    //                 color: 'rgb(111, 119, 125)',
    //                 margin: 0,
    //                 padding: 0,
    //             }
    //         }
    //     },
    // });
    (async () => {
      // const editor = await Grapesjs.init(dynamicConfig(data.configuration));

      const editor = Grapesjs.init({
        // Indicate where to init the editor. You can also pass an HTMLElement
        container: "#gjs",
        // Get the content for the canvas directly from the element
        // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
        fromElement: true,
        // Size of the editor
        height: "100%",
        width: "auto",
        avoidInlineStyle: true,
        inlineCss: false,
        // Disable the storage manager for the moment
        storageManager: false,
        dragMode: "absolute",
        // layerManager: {
        //     appendTo: '.layers-container'
        // },
        // Avoid any default panel
        panels: {
          defaults: [],
        },
        plugins: [Plugin],
        colorPicker: { appendTo: "parent", offset: { top: 26, left: -180 } },
        blockManager: {
          appendTo: "#blocks",
          blocks: [],
        },
        // selectorManager: {
        //     appendTo: '.styles-container'
        // },
        styleManager: {
          appendTo: ".styles-container",
          sectors: [],
        },
      });


      editor.on('asset:add', async asset => {
        if (asset.get('type') === 'image') {
            if (!asset.get('src')) {
                console.error("Debugging>>>>>>>>>>>>>>>>>>>>>>  No file selected");
                return;
            }
            let r = (Math.random() + 1).toString(36).substring(7);
            let imageName = `assets_image_${r}`;
            // Extract file extension from the name attribute
            const name = asset.get('name');
            let imageExtension = name.split(".").pop();

            // Concatenate filename with file extension
            let finalImgSrc = `${imageName}.${imageExtension}`;
            // console.error("Debugging>>>>>>>>>>>>>>>>>>>>>> finalImgSrc",finalImgSrc);
            try {
                // Fetch the image as a Blob
                const responseBlob = await fetch(asset.get('src')).then(response => response.blob());
                // Create a new FormData
                const formData = new FormData();
                // Append the Blob to the FormData with the desired filename
                formData.append("file", responseBlob, finalImgSrc);
                const uploadResponse = await fetch(`${BACKEND_URL}/image/`, {
                    method: 'POST',
                    body: formData,
                });
                // console.error("Debugging>>>>>>>>>>>>>>>>>>>>>> uploadResponse",uploadResponse);
                const finalSrcImage = `${BACKEND_URL}/grapesjsImages/${finalImgSrc}`;
                // console.error("Debugging>>>>>>>>>>>>>>>>>>>>>> finalSrcImage",finalSrcImage);
                asset.set('src', finalSrcImage);
            } catch (error) {
                console.error('Error uploading image:', error);
                // If there's an error, return the original asset
                return asset;
            }
        }
    });

      editor.on("component:selected", (component) => {
        component.set("resizable", {
          tl: 1,
          tc: 1,
          tr: 1,
          cl: 1,
          cr: 1,
          bl: 1,
          bc: 1,
          br: 1,
        });
        let toolbar = component.get('toolbar');
        toolbar = toolbar.filter(item => item.command === "tlb-delete" || item.command === "tlb-clone");
        component.set('toolbar', toolbar);
      });
      editor.on('update', handleStyleUpdate);

      editor.setComponents(data.content.html);
      editor.setStyle(data.content.css);

      console.log(" editor html css ", editor.getHtml());
      console.log(" editor html css ", editor.getCss());

      setPrevdHtmlCss({
        html: editor.getHtml(),
        css: editor.getCss(),
      });
      const injectCustomStyle = () => {
        const grapejsElement = document.getElementById("gjs");
        if (grapejsElement) {
          const grapejsIframeElement = grapejsElement.querySelector("iframe");
          // grapejsIframeElement.style.margin = "40px";

          if (grapejsIframeElement && grapejsIframeElement.contentDocument) {
            const styleTag =
              grapejsIframeElement.contentDocument.querySelector("style");
            if (styleTag) {
              styleTag.remove();
            }

            const customCss = `
                            /* Your custom CSS rules */
                            html {
                                height: 100%;
                                margin: 0;
                                padding: 10px;
                            }
                            * {
                                box-sizing: border-box;
                            }
                            body {
                                background-image: url(${BackgroundImage});
                                background-repeat: repeat;
                                background-position: center;
                                width: 100%;
                                height: 100%;
                                margin: 0;
                                border: none;
                                overflow: auto;
                            }
                            body > div:first-child {
                                width: 100%;
                                height: 100%;
                                padding:50px 0px;
                                // display: flex;
                                // flex-direction: column;
                                // justify-content: center;
                                // align-items: center;
                            }
                        `;

            const styleEle =
              grapejsIframeElement.contentDocument.createElement("style");
            styleEle.textContent = customCss;
            grapejsIframeElement.contentDocument.head.appendChild(styleEle);
          }
        }
      };

      const timer = setTimeout(injectCustomStyle);

      // const documents = editor.Canvas.getDocument();
      // if (documents) {

      // }

      setEditor(editor);
      // Under Functionality
      editor.Commands.add("toUnder", {
        run: function (editor, sender) {
          const selected = editor.getSelected();
          if (selected) {
            const index = editor.getSelectedAll().indexOf(selected);
            if (index !== -1) {
              selected.setStyle({ "z-index": -1, position: "absolute" });
            }
          }
        },
      });

      // Above Functionality
      editor.Commands.add("toAbove", {
        run: function (editor, sender) {
          const selected = editor.getSelected();
          if (selected) {
            const index = editor.getSelectedAll().indexOf(selected);
            if (index !== -1) {
              selected.setStyle({ "z-index": 1, position: "absolute" });
            }
          }
        },
      });

      editor.Panels.addButton("options", {
        id: "to-under",
        className: "fa fa-arrow-down",
        command: "toUnder",
        attributes: { title: "To Under" },
      });

      editor.Panels.addButton("options", {
        id: "to-above",
        className: "fa fa-arrow-up",
        command: "toAbove",
        attributes: { title: "To Above" },
      });

      // Cleanup on component unmount
      return () => clearTimeout(timer);
    })();
  }, []);


  const handleStyleUpdate = (editor) => {
    const previousHtml = prevHtmlCss.html;
    const previousCss = prevHtmlCss.css;
    const currentHtml = editor?.getHtml();
    const currentCss = editor?.getCss();
    
    console.log(`comparisonnnnnnnnnnnnnnnnn html \n previousHtml \n ${previousHtml} \n currentHtml \n ${currentHtml}`);
    console.log(`comparisonnnnnnnnnnnnnnnnn css \n previousCss \n ${previousCss} \n currentCss \n ${currentCss}`);
    
    console.log("editor html css 222", previousHtml, currentHtml);
    console.log("editor html css 222", previousCss, currentCss);
    // Compare HTML and CSS
    const htmlChanged = previousHtml !== currentHtml;
    const cssChanged = previousCss !== currentCss;
    props.setCheckedManualChanges(false);
    console.log("changedhtml>>>>>>>>>>>>>", htmlChanged, "cssChanged>>>>>>>>>>>>", cssChanged);
    if (htmlChanged || cssChanged) {
      props.setAnyChanges(false)
    } else props.setAnyChanges(true)
    console.log("editor changeddddddddddddddddddd ", htmlChanged || cssChanged)
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

//   const downloadImageAsPerFormat = () => {
//     const iframeContainer = document.getElementById("gjs");
//     if (iframeContainer) {
//         const iframe = iframeContainer.getElementsByTagName("iframe")[0];
//         if (iframe) {
//             const iframeContentDocument = iframe.contentDocument || iframe.contentWindow.document;
//             const node = iframeContentDocument.getElementsByTagName("body")[0];

//             const exportImage = (dataUrl, extension) => {
//                 saveAs(dataUrl, `exported-element.${extension}`);
//             };

//             if (selectedOption === "png") {
//                 htmlToImage.toPng(node).then((dataUrl) => {
//                     exportImage(dataUrl, "png");
//                 });
//             } else if (selectedOption === "jpg") {
//                 htmlToImage.toJpeg(node).then((dataUrl) => {
//                     exportImage(dataUrl, "jpg");
//                 });
//             } else if (selectedOption === "svg") {
//                 htmlToImage.toSvg(node).then((dataUrl) => {
//                     exportImage(dataUrl, "svg");
//                 });
//             }
//         }
//     }
// }


  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      {/* <Drawer anchor={'right'} open={settingOpen.open} onClose={toggleDrawer}>
      <div style={{ padding: "1rem" }}>
        <form onSubmit={handleUpdatePage}>
          <div id="Page-name" className="field-wrapper input">
            <label htmlFor="page-name">Page Name</label>
            <input
              id="name"
              name="page-name"
              type="text"
              className="form-control"
              placeholder="Type your page name"
              value={settingOpen.name}
              onChange={e => {
                setsettingOpen({
                  ...settingOpen,
                  name: e.target.value
                });
              }}
            />
          </div>
          <div id="Domain-name" className="field-wrapper input" style={{ marginBottom: "1rem", marginTop: "1rem" }}>
            <label htmlFor="domain-name">Domain Name</label>
            <input
              id="domain"
              name="domain-name"
              type="text"
              className="form-control"
              placeholder="Type your domain name"
              value={settingOpen.domain}
              onChange={e => {
                setsettingOpen({
                  ...settingOpen,
                  domain: e.target.value
                });
              }}
            />
          </div>
          <button className="btn btn-primary">
            Save
          </button>
        </form>
      </div>
    </Drawer> */}
      {/* <div className="download-button-container"> */}
        {/* <Button
          variant="outlined"
          style={{
            color: "#F07227",
            border: "1px solid #F07227",
            margin: "0 20px",
          }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          Export
        </Button>

        {showDropdown && (
          <>
            <FormControl style={{ width: "120px" }}>
              <InputLabel id="demo-simple-select-label">Format</InputLabel>
              <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedOption} label="Format" onChange={(e) => handleOptionSelect(e.target.value)}>
                <MenuItem value="png">PNG</MenuItem>
                <MenuItem value="jpg">JPG</MenuItem>
                <MenuItem value="svg">SVG</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              style={{
                color: "#F07227",
                border: "1px solid #F07227",
                margin: "0 20px",
              }}
              onClick={downloadImageAsPerFormat}
            >
              Download
            </Button>
          </>
        )} */}

        <Button
          className="btn btn-primary text-capitalize"
          onClick={handleClickOpenSaveDialog}
          variant="outlined"
          style={{
            color: "#F07227",
            border: "1px solid #F07227",
            marginRight: "15px",
            position: "absolute",
            right: 0,
            top: -56,
          }}
          sx={{
            ":hover": {
              bgcolor: "#FCE9E9",
            },
          }}
        >
          Save
        </Button>
      {/* </div> */}

      <div class="panel__top">
        <div class="panel__basic-actions"></div>
        <div class="panel__devices"></div>
        <div class="panel__switcher"></div>
      </div>

      <div class="editor-row">
        <div id="blocks"></div>
        <div class="editor-canvas" style={{ width: `${props.wireFrameRendererHeight}px` }}>
          <div id="gjs"></div>
        </div>
        <div class="panel__right">
          {/* <div class="gjs-pn-panel gjs-pn-views-container gjs-one-bg gjs-two-color"></div> */}
          <div class="layers-container"></div>
          <div class="styles-container"></div>
          <div class="traits-container"></div>
        </div>
      </div>

      <BootstrapDialog onClose={() => setOpen(false)} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Save Changes ?
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>You have unsaved changes, do you want to save modifications ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button className="text-capitalize" autoFocus onClick={updatePage} style={{ background: "#ccc", color: "black", fontWeight: "600" }}>
            Yes
          </Button>
          <Button className="text-capitalize" autoFocus onClick={handleCloseSaveDialog} style={{ background: "red", color: "white", fontWeight: "600" }}>
            No
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* 
            <div class="panel__top">
                <div className="panel__switcher" >

                </div>
                <div className="gjs-panel-action-buttons">
                    <div className="views-actions" style={{ position: "static" }}></div>
                </div>
                <div className="panel-action">

                </div>
            </div>
            <div class="editor-row ml-4 w-100" style={{ height: "100%" }}>
                <div id="blocks" />
                <div class="editor-canvas">
                    <div id="gjs" />
                </div>
                <div class="panel__right" style={builder.panelRight ? { display: 'block' } : { display: 'none' }}>
                    <div id="traits-container" />
                    <div class="layers-container" />
                    <div class="styles-container" />
                </div>
            </div> */}
    </div>
  );
}

export default GrapeJSEditor;
