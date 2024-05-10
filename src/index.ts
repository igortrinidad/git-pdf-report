import { getGitCommits } from './getGitCommits'
import { saveReportToJson } from './saveReportToJson'
import { GitReportPdfService } from './pdf'
import { input, select } from '@inquirer/prompts'
import { getRepositoryName } from './getRepositoryName'
import dayjs from 'dayjs'
import { getTimeframes } from './getTimeframes'
import { filterCommitsByTimeframe } from './filterCommitsByTimeframe'

async function main() {
  try {

    const repositoryName = await getRepositoryName()
    
    const title = (await input({ message: 'Insert the title of the report: ', default: repositoryName })) ?? 'Git Report'
    
    const timeframe = await select({
      message: 'Select a package manager',
      choices: getTimeframes.map((timeframe) => {
        return {
          name: timeframe.label,
          value: timeframe,
          checked: timeframe.label === 'All time'
        }
      }),
    })

    const gitCommits = await getGitCommits()
    const filteredCommits = filterCommitsByTimeframe(gitCommits, timeframe)

    console.log('Found commits:', gitCommits.length, ' Filtered commits:', filteredCommits.length)

    if(!filteredCommits.length) {
      console.log('No commits found for the selected timeframe, the report will not be generated.')
      return
    }

    const date = dayjs().format('YYYY-MM-DD HH:mm')
    const filename = `${title} ${date}`.replace(/[^a-z0-9\s\.]/gi, '_').replace(/ /g, '_').replace(/_+/g, '_')
    await saveReportToJson(gitCommits, `${filename}.json`)
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
