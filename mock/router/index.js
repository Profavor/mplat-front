import { getMenuList } from '@/api/url'
import Mock from 'mockjs'

export const adminRoutes = [
  {
    menuUrl: '/mdm',
    menuName: 'MDM',
    iconPrefix: 'iconfont',
    icon: 'setting',
    parentPath: '',
    children: [
      {
        parentPath: '/mdm',
        menuUrl: '/mdm/form',
        menuName: 'Form',
        badge: 'new',
        cacheable: true,
      },
      {
        parentPath: '/mdm',
        menuUrl: '/mdm/manage',
        menuName: 'Manage',
        badge: 'new',
        icon: 'setting',
        cacheable: true,
        children: [
          {
            parentPath: '/mdm/manage',
            menuUrl: '/mdm/manage/domain',
            menuName: 'Domain',
            badge: 'new',
            cacheable: true,
          },
        ]
      },
    ],
  }
]
export const editorRoutes = [
  
]

Mock.mock(RegExp(getMenuList), 'post', function () {
  return Mock.mock({ code: 200, data: adminRoutes, msg: '메뉴 로딩 완료' })
})
