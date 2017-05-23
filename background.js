// Copyright (c) 2012 The Chromium Authors. All rights reserved.
var githubUsername = "";

function load() {
    chrome.storage.sync.get('github_username', function (result) {
        githubUsername = result.github_username;
    });
}

load();

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
        var suggestions = [];
        var urls = [];
        if (isNaN(text)) {
            if (text.substr(0, 4).toLowerCase() == 'per-') {
                urls.push("https://kanjoya.atlassian.net/browse/" + text);
            } else {
                if (githubUsername && githubUsername.indexOf(text) > -1) {
                    urls.push("https://github.com/eproject-inc/crane_apps/pulls/" + githubUsername);
                } else {
                    urls.push("https://github.com/eproject-inc/crane_apps/pulls/" + text);
                    if (githubUsername) {
                        urls.push("https://github.com/eproject-inc/crane_apps/pulls/" + githubUsername);
                    }
                }
            }
        } else {
            urls.push("https://kanjoya.atlassian.net/browse/PER-" + text);
        }
        for (var i = 0; i < urls.length; i++) {
            suggestions.push({content: urls[i], description: urls[i]});
        }
        suggest(suggestions);
    }
);

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function(text) {
        chrome.tabs.getSelected(null, function(tab) {
            var url = "";
            if (text.substr(0, 8) == 'https://') {
                url = text;
            } else if (isNaN(text)) {
                url = "https://github.com/eproject-inc/crane_apps/pulls/janepeng";
            } else {
                url = "https://kanjoya.atlassian.net/browse/PER-" + text;
            }
            chrome.tabs.update(tab.id, {url: url});
        });
    }
);
