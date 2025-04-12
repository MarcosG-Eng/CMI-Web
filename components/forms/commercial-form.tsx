"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CommercialIndicators } from "@/types/company"

interface CommercialFormProps {
  commercial: CommercialIndicators
  setCommercial: (commercial: CommercialIndicators) => void
  onNext: () => void
  onPrev: () => void
}

export default function CommercialForm({ 
  commercial, 
  setCommercial, 
  onNext, 
  onPrev 
}: CommercialFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCommercial({
      ...commercial,
      [name]: Number.parseFloat(value) || 0
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="salesGrowth">Crecimiento de Ventas (3 años) (%)</Label>
        <Input
          id="salesGrowth"
          name="salesGrowth"
          type="number"
          value={commercial.salesGrowth}
          onChange={handleChange}
          placeholder="Crecimiento de Ventas (%)"
        />
        <p className="text-xs text-gray-500">Valor objetivo: ≥ 5%</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="receivablesIncrease">Incremento en Deudores</Label>
        <Input
          id="receivablesIncrease"
          name="receivablesIncrease"
          type="number"
          value={commercial.receivablesIncrease}
          onChange={handleChange}
          placeholder="Incremento en Deudores"
        />
        <p className="text-xs text-gray-500">Valor objetivo: = 0</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="averageCollectionPeriod">Período medio de cobro (días)</Label>
        <Input
          id="averageCollectionPeriod"
          name="averageCollectionPeriod"
          type="number"
          value={commercial.averageCollectionPeriod}
          onChange={handleChange}
          placeholder="Período medio de cobro (días)"
        />
        <p className="text-xs text-gray-500">Valor objetivo: menor a 45 días</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="inventoryIncrease">Incremento de Inventario</Label>
        <Input
          id="inventoryIncrease"
          name="inventoryIncrease"
          type="number"
          value={commercial.inventoryIncrease}
          onChange={handleChange}
          placeholder="Incremento de Inventario"
        />
        <p className="text-xs text-gray-500">Valor objetivo: = 0</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientConcentration">Concentración de Clientes (0-1)</Label>
        <Input
          id="clientConcentration"
          name="clientConcentration"
          type="number"
          min="0"
          max="1"
          step="1"
          value={commercial.clientConcentration}
          onChange={handleChange}
          placeholder="Concentración de Clientes"
        />
        <p className="text-xs text-gray-500">Valor objetivo: = 1</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="marketingMix">Marketing Mix - 4Ps (0-1)</Label>
        <Input
          id="marketingMix"
          name="marketingMix"
          type="number"
          min="0"
          max="1"
          step="1"
          value={commercial.marketingMix}
          onChange={handleChange}
          placeholder="Marketing Mix"
        />
        <p className="text-xs text-gray-500">Valor objetivo: = 1</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="goodwill">Fondo de Comercio</Label>
        <Input
          id="goodwill"
          name="goodwill"
          type="number"
          value={commercial.goodwill}
          onChange={handleChange}
          placeholder="Fondo de Comercio"
        />
        <p className="text-xs text-gray-500">Valor objetivo: mayor a 0</p>
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline">Anterior</Button>
        <Button onClick={onNext}>Siguiente</Button>
      </div>
    </div>
  );
}
