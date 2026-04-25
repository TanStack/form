export type Updater<T> = T | ((prev: T) => T)
