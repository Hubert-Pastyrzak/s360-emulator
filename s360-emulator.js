let memory;
let gpr = new Array(8);

function setMemorySize(size) {
    memory = new Array(parseInt(size) * 1024);
}

document.getElementById("memory-size").onchange = (e) => {
    setMemorySize(e.target.value);
};