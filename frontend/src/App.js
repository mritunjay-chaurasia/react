import { useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Integration from './pages/Integration/Integration';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './pages/Login/Login';
import Deployment from './pages/Deployment/Deployment';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import Register from './pages/Register/Register';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword';
import ChatHistory from './pages/ChatHistory/ChatHistory';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from './store/user/actions';
import { getOrgDetails } from './store/organization/actions';
import Header from './components/Header/Header';
import 'remixicon/fonts/remixicon.css'
import { light } from './constants/colors';
import Setting from './pages/Settings/Settings';
import Support from './pages/Support/Support';
import Documentation from './pages/Documentation/Documentation';
import ChatDetails from './pages/ChatDetails/ChatDetails';
import MyProfile from './pages/MyProfile/MyProfile';
import ProfileSetting from './pages/ProfileSetting/ProfileSetting';
import Keys from './pages/Keys/Keys';
import { getProjectTools } from './store/projectTool/actions';
import ChangePassword from './pages/ForgetPassword/ChangePassword';
import Organization from './pages/Organization/Organization';
import InviteUser from './pages/InviteUser/InviteUser';
import { socket } from './socket';
import FlowChart from './pages/FlowChart/FlowChart';
import BusinessDocumentation from './pages/BusinessDocumentation/BusinessDocumentation';
import WorkOrder from './pages/WorkOrder/WorkOrder';
// import Customer from './pages/Customer/Customer';
import CustomerDetails from './pages/Customer/CustomerDetails';
import DataTable from './pages/Customer/DataTable';
import UserDocs from './pages/UserDocs/UserDocs';
import SourceCode from './pages/SourceCode/SourceCode';
import WorkOrderHistory from './pages/WorkOrderHistory/WorkOrderHistory';
import CreateWorkOrder from './pages/CreateWorkOrder/CreateWorkOrder';
import AuthorisedGitHub from './pages/AuthGitHub/AuthorisedGitHub';
import AiOffice from './pages/AiOffice/AiOffice';
import WorkOrderDetails from './pages/WorkOrderDetails/WorkOrderDetails';
import CreateRepository from './pages/CreateRepository/CreateRepository';
import * as StripeApi from '../src/api/stripe.api';
import { fetchSubscriptionDetails } from './store/subscription/subscription';
import { showNotification } from './utils/notification';
import { Button } from '@mui/material';
import Usage from './pages/Usage/Usage';
import Subscription from './pages/Subscription/Subscription';
import WireFrames from './pages/WireFrames/WireFrames';
import LandingPage from './pages/LandingPage/LandingPage'
import WikiPage from './pages/WikiPage/WikiPage';
import Organizations from './pages/Admin/Organizations/Organizations';
import OrganizationsDetails from './pages/Admin/Organizations/OrganizationsDetails';
import ProjectInfoAndWiki from './pages/Admin/Organizations/ProjectInfoAndWiki';
import UpdateComments from './pages/UpdateComments/UpdateComments'
import ProjectMaterial from './pages/ProjectMaterial/ProjectMaterial';

export const themeColors = light

function App() {
  const dispatch = useDispatch();
  const { userToken } = useSelector(state => state.user);
  const { selectedProject, selectedOrganization } = useSelector(state => state.orgDetails);
  const { planDetails } = useSelector(state => state.subscription);

  const navigate = useNavigate()

  useEffect(() => {
    if (userToken) {
      dispatch(getCurrentUser());
      dispatch(getOrgDetails());
    }
    socket.on('invitedUserOrgActionChanged', () => {
      dispatch(getOrgDetails());
    })
  }, [dispatch, userToken])

  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(getProjectTools(selectedProject.id));
    }
  }, [dispatch, selectedProject])
  
  useEffect(() => {
    if (selectedOrganization?.id) {
      socket.emit('joinOrgRoom', selectedOrganization.id)
      dispatch(fetchSubscriptionDetails(selectedOrganization.id))
    }
  }, [selectedOrganization]);

  return (
    <div className="app-wrapper" style={{ backgroundColor: themeColors.accentColor }}>
      <Routes>
        <Route index path='/' element={
          <Navigate to='/login' />
          // <LandingPage/>
        } />
        <Route path='/login' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path='/register' element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path='/forgetpassword' element={
          <PublicRoute>
            <ForgetPassword />
          </PublicRoute>
        } />

        <Route path='/changePassword/:id' element={
          <PublicRoute>
            <ChangePassword />
          </PublicRoute>
        } />
        <Route path="/" element={<Sidebar />}>
          <Route path="/" element={<Header />}>
          <Route
              exact
              path="/wireFrames"
              element={
                <PrivateRoute>
                  <WireFrames />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/preview"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/integration"
              element={
                <PrivateRoute>
                  <Integration />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/integration/createRepo"
              element={
                <PrivateRoute>
                  <CreateRepository />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/sourceCode"
              element={
                <PrivateRoute>
                  <SourceCode />
                </PrivateRoute>}
            />
              <Route
              exact
              path="/wikiPage"
              element={
                <PrivateRoute>
                  <WikiPage />
                </PrivateRoute>}
            />
            <Route 
              exact
              path='/project-material'
              element={
                  <PrivateRoute>
                    <ProjectMaterial/>
                  </PrivateRoute>
              }
            />
            {/* <Route
              exact
              path="/integration/keys"
              element={
                <PrivateRoute>
                  <Keys />
                </PrivateRoute>}
            /> */}
            {/* <Route
              exact
              path="/deployment"
              element={
                <PrivateRoute>
                  <Deployment />
                </PrivateRoute>}
            /> */}
            <Route
              exact
              path="/chathistory"
              element={
                <PrivateRoute>
                  <ChatHistory />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/userchathistory"
              element={
                <PrivateRoute>
                  <ChatHistory />
                </PrivateRoute>}
            />
            <Route path="/chathistory/details/:id" element={
              <PrivateRoute>
                <ChatDetails />
              </PrivateRoute>
            } />
            <Route path="/userchathistory/details/:id" element={
              <PrivateRoute>
                <ChatDetails />
              </PrivateRoute>
            } />
            <Route path="/customers/details/:id" element={
              <PrivateRoute>
                <CustomerDetails />
              </PrivateRoute>
            } />

            {/* <Route
              exact
              path="/settings"
              element={
                <PrivateRoute>
                  <Setting />
                </PrivateRoute>}
            /> */}
            <Route
              exact
              path="/support"
              element={
                <PrivateRoute>
                  <Support />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/updates"
              element={
                <PrivateRoute>
                  <UpdateComments />
                </PrivateRoute>}
            />
            {/* <Route
              exact
              path="/documentation"
              element={
                <PrivateRoute>
                  <Documentation />
                </PrivateRoute>}
            /> */}
            <Route
              exact
              path="/myprofile"
              element={
                <PrivateRoute>
                  <MyProfile />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/profilesetting"
              element={
                <PrivateRoute>
                  <ProfileSetting />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/myorganization"
              element={
                <PrivateRoute>
                  <Organization />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/usage"
              element={
                <PrivateRoute>
                  <Usage />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/invite"
              element={
                <PrivateRoute>
                  <InviteUser />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/customers"
              element={
                <PrivateRoute>
                  <DataTable />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/Organizations"
              element={
                <PrivateRoute>
                  <Organizations />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/Organizations/details"
              element={
                <PrivateRoute>
                  <OrganizationsDetails />
                </PrivateRoute>}
            />
             <Route
              exact
              path="/Organizations/details/projectInfo-wiki"
              element={
                <PrivateRoute>
                  <ProjectInfoAndWiki />
                </PrivateRoute>}
            />

            <Route
              exact
              path="/userdocs"
              element={
                <PrivateRoute>
                  <UserDocs />
                </PrivateRoute>}
            />
            {/* <Route
              exact
              path="/flowchart"
              element={
                <PrivateRoute>
                  <FlowChart />
                </PrivateRoute>}
            /> */}
            <Route
              exact
              path="/businessDocumentation"
              element={
                <PrivateRoute>
                  <BusinessDocumentation />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/workOrder"
              element={
                <PrivateRoute>
                  <WorkOrder />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/workOrder/details/:workOrderId"
              element={
                <PrivateRoute>
                  <WorkOrderDetails />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/workOrder/createWorkorder"
              element={
                <PrivateRoute>
                  <CreateWorkOrder />
                </PrivateRoute>}
            />

            <Route
              exact
              path="/WorkOrderHistory"
              element={
                <PrivateRoute>
                  <WorkOrderHistory />
                </PrivateRoute>}
            />
            <Route
              exact
              path="/subscription"
              element={
                <PrivateRoute>
                  <Subscription />
                </PrivateRoute>}
            />

            <Route
              exact
              path="/authorisedGitHub"
              element={
                <PrivateRoute>
                  <AuthorisedGitHub />
                </PrivateRoute>}
            />

            <Route
              exact
              path="/aiOffice"
              element={
                <PrivateRoute>
                  <AiOffice />
                </PrivateRoute>}
            />

          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
