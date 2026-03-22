import { useState, useEffect, useRef, type ReactNode } from 'react'

interface ContentTransitionProps {
  contentKey: string
  children: ReactNode
  duration?: number
  className?: string
}

export function ContentTransition({ contentKey, children, duration = 300, className }: ContentTransitionProps) {
  const [displayedChildren, setDisplayedChildren] = useState(children)
  const [visible, setVisible] = useState(true)
  const currentKeyRef = useRef(contentKey)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (contentKey !== currentKeyRef.current) {
      setVisible(false)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        currentKeyRef.current = contentKey
        setDisplayedChildren(children)
        requestAnimationFrame(() => setVisible(true))
      }, duration)
    } else {
      setDisplayedChildren(children)
    }
  }, [contentKey, children, duration])

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${duration}ms ease`,
      }}
    >
      {displayedChildren}
    </div>
  )
}
