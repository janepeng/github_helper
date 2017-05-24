
function save() {
    var githubUsername = document.getElementById('github-username').value;
    chrome.storage.sync.set({'github_username': githubUsername}, function() {
        console.log("saved", githubUsername)
    });
}

function load() {
    chrome.storage.sync.get('github_username', function(result) {
        if (result.github_username) {
            document.getElementById('github-username').value = result.github_username;  
        }
    });
}

function filterByTypeListener() {
    var ids = this.id.split("+");
    var checkbox = this.getElementsByTagName('input')[0];
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"type": "hide_or_show", "hide": checkbox.checked, "ids": ids}, function(){});
    });
}

function parseObjectToCheckboxes(obj, container, listener) {
    /* assumes obj have label
    */
    for (var key in obj) {
        var idComb = obj[key].join("+");
        var checkboxGroup = document.createElement('div');
        checkboxGroup.className = "checkbox-list";
        checkboxGroup.id = idComb;
        checkboxGroup.addEventListener('change', listener);

        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = true;

        var span = document.createElement('span');
        span.htmlFor = key;
        span.appendChild(document.createTextNode(key));

        checkboxGroup.appendChild(checkbox);
        checkboxGroup.appendChild(span);
        container.appendChild(checkboxGroup);
    };
    if (container.hasChildNodes()) {
        var label = document.createElement('label');
        label.className = "sub-header";
        label.appendChild(document.createTextNode("Filter files by type"));
        container.insertBefore(label, container.firstChild);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // chrome.windows.getCurrent(function(window) {
    //     chrome.tabs.query({active: true, windowId: window.id}, function(tabs) {
    //         var currentTabUrl = tabs[0].url.split('/');
    //         if (isGithubPRView(currentTabUrl)) {
    //             var prId = parseInt(currentTabUrl[6], 10);
    //             console.log(prId)
    //         }
    //     });
    // });
    console.log("loaded")

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "files_by_type"}, function(response) {
            if (response.files) {
                var files = JSON.parse(response.files);
                var container = document.getElementById("filer-by-file-type");
                parseObjectToCheckboxes(files, container, filterByTypeListener);
            }
        });
    });
});
