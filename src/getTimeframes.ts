import dayjs from 'dayjs'
import type { ITimeframe } from './types/timeframe'

export const getTimeframes = [
  // All time
  {
    label: `All time`
  },
  //This week
  {
    label: `This week`,
    init: dayjs().startOf('week').add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs().endOf('week').add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  // Last week
  {
    label: `Last week`,
    init: dayjs().subtract(7, 'days').startOf('week').add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs().subtract(7, 'days').endOf('week').add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  //This month
  {
    label: 'This month',
    init: dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs().endOf('month').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  },
  //Last month
  {
    label: `${dayjs().subtract(1, 'month').subtract(1, 'day').format('MMMM-YYYY')}`,
    init: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs().subtract(1, 'month').endOf('month').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  },
  //Before last month
  {
    label: `${dayjs().subtract(2, 'month').format('MMMM-YYYY')}`,
    init: dayjs().subtract(2, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs().subtract(2, 'month').endOf('month').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    label: `${dayjs().subtract(3, 'month').format('MMMM-YYYY')}`,
    init: dayjs().subtract(3, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs().subtract(3, 'month').endOf('month').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  },
  // This year
  {
    label: `This year (${dayjs().format('YYYY')})`,
    init: dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs().endOf('year').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  },
  // Last year
  {
    label: `${ dayjs().subtract(1, 'year').format('YYYY')}`,
    init: dayjs().subtract(1, 'year').subtract(1, 'day').startOf('year').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs().subtract(1, 'year').endOf('year').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  }
] as ITimeframe[]

export const timeframeAllTime = getTimeframes[0]
