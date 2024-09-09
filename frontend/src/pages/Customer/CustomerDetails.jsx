import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatBox from '../../components/ChatBox/ChatBox';
import './customerDetails.css';
import * as superAdminApi from '../../api/superAdmin.api';

import userPlaceHolder from '../../assets/images/user_placeholder.png';

function CustomerDetails() {
  const { state } = useLocation();
  const [userOrgDetail, setUserOrgDetail] = useState();
  const [repoCount, setRepoCount] = useState(0);

  console.log("State Got=========================----------------------------===================== ", state);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await superAdminApi.getUserOrgDetailsById(state.id);
        console.log('User Data:', userData);
        setUserOrgDetail(userData);
  
        const allProjectIds = getSelectedUsersProjectIds(userData);
        const repos = await superAdminApi.getAllRepos({ allProjectIds });
        console.log('Repos:', repos);
        setRepoCount(repos.allTools.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  
  }, [state.id]);
  

  const getSelectedUsersProjectIds = (data) => {
    let projectIds = [];

    for (let i = 0; i < data.organizations.length; i++) {
      const selectedOrg = data.organizations[i];

      for (let j = 0; j < selectedOrg.allProjects.length; j++) {
        const selectedProject = selectedOrg.allProjects[j];
        projectIds.push(selectedProject.id);
        
      }      
    }   
    return projectIds;
  }



  return (
    <>
      <div className='Test' style={{ backgroundColor: '#284FA3', width: '100%',height:'37%',color:'white' }}>
          <div style={{ float: 'right', fontSize: '25px', width: '80%',padding:'2rem' }}>
            <div style={{textTransform:'capitalize',color:"black"}}>{state.firstname}</div>
            <div>Email: {state.emailid}</div>
            {/* <div>Phone: {state.phoneno}</div> */}
          </div>
          <img src={userPlaceHolder} style={{ margin:'2%',backgroundColor: 'whitesmoke', padding: '1.5rem', width: '12%', borderRadius: '15%', boxShadow: ` 1px 1px 10px #00000091` }} alt="" srcset="" />

        {/* <div style={{ width: '100%'}} ><span style={{ fontWeight: '900',color:'white' }}>About</span>
          <div style={{ borderRadius: '10px', border: '1px dotted lightgrey', padding: '1rem', fontSize: '17px' ,backgroundColor:'white'}}>
          </div>
        </div> */}
      </div>
      <div className='detailsBar'>

        <div className='customerDetails' >
          {/* <div className='dottedBorder'>
            <b>User Id:</b> {state.id}
          </div> */}
          <div className='dottedBorder'>
            <b>Organization:</b> {
              userOrgDetail && userOrgDetail?.organizations.map((item, index) =>
                // <ul >
                <center><div key={'user_details_' + index}>{item.organizationname}


                </div></center>

                // </ul>
              )
            }
          </div>
          <div className='dottedBorder'>
            <div  className='customerDetailsTitle'>Projects:</div>
            {
              userOrgDetail && userOrgDetail?.organizations.map((item,index) =>
                item.allProjects.map((proj, index) =>
                  <center><div key={'user_details_project' + index}>{proj.projectname}</div></center>

                )
              )
            }
          </div>
          <div className='dottedBorder'>
            <div className='customerDetailsTitle'>No. Of Repositories:</div>
            <center>{repoCount}</center>
          </div>

        </div>
      </div>
    </>
  )
}

export default CustomerDetails;