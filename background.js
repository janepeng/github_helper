
var supported_settings = ['jira_server', 'github_owner', 'github_repo', 'github_username'];
var settings = {};

function loadSettings(response) {
    settings = response;
    console.log(settings)
}

load(supported_settings, loadSettings);

var githubUrl, githubPRUrl;
var loading = true;
function constructGithubUrl() {
    if (!loading) {
        return;
    }
    if (settings.githubOwner && settings.githubRepo) {
        githubUrl = "https://github.com/" + settings.githubOwner + "/" + settings.githubRepo + "/pulls/";
        githubPRUrl = "https://github.com/" + settings.githubOwner + "/" + settings.githubRepo + "/pull/";
    }
    loading = false;
}

var suggestions = [];

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
        constructGithubUrl();
        suggestions = [];
        var urls = [];
        if (isNaN(text)) {
            if (settings.jiraServer && text.substr(0, 3).toLowerCase() == 'nu-') {
                urls.push("https://" + settings.jiraServer + "/browse/" + text);
            } else if (githubUrl) {
                if (settings.githubUsername && settings.githubUsername.indexOf(text) > -1) {
                    urls.push(githubUrl + settings.githubUsername);
                } else {
                    urls.push(githubUrl + text);
                    if (settings.githubUsername) {
                        urls.push(githubUrl + settings.githubUsername);
                    }
                }
            }
        } else {
            if (settings.jiraServer) {
                urls.push("https://" + settings.jiraServer + "/browse/NU-" + text);
            }
            if (githubPRUrl) {
                urls.push(githubPRUrl + text);
            }
        }
        urls.forEach(function(url) {
            suggestions.push({content: url, description: url});
        });
        suggest(suggestions);
    }
);

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function(text) {
        chrome.tabs.getSelected(null, function(tab) {
            var url;
            if (text.substr(0, 8) == 'https://') {
                url = text;
            } else if (suggestions.length) {
                // too lazy to press the arrow key, go to the first suggestion directly
                url = suggestions[0].content;
            }
            if (url) {
                chrome.tabs.update(tab.id, {url: url});
            }
        });
    }
);
