
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

var buttons = ['review-helper-enabled', 'review-helper-disabled']
var settings = ['review_helper_feature', 'jira_server', 'github_owner', 'github_repo', 'github_username'];

function toggleButtonState(element) {
    // remove active class for siblings elements
    element.parentNode.childNodes.forEach(function(el) {
        if (el.type == "button") {
            el.classList.remove("active");
        }
    });
    element.classList.add("active");
}

function save(event) {
    toggleButtonState(event.target);
    var userSettings = {};
    settings.forEach(function(setting) {
        var elementId = setting.replace(/_/g, '-');
        var element = document.getElementById(elementId);
        if (element) {
            if (element.type == "text") {
                if (element.value) {
                    userSettings[setting] = element.value;   
                }
            } else if (event.target.getAttribute('value') != null) {
                // its a parent div of a button group
                userSettings[setting] = event.target.getAttribute('value');
            }
        }
    });
    chrome.storage.sync.set(userSettings, function() {
        console.log("saved");
    });
}

function load() {
    chrome.storage.sync.get(settings, function (result) {
        settings.forEach(function(setting) {
            var elementId = setting.replace(/_/g, '-');
            var element = document.getElementById(elementId);
            if (element) {
                if (result[setting]) {
                    if (element.type == "text") {
                        element.value = result[setting];
                    } else {
                        element.childNodes.forEach(function(el) {
                            if (el.type == "button" && el.getAttribute('value') == result[setting]) {
                                el.classList.add("active");
                            }
                        });
                    }
                } else if (!result[setting] && element.type != "text") {
                    // pick default
                    element.childNodes.some(function(el) {
                        if (el.type == "button") {
                            el.classList.add("active");
                            return true;
                        }
                        return false;
                    });
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    load();
    settings.forEach(function(setting) {
        var elementId = setting.replace(/_/g, '-');
        var element = document.getElementById(elementId);
        if (element && element.type == "text") {
            element.addEventListener("change", save);
        }
    });
    buttons.forEach(function(button) {
        var element = document.getElementById(button);
        if (element) {
            element.addEventListener("click", save);
        }
    });
    var tablinks = document.getElementsByClassName("tablinks");
    [].forEach.call(tablinks, function(tab) {
        tab.addEventListener('click', openTab);
    });
});
