console.log("Init...");
settingsCheckboxObj = document.getElementById('settingsCheckbox')

// Saves options to chrome.storage
function save_options() {
    var settingEnabled = settingsCheckboxObj.checked;
    console.log("Enable web links redirect: " + settingEnabled);
    chrome.storage.sync.set({ settingEnabled: settingEnabled });
}

// Restores select checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    console.log("Restoring settings...");
    chrome.storage.sync.get({
        settingEnabled: true //default = true
    }, function (items) {
        console.log("Storage settings is: " + items.settingEnabled);
        settingsCheckboxObj.checked = items.settingEnabled;
    });
}



document.addEventListener('DOMContentLoaded', restore_options);
settingsCheckboxObj.addEventListener('click', save_options);