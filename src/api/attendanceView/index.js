import request from '@/utils/request'

// 获取大数据视窗当天记录
export function getHistoryList(params) {
  return request({
    url: `/api/ai/snap/todayHistroy`,
    method: 'get',
    params,
    banLoading: true
  })
}