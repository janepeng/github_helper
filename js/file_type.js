var fileByType = null;

function parseFileByType(files) {
    /* [{
        title: full_path_of_file,
        id: parent_id_of_file
        }]
        returns:
        types: JS/TXT/PY/JADE, etc
        {
            JS: {fileIds: file_ids_of_JS_type, show: boolean}
        }
    */
    var fileByType = {}, fileType;
    files.forEach(function(file) {
        fileType = file.title.split('.').pop().toUpperCase();
        if (!(fileType in fileByType)) {
            fileByType[fileType] = {fileIds: [], show: true};
        }
        fileByType[fileType].fileIds.push(file.id);
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

function getFilesByType() {
    return parseFileByType(getFiles());
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "files_by_type") {
        loadPageIfNotLoaded();
        fileByType = fileByType || getFilesByType();
        sendResponse({"files": JSON.stringify(fileByType)});
    } else if (request.type == "hide_or_show") {
        fileByType[request.fileType].show = request.hide;
        hideOrShowElement(request.hide, request.ids);
    }
});
