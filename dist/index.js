#!/usr/bin/env node 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dayjs/locale/pt-br");
const getGitCommits_1 = require("./getGitCommits");
const saveReportToJson_1 = require("./saveReportToJson");
const pdf_1 = require("./pdf");
async function main() {
    try {
        const gitCommits = await (0, getGitCommits_1.getGitCommits)();
        await (0, saveReportToJson_1.saveReportToJson)(gitCommits, 'git_report.json');
        const pdfService = new pdf_1.GitReportPdfService({ commits: gitCommits });
        await pdfService.init();
        pdfService.generateTables();
        await pdfService.export();
    }
    catch (error) {
        console.error('Error generating Git report or PDF:', error);
    }
}
main();
