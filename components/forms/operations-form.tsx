"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { OperationsIndicators } from "@/types/company"

interface OperationsFormProps {
  operations: OperationsIndicators
  setOperations: (operations: OperationsIndicators) => void
  onNext: () => void
  onPrev: () => void
}

export default function OperationsForm({ 
  operations, 
  setOperations, 
  onNext, 
  onPrev 
}: OperationsFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOperations({
      ...operations,
      [name]: Number.parseFloat(value) || 0
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="efficiencyRatio">Ratio de Eficiencia (%)</Label>
        <Input
          id="efficiencyRatio"
          name="efficiencyRatio"
          type="number"
          value={operations.efficiencyRatio}
          onChange={handleChange}
          placeholder="Ratio de Eficiencia (%)"
        />
        <p className="text-xs text-gray-500">Valor objetivo: menor a 70%</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assetTurnover">Rotación de Activos</Label>
        <Input
          id="assetTurnover"
          name="assetTurnover"
          type="number"
          step="0.01"
          value={operations.assetTurnover}
          onChange={handleChange}
          placeholder="Rotación de Activos"
        />
        <p className="text-xs text-gray-500">Valor objetivo: mayor a 1</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="innovation">Innovación (0-5)</Label>
        <Input
          id="innovation"
          name="innovation"
          type="number"
          min="0"
          max="5"
          step="0.5"
          value={operations.innovation}
          onChange={handleChange}
          placeholder="Innovación"
        />
        <p className="text-xs text-gray-500">Valor objetivo: Mayor puntuación</p>
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline">Anterior</Button>
        <Button onClick={onNext}>Siguiente</Button>
      </div>
    </div>
  );
}
