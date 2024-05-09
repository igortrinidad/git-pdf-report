import { getGitCommits } from './getGitCommits'
import { saveReportToJson } from './saveReportToJson'
import { GitReportPdfService } from './pdf'
import { input } from '@inquirer/prompts'
import { getRepositoryName } from './getRepositoryName'
import dayjs from 'dayjs'

async function main() {
    try {

        const repositoryName = await getRepositoryName()
        const title = (await input({ message: 'Insert the title of the report: ', default: repositoryName })) ?? 'Git Report'
        const date = dayjs().format('YYYY-MM-DD HH:mm')
        const gitCommits = await getGitCommits()
        const filename = `${ title } ${ date }`.replace(/[^a-z0-9\s\.]/gi, '_').replace(/ /g, '_').replace(/_+/g, '_')
        await saveReportToJson(gitCommits, `${ filename }.json`)
        const pdfService = new GitReportPdfService({ title, date, filename, commits: gitCommits })
        await pdfService.init()
        pdfService.generateTables()
        await pdfService.export()
        
        console.log('Git pdf report generated successfully!')

    } catch (error) {
        console.error('Error generating Git report or PDF:', error)
    }
}

main()
