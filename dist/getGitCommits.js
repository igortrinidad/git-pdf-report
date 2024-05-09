"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitCommits = void 0;
const child_process_1 = require("child_process");
const getGitCommits = async () => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)('git log --name-only --pretty=format:"{ \\"commit\\": \\"%H\\", \\"author\\": \\"%an\\", \\"author_email\\": \\"%ae\\", \\"date\\": \\"%ad\\", \\"message\\": \\"%f\\", \\"branch\\": \\"%d\\" }"', (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            const logLines = stdout.trim().split('\n');
            const gitReport = [];
            let currentCommit = null;
            logLines.forEach(line => {
                if (line.startsWith('{')) {
                    if (currentCommit) {
                        gitReport.push(currentCommit);
                    }
                    currentCommit = JSON.parse(line);
                    currentCommit.files = [];
                }
                else if (line.startsWith('branch:')) {
                    if (currentCommit) {
                        currentCommit.branch = line.replace('branch: ', '').trim();
                    }
                }
                else if (line && currentCommit) {
                    currentCommit.files.push(line.trim());
                }
            });
            if (currentCommit) {
                gitReport.push(currentCommit);
            }
            resolve(gitReport);
        });
    });
};
exports.getGitCommits = getGitCommits;
