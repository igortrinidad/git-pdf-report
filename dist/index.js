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
const confirm_1 = __importDefault(require("@inquirer/confirm"));
const getRepositoryName_1 = require("./getRepositoryName");
const dayjs_1 = __importDefault(require("dayjs"));
const getTimeframes_1 = require("./getTimeframes");
const filterCommitsByTimeframe_1 = require("./filterCommitsByTimeframe");
async function main() {
    try {
        const repositoryName = await (0, getRepositoryName_1.getRepositoryName)();
        const title = (await (0, prompts_1.input)({ message: 'Insert the title of the report: ', default: repositoryName })) ?? 'Git Report';
        const timeframe = await (0, prompts_1.select)({
            message: 'Select a package manager',
            choices: getTimeframes_1.getTimeframes.map((timeframe) => {
                return {
                    name: timeframe.label,
                    value: timeframe,
                    checked: timeframe.label === 'All time'
                };
            }),
        });
        const generateJson = await (0, confirm_1.default)({ message: 'Generate .json report as well?' });
        const gitCommits = await (0, getGitCommits_1.getGitCommits)();
        const filteredCommits = (0, filterCommitsByTimeframe_1.filterCommitsByTimeframe)(gitCommits, timeframe);
        console.log('Found commits:', gitCommits.length, ' Filtered commits:', filteredCommits.length);
        if (!filteredCommits.length) {
            console.log('No commits found for the selected timeframe, the report will not be generated.');
            return;
        }
        const date = (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm');
        const filename = `${title} ${date}`.replace(/[^a-z0-9\s\.]/gi, '_').replace(/ /g, '_').replace(/_+/g, '_');
        if (generateJson) {
            await (0, saveReportToJson_1.saveReportToJson)(gitCommits, `${filename}.json`);
        }
        const pdfService = new pdf_1.GitReportPdfService({ title, date, filename, commits: gitCommits });
        await pdfService.init();
        pdfService.generateTables();
        await pdfService.export();
        console.log('Git pdf report generated successfully!');
    }
    catch (error) {
        console.error('Error generating Git report or PDF:', error);
    }
}
main();
