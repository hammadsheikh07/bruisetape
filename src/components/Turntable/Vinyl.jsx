import React from 'react';
import { motion } from 'framer-motion';

export default function Vinyl({ isPlaying, onScratch, cover }) {
  return (
    <motion.div
      drag
      dragElastic={0}
      dragMomentum={false}
      onDrag={(e, info) => {
        const deltaDeg = info.delta.x * 0.6;
        const deltaRotations = deltaDeg / 360;
        const deltaTime = deltaRotations * (60 / 33.3333);
        onScratch(deltaTime);
      }}
      animate={{ rotate: isPlaying ? 360 : 0 }}
      transition={{ repeat: isPlaying ? Infinity : 0, ease: 'linear', duration: 1.8 }}
      style={{ width: 320, height: 320 }}
      className="rounded-full shadow-inner bg-gradient-to-br from-black to-neutral-800 border-8 border-black mx-auto relative"
    >
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        backgroundImage: `url(${cover})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        mixBlendMode: 'overlay', opacity: 0.6
      }} />
      <div style={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', width:80, height:80, borderRadius: '50%', background:'#ff9f1c'}} />
    </motion.div>
  );
}
