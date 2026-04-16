'use client'

import { Car, Mission } from '@/lib/game-store'
import { Trophy, Star, Unlock } from 'lucide-react'

interface GameOverProps {
  score: number
  car: Car
  completedMissions: Mission[]
  unlockedCars: Car[]
  onPlayAgain: () => void
  onBackToGarage: () => void
}

export function GameOver({
  score,
  car,
  completedMissions,
  unlockedCars,
  onPlayAgain,
  onBackToGarage
}: GameOverProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center">
        {/* Trophy Icon */}
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-primary" />
        </div>

        {/* Game Over Text */}
        <h1 className="text-4xl font-bold text-foreground mb-2">GAME OVER</h1>
        
        {/* Score */}
        <div className="bg-secondary rounded-xl p-4 mb-6">
          <p className="text-muted-foreground text-sm mb-1">Final Score</p>
          <p className="text-5xl font-bold text-primary">{score.toLocaleString()}</p>
          <p className="text-muted-foreground text-sm mt-2">
            Played with {car.emoji} {car.name}
          </p>
        </div>

        {/* Completed Missions */}
        {completedMissions.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-accent mb-3">
              <Star className="w-5 h-5" />
              <span className="font-semibold">Missions Completed!</span>
            </div>
            <div className="space-y-2">
              {completedMissions.map(mission => (
                <div
                  key={mission.id}
                  className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-2"
                >
                  <p className="font-semibold text-foreground">{mission.name}</p>
                  <p className="text-sm text-muted-foreground">{mission.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unlocked Cars */}
        {unlockedCars.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-primary mb-3">
              <Unlock className="w-5 h-5" />
              <span className="font-semibold">New Cars Unlocked!</span>
            </div>
            <div className="flex justify-center gap-4">
              {unlockedCars.map(unlockedCar => (
                <div
                  key={unlockedCar.id}
                  className="bg-primary/10 border border-primary/30 rounded-xl p-4"
                >
                  <div 
                    className="w-16 h-16 rounded-lg mx-auto mb-2 flex items-center justify-center text-4xl animate-pulse-glow"
                    style={{ backgroundColor: unlockedCar.color + '30' }}
                  >
                    {unlockedCar.emoji}
                  </div>
                  <p className="font-semibold text-foreground text-sm">{unlockedCar.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onBackToGarage}
            className="w-full py-4 bg-secondary text-secondary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all"
          >
            BACK TO GARAGE
          </button>
        </div>
      </div>
    </div>
  )
}
