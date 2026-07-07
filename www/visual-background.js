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

function updateHeroBackground(){

    const hour = new Date().getHours();

    let image = "images/malam.jpg";


    // Subuh
    if(hour >= 5 && hour < 10){

        image = "images/subuh.jpg";

    }

    // Siang
    else if(hour >= 10 && hour < 16){

        image = "images/siang.jpg";

    }

    // Sore
    else if(hour >= 16 && hour < 19){

        image = "images/sore.jpg";

    }


    const hero = document.querySelector(".hero-bg");


    if(hero){

        hero.style.backgroundImage =
        `
        linear-gradient(
        rgba(0,0,0,.35),
        rgba(0,0,0,.65)
        ),
        url("${image}")
        `;

    }

}


updateHeroBackground();
