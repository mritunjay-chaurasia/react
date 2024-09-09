import React, { useState, useEffect, useRef } from 'react';
import {CircularProgress} from '@mui/material';
import { HTMLToJSON, JSONToHTML } from 'html-to-json-parser';
// import AppContaineer from './containers/App';
import * as WireFramesApi from '../../../api/multipleWireframe.api';
import WireFrameEditor from './WireFrameTwo/WireFrameEditor';

const ManualWireframeEditor = ({selectedId,projectId,setFetchAllWireframeData,onWireframeUpdate, jsonData, setSelectedId,toggleMode,checkedManualChanges,setCheckedManualChanges,setIsManualMode, wireFrameRendererHeight, anyChanges, setAnyChanges,setTotalWireframeLength}) => {
    const [editableJsonData, setEditableJsonData] = useState(jsonData);
    const [editableJsxData, setEditableJsxData] = useState();
    const [loading, setLoading] = useState(true)


    function getAllTopLevelElements(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        
        // Collect the content of all top-level elements
        const content = [];
        for (const node of doc.body.childNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            content.push(node.outerHTML);
          }
        }
        
        return content;
    }


    const updatePage = async (htmlData) => {
            if(selectedId){
                let jsonData = []
                console.log("htmlElement>>>>>>>>>>>>>>>>>>   ManualWireframe  updatePage",htmlData)
                // let htmlDataArr = getAllTopLevelElements(htmlData)
                // console.log("htmlElement>>>>>>>>>>>>>>>>>>   updatePage",htmlDataArr)
                // await Promise.all(htmlDataArr.map(async (element) => {
                //     const convertHTMLtoJSON = await HTMLToJSON(element, true);
                //     jsonData.push(JSON.parse(convertHTMLtoJSON))
                // }));

                const temp = {
                    id:selectedId,
                    projectId:projectId,
                    userSessionWireFrame: htmlData
                  }
                const result = await WireFramesApi.addWireframeScreen({data:[temp],projectId:projectId});
                if(result && result.allData &&  result.allData.length > 0){
                    setFetchAllWireframeData(result.allData)
                    setTotalWireframeLength(result?.length);
                    const response = result.allData.filter(obj => obj.id === selectedId);
                    onWireframeUpdate(response[0].userSessionWireFrame)
                    setSelectedId(response[0].id)
                    toggleMode()  
                }
            
            }

    };

    const convertJsonToJsxLive = async (json) => {
        let dataToSet = [];
        await Promise.all(json.map(async (element) => {
            const html = await JSONToHTML(element, true);
            dataToSet.push(html);
        }));
        if(dataToSet){
            setLoading(false);
            setEditableJsxData(dataToSet.join("\n"));
        }
    };

    useEffect(() => {
        if (editableJsonData && editableJsonData.length > 0) {
            // console.log("htmlElement>>>>>>>>>>>>>>>>>>   1",editableJsonData)
            setLoading(false);
            // convertJsonToJsxLive(editableJsonData);
        }
    }, [editableJsonData]);

    return (

        <>
        {loading ?
        <div className="wireframe-content-load" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </div>
        :
        <div className="manual-editor-container" style={{ width: "100%", height: "100%", display: "flex", justifyContent: "flex-start"}}>

            {editableJsonData && editableJsonData.length > 0 && <WireFrameEditor wireFrameRendererHeight={wireFrameRendererHeight} selectedEditableJsxData={editableJsonData} updatePage={updatePage} checkedManualChanges={checkedManualChanges} setCheckedManualChanges={setCheckedManualChanges} setIsManualMode={setIsManualMode} anyChanges={anyChanges} setAnyChanges={setAnyChanges} />}

        </div>
        }
        </>
    );
};

export default ManualWireframeEditor;
