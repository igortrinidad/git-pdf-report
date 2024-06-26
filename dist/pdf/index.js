"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitReportPdfService = void 0;
/* eslint-disable no-unused-vars */
const jspdf_1 = require("jspdf");
const dayjs_1 = __importDefault(require("dayjs"));
const jspdf_autotable_1 = __importDefault(require("jspdf-autotable"));
const Lato_Bold_1 = require("./fonts/Lato-Bold");
const Lato_Regular_1 = require("./fonts/Lato-Regular");
const Lato_Light_1 = require("./fonts/Lato-Light");
class GitReportPdfService {
    constructor(args) {
        this.doc = null;
        this.sourceUrl = '';
        this.title = 'title';
        this.subtitle = 'Subtitle';
        this.date = null;
        this.margins = {
            top: 45,
            right: 20,
            left: 20,
            bottom: 60
        };
        this.lastTablePage = null;
        this.filename = '';
        this.pageWidth = 0;
        this.pageHeight = 0;
        this.yTop = 0;
        this.yBottom = 0;
        this.xLeft = 0;
        this.xRight = 0;
        this.commits = [];
        this.doc = new jspdf_1.jsPDF({ format: 'a4', unit: 'px', orientation: args.orientation || 'portrait' });
        this.title = args.title ?? 'Git report';
        this.filename = args.filename ?? 'Git report';
        this.date = args.date ?? (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm');
        this.commits = args.commits ?? [];
    }
    async init() {
        this.setDocInfo();
        await this.registerCustomFonts();
    }
    setDocInfo() {
        this.pageWidth = this.doc.internal.pageSize.getWidth();
        this.pageHeight = this.doc.internal.pageSize.getHeight();
        this.xLeft = this.margins.left;
        this.xRight = this.pageWidth - this.margins.right;
        this.yTop = this.margins.top;
        this.yBottom = this.pageHeight - this.margins.bottom;
    }
    async registerCustomFonts() {
        (0, Lato_Bold_1.registerLatoBold)(this.doc);
        (0, Lato_Regular_1.registerLatoRegular)(this.doc);
        (0, Lato_Light_1.registerLatoLight)(this.doc);
        this.doc.setFont('Lato-Regular');
    }
    async addPageHeader() {
        this.doc.setFillColor('#374151');
        this.doc.rect(0, 0, this.pageWidth, this.margins.top, 'F');
        let captionsXPosition = this.margins.left;
        // const image = await imageLoader({ imageUrl: `/images/logo/128w/LOGO_2_1_128w.png`, returnsBase64: true })
        // if(image) {
        //   const { width, height } = await getImageDimensions(image)
        //   const { width: logoWidth, height: logoHeight } = scaleDimensions({ width, height, maxWidth: this.pageWidth, maxHeight : this.margins.top * 0.5 })
        //   const logoYPosition = (this.margins.top - logoHeight) / 2
        //   this.doc.addImage(image, this.margins.left, logoYPosition, logoWidth, logoHeight, 'logo_calculo_previdencia')    
        //   const marginGap = 10
        //   const logoBorderLineXPosition = this.margins.left + logoWidth + marginGap
        //   captionsXPosition = logoBorderLineXPosition + marginGap
        // }
        const captionsYPositionStart = 20;
        this.doc.setFont('Lato-Bold');
        this.doc.setTextColor('#f3f4f6');
        this.doc.setFontSize(10);
        this.doc.text('Project report', captionsXPosition, captionsYPositionStart, { baseline: 'bottom' });
        this.doc.setFont('Lato-Regular');
        this.doc.setTextColor('#f3f4f6');
        this.doc.setFontSize(12);
        this.doc.text(`${this.title}`, captionsXPosition, captionsYPositionStart + 12, { baseline: 'bottom' });
    }
    addPageFooter() {
        this.doc.setFillColor('#374151');
        this.doc.rect(0, this.yBottom + 25, this.pageWidth, this.margins.bottom - 25, 'F');
        this.doc.setFontSize(9);
        this.doc.setFont('Lato-Regular');
        this.doc.text(`Generated at ${this.date}`, this.margins.left, this.pageHeight - 14, { baseline: 'bottom' });
    }
    addLink() {
        this.doc.setFont('Lato-Bold');
        this.doc.setTextColor('#3b82f6');
        this.doc.setFontSize(9);
        this.doc.textWithLink('git-pdf-report', this.xRight / 2 + 30, this.pageHeight - 14, {
            url: 'https://github.com/igortrinidad/git-pdf-report',
            align: 'right',
        });
    }
    async addPageCount() {
        this.doc.setFont('Lato-Bold');
        this.doc.setFontSize(8);
        this.doc.setTextColor('#f3f4f6');
        const pages = this.doc.internal.getNumberOfPages();
        this.doc.text(`${this.doc.internal.getCurrentPageInfo().pageNumber} - ${pages}`, this.pageWidth - this.margins.right, this.pageHeight - 14, { align: 'right' });
    }
    async addPagesPattern() {
        const pages = this.doc.internal.getNumberOfPages();
        for (let i = 1; i < pages + 1; i++) {
            this.doc.setPage(i);
            await this.addPageHeader();
            this.addPageFooter();
            this.addLink();
            this.addPageCount();
            this.addSpecificPageInfo();
        }
    }
    async addSpecificPageInfo() {
    }
    async export() {
        await this.addPagesPattern();
        this.doc.save(this.filename + '.pdf');
    }
    getThePrintableArea() {
        const pageWidth = this.doc.internal.pageSize.getWidth();
        const pageHeight = this.doc.internal.pageSize.getHeight();
        return {
            width: pageWidth - this.getHorizontalMargins(),
            height: pageHeight - this.getVerticalMargins()
        };
    }
    getHorizontalMargins() {
        return (this.margins.left + this.margins.right);
    }
    getVerticalMargins() {
        return (this.margins.top + this.margins.bottom);
    }
    generateTables() {
        this.generateCommitsTables();
    }
    generateCommitsTables() {
        this.commits.forEach((commit) => {
            const head = this.getCommitTableHead(commit);
            const body = this.getCommitFilesTableBody(commit);
            (0, jspdf_autotable_1.default)(this.doc, {
                theme: 'plain',
                body,
                head,
                pageBreak: 'auto',
                showHead: 'firstPage',
                styles: {
                    font: 'Lato-Regular',
                    fontSize: 8,
                },
                bodyStyles: {
                    lineWidth: 0.5,
                    lineColor: '#f3f4f6',
                },
                headStyles: {
                    lineWidth: 0,
                    lineColor: '#f3f4f6',
                },
                columnStyles: {
                    0: { cellWidth: this.getTableCellWidth(2) },
                    1: { cellWidth: this.getTableCellWidth(2) },
                },
                margin: { ...this.margins, top: this.margins.top + 30 },
            });
        });
    }
    getCommitTableHead(commit) {
        return [
            [
                this.getFormattedTableContent('Contribution title / commit message', 2, 10, 'Lato-Bold', '#a1a1aa'),
            ],
            [
                this.getFormattedTableContent(commit.message, 2, 12),
            ],
            [
                this.getFormattedTableContent('Author', 1, 10, 'Lato-Bold', '#a1a1aa'),
                this.getFormattedTableContent('Branch', 1, 10, 'Lato-Bold', '#a1a1aa'),
            ],
            [
                this.getFormattedTableContent(`${commit.author} (${commit.author_email})`, 1, 10),
                this.getFormattedTableContent(commit.branch, 1, 10),
            ],
            [
                this.getFormattedTableContent('Date', 1, 10, 'Lato-Bold', '#a1a1aa'),
                this.getFormattedTableContent('Files changed', 1, 10, 'Lato-Bold', '#a1a1aa'),
            ],
            [
                this.getFormattedTableContent((0, dayjs_1.default)(commit.date).format('dddd, YYYY-MM-DD HH:mm:ss'), 1, 10),
                this.getFormattedTableContent(commit.files.length, 1, 10)
            ],
            [
                this.getFormattedTableContent('\nFiles', 2, 10, 'Lato-Bold', '#a1a1aa'),
            ],
        ];
    }
    getCommitFilesTableBody(commit) {
        return commit.files.map((file) => ([{
                content: file.path,
                colSpan: 2,
                styles: {
                    fontSize: 10,
                    cellPadding: {
                        top: 2,
                        bottom: 2,
                        left: 3
                    }
                },
            }]));
    }
    getFormattedTableContent(content, colSpan = 1, fontSize = 10, font = 'Lato-Bold', color = '#164e63') {
        return {
            content,
            colSpan,
            styles: {
                fontSize,
                font,
                textColor: color,
                cellPadding: {
                    top: 2,
                    bottom: 2,
                    left: 3
                }
            },
        };
    }
    getTableCellWidth(quantity) {
        return (this.pageWidth - this.margins.left - this.margins.right - 10) / quantity;
    }
}
exports.GitReportPdfService = GitReportPdfService;
