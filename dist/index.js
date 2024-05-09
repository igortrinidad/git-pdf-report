#!/usr/bin/env node 

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getGitCommits_1 = require("./getGitCommits");
const saveReportToJson_1 = require("./saveReportToJson");
const pdf_1 = require("./pdf");
const prompts_1 = require("@inquirer/prompts");
const getRepositoryName_1 = require("./getRepositoryName");
const dayjs_1 = __importDefault(require("dayjs"));
async function main() {
    try {
        const repositoryName = await (0, getRepositoryName_1.getRepositoryName)();
        const title = (await (0, prompts_1.input)({ message: 'Insert the title of the report: ', default: repositoryName })) ?? 'Git Report';
        const date = (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm');
        const gitCommits = await (0, getGitCommits_1.getGitCommits)();
        const filename = `${title} ${date}`.replace(/[^a-z0-9\s\.]/gi, '_').replace(/ /g, '_').replace(/_+/g, '_');
        await (0, saveReportToJson_1.saveReportToJson)(gitCommits, `${filename}.json`);
        const pdfService = new pdf_1.GitReportPdfService({ title, date, filename, commits: gitCommits });
        await pdfService.init();
        pdfService.generateTables();
        await pdfService.export();
    }
    catch (error) {
        console.error('Error generating Git report or PDF:', error);
    }
}
main();
