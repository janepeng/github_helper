
function save() {
    var githubUsername = document.getElementById('github-username').value;
    chrome.storage.sync.set({'github_username': githubUsername}, function() {
        console.log("saved", githubUsername)
    });
}

function load() {
    chrome.storage.sync.get('github_username', function (result) {
        if (result.github_username) {
            document.getElementById('github-username').value = result.github_username;  
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    load();
    document.getElementById("github-username").addEventListener("change", save);
});
