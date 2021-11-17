import { getMenuListByRoleId, getAllMenuByRoleId, login, updateUserInfo } from '@/api/url'
import { randomString } from '@/utils'
import Mock from 'mockjs'
import { baseData } from '../base.ts'
import { adminRoutes, editorRoutes } from '../router'

Mock.mock(RegExp(login), 'post', function (options) {
  const username = JSON.parse(options.body).username
  const data = {}
  if (username === 'admin') {
    baseData.code = 200
    baseData.msg = 'Login Success'
    data.nickName = 'Administrator'
    data.userName = 'admin'
    data.userId = 1
    data.roleId = 1
    data.token = randomString(100)
    data.roles = [
      {
        roleCode: 'ROLE_admin',
        roleId: 1,
        roleName: 'Administrator',
      },
    ]
    baseData.data = data
  } else {
    baseData.code = 500
    baseData.data = ''
    baseData.msg = 'Bad account'
  }
  return Mock.mock(baseData)
})

Mock.mock(RegExp(getAllMenuByRoleId), 'post', function (options) {
  const roleId = JSON.parse(options.body).roleId || ''
  if (!roleId) {
    return Mock.mock({ code: 500, data: '', msg: '메뉴 목록을 가져오지 못했습니다.' })
  }
  const allRoutes = [...adminRoutes]
  allRoutes.forEach((it) => {
    it.isSelect = parseInt(roleId) === 1 || it.menuUrl.indexOf('authority') === -1
    it.children.forEach((child) => {
      child.isSelect = parseInt(roleId) === 1 || child.menuUrl.indexOf('authority') === -1
    })
  })
  return Mock.mock({ code: 200, data: allRoutes, msg: '메뉴목록 로딩' })
})

Mock.mock(RegExp(getMenuListByRoleId), 'post', function (options) {
  const roleId = JSON.parse(options.body).roleId || ''
  if (!roleId) {
    return Mock.mock({ code: 500, data: '', msg: '메뉴 목록을 가져오지 못했습니다.' })
  }
  if (parseInt(roleId) === 1) {
    // 超级管理员
    return Mock.mock({ code: 200, data: adminRoutes, msg: '메뉴목록 로딩' })
  } else if (parseInt(roleId) === 2) {
    // 编辑
    return Mock.mock({
      code: 200,
      data: editorRoutes,
      msg: '메뉴목록 로딩',
    })
  } else {
    return Mock.mock({
      code: 500,
      data: '',
      msg: '권한이 없습니다',
    })
  }
})

Mock.mock(RegExp(updateUserInfo), 'post', function () {
  return Mock.mock({ ...baseData, msg: '정보 업데이트 성공' })
})
