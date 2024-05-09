"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitCommits = void 0;
const child_process_1 = require("child_process");
const getRepositoryUrl = async () => {
    return new Promise((resolve, reject) => {
        try {
            (0, child_process_1.exec)('git config --get remote.origin.url', (err, stdout, stderr) => {
                if (err) {
                    return resolve(null);
                }
                const repositoryUrl = stdout.trim().replace('com:', 'com/').replace('git@', 'https://').replace('.git', '');
                resolve(repositoryUrl);
            });
        }
        catch (error) {
            console.error(error);
            resolve(null);
        }
    });
};
const getGitHubFileChangeUrl = (commitHash, filePath, repositoryUrl) => {
    if (!repositoryUrl) {
        return null;
    }
    const baseUrl = repositoryUrl.endsWith('/') ? repositoryUrl.slice(0, -1) : repositoryUrl;
    return `${baseUrl}/commit/${commitHash}#diff-${filePath}`;
};
const getGitCommits = async () => {
    return new Promise(async (resolve, reject) => {
        const repositoryUrl = await getRepositoryUrl();
        (0, child_process_1.exec)('git log --name-only --pretty=format:"{ \\"commit\\": \\"%H\\", \\"author\\": \\"%an\\", \\"author_email\\": \\"%ae\\", \\"date\\": \\"%ad\\", \\"message\\": \\"%f\\", \\"branch\\": \\"%d\\" }"', { maxBuffer: 1024 * 30000 }, (err, stdout, stderr) => {
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
                else if (line && currentCommit) {
                    currentCommit.files.push({
                        path: line.trim(),
                        url: getGitHubFileChangeUrl(currentCommit.commit, line.trim(), repositoryUrl)
                    });
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
