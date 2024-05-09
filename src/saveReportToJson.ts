import fs from 'fs'
import type { ICommit } from './types/commit'

export async function saveReportToJson(report: ICommit[], outputFile: fs.PathOrFileDescriptor) {
  fs.writeFileSync(outputFile, JSON.stringify(report, null, 4))
  console.log('Git json report generated successfully!')
}