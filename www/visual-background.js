// ===== Dynamic Prayer Background =====

function updateBackground(){

    const hour = new Date().getHours();

    const body = document.body;


    // Subuh
    if(hour >= 4 && hour < 7){

        body.className = "morning";

    }


    // Siang
    else if(hour >= 7 && hour < 16){

        body.className = "day";

    }


    // Sore / Magrib
    else if(hour >= 16 && hour < 19){

        body.className = "sunset";

    }


    // Malam
    else{

        body.className = "night";

    }

}


updateBackground();

setInterval(updateBackground,60000);

// ===== Night Elements =====

function createNightEffect(){

    if(document.getElementById("moon"))
        return;


    const moon = document.createElement("div");
    moon.id="moon";
    moon.innerHTML="🌙";

    document.body.appendChild(moon);


    const cloud = document.createElement("div");
    cloud.id="cloud";
    cloud.innerHTML="☁️";

    document.body.appendChild(cloud);


    const stars = document.createElement("div");
    stars.id="stars";
    stars.innerHTML="✨ ✨ ✨";

    document.body.appendChild(stars);

}


createNightEffect();

// ===== Create Mosque Silhouette =====

function createMosque(){

    if(document.getElementById("mosque"))
        return;


    const mosque = document.createElement("div");

    mosque.id="mosque";

    mosque.innerHTML = `

    <div class="dome"></div>

    <div class="minaret left"></div>

    <div class="minaret right"></div>

    <div class="mosque-body"></div>

    `;


    document.body.appendChild(mosque);

}


createMosque();

// ===== Mosque Light Effect =====

function mosqueLight(){

    const mosque = document.getElementById("mosque");

    if(!mosque) return;


    const light = document.createElement("div");

    light.id = "mosque-light";

    mosque.appendChild(light);

}


mosqueLight();

// ===== Premium Image Background =====

function updateHeroBackground(){

    const hour = new Date().getHours();

    let image = "images/malam.jpg";


    if(hour >= 4 && hour < 10){

        image = "images/subuh.jpg";

    }

    else if(hour >= 10 && hour < 16){

        image = "images/siang.jpg";

    }

    else if(hour >= 16 && hour < 19){

        image = "images/sore.jpg";

    }

document.body.style.backgroundImage =
`
linear-gradient(
    rgba(0,0,0,.35),
    rgba(0,0,0,.65)
),
url("${image}")
`;

document.body.style.backgroundSize = "cover";

document.body.style.backgroundPosition = "center";

document.body.style.backgroundAttachment = "fixed";

}


updateHeroBackground();

function updatePrayerBackground(){

    let hour = new Date().getHours();

    let img = "malam.jpg";

    if(hour>=4 && hour<10){
        img="subuh.jpg";
    }
    else if(hour>=10 && hour<15){
        img="siang.jpg";
    }
    else if(hour>=15 && hour<18){
        img="sore.jpg";
    }

    let header=document.getElementById("prayerHeader");

    if(header){
        header.style.background =
    `linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.55)), url("images/${img}")`;
        header.style.backgroundSize="100% 100%";
        header.style.backgroundPosition="center";
        header.style.backgroundRepeat="no-repeat";
    }
}

updatePrayerBackground();
setInterval(updatePrayerBackground,60000);
