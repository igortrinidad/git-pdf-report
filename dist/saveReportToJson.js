"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveReportToJson = void 0;
const fs_1 = __importDefault(require("fs"));
async function saveReportToJson(report, outputFile) {
    fs_1.default.writeFileSync(outputFile, JSON.stringify(report, null, 4));
}
exports.saveReportToJson = saveReportToJson;
