"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { TrainingGrowthIndicators } from "@/types/company"

interface TrainingGrowthFormProps {
  trainingGrowth: TrainingGrowthIndicators
  setTrainingGrowth: (trainingGrowth: TrainingGrowthIndicators) => void
  onNext: () => void
  onPrev: () => void
}

export default function TrainingGrowthForm({ 
  trainingGrowth, 
  setTrainingGrowth, 
  onNext, 
  onPrev 
}: TrainingGrowthFormProps) {
  const handleSliderChange = (name: string, value: number[]) => {
    setTrainingGrowth({
      ...trainingGrowth,
      [name]: value[0]
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="employeeCapabilities">Capacidades de los Empleados (1-7)</Label>
        <div className="flex items-center space-x-2">
          <Slider
            id="employeeCapabilities"
            min={1}
            max={7}
            step={1}
            value={[trainingGrowth.employeeCapabilities]}
            onValueChange={(value) => handleSliderChange("employeeCapabilities", value)}
          />
          <span className="w-12 text-center font-bold">{trainingGrowth.employeeCapabilities}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="informationSystems">Capacidades de los Sistemas de Información (1-7)</Label>
        <div className="flex items-center space-x-2">
          <Slider
            id="informationSystems"
            min={1}
            max={7}
            step={1}
            value={[trainingGrowth.informationSystems]}
            onValueChange={(value) => handleSliderChange("informationSystems", value)}
          />
          <span className="w-12 text-center font-bold">{trainingGrowth.informationSystems}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="motivation">Motivación y Alineación Estratégica (1-7)</Label>
        <div className="flex items-center space-x-2">
          <Slider
            id="motivation"
            min={1}
            max={7}
            step={1}
            value={[trainingGrowth.motivation]}
            onValueChange={(value) => handleSliderChange("motivation", value)}
          />
          <span className="w-12 text-center font-bold">{trainingGrowth.motivation}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="staffIncrease">Incremento de la Plantilla (1-7)</Label>
        <div className="flex items-center space-x-2">
          <Slider
            id="staffIncrease"
            min={1}
            max={7}
            step={1}
            value={[trainingGrowth.staffIncrease]}
            onValueChange={(value) => handleSliderChange("staffIncrease", value)}
          />
          <span className="w-12 text-center font-bold">{trainingGrowth.staffIncrease}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="revenuePerEmployee">Incremento Ingresos por Empleado (1-7)</Label>
        <div className="flex items-center space-x-2">
          <Slider
            id="revenuePerEmployee"
            min={1}
            max={7}
            step={1}
            value={[trainingGrowth.revenuePerEmployee]}
            onValueChange={(value) => handleSliderChange("revenuePerEmployee", value)}
          />
          <span className="w-12 text-center font-bold">{trainingGrowth.revenuePerEmployee}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="trainingExpenses">Gastos en Formación (1-7)</Label>
        <div className="flex items-center space-x-2">
          <Slider
            id="trainingExpenses"
            min={1}
            max={7}
            step={1}
            value={[trainingGrowth.trainingExpenses]}
            onValueChange={(value) => handleSliderChange("trainingExpenses", value)}
          />
          <span className="w-12 text-center font-bold">{trainingGrowth.trainingExpenses}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="employeeSatisfaction">Satisfacción de Empleados (1-7)</Label>
        <div className="flex items-center space-x-2">
          <Slider
            id="employeeSatisfaction"
            min={1}
            max={7}
            step={1}
            value={[trainingGrowth.employeeSatisfaction]}
            onValueChange={(value) => handleSliderChange("employeeSatisfaction", value)}
          />
          <span className="w-12 text-center font-bold">{trainingGrowth.employeeSatisfaction}</span>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline">Anterior</Button>
        <Button onClick={onNext}>Siguiente</Button>
      </div>
    </div>
  );
}
