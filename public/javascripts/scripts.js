switch (location.pathname) {
  case '/':
    document.getElementById('home').classList.add('hover');
    break;
  case '/create-message':
    document.getElementById('create').classList.add('hover');
    break;
  case '/get-membership':
    document.getElementById('membership').classList.add('hover');
    break;
  case '/get-admin':
    document.getElementById('admin').classList.add('hover');
    break;
}

const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menu-btn');

const toggleMenu = () => {
  menu.classList.toggle('show');
}

menuBtn.onclick = toggleMenu;