import type { ICommit } from '../types/commit';
export declare class GitReportPdfService {
    doc: any;
    colors: {
        white: string;
        zinc100: string;
        zinc200: string;
        zinc300: string;
        zinc400: string;
        zinc500: string;
        zinc600: string;
        zinc700: string;
        zinc800: string;
        zinc900: string;
        orange600: string;
        amber600: string;
        cyan700: string;
        cyan900: string;
    };
    sourceUrl: string;
    headline: string;
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
    setPageInfo(): void;
    registerCustomFonts(): Promise<void>;
    addPage(): Promise<void>;
    addHeaderAndFooterNotes(): Promise<void>;
    addPageHeader(): Promise<void>;
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
    }[][];
    getTableHeaderContent(content: string | number, colSpan?: number, fontSize?: number): {
        content: string | number;
        colSpan: number;
        styles: {
            fontSize: number;
            font: string;
            cellPadding: {
                top: number;
                bottom: number;
                left: number;
            };
        };
    };
    getTableCellWidth(quantity: number): number;
}
