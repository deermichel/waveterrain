let audioContext = new AudioContext();

const startAudio = async (arg) => {
    await audioContext.audioWorklet.addModule("src/processor.js");
    const processor = new AudioWorkletNode(audioContext, "processor");
    processor.connect(audioContext.destination);
    audioContext.resume();

    processor.port.onmessage = (message) => {
        if (message.data.message === "terrain") {
            console.log(message.data);
        }
    };
    // setInterval(() => {
    //     processor.port.postMessage({ message: "get_terrain" });
    // }, 1000);
}

document.getElementById("button-start").addEventListener("click", startAudio);
