import { motion } from 'framer-motion'

export default function SplashScreen() {
  return (
    <div className="splash">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="splash-title">Erthia</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.2em',
            marginTop: '8px',
          }}
        >
          Il mondo vi aspetta
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ delay: 1, duration: 0.8, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: '40px',
          fontFamily: 'var(--font-serif)',
          fontSize: '0.75rem',
          color: 'var(--gold)',
          letterSpacing: '0.15em',
        }}
      >
        ✦ ✦ ✦
      </motion.div>
    </div>
  )
}
