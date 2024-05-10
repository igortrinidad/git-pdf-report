import type { ICommit } from './types/commit'
import type { ITimeframe } from './types/timeframe'
import dayjs from 'dayjs'
import { timeframeAllTime } from './getTimeframes'

export const filterCommitsByTimeframe = (commits: ICommit[], timeframe: ITimeframe): ICommit[] => {

  if(timeframe === timeframeAllTime) {
    return commits
  }
  
  return commits.filter(commit => {
    const commitDate = dayjs(commit.date, 'ddd MMM D HH:mm:ss YYYY ZZ').format('YYYY-MM-DD HH:mm:ss')
    return dayjs(commitDate).isAfter(dayjs(timeframe.init)) && dayjs(commitDate).isBefore(dayjs(timeframe.end))
  })
}