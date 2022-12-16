let memory;
let gpr = new Array(8);
let psw;

function writeMemory(address, value) {
    switch (value.length) {
        case 1:
            memory[address] = value.value;
            break;

        case 2:
            memory[address] = (value.value & 0xFF00) >> 8;
            memory[address + 1] = value.value & 0x00FF;
            break;

        case 8:
            memory[address] = (value.value & 0xFF00000000000000) >> 56;
            memory[address + 1] = (value.value & 0x00FF000000000000) >> 48;
            memory[address + 2] = (value.value & 0x0000FF0000000000) >> 40;
            memory[address + 3] = (value.value & 0x000000FF00000000) >> 32;
            memory[address + 4] = (value.value & 0x00000000FF000000) >> 24;
            memory[address + 5] = (value.value & 0x0000000000FF0000) >> 16;
            memory[address + 6] = (value.value & 0x000000000000FF00) >> 8;
            memory[address + 7] = value.value & 0x00000000000000FF;
            break;
    }
}

function readMemory(address, length) {
    switch (length) {
        case 1:
            return memory[address];

        case 2:
            return (memory[address] << 8) | memory[address + 1];

        case 8:
            return (memory[address] << 56) | (memory[address + 1] << 48) | (memory[address + 2] << 40) | (memory[address + 3] << 32) | (memory[address + 4] << 24) | (memory[address + 5] << 16) | (memory[address + 6] << 8) | memory[address + 7];
    }
}

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

function ssk() {
    //TODO: Set storage key
}

function isk(targetRegister, sourceRegister) {
    //TODO: Privileged operation
    //TODO: Get storage key
}

function svc(number) {
    writeMemory(32, {
        length: 8,
        value: psw
    });
    //TODO: Store interrupt number
    psw = readMemory(96, 8);   
}

function basr() {
    //TODO: Modes
}

function lpr(targetRegister, sourceRegister) {
    gpr[targetRegister] = Math.abs(gpr[sourceRegister]);
    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else
        writePSW("CC", 2);
}

function lnr(targetRegister, sourceRegister) {
    gpr[targetRegister] = -Math.abs(gpr[sourceRegister]);
    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else
        writePSW("CC", 1);
}

function ltr(targetRegister, sourceRegister) {
    gpr[targetRegister] = gpr[sourceRegister];

    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);

    if (gpr[targetRegister] > 0)
        writePSW("CC", 1);

    if (gpr[targetRegister] < 0)
        writePSW("CC", 2);
}

function lcr(targetRegister, sourceRegister) {
    gpr[targetRegister] = -gpr[sourceRegister];
    
    if (gpr[targetRegister] === 0x80000000)
        writePSW("CC", 3);
    else if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 2);

    //TODO: Operation exception
}

function nr(targetRegister, sourceRegister) {
    gpr[targetRegister] &= gpr[sourceRegister];
    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else
        writePSW("CC", 1);
}

function clr(r1, r2) {
    if (gpr[r1] === gpr[r2])
        writePSW("CC", 0);
    else if (gpr[r1] < gpr[r2])
        writePSW("CC", 1);
    else if (gpr[r1] > gpr[r2])
        writePSW("CC", 2);
}

function or(targetRegister, sourceRegister) {
    gpr[targetRegister] |= gpr[sourceRegister];
    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else
        writePSW("CC", 1);
}

function xr(targetRegister, sourceRegister) {
    gpr[targetRegister] ^= gpr[sourceRegister];
    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else
        writePSW("CC", 1);
}

function lr(targetRegister, sourceRegister) {
    gpr[targetRegister] = gpr[sourceRegister];
}

function cr(r1, r2) {
    if (gpr[r1] === gpr[r2])
        writePSW("CC", 0);
    else if (gpr[r1] < gpr[r2])
        writePSW("CC", 1);
    else if (gpr[r1] > gpr[r2])
        writePSW("CC", 2);
}

function ar(targetRegister, sourceRegister) {
    let oldTargetRegister = gpr[targetRegister];
    gpr[targetRegister] += gpr[sourceRegister];
    if ((oldTargetRegister >= 0 && gpr[sourceRegister] >= 0 && gpr[targetRegister] < 0) || (oldTargetRegister < 0 && gpr[sourceRegister] < 0 && gpr[targetRegister] >= 0))
        writePSW("CC", 3);
    else if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);

    //TODO: Operation exception
}

function sr(targetRegister, sourceRegister) {
    let oldTargetRegister = gpr[targetRegister];
    gpr[targetRegister] -= gpr[sourceRegister];
    if ((oldTargetRegister >= 0 && gpr[sourceRegister] < 0 && gpr[targetRegister] < 0) || (oldTargetRegister < 0 && gpr[sourceRegister] >= 0 && gpr[targetRegister] >= 0))
        writePSW("CC", 3);
    else if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);

    //TODO: Operation exception
}

function mr(targetRegister, sourceRegister) {
    if (targetRegister % 2 === 1) {
        //TODO: Operation exception
        return;
    }

    let result = gpr[targetRegister + 1] * gpr[sourceRegister];
    gpr[targetRegister] = (result & 0xFFFFFFFF00000000) >> 32;
    gpr[targetRegister + 1] = result & 0x00000000FFFFFFFF;
}

function dr(targetRegister, sourceRegister) {
    if (targetRegister % 2 === 1 || gpr[sourceRegister] === 0) {
        //TODO: Operation exception
        return;
    }

    let divident = (gpr[targetRegister] << 32) | (gpr[targetRegister + 1]);
    gpr[targetRegister] = divident / gpr[sourceRegister];
    gpr[targetRegister + 1] = divident % gpr[sourceRegister];

    //TODO: Operation exception
}

function alr(targetRegister, sourceRegister) {
    let oldTargetRegister = gpr[targetRegister];
    gpr[targetRegister] += gpr[sourceRegister];

    if (gpr[targetRegister] === 0)
        writePSW("CC", readPSW() & 2);
    else
        writePSW("CC", readPSW() | 1);

    if (gpr[targetRegister] < oldTargetRegister)
        writePSW("CC", readPSW() | 2);
    else
        writePSW("CC", readPSW() & 1);
}

function slr(targetRegister, sourceRegister) {
    let oldTargetRegister = gpr[targetRegister];
    gpr[targetRegister] -= gpr[sourceRegister];

    if (gpr[targetRegister] === 0)
        writePSW("CC", readPSW() & 2);
    else
        writePSW("CC", readPSW() | 1);

    if (gpr[targetRegister] > oldTargetRegister)
        writePSW("CC", readPSW() | 2);
    else
        writePSW("CC", readPSW() & 1);
}

function lpdr(targetRegister, sourceRegister) {
    gpr[targetRegister] = Math.abs(gpr[sourceRegister]);
    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else
        writePSW("CC", 2);
}

function lndr(targetRegister, sourceRegister) {
    gpr[targetRegister] = -Math.abs(gpr[sourceRegister]);
    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else
        writePSW("CC", 1);
}

function ltdr(targetRegister, sourceRegister) {
    gpr[targetRegister] = gpr[sourceRegister];

    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);

    if (gpr[targetRegister] < 0)
        writePSW("CC", 1);

    if (gpr[targetRegister] > 0)
        writePSW("CC", 2);
}

function lcdr(r1, r2) {
    if (gpr[r1] === gpr[r2])
        writePSW("CC", 0);
    
    if (gpr[r1] < gpr[r2])
        writePSW("CC", 1);

    if (gpr[r1] > gpr[r2])
        writePSW("CC", 2);
}

function hdr(targetRegister, sourceRegister) {
    gpr[targetRegister] = gpr[sourceRegister] / 2;
}

function lrdr(targetRegister, sourceRegister) {
    //TODO
}

function mxr(targetRegister, sourceRegister) {
    if (targetRegister % 2 === 1) {
        //TODO: Operation exception
        return;
    }

    let result = gpr[targetRegister + 1] * gpr[sourceRegister];
    gpr[targetRegister] = (result & 0xFFFFFFFF00000000) >> 32;
    gpr[targetRegister + 1] = result & 0x00000000FFFFFFFF;
}

function mxdr(targetRegister, sourceRegister) {
    if (targetRegister % 2 === 1) {
        //TODO: Operation exception
        return;
    }

    let result = gpr[targetRegister + 1] * gpr[sourceRegister];
    gpr[targetRegister] = (result & 0xFFFFFFFF00000000) >> 32;
    gpr[targetRegister + 1] = result & 0x00000000FFFFFFFF;
}

function ldr(targetRegister, sourceRegister) {
    gpr[targetRegister] = gpr[sourceRegister];
}

function cdr() {
    //TODO
}

function adr() {
    //TODO
}

function sdr() {
    //TODO
}

function mdr() {
    //TODO
}

function ddr() {
    //TODO
}

function awr(targetRegister, sourceRegister) {
    let oldTargetRegister = targetRegister;
    gpr[targetRegister] += gpr[sourceRegister];

    if (gpr[targetRegister] < oldTargetRegister)
        writePSW("CC", 3);
    else if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);
}

function swr(targetRegister, sourceRegister) {
    let oldTargetRegister = targetRegister;
    gpr[targetRegister] -= gpr[sourceRegister];

    if (gpr[targetRegister] > oldTargetRegister)
        writePSW("CC", 3);
    else if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);
}

function lper(targetRegister, sourceRegister) {
    gpr[targetRegister] = Math.abs(gpr[sourceRegister]);
    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else
        writePSW("CC", 2);
}

function lner(targetRegister, sourceRegister) {
    gpr[targetRegister] = -Math.abs(gpr[sourceRegister]);
    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else
        writePSW("CC", 1);
}

function lter(targetRegister, sourceRegister) {
    gpr[targetRegister] = gpr[sourceRegister];
    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);
}

function lcer(targetRegister, sourceRegister) {
    gpr[targetRegister] = -gpr[sourceRegister];
    if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);
}

function her(targetRegister, sourceRegister) {
    gpr[targetRegister] = gpr[sourceRegister] / 2;
}

function lrer() {
    //TODO
}

function axr(targetRegister, sourceRegister) {
    let oldTargetRegister = gpr[targetRegister];
    gpr[targetRegister] += gpr[sourceRegister];

    if (gpr[targetRegister] < oldTargetRegister)
        writePSW("CC", 3);
    else if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);
}

function sxr(targetRegister, sourceRegister) {
    let oldTargetRegister = gpr[targetRegister];
    gpr[targetRegister] -= gpr[sourceRegister];

    if (gpr[targetRegister] > oldTargetRegister)
        writePSW("CC", 3);
    else if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);
}

function ler(targetRegister, sourceRegister) {
    gpr[targetRegister] = gpr[sourceRegister];
}

function cer(r1, r2) {
    if (gpr[r1] === gpr[r2])
        writePSW("CC", 0);
    else if (gpr[r1] < gpr[r2])
        writePSW("CC", 1);
    else if (gpr[r1] > gpr[r2])
        writePSW("CC", 2);
}

function aer(targetRegister, sourceRegister) {
    let oldTargetRegister = gpr[targetRegister];
    gpr[targetRegister] += gpr[sourceRegister];

    if (gpr[targetRegister] < oldTargetRegister)
        writePSW("CC", 3);
    else if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);
}

function ser(targetRegister, sourceRegister) {
    let oldTargetRegister = gpr[targetRegister];
    gpr[targetRegister] -= gpr[sourceRegister];

    if (gpr[targetRegister] > oldTargetRegister)
        writePSW("CC", 3);
    else if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);
}

function mer() {
    //TODO
}

function der() {
    //TODO
}

function aur(targetRegister, sourceRegister) {
    let oldTargetRegister = gpr[targetRegister];
    gpr[targetRegister] += gpr[sourceRegister];

    if (gpr[targetRegister] < oldTargetRegister)
        writePSW("CC", 3);
    else if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);
}

function sur(targetRegister, sourceRegister) {
    let oldTargetRegister = gpr[targetRegister];
    gpr[targetRegister] -= gpr[sourceRegister];

    if (gpr[targetRegister] > oldTargetRegister)
        writePSW("CC", 3);
    else if (gpr[targetRegister] === 0)
        writePSW("CC", 0);
    else if (gpr[targetRegister] < 0)
        writePSW("CC", 1);
    else if (gpr[targetRegister] > 0)
        writePSW("CC", 2);
}

function sth(r1, x2, b2, d2) {
    writeMemory(gpr[b2] + gpr[d2] + x2, {
        length: 2,
        value: gpr[r1] & 0x000000000000FFFF
    });
}

function la(targetRegister, offset, indexRegister, baseRegister) {
    let index = (indexRegister === 0) ? 0 : gpr[indexRegister];
    let base = (baseRegister === 0) ? 0 : gpr[baseRegister];
    gpr[targetRegister] = base + index + offset;
}

function stc(r1, x2, b2, d2) {
    writeMemory(gpr[b2] + gpr[d2] + x2, {
        length: 1,
        value: (gpr[r1] & 0x00000000FF000000) >> 24
    });
}

function ic(r1, x2, b2, d2) {
    gpr[r1] = (gpr[r1] & 0xFFFFFFFF00FFFFFF) | (readMemory(gpr[b2] + gpr[d2] + x2) << 24);
}

function ex(r1, x2, b2, d2) {
    let address = gpr[b2] + gpr[d2] + x2;
    if (address % 2 === 1) {
        //TODO: Address exception
        return;
    }

    if (readMemory(address, 1) === 0x44) {
        //TODO: Execute exception
        return;
    }

    //TODO: Operation exception
    //TODO: Protect violate exception
    writeMemory(address + 1, {
        length: 1,
        value: readMemory(address + 1) | gpr[r1]
    });

    //TODO: Execute
}

function bal() {
    //TODO: Modes
}

function bct(targetRegister, indexRegister, baseRegister, displacement) {
    let index = (indexRegister === 0) ? 0 : gpr[indexRegister];
    let base = (baseRegister === 0) ? 0 : gpr[baseRegister];
    gpr[targetRegister]--;
    if (gpr[targetRegister] === 0) {
        if ((base + index + displacement) >= memory.length) {
            //TODO: Specification exception
            return;
        }

        if ((base + index + displacement) % 2 === 1) {
            //TODO: Address exception
            return;
        }

        //TODO: Protect violate exception
        writePSW("IA", base + index + displacement);
    }
}

function bc(mask, indexRegister, baseRegister, offset) {
    if (baseRegister === 0 || mask === 0)
        return;

    let index = (indexRegister === 0) ? 0 : gpr[indexRegister];
    let base = gpr[baseRegister];
    let conditionMask = 8 >> readPSW("CC");
    if (mask === 15 || conditionMask & mask !== 0) {
        if ((base + index + offset) >= memory.length) {
            //TODO: Operation exception
            return;
        }
        
        if ((base + index + offset) % 2 === 1) {
            //TODO: Operation exception
            return;
        }

        //TODO: Protect violate exception
        writePSW("IA", base + index + offset);
    }
}

function lh(targetRegister, indexRegister, baseRegister, displacement) {
    let index = (indexRegister === 0) ? 0 : gpr[indexRegister];
    let base = (baseRegister === 0) ? 0 : gpr[baseRegister];
    let address = base + index + displacement;

    if (address >= memory.length) {
        //TODO: Operation exception
        return;
    }

    if (address % 2 === 1) {
        //TODO: Operation exception
        return;
    }

    //TODO: Protect violate exception
    gpr[targetRegister] = (gpr[targetRegister] & 0xFFFFFFFFFFFF0000) | readMemory(address, 2);
}

function ch(r1, x2, b2, d2) {
    let index = (x2 === 0) ? 0 : gpr[x2];
    let base = (b2 === 0) ? 0 : gpr[b2];
    let address = base + index + d2;

    if (address >= memory.length) {
        //TODO: Operation exception
        return;
    }

    if (address % 2 === 1) {
        //TODO: Operation exception
        return;
    }

    //TODO: Protect violate exception
    if (gpr[r1] === readMemory(address, 2))
        writePSW("CC", 0);
    else if (gpr[r1] < readMemory(address, 2))
        writePSW("CC", 1);
    else if (gpr[r1] > readMemory(address, 2))
        writePSW("CC", 2);
}

function ah(r1, x2, b2, d2) {
    let index = (x2 === 0) ? 0 : gpr[x2];
    let base = (b2 === 0) ? 0 : gpr[b2];
    let address = base + index + d2;

    if (address >= memory.length) {
        //TODO: Operation exception
        return;
    }

    if (address % 2 === 1) {
        //TODO: Operation exception
        return;
    }

    //TODO: Protect violate exception
    let oldR1 = gpr[r1];
    gpr[r1] += readMemory(address, 2);

    if (gpr[r1] < oldR1)
        writePSW("CC", 3);
    else if (gpr[r1] === 0)
        writePSW("CC", 0);
    else if (gpr[r1] < 0)
        writePSW("CC", 1);
    else if (gpr[r1] > 0)
        writePSW("CC", 2);
}

function sh(r1, x2, b2, d2) {
    let index = (x2 === 0) ? 0 : gpr[x2];
    let base = (b2 === 0) ? 0 : gpr[b2];
    let address = base + index + d2;

    if (address >= memory.length) {
        //TODO: Operation exception
        return;
    }

    if (address % 2 === 1) {
        //TODO: Operation exception
        return;
    }

    //TODO: Protect violate exception
    let oldR1 = gpr[r1];
    gpr[r1] -= readMemory(address, 2);

    if (gpr[r1] > oldR1)
        writePSW("CC", 3);
    else if (gpr[r1] === 0)
        writePSW("CC", 0);
    else if (gpr[r1] < 0)
        writePSW("CC", 1);
    else if (gpr[r1] > 0)
        writePSW("CC", 2);
}

function mh(r1, x2, b2, d2) {
    let index = (x2 === 0) ? 0 : gpr[x2];
    let base = (b2 === 0) ? 0 : gpr[b2];
    let address = base + index + d2;

    if (address >= memory.length) {
        //TODO: Operation exception
        return;
    }

    if (address % 2 === 1) {
        //TODO: Operation exception
        return;
    }

    //TODO: Protect violate exception
    gpr[targetRegister] *= readMemory(address, 2);
}

function bas() {
    //TODO
}

function cvd(r1, x2, b2, d2) {
    let index = (x2 === 0) ? 0 : gpr[x2];
    let base = (b2 === 0) ? 0 : gpr[b2];
    let address = base + index + d2;

    if (address >= memory.length) {
        //TODO: Operation exception
        return;
    }

    if (address % 8 !== 0) {
        //TODO: Operation exception
        return;
    }

    //TODO: Protect violate exception
    writeMemory(address, {
        length: 8,
        value: ((gpr[r1] % 10) << 4) | ((gpr[r1] / 10 % 10) << 8) | ((gpr[r1] / 100 % 10) << 12) | ((gpr[r1] / 1000 % 10) << 16) | ((gpr[r1] / 10000 % 10) << 20) | ((gpr[r1] / 100000 % 10) << 24) | ((gpr[r1] / 1000000 % 10) << 28) | ((gpr[r1] / 10000000 % 10) << 32) | ((gpr[r1] / 100000000 % 10) << 36) | ((gpr[r1] / 1000000000 % 10) << 40) | ((gpr[r1] / 10000000000 % 10) << 44) | ((gpr[r1] / 100000000000 % 10) << 48) | ((gpr[r1] / 1000000000000 % 10) << 52) | ((gpr[r1] / 10000000000000 % 10) << 56) | ((gpr[r1] / 100000000000000 % 10) << 60)
        //TODO: Store sign
    });
}

function cvb(r1, x2, b2, d2) {
    let index = (x2 === 0) ? 0 : gpr[x2];
    let base = (b2 === 0) ? 0 : gpr[b2];
    let address = base + index + d2;

    if (address >= memory.length) {
        //TODO: Operation exception
        return;
    }

    if (address % 8 !== 0) {
        //TODO: Operation exception
        return;
    }

    //TODO: Protect violate exception
    let value = readMemory(address, 8);
    gpr[r1] = ((value & 0x00000000000000F0) >> 4) + (((value & 0x0000000000000F00) >> 8) * 10) + (((value & 0x000000000000F000) >> 12) * 100) + (((value & 0x00000000000F0000) >> 16) * 1000) + (((value & 0x0000000000F00000) >> 20) * 10000) + (((value & 0x000000000F000000) >> 24) * 100000) + (((value & 0x00000000F0000000) >> 28) * 1000000) + (((value & 0x0000000F00000000) >> 32) * 10000000) + (((value & 0x000000F000000000) >> 36) * 100000000) + (((value & 0x00000F0000000000) >> 40) * 1000000000) + (((value & 0x0000F00000000000) >> 44) * 10000000000) + (((value & 0x000F000000000000) >> 48) * 100000000000) + (((value & 0x00F0000000000000) >> 52) * 1000000000000) + (((value & 0x0F00000000000000) >> 56) * 10000000000000) + (((value & 0xF000000000000000) >> 60) * 100000000000000);
    //TODO: Read the sign
}

function setMemorySize(size) {
    memory = new Array(parseInt(size) * 1024);
}

document.getElementById("memory-size").onchange = (e) => {
    setMemorySize(e.target.value);
};