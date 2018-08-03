var callback = function(details) {
    console.log(details);

    //get ids
    project_id = details.url.match(/(?<=project\/)(.*?)(?=\/|$)/g);
    screen_id = details.url.match(/(?<=screen\/)(.*?)(?=\/|$)/g);
    console.log("pid: "+project_id)
    console.log("sid: "+screen_id)

    //use project or screen url?
    if (project_id != null) {
        if (screen_id != null) {
        app_url = "zpl://screen?sid="+screen_id+"&pid="+project_id; //use screen url
        }
        else {
            app_url = "zpl://project?pid="+project_id ; //use project url
        }
        console.log("redirect: "+app_url);
        return {redirectUrl: app_url }; //Redirect
    } else {
        return //Skip if no project id
    }
};
var filter = { urls: ["https://app.zeplin.io/project/*" ] };
var opt_extraInfoSpec = ["blocking"];

chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);