
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
    var linkEl1 = document.querySelector(`a.select-menu-item[href$="${anchorEl1.name}"]`)
    var linkEl2 = document.querySelector(`a.select-menu-item[href$="${anchorEl2.name}"]`)
    swapElements(fileEl1, fileEl2);
    swapElements(anchorEl1, anchorEl2);
    swapElements(linkEl1, linkEl2);
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
    var moveUpEl = createButton("Move up", "Move file up in file order", handleMoveFileUp, ["btn-move-up"]);
    var moveDownEl = createButton("Move down", "Move file down in file order", handleMoveFileDown, ["btn-move-down"]);
    toolbarEl.prepend(moveDownEl);
    toolbarEl.prepend(moveUpEl);
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
        var linkEl = document.querySelector(`a.select-menu-item[href$="${anchorName}"]`)
        fileEl.parentNode.prepend(fileEl);
        anchorEl.parentNode.prepend(anchorEl);
        linkEl.parentNode.prepend(linkEl);
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
