import { useEffect, useRef } from 'react'

export default function ConfirmDialog({ title, message, confirmLabel, confirmColor, onConfirm, onCancel }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onCancel() }}
      className="fixed inset-0 z-[300] flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 animate-scale-in"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
      >
        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {title}
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{ background: confirmColor || '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            {confirmLabel || '確認'}
          </button>
        </div>
      </div>
    </div>
  )
}
