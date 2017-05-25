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
    if (tooltip) {
        button.setAttribute('aria-label', tooltip);
        addClasses(button, "tooltipped", "tooltipped-nw");
    }
    addClasses(button, "btn", "btn-sm");
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

// PR file

function getFiles() {
    var files = [];
    var fileInfo = document.getElementsByClassName("file-info");
    for (var i = 0; i < fileInfo.length; i++) {
        files.push({title: fileInfo[i].children[1].title, id: fileInfo[i].parentNode.parentNode.id, el: fileInfo[i]});
    }
    return files;
}

// github only loads the first section of diffs, a bunch of them are hidden
// we want to compare the file count at the top of the page, versus the files we get from the dome
// if they are equal, then the whole diff is loaded, otherwise, scroll to bottom of the page to load everything
function loadPageIfNotLoaded() {
    var files = document.getElementsByClassName("file");
    var numFiles = document.getElementsByClassName("toc-select")[0].getElementsByTagName("strong")[0].innerText;
    if (parseInt(numFiles, 10) != files.length) {
        document.body.scrollTop = document.body.scrollHeight;
    }
}

function isEqual(a, b) {
    if (!a || !b || a.length != b.length) return false;
    var identical = true;
    a.forEach(function(item, index) {
        identical = identical && (item == b[index]);
    });
    return identical;
}
