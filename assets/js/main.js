const MODEL_URL = "https://teachablemachine.withgoogle.com/models/wTc4CpZbS/";

let model, webcam, loopId, running = false;

async function init() {
    const btnStart = document.getElementById("btn-start");
    const btnStop  = document.getElementById("btn-stop");

    btnStart.disabled    = true;
    btnStart.textContent = "Cargando...";

    try {
        model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");

        webcam = new tmImage.Webcam(280, 280, true);
        await webcam.setup();
        await webcam.play();

        document.getElementById("webcam-container").appendChild(webcam.canvas);

        btnStart.style.display = "none";
        btnStop.style.display  = "block";

        running = true;
        loopId  = window.requestAnimationFrame(loop);
    } catch {
        btnStart.disabled    = false;
        btnStart.textContent = "Iniciar cámara";
        alert("No se pudo acceder a la cámara. Verifica los permisos e inténtalo de nuevo.");
    }
}

async function loop() {
    if (!running) return;
    webcam.update();
    await predict();
    if (running) loopId = window.requestAnimationFrame(loop);
}

async function predict() {
    if (!running) return;

    const prediction = await model.predict(webcam.canvas);

    if (!running) return;

    let top = prediction[0];
    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > top.probability) top = prediction[i];
    }

    const isPet  = top.className === "SÍ es PET";
    const mascot = document.getElementById("mascot");
    const box    = document.getElementById("result-box");

    box.className = "result-box visible " + (isPet ? "pet" : "no-pet");
    document.getElementById("result-label").textContent = isPet
        ? "¡Este objeto es reciclable!"
        : "Este objeto no es PET";
    document.getElementById("result-text").textContent = isPet ? "✓ SÍ es PET" : "✗ NO es PET";

    const newSrc = isPet
        ? "assets/img/reciclaje-yacatzin.webp"
        : "assets/img/reciclando-yacatzin.webp";

    if (!mascot.src.endsWith(newSrc)) {
        mascot.style.opacity = "0";
        setTimeout(() => {
            mascot.src           = newSrc;
            mascot.style.opacity = "1";
        }, 150);
    }
}

function stopCamera() {
    running = false;
    cancelAnimationFrame(loopId);

    if (webcam) {
        webcam.stop();
        document.getElementById("webcam-container").innerHTML = "";
    }

    const btnStart = document.getElementById("btn-start");
    const btnStop  = document.getElementById("btn-stop");
    const mascot   = document.getElementById("mascot");

    btnStart.disabled      = false;
    btnStart.textContent   = "Iniciar cámara";
    btnStart.style.display = "block";
    btnStop.style.display  = "none";

    document.getElementById("result-box").className = "result-box";
    mascot.src           = "assets/img/pet-yacatzin.png";
    mascot.style.opacity = "1";
}
