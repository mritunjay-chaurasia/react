import React, { useEffect,useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Avatar } from '@mui/material';
import { deepOrange } from "@material-ui/core/colors";
import { BACKEND_URL } from '../../constants';
import Carousel, { Modal, ModalGateway } from "react-images";
const useStyles = makeStyles((theme) =>
  createStyles({
    messageRow: {
      display: "flex"
    },
    messageRowRight: {
      display: "flex",
      justifyContent: "flex-end"
    },
    messageGrey: {
      position: "relative",
      // marginLeft: "20px",
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#e0e0e0",
      width: "fit-content",
      //height: "50px",
      textAlign: "left",
      marginLeft:"10px",
      font: "400 .9em 'Open Sans', sans-serif",
      // border: "1px solid #97C6E3",
      borderRadius: "10px",
      // "&:after": {
      //   content: "''",
      //   position: "absolute",
      //   width: "0",
      //   height: "0",
      //   borderTop: "15px solid #A8DDFD",
      //   borderLeft: "15px solid transparent",
      //   borderRight: "15px solid transparent",
      //   top: "0",
      //   left: "-15px"
      // },
      // "&:before": {
      //   content: "''",
      //   position: "absolute",
      //   width: "0",
      //   height: "0",
      //   borderTop: "17px solid #97C6E3",
      //   borderLeft: "16px solid transparent",
      //   borderRight: "16px solid transparent",
      //   top: "-1px",
      //   left: "-17px"
      // }
    },
    messageOrange: {
      position: "relative",
      marginRight: "20px",
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#f8e896",
      width: "60%",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #dfd087",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #f8e896",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        right: "-15px"
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #dfd087",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        right: "-17px"
      }
    },

    messageContent: {
      padding: 0,
      margin: 0
    },
    messageTimeStampRight: {
      position: "absolute",
      fontSize: ".85em",
      fontWeight: "300",
      marginTop: "10px",
      bottom: "-3px",
      right: "5px"
    },

    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      width: theme.spacing(4),
      height: theme.spacing(4)
    },
    avatarNothing: {
      color: "transparent",
      backgroundColor: "transparent",
      width: theme.spacing(4),
      height: theme.spacing(4)
    },
    displayName: {
      marginLeft: "9px",
      marginRight:"5px",
      color:"black"
    },
    displayDate:{
      fontSize:"12px"
    },
    displayNameAndTime:{
      display:'flex',
      flexDirection:"row",
      alignItems:"center"
    }
  })
);

//avatarが左にあるメッセージ（他人）
export const MessageLeft = (props) => {
  const message = props.message ? props.message : "";
  const timestamp = props.timestamp ? props.timestamp : "";
  const photoURL = props.photoURL ? props.photoURL : "dummy.js";
  const displayUserName = props.displayName ? props.displayName.firstname : "名無しさん";
  const classes = useStyles();
  const [taskAttachments, setTaskAttachments] = useState([]);
  const [taskAttachmentsVideo, setTaskAttachmentsVideo] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  useEffect(()=>{
    if(props?.displayTimeAndImage && props?.displayTimeAndImage?.image){
      let imagesToSet = []
      let videosToSet = []
    
      props?.displayTimeAndImage?.image.forEach(image => {
          let type = identifyLinkType(image)
          console.log('my images :: :: type', type)
          if (type === "image") imagesToSet.push({
              src: `${BACKEND_URL}/chatImages/${image}`,
              width: 1,
              height: 1
          })
          if (type === "video") videosToSet.push({
              src: `${BACKEND_URL}/chatImages/${image}`
          })
      })
      setTaskAttachments(imagesToSet)
      setTaskAttachmentsVideo(videosToSet)
    }
   
  },[props])

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
};

  function identifyLinkType(link) {
    // Regular expressions to match image and video file extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
    const videoExtensions = /\.(mp4|avi|mov|wmv|flv|webm)$/i;

    // Test if the link matches the image or video extensions
    if (imageExtensions.test(link)) {
        return 'image';
    } else if (videoExtensions.test(link)) {
        return 'video';
    } else {
        return 'unknown';
    }
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}


function stringAvatar(name) {
  return {
      sx: {
          bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}`,
  };
}

  function formatDate(dateString) {
    const date = new Date(dateString);
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return `${monthNames[monthIndex]} ${day}, ${year} at ${formattedTime}`;
   }
  return (
    <>
      <div className={classes.messageRow}>
      <Avatar style={{ width: "32px", height: "32px", fontSize: "14px" }} {...stringAvatar(`${props.displayName.firstname} ${props.displayName.lastname}`)} />
        {/* <Avatar
          alt={displayName}
          className={classes.orange}
          src={photoURL}
        ></Avatar> */}
        <div>
          <div className={classes.displayNameAndTime}>
              <div className={classes.displayName}>{displayUserName}</div>
              <div className={classes.displayDate}>{formatDate(props?.displayTimeAndImage?.time)}</div>
          </div>
          <div className={classes.messageGrey}>
            <div>
              <p className={classes.messageContent}>{message}</p>
            </div>
            <div>
            <div className="thumbnails d-flex flex-wrap">
                  {taskAttachments && taskAttachments.length > 0 && taskAttachments.map((image, index) => (
                      <img
                          key={index}
                          src={image.src}
                          alt={`Thumbnail ${index}`}
                          style={{ width: 230, margin: 10, cursor: 'pointer' }}
                          onClick={() => {
                            setCurrentImage(index);
                            setViewerIsOpen(true);
                        }}
                      />
                  ))}


                  {taskAttachmentsVideo && taskAttachmentsVideo.length > 0 && taskAttachmentsVideo.map(video => (
                      <video controls style={{ width: 230, margin: 10 }}>
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
                              views={taskAttachments.map(x => ({
                                  ...x,
                                  srcset: x.srcSet,
                                  caption: x.title
                              }))}
                          />
                      </Modal>
                  ) : null}
              </ModalGateway>             
              
            </div>
            <div className={classes.messageTimeStampRight}>{timestamp}</div>
          </div>
        </div>
      </div>
    </>
  );
};
//avatarが右にあるメッセージ（自分）
export const MessageRight = (props) => {
  const classes = useStyles();
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  return (
    <div className={classes.messageRowRight}>
      <div className={classes.messageOrange}>
        <p className={classes.messageContent}>{message}</p>
        <div className={classes.messageTimeStampRight}>{timestamp}</div>
      </div>
    </div>
  );
};
