"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { VisionStrategyESGC } from "@/types/company"

interface VisionStrategyESGCFormProps {
  visionStrategyESGC: VisionStrategyESGC
  setVisionStrategyESGC: (visionStrategyESGC: VisionStrategyESGC) => void
  onSubmit: () => void
  onPrev: () => void
}

export default function VisionStrategyESGCForm({
  visionStrategyESGC,
  setVisionStrategyESGC,
  onSubmit,
  onPrev,
}: VisionStrategyESGCFormProps) {
  const handleSliderChange = (name: string, value: number[]) => {
    setVisionStrategyESGC({
      ...visionStrategyESGC,
      [name]: value[0],
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setVisionStrategyESGC({
      ...visionStrategyESGC,
      [name]: Number.parseFloat(value) || 0,
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="visionMissionValues">Visión, Misión, Valores y Objetivos Estratégicos (1-3)</Label>
        <div className="flex items-center space-x-2">
          <Slider
            id="visionMissionValues"
            min={1}
            max={3}
            step={1}
            value={[visionStrategyESGC.visionMissionValues]}
            onValueChange={(value) => handleSliderChange("visionMissionValues", value)}
          />
          <span className="w-12 text-center font-bold">{visionStrategyESGC.visionMissionValues}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="environmentalScore">Puntuación Ambiental (0-1)</Label>
        <Input
          id="environmentalScore"
          name="environmentalScore"
          type="number"
          min="0"
          max="1"
          step="0.25"
          value={visionStrategyESGC.environmentalScore}
          onChange={handleChange}
          placeholder="Puntuación Ambiental"
        />
        <p className="text-xs text-gray-500">A/A+/A- = 1, B/B+/B- = 0.75, C/C+/C- = 0.5, D/D+/D- = 0</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="socialScore">Puntuación Social (0-1)</Label>
        <Input
          id="socialScore"
          name="socialScore"
          type="number"
          min="0"
          max="1"
          step="0.25"
          value={visionStrategyESGC.socialScore}
          onChange={handleChange}
          placeholder="Puntuación Social"
        />
        <p className="text-xs text-gray-500">A/A+/A- = 1, B/B+/B- = 0.75, C/C+/C- = 0.5, D/D+/D- = 0</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="governanceScore">Puntuación de Gobernanza (0-1)</Label>
        <Input
          id="governanceScore"
          name="governanceScore"
          type="number"
          min="0"
          max="1"
          step="0.25"
          value={visionStrategyESGC.governanceScore}
          onChange={handleChange}
          placeholder="Puntuación de Gobernanza"
        />
        <p className="text-xs text-gray-500">A/A+/A- = 1, B/B+/B- = 0.75, C/C+/C- = 0.5, D/D+/D- = 0</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="climateScore">Puntuación Climática (0-1)</Label>
        <Input
          id="climateScore"
          name="climateScore"
          type="number"
          min="0"
          max="1"
          step="0.25"
          value={visionStrategyESGC.climateScore}
          onChange={handleChange}
          placeholder="Puntuación Climática"
        />
        <p className="text-xs text-gray-500">A/A+/A- = 1, B/B+/B- = 0.75, C/C+/C- = 0.5, D/D+/D- = 0</p>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline">
          Anterior
        </Button>
        <Button onClick={onSubmit}>Guardar Empresa</Button>
      </div>
    </div>
  )
}
