
function openTab() {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    this.classList.add("active");
    document.getElementById(this.getAttribute("name")).classList.add("active");
}

var settings = ['jira_server', 'github_owner', 'github_repo', 'github_username'];

function save() {
    var userSettings = {};
    settings.forEach(function(setting) {
        var elementId = setting.replace('_', '-');
        var element = document.getElementById(elementId);
        if (element) {
            userSettings[setting] = element.value;
        }
    });
    chrome.storage.sync.set(userSettings, function() {
        console.log("saved")
    });
}

function load() {
    chrome.storage.sync.get(settings, function (result) {
        settings.forEach(function(setting) {
            if (result[setting]) {
                var elementId = setting.replace('_', '-');
                var element = document.getElementById(elementId);
                if (element) {
                    element.value = result[setting];
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    load();
    settings.forEach(function(setting) {
        var elementId = setting.replace('_', '-');
        var element = document.getElementById(elementId);
        if (element) {
            element.addEventListener("change", save);
        }
    });
    var tablinks = document.getElementsByClassName("tablinks");
    [].forEach.call(tablinks, function(tab) {
        tab.addEventListener('click', openTab);
    });
});
