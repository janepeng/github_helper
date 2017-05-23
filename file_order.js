function swapElements(el1, el2) {
    var temp = document.createElement('div');
    el1.parentNode.replaceChild(temp, el1);
    el2.parentNode.replaceChild(el1, el2);
    temp.parentNode.replaceChild(el2, temp);
}
