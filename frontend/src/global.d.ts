interface ScreenOrientation {
  lock(orientation: 'portrait' | 'landscape'): Promise<void>
  unlock(): void
}