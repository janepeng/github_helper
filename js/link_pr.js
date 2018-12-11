
var supported_settings = ['jira_server', 'github_username', 'github_oauth'];
var settings = {};

function sendRequest(url, callback) {
    var xhr = new XMLHttpRequest();
    var clientId = settings.githubUsername;
    var clientSecret = settings.githubOauth;
    var authorizationBasic = window.btoa(clientId + ':' + clientSecret);
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Authorization', 'Basic ' + authorizationBasic);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.addEventListener("load", function(e) {
        callback(xhr.responseText);
    }, false);
    xhr.send();
}

function linkPullRequestUrlsOnPage(urls) {
    console.log(urls)

    // construct elements for jira page, use classes according to their standards
    var div = document.createElement('div');
    div.setAttribute("id", "prsmodule");
    addClasses(div, "module", "toggle-wrap");

    var headerDiv = document.createElement('div');
    headerDiv.setAttribute("id", "prsmodule_heading");
    addClasses(headerDiv, "mod-header");

    var header = document.createElement('h2');
    addClasses(header, "toggle-title");
    header.innerHTML = 'Pull Requests Created';
    headerDiv.appendChild(header);
    div.appendChild(headerDiv);

    var contentDiv = document.createElement('div');
    addClasses(contentDiv, "mod-content");

    var contentList = document.createElement('ul');
    addClasses(contentList, "item-details");

    urls.forEach(function(url) {
        var contentListItem = document.createElement('li');
        var contentListItemLink = document.createElement('a');
        contentListItemLink.innerHTML = url;
        contentListItemLink.setAttribute('href', url);
        contentListItem.appendChild(contentListItemLink);
        contentList.appendChild(contentListItem);
    });
    contentDiv.appendChild(contentList);
    div.appendChild(contentDiv);

    // put div in ui
    var parentSideDiv = document.getElementById('viewissuesidebar');
    if (parentSideDiv) {
        parentSideDiv.insertBefore(div, parentSideDiv.children[1]);
    } else {
        console.log("can't find parent");
    }
}

function linkPullRequestUrlsOnKanbanPage(urls) {
    console.log(urls)

    // construct elements for jira page, use classes according to their standards
    var div = document.createElement('div');
    addClasses(div, "ghx-tab-section");

    var headerDiv = document.createElement('div');
    headerDiv.setAttribute("id", "prsmodule_heading");
    addClasses(headerDiv, "mod-header");

    var header = document.createElement('h4');
    header.innerHTML = 'Pull Requests Created';
    headerDiv.appendChild(header);
    div.appendChild(headerDiv);

    var contentDiv = document.createElement('div');
    addClasses(contentDiv, "ghx-tab-section-content");

    // var contentList = document.createElement('dl');
    // addClasses(contentList, "ghx-detail-list");

    urls.forEach(function(url) {
        var contentListItem = document.createElement('dl');
        addClasses(contentListItem, 'ghx-detail-list');
        var contentListItemLink = document.createElement('a');
        contentListItemLink.innerHTML = url;
        contentListItemLink.setAttribute('href', url);
        contentListItem.appendChild(contentListItemLink);
        contentDiv.appendChild(contentListItem);
    });
    // contentDiv.appendChild(contentList);
    div.appendChild(contentDiv);

    // put div in ui
    var parentSideDiv = document.getElementById('ghx-tab-details');
    if (parentSideDiv) {
        parentSideDiv.insertBefore(div, parentSideDiv.children[2]);
    } else {
        console.log("can't find parent");
    }
}

function refetch(ticketID, kanban) {
    console.log("refetch ", ticketID);

    // construct github url
    var githubURI = "https://api.github.com/search/issues?q=" + ticketID + "+is:pr+in:title";
    sendRequest(githubURI, function (response) {
        response = JSON.parse(response);
        console.log(response)
        // console.log(response.items)
        var pullRequestUrls = [];
        if (response && response.total_count) {
            response.items.forEach(function(item) {
                pullRequestUrls.push(item.html_url);
            });
            if (kanban) {
                linkPullRequestUrlsOnKanbanPage(pullRequestUrls);
            } else {
                linkPullRequestUrlsOnPage(pullRequestUrls);
            }
        }
    });
}

function loadPRinJIRA() {
    // only run this script if you are in JIRA
    var url = new URL(window.location.href);
    var selectedIssue = url.searchParams.get("selectedIssue");
    if (selectedIssue) {
        console.log("Found in selected issue: " + selectedIssue);
        refetch(selectedIssue, true);
    }
}

function checkForJSFinish() {
    if (document.getElementById("ghx-tab-details")) {
        clearInterval(jsInitChecktimer);
        loadPRinJIRA();
        setInterval(detectHashChange, 600);
    }
}

function detectHashChange() {
    if (oldHash != window.location.href) {
        console.log('url changed!');
        oldHash = window.location.href;
        loadPRinJIRA();
    }
}

var jsInitChecktimer;
var oldHash = window.location.href;

load(supported_settings, function(response) {
    settings = response;
    if (window.location.href.startsWith("https://"+settings.jiraServer+"/browse/")) {
        var url = window.location.href.split('/');
        var ticketID = url[url.length-1];
        refetch(ticketID, false);
    } else if (window.location.href.startsWith("https://"+settings.jiraServer+"/secure/RapidBoard.jspa")) {
        jsInitChecktimer = setInterval(checkForJSFinish, 111);
    }
});

