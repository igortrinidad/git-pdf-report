"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.default = (imagePath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(imagePath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            // Check if the file is a valid image
            if (!isImage(data)) {
                reject(new Error('The provided file is not a valid image.'));
                return;
            }
            const width = readUInt16LE(data, 0x12);
            const height = readUInt16LE(data, 0x16);
            resolve({ width, height });
        });
    });
};
function isImage(data) {
    return ((data[0] === 0xFF && data[1] === 0xD8) || // JPEG
        (data[0] === 0x89 && data.toString('ascii', 1, 4) === 'PNG') // PNG
    );
}
function readUInt16LE(buffer, offset) {
    return buffer.readUInt16LE(offset);
}
