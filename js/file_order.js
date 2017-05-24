
function handleMoveFileUp(e) {
    var fileEl = e.target.closest('.file');
    moveFileUp(fileEl);
    saveFocusFile();
}

function handleMoveFileDown(e) {
    var fileEl = e.target.closest('.file');
    moveFileDown(fileEl);
    saveFocusFile();
}

function swapFileElements(fileEl1, fileEl2) {
    var anchorEl1 = fileEl1.previousElementSibling;
    var anchorEl2 = fileEl2.previousElementSibling;
    swapElements(fileEl1, fileEl2);
    swapElements(anchorEl1, anchorEl2);
    saveFileOrder();
}

function moveFileUp(fileEl) {
    var prevFileEl = getPreviousSiblingWhere(fileEl, function(el) {
        return el.classList.contains('file');
    });
    if (!prevFileEl) return;
    swapFileElements(fileEl, prevFileEl);
}

function moveFileDown(fileEl) {
    var nextFileEl = getNextSiblingWhere(fileEl, function(el) {
        return el.classList.contains('file');
    });
    if (!nextFileEl) return;
    swapFileElements(fileEl, nextFileEl);
}

function addOrderingButtons(toolbarEl) {
    if (toolbarEl.classList.contains('has-ordering-buttons')) return;
    var moveUpEl = createButton("Move up", "Move file up in file order", handleMoveFileUp);
    var moveDownEl = createButton("Move down", "Move file down in file order", handleMoveFileDown);
    toolbarEl.prepend(moveUpEl);
    toolbarEl.prepend(moveDownEl);
    toolbarEl.classList.add('has-ordering-buttons');
}

function getFileOrder() {
    var fileOrder = [];
    document.querySelectorAll('.file-header').forEach(function(file) {
        fileOrder.push(file.attributes['data-anchor'].value);
    });
    return fileOrder;
}

function putFilesInOrder(fileOrder) {
    fileOrder.reverse();
    fileOrder.forEach(function(anchorName) {
        var fileEl = getFileElForDataAnchor(anchorName);
        if (!fileEl) return;
        var anchorEl = document.querySelector(`[name=${anchorName}]`);
        fileEl.parentNode.prepend(fileEl);
        anchorEl.parentNode.prepend(anchorEl);
    });
}

function saveFileOrder() {
    var key = getPageKey() + "__fileorder";
    var data = {};
    data[key] = getFileOrder();
    chrome.storage.sync.set(data, function () {});
}

function loadFileOrder() {
    var key = getPageKey() + "__fileorder";
    chrome.storage.sync.get(key, function(items) {
        if (items[key]) {
            putFilesInOrder(items[key]);
        }
    });
}
