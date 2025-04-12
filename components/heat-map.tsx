"use client"

import { useState } from "react"
import type { CompanyScore } from "@/types/company"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface HeatMapProps {
  companyScores: CompanyScore[]
  selectedCompany: string | null
  selectedIndicator: string | null
  onSelectCompany: (companyId: string) => void
}

export default function HeatMap({ companyScores, selectedCompany, selectedIndicator, onSelectCompany }: HeatMapProps) {
  const [activeCategory, setActiveCategory] = useState<string>("global")

  const categories = [
    { id: "global", name: "Global" },
    { id: "finance", name: "Finanzas" },
    { id: "commercial", name: "Comercial" },
    { id: "operations", name: "Operaciones" },
    { id: "trainingGrowth", name: "Formación y Crecimiento" },
    { id: "visionStrategyESGC", name: "Visión, Estrategia y ESGC" },
  ]

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Mapa de Calor</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="flex-1">
              <div className="grid grid-cols-3 gap-4 mt-4">
                {companyScores.map((company) => {
                  // @ts-ignore - Acceder dinámicamente a la propiedad
                  const categoryScore = company[category.id]

                  return (
                    <div
                      key={company.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${categoryScore.color} ${
                        selectedCompany === company.id ? "ring-2 ring-offset-2 ring-black" : ""
                      }`}
                      onClick={() => onSelectCompany(company.id)}
                    >
                      <h3 className="font-bold text-white">{company.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-white text-sm">Puntuación: {categoryScore.score}/7</span>
                        <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {categoryScore.rating}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
