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
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.className = "project";
        var ahref = document.createElement('a');
        ahref.href = "project.html?id=" + (i + 1);
        const img = document.createElement('img');
        img.src = image;
        img.alt = name;
        const projectName = document.createElement('h3');
        projectName.textContent = name;
        
        // Append elements to project grid
        ahref.appendChild(img);
        projectDiv.appendChild(ahref);
        projectDiv.appendChild(projectName);
        projectGrid.appendChild(projectDiv);
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

            document.getElementById("project-title").innerText = title;
            document.getElementById("project-description").innerText = description;

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
