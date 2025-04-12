"use client"

import { useState } from "react"
import type { Company } from "@/types/company"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateId } from "@/lib/utils"
import FinanceForm from "@/components/forms/finance-form"
import CommercialForm from "@/components/forms/commercial-form"
import OperationsForm from "@/components/forms/operations-form"
import TrainingGrowthForm from "@/components/forms/training-growth-form"
import VisionStrategyESGCForm from "@/components/forms/vision-strategy-esgc-form"

interface AddCompanyFormProps {
  onAddCompany: (company: Company) => void
}

export default function AddCompanyForm({ onAddCompany }: AddCompanyFormProps) {
  const [step, setStep] = useState<number>(0)
  const [companyName, setCompanyName] = useState<string>("")
  const [showForm, setShowForm] = useState<boolean>(false)

  // Estados para cada sección del formulario
  const [finance, setFinance] = useState({
    roa: 0,
    roe: 0,
    qTobin: 0,
    zScoreAltman: 0,
    cashFlow: 0,
    workingCapital: 0,
    debtToEquity: 0,
  })

  const [commercial, setCommercial] = useState({
    salesGrowth: 0,
    receivablesIncrease: 0,
    averageCollectionPeriod: 0,
    inventoryIncrease: 0,
    clientConcentration: 0,
    marketingMix: 0,
    goodwill: 0,
  })

  const [operations, setOperations] = useState({
    efficiencyRatio: 0,
    assetTurnover: 0,
    innovation: 0,
  })

  const [trainingGrowth, setTrainingGrowth] = useState({
    employeeCapabilities: 1,
    informationSystems: 1,
    motivation: 1,
    staffIncrease: 1,
    revenuePerEmployee: 1,
    trainingExpenses: 1,
    employeeSatisfaction: 1,
  })

  const [visionStrategyESGC, setVisionStrategyESGC] = useState({
    visionMissionValues: 1,
    environmentalScore: 0,
    socialScore: 0,
    governanceScore: 0,
    climateScore: 0,
  })

  const handleStartForm = () => {
    setShowForm(true)
  }

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    const newCompany: Company = {
      id: generateId(),
      name: companyName,
      finance,
      commercial,
      operations,
      trainingGrowth,
      visionStrategyESGC,
      createdAt: new Date().toISOString(),
    }

    onAddCompany(newCompany)

    // Resetear el formulario
    setCompanyName("")
    setFinance({
      roa: 0,
      roe: 0,
      qTobin: 0,
      zScoreAltman: 0,
      cashFlow: 0,
      workingCapital: 0,
      debtToEquity: 0,
    })
    setCommercial({
      salesGrowth: 0,
      receivablesIncrease: 0,
      averageCollectionPeriod: 0,
      inventoryIncrease: 0,
      clientConcentration: 0,
      marketingMix: 0,
      goodwill: 0,
    })
    setOperations({
      efficiencyRatio: 0,
      assetTurnover: 0,
      innovation: 0,
    })
    setTrainingGrowth({
      employeeCapabilities: 1,
      informationSystems: 1,
      motivation: 1,
      staffIncrease: 1,
      revenuePerEmployee: 1,
      trainingExpenses: 1,
      employeeSatisfaction: 1,
    })
    setVisionStrategyESGC({
      visionMissionValues: 1,
      environmentalScore: 0,
      socialScore: 0,
      governanceScore: 0,
      climateScore: 0,
    })
    setStep(0)
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Añadir Empresa</h2>
        <Button onClick={handleStartForm} className="w-full">
          Añadir Nueva Empresa
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Añadir Empresa</h2>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 0 && "Información Básica"}
            {step === 1 && "Finanzas"}
            {step === 2 && "Comercial"}
            {step === 3 && "Operaciones"}
            {step === 4 && "Formación y Crecimiento"}
            {step === 5 && "Visión, Estrategia y ESGC"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nombre de la Empresa</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Introduce el nombre de la empresa"
                />
              </div>
              <Button onClick={handleNextStep} className="w-full" disabled={!companyName}>
                Siguiente
              </Button>
            </div>
          )}

          {step === 1 && (
            <FinanceForm finance={finance} setFinance={setFinance} onNext={handleNextStep} onPrev={handlePrevStep} />
          )}

          {step === 2 && (
            <CommercialForm
              commercial={commercial}
              setCommercial={setCommercial}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {step === 3 && (
            <OperationsForm
              operations={operations}
              setOperations={setOperations}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {step === 4 && (
            <TrainingGrowthForm
              trainingGrowth={trainingGrowth}
              setTrainingGrowth={setTrainingGrowth}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {step === 5 && (
            <VisionStrategyESGCForm
              visionStrategyESGC={visionStrategyESGC}
              setVisionStrategyESGC={setVisionStrategyESGC}
              onSubmit={handleSubmit}
              onPrev={handlePrevStep}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
