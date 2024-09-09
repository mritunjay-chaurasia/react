import {
  Avatar
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import * as WorkOrderListApi from "../../../../api/worklist.api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './HistoryDetails.css'
import DisplaySlectedFile from "../../../../pages/UpdateComments/DisplaySlectedFile";

function HistoryDetails({ workOrderId }) {
  const [historyDetails, setHistoryDetails] = useState([]);

  let taskHourskey = [
    "estAnlHrs",
    "estDevHrs",
    "estQAHrs",
    "actAnlHrs",
    "actDevHrs",
    "actQAHrs",
  ];

  let allKeyAndLabel = {
    estAnlHrs: "Est Analysis Hrs",
    estDevHrs: "Est Dev Hrs",
    estQAHrs: "Est QA Hrs",
    actAnlHrs: "Act Analysis Hrs",
    actDevHrs: "Act Dev Hrs",
    actQAHrs: "Act QA Hrs",
    assignedTo: "Assignee",
    createdBy: "Reporter",
    principalArchitect: "Principal Architect",
    qaLead: "QA Lead",
    draft: "Draft",
    sentToDev: "Sent To Developer",
    inProgress: "In Progress",
    rejected: "Rejected",
    todo: "ToDo",
    reopened: "Reopened",
    qa: "QA",
    codeReview: "Code Review",
    readyToRelease: "Ready To Release",
    realeaseApproved: "Realease Approved",
    released: "Released",
    tester: "Tester",
    developer: "Developer",
    status: "Status"
  };

  useEffect(() => {
    const fetchData = async () => {
      if (workOrderId) {
        console.log("workOrderId :: ::", workOrderId);
        try {
          const response = await WorkOrderListApi.getWorkOrderHistory(
            workOrderId
          );
          console.log("response :: ::", response);
          setHistoryDetails(response?.workOrderHistory);
        } catch (error) {
          setHistoryDetails([]);
        }
      }
    };

    fetchData();
  }, [workOrderId]);
  useEffect(() => {
    console.log("historyDetails :: ::", historyDetails);
  }, [historyDetails]);

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function parseDetail(detail) {
    let fromKey, fromValue, toKey, toValue;

    const parseStringValue = (str) => {
      let key, value;
      try {
        const obj = JSON.parse(str);
        key = Object.keys(obj)[0];
        value = obj[key];
      } catch (error) {
        key = "";
        value = str;
      }
      return { key, value };
    };

    fromValue = detail.from ?? "None";
    toValue = detail.to ?? "None";

    // fromValue = "None";
    // toValue = "None";

    // // Parsing 'from' property
    // if (typeof detail.from === "string") {
    //   const { key, value } = parseStringValue(detail.from);
    //   fromKey = key || "None";
    // } else {
    //   fromKey = "None";
    //   fromValue = detail.from;
    // }

    // // Parsing 'to' property
    // if (typeof detail.to === "string") {
    //   const { key, value } = parseStringValue(detail.to);
    //   toKey = key || "to";
    //   toValue = value;
    // } else {
    //   toKey = "to";
    //   toValue = detail.to;
    // }

    return { fromKey, fromValue, toKey, toValue };
  }

  function extractTextBetweenTags(htmlString) {
    if (!htmlString) return htmlString
    const pattern = /<p>(.*?)<\/p>/;
    const match = htmlString.match(pattern);
    if (match) {
      // Remove any HTML tags from the extracted text
      const textWithoutTags = match[1].replace(/<\/?[^>]+(>|$)/g, "");
      return textWithoutTags;
    } else {
      return htmlString;
    }
  }

  return (
    <>
      {historyDetails && historyDetails.length > 0 ? (
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            color: "rgb(23, 43, 77)",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            marginBottom: "0px",
            marginLeft: "0px",
            marginRight: "0px",
            marginTop: "8px",
            padding: "0px",
            textAlign: "start",
          }}
        >
          <div data-testid="comment-base-item-14752">
            <div style={{ display: "flex", gap: "15px" }}>
              <div
                style={{
                  gridArea: "comment-area",
                  margin: "0px",
                  minWidth: "0px",
                  overflowWrap: "break-word",
                  paddingBottom: "0px",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  paddingTop: "2px",
                  width: "80%",
                }}
              >
                <div
                  style={{
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    justifyContent: "stretch",
                    margin: "0px",
                    padding: "0px",
                  }}
                >
                  <div
                    style={{
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      justifyContent: "stretch",
                      margin: "0px",
                      padding: "0px",
                    }}
                  >
                    {historyDetails && historyDetails.length > 0 && historyDetails.map((detail, index) => {
                      let parsedDetail;
                      const isDescription = false;
                      console.log(
                        "parsedDetailparsedDetailparsedDetail before parse",
                        detail
                      );
                      if (taskHourskey.includes(detail.change)) {
                        parsedDetail = parseDetail(detail);
                        console.log(
                          "parsedDetailparsedDetailparsedDetail after parse",
                          parsedDetail
                        );
                      } else if (detail.change === "description" || detail.change === "taskName" || detail.change === "comments") {
                        parsedDetail = {
                          fromKey: "description",
                          fromValue: "description",
                          toKey: "description",
                          toValue: "description",
                        };
                        parsedDetail.toValue = (
                          <div>
                              <ReactQuill
                                  style={{ border: 'unset', display: 'flex' }}
                                  className="ReactQuill"
                                  theme="snow"
                                  value={detail.to?.text ? detail.to?.text : detail.to}
                                  readOnly={true}
                                  placeholder="description..."
                                  modules={{
                                      toolbar: [], // Empty array to remove all toolbar options
                                  }}
                              />
                              <DisplaySlectedFile width={"150px"} commentItem={detail.to?.mediaFiles}/>
                          </div>
                      );
                          
                      parsedDetail.fromValue = (
                        <div>
                            <ReactQuill
                                style={{ border: 'unset' }}
                                className="ReactQuill"
                                theme="snow"
                                value={detail.from?.text ? detail.from?.text : detail.from}
                                readOnly={true}
                                placeholder="description..."
                                modules={{
                                    toolbar: [], // Empty array to remove all toolbar options
                                }}
                            />
                            <DisplaySlectedFile width={"150px"} commentItem={detail.from?.mediaFiles}/>
                        </div>
                    );

                      } else if (detail.change === "status") {
                        parsedDetail = {
                          fromKey: "status",
                          fromValue: "status",
                          toKey: "status",
                          toValue: "status",
                        };
                        parsedDetail.toValue = allKeyAndLabel[detail.to];
                        parsedDetail.fromValue = allKeyAndLabel[detail.from];
                      } else if (
                        detail.change === "qaLead" ||
                        detail.change === "assignedTo" ||
                        detail.change === "createdBy" ||
                        detail.change === "principalArchitect" ||
                        detail.change === "developer" ||
                        detail.change === "tester"
                      ) {
                        parsedDetail = {
                          fromKey: detail.change,
                          fromValue: detail.fromUUidDetails ? `${detail.fromUUidDetails.firstname} ${detail.fromUUidDetails.lastname}` : "None",
                          toKey: detail.change,
                          toValue: detail.toUUidDetails ? `${detail.toUUidDetails.firstname} ${detail.toUUidDetails.lastname}` : "None",
                        };
                      } else {
                        parsedDetail = {
                          fromKey: "test",
                          fromValue: "test",
                          toKey: "test",
                        };
                      }

                      return (
                        <div
                          key={index}
                          style={{
                            marginBottom: "16px",
                            border: "1px solid #E5E5E5",
                            borderRadius: "8px",
                            padding: "16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            <div>
                              <Avatar
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  fontSize: "14px",
                                }}
                                {...stringAvatar(
                                  `${detail.updatedByUser.firstname} ${detail.updatedByUser.lastname}`
                                )}
                              />
                            </div>
                            <div>
                              <span
                                style={{
                                  color: "black",
                                  fontWeight: 400,
                                  fontSize: "14px",
                                  cursor: "pointer",
                                }}
                              >
                                {detail.updatedByUser.firstname}{" "}
                                {detail.updatedByUser.lastname}{" "}
                                <b>{detail.change === "images"
                                  ? "added an attachment"
                                  : "changed " + allKeyAndLabel[detail.change] ? allKeyAndLabel[detail.change] : detail.change}</b>
                                {" ("}
                                {moment(detail?.updatedAt).fromNow()}
                                {" )"}
                              </span>
                            </div>
                            <span
                              style={{
                                color: "#42526E",
                                fontSize: "14px",
                                flex: "1",
                                overflowWrap: "break-word",
                              }}
                            >
                              {detail.content}
                            </span>
                          </div>
                          {detail.change !== "images" && (
                            <div
                              style={{
                                paddingLeft: "40px",
                                color: "#42526E",
                                fontSize: "14px",
                                display: 'flex',
                                flexDirection:"column"
                                // flexDirection: (detail.change === "description" && (detail.to.length > 20 || detail.from.length > 20)) ? 'column' : 'row',
                              }}
                            >
                              <div>
                                {`from `}
                                <strong>{parsedDetail.fromValue || "None"}</strong>
                              </div>
                              <div>
                                {` to `}
                                <strong>{parsedDetail.toValue || "None"}</strong>
                              </div>
                            </div>


                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>no history avilable</div>
      )}
    </>
  );
}

export default HistoryDetails;
