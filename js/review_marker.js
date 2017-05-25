
function addReviewButton(toolbarEl) {
    if (toolbarEl.classList.contains('has-review-button')) return;
    var reviewBtn = createButton("Start Review", null, addReviewTools);
    toolbarEl.append(reviewBtn);
    toolbarEl.classList.add('has-review-button');
}

function addReviewTools() {
    loadPageIfNotLoaded();
    document.querySelectorAll('.file').forEach(showReviewTools);
    loadReviewData();
}

// function addReviewListener(file) {
//     file.addEventListener('click', function() {
//         console.log(file.id)
//         showReviewTools(file);
//     });
// }

function addCheckboxToElement(el, classnames, listener) {
    if (el.classList.contains('has-review-checkbox')) return;

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.className = "review-marker " + classnames;
    checkbox.addEventListener('change', listener);

    el.appendChild(checkbox);
    el.classList.add('has-review-checkbox');
}

function addCheckboxToCodeBlocks(rows) {
    [].forEach.call(rows, function(row) {
        if (!row.classList.contains('start-review-marker')) return;
        addCheckboxToElement(row, 'sub-review-marker', reviewedCodeBlockListener);
    });
}

function getFileName(el) {
    return el.getElementsByClassName("file-info")[0].getElementsByTagName("a")[0].title;
}

function groupCodeBlocks(rows) {
    var rowNum, rowId, codeDeletion, codeAddition, startRow, endRow, codeBlocks = [], rowIds = [];
    // rows is an html collection, not an array
    [].forEach.call(rows, function(row) {
        [].forEach.call(row.getElementsByClassName("blob-num"), function(blob) {
            if (blob.getAttribute('data-line-number')) {
                rowNum = parseInt(blob.getAttribute('data-line-number'), 10);
                rowId = blob.id;
            }
        });
        codeDeletion = row.getElementsByClassName("blob-code-deletion");
        codeAddition = row.getElementsByClassName("blob-code-addition");
        if (codeAddition.length || codeDeletion.length) {
            if (startRow) {
                endRow = rowNum;
            } else {
                startRow = rowNum;
                endRow = rowNum;
                row.classList.add('start-review-marker');
            }
            rowIds.push(rowId);
        } else if (startRow && endRow) {
            codeBlocks.push({'startRow': startRow, 'endRow': endRow, 'rowIds': rowIds});
            startRow = null;
            endRow = null;
            rowIds = [];
        }
    });
    return codeBlocks;
}

function getCurrentCommit() {
    var commits = document.querySelectorAll(".js-diffbar-commits-list")[0].getElementsByTagName("a");
    var lastCommit = commits[commits.length-1];
    return lastCommit.getAttribute('data-commit');
}

function checkAllChildren(parentCheckbox) {
    var subCheckboxes = parentCheckbox.parentNode.getElementsByClassName("sub-review-marker");
    if (parentCheckbox.checked) {
        [].forEach.call(subCheckboxes, function(checkbox) {
            checkbox.checked = true; 
        });
    } else {
        [].forEach.call(subCheckboxes, function(checkbox) {
            checkbox.checked = false; 
        });
    }
}

function reviewedFileListener() {
    checkAllChildren(this);
    saveReviewData();
}

function reviewedCodeBlockListener() {
    if (!this.checked) {
        var parentCheckbox = this.closest('.file').getElementsByClassName("parent-review-marker")[0];
        parentCheckbox.checked = false;
    }
    saveReviewData();
}

var prFileDiffs = {};
function showReviewTools(file) {
    // add checkbox to the file
    addCheckboxToElement(file, 'parent-review-marker', reviewedFileListener);
    // add checkboxes to the diffs
    var rows = file.getElementsByTagName("tr");
    var groupedDiffs = groupCodeBlocks(rows);
    prFileDiffs[getFileName(file)] = groupedDiffs;
    // console.log(groupedDiffs)
    addCheckboxToCodeBlocks(rows);
}

function getReviewedBlocks() {
    var reviewedCodeByFile = {};
    document.querySelectorAll('.file').forEach(function(file) {
        var parentCheckbox = file.getElementsByClassName('parent-review-marker')[0];
        if (parentCheckbox.checked) {
            var filename = getFileName(file);
            var groupedDiffs = prFileDiffs[filename];
            var rowIds = [];
            groupedDiffs.forEach(function(diff) {
                rowIds = rowIds.concat(diff.rowIds);
            });
            reviewedCodeByFile[filename] = rowIds;
        } else {
            reviewedCodeByFile[filename] = [];
            // check children
            var subCheckboxes = file.getElementsByClassName("sub-review-marker");
            [].forEach.call(subCheckboxes, function(checkbox, index) {
                if (checkbox.checked) {
                    // find rowIds from prFileDiffs
                    reviewedCodeByFile[filename] = reviewedCodeByFile[filename].concat(prFileDiffs[getFileName(file)][index]);
                }
            });
            if (!reviewedCodeByFile[filename].length) {
                delete reviewedCodeByFile[filename];
            }
        }
    });
    return reviewedCodeByFile;
}

function loadReviewedBlocks(reviewedCodeByFile) {
    document.querySelectorAll('.file').forEach(function(file) {
        var filename = getFileName(file);
        if (!(filename in reviewedCodeByFile)) return;
        var groupedDiffs = prFileDiffs[filename];
        var rowIds = [];
        groupedDiffs.forEach(function(diff) {
            rowIds = rowIds.concat(diff.rowIds);
        });
        if (isEqual(reviewedCodeByFile[filename], rowIds)) {
            var parentCheckbox = file.getElementsByClassName('parent-review-marker')[0];
            parentCheckbox.checked = true;
            checkAllChildren(parentCheckbox);
        } else {
            var subCheckboxes = file.getElementsByClassName("sub-review-marker");
            [].forEach.call(subCheckboxes, function(checkbox, index) {
                rowIds = prFileDiffs[getFileName(file)][index];
                var rowIdIndex = reviewedCodeByFile[filename].indexOf(rowIds[0]);
                if (rowIdIndex) {
                    var subArray = reviewedCodeByFile[filename].slice(rowIdIndex, rowIdIndex + rowIds.length);
                    console.log(rowIds)
                    console.log(subArray)
                    if (isEqual(subArray, rowIds)) {
                        checkbox.checked = true;
                    }
                }
            });
        }
    });
}

function saveReviewData() {
    var currentCommit = getCurrentCommit();
    var key = getPageKey() + "__reviewdata";
    var data = {};
    data[key] = getReviewedBlocks();
    chrome.storage.sync.set(data, function () {});
}

function loadReviewData() {
    var key = getPageKey() + "__reviewdata";
    chrome.storage.sync.get(key, function(items) {
        if (items[key]) {
            loadReviewedBlocks(items[key]);
        }
    });
}
