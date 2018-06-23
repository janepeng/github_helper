# Github Pull Request Helper

Helps people to review pull requests the way they would like to.

## Getting Started

Download the extension, in chrome://extensions/, Load unpacked extension.

## Features

Github Helper comes with following features:

- pr title/comments contents that contains JIRA stories are auto linked.
- the ability to enable/disable github helper
- filtering by file type
- ordering of file sequence
- allowing you to mark files and portions of code as already reviewed
- remembering the file you were last reviewing
- collapsing/opening of all file diff sections

It also comes with a customized omnibox with keyword "ii". By setting your github/JIRA info in the popup settings,
you will be able to get to the desired page much easier.

## Testing

### Link JIRA tickets
* open a pull request with JIRA links in header and pr comments
* [ ] the JIRA tickets are linked, click on link will redirect to JIRA story

### Enable/Disable github helper
* open popup, under Github Code Review tab, enable github helper
* [ ] open a pull request files page, you see extra buttons (such as Move Up) are added to the review page.
* open popup, under Github Code Review tab, disable github helper
* [ ] open a pull request files page, you don't see any extra buttons added to the review page.

### Filter by file types

* open a pull request, click on the chrome extension
* [ ] make sure all file types in the pull requests show up in the extension popup
* [ ] check/uncheck file types in popup should show/hide files in pull request

### Reordering files

* Go to the files page of a pull request
* [ ] There are buttons to move the file up and down
* [ ] Clicking them changes the order accordingly
* Refresh the page
* [ ] The order is retained

### Expand Collapse files

* Go to the files page of a pull request
* [ ] There are buttons to expand all files or collapse all files, and they do those things
* [ ] If you expand and collapse individual files, when you reload, they are still in the same state

### URL shortcuts

* Define your github owner/repository/username in settings
* [ ] type your username, a suggestion to your github pull request page should show up
* [ ] type your co-worker's username, a suggestion to his/her github pull request page should show up
* Define your JIRA server in settings
* [ ] type JIRA ticket number should have a suggestion to the ticket should show up
