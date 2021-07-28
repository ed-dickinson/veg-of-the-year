
let hidden = document.querySelector('.update-delete');

function show() {


if (hidden.classList.contains('hidden')) {
    hidden.style.width = 'inherit';
    hidden.classList.remove('hidden');
  } else {
    hidden.classList.add('hidden');
    hidden.style.width = '0';
  }

};

document.querySelector('.modify-link').addEventListener('click', show);
