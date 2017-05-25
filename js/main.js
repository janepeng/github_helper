
var pageInfo = {};
document.querySelectorAll('.file-actions').forEach(addOrderingButtons);
document.querySelectorAll('.pr-toolbar .diffbar').forEach(addExpandCollapseButtons);
addExpandCollapseListener();
setPageInfo();
loadFileOrder();
loadCollapsedFiles();

var observer = new MutationObserver(function (mutations) {
    document.querySelectorAll('.file-actions').forEach(addOrderingButtons);
    document.querySelectorAll('.pr-toolbar .diffbar').forEach(addExpandCollapseButtons);
    addExpandCollapseListener();
    setPageInfo();
});

var config = { attributes: true, childList: true, characterData: true };

observer.observe(document.querySelector('#js-repo-pjax-container'), config);

goToFocusFile();

/**************** review marker starts ******************/
document.querySelectorAll('.pr-toolbar .diffbar').forEach(addReviewButton);
/***************** review marker ends *******************/
