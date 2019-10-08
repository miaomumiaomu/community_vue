import request from '@/utils/request'

export function postStudentByExcel(data){
    return request({
        url:'api/ai/import/addStudent',
        method:"post",
        data
    })
}