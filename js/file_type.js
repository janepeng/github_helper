

function isGithubPRView(tabUrl) {
    if (!(tabUrl instanceof Array)) {
        tabUrl = tabUrl.split('/');
    }
    // https://github.com/<owner>/<repo>/pull/<id>/files
    return tabUrl.length >= 8 && tabUrl[2] == "github.com" && tabUrl[5] == "pull" && !isNaN(tabUrl[6]) && tabUrl[7] == "files";
}

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

function scrollToBottom() {
   document.body.scrollTop = document.body.scrollHeight;
}

var files = [];
function getFiles() {
    var fileInfo = document.getElementsByClassName("file-info");
    for (var i = 0; i < fileInfo.length; i++) {
        files.push({title: fileInfo[i].children[1].title, id: fileInfo[i].parentNode.parentNode.id});
    }
    files = parseFileByType(files);
}

// var scrollHeight;
// while (scrollHeight != document.body.scrollHeight) {
//     var fileInfo = document.getElementsByClassName("file-info");
//     fileInfo[fileInfo.length-1].scrollTop = document.body.scrollHeight;
//     console.log(scrollHeight, document.body.scrollHeight)
//     scrollHeight = document.body.scrollHeight;
// }

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "files_by_type") {
        scrollToBottom();
        if (isGithubPRView(document.location.toString())) {
            getFiles();
        }
        sendResponse({"files": JSON.stringify(files)});
    } else if (request.type == "hide_or_show") {
        hideOrShowElement(request.hide, request.ids);
    }
});
