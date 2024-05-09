const { exec } = require('child_process')

export const getRepositoryName = (): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    exec('git config --get remote.origin.url', (error, stdout, stderr) => {
      if (error) {
        resolve(null)
        return
      }
      const remoteUrl = stdout.trim()
      const matches = remoteUrl.match(/\/([^\/]+?)(?:\.git)?$/)
      if (matches && matches.length > 1) {
        const repositoryName = matches[1]
        resolve(repositoryName)
      } else {
        resolve(null)
      }
    })
  })
}
