import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../../constants";
import Carousel, { Modal, ModalGateway } from "react-images";

const DisplaySlectedFile = ({ commentItem,width }) => {
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [taskAttachments, setTaskAttachments] = useState([]);
  const [taskAttachmentsVideo, setTaskAttachmentsVideo] = useState([]);

  useEffect(() => {
    if (commentItem) {
      let imagesToSet = [];
      let videosToSet = [];
      commentItem?.forEach(async (file) => {
        let type = identifyLinkType(file);
        const fileExtension = file.split(".").pop().toLowerCase();
        switch (type) {
          case "image":
            imagesToSet.push({
              src: `${BACKEND_URL}/chatImages/${file}`,
              width: 1,
              height: 1,
              type: fileExtension,
            });
            break;
          case "video":
            videosToSet.push({
              src: `${BACKEND_URL}/chatImages/${file}`,
              type: fileExtension,
            });
            break;
          default:
            break;
        }
      });
      setTaskAttachments(imagesToSet);
      setTaskAttachmentsVideo(videosToSet);
    }
  }, [commentItem]);
  


  function identifyLinkType(link) {
    const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
    const videoExtensions = /\.(mp4|avi|mov|wmv|flv|webm)$/i;

    if (imageExtensions.test(link)) return "image";
    if (videoExtensions.test(link)) return "video";
    return "unknown";
  }

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  return (
    <>
      <div>
          <div className="thumbnails d-flex flex-wrap">
          {taskAttachments &&
            taskAttachments.length > 0 &&
            taskAttachments.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={`Thumbnail ${index}`}
                style={{ width:width, cursor: "pointer",marginRight:"10px",marginBottom:"10px"}}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage(index);
                  setViewerIsOpen(true);
                }}
              />
            ))}

          {taskAttachmentsVideo &&
            taskAttachmentsVideo.length > 0 &&
            taskAttachmentsVideo.map((video,index) => (
              <video
                key={index}
                controls
                style={{ width:width, cursor: "pointer",marginRight:"10px",marginBottom:"10px"}}
              >
                <source src={video.src} type="video/mp4" />
                <source src="mov_bbb.ogg" type="video/ogg" />
                Your browser does not support HTML video.
              </video>
            ))}
        </div>
        <ModalGateway>
          {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
              <Carousel
                currentIndex={currentImage}
                views={taskAttachments.map((x) => ({
                  ...x,
                  srcset: x.srcSet,
                  caption: x.title,
                }))}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </div>
    </>
  );
};
export default DisplaySlectedFile;
