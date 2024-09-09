import { createSlice } from "@reduxjs/toolkit";
import { addOrganization, getOrgDetails } from "./actions";

const initialState = {
  organizations: [],
  selectedOrganization: {},
  selectedProject: {},
  invites: [],
  isLoading: true,
  isSuccess: false,
  errorMessage: "",
};

export const orgSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    switchOrg: (state, { payload }) => {
      let foundOrg = state.organizations.find(
        (item) => item.id.toString() === payload.toString()
      );
      state.selectedOrganization = foundOrg;
      state.selectedProject = foundOrg.allProjects[0];
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      localStorage.setItem("selectedOrg", foundOrg.id);
      localStorage.setItem("selectedProject", foundOrg.allProjects[0].id);
    },
    switchProject: (state, { payload }) => {
      let projectFound = state.selectedOrganization.allProjects.find(
        (item) => item.id.toString() === payload.toString()
      );
      state.selectedProject = projectFound;
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      localStorage.setItem("selectedProject", projectFound.id)
    },
    insertProject: (state, { payload }) => {
      state.selectedProject = payload;
      state.selectedOrganization = { ...state.selectedOrganization, allProjects: [...state.selectedOrganization.allProjects, payload] };
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      localStorage.setItem("selectedProject", payload.id)
    },
    deleteProject: (state, { payload }) => {
      let newAllProjects = state.selectedOrganization.allProjects.filter(pr => pr.id !== payload)
      state.selectedOrganization = { ...state.selectedOrganization, allProjects: newAllProjects };
      state.selectedProject = newAllProjects[0];
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      localStorage.setItem("selectedProject", payload.id)
    },
    deleteOrganization: (state, { payload }) => {
      let newAllOrgs = state.organizations.filter(org => org.id !== payload)
      state.organizations = newAllOrgs;
      state.selectedOrganization = newAllOrgs[0];
      state.selectedProject = newAllOrgs[0].allProjects[0];
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      localStorage.setItem("selectedOrg", newAllOrgs[0].id);
      localStorage.setItem("selectedProject", newAllOrgs[0].allProjects[0].id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrgDetails.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrgDetails.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      state.organizations = payload.organizations;
      state.invites = payload.allInvites;
      state.selectedProject = payload.organizations[0].allProjects[0];

      let firstOrg = payload.organizations[0];
      let firstProject = payload.organizations[0].allProjects[0];

      let selectedOrg = localStorage.getItem('selectedOrg');
      let selectedProject = localStorage.getItem('selectedProject');
      if (selectedOrg) {
        let orgFound = payload.organizations.find(item => item.id.toString() === selectedOrg.toString());
        if (orgFound) {
          state.selectedOrganization = orgFound;
          if (selectedProject) {
            let projectFound = orgFound.allProjects.find(item => item.id.toString() === selectedProject.toString());
            if (projectFound) state.selectedProject = projectFound;
            else {
              state.selectedProject = orgFound.allProjects[0];
              localStorage.setItem("selectedProject", orgFound.allProjects[0].id)
            }
          } else {
            state.selectedProject = orgFound.allProjects[0];
            localStorage.setItem("selectedProject", orgFound.allProjects[0].id)
          }
        } else {
          localStorage.setItem("selectedOrg", firstOrg.id);
          localStorage.setItem("selectedProject", firstProject.id);
          state.selectedOrganization = firstOrg;
          state.selectedProject = firstProject;
        }
      } else {
        localStorage.setItem("selectedOrg", firstOrg.id);
        localStorage.setItem("selectedProject", firstProject.id);
        state.selectedOrganization = firstOrg;
        state.selectedProject = firstProject;
      }
    });
    builder.addCase(getOrgDetails.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    });
    builder.addCase(addOrganization.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addOrganization.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      state.organizations = [...state.organizations, payload.organization];
      state.selectedOrganization = payload.organization;
      state.selectedProject = payload.organization.allProjects[0];
      localStorage.setItem("selectedOrg", payload.organization.id);
      localStorage.setItem("selectedProject", payload.organization.allProjects[0].id);
    });
    builder.addCase(addOrganization.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    });
  },
});

export const { switchOrg, switchProject, insertProject, deleteProject, deleteOrganization } = orgSlice.actions;

export default orgSlice.reducer;
