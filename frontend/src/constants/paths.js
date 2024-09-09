export const listItem = [
    { "name": "Updates", "path": "/updates", "icon": "ri-refresh-line", "tabMenu": true },
    { "name": "Tasks", "path": "/workOrder", "icon": "ri-todo-line", "tabMenu": true, "subPaths": [{ "name": "Create Task", "path": "/createWorkOrder" }, { "name": "Task details", "path": "/details" },] },
    { "name": "Wiki Page", "path": "/wikiPage", "icon": "ri-global-line", "tabMenu": true },
    { "name": "Project Material", "path": "/project-material", "icon": "ri-briefcase-line", "tabMenu": true },
    // { "name": "Chat (with code)", "path": "/preview", "icon": "ri-chat-3-line", "tabMenu": true },
    // { "name": "Business Docs", "path": "/businessDocumentation", "icon": "ri-briefcase-line", "tabMenu": true },
    // { "name": "Flow Chart", "path": "/flowchart", "icon": "ri-flow-chart", "tabMenu": true },
    // { "name": "Deployment", "path": "/deployment", "icon": "rocket", "tabMenu": true },
    { "name": "Source Code", "path": "/sourceCode", "icon": "ri-code-s-slash-line", "tabMenu": true },
    { "name": "WireFrames", "path": "/wireFrames", "icon": "ri-building-2-line", "tabMenu": true },
];

export const otherItem = [
    // { "name": "Settings", "path": "/settings", "icon": 'ri-settings-2-line', "tabMenu": true },
    { "name": "Repositories", "path": "/integration", "icon": "ri-git-repository-line", "tabMenu": true, "subPaths": [{ "name": "Create Repository", "path": "/createRepo" },] },
    // { "name": "Subscriptions", "path": "/subscription", "icon": "ri-bank-card-2-line", "tabMenu": true },
    // { "name": "Chat History", "path": "/chathistory", "icon": "ri-chat-history-line", "tabMenu": true, "subPaths": [{ "name": "Chat History Details", "path": "/details" },] },
    { "name": "Invite User", "path": "/invite", "icon": "ri-user-add-line", "tabMenu": true },
    { "name": "Backend Builder", "path": "/aiOffice", "icon": "ri-box-3-line", "tabMenu": true },
    { "name": "Support", "path": "/support", "icon": "ri-customer-service-2-line", "tabMenu": true },
    // { "name": "Documentation", "path": "/documentation", "icon": "ri-file-list-line", "tabMenu": true },
    { "name": "My Profile", "path": "/myprofile", "tabMenu": false },
    { "name": "Profile Settings", "path": "/profilesetting", "tabMenu": false },
    { "name": "My Organization", "path": "/myorganization", "tabMenu": false },
    { "name": "Usage", "path": "/usage", "tabMenu": false },
];

export const adminlistItem = [
    { "name": "Users", "path": "/customers", "icon": "ri-user-line", "tabMenu": true, "subPaths": [{ "name": "Customer Details", "path": "/details" },] },
    { "name": "Organizations", "path": "/Organizations", "icon": "ri-organization-chart", "tabMenu": true, "subPaths": [{ "name": "Organization Details", "path": "/details" },{ "name": "Wiki Details", "path": "/details/projectInfo-wiki" }] },
    // {
    //     "name": "User Activity", "path": "", "icon": "ri-user-shared-line", "tabMenu": true, "subTabs": [
    //         { "name": "Chat history", "path": "/userchathistory", "icon": "ri-chat-history-line", "tabMenu": true, "subPaths": [{ "name": "Chat History Details", "path": "/details" },] },
    //         { "name": "User Docs", "path": "/userdocs", "icon": "ri-file-text-line", "tabMenu": true, },
    //         { "name": "Task History", "path": "/workOrder", "icon": "ri-file-text-line", "tabMenu": true, }
    //     ]
    // },
];
