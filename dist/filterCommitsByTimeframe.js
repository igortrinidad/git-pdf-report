"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterCommitsByTimeframe = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const getTimeframes_1 = require("./getTimeframes");
const filterCommitsByTimeframe = (commits, timeframe) => {
    if (timeframe === getTimeframes_1.timeframeAllTime) {
        return commits;
    }
    return commits.filter(commit => {
        const commitDate = (0, dayjs_1.default)(commit.date, 'ddd MMM D HH:mm:ss YYYY ZZ').format('YYYY-MM-DD HH:mm:ss');
        return (0, dayjs_1.default)(commitDate).isAfter((0, dayjs_1.default)(timeframe.init)) && (0, dayjs_1.default)(commitDate).isBefore((0, dayjs_1.default)(timeframe.end));
    });
};
exports.filterCommitsByTimeframe = filterCommitsByTimeframe;
