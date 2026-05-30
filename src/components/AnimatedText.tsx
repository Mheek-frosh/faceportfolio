import { useRef, CSSProperties } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  style?: CSSProperties
}

export default function AnimatedText({ text, className = '', style }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const words = text.split(' ')

  return (
    <p
      ref={containerRef}
      className={`flex flex-wrap justify-center gap-x-[0.25em] ${className}`}
      style={style}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="flex">
          {word.split('').map((char, charIndex) => {
            const globalIndex =
              words.slice(0, wordIndex).reduce((acc, w) => acc + w.length, 0) + charIndex
            const totalChars = text.replace(/\s/g, '').length
            const start = globalIndex / totalChars
            const end = (globalIndex + 1) / totalChars

            return (
              <Char
                key={charIndex}
                char={char}
                progress={scrollYProgress}
                start={start}
                end={end}
              />
            )
          })}
        </span>
      ))}
    </p>
  )
}

function Char({
  char,
  progress,
  start,
  end,
}: {
  char: string
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  start: number
  end: number
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1])

  return (
    <span className="relative inline-block">
      <span className="invisible">{char}</span>
      <motion.span
        className="absolute left-0 top-0"
        style={{ opacity }}
      >
        {char}
      </motion.span>
    </span>
  )
}
