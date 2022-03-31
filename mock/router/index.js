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
        menuUrl: '/mdm/data',
        menuName: 'Data',
        badge: 'new',
        cacheable: true,
      },
      {
        parentPath: '/mdm',
        menuUrl: '/mdm/component',
        menuName: 'Component',
        icon: 'setting',
        cacheable: true,
        children: [
          {
            parentPath: '/mdm/component',
            menuUrl: '/mdm/component/file',
            menuName: 'File', 
            cacheable: true,
          },
        ]
      },
      {
        parentPath: '/mdm',
        menuUrl: '/mdm/manage',
        menuName: 'Manage',
        icon: 'setting',
        cacheable: true,
        children: [
          {
            parentPath: '/mdm/manage',
            menuUrl: '/mdm/manage/domain',
            menuName: 'Domain', 
            cacheable: true,
          },
          {
            parentPath: '/mdm/manage',
            menuUrl: '/mdm/manage/mclass',
            menuName: 'Class', 
            cacheable: true,
          },
          {
            parentPath: '/mdm/manage',
            menuUrl: '/mdm/manage/prop',
            menuName: 'Prop',
            cacheable: true,
          },
          {
            parentPath: '/mdm/manage',
            menuUrl: '/mdm/manage/msection',
            menuName: 'Section',
            cacheable: true,
          },
          {
            parentPath: '/mdm/manage',
            menuUrl: '/mdm/manage/mgroup',
            menuName: 'Group',
            cacheable: true,
          },
          {
            parentPath: '/mdm/manage',
            menuUrl: '/mdm/manage/proptype',
            menuName: 'Prop-type',
            cacheable: true,
          },
          {
            parentPath: '/mdm/manage',
            menuUrl: '/mdm/manage/area',
            menuName: 'Area',            
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
