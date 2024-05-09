interface ICommitFile {
    path: string;
    url: string | null;
}
export interface ICommit {
    commit: string;
    author: string;
    author_email: string;
    branch: string;
    message: string;
    date: string;
    files: ICommitFile[];
}
export {};
