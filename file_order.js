function swapElements(el1, el2) {
    var temp = document.createElement('div');
    el1.parentNode.replaceChild(temp, el1);
    el2.parentNode.replaceChild(el1, el2);
    temp.parentNode.replaceChild(el2, temp);
}

function getPreviousSiblingWhere(el, filter) {
    while (el = el.previousElementSibling) {
        if (filter(el)) return el;
    }
}

function getNextSiblingWhere(el, filter) {
    while (el = el.nextElementSibling) {
        if (filter(el)) return el;
    }
}

function swapFileElements(fileEl1, fileEl2) {
    var anchorEl1 = fileEl1.previousElementSibling;
    var anchorEl2 = fileEl2.previousElementSibling;
    swapElements(fileEl1, fileEl2);
    swapElements(anchorEl1, anchorEl2);
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
