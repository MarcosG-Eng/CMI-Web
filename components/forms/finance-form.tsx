"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FinanceIndicators } from "@/types/company"

interface FinanceFormProps {
  finance: FinanceIndicators
  setFinance: (finance: FinanceIndicators) => void
  onNext: () => void
  onPrev: () => void
}

export default function FinanceForm({ 
  finance, 
  setFinance, 
  onNext, 
  onPrev 
}: FinanceFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFinance({
      ...finance,
      [name]: Number.parseFloat(value) || 0
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="roa">ROA (%)</Label>
        <Input
          id="roa"
          name="roa"
          type="number"
          value={finance.roa}
          onChange={handleChange}
          placeholder="ROA (%)"
        />
        <p className="text-xs text-gray-500">Valor objetivo: ≥ 15%</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="roe">ROE (%)</Label>
        <Input
          id="roe"
          name="roe"
          type="number"
          value={finance.roe}
          onChange={handleChange}
          placeholder="ROE (%)"
        />
        <p className="text-xs text-gray-500">Valor objetivo: ≥ 15%</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="qTobin">Q de Tobin</Label>
        <Input
          id="qTobin"
          name="qTobin"
          type="number"
          step="0.01"
          value={finance.qTobin}
          onChange={handleChange}
          placeholder="Q de Tobin"
        />
        <p className="text-xs text-gray-500">Valor objetivo: ≥ 1</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="zScoreAltman">Z-Score de Altman</Label>
        <Input
          id="zScoreAltman"
          name="zScoreAltman"
          type="number"
          step="0.01"
          value={finance.zScoreAltman}
          onChange={handleChange}
          placeholder="Z-Score de Altman"
        />
        <p className="text-xs text-gray-500">Valor objetivo: ≥ 3</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cashFlow">Cash Flow</Label>
        <Input
          id="cashFlow"
          name="cashFlow"
          type="number"
          step="0.01"
          value={finance.cashFlow}
          onChange={handleChange}
          placeholder="Cash Flow"
        />
        <p className="text-xs text-gray-500">Valor objetivo: ≥ 0</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="workingCapital">Fondo de Maniobra</Label>
        <Input
          id="workingCapital"
          name="workingCapital"
          type="number"
          step="0.01"
          value={finance.workingCapital}
          onChange={handleChange}
          placeholder="Fondo de Maniobra"
        />
        <p className="text-xs text-gray-500">Valor objetivo: ≥ 1</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="debtToEquity">Deuda/Capital Propio</Label>
        <Input
          id="debtToEquity"
          name="debtToEquity"
          type="number"
          step="0.01"
          value={finance.debtToEquity}
          onChange={handleChange}
          placeholder="Deuda/Capital Propio"
        />
        <p className="text-xs text-gray-500">Valor objetivo: menor a 0.5</p>
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline">Anterior</Button>
        <Button onClick={onNext}>Siguiente</Button>
      </div>
    </div>
  );
}
