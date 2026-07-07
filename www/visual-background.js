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
