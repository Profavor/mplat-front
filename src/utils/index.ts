import { RouteRecordRaw } from 'vue-router'
import path from 'path-browserify'
import { SplitTab, RouteRecordRawWithHidden } from '../types/store'
import { DataTableColumn, MenuOption, NBadge, NIcon, TreeSelectOption } from 'naive-ui'
import { h, ref } from 'vue'
import SvgIcon from '../components/svg-icon/index.vue'
import { TablePropsType } from '@/types/components'

export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function uuid() {
  const s: Array<any> = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  const uuid = s.join('')
  return uuid
}

export function randomString(length: number) {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i) {
    result += str[Math.floor(Math.random() * str.length)]
  }
  return result
}

export function toHump(str: string): string {
  if (!str) return str
  return str
    .replace(/\-(\w)/g, function (all, letter) {
      return letter.toUpperCase()
    })
    .replace(/(\s|^)[a-z]/g, function (char) {
      return char.toUpperCase()
    })
}

export function mapTwoLevelRouter(srcRoutes: Array<RouteRecordRaw>) {
  function addParentRoute(routes: any, parent: any, parentPath: string) {
    routes.forEach((it: RouteRecordRaw) => {
      if (!isExternal(it.path)) {
        it.path = path.resolve(parentPath, it.path)
      }
      parent.push(it)
      if (it.children && it.children.length > 0) {
        addParentRoute(it.children, parent, it.path)
      }
    })
  }
  if (srcRoutes && srcRoutes.length > 0) {
    const tempRoutes = [] as Array<any>
    srcRoutes.forEach((it) => {
      const route = { ...it }
      const parentRoutes = [] as Array<any>
      if (route.children && route.children.length > 0) {
        addParentRoute(route.children, parentRoutes, route.path)
      }
      parentRoutes && parentRoutes.length > 0 && (route.children = parentRoutes)
      tempRoutes.push(route)
    })
    return tempRoutes
  }
  return []
}

export function transfromRoutes(
  originRoutes: Array<RouteRecordRaw>,
  parentPath = '/'
): Array<RouteRecordRawWithHidden> | undefined {
  if (!originRoutes) {
    return undefined
  }
  const tempRoutes: Array<RouteRecordRawWithHidden> = []
  originRoutes.forEach((it) => {
    const tempRoute = {
      ...it,
      hidden: (it as any).hidden ? !!(it as any).hidden : false,
      fullPath: isExternal(it.path) ? it.path : path.resolve(parentPath, it.path),
    } as RouteRecordRawWithHidden
    if (tempRoute.children) {
      tempRoute.children = transfromRoutes(tempRoute.children, tempRoute.fullPath)
    }
    tempRoutes.push(tempRoute)
  })
  return tempRoutes
}

export function transfromMenu(originRoutes: Array<RouteRecordRawWithHidden>): Array<MenuOption> {
  function getLabel(item: RouteRecordRawWithHidden) {
    if (isExternal(item.path as string)) {
      return () =>
        h(
          'a',
          {
            href: item.path,
            target: '_blank',
            rel: 'noopenner noreferrer',
          },
          (item.meta as any).title
        )
    }
    // return item.meta?.title
    return () =>
      h(
        'div',
        {
          class: 'flex justify-between items-center',
        },
        {
          default: () =>
            [
              { type: 'title', label: item.meta?.title },
              { type: 'badge', label: item.meta?.badge },
            ].map((it) => {
              return it.type === 'title'
                ? h('div', null, {
                    default: () => it.label,
                  })
                : getBadge(it)
            }),
        }
      )
  }
  function getBadge(item: any) {
    if (!item.label) return ''
    return h(NBadge, {
      value: item.label,
      style: 'margin-right: 5px',
      dot: item.label === 'dot',
    })
  }
  if (!originRoutes) {
    return []
  }
  const tempMenus: Array<MenuOption> = []
  originRoutes
    .filter((it) => !it.hidden)
    .forEach((it) => {
      const tempMenu = {
        key: it.fullPath,
        label: getLabel(it),
        icon: renderMenuIcon(
          it.meta ? (it.meta.iconPrefix ? (it.meta.iconPrefix as string) : 'icon') : 'icon',
          it.meta?.icon
        ),
      } as MenuOption
      if (it.children) {
        tempMenu.children = transfromMenu(it.children)
      }
      tempMenus.push(tempMenu)
    })
  return tempMenus
}

export function transformSplitTabMenu(routes?: Array<RouteRecordRawWithHidden>): Array<SplitTab> {
  if (!routes) {
    return [] as Array<SplitTab>
  }
  const tempTabs = [] as Array<SplitTab>
  routes.forEach((it) => {
    const splitTab: SplitTab = {
      label: it.meta ? (it.meta?.title as string) : '',
      fullPath: it.fullPath || '',
      iconPrefix: it.meta?.iconPrefix || 'icon',
      icon: it.meta ? (it.meta?.icon as any) : undefined,
      children: it.children,
      checked: ref(false),
    }
    tempTabs.push(splitTab)
  })
  return tempTabs
}

export function renderMenuIcon(iconPrefix: string, icon?: any) {
  if (!icon) {
    return undefined
  }
  return () =>
    h(NIcon, null, {
      default: () =>
        h(SvgIcon, {
          prefix: iconPrefix,
          name: icon,
        }),
    })
}

export function sortColumns(originColumns: DataTableColumn[], newColumns: TablePropsType[]) {
  if (!originColumns || !newColumns) {
    return
  }
  if (newColumns.length === 0) {
    originColumns.length = 0
  } else {
    const selectionItem = originColumns.find((it) => it.type === 'selection')
    originColumns.length = 0
    if (selectionItem) {
      originColumns.push(selectionItem)
    }
    originColumns.push(...newColumns)
  }
}

export function transformTreeSelect(
  origin: any[],
  labelName: string,
  keyName: string
): TreeSelectOption[] {
  const tempSelections: TreeSelectOption[] = []
  origin.forEach((it) => {
    const selection = {
      label: it[labelName],
      key: it[keyName],
    } as TreeSelectOption
    if (it.children) {
      selection.children = transformTreeSelect(it.children, labelName, keyName)
    }
    tempSelections.push(selection)
  })
  return tempSelections
}

export function findRouteByUrl(routes: Array<any>, path: string): RouteRecordRawWithHidden | null {
  if (!path || !routes) {
    return null
  }
  let tempRoute = null
  for (let index = 0; index < routes.length; index++) {
    const temp = routes[index]
    if (temp.path === path) {
      tempRoute = temp
      return tempRoute
    }
    if (temp.children) {
      tempRoute = findRouteByUrl(temp.children, path)
      if (tempRoute) {
        return tempRoute
      }
    }
  }
  return null
}

export function messageGetter(e: any): string {
    const message = e.data.message || e.data
    const lang = 'ko'    
    
    if(typeof message != 'undefined' && message != null) {
        for(let index in message.messageLangs){
            if(message.messageLangs[index].lang == lang){
                return message.messageLangs[index].message
            }
        }
    }

    return '';
}

export function dataGetter(params: any) {
  const lang = 'ko'
  let data = eval('params.node.data.'+params.colDef.toColDef.field)

  if(data == null){
    return '';
  }
  if(typeof data.message != 'undefined' && data.message != null) {
    for(let index in data.message.messageLangs){
      if(data.message.messageLangs[index].lang == lang){
        return '['+eval('data.'+ params.colDef.toColDef.entityId)+'] '+data.message.messageLangs[index].message
      }
    }
  }else if(typeof data.messageLangs != 'undefined') {
    for(let index in data.messageLangs){
      if(data.messageLangs[index].lang == lang){
        return '['+eval('data.'+ params.colDef.toColDef.entityId)+'] '+ data.messageLangs[index].message
      }
    }
  }
  return '';
}

export function dataSetter(params: any): boolean {
  let data = eval('params.node.data.'+params.colDef.toColDef.field)
  
  const lang = 'ko' 
  
  const newValue = params.newValue

  if(newValue.startsWith("{") && newValue.endsWith("}")){
    let parse = JSON.parse(newValue)
    if(typeof data != 'undefined' && data != null) {
      eval('data.' + params.colDef.toColDef.entityId + ' = parse.entityId')
      let message = data.message
      for(let index in message.messageLangs){
        if(message.messageLangs[index].lang == lang){
            message.messageLangs[index].message = parse.message
        }
      }
      return true
    }
  }

  return false;
}

export function messageSetter(e: any): boolean {
  const message = e.data.message || e.data
  const lang = 'ko' 
  
  const newValue = e.newValue
  if(newValue.startsWith("{") && newValue.endsWith("}")){
    let parse = JSON.parse(newValue)
    if(typeof message != 'undefined' && message != null) {
      message.messageId = parse.messageId
      for(let index in message.messageLangs){
        if(message.messageLangs[index].lang == lang){
            message.messageLangs[index].message = parse.message
        }
      }
      return true
    }
  }

  return false;
}

export function messageGetterKo(e: any): string {
  const message = e.data
  const lang = 'ko'    
  
  if(typeof message != 'undefined' && message != null) {
      for(let index in message.messageLangs){
          if(message.messageLangs[index].lang == lang){
              return message.messageLangs[index].message
          }
      }
  }

  return '';
}

export function messageGetterEn(e: any): string {
  const message = e.data
  const lang = 'en'    
 
  if(typeof message != 'undefined' && message != null) {
      for(let index in message.messageLangs){
          if(message.messageLangs[index].lang == lang){
              return message.messageLangs[index].message
          }
      }
  }

  return '';
}

export function messageSetterKo(e: any): boolean {
  const message = e.data
  const lang = 'ko' 
  
  if(typeof message != 'undefined' && message != null) {
    for(let index in message.messageLangs){
        if(message.messageLangs[index].lang == lang){
            message.messageLangs[index].message = e.newValue
            return true;
        }
    }
  }

  return false;
}

export function messageSetterEn(e: any): boolean {
  const message = e.data
  const lang = 'en'    
 
  if(typeof message != 'undefined' && message != null) {
    for(let index in message.messageLangs){
        if(message.messageLangs[index].lang == lang){
            message.messageLangs[index].message = e.newValue
            return true;
        }
    }
  }

  return false;
}

export function getMessageName(message: any, lang: string){
  if(message != null){
    for(let index in message.messageLangs) {
      if(message.messageLangs[index].lang === lang) {
        return message.messageLangs[index].message
      }
    }
  }
  return ''
}

export function unflatten(arr: any, id: any, parentId: any) {
  let tree = [],
      mappedArr: any = {},
      arrElem,
      mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for(let i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[eval('arrElem.'+id)] = arrElem;
    mappedArr[eval('arrElem.'+id)]['children'] = [];
  }


  for (let id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.
      if (eval('mappedElem.'+ parentId)) {
        mappedArr[mappedElem['parentId']]['children'].push(mappedElem);        
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
}

export function makeTreePath(arr2: any, id: any, parentId: any, children: any){
    let arr = unflatten(arr2, id, parentId)

    let data = []
    let map = []
    let queue = new Queue()

    for(let idx in arr){
        queue.push(arr[idx])
    }

    while(!queue.isEmpty()){
        let d = queue.pop()

        if(eval('d.'+children+'.length > 0')){
            d.isLeaf = false
        }else{
            d.isLeaf = true
        }

        if(typeof map[eval('d.' +parentId)] == 'undefined'){
           map[eval('d.' +parentId)] = []
        }

        map[eval('d.'+ id)] = JSON.parse(JSON.stringify(map[eval('d.' +parentId)]))
        map[eval('d.'+ id)].push(eval('d.'+ id))

        let loop = eval('d.'+ children)

        for(let i in loop) {
            queue.push(eval('d.'+ children + '[i]'))
        }

        d.treePath = map[eval('d.'+ id)]
        data.push(d)
    }
    return data
}

class Queue {
  _arr:any = []

  constructor() {
    this._arr = [];
  }
  push(item: any) {
    this._arr.push(item);
  }
  pop() {
    return this._arr.shift();
  }
  isEmpty() {
      if(this._arr.length > 0){
          return false
      }else{
          return true
      }
  }
}

class Stack {
  _arr:any = []
  constructor() {
    this._arr = [];
  }
  push(item: any) {
    this._arr.push(item);
  }
  pop() {
    return this._arr.pop();
  }
  peek() {
    return this._arr[this._arr.length - 1];
  }
}
