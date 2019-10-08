import request from '@/utils/request'

// 获取网卡列表
export function getNetworkCardList() {
  return request({
    url: `/api/ai/common/getNetworkCardList`,
    method: 'get'
  })
}

// 更新网卡信息
export function postNetworkCard(data) {
  return request({
    url: `/api/ai/common/updateNetworkCard`,
    method: 'post',
    data
  })
}