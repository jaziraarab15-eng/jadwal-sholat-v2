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
