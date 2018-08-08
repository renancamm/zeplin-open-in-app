settingsCheckboxObj = document.getElementById('settingsCheckbox')

// Saves options to chrome.storage
function save_options() {
    var settingEnabled = settingsCheckboxObj.checked;
    chrome.storage.sync.set({ settingEnabled: settingEnabled });
}

// Restores select checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        settingEnabled: true //default = true
    }, function (items) {
        settingsCheckboxObj.checked = items.settingEnabled;
    });
}

// Triggers
document.addEventListener('DOMContentLoaded', restore_options);
settingsCheckboxObj.addEventListener('click', save_options);