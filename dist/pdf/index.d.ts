import { jsPDF } from "jspdf";
import type { ICommit } from '../types/commit';
export declare class GitReportPdfService {
    doc: jsPDF;
    sourceUrl: string;
    title: string;
    subtitle: string;
    date: string | null;
    margins: {
        top: number;
        right: number;
        left: number;
        bottom: number;
    };
    lastTablePage: any;
    filename: string;
    pageWidth: number;
    pageHeight: number;
    yTop: number;
    yBottom: number;
    xLeft: number;
    xRight: number;
    commits: ICommit[];
    constructor(args: any);
    init(): Promise<void>;
    setDocInfo(): void;
    registerCustomFonts(): Promise<void>;
    addPageHeader(): Promise<void>;
    addPageFooter(): void;
    addLink(): void;
    addPageCount(): Promise<void>;
    addPagesPattern(): Promise<void>;
    addSpecificPageInfo(): Promise<void>;
    export(): Promise<void>;
    getThePrintableArea(): {
        width: number;
        height: number;
    };
    getHorizontalMargins(): number;
    getVerticalMargins(): number;
    generateTables(): void;
    generateCommitsTables(): void;
    getCommitTableHead(commit: ICommit): {
        content: string | number;
        colSpan: number;
        styles: {
            fontSize: number;
            font: string;
            textColor: string;
            cellPadding: {
                top: number;
                bottom: number;
                left: number;
            };
        };
    }[][];
    getCommitFilesTableBody(commit: ICommit): {
        content: any;
        colSpan: number;
        styles: {
            fontSize: number;
            cellPadding: {
                top: number;
                bottom: number;
                left: number;
            };
        };
    }[][];
    getFormattedTableContent(content: string | number, colSpan?: number, fontSize?: number, font?: string, color?: string): {
        content: string | number;
        colSpan: number;
        styles: {
            fontSize: number;
            font: string;
            textColor: string;
            cellPadding: {
                top: number;
                bottom: number;
                left: number;
            };
        };
    };
    getTableCellWidth(quantity: number): number;
}
