import request from '@/utils/request'

// 新增
export function postCameraBrands(params){
  return request({
    url:'api/ai/cameraBrands',
    method:"post",
    data: params
  })
}

// 获取单个详情
export function getCameraBrands(brandCode){
  return request({
    url:`api/ai/cameraBrands/${brandCode}`
  })
}

// 编辑
export function putCameraBrands(params){
  return request({
    url:`api/ai/cameraBrands/${params.brandCode}`,
    method:'put',
    data: params
  })
}

// 列表
export function getCameraBrandsList(params){
  return request({
    url:'api/ai/cameraBrands/page',
    method:'get',
    params
  })
}

// 获取下拉列表摄像头品牌  sort=order_seq
export function getCameraBrandsCombo(params){
  return request({
    url:'api/ai/cameraBrands/combo',
    method:'get',
    params
  })
}