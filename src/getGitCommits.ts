import { exec } from 'child_process'
import type { ICommit } from './types/commit'

const getRepositoryUrl = async (): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    try {

      exec('git config --get remote.origin.url', (err, stdout, stderr) => {

        if(err) {
          return resolve(null)
        }

        const repositoryUrl = stdout.trim().replace('com:', 'com/').replace('git@', 'https://').replace('.git', '')
        resolve(repositoryUrl)

      })
    } catch (error) {
      console.error(error)
      resolve(null)
    }
  })
}

const getGitHubFileChangeUrl = (commitHash: string, filePath: string, repositoryUrl: string | null): string | null => {
  if(!repositoryUrl) {
    return null
  }
  const baseUrl = repositoryUrl.endsWith('/') ? repositoryUrl.slice(0, -1) : repositoryUrl;
  return `${baseUrl}/commit/${commitHash}#diff-${filePath}`;
}

export const getGitCommits = async (): Promise<ICommit[]> =>  {
  return new Promise(async (resolve, reject) => {

    const repositoryUrl = await getRepositoryUrl()

    exec('git log --name-only --pretty=format:"{ \\"commit\\": \\"%H\\", \\"author\\": \\"%an\\", \\"author_email\\": \\"%ae\\", \\"date\\": \\"%ad\\", \\"message\\": \\"%f\\", \\"branch\\": \\"%d\\" }"', { maxBuffer: 1024 * 30000 }, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }

      const logLines = stdout.trim().split('\n')
      const gitReport: any[] = []

      let currentCommit: ICommit = null

      logLines.forEach(line => {
        if (line.startsWith('{')) {
        
          if (currentCommit) {
            gitReport.push(currentCommit)
          }

          currentCommit = JSON.parse(line) as ICommit
          currentCommit.files = []
        
        } else if (line && currentCommit) {

          currentCommit.files.push({
            path: line.trim(),
            url: getGitHubFileChangeUrl(currentCommit.commit, line.trim(), repositoryUrl)
          })
          
        }

      })

      if (currentCommit) {
        gitReport.push(currentCommit)
      }

      resolve(gitReport)
    })
  })
}