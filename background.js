var settingEnabled
chrome.storage.sync.get({ settingEnabled: true },
    function (items) {
        settingEnabled = items.settingEnabled;
        updateBadge();
    }
);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        settingEnabled = changes[key].newValue;
        console.log("Updated settings: " + settingEnabled);
        updateBadge();
    }
});

function updateBadge() {
    if (settingEnabled) {
        chrome.browserAction.setBadgeText({text: ""});
    } else {
        chrome.browserAction.setBadgeText({text: "✕"});
        chrome.browserAction.setBadgeBackgroundColor({color: "#da1616"});
    }

}


var callback = function (details) {
    console.log(details);
    if (settingEnabled) {
        console.log("settingEnable is on: " + settingEnabled);

        //get ids from url string
        project_id = details.url.match(/(?<=project\/)(.*?)(?=\/|\?|$)/g);
        screen_id = details.url.match(/(?<=screen\/)(.*?)(?=\/|\?|$)/g);
        console.log("pid: " + project_id)
        console.log("sid: " + screen_id)

        //use project or screen url?
        if (project_id != null) {
            if (screen_id != null) {
                app_url = "zpl://screen?sid=" + screen_id + "&pid=" + project_id; //use screen url
            }
            else {
                app_url = "zpl://project?pid=" + project_id; //use project url
            }
            console.log("redirect: " + app_url);
            setTimeout(function(){ chrome.tabs.remove(details.tabId, function() { }); }, 5000)
            return { redirectUrl: app_url }  //Redirect
        } else {
            return //Skip if no project id
        }
    } else {
        console.log("settingEnable is off: " + settingEnabled);
    }
};

var filter = { urls: ["https://app.zeplin.io/project/*"] };
var opt_extraInfoSpec = ["blocking"];

chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);