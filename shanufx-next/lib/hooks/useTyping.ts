'use client';

import { useState, useEffect, useRef } from 'react';

export function useTyping(words: string[], speed = 80, eraseSpeed = 40, pause = 2000) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'type' | 'erase'>('type');
  const idx = useRef(0);
  const charIdx = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const word = words[idx.current];

    if (phase === 'type') {
      if (charIdx.current < word.length) {
        timer = setTimeout(() => {
          setText(word.slice(0, charIdx.current + 1));
          charIdx.current++;
        }, speed);
      } else {
        timer = setTimeout(() => setPhase('erase'), pause);
      }
    } else {
      if (charIdx.current > 0) {
        timer = setTimeout(() => {
          setText(word.slice(0, charIdx.current - 1));
          charIdx.current--;
        }, eraseSpeed);
      } else {
        idx.current = (idx.current + 1) % words.length;
        setPhase('type');
      }
    }
    return () => clearTimeout(timer);
  }, [text, phase, words, speed, eraseSpeed, pause]);

  return text;
}
