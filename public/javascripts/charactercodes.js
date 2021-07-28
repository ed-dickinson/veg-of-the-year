
let str = document.querySelector('.p-description').innerHTML;
document.querySelector('.p-description').innerHTML = str.replace(/&amp;/g, "&");
