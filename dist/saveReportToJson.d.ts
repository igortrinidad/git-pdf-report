/// <reference types="node" />
import fs from 'fs';
import type { ICommit } from './types/commit';
export declare function saveReportToJson(report: ICommit[], outputFile: fs.PathOrFileDescriptor): Promise<void>;
