export const fetch = (options, cb) => {
  jsBridge.invoke('fetch', options, cb)
}

