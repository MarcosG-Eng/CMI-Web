"use client"

import { useState } from "react"
import type { Company, CompanyScore } from "@/types/company"
import { calculateCompanyScores } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import HeatMap from "@/components/heat-map"
import CompanyDetail from "@/components/company-detail"

interface DashboardProps {
  companies: Company[]
  selectedCompany: string | null
  selectedIndicator: string | null
  onSelectIndicator: (indicator: string) => void
}

export default function Dashboard({
  companies,
  selectedCompany,
  selectedIndicator,
  onSelectIndicator,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("heatmap")

  // Calcular puntuaciones para todas las empresas
  const companyScores: CompanyScore[] = companies.map((company) => calculateCompanyScores(company))

  // Obtener la empresa seleccionada
  const selectedCompanyData = selectedCompany ? companies.find((c) => c.id === selectedCompany) : null

  if (companies.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Bienvenido al Cuadro de Mando Integral</CardTitle>
            <CardDescription>Añade empresas para comenzar a visualizar los datos.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Utiliza el formulario de la derecha para añadir empresas y visualizar sus indicadores en el cuadro de
              mando.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Cuadro de Mando Integral</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="heatmap">Mapa de Calor</TabsTrigger>
          <TabsTrigger value="detail" disabled={!selectedCompany}>
            Detalle de Empresa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap" className="flex-1">
          <HeatMap
            companyScores={companyScores}
            selectedCompany={selectedCompany}
            selectedIndicator={selectedIndicator}
            onSelectCompany={(id) => onSelectIndicator(id)}
          />
        </TabsContent>

        <TabsContent value="detail" className="flex-1">
          {selectedCompanyData && <CompanyDetail company={selectedCompanyData} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
