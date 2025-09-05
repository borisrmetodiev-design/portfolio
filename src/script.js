// Srolling title bar functionality
let lastScroll = 0;
const header = document.querySelector('.title-bar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll) {
    // Scrolling down → hide header
    header.style.top = '-60px';
  } else {
    // Scrolling up → show header
    header.style.top = '0';
  }

  lastScroll = currentScroll;
});

document.querySelectorAll('.title-buttons button').forEach(btn => {
  btn.addEventListener('mouseover', () => {
    btn.classList.remove('unhovering');
  });
  btn.addEventListener('mouseout', () => {
    btn.classList.add('unhovering');
    setTimeout(() => btn.classList.remove('unhovering'), 300); // match transition duration
  });
});

document.getElementById('btn1').addEventListener('click', () => {
  alert('Button 1 clicked!');
});

document.getElementById('btn2').addEventListener('click', () => {
  alert('Button 2 clicked!');
});

// anims for shake

const titleWrapper = document.querySelector('.title-name');
const titleText = titleWrapper.querySelector('h1');

titleWrapper.addEventListener('mouseenter', () => {
  titleText.classList.add('float');
});

titleWrapper.addEventListener('mouseleave', () => {
  // Get the computed transform at the moment of leaving
  const style = getComputedStyle(titleText);
  const currentTransform = style.transform;

  // Freeze it there
  titleText.style.transform = currentTransform;
  titleText.classList.remove('float');

  // Force reflow to apply style before transitioning
  void titleText.offsetWidth;

  // Then let it transition smoothly back to neutral
  titleText.style.transform = 'translate(0,0) rotate(0deg)';
});

// sidebar

const sidebar = document.querySelector('.sidebar');
let sidebarVisible = false;
let mouseNearEdge = false;

// Show sidebar when mouse is near the left edge
document.addEventListener('mousemove', (e) => {
  if (e.clientX <= 10) {
    mouseNearEdge = true;
    sidebar.classList.add('visible');
  } else if (!sidebar.matches(':hover')) {
    mouseNearEdge = false;
    sidebar.classList.remove('visible');
  }
});

// Keep sidebar open if mouse is over it
sidebar.addEventListener('mouseenter', () => {
  sidebar.classList.add('visible');
});
sidebar.addEventListener('mouseleave', () => {
  if (!mouseNearEdge) {
    sidebar.classList.remove('visible');
  }
});