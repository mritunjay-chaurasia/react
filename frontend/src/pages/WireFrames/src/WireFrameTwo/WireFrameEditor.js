import React, { useState, useEffect } from 'react';
import GrapeJSEditor from './GrapeJSEditor';

const dynamicConfiguration = {
  plugin: [
    {
      name: 'grapesjs-blocks-bootstrap4-1',
      //alert will not render
      blocks: { alert: false },
      // layout category will not render
      blockCategories: { },
    },
    {
      name: 'plugin1',
      //alert will not render
      blocks: { },
      // layout category will not render
      blockCategories: { },
    },
  ],
};

const initialAppState = {
  name: "page 1", // remove name field from here
  brand_url: '',
  canonical: null,
  slug: '',
  configuration: dynamicConfiguration,
  inlineCss: true,
  content: {
    html: "",
    css: ""
  }
};


function WireFrameEditor(props) {

    const [initAppData, setData] = useState(initialAppState);
    const { pageData, updatePageSelector } = props;
    const [loading, setLoading] = useState({
      get: false,
      update: false
    });
    const [displayPage, setDisplayPage] = useState(false);
    const [loadingHtmlData, setLoadingHtmlData] = useState(true);
    const [inlineStyles, setInlineStyles] = useState([]);
    // const [htmlToShow, setHtmlToShow] = useState(null);
  
  
    function stringToHtml(htmlString) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString.trim();
      return tempDiv.children[0].outerHTML;
    }
  
  
    function extractInlineStyles(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
    
      const styleObject = {};
    
      // Function to convert CSS style string into an object
      const styleStringToObject = (styleString) => {
        return styleString.split(';').reduce((acc, styleProperty) => {
          if (styleProperty) {
            const [property, value] = styleProperty.split(':').map(item => item.trim());
            if (property && value) {
              acc[property] = value;
            }
          }
          return acc;
        }, {});
      };
    
      // Extract and process elements with IDs
      doc.querySelectorAll('[id]').forEach((el) => {
        const id = el.id;
        const style = el.getAttribute('style');
        if (style) {
          styleObject[`#${id}`] = styleStringToObject(style);
        }
      });
    
      // Extract and process elements with classes
      doc.querySelectorAll('[class]').forEach((el) => {
        el.classList.forEach((className) => {
          // Use the first instance of a class for the style example
          if (!styleObject[`.${className}`]) {
            const style = el.getAttribute('style');
            if (style) {
              styleObject[`.${className}`] = styleStringToObject(style);
            }
          }
        });
      });
    
      return styleObject;
    }
 
    function extractStylesFromStyleTag(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const styleObject = {};
    
      // Extract styles from the <style> tag
      const styleTags = doc.querySelectorAll('style');
      styleTags.forEach(styleTag => {
        const cssText = styleTag.textContent ? styleTag.textContent.trim() : '';
        if (cssText) { // Make sure cssText is not empty
          const rules = cssText.split('}');
          rules.forEach(rule => {
            const trimmedRule = rule.trim();
            if (trimmedRule) {
              const [selector, declaration] = trimmedRule.split('{');
              const styleProperties = declaration.split(';');
              const style = {};
              styleProperties.forEach(prop => {
                const [property, value] = prop.split(':');
                if (property && value) {
                  style[property.trim()] = value.trim();
                }
              });
              const selectors = selector.split(',').map(s => s.trim());
              selectors.forEach(sel => {
                if (!styleObject[sel]) {
                  styleObject[sel] = {};
                }
                Object.assign(styleObject[sel], style);
              });
            }
          });
        }
      });
    
      return styleObject;
    }
    

  
    const convertJsonToJsxLive = () => {
      console.log("htmlElement>>>>>>>>>>>>>>>>>>   wireframeEditor html",props.selectedEditableJsxData)
        // let styleTagStyles = extractInlineStyles(props.selectedEditableJsxData)
        let styleTagStyles = extractStylesFromStyleTag(props.selectedEditableJsxData);
        
        console.log("htmlElement>>>>>>>>>>>>>>>>>>  wireframeEditor  extractedStyle",styleTagStyles)
        if(styleTagStyles && Object.keys(styleTagStyles).length > 0){
          setData({
            ...initialAppState,
            content: {
              ...initialAppState.content,
              html: props.selectedEditableJsxData,
              css: Object.keys(styleTagStyles).map(selector => {
                // Format extracted styles into CSS rules
                const styles = styleTagStyles[selector];
                return `${selector} { ${Object.keys(styles).map(property => `${property}: ${styles[property]};`).join(' ')} }`;
              }).join('\n') // Join all CSS rules into a single string
            }
          });
          setDisplayPage(false);
        }
    };
  
  
    useEffect(() => {
      convertJsonToJsxLive()
      // setDisplayPage(false)
      setLoadingHtmlData(false)
      // setDisplayPage(false)
    }, [])
  
  
    useEffect(() => {
      console.log("useEffect run initAppData", initAppData)
    }, [initAppData])

  return (
    <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center"}}>
    {
      // displayPage && initAppData.name ?
      loadingHtmlData ? <div>Loading...</div> :
      <GrapeJSEditor {...props} data={initAppData} setData={setData} />
    //   <WithGrapesjs {...props} data={initAppData} setData={setData} />
      // :
      // <LoadingIndicator/>
    }
  </div>
  )
}

export default WireFrameEditor
