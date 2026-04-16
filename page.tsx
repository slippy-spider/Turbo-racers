'use client'

import { useState, useCallback, useEffect } from 'react'
import { CARS, MISSIONS, Car, Mission } from '@/lib/game-store'
import { CarSelection } from '@/components/car-selection'
import { RacingGame } from '@/components/racing-game'
import { GameOver } from '@/components/game-over'

type GameState = 'menu' | 'playing' | 'gameover'

const STORAGE_KEY = 'turbo-racers-save'

interface SaveData {
  unlockedCarIds: string[]
  completedMissionIds: number[]
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [cars, setCars] = useState<Car[]>(CARS)
  const [missions, setMissions] = useState<Mission[]>(MISSIONS)
  const [selectedCar, setSelectedCar] = useState<Car>(CARS[0])
  const [lastScore, setLastScore] = useState(0)
  const [newlyCompletedMissions, setNewlyCompletedMissions] = useState<Mission[]>([])
  const [newlyUnlockedCars, setNewlyUnlockedCars] = useState<Car[]>([])

  // Load save data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const saveData: SaveData = JSON.parse(saved)
        
        setCars(prev => prev.map(car => ({
          ...car,
          unlocked: car.unlocked || saveData.unlockedCarIds.includes(car.id)
        })))
        
        setMissions(prev => prev.map(mission => ({
          ...mission,
          completed: saveData.completedMissionIds.includes(mission.id)
        })))
      } catch (e) {
        console.error('Failed to load save data', e)
      }
    }
  }, [])

  // Save progress
  const saveProgress = useCallback((updatedCars: Car[], updatedMissions: Mission[]) => {
    const saveData: SaveData = {
      unlockedCarIds: updatedCars.filter(c => c.unlocked).map(c => c.id),
      completedMissionIds: updatedMissions.filter(m => m.completed).map(m => m.id)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData))
  }, [])

  const handleStartRace = useCallback(() => {
    setGameState('playing')
    setNewlyCompletedMissions([])
    setNewlyUnlockedCars([])
  }, [])

  const handleGameOver = useCallback((score: number) => {
    setLastScore(score)
    
    // Check for completed missions
    const newCompleted: Mission[] = []
    const updatedMissions = missions.map(mission => {
      if (!mission.completed && mission.type === 'score' && score >= mission.target) {
        newCompleted.push(mission)
        return { ...mission, completed: true }
      }
      return mission
    })
    
    // Check for unlocked cars
    const newUnlocked: Car[] = []
    const updatedCars = cars.map(car => {
      if (!car.unlocked) {
        const requiredMission = newCompleted.find(m => m.id === car.unlockMission)
        if (requiredMission) {
          newUnlocked.push({ ...car, unlocked: true })
          return { ...car, unlocked: true }
        }
      }
      return car
    })
    
    setMissions(updatedMissions)
    setCars(updatedCars)
    setNewlyCompletedMissions(newCompleted)
    setNewlyUnlockedCars(newUnlocked)
    
    // Save progress
    saveProgress(updatedCars, updatedMissions)
    
    setGameState('gameover')
  }, [missions, cars, saveProgress])

  const handlePlayAgain = useCallback(() => {
    setGameState('playing')
    setNewlyCompletedMissions([])
    setNewlyUnlockedCars([])
  }, [])

  const handleBackToGarage = useCallback(() => {
    setGameState('menu')
  }, [])

  const handleSelectCar = useCallback((car: Car) => {
    if (car.unlocked) {
      setSelectedCar(car)
    }
  }, [])

  // Find the actual selected car from our state (in case it was unlocked)
  const currentSelectedCar = cars.find(c => c.id === selectedCar.id) || cars[0]

  if (gameState === 'playing') {
    return (
      <RacingGame
        car={currentSelectedCar}
        onGameOver={handleGameOver}
        onBack={handleBackToGarage}
      />
    )
  }

  if (gameState === 'gameover') {
    return (
      <GameOver
        score={lastScore}
        car={currentSelectedCar}
        completedMissions={newlyCompletedMissions}
        unlockedCars={newlyUnlockedCars}
        onPlayAgain={handlePlayAgain}
        onBackToGarage={handleBackToGarage}
      />
    )
  }

  return (
    <CarSelection
      cars={cars}
      missions={missions}
      selectedCar={currentSelectedCar}
      onSelectCar={handleSelectCar}
      onStartRace={handleStartRace}
    />
  )
}
