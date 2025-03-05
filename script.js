// Project data
const projects = [
    {
        id: 1,
        name: "This Minigame Idea",
        url: "https://websim.ai/@api/this-minigame-idea-does-not-exist"
    },
    {
        id: 2,
        name: "This Programming Language",
        url: "https://websim.ai/@api/this-programming-language-does-not-exist"
    },
    {
        id: 3,
        name: "This Date",
        url: "https://websim.ai/@api/this-date-does-not-exist"
    },
    {
        id: 4,
        name: "This Soda",
        url: "https://websim.ai/@api/this-soda-does-not-exist"
    },
    {
        id: 5,
        name: "This Cat",
        url: "https://websim.ai/@api/this-cat-does-not-exist"
    },
    {
        id: 6,
        name: "This Wireframe",
        url: "https://websim.ai/@api/this-wireframe-does-not-exist/1"
    },
    {
        id: 7,
        name: "This Classic Arcade Game",
        url: "https://websim.ai/@api/this-classic-arcade-game-does-not-exist/"
    },
    {
        id: 8,
        name: "This Slideshow Cartoon",
        url: "https://websim.ai/@api/this-slideshow-cartoon-does-not-exist"
    },
    {
        id: 9,
        name: "This Fridge",
        url: "https://websim.ai/@api/this-fridge-does-not-exist/"
    },
    {
        id: 10,
        name: "This Planet",
        url: "https://websim.ai/@api/this-planet-does-not-exist"
    },
    {
        id: 11,
        name: "This Tetris Game",
        url: "https://websim.ai/@api/this-tetris-game-does-not-exist"
    },
    {
        id: 12,
        name: "This Snake Game",
        url: "https://websim.ai/@api/this-snake-game-does-not-exist"
    }
];

// DOM elements
const elevator = document.querySelector('.elevator');
const leftDoor = document.querySelector('.left-door');
const rightDoor = document.querySelector('.right-door');
const floorButtons = document.querySelector('.floor-buttons');
const closeButton = document.querySelector('.close-button');
const iframeContainer = document.querySelector('.iframe-container');
const projectFrame = document.getElementById('project-frame');
const loadingScreen = document.querySelector('.loading-screen');
const loadingProgress = document.querySelector('.loading-progress');
const fullscreenOverlay = document.querySelector('.fullscreen-overlay');
const exitFullscreenBtn = document.querySelector('.exit-fullscreen');

// State variables
let currentFloor = null;
let isDoorsOpen = false;
let isMoving = false;

// Initialize the elevator
function initElevator() {
    // Create floor buttons
    projects.forEach(project => {
        const button = document.createElement('div');
        button.className = 'floor-button';
        button.textContent = project.id;
        button.dataset.floor = project.id;
        button.title = project.name;
        button.addEventListener('click', () => selectFloor(project.id));
        floorButtons.appendChild(button);
    });

    // Setup close button
    closeButton.addEventListener('click', closeDoors);

    // Setup exit fullscreen button
    exitFullscreenBtn.addEventListener('click', exitFullscreen);

    // Simulate loading
    setTimeout(() => {
        loadingProgress.style.width = '100%';
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 3000);
    }, 500);
}

// Select a floor
function selectFloor(floorId) {
    if (isMoving || currentFloor === floorId) return;
    
    const targetProject = projects.find(p => p.id === Number(floorId));
    if (!targetProject) return;

    // Update active button
    document.querySelectorAll('.floor-button').forEach(btn => {
        btn.classList.remove('active');
        if (Number(btn.dataset.floor) === targetProject.id) {
            btn.classList.add('active');
        }
    });

    if (isDoorsOpen) {
        // Close doors first
        closeDoors().then(() => {
            moveElevator(targetProject);
        });
    } else {
        moveElevator(targetProject);
    }
}

// Move elevator to selected floor
function moveElevator(project) {
    isMoving = true;
    elevator.classList.add('moving');
    
    // Load the project URL into iframe
    projectFrame.src = project.url;
    
    // Simulate elevator moving
    setTimeout(() => {
        isMoving = false;
        elevator.classList.remove('moving');
        currentFloor = project.id;
        openDoors();
    }, 2000);
}

// Open elevator doors
function openDoors() {
    return new Promise(resolve => {
        const elevatorDoors = document.querySelector('.elevator-doors');
        elevatorDoors.classList.add('doors-open');
        isDoorsOpen = true;
        
        // Show iframe
        setTimeout(() => {
            iframeContainer.classList.add('active');
            resolve();
        }, 1000);
    });
}

// Close elevator doors
function closeDoors() {
    return new Promise(resolve => {
        iframeContainer.classList.remove('active');
        
        setTimeout(() => {
            const elevatorDoors = document.querySelector('.elevator-doors');
            elevatorDoors.classList.remove('doors-open');
            isDoorsOpen = false;
            
            // Clear iframe source after doors close
            setTimeout(() => {
                if (!isDoorsOpen) {
                    projectFrame.src = "";
                }
                resolve();
            }, 1000);
        }, 500);
    });
}

// Enter fullscreen mode
function enterFullscreen() {
    if (!isDoorsOpen) return;
    
    fullscreenOverlay.classList.add('active');
    const fullscreenIframe = document.createElement('iframe');
    fullscreenIframe.src = projectFrame.src;
    fullscreenIframe.style.width = '100%';
    fullscreenIframe.style.height = '100%';
    fullscreenIframe.style.border = 'none';
    
    // Clear and append
    while (fullscreenOverlay.children.length > 1) {
        fullscreenOverlay.removeChild(fullscreenOverlay.lastChild);
    }
    fullscreenOverlay.appendChild(fullscreenIframe);
}

// Exit fullscreen mode
function exitFullscreen() {
    fullscreenOverlay.classList.remove('active');
    // Remove iframe
    const iframes = fullscreenOverlay.querySelectorAll('iframe');
    iframes.forEach(iframe => iframe.remove());
}

// Event listener for iframe click to enter fullscreen
iframeContainer.addEventListener('click', function(e) {
    if (e.target !== closeButton && !closeButton.contains(e.target)) {
        enterFullscreen();
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', initElevator);

