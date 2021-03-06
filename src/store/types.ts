export interface RootState {
  root: string
}

export interface AppState {
  version: string
  appName: string
  progress: number
}

export interface UserState {
  userId: number
  token: string
  roleId: number
  roles: string[] | null
  userName: string
  nickName: string
  avatar: string
  lang: string
}

export interface ParentState {
  root: RootState
  user: UserState
  app: AppState
  domain: DomainState
}

export interface DomainState {
  domainId: string
  domainName: string
  domainList: Array<any>
}
