import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const { isLoading, isSuccess, userInfo, userToken } = useSelector((state) => state.user);

    let toPath = `/login${location.search}`;

    if (isLoading && userToken)
        return (
            <Box sx={{ display: 'flex', width: "100%", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        )

    return (isSuccess && userInfo?.id) ? children : <Navigate to={toPath} state={{ from: window.location }} />
};

export default PrivateRoute;