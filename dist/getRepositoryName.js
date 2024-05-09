"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepositoryName = void 0;
const { exec } = require('child_process');
const getRepositoryName = () => {
    return new Promise((resolve, reject) => {
        exec('git config --get remote.origin.url', (error, stdout, stderr) => {
            if (error) {
                resolve(null);
                return;
            }
            const remoteUrl = stdout.trim();
            const matches = remoteUrl.match(/\/([^\/]+?)(?:\.git)?$/);
            if (matches && matches.length > 1) {
                const repositoryName = matches[1];
                resolve(repositoryName);
            }
            else {
                resolve(null);
            }
        });
    });
};
exports.getRepositoryName = getRepositoryName;
