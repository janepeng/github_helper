var pageInfo = {};
document.querySelectorAll('.file-actions').forEach(addOrderingButtons);
document.querySelectorAll('.pr-toolbar .diffbar').forEach(addExpandCollapseButtons);
setPageInfo();
loadFileOrder();

var observer = new MutationObserver(function (mutations) {
    document.querySelectorAll('.file-actions').forEach(addOrderingButtons);
    document.querySelectorAll('.pr-toolbar .diffbar').forEach(addExpandCollapseButtons);
    setPageInfo();
});

var config = { attributes: true, childList: true, characterData: true };

observer.observe(document.querySelector('#js-repo-pjax-container'), config);
