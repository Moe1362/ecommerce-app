import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

function RotatingStars() {
  const starsRef = useRef()
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.0001
      starsRef.current.rotation.y += 0.0001
    }
  })
  return <Stars ref={starsRef} radius={300} depth={50} count={5000} factor={4} saturation={0} fade />
}

export default function StarrySky() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas>
        <color attach="background" args={['#0f0f10']} />
        <RotatingStars />
      </Canvas>
    </div>
  )
}