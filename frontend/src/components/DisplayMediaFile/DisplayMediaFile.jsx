import React, { useState, useEffect } from 'react';
import FileViewer from 'react-file-viewer';
import { BACKEND_URL } from '../../constants';
import './style.css'
const DisplayMediaFile = ({ commentItem }) => {
  const [taskAttachments, setTaskAttachments] = useState([]);

  useEffect(() => {
    if (commentItem) {
      let mediaToSet = [];

      commentItem.forEach((file) => {
        const fileExtension = file.split('.').pop().toLowerCase();
        mediaToSet.push({
          src: `${BACKEND_URL}/chatImages/${file}`,
          type: fileExtension,
        });
      });

      setTaskAttachments(mediaToSet);
    }
  }, [commentItem]);

  const mediaStyle = {
    width: '100%',
    height: '100%',
  };


  return (
    <div className="thumbnails d-flex flex-wrap">
      {taskAttachments &&
        taskAttachments.length > 0 &&
        taskAttachments.map((file, index) => (
          <div key={index} style={{ width: '100%'}}>
            <div>
              <FileViewer
                fileType={file.type}
                filePath={file.src}
                style={mediaStyle} 
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default DisplayMediaFile;
