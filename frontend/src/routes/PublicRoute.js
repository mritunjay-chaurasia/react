import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
// import CircularProgress from '@mui/material/CircularProgress';
// import Box from '@mui/material/Box';

const PublicRoute = ({ children }) => {
    const location = useLocation();
    const { isSuccess, userInfo } = useSelector((state) => state.user);
    // const landingPageData =  location.state?.data
    const queryParameters = new URLSearchParams(window.location.search)
    const parametersData = queryParameters.has("q") ? queryParameters.get("q") : "";

    let toPath ;
    if(parametersData){
        toPath = `/workOrder?q=${parametersData}`
    }else{
        toPath = (userInfo && userInfo.usertype === "superadmin") ? `/customers${location.search}` : `/workOrder${location.search}`;
    }

    // if (user.isLoading)
    //     return (
    //         <Box sx={{ display: 'flex', width: "100%", justifyContent: "center", alignItems: "center" }}>
    //             <CircularProgress />
    //         </Box>
    //     )

    return (!isSuccess && !userInfo?.id) ? children : <Navigate to={toPath} state={{from: window.location }} />
};

export default PublicRoute;
