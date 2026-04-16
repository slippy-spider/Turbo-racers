'use client'

import { Car, Mission } from '@/lib/game-store'
import { Lock, Zap, Gauge, RotateCcw } from 'lucide-react'

interface CarSelectionProps {
  cars: Car[]
  missions: Mission[]
  selectedCar: Car
  onSelectCar: (car: Car) => void
  onStartRace: () => void
}

export function CarSelection({
  cars,
  missions,
  selectedCar,
  onSelectCar,
  onStartRace
}: CarSelectionProps) {
  const completedMissions = missions.filter(m => m.completed).length

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
            <span className="text-primary">TURBO</span> RACERS
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete missions to unlock new cars!
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
            <span className="text-accent font-bold">{completedMissions}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{missions.length}</span>
            <span className="text-muted-foreground text-sm">Missions Complete</span>
          </div>
        </div>

        {/* Selected Car Preview */}
        <div className="bg-card rounded-2xl p-6 mb-8 border border-border">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div 
              className="w-32 h-32 rounded-xl flex items-center justify-center text-6xl animate-pulse-glow"
              style={{ backgroundColor: selectedCar.color + '20' }}
            >
              {selectedCar.emoji}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {selectedCar.name}
              </h2>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                <StatBar icon={<Zap className="w-4 h-4" />} label="Speed" value={selectedCar.speed} />
                <StatBar icon={<Gauge className="w-4 h-4" />} label="Accel" value={selectedCar.acceleration} />
                <StatBar icon={<RotateCcw className="w-4 h-4" />} label="Handle" value={selectedCar.handling} />
              </div>
            </div>
            <button
              onClick={onStartRace}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-xl hover:opacity-90 transition-all animate-pulse-glow"
            >
              START RACE
            </button>
          </div>
        </div>

        {/* Car Grid */}
        <h3 className="text-xl font-bold text-foreground mb-4">Select Your Car</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cars.map((car) => {
            const isSelected = selectedCar.id === car.id
            const requiredMission = missions.find(m => m.id === car.unlockMission)
            
            return (
              <button
                key={car.id}
                onClick={() => car.unlocked && onSelectCar(car)}
                disabled={!car.unlocked}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  car.unlocked
                    ? isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                    : 'border-border bg-secondary/50 cursor-not-allowed'
                }`}
              >
                {!car.unlocked && (
                  <div className="absolute inset-0 bg-background/80 rounded-xl flex flex-col items-center justify-center z-10">
                    <Lock className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground text-center px-2">
                      Complete Mission {car.unlockMission}
                    </span>
                  </div>
                )}
                <div 
                  className="w-16 h-16 rounded-lg mx-auto mb-2 flex items-center justify-center text-4xl"
                  style={{ backgroundColor: car.color + '30' }}
                >
                  {car.emoji}
                </div>
                <p className="font-semibold text-foreground text-sm truncate">
                  {car.name}
                </p>
                <div className="flex gap-1 justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < Math.ceil((car.speed + car.acceleration + car.handling) / 6)
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Missions */}
        <h3 className="text-xl font-bold text-foreground mb-4">Missions</h3>
        <div className="grid gap-3">
          {missions.map((mission, index) => {
            const unlockedCar = cars.find(c => c.unlockMission === mission.id)
            
            return (
              <div
                key={mission.id}
                className={`p-4 rounded-xl border ${
                  mission.completed
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    mission.completed
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {mission.completed ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{mission.name}</h4>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                  </div>
                  {unlockedCar && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Unlocks</p>
                      <p className="font-semibold text-foreground text-sm">
                        {unlockedCar.emoji} {unlockedCar.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatBar({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  )
}
