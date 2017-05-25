# Github Pull Request Helper

Helps people to review pull requests the way they would like to.

## Getting Started

Download the extension, in chrome://extensions/, Load unpacked extension.

## Features

Github Helper makes PR review easier with the following features:

- filtering by file type
- ordering of file sequence
- allowing you to mark files and portions of code as already reviewed
- remembering the file you were last reviewing
- collapsing/opening of all file diff sections

## Testing

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
