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
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillsSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
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

// Skills section functionality
// Dynamically load skills from JSON and render

document.addEventListener('DOMContentLoaded', () => {
  const skillModal = document.getElementById('skillModal');
  const closeBtn = document.getElementById('closeSkillModal');
  const skillsGrid = document.getElementById('skillsGrid');
  let skillsData = [];

  // Fetch skills from JSON
  fetch('../storage/data/skills.json')
    .then(response => response.json())
    .then(data => {
      skillsData = data;
      renderSkillsGrid(skillsData);
      setupSkillIcons();
    });

  function renderSkillsGrid(skills) {
    skillsGrid.innerHTML = '';
    skills.forEach(skill => {  // afk
      const div = document.createElement('div');
      div.className = 'skill-icon';
      div.setAttribute('data-skill', skill.id);
      div.innerHTML = `
        <img src="${skill.icon}" alt="${skill.name}">
        <span>${skill.name}</span>
      `;
      skillsGrid.appendChild(div);
    });
  }

  function setupSkillIcons() {
    const skillIcons = document.querySelectorAll('.skill-icon');
    skillIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        const skillId = icon.getAttribute('data-skill');
        const skill = skillsData.find(s => s.id === skillId);
        if (skill) {
          document.getElementById('modalSkillTitle').textContent = skill.name;
          document.getElementById('modalSkillLogo').src = skill.icon;
          document.getElementById('modalSkillLogo').alt = skill.name;
          document.getElementById('modalSkillDescription').textContent = skill.description;
          skillModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  // Close modal functionality
  function closeModal() {
    skillModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
  closeBtn.addEventListener('click', closeModal);
  skillModal.addEventListener('click', (e) => {
    if (e.target === skillModal || e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && skillModal.classList.contains('active')) {
      closeModal();
    }
  });
});

// Blob Cursor functionality
document.addEventListener('DOMContentLoaded', () => {
  const blobCursor = document.querySelector('.blob-cursor');
  const blobInner = document.querySelector('.blob-inner');
  
  let mouseX = 0;
  let mouseY = 0;
  let blobX = 0;
  let blobY = 0;
  let isHovering = false;
  let lastDistance = 0;
  let snapThreshold = 8; // Distance threshold for snap wiggle
  
  // Smooth mouse tracking with lag
  function updateBlobPosition() {
    // Calculate distance between mouse and blob
    const deltaX = mouseX - blobX;
    const deltaY = mouseY - blobY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Adjust lag based on distance (faster movement = more lag)
    const lagFactor = Math.min(distance * 0.25, 0.6);
    
    // Smooth interpolation with lag
    blobX += deltaX * lagFactor;
    blobY += deltaY * lagFactor;
    
    // Check for snap wiggle effect
    if (lastDistance > snapThreshold && distance <= snapThreshold) {
      // Generate random rotation values for snap wiggle
      const snapRot1 = (Math.random() - 0.5) * 24; // -12 to 12 degrees
      const snapRot2 = (Math.random() - 0.5) * 24; // -12 to 12 degrees
      const snapRot3 = (Math.random() - 0.5) * 12; // -6 to 6 degrees
      const snapRot4 = (Math.random() - 0.5) * 12; // -6 to 6 degrees
      const snapRot5 = (Math.random() - 0.5) * 4;  // -2 to 2 degrees
      const snapRot6 = (Math.random() - 0.5) * 4;  // -2 to 2 degrees
      
      console.log('Snap rotations:', snapRot1, snapRot2, snapRot3, snapRot4, snapRot5, snapRot6);
      
      // Create dynamic keyframes for snap wiggle
      const style = document.createElement('style');
      style.textContent = `
        @keyframes randomSnapWiggle {
          0% { transform: scale(1) rotate(0deg); }
          15% { transform: scale(1.2) rotate(${snapRot1}deg); }
          30% { transform: scale(1.1) rotate(${snapRot2}deg); }
          45% { transform: scale(1.15) rotate(${snapRot3}deg); }
          60% { transform: scale(1.05) rotate(${snapRot4}deg); }
          75% { transform: scale(1.08) rotate(${snapRot5}deg); }
          90% { transform: scale(1.02) rotate(${snapRot6}deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `;
      document.head.appendChild(style);
      
      // Apply the animation
      blobCursor.querySelector('.blob-inner').style.animation = 'randomSnapWiggle 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      // Clean up old styles
      setTimeout(() => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, 500);
    }
    
    lastDistance = distance;
    
    // Apply position with smooth easing
    blobCursor.style.transform = `translate(${blobX}px, ${blobY}px) translate(-50%, -50%)`;
    
    // Continue animation
    requestAnimationFrame(updateBlobPosition);
  }
  
  // Mouse move event
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Hover effects
  document.addEventListener('mouseenter', (e) => {
    if (e.target.matches('a, .skill-icon')) {
      // Links and skill icons get red/orange color with random rotation
      const randomRot1 = (Math.random() - 0.5) * 20; // -10 to 10 degrees
      const randomRot2 = (Math.random() - 0.5) * 20; // -10 to 10 degrees
      const randomRot3 = (Math.random() - 0.5) * 20; // -10 to 10 degrees
      
      console.log('Random rotations:', randomRot1, randomRot2, randomRot3);
      
      // Create dynamic keyframes
      const style = document.createElement('style');
      style.textContent = `
        @keyframes randomWiggle {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(${randomRot1}deg); }
          50% { transform: scale(1.2) rotate(${randomRot2}deg); }
          75% { transform: scale(1.1) rotate(${randomRot3}deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `;
      document.head.appendChild(style);
      
      // Apply the animation
      blobCursor.classList.add('link-hover');
      blobCursor.querySelector('.blob-inner').style.animation = 'randomWiggle 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      // Clean up old styles
      setTimeout(() => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, 500);
    } else if (e.target.matches('button, .close-btn')) {
      // Other interactive elements get green color
      blobCursor.classList.add('hover');
    }
  });
  
  document.addEventListener('mouseleave', (e) => {
    if (e.target.matches('a, .skill-icon')) {
      blobCursor.classList.remove('link-hover');
    } else if (e.target.matches('button, .close-btn')) {
      blobCursor.classList.remove('hover');
    }
  });
  
  // Initialize blob position
  blobX = window.innerWidth / 2;
  blobY = window.innerHeight / 2;
  
  // Start the animation loop
  updateBlobPosition();
  
  // Skill icon random rotation on hover
  const skillIcons = document.querySelectorAll('.skill-icon');
  
  skillIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      // Generate random rotation between -90 and 90 degrees
      const randomRotation = Math.random() * 90 - 45;
      
      // Apply rotation to the icon's image
      const img = icon.querySelector('img');
      img.style.setProperty('--random-rotation', `${randomRotation}deg`);
      
      console.log('Skill icon rotation:', randomRotation);
    });
  });
  
  // Hide cursor on window blur
  window.addEventListener('blur', () => {
    blobCursor.style.opacity = '0';
  });
  
  window.addEventListener('focus', () => {
    blobCursor.style.opacity = '1';
  });
});
