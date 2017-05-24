
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
