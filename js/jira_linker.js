
var supported_settings = ['jira_server', 'jira_prefix'];
var regex;
var settings = {};

function loadSettings(response) {
    settings = response;
    regex = new RegExp(settings.jiraPrefix + '\\d+', "gim");
    linkJIRA();
}

function findAndReplace(element, text) {
    var link;
    var matches = text.match(regex);
    if (!matches) {
        return;
    }
    matches.forEach(function(match) {
        link = '<a href="http://' + settings.jiraServer + '/browse/' + match + '">' + match + '</a>'
        element.innerHTML = element.innerHTML.replace(match, link);
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




