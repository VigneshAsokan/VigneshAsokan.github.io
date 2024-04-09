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
                projectLink.innerText = '\xa0' + '"' + link + '";';
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

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#011627');
  gradient.addColorStop(0.5, '#152B56');
  gradient.addColorStop(1, '#011627');
const particles = [];
const particleCount = 100;
const maxRadius = 5;
const minRadius = 1;
const speed = 0.5;
const colors = ['#124A4A', '#43D9AD', '#1A2F5F', '#1E4266', '#fff'];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle() {
  const particle = {
    x: random(0, canvas.width),
    y: random(0, canvas.height),
    radius: random(minRadius, maxRadius),
    color: colors[Math.floor(random(0, colors.length))],
    speed: speed,
    angle: random(0, 2 * Math.PI),
  };

  particles.push(particle);
}

function updateParticles() {
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];

    particle.x += Math.cos(particle.angle) * particle.speed;
    particle.y += Math.sin(particle.angle) * particle.speed;

    if (particle.x < -particle.radius || particle.x > canvas.width + particle.radius || particle.y < -particle.radius || particle.y > canvas.height + particle.radius) {
      createParticle();
      particles.splice(i, 1);
      i--;
      continue;
    }

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = particle.color;
    ctx.fill();
  }
}

function animate() {
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  updateParticles();
  requestAnimationFrame(animate);
}

for (let i = 0; i < particleCount; i++) {
  createParticle();
}

animate();

document.addEventListener('mousemove', (e) => {
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    const dx = particle.x - e.clientX;
    const dy = particle.y - e.clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 200) {
      particle.speed = 1;
      particle.angle = Math.atan2(e.clientY - particle.y, e.clientX - particle.x);
    } else {
      particle.speed = speed;
    }
 }
});
// Resize canvas on window resize
window.addEventListener('resize', function() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
});
