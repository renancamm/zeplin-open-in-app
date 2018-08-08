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
        // Define which id pattern to look for
        var ids = {
            path: {
                project: "project", // project/1234abcd
                screen: "screen"
            },
            query: {
                screen: "sid", // ?sid=1234abcd
                section: "seid",
                tag: "tag",
                component_screen: "coid",
                component_section: "cseid",
            }
        }

        //Get ids from url string with regex match
        for (key in ids.path) {
            var pattern = "(?<=" + ids.path[key] + "\\/)(.*?)(?=\\/|\\?|$)"; // pattern: key/****
            ids.path[key] = details.url.match(new RegExp(pattern, 'g'));
        }

        for (key in ids.query) {
            var pattern = "(?<=\\?" + ids.query[key] + "\\=)(.*?)(?=\\/|\\?|$)"; // pattern: ?key=****
            ids.query[key] = details.url.match(new RegExp(pattern, 'g'));
        }

        // Open an project, screen, section, tag or component view?
        if (ids.path.project) {
            if (ids.path.screen) {
                app_url = "zpl://screen?sid=" + ids.path.screen + "&pid=" + ids.path.project;
            }
            else if (ids.query.screen) {
                app_url = "zpl://screen?sid=" + ids.query.screen + "&pid=" + ids.path.project;
            }
            else if (ids.query.section) {
                app_url = "zpl://project?pid=" + ids.path.project + "&seid=" + ids.query.section;
            }
            else if (ids.query.tag) {
                app_url = "zpl://project?pid=" + ids.path.project + "&tag=" + ids.query.tag;
            }
            else if (ids.query.component_screen) {
                app_url = "zpl://components?pid=" + ids.path.project + "&coids=" + ids.query.component_screen;
            }
            else if (ids.query.component_section) {
                app_url = "zpl://components?pid=" + ids.path.project + "&cseid=" + ids.query.component_section;
            }
            else {
                app_url = "zpl://project?pid=" + ids.path.project;
            }
            closeTab(details.tabId);
            console.log(app_url);
            return { redirectUrl: app_url }  // Redirect with zpl protocol
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
    setTimeout(function () {
        if (tabId) {
            chrome.tabs.remove(tabId, function () { });
        }
    }, 5000)
}





//Triggers

var filter = { urls: ["https://app.zeplin.io/project/*"] };
var opt_extraInfoSpec = ["blocking"];
chrome.webRequest.onBeforeRequest.addListener(requestCallback, filter, opt_extraInfoSpec);
chrome.storage.onChanged.addListener(storageCallback);