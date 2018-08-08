//Sync with storage on init

var settingEnabled
chrome.storage.sync.get({ settingEnabled: true },
    function (items) {
        settingEnabled = items.settingEnabled;
        updateBadge();
    }
);





//Callbacks

var storageCallback = function (changes, namespace) {
    for (key in changes) {
        settingEnabled = changes[key].newValue;
        console.log("Updated settings: " + settingEnabled);
        updateBadge();
    }
}

var requestCallback = function (details) {
    console.log(details);
    //check if is enable
    if (settingEnabled) {
        console.log("settingEnable is on: " + settingEnabled);

        //get ids from url string
        project_id = details.url.match(/(?<=project\/)(.*?)(?=\/|\?|$)/g);
        screen_id = details.url.match(/(?<=screen\/)(.*?)(?=\/|\?|$)/g);
        section_id = details.url.match(/(?<=seid\=)(.*?)(?=\/|\?|$)/g);

        console.log("pid: " + project_id)
        console.log("sid: " + screen_id)
        console.log("seid: " + section_id)

        //use project or screen url?
        if (project_id) {
            if (screen_id) {
                app_url = "zpl://screen?sid=" + screen_id + "&pid=" + project_id; //use screen url
            }
            else if (section_id) {
                app_url = "zpl://project?pid=" + project_id + "&seid=" + section_id; //use section url
            }
            else {
                app_url = "zpl://project?pid=" + project_id; //use project url
            }
            console.log("redirect: " + app_url);
            closeTab(details.tabId);
            return { redirectUrl: app_url }  //redirect
        } else {
            return //skip if no project id
        }
    } else {
        console.log("settingEnable is off: " + settingEnabled);
    }
};





//Utils

function updateBadge() {
    if (settingEnabled) {
        chrome.browserAction.setBadgeText({ text: "" });
    } else {
        chrome.browserAction.setBadgeText({ text: "✕" });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#da1616" });
    }

}

function closeTab(tabId) {
    setTimeout(function () { chrome.tabs.remove(tabId, function () { }); }, 5000)
}





//Triggers

var filter = { urls: ["https://app.zeplin.io/project/*"] };
var opt_extraInfoSpec = ["blocking"];
chrome.webRequest.onBeforeRequest.addListener(requestCallback, filter, opt_extraInfoSpec);
chrome.storage.onChanged.addListener(storageCallback);