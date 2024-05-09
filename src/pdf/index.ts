/* eslint-disable no-unused-vars */
import { jsPDF } from "jspdf"
import dayjs from 'dayjs'
import imageLoader from './imageLoader'
import getImageDimensions from './getImageDimensions'
import scaleDimensions from './scaleDimensions'
import autoTable from 'jspdf-autotable'
import type { ICommit } from '../types/commit'
import { registerLatoBold } from './fonts/Lato-Bold'
import { registerLatoRegular } from  './fonts/Lato-Regular'
import { registerLatoLight } from  './fonts/Lato-Light'


export class GitReportPdfService {

  doc: jsPDF = null

  sourceUrl: string = ''
  title: string = 'title'
  subtitle: string = 'Subtitle'
  date: string | null = null

  margins = { 
    top: 45, 
    right: 20, 
    left: 20, 
    bottom: 60
  }

  lastTablePage = null
  
  filename: string = ''

  pageWidth: number = 0
  pageHeight: number = 0
  yTop: number = 0
  yBottom: number = 0
  xLeft: number = 0
  xRight: number = 0

  commits: ICommit[] = []

  constructor(args: any) {
    this.doc = new jsPDF({ format: 'a4', unit: 'px', orientation: args.orientation || 'portrait' })
    this.title = args.title ?? 'Git report'
    this.filename = args.filename ?? 'Git report'
    this.date = args.date ?? dayjs().format('YYYY-MM-DD HH:mm')
    this.commits = args.commits ?? []
  }

  async init() {
    this.setDocInfo()
    await this.registerCustomFonts()
  }

  setDocInfo() {
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
    this.xLeft = this.margins.left
    this.xRight = this.pageWidth - this.margins.right
    this.yTop = this.margins.top
    this.yBottom = this.pageHeight - this.margins.bottom
  }

  async registerCustomFonts() {
    registerLatoBold(this.doc)
    registerLatoRegular(this.doc)
    registerLatoLight(this.doc)
    this.doc.setFont('Lato-Regular')
  }

  async addPageHeader() {
    
    this.doc.setFillColor('#374151')
    this.doc.rect(0, 0, this.pageWidth, this.margins.top, 'F')
    let captionsXPosition = this.margins.left

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

    const captionsYPositionStart = 20
    
    this.doc.setFont('Lato-Bold')
    this.doc.setTextColor('#f3f4f6')
    this.doc.setFontSize(10)
    this.doc.text('Project report', captionsXPosition, captionsYPositionStart, { baseline : 'bottom' })

    this.doc.setFont('Lato-Regular')
    this.doc.setTextColor('#f3f4f6')
    this.doc.setFontSize(12)
    this.doc.text(`${ this.title }`, captionsXPosition, captionsYPositionStart + 12, { baseline : 'bottom' })
    
  }

  addPageFooter() {
    this.doc.setFillColor('#374151')
    this.doc.rect(0, this.yBottom + 25, this.pageWidth, this.margins.bottom - 25, 'F')
    this.doc.setFontSize(9)
    this.doc.setFont('Lato-Regular')
    this.doc.text(`Generated at ${ this.date }`, this.margins.left, this.pageHeight - 14, { baseline : 'bottom' })
  }
  
  addLink() {        
    this.doc.setFont('Lato-Bold')
    this.doc.setTextColor('#3b82f6')
    this.doc.setFontSize(9)
    this.doc.textWithLink( 
      'git-pdf-report', 
      this.xRight / 2 + 30,
      this.pageHeight - 14,
      { 
        url: 'https://github.com/igortrinidad/git-pdf-report', 
        align: 'right',
      } 
    )
  }

  async addPageCount() {
    this.doc.setFont('Lato-Bold')
    this.doc.setFontSize(8)
    this.doc.setTextColor('#f3f4f6')
    const pages = (this.doc as any).internal.getNumberOfPages()
    this.doc.text(`${ (this.doc as any).internal.getCurrentPageInfo().pageNumber } - ${ pages }`, this.pageWidth - this.margins.right, this.pageHeight - 14, { align: 'right' } )
  }
  

  async addPagesPattern() {

    const pages = (this.doc as any).internal.getNumberOfPages()
    for (let i = 1; i < pages + 1 ; i++) {      
      this.doc.setPage(i)
      await this.addPageHeader()
      this.addPageFooter()
      this.addLink()
      this.addPageCount()
      this.addSpecificPageInfo()
    }

  }

  async addSpecificPageInfo() {

  }


  async export() {    
    await this.addPagesPattern()
    this.doc.save(this.filename + '.pdf')
  }

  getThePrintableArea() {
    const pageWidth = this.doc.internal.pageSize.getWidth()
    const pageHeight = this.doc.internal.pageSize.getHeight()

    return {
      width: pageWidth - this.getHorizontalMargins(),
      height: pageHeight - this.getVerticalMargins()
    }
  }

  getHorizontalMargins() {
    return (this.margins.left + this.margins.right)
  }
  
  getVerticalMargins() {
    return (this.margins.top + this.margins.bottom)
  }

  generateTables() {
    this.generateCommitsTables()
  }

  generateCommitsTables() {

    this.commits.forEach((commit: ICommit) => {

      const head = this.getCommitTableHead(commit)
      const body = this.getCommitFilesTableBody(commit)

      autoTable(this.doc, {
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
      })
    })

  }

  getCommitTableHead(commit: ICommit) {
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
        this.getFormattedTableContent(`${ commit.author } (${ commit.author_email })`, 1, 10),
        this.getFormattedTableContent(commit.branch, 1, 10),
      ],
      [
        this.getFormattedTableContent('Date', 1, 10, 'Lato-Bold', '#a1a1aa'),
        this.getFormattedTableContent('Files changed', 1, 10, 'Lato-Bold', '#a1a1aa'),
      ],
      [
        this.getFormattedTableContent(dayjs(commit.date).format('dddd, YYYY-MM-DD HH:mm:ss'), 1, 10),
        this.getFormattedTableContent(commit.files.length, 1, 10)
      ],
      [
        this.getFormattedTableContent('\nFiles', 2, 10, 'Lato-Bold', '#a1a1aa'),
      ],
    ]
  }

  getCommitFilesTableBody(commit: ICommit) {
    return commit.files.map((file: any) => ([{ 
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
    }]))
  }

  getFormattedTableContent(content: string | number, colSpan: number = 1, fontSize: number = 10, font: string = 'Lato-Bold', color: string = '#164e63') {
    return {
      content,
      colSpan,
      styles: {
        fontSize,
        font,
        textColor: color,
        cellPadding:{
          top: 2,
          bottom: 2,
          left: 3
        }
      },
    }
  }

  getTableCellWidth(quantity: number) {
    return (this.pageWidth - this.margins.left - this.margins.right - 10) / quantity
  }


}
