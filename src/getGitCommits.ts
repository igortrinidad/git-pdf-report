import { exec } from 'child_process'
import type { ICommit } from './types/commit'

export const getGitCommits = async (): Promise<ICommit[]> =>  {
  return new Promise((resolve, reject) => {
    exec('git log --name-only --pretty=format:"{ \\"commit\\": \\"%H\\", \\"author\\": \\"%an\\", \\"author_email\\": \\"%ae\\", \\"date\\": \\"%ad\\", \\"message\\": \\"%f\\", \\"branch\\": \\"%d\\" }"', (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }

      const logLines = stdout.trim().split('\n')
      const gitReport: any[] = []
      let currentCommit: { files: string[] } = null

      logLines.forEach(line => {
        if (line.startsWith('{')) {
          if (currentCommit) {
            gitReport.push(currentCommit)
          }
          currentCommit = JSON.parse(line)
          currentCommit.files = []
        } else if (line && currentCommit) {
          currentCommit.files.push(line.trim())
        }
      })

      if (currentCommit) {
        gitReport.push(currentCommit)
      }

      resolve(gitReport)
    })
  })
}