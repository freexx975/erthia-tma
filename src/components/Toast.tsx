import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Singleton toast system
let toastFn: ((msg: string) => void) | null = null

export const showToast = (msg: string) => {
  if (toastFn) toastFn(msg)
}

export default function Toast() {
  const [message, setMessage] = useState<string | null>(null)
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback((msg: string) => {
    if (timer) clearTimeout(timer)
    setMessage(msg)
    const t = setTimeout(() => setMessage(null), 2200)
    setTimer(t)
  }, [timer])

  useEffect(() => {
    toastFn = show
    return () => { toastFn = null }
  }, [show])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
