
function findFocusFileInViewport() {
    var focusFile, fileTopOffset, file;
    var files = getFiles();

    files.forEach(function(file) {
        fileTopOffset = Math.abs(file.el.getBoundingClientRect().top);
        if (!focusFile || (focusFile.topOffset > fileTopOffset && !file.el.parentNode.parentNode.classList.contains('hidden'))) {
            focusFile = {file: file, topOffset: fileTopOffset};
        }
    });
    return focusFile.file;
}

function getFileByTitle(title) {
    if (!title) {
        return null;
    }
    var files = getFiles();
    var focusFile = files.find(function(file) {
        return title === file.title;
    }) || null;
    return focusFile;
}

function saveFocusFile() {
    var key = getPageKey() + "__focusFile";
    var data = {};
    data[key] = findFocusFileInViewport().title;
    chrome.storage.sync.set(data, function () {});
}

function goToFocusFile() {
    var key = getPageKey() + "__focusFile";
    chrome.storage.sync.get(key, function(data) {
        var fileTitle = data[key];
        var file = getFileByTitle(fileTitle);
        if (file) {
            window.location.hash = file.el.parentNode.attributes['data-anchor'].value;
        }
    });
}

var delayedExec = function(after, fn) {
    var timer;
    return function() {
        timer && clearTimeout(timer);
        timer = setTimeout(fn, after);
    };
};

var scrollSaver = delayedExec(500, function() {
    saveFocusFile();
});

document.addEventListener("scroll", scrollSaver);
