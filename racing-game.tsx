'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Car } from '@/lib/game-store'

interface RacingGameProps {
  car: Car
  onGameOver: (score: number) => void
  onBack: () => void
}

interface Obstacle {
  id: number
  x: number
  y: number
  lane: number
  type: 'car' | 'truck'
}

interface Coin {
  id: number
  x: number
  y: number
  lane: number
}

const GAME_WIDTH = 400
const GAME_HEIGHT = 600
const LANE_WIDTH = GAME_WIDTH / 3
const PLAYER_HEIGHT = 80
const PLAYER_WIDTH = 50

export function RacingGame({ car, onGameOver, onBack }: RacingGameProps) {
  const [playerLane, setPlayerLane] = useState(1)
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [coins, setCoins] = useState<Coin[]>([])
  const [score, setScore] = useState(0)
  const [gameSpeed, setGameSpeed] = useState(5 + car.speed)
  const [isPlaying, setIsPlaying] = useState(true)
  const [countdown, setCountdown] = useState(3)
  const [showCountdown, setShowCountdown] = useState(true)
  
  const gameRef = useRef<HTMLDivElement>(null)
  const obstacleIdRef = useRef(0)
  const coinIdRef = useRef(0)
  const frameRef = useRef<number>(0)
  const lastObstacleRef = useRef(0)
  const lastCoinRef = useRef(0)

  const playerX = playerLane * LANE_WIDTH + LANE_WIDTH / 2 - PLAYER_WIDTH / 2

  // Countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setShowCountdown(false)
    }
  }, [countdown])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || showCountdown) return
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerLane(prev => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerLane(prev => Math.min(2, prev + 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, showCountdown])

  // Handle touch/click input
  const handleMove = useCallback((direction: 'left' | 'right') => {
    if (!isPlaying || showCountdown) return
    
    if (direction === 'left') {
      setPlayerLane(prev => Math.max(0, prev - 1))
    } else {
      setPlayerLane(prev => Math.min(2, prev + 1))
    }
  }, [isPlaying, showCountdown])

  // Game loop
  useEffect(() => {
    if (!isPlaying || showCountdown) return

    const gameLoop = () => {
      const now = Date.now()

      // Spawn obstacles
      if (now - lastObstacleRef.current > 1500 / (gameSpeed / 10)) {
        const lane = Math.floor(Math.random() * 3)
        setObstacles(prev => [
          ...prev,
          {
            id: obstacleIdRef.current++,
            x: lane * LANE_WIDTH + LANE_WIDTH / 2 - 25,
            y: -100,
            lane,
            type: Math.random() > 0.7 ? 'truck' : 'car'
          }
        ])
        lastObstacleRef.current = now
      }

      // Spawn coins
      if (now - lastCoinRef.current > 800) {
        const lane = Math.floor(Math.random() * 3)
        setCoins(prev => [
          ...prev,
          {
            id: coinIdRef.current++,
            x: lane * LANE_WIDTH + LANE_WIDTH / 2 - 15,
            y: -50,
            lane
          }
        ])
        lastCoinRef.current = now
      }

      // Move obstacles
      setObstacles(prev => 
        prev
          .map(obs => ({ ...obs, y: obs.y + gameSpeed }))
          .filter(obs => obs.y < GAME_HEIGHT + 100)
      )

      // Move coins
      setCoins(prev =>
        prev
          .map(coin => ({ ...coin, y: coin.y + gameSpeed }))
          .filter(coin => coin.y < GAME_HEIGHT + 50)
      )

      // Increase score
      setScore(prev => prev + Math.floor(gameSpeed / 5))

      // Increase game speed over time
      setGameSpeed(prev => Math.min(prev + 0.002, 25))

      frameRef.current = requestAnimationFrame(gameLoop)
    }

    frameRef.current = requestAnimationFrame(gameLoop)

    return () => cancelAnimationFrame(frameRef.current)
  }, [isPlaying, showCountdown, gameSpeed])

  // Collision detection
  useEffect(() => {
    if (!isPlaying || showCountdown) return

    const playerY = GAME_HEIGHT - PLAYER_HEIGHT - 20

    // Check obstacle collision
    for (const obs of obstacles) {
      if (
        obs.lane === playerLane &&
        obs.y + 80 > playerY &&
        obs.y < playerY + PLAYER_HEIGHT
      ) {
        setIsPlaying(false)
        onGameOver(score)
        return
      }
    }

    // Check coin collection
    const collectedCoinIds: number[] = []
    for (const coin of coins) {
      if (
        coin.lane === playerLane &&
        coin.y + 30 > playerY &&
        coin.y < playerY + PLAYER_HEIGHT
      ) {
        collectedCoinIds.push(coin.id)
        setScore(prev => prev + 50)
      }
    }

    if (collectedCoinIds.length > 0) {
      setCoins(prev => prev.filter(c => !collectedCoinIds.includes(c.id)))
    }
  }, [obstacles, coins, playerLane, isPlaying, showCountdown, score, onGameOver])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Score */}
      <div className="w-full max-w-[400px] flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90"
        >
          ← Back
        </button>
        <div className="text-2xl font-bold text-foreground">
          Score: <span className="text-primary">{score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div
        ref={gameRef}
        className="relative bg-secondary overflow-hidden rounded-xl border-4 border-border"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Road markings */}
        <div className="absolute inset-0 flex">
          {[0, 1, 2].map(lane => (
            <div
              key={lane}
              className="flex-1 border-x border-dashed border-muted-foreground/30 relative overflow-hidden"
            >
              {/* Moving stripes */}
              <div className="absolute inset-0">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 -translate-x-1/2 w-2 h-12 bg-muted-foreground/20 road-stripe"
                    style={{ 
                      top: `${(i * 60) - (isPlaying && !showCountdown ? (Date.now() / 10) % 60 : 0)}px`,
                      animationDelay: `${i * 0.03}s`
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Countdown */}
        {showCountdown && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="text-8xl font-bold text-primary animate-pulse">
              {countdown || 'GO!'}
            </div>
          </div>
        )}

        {/* Obstacles */}
        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="absolute transition-all duration-75"
            style={{
              left: obs.x,
              top: obs.y,
              width: 50,
              height: obs.type === 'truck' ? 100 : 80
            }}
          >
            <div 
              className="w-full h-full rounded-lg flex items-center justify-center text-4xl"
              style={{ backgroundColor: obs.type === 'truck' ? '#64748b' : '#475569' }}
            >
              {obs.type === 'truck' ? '🚛' : '🚙'}
            </div>
          </div>
        ))}

        {/* Coins */}
        {coins.map(coin => (
          <div
            key={coin.id}
            className="absolute w-8 h-8 flex items-center justify-center text-2xl animate-pulse"
            style={{ left: coin.x, top: coin.y }}
          >
            ⭐
          </div>
        ))}

        {/* Player */}
        <div
          className="absolute transition-all duration-100 ease-out"
          style={{
            left: playerX,
            bottom: 20,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT
          }}
        >
          <div 
            className="w-full h-full rounded-lg flex items-center justify-center text-5xl shadow-lg"
            style={{ 
              backgroundColor: car.color,
              boxShadow: `0 0 20px ${car.color}80`
            }}
          >
            {car.emoji}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-4">
        <button
          onPointerDown={() => handleMove('left')}
          className="w-20 h-20 bg-secondary border-2 border-border rounded-xl flex items-center justify-center text-3xl text-foreground hover:bg-primary/20 active:scale-95 transition-all"
        >
          ←
        </button>
        <button
          onPointerDown={() => handleMove('right')}
          className="w-20 h-20 bg-secondary border-2 border-border rounded-xl flex items-center justify-center text-3xl text-foreground hover:bg-primary/20 active:scale-95 transition-all"
        >
          →
        </button>
      </div>

      <p className="text-muted-foreground text-sm mt-4">
        Use Arrow Keys or A/D to move • Collect ⭐ for bonus points
      </p>
    </div>
  )
}
