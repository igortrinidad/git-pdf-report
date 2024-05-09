
import 'dayjs/locale/pt-br'
import { getGitCommits } from './getGitCommits'
import { saveReportToJson } from './saveReportToJson'
import { GitReportPdfService } from './pdf'

async function main() {
    try {

        const gitCommits = await getGitCommits()
        await saveReportToJson(gitCommits, 'git_report.json')
        const pdfService = new GitReportPdfService({ commits: gitCommits })
        await pdfService.init()
        pdfService.generateTables()
        await pdfService.export()

    } catch (error) {
        console.error('Error generating Git report or PDF:', error)
    }
}

main()
