import { create } from 'zustand'

interface MenuStoreType {
  currentMenu: string
  setCurrentMenu: (newState: string) => void
}

export const useMenuStore = create<MenuStoreType>(set => ({
  currentMenu: '/calendar',
  setCurrentMenu: (newState: string) => {
    set(() => ({ currentMenu: newState }))
  },
}))
