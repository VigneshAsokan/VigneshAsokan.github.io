window.onload = function() {
    // Load projects from XML
    loadProjects();
};

function loadProjects() {
    // Load projects from XML file
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                parseProjects(xmlhttp.responseXML);
            } else {
                console.error('Failed to load projects.');
            }
        }
    };
    xmlhttp.open('GET', 'projects.xml', true);
    xmlhttp.send();
}

function parseProjects(xml) {
    const projects = xml.getElementsByTagName('project');
    const projectGrid = document.getElementById('project-grid');

    // Iterate over each project
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const name = project.getElementsByTagName('title')[0].textContent;
        const image = project.getElementsByTagName('thumbnail')[0].textContent;

        // Create project element
        const tempDiv = document.createElement('div');
        tempDiv.classList.add('temp');
        tempDiv.className = "temp";
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.className = "project";
        const ahref = document.createElement('a');
        ahref.href = "project.html?id=" + (i + 1);
        const img = document.createElement('img');
        img.src = image;
        img.alt = name;
        const projectName = document.createElement('h3');
        projectName.textContent = name;
        projectName.style.textDecoration = "none";
        ahref.style.textDecoration = "none";

        projectDiv.appendChild(img);
        projectDiv.appendChild(projectName);
        ahref.appendChild(projectDiv);
        tempDiv.appendChild(ahref);
        projectGrid.appendChild(tempDiv);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var urlParams = new URLSearchParams(window.location.search);
    var projectID = urlParams.get('id');

    if (projectID) {
        loadProject(projectID);
    }    
});

function loadProject(projectID) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            displayProjectDetails(this, projectID);
        }
    };
    xhttp.open("GET", "projects.xml", true);
    xhttp.send();
}

function displayProjectDetails(xml, projectID) {
    var xmlDoc = xml.responseXML;
    var projects = xmlDoc.getElementsByTagName("project");
    
    for (var i = 0; i < projects.length; i++) {
        if (projects[i].getAttribute('id') == projectID) {
            var title = projects[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
            var description = projects[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
            var images = projects[i].getElementsByTagName("image");
            var videos = projects[i].getElementsByTagName("video");
            var projectLinks = projects[i].getElementsByTagName("link");

            document.getElementById("project-title").innerText = title;
            var descriptionDiv = document.getElementById("project-description");
            descriptionDiv.innerText = description;
            
            
            for(var j = 0; j < projectLinks.length; j+=2)
            {
                var linkType = projectLinks[j].childNodes[0].nodeValue;
                var link = projectLinks[j+1].childNodes[0].nodeValue;
                var linksDiv = document.getElementById("project-links");
                var linkDiv = document.createElement("div");
                linkDiv.classList.add("project-link");
                linkDiv.className = "project-link";
                var projectLinkType = document.createElement("p");
                var projectLink = document.createElement("a");
                projectLinkType.innerText = linkType;
                projectLink.href = link;
                projectLink.innerText = '\xa0' + '"' + link + '"';
                linkDiv.appendChild(projectLinkType);
                linkDiv.appendChild(projectLink);
                linksDiv.appendChild(linkDiv);
            }            
            
            var videoContainer = document.getElementById("video-container");
            var slideshowContainer = document.getElementById("project-slideshow");
            var thumbnailsContainer = document.getElementById("thumbnail-container");

            for(var j = 0; j < videos.length; j++)
            {
                var vid = document.createElement("iframe");
                vid.src = videos[j].childNodes[0].nodeValue;
                vid.alt = "Project Video " + (j + 1); // Add alt attribute
                vid.width="800";
                vid.height="450";    
                vid.frameborder="0";        
                vid.referrerPolicy = "no-referrer|no-referrer-when-downgrade|origin|origin-when-cross-origin|same-origin|strict-origin-when-cross-origin|unsafe-url";
                vid.allowFullscreen = true;
                videoContainer.appendChild(vid);
            }
            for (var j = 0; j < images.length; j++) {
                var img = document.createElement("img");
                img.src = images[j].childNodes[0].nodeValue;
                img.alt = "Project Image " + (j + 1); // Add alt attribute
                img.classList.add("slide");
                slideshowContainer.appendChild(img);

                var thumbnail = document.createElement("img");
                thumbnail.src = images[j].childNodes[0].nodeValue;
                thumbnail.alt = "Thumbnail " + (j + 1); // Add alt attribute
                thumbnail.classList.add("thumbnail");
                thumbnail.setAttribute("data-index", j);
                thumbnail.addEventListener("click", function() {
                    showSlide(this.getAttribute("data-index"), slideshowContainer);
                });
                thumbnailsContainer.appendChild(thumbnail);
            }

            showSlide(0, slideshowContainer); // Show the first image initially
            break;
        }
    }
}

function showSlide(index, slideshowContainer) {
    var slides = slideshowContainer.getElementsByClassName("slide");
    if (index >= 0 && index < slides.length) {
        for (var i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[index].style.display = "block";
    }
}

const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

function random(min, max) {
    return Math.random() * (max - min) + min;
  }
// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create gradient
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#011627');
gradient.addColorStop(0.5, '#152B56');
gradient.addColorStop(1, '#011627');

const colors = ['#7F82BB', '#367E7F', '#732BF5', '#DA6CF0', '#75385B'];
// Set up animated elements
const stars = [];
const numStars = 150;

// Generate random stars
for (let i = 0; i < numStars; i++) {
stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3,
    speed: Math.random() * 2,
    colors: "white",
    opacity: Math.random()// Add opacity for twinkling effect
});
}

// Mouse position
let mouseX = 0;
let mouseY = 0;

// Track mouse movement
document.addEventListener('mousemove', function(event) {
mouseX = event.clientX;
mouseY = event.clientY;
});

// Draw animated background
function drawBackground() {
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Update and draw stars
stars.forEach(star => {
    // Calculate distance to mouse pointer
    const dx = star.x - mouseX;
    const dy = star.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Move stars away from mouse pointer
    if (distance < 150) {
    star.x -= dx * 0.01;
    star.y -= dy * 0.01;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = star.colors;
    ctx.fillStyle.opacity = star.opacity;
    ctx.fill();

    // Update star position
    star.x -= star.speed;

    // Reset position if star moves out of canvas
    if (star.x < -star.radius) {
    star.x = canvas.width + star.radius;
    star.y = Math.random() * canvas.height;
    }
});

requestAnimationFrame(drawBackground);
}

// Start animation
drawBackground();

// Resize canvas on window resize
window.addEventListener('resize', function() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
});
