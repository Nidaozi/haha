import request from '@/utils/requesthadoop'
import down from '@/utils/requestdown'
export function listDirectory(query) {
  return request({
    url: '/api/hdfs/director/list',
    method: 'get',
    params: query
  })
}
export function makeDirector(query) {
  return request({
    url: '/api/hdfs/director/makedirs',
    method: 'post',
    params: query
  })
}
export function download(query) {
  return down({
    url: '/api/hdfs/file/download',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
export function delect(query) {
  return request({
    url: '/api/hdfs/file/delect',
    method: 'get',
    params: query,
  })
}

export function loginUser(query) {
  return request({
    url: '/api/hdfs/login',
    method: 'get',
    params: query,
  })
}
export function renameResources(query) {
  return request({
    url: '/api/hdfs/resources/rename',
    method: 'get',
    params: query,
  })
}

export function resgitryUser(query) {
  return request({
    url: '/api/hdfs/login',
    method: 'post',
    params: query,
  })
}