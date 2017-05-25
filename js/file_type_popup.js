
function filterByTypeListener() {
    var ids = this.id.split("+");
    var checkbox = this.getElementsByTagName('input')[0];
    var fileType = this.getAttribute("data-filetype");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"type": "hide_or_show", "hide": checkbox.checked, "ids": ids, "fileType": fileType}, function(){});
    });
}

function parseObjectToCheckboxes(obj, container, listener) {
    // assumes obj key is label
    for (var key in obj) {
        var idComb = obj[key].fileIds.join("+");
        var checkboxGroup = document.createElement('div');
        checkboxGroup.className = "checkbox-list";
        checkboxGroup.id = idComb;
        checkboxGroup.addEventListener('change', listener);
        checkboxGroup.setAttribute("data-filetype", key);

        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = obj[key].show;

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
