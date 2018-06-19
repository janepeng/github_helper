
function addButtonsToReviewPage() {
    document.querySelectorAll('.file-actions').forEach(function(element) {
        var viewBtn = element.getElementsByClassName('btn-sm')[0];
        addOrderingButtons(element);
    });
    document.querySelectorAll('.pr-toolbar .diffbar').forEach(addExpandCollapseButtons);
    /**************** review marker starts ******************/
    document.querySelectorAll('.pr-toolbar .diffbar').forEach(addReviewButton);
    /***************** review marker ends *******************/
    addExpandCollapseListener();
    setPageInfo();
}

function callBack(settings) {
    if (settings.reviewHelperFeature == "true") {
        var pageInfo = {};
        addButtonsToReviewPage();
        loadFileOrder();
        loadCollapsedFiles();

        var observer = new MutationObserver(function (mutations) {
            addButtonsToReviewPage();
        });

        var config = { attributes: true, childList: true, characterData: true };

        observer.observe(document.querySelector('#js-repo-pjax-container'), config);

        goToFocusFile();
    }   
}

var supported_settings = ['review_helper_feature'];
load(supported_settings, callBack);

