
function collapseFileEl(fileEl) {
    fileEl.classList.add('Details--on');
}

function expandFileEl(fileEl) {
    fileEl.classList.remove('Details--on');
}

function collapseAllFiles() {
    document.querySelectorAll('.file').forEach(collapseFileEl);
}

function expandAllFiles() {
    document.querySelectorAll('.file').forEach(expandFileEl);
}

function addExpandCollapseButtons(toolbarEl) {
    if (toolbarEl.classList.contains('has-expand-collapse-buttons')) return;
    var expandEl = createButton("Expand Files", "Expand all files", expandAllFiles);
    var collapseEl = createButton("Collapse Files", "Collapse all files", collapseAllFiles);
    toolbarEl.append(expandEl);
    toolbarEl.append(collapseEl);
    toolbarEl.classList.add('has-expand-collapse-buttons');
}

function getCollapsedFiles() {
    var collapsedFiles = [];
    document.querySelectorAll('.file.Details--on .file-header').forEach(function(file) {
        collapsedFiles.push(file.attributes['data-anchor'].value);
    });
    return collapsedFiles;
}

function addExpandCollapseListener() {
    document.querySelectorAll('.file .js-details-target').forEach(function (toggleEl) {
        if (toggleEl.classList.contains('has-toggle-event-listener')) return;
        toggleEl.addEventListener('click', interceptToggleExpand);
        toggleEl.classList.add('has-toggle-event-listener');
    });
}

function interceptToggleExpand() {
    // Set timeout so that DOM is modified before saving
    setTimeout(saveCollapsedFiles);
}

function saveCollapsedFiles() {
    var key = getPageKey() + "__collapsedfiles";
    var data = {};
    data[key] = getCollapsedFiles();
    chrome.storage.sync.set(data, function () {});
}

function loadCollapsedFiles() {
    var key = getPageKey() + "__collapsedfiles";
    chrome.storage.sync.get(key, function(items) {
        if (items[key]) {
            items[key].forEach(function(anchorName) {
                collapseFileEl(getFileElForDataAnchor(anchorName));
            });
        }
    });
}
