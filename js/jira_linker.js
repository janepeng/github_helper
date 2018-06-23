
var supported_settings = ['jira_server'];
var issuePatterns = [/ULTI-\d+/gim, /NU-\d+/gim];
var settings = {};

function loadSettings(response) {
    settings = response;
    linkJIRA();
}

function findAndReplace(element, text) {
    var link;
    issuePatterns.forEach(function(pattern) {
        var matches = text.match(pattern);
        if (!matches) {
            return;
        }
        matches.forEach(function(match) {
            link = '<a href="http://' + settings.jiraServer + '/browse/' + match + '">' + match + '</a>'
            element.innerHTML = element.innerHTML.replace(match, link);
        });
    });
}

function linkJIRA() {
    var prTitle = document.querySelector('h1.gh-header-title .js-issue-title');
    if (prTitle && prTitle.innerHTML) {
        findAndReplace(prTitle, prTitle.innerHTML);
    }

    // pr description is a pr comment as well
    var prComments = document.querySelectorAll('.js-minimizable-comment-group > .comment .edit-comment-hide .comment-body');
    prComments.forEach(function(comment) {
        // comment body could have p, ul
        var paragraphs = comment.querySelectorAll('p');
        paragraphs.forEach(function(paragraph) {
            paragraph.childNodes.forEach(function(element) {
                if (element.nodeType == Node.TEXT_NODE) {
                    findAndReplace(paragraph, element.nodeValue);
                }
            });
        });
    });
}

load(supported_settings, loadSettings);




