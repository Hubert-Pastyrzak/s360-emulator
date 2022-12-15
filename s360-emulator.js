let memory;
let gpr = new Array(8);
let psw;

function writePSW(field, value) {
    switch (field) {
        case "CC":
            psw = (psw & 0xFFFFFFF3FFFFFFFF) | (value << 34);
            break;

        case "PM":
            psw = (psw & 0xFFFFFF0FFFFFFFFF) | (value << 36);
            break;

        case "IA":
            psw = (psw & 0x000000FFFFFFFFFF) | (value << 40);
            break;
    }
}

function readPSW(field) {
    switch (field) {
        case "CC":
            return (psw & 0x0000000C00000000) >> 34;

        case "PM":
            return (psw & 0x000000F000000000) >> 36;
    
        case "IA":
            return (psw & 0xFFFFFF0000000000) >> 40;
    }
}

function directAddress(displacement, base) {
    return (displacement << 3) | base;
}

function fetchNibbles() {
    //TODO: Fetch nibbles
}

function fetchNibbleAnd24() {
    //TODO: Fetch a nibble + a 24-bit value
}

function fetchByte() {
    //TODO: Fetch a byte
}

function fetchI() {
    let opcode = fetchByte();
    let i = fetchByte();
    return {
        format: "I",
        opcode: opcode,
        i: i
    };
}

function fetchRR() {
    let opcode = fetchByte();
    let {
        low: r1,
        high: r2
    } = fetchNibbles();
    return {
        format: "RR",
        opcode: opcode,
        r1: r1,
        r2: r2
    };
}

function fetchRS1() {
    let opcode = fetchByte();
    let {
        low: r1,
        high: r3
    } = fetchNibbles();
    let {
        low: b2,
        high: d2
    } = fetchNibbleAnd24();
    return {
        format: "RS1",
        opcode: opcode,
        r1: r1,
        r3: r3,
        b2: b2,
        d2: d2
    };
}

function fetchRS2() {
    let opcode = fetchByte();
    let {
        low: r1,
        high: m3
    } = fetchNibbles();
    let {
        low: b2,
        high: d2
    } = fetchNibbleAnd24();
    return {
        format: "RS2",
        opcode: opcode,
        r1: r1,
        m3: m3,
        b2: b2,
        d2: d2
    };
}

function fetchRX() {
    let opcode = fetchByte();
    let {
        low: r1,
        high: x2
    } = fetchNibbles();
    let {
        low: b2,
        high: d2
    } = fetchNibbleAnd24();
    return {
        format: "RX",
        opcode: opcode,
        r1: r1,
        x2: x2,
        b2: b2,
        d2: d2
    };
}

function fetchSI() {
    let opcode = fetchByte();
    let i2 = fetchByte();
    let {
        low: b1,
        high: d1
    } = fetchNibbleAnd24();
    return {
        format: "SI",
        opcode: opcode,
        i2: i2,
        b1: b1,
        d1: d1
    };
}

function fetchSS1() {
    let opcode = fetchByte();
    let l = fetchByte();
    let {
        low: b1,
        high: d1
    } = fetchNibbleAnd24();
    let {
        low: b2,
        high: d2
    } = fetchNibbleAnd24();
    return {
        format: "SS1",
        opcode: opcode,
        l: l,
        b1: b1,
        d1: d1,
        b2: b2,
        d2: d2
    };
}

function fetchSS2() {
    let opcode = fetchByte();
    let {
        low: l1,
        high: l2
    } = fetchNibbles();
    let {
        low: b1,
        high: d1
    } = fetchNibbleAnd24();
    let {
        low: b2,
        high: d2
    } = fetchNibbleAnd24();
    return {
        format: "SS2",
        opcode: opcode,
        l1: l1,
        l2: l2,
        b1: d1,
        b2: b2,
        d2: d2
    };
}

function fetchSS3() {
    let opcode = fetchByte();
    let {
        low: r1,
        high: r3
    } = fetchNibbles();
    let {
        low: b1,
        high: d1
    } = fetchNibbleAnd24();
    let {
        low: b2,
        high: d2
    } = fetchNibbleAnd24();
    return {
        format: "SS3",
        opcode: opcode,
        r1: r1,
        r3: r3,
        b1: b1,
        d1: d1,
        b2: b2,
        d2: d2
    };
}

function spm(pm) {
    writePSW("PM", pm);
}

function balr(targetRegister, sourceRegister) {
    //TODO: Modes
}

function bctr(targetRegister, branchRegister) {
    gpr[targetRegister]--;
    if (branchRegister === 0 || gpr[targetRegister] === 0)
        return;

    if (gpr[branchRegister] % 2 === 1 || gpr[branchRegister] >= memory.length) {
        //TODO: Operation exception
        return;
    }

    //TODO: Storage key check
    writePSW("IA", gpr[branchRegister]);
}

function bcr(maskValue, branchRegister) {
    if (branchRegister === 0 || maskValue === 0)
        return;

    let conditionMask = 8 >> readPSW("CC");
    if (maskValue !== 15 && conditionMask & maskValue === 0)
        return;

    if (gpr[branchRegister] % 2 === 1 || gpr[branchRegister] >= memory.length) {
        //TODO: Operation exception
        return;
    }

    //TODO: Storage key check
    writePSW("IA", gpr[branchRegister]);
}

function setMemorySize(size) {
    memory = new Array(parseInt(size) * 1024);
}

document.getElementById("memory-size").onchange = (e) => {
    setMemorySize(e.target.value);
};