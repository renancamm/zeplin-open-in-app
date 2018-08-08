// Sync with storage on init

var settingEnabled
chrome.storage.sync.get({ settingEnabled: true },
    function (items) {
        settingEnabled = items.settingEnabled;
        updateBadge();
    }
);





// Callbacks

var storageCallback = function (changes, namespace) {
    for (key in changes) {
        settingEnabled = changes[key].newValue;
        updateBadge();
    }
}

var requestCallback = function (details) {
    // Check if is enable
    if (settingEnabled) {

        // Get ids from url string
        project_path_id = details.url.match(/(?<=project\/)(.*?)(?=\/|\?|$)/g);
        screen_path_id = details.url.match(/(?<=screen\/)(.*?)(?=\/|\?|$)/g);
        screen_query_id = details.url.match(/(?<=sid\=)(.*?)(?=\/|\?|$)/g);
        section_query_id = details.url.match(/(?<=seid\=)(.*?)(?=\/|\?|$)/g);
        tag_query_id = details.url.match(/(?<=tag\=)(.*?)(?=\/|\?|$)/g);

        // Open an project, screen, section o tag view?
        if (project_path_id) {
            if (screen_path_id) {
                app_url = "zpl://screen?sid=" + screen_path_id + "&pid=" + project_path_id; // Build screen url
            }
            else if (screen_query_id) {
                app_url = "zpl://screen?sid=" + screen_query_id + "&pid=" + project_path_id; // Build screen url
            }
            else if (section_query_id) {
                app_url = "zpl://project?pid=" + project_path_id + "&seid=" + section_query_id; // Build section url
            }
            else if (tag_query_id) {
                app_url = "zpl://project?pid=" + project_path_id + "&tag=" + tag_query_id; // Build tag url
            }
            else {
                app_url = "zpl://project?pid=" + project_path_id; // Build project url
            }
            closeTab(details.tabId);
            return { redirectUrl: app_url }  // Redirect
        }
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