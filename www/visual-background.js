(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "bgCanvas";

    Object.assign(canvas.style, {
        position: "fixed",
        inset: "0",
        width: "100%",
        height: "100%",
        zIndex: "-1",
        pointerEvents: "none"
    });

    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }

    resize();
    addEventListener("resize", resize);

    const stars = Array.from({length:80},()=>({
        x:Math.random()*innerWidth,
        y:Math.random()*innerHeight,
        r:Math.random()*2,
        a:Math.random()
    }));

    function animate(){
        const g=ctx.createLinearGradient(0,0,0,innerHeight);
        g.addColorStop(0,"#071d49");
        g.addColorStop(1,"#2196f3");

        ctx.fillStyle=g;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        stars.forEach(s=>{
            s.a += 0.01;
            if(s.a>1)s.a=0;

            ctx.beginPath();
            ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
            ctx.fillStyle=`rgba(255,255,255,${s.a})`;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
})();
