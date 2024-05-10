"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeframeAllTime = exports.getTimeframes = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
exports.getTimeframes = [
    // All time
    {
        label: `All time`
    },
    //This week
    {
        label: `This week`,
        init: (0, dayjs_1.default)().startOf('week').add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        end: (0, dayjs_1.default)().endOf('week').add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
    },
    // Last week
    {
        label: `Last week`,
        init: (0, dayjs_1.default)().subtract(7, 'days').startOf('week').add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        end: (0, dayjs_1.default)().subtract(7, 'days').endOf('week').add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
    },
    //This month
    {
        label: 'This month',
        init: (0, dayjs_1.default)().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        end: (0, dayjs_1.default)().endOf('month').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    //Last month
    {
        label: `${(0, dayjs_1.default)().subtract(1, 'month').subtract(1, 'day').format('MMMM-YYYY')}`,
        init: (0, dayjs_1.default)().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        end: (0, dayjs_1.default)().subtract(1, 'month').endOf('month').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    //Before last month
    {
        label: `${(0, dayjs_1.default)().subtract(2, 'month').format('MMMM-YYYY')}`,
        init: (0, dayjs_1.default)().subtract(2, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        end: (0, dayjs_1.default)().subtract(2, 'month').endOf('month').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
        label: `${(0, dayjs_1.default)().subtract(3, 'month').format('MMMM-YYYY')}`,
        init: (0, dayjs_1.default)().subtract(3, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        end: (0, dayjs_1.default)().subtract(3, 'month').endOf('month').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    // This year
    {
        label: `This year (${(0, dayjs_1.default)().format('YYYY')})`,
        init: (0, dayjs_1.default)().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
        end: (0, dayjs_1.default)().endOf('year').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    // Last year
    {
        label: `${(0, dayjs_1.default)().subtract(1, 'year').format('YYYY')}`,
        init: (0, dayjs_1.default)().subtract(1, 'year').subtract(1, 'day').startOf('year').format('YYYY-MM-DD HH:mm:ss'),
        end: (0, dayjs_1.default)().subtract(1, 'year').endOf('year').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    }
];
exports.timeframeAllTime = exports.getTimeframes[0];
