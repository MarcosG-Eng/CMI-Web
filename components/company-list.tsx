"use client"

import type { Company } from "@/types/company"
import { Button } from "@/components/ui/button"
import { calculateCompanyScores } from "@/lib/utils"

interface CompanyListProps {
  companies: Company[]
  onSelectCompany: (companyId: string) => void
  selectedCompany: string | null
}

export default function CompanyList({ companies, onSelectCompany, selectedCompany }: CompanyListProps) {
  if (companies.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Empresas</h2>
        <p className="text-gray-500">
          No hay empresas añadidas. Utiliza el formulario de la derecha para añadir una empresa.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Empresas</h2>
      <div className="space-y-2">
        {companies.map((company) => {
          const scores = calculateCompanyScores(company)
          return (
            <Button
              key={company.id}
              variant={selectedCompany === company.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onSelectCompany(company.id)}
            >
              <div className="flex items-center w-full">
                <span className="flex-1 text-left">{company.name}</span>
                <span className={`w-4 h-4 rounded-full ${scores.global.color}`}></span>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
