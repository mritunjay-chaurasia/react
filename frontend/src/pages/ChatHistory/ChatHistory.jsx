import * as React from "react";
import { useEffect, useState } from "react";
import "./chathistory.css";
import Button from "@mui/material/Button";
import * as ChatHistoryApi from "../../api/chathistory.api";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "../../components/DataTable/DataTable";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CustomComponent = ({ item }) => {
  return (
    <Link to={`details/${item.id}`} state={item}>
      <Button
        className="text-capitalize"
        variant="contained"
        style={{
          background: "#F07227",
          borderRadius: "5px",
          width: "108px",
          height: "41px",
        }}
      >
        <i
          className="ri-eye-line"
          style={{
            fontSize: "18px",
            marginRight: "8px",
          }}
        ></i>
        <span>View</span>
      </Button>
    </Link>
  )
}

function ChatHistory() {
  const orgDetails = useSelector((state) => state.orgDetails);
  const { usertype } = useSelector(state => state.user.userInfo);

  const [chatHistoryData, setChatHistoryData] = useState([]);
  const [page, setPage] = useState(localStorage.getItem('chatHistoryPage') ? localStorage.getItem('chatHistoryPage') : 1);
  const [limit, setLimit] = useState(localStorage.getItem('chatHistoryLimit') ? localStorage.getItem('chatHistoryLimit') : 10);
  const [searchText, setSearchText] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  let tableHeadings = usertype === "superadmin" ? ["Session Id", "Date", "Customer Name", "Email", "Phone No", "Project", "Action"]
    : ["Session Id", "Date and Time", "Visitor Name", "Visitor Email", "Visitor Phone No","Action"]

  const convertdateFormat = (dateValue) => {
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formattedDate = new Date(dateValue).toLocaleDateString(
      "en-US",
      options
    );
    let dateAndMonth = formattedDate.split(",")[1];
    dateAndMonth = dateAndMonth.trim();
    let month = dateAndMonth.split(" ")[0];
    let date = dateAndMonth.split(" ")[1];
    let year = formattedDate.split(",")[2];
    return `${date} ${month} ${year}, ${new Date(
      dateValue
    ).toLocaleTimeString()}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (orgDetails?.selectedProject?.id) {
          const response = await ChatHistoryApi.getChatHistory({
            projectId: orgDetails.selectedProject.id,
            page: page,
            limit: limit,
            searchText: searchText,
          });
          if (response && response?.status) {
            console.log('chatHistory', response.chatHistory)
            const formattedData = response && response?.chatHistory && response.chatHistory.map((item) => {
              let finalObject = {
                sessionId: item.sessionId,
                createdAt: convertdateFormat(item.createdAt),
                userName: usertype === "superadmin" ? `${item?.ownerdetails?.firstname}` : item?.userDetails?.name ? item.userDetails.name : "---",
                userEmail: usertype === "superadmin" ? item?.ownerdetails.emailid : item?.userDetails?.email ? item.userDetails.email : "---",
                project: item?.project
              }
              if (usertype !== "superadmin") {
                delete finalObject['project'];
              }
              finalObject.customComponent = <CustomComponent item={item} />;
              return finalObject;
            });
  
            setChatHistoryData(formattedData);
            setTotalPages(response.totalPage);
            if (response.totalPage < page) setPage(1)
          }
        }
      } catch (error) {
        // Handle error here
        console.error('Error fetching chat history:', error);
      }
    };
  
    fetchData();
  
  }, [page, orgDetails, searchText, limit]);
  


  useEffect(() => {
    // Store page and limit in localStorage
    localStorage.setItem("chatHistoryPage", page);
    localStorage.setItem("chatHistoryLimit", limit);
  }, [page, limit]);


  return (
    <>
      <div className="chatHistoryPage">
        <div className="chatHistoryContainer">
          <div className="chatHistoryHeader">
            <span>Full Chat History</span>
            <div className="d-flex">
              <FormControl sx={{ mr: 2 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Limit</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={limit}
                  onChange={((e) => setLimit(e.target.value))}
                  autoWidth
                  label="Limit"
                  style={{ height: "40px" }}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
              <div className="chatHistorySearchBar">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <i className="ri-search-line"></i>
              </div>
            </div>
          </div>
          <DataTable tableHeadings={tableHeadings} tabledata={chatHistoryData} />
          <div className="chatHistoryTablePagination">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                variant="outlined"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    "&.Mui-selected": {
                      background: "#284FA3",
                      color: "white",
                    },
                  }
                }
                }
                page={Number(page)}
                onChange={(event, page) => setPage(page)}
              />
            </Stack>
          </div>
        </div>
      </div>
    </>
  );
}
export default ChatHistory;
