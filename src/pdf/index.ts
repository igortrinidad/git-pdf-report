/* eslint-disable no-unused-vars */
import { jsPDF } from "jspdf"
import dayjs from 'dayjs'
import imageLoader from './imageLoader'
import getImageDimensions from './getImageDimensions'
import scaleDimensions from './scaleDimensions'
import autoTable from 'jspdf-autotable'
import type { ICommit } from '../types/commit'
import { registerLatoBold } from './fonts/Lato-Bold.js'
import { registerLatoRegular } from  './fonts/Lato-Regular.js'
import { registerLatoLight } from  './fonts/Lato-Light.js'


export class GitReportPdfService {

  doc: any = null

  colors = {
    white : '#FFF',
    zinc100 : '#f4f4f5',
    zinc200 : '#e4e4e7',
    zinc300 : '#d4d4d8',
    zinc400 : '#a1a1aa',
    zinc500 : '#71717a',
    zinc600 : '#52525b',
    zinc700 : '#3f3f46',
    zinc800 : '#27272a',
    zinc900 : '#18181b',
    orange600 : '#ea580c',
    amber600 : '#d97706',
    cyan700 : '#0e7490',
    cyan900 : '#164e63'
  }

  sourceUrl: string = ''
  headline: string = 'Headline'
  title: string = 'Title'
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
    this.filename = args.filename ?? 'Git report'
    this.headline = args.headline ?? ''
    this.title = args.title ?? ''
    this.subtitle = args.subtitle ?? ''
    this.commits = args.commits ?? []
  }

  async init() {
    this.setPageInfo()
    await this.registerCustomFonts()
    this.date = dayjs().format('YYYY-MM-DD HH:mm')
  }

  setPageInfo() {
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

  async addPage() {    
    await this.addPageHeader()
    this.addLink()
    this.addPageCount()
    this.doc.addPage()
  }

  async addHeaderAndFooterNotes() {
    this.doc.setFont('Lato-Bold')
    this.doc.setFontSize(8)
    this.doc.setTextColor(this.colors.zinc600)
    // await this.doc.text(headerNoteResult, this.margins.left, this.yTop + 5, { align: 'left' } )
    await this.doc.text('Generated at: ' + this.date, this.margins.left, this.yBottom + 5, { align: 'left' } )
  }

  async addPageHeader() {
    
    this.doc.setFillColor(this.colors.cyan900);
    this.doc.rect(0, 0, this.pageWidth, this.margins.top, 'F');

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
    this.doc.setTextColor(this.colors.zinc100)
    this.doc.setFontSize(10)
    this.doc.text(this.headline, captionsXPosition, captionsYPositionStart, { baseline : 'bottom' })

    this.doc.setFont('Lato-Regular')
    this.doc.setTextColor(this.colors.zinc100)
    this.doc.setFontSize(12)
    this.doc.text(`${this.title} - ${this.subtitle}`, captionsXPosition, captionsYPositionStart + 12, { baseline : 'bottom' })
    
  }
  
  addLink() {        
    this.doc.setFont('Lato-Bold')
    this.doc.setTextColor(this.colors.cyan700)
    this.doc.setFontSize(9)
    this.doc.textWithLink( 
      'github.com/igortrinidad/git-pdf-report', 
      this.xRight,
      this.pageHeight - 20,
      { 
        url: 'https://github.com/igortrinidad/git-pdf-report', 
        align: 'right',
      } 
    )
  }

  async addPageCount() {
    this.doc.setFont('Lato-Bold')
    this.doc.setFontSize(8)
    this.doc.setTextColor(this.colors.zinc600)
    const xPos = this.pageWidth - this.margins.right
    const yPos = this.pageHeight - 10
    const pages = this.doc.internal.getNumberOfPages()
    await this.doc.text(`Página ${ this.doc.internal.getCurrentPageInfo().pageNumber } de ${ pages }`, xPos, yPos, { align: 'right' } )
  }
  

  async addPagesPattern() {

    const pages = this.doc.internal.getNumberOfPages()
    for (let i = 1; i < pages + 1 ; i++) {      
      this.doc.setPage(i)
      await this.addPageHeader()
      this.addLink()
      await this.addPageCount()
      await this.addSpecificPageInfo()
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
        styles: {
          font: 'Lato-Regular',
          fontSize: 8,
        },
        bodyStyles: {
          lineWidth: 0.5,
          lineColor: this.colors.zinc100,
        },
        headStyles: {
          lineWidth: 0,
          lineColor: this.colors.zinc100,
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
        this.getTableHeaderContent('Contribution title / commit message', 2, 10),
      ],
      [
        this.getTableHeaderContent(commit.message, 2, 12),
      ],
      [
        this.getTableHeaderContent('Author', 1, 10),
        this.getTableHeaderContent('Branch', 1, 10),
      ],
      [
        this.getTableHeaderContent(`${ commit.author } (${ commit.author_email }) asdasdasdasdas \n\n dasdasdasda`, 1, 10),
        this.getTableHeaderContent(commit.branch, 1, 10),
      ],
      [
        this.getTableHeaderContent('Date'),
        this.getTableHeaderContent('Files changed'),
      ],
      [
        this.getTableHeaderContent(commit.date, 1, 10),
        this.getTableHeaderContent(commit.files.length, 1, 10)
      ],
      [
        this.getTableHeaderContent('Files', 2, 10),
      ],
    ]
  }

  getCommitFilesTableBody(commit: ICommit) {
    return commit.files.map((file: any) => ([{ content: file, colSpan: 2 }]))
  }

  getTableHeaderContent(content: string | number, colSpan: number = 1, fontSize: number = 10) {
    return {
      content,
      colSpan,
      styles: {
        fontSize,
        font: 'Lato-Regular',
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
