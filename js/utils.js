// DOM Manipulation

function swapElements(el1, el2) {
    var temp = document.createElement('div');
    el1.parentNode.replaceChild(temp, el1);
    el2.parentNode.replaceChild(el1, el2);
    temp.parentNode.replaceChild(el2, temp);
}

function addClasses(el, ...classes) {
    classes.forEach(className => el.classList.add(className));
}

// DOM Traversing

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

function getFileElForDataAnchor(anchorName) {
    var headerEl = document.querySelector(`[data-anchor=${anchorName}]`);
    return headerEl ? headerEl.closest('.file') : null;
}

// Element Creation

function createButton(text, tooltip, action) {
    var button = document.createElement('a');
    button.innerHTML = text;
    button.setAttribute('aria-label', tooltip);
    addClasses(button, "btn", "btn-sm", "tooltipped", "tooltipped-nw");
    button.addEventListener('click', action);
    return button;
}

// Location page info

function setPageInfo() {
    var filesRE = /([\w-]+)\/([\w-]+)\/pull\/(\d+)\/files/g;
    var commitsRE = /([\w-]+)\/([\w-]+)\/pull\/(\d+)\/commits\/(\w+)/g;
    var path = window.location.pathname;
    var matches = filesRE.exec(path) || commitsRE.exec(path);
    if (matches) {
        pageInfo = {
            owner: matches[1],
            repo: matches[2],
            pr: matches[3],
            sha: matches[4]
        };
    } else {
        pageInfo = {};
    }
}

function getPageKey() {
    var key = `${pageInfo.owner}::${pageInfo.repo}::${pageInfo.pr}`;
    if (pageInfo.sha) {
        key += `::${pageInfo.sha}`;
    }
    return key;
}
