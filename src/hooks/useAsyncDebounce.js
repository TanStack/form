import React from 'react'

export default function useAsyncDebounce(defaultFn, defaultWait = 0) {
  const debounceRef = React.useRef({})
  debounceRef.current.defaultFn = defaultFn
  debounceRef.current.defaultWait = defaultWait

  React.useEffect(() => {
    return () => {
      if (debounceRef.current.timeout) {
        clearTimeout(debounceRef.current.timeout)
        delete debounceRef.current.timeout
      }

      if (debounceRef.current.promise) {
        debounceRef.current.reject(
          'Component unmounted while promise was not settled.'
        )

        delete debounceRef.current.promise
      }

      debounceRef.current.resolve = () => {}
      debounceRef.current.reject = () => {}
    }
  }, [])

  const debounce = React.useCallback(
    async (
      fn = debounceRef.current.defaultFn,
      wait = debounceRef.current.defaultWait
    ) => {
      if (!debounceRef.current.promise) {
        debounceRef.current.promise = new Promise((resolve, reject) => {
          debounceRef.current.resolve = resolve
          debounceRef.current.reject = reject
        })
      }

      if (debounceRef.current.timeout) {
        clearTimeout(debounceRef.current.timeout)
      }

      debounceRef.current.timeout = setTimeout(async () => {
        delete debounceRef.current.timeout
        try {
          debounceRef.current.resolve(await fn())
        } catch (err) {
          debounceRef.current.reject(err)
        } finally {
          delete debounceRef.current.promise
          delete debounceRef.current.resolve
          delete debounceRef.current.reject
        }
      }, wait)

      return debounceRef.current.promise
    },
    []
  )

  return debounce
}
