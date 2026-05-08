var limpiar = document.getElementById("limpiar");
var canvas = document.getElementById("canvas");

if(canvas.getContext){
    var ctx = canvas.getContext("2d");
    var cw = canvas.width = 500, cx = cw/2; // tamaño (ancho) y posición en X
    var ch = canvas.height = 500, cy = ch/2; // tamaño (alto) y posición en y

    var dibujar = false;
    var factorDeAlisamiento = 5;
    var Trazados = [];
    var puntos = [];

    ctx.lineJoin = "round";

    limpiar.addEventListener('click',function(){
        dibujar = false;
        ctx.clearRect(0,0,cw,ch); // magia de limpiar
        Trazados.length = 0;
        puntos.length = 0;
    },false);


    canvas.addEventListener('mousedown',function(){
        dibujar = true;
        puntos.length = 0;
        ctx.beginPath();
    },false);


    canvas.addEventListener('mouseup',redibujarTrazados,false);

    canvas.addEventListener('mouseout',redibujarTrazados,false);


    canvas.addEventListener('mousemove',function(evt){
        if(dibujar){
            var m = oMousePost(canvas,evt);
            puntos.push(m);
            ctx.lineTo(m.x,m.y);
            ctx.strokeStyle = "blue";
            ctx.stroke();
        }
    },false);


    function reducirArray(n,elArray){
        let nuevoArray = elArray.filter((_,i) => i % n === 0); // Filtr los puntos para cada "n" posiciones
        nuevoArray.push(elArray[elArray.length - 1]); //El último punto del trazo debe agregarse
        Trazados.push(nuevoArray);
    }

    function calcularPuntDeControl(ry,a,b){
        return {
         x:(ry[a].x + ry[b].x) / 2,
         y:(ry[a].y + ry[b].y) / 2
        };
    }

    function alisarTrazado(ry){
        if(ry.length > 1){ // tiene que haber más de 1 punto para trazar la nueva línea
            var ultimoPunto = ry.length - 1;
            ctx.beginPath();
            ctx.moveTo(ry[0].x,ry[0].y); //Inicia el trazado en el primer punto.

            for(let i = 1; i < ry.length - 2; i++){
                let pc = calcularPuntDeControl(ry,i,i+1);
                ctx.quadraticCurveTo(ry[i].x,ry[i].y,pc.x,pc.y); //Dibuja la curva desde el punto actual al punto de control
            }

            ctx.quadraticCurveTo(ry[ultimoPunto -1].x, ry[ultimoPunto -1].y, ry[ultimoPunto].x,ry[ultimoPunto].y);
            ctx.stroke();
        }
    }

    function redibujarTrazados(){
        dibujar = false;
        ctx.clearRect(0,0,cw,ch);
        reducirArray(factorDeAlisamiento,puntos); //reduce la cantidad de puntos
        Trazados.forEach(trazado => alisarTrazado(trazado)); //Suaviza y redibuja los trazos
    }

    function oMousePost(canvas,evt){
        let rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

}else{
    alert("No se soporta el contexto del lienzo.");
}
