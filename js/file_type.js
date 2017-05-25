
function parseFileByType(files) {
    /* [{
        title: full_path_of_file,
        id: parent_id_of_file
        }]
        returns:
        types: JS/TXT/PY/JADE, etc
        {
            JS: file_ids_of_JS_type
        }
    */
    var fileByType = {}, fileType;
    files.forEach(function(file) {
        fileType = file.title.split('.').pop().toUpperCase();
        if (!(fileType in fileByType)) {
            fileByType[fileType] = [];
        }
        fileByType[fileType].push(file.id);
    });
    return fileByType;
}

function hideOrShowElement(hide, ids) {
    ids.forEach(function(id) {
        if (hide) {
            document.getElementById(id).classList.remove("hidden");
        } else {
            document.getElementById(id).className += " hidden";
        }
    });
}

function loadPageIfNotLoaded() {
    var fileInfo = document.getElementsByClassName("file-info");
    var numFiles = document.getElementsByClassName("toc-select")[0].getElementsByTagName("strong")[0].innerText;
    if (parseInt(numFiles, 10) != fileInfo.length) {
        document.body.scrollTop = document.body.scrollHeight;
    }
}

function getFilesByType() {
    return parseFileByType(getFiles());
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "files_by_type") {
        loadPageIfNotLoaded();
        var files = getFilesByType();
        sendResponse({"files": JSON.stringify(files)});
    } else if (request.type == "hide_or_show") {
        hideOrShowElement(request.hide, request.ids);
    }
});
