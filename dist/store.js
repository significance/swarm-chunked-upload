"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileOrCreate = exports.loadState = exports.storeState = void 0;
const count = 2 ** 16;
const size = count * 4;
function storeState(state) {
    const buffer = Buffer.alloc(size);
    for (let i = 0; i < count; i++) {
        buffer.writeInt16LE(state[i], i * 4);
    }
    return buffer;
}
exports.storeState = storeState;
function loadState(buffer) {
    const state = [];
    for (let i = 0; i < count; i++) {
        state[i] = buffer.readInt16LE(i * 4);
    }
    return state;
}
exports.loadState = loadState;
function readFileOrCreate() {
    try {
        return require('fs').readFileSync('state.bin');
    }
    catch (e) {
        return Buffer.alloc(size);
    }
}
exports.readFileOrCreate = readFileOrCreate;
