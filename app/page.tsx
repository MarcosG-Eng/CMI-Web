"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Trash2, Lock, LogOut, FileDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Definición de tipos
type Rating = "A" | "B" | "C"

interface Company {
  id: string
  name: string
  // Finanzas
  roa: number
  roe: number
  qTobin: number
  zScoreAltman: number
  cashFlow: number
  workingCapital: number
  debtToEquity: number
  // Comercial
  salesGrowth: number
  receivablesIncrease: number
  averageCollectionPeriod: number
  inventoryIncrease: number
  clientConcentration: number
  marketingMix: number
  goodwill: number
  // Operaciones
  efficiencyRatio: number
  assetTurnover: number
  innovation: number
  // Formación y Crecimiento
  employeeCapabilities: number
  informationSystems: number
  motivation: number
  staffIncrease: number
  revenuePerEmployee: number
  trainingExpenses: number
  employeeSatisfaction: number
  // Visión, Estrategia y ESGC
  visionMissionValues: number
  environmentalScore: number
  socialScore: number
  governanceScore: number
  climateScore: number
  // Metadata
  createdAt: string
}

interface CategoryScore {
  score: number
  rating: Rating
  color: string
}

interface CompanyScore {
  id: string
  name: string
  finance: CategoryScore
  commercial: CategoryScore
  operations: CategoryScore
  trainingGrowth: CategoryScore
  visionStrategyESGC: CategoryScore
  global: CategoryScore
}

// Funciones de utilidad
function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function scoreToRating(score: number): Rating {
  if (score >= 6) return "A"
  if (score >= 4) return "B"
  return "C"
}

function ratingToColor(rating: Rating): string {
  switch (rating) {
    case "A":
      return "bg-green-500"
    case "B":
      return "bg-yellow-500"
    case "C":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function calculateFinanceScore(company: Company): number {
  let score = 0
  if (company.roa >= 15) score += 1
  if (company.roe >= 15) score += 1
  if (company.qTobin >= 1) score += 1
  if (company.zScoreAltman >= 3) score += 1
  if (company.cashFlow >= 0) score += 1
  if (company.workingCapital >= 1) score += 1
  if (company.debtToEquity < 0.5) score += 1
  return score
}

function calculateCommercialScore(company: Company): number {
  let score = 0
  if (company.salesGrowth >= 5) score += 1
  if (company.receivablesIncrease === 0) score += 1
  if (company.averageCollectionPeriod < 45) score += 1
  if (company.inventoryIncrease === 0) score += 1
  score += company.clientConcentration
  score += company.marketingMix
  if (company.goodwill > 0) score += 1
  return score
}

function calculateOperationsScore(company: Company): number {
  let score = 0
  if (company.efficiencyRatio < 70) score += 1
  if (company.assetTurnover > 1) score += 1
  score += company.innovation
  // Normalizar a escala 1-7
  return Math.min(7, Math.max(1, Math.round((score * 7) / 3)))
}

function calculateTrainingGrowthScore(company: Company): number {
  const total =
    company.employeeCapabilities +
    company.informationSystems +
    company.motivation +
    company.staffIncrease +
    company.revenuePerEmployee +
    company.trainingExpenses +
    company.employeeSatisfaction
  // Promedio (ya está en escala 1-7)
  return Math.round(total / 7)
}

function calculateVisionStrategyESGCScore(company: Company): number {
  const score = company.visionMissionValues
  // Sumar puntuaciones ESGC (máximo 4 puntos)
  const esgcScore = company.environmentalScore + company.socialScore + company.governanceScore + company.climateScore
  // Normalizar a escala 1-7
  return Math.min(7, Math.max(1, Math.round(((score + esgcScore) * 7) / 7)))
}

function calculateCompanyScores(company: Company): CompanyScore {
  // Calcular puntuaciones por categoría
  const financeScore = calculateFinanceScore(company)
  const commercialScore = calculateCommercialScore(company)
  const operationsScore = calculateOperationsScore(company)
  const trainingGrowthScore = calculateTrainingGrowthScore(company)
  const visionStrategyESGCScore = calculateVisionStrategyESGCScore(company)

  // Calcular puntuación global (promedio de todas las categorías)
  const globalScore = Math.round(
    (financeScore + commercialScore + operationsScore + trainingGrowthScore + visionStrategyESGCScore) / 5,
  )

  // Crear objeto de puntuaciones
  return {
    id: company.id,
    name: company.name,
    finance: {
      score: financeScore,
      rating: scoreToRating(financeScore),
      color: ratingToColor(scoreToRating(financeScore)),
    },
    commercial: {
      score: commercialScore,
      rating: scoreToRating(commercialScore),
      color: ratingToColor(scoreToRating(commercialScore)),
    },
    operations: {
      score: operationsScore,
      rating: scoreToRating(operationsScore),
      color: ratingToColor(scoreToRating(operationsScore)),
    },
    trainingGrowth: {
      score: trainingGrowthScore,
      rating: scoreToRating(trainingGrowthScore),
      color: ratingToColor(scoreToRating(trainingGrowthScore)),
    },
    visionStrategyESGC: {
      score: visionStrategyESGCScore,
      rating: scoreToRating(visionStrategyESGCScore),
      color: ratingToColor(scoreToRating(visionStrategyESGCScore)),
    },
    global: {
      score: globalScore,
      rating: scoreToRating(globalScore),
      color: ratingToColor(scoreToRating(globalScore)),
    },
  }
}

function generateCompanyPDF(company: Company, companyScore: CompanyScore) {
  // Crear un nuevo documento PDF
  const doc = new jsPDF()

  // Añadir título
  doc.setFontSize(20)
  doc.text(`Informe: ${company.name}`, 14, 22)

  // Añadir fecha de generación
  doc.setFontSize(10)
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30)

  // Añadir puntuación global
  doc.setFontSize(16)
  doc.text("Puntuación Global", 14, 40)

  // Crear tabla de puntuación global
  autoTable(doc, {
    startY: 45,
    head: [["Categoría", "Puntuación", "Calificación"]],
    body: [
      ["Global", `${companyScore.global.score}/7`, companyScore.global.rating],
      ["Finanzas", `${companyScore.finance.score}/7`, companyScore.finance.rating],
      ["Comercial", `${companyScore.commercial.score}/7`, companyScore.commercial.rating],
      ["Operaciones", `${companyScore.operations.score}/7`, companyScore.operations.rating],
      ["Formación y Crecimiento", `${companyScore.trainingGrowth.score}/7`, companyScore.trainingGrowth.rating],
      [
        "Visión, Estrategia y ESGC",
        `${companyScore.visionStrategyESGC.score}/7`,
        companyScore.visionStrategyESGC.rating,
      ],
    ],
  })

  // Añadir sección de finanzas
  doc.setFontSize(16)
  doc.text("Indicadores Financieros", 14, doc.lastAutoTable.finalY + 15)

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Indicador", "Valor", "Objetivo"]],
    body: [
      ["ROA", `${company.roa}%`, "≥ 15%"],
      ["ROE", `${company.roe}%`, "≥ 15%"],
      ["Q de Tobin", company.qTobin, "≥ 1"],
      ["Z-Score de Altman", company.zScoreAltman, "≥ 3"],
      ["Cash Flow", company.cashFlow, "≥ 0"],
      ["Fondo de Maniobra", company.workingCapital, "≥ 1"],
      ["Deuda/Capital Propio", company.debtToEquity, "< 0.5"],
    ],
  })

  // Añadir sección comercial
  doc.setFontSize(16)
  doc.text("Indicadores Comerciales", 14, doc.lastAutoTable.finalY + 15)

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Indicador", "Valor", "Objetivo"]],
    body: [
      ["Crecimiento de Ventas (3 años)", `${company.salesGrowth}%`, "≥ 5%"],
      ["Incremento en Deudores", company.receivablesIncrease, "= 0"],
      ["Período medio de cobro", `${company.averageCollectionPeriod} días`, "< 45 días"],
      ["Incremento de Inventario", company.inventoryIncrease, "= 0"],
      ["Concentración de Clientes", company.clientConcentration, "= 1"],
      ["Marketing Mix (4Ps)", company.marketingMix, "= 1"],
      ["Fondo de Comercio", company.goodwill, "> 0"],
    ],
  })

  // Añadir nueva página
  doc.addPage()

  // Añadir sección de operaciones
  doc.setFontSize(16)
  doc.text("Indicadores de Operaciones", 14, 20)

  autoTable(doc, {
    startY: 25,
    head: [["Indicador", "Valor", "Objetivo"]],
    body: [
      ["Ratio de Eficiencia", `${company.efficiencyRatio}%`, "< 70%"],
      ["Rotación de Activos", company.assetTurnover, "> 1"],
      ["Innovación", `${company.innovation}/5`, "Mayor puntuación"],
    ],
  })

  // Añadir sección de formación y crecimiento
  doc.setFontSize(16)
  doc.text("Indicadores de Formación y Crecimiento", 14, doc.lastAutoTable.finalY + 15)

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Indicador", "Valor (1-7)"]],
    body: [
      ["Capacidades de Empleados", company.employeeCapabilities],
      ["Sistemas de Información", company.informationSystems],
      ["Motivación", company.motivation],
      ["Incremento de Plantilla", company.staffIncrease],
      ["Ingresos por Empleado", company.revenuePerEmployee],
      ["Gastos en Formación", company.trainingExpenses],
      ["Satisfacción de Empleados", company.employeeSatisfaction],
    ],
  })

  // Añadir sección de visión, estrategia y ESGC
  doc.setFontSize(16)
  doc.text("Indicadores de Visión, Estrategia y ESGC", 14, doc.lastAutoTable.finalY + 15)

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Indicador", "Valor", "Escala"]],
    body: [
      ["Visión, Misión y Valores", `${company.visionMissionValues}/3`, "1-3"],
      ["Puntuación Ambiental", company.environmentalScore, "0-1"],
      ["Puntuación Social", company.socialScore, "0-1"],
      ["Puntuación de Gobernanza", company.governanceScore, "0-1"],
      ["Puntuación Climática", company.climateScore, "0-1"],
    ],
  })

  // Añadir pie de página
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    )
    doc.text("Cuadro de Mando Integral con Sostenibilidad", 14, doc.internal.pageSize.getHeight() - 10)
  }

  // Guardar el PDF
  doc.save(`Informe_${company.name.replace(/\s+/g, "_")}.pdf`)
}

// Componente principal
export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("heatmap")
  const [activeCategory, setActiveCategory] = useState<string>("global")
  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [formStep, setFormStep] = useState<number>(0)

  // Estado para la autenticación de administrador
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false)
  const [adminPassword, setAdminPassword] = useState<string>("")
  const [loginError, setLoginError] = useState<string>("")

  // Estado para el formulario de nueva empresa
  const [newCompany, setNewCompany] = useState<Company>({
    id: generateId(),
    name: "",
    // Finanzas
    roa: 0,
    roe: 0,
    qTobin: 0,
    zScoreAltman: 0,
    cashFlow: 0,
    workingCapital: 0,
    debtToEquity: 0,
    // Comercial
    salesGrowth: 0,
    receivablesIncrease: 0,
    averageCollectionPeriod: 0,
    inventoryIncrease: 0,
    clientConcentration: 0,
    marketingMix: 0,
    goodwill: 0,
    // Operaciones
    efficiencyRatio: 0,
    assetTurnover: 0,
    innovation: 0,
    // Formación y Crecimiento
    employeeCapabilities: 1,
    informationSystems: 1,
    motivation: 1,
    staffIncrease: 1,
    revenuePerEmployee: 1,
    trainingExpenses: 1,
    employeeSatisfaction: 1,
    // Visión, Estrategia y ESGC
    visionMissionValues: 1,
    environmentalScore: 0,
    socialScore: 0,
    governanceScore: 0,
    climateScore: 0,
    // Metadata
    createdAt: new Date().toISOString(),
  })

  // Cargar empresas desde localStorage al iniciar
  useEffect(() => {
    const storedCompanies = localStorage.getItem("cmi-companies")
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies))
    }

    // Verificar si hay una sesión de administrador guardada
    const adminSession = localStorage.getItem("cmi-admin-session")
    if (adminSession === "true") {
      setIsAdmin(true)
    }
  }, [])

  // Guardar empresas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("cmi-companies", JSON.stringify(companies))
  }, [companies])

  // Calcular puntuaciones para todas las empresas
  const companyScores: CompanyScore[] = companies.map((company) => calculateCompanyScores(company))

  // Obtener la empresa seleccionada
  const selectedCompanyData = selectedCompany ? companies.find((c) => c.id === selectedCompany) : null

  // Manejadores de eventos
  const handleSelectCompany = (companyId: string) => {
    setSelectedCompany(companyId)
    setActiveTab("heatmap")
  }

  const handleStartAddCompany = () => {
    setShowAddForm(true)
    setFormStep(0)
    setNewCompany({
      id: generateId(),
      name: "",
      // Finanzas
      roa: 0,
      roe: 0,
      qTobin: 0,
      zScoreAltman: 0,
      cashFlow: 0,
      workingCapital: 0,
      debtToEquity: 0,
      // Comercial
      salesGrowth: 0,
      receivablesIncrease: 0,
      averageCollectionPeriod: 0,
      inventoryIncrease: 0,
      clientConcentration: 0,
      marketingMix: 0,
      goodwill: 0,
      // Operaciones
      efficiencyRatio: 0,
      assetTurnover: 0,
      innovation: 0,
      // Formación y Crecimiento
      employeeCapabilities: 1,
      informationSystems: 1,
      motivation: 1,
      staffIncrease: 1,
      revenuePerEmployee: 1,
      trainingExpenses: 1,
      employeeSatisfaction: 1,
      // Visión, Estrategia y ESGC
      visionMissionValues: 1,
      environmentalScore: 0,
      socialScore: 0,
      governanceScore: 0,
      climateScore: 0,
      // Metadata
      createdAt: new Date().toISOString(),
    })
  }

  const handleCancelAddCompany = () => {
    setShowAddForm(false)
  }

  const handleNextStep = () => {
    setFormStep(formStep + 1)
  }

  const handlePrevStep = () => {
    setFormStep(formStep - 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCompany({
      ...newCompany,
      [name]: name === "name" ? value : Number(value),
    })
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setNewCompany({
      ...newCompany,
      [name]: value[0],
    })
  }

  const handleSubmitCompany = () => {
    setCompanies([...companies, newCompany])
    setShowAddForm(false)
    setSelectedCompany(newCompany.id)

    toast({
      title: "Empresa añadida",
      description: `La empresa ${newCompany.name} ha sido añadida correctamente.`,
    })
  }

  // Funciones para la autenticación de administrador
  const handleOpenLoginDialog = () => {
    setShowLoginDialog(true)
    setAdminPassword("")
    setLoginError("")
  }

  const handleCloseLoginDialog = () => {
    setShowLoginDialog(false)
    setAdminPassword("")
    setLoginError("")
  }

  const handleAdminLogin = () => {
    if (adminPassword === "admin4321") {
      setIsAdmin(true)
      setShowLoginDialog(false)
      localStorage.setItem("cmi-admin-session", "true")

      toast({
        title: "Sesión iniciada",
        description: "Has iniciado sesión como administrador.",
      })
    } else {
      setLoginError("Contraseña incorrecta")
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem("cmi-admin-session")

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión como administrador.",
    })
  }

  // Función para eliminar una empresa
  const handleDeleteCompany = (companyId: string) => {
    if (!isAdmin) return

    const companyToDelete = companies.find((c) => c.id === companyId)
    if (!companyToDelete) return

    const newCompanies = companies.filter((c) => c.id !== companyId)
    setCompanies(newCompanies)

    if (selectedCompany === companyId) {
      setSelectedCompany(newCompanies.length > 0 ? newCompanies[0].id : null)
    }

    toast({
      title: "Empresa eliminada",
      description: `La empresa ${companyToDelete.name} ha sido eliminada.`,
    })
  }

  // Renderizado condicional para el formulario de añadir empresa
  const renderAddCompanyForm = () => {
    if (!showAddForm) {
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Añadir Empresa</h2>
          <Button onClick={handleStartAddCompany} className="w-full">
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
              {formStep === 0 && "Información Básica"}
              {formStep === 1 && "Finanzas"}
              {formStep === 2 && "Comercial"}
              {formStep === 3 && "Operaciones"}
              {formStep === 4 && "Formación y Crecimiento"}
              {formStep === 5 && "Visión, Estrategia y ESGC"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Empresa</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newCompany.name}
                    onChange={handleInputChange}
                    placeholder="Introduce el nombre de la empresa"
                  />
                </div>
                <div className="flex justify-between">
                  <Button onClick={handleCancelAddCompany} variant="outline">
                    Cancelar
                  </Button>
                  <Button onClick={handleNextStep} disabled={!newCompany.name}>
                    Siguiente
                  </Button>
                </div>
              </div>
            )}

            {formStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roa">ROA (%)</Label>
                  <Input
                    id="roa"
                    name="roa"
                    type="number"
                    value={newCompany.roa}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="ROA (%)"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: mayor o igual a 15%</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roe">ROE (%)</Label>
                  <Input
                    id="roe"
                    name="roe"
                    type="number"
                    value={newCompany.roe}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="ROE (%)"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: mayor o igual a 15%</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qTobin">Q de Tobin</Label>
                  <Input
                    id="qTobin"
                    name="qTobin"
                    type="number"
                    step="0.01"
                    value={newCompany.qTobin}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Q de Tobin"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: mayor o igual a 1</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zScoreAltman">Z-Score de Altman</Label>
                  <Input
                    id="zScoreAltman"
                    name="zScoreAltman"
                    type="number"
                    step="0.01"
                    value={newCompany.zScoreAltman}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Z-Score de Altman"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: mayor o igual a 3</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cashFlow">Cash Flow</Label>
                  <Input
                    id="cashFlow"
                    name="cashFlow"
                    type="number"
                    step="0.01"
                    value={newCompany.cashFlow}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Cash Flow"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: mayor o igual a 0</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingCapital">Fondo de Maniobra</Label>
                  <Input
                    id="workingCapital"
                    name="workingCapital"
                    type="number"
                    step="0.01"
                    value={newCompany.workingCapital}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Fondo de Maniobra"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: mayor o igual a 1</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="debtToEquity">Deuda/Capital Propio</Label>
                  <Input
                    id="debtToEquity"
                    name="debtToEquity"
                    type="number"
                    step="0.01"
                    value={newCompany.debtToEquity}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Deuda/Capital Propio"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: menor a 0.5</p>
                </div>

                <div className="flex justify-between">
                  <Button onClick={handlePrevStep} variant="outline">
                    Anterior
                  </Button>
                  <Button onClick={handleNextStep}>Siguiente</Button>
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="salesGrowth">Crecimiento de Ventas (3 años) (%)</Label>
                  <Input
                    id="salesGrowth"
                    name="salesGrowth"
                    type="number"
                    value={newCompany.salesGrowth}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Crecimiento de Ventas (%)"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: mayor o igual a 5%</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receivablesIncrease">Incremento en Deudores</Label>
                  <Input
                    id="receivablesIncrease"
                    name="receivablesIncrease"
                    type="number"
                    value={newCompany.receivablesIncrease}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Incremento en Deudores"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: igual a 0</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averageCollectionPeriod">Período medio de cobro (días)</Label>
                  <Input
                    id="averageCollectionPeriod"
                    name="averageCollectionPeriod"
                    type="number"
                    value={newCompany.averageCollectionPeriod}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
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
                    value={newCompany.inventoryIncrease}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Incremento de Inventario"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: igual a 0</p>
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
                    value={newCompany.clientConcentration}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Concentración de Clientes"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: igual a 1</p>
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
                    value={newCompany.marketingMix}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Marketing Mix"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: igual a 1</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goodwill">Fondo de Comercio</Label>
                  <Input
                    id="goodwill"
                    name="goodwill"
                    type="number"
                    value={newCompany.goodwill}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Fondo de Comercio"
                  />
                  <p className="text-xs text-gray-500">Valor objetivo: mayor a 0</p>
                </div>

                <div className="flex justify-between">
                  <Button onClick={handlePrevStep} variant="outline">
                    Anterior
                  </Button>
                  <Button onClick={handleNextStep}>Siguiente</Button>
                </div>
              </div>
            )}

            {formStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="efficiencyRatio">Ratio de Eficiencia (%)</Label>
                  <Input
                    id="efficiencyRatio"
                    name="efficiencyRatio"
                    type="number"
                    value={newCompany.efficiencyRatio}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
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
                    value={newCompany.assetTurnover}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
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
                    value={newCompany.innovation}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Innovación"
                  />
                  <div className="text-xs text-gray-500 space-y-1 mt-1 p-2 bg-gray-50 rounded-md">
                    <p>Guía para puntuar:</p>
                    <p>• Si la empresa está en 1 ranking = 1 (por encima de la media +0,5)</p>
                    <p>• Si la empresa está en 2 rankings = 2 (por encima de la media +0,5 por cada uno)</p>
                    <p>
                      • Si la empresa está en 3 rankings = 3 (por encima de la media en uno o dos rankings +0,5 por cada
                      uno, por encima de la media en los 3 rankings +2)
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={handlePrevStep} variant="outline">
                    Anterior
                  </Button>
                  <Button onClick={handleNextStep}>Siguiente</Button>
                </div>
              </div>
            )}

            {formStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeCapabilities">Capacidades de los Empleados (1-7)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="employeeCapabilities"
                      min={1}
                      max={7}
                      step={1}
                      value={[newCompany.employeeCapabilities]}
                      onValueChange={(value) => handleSliderChange("employeeCapabilities", value)}
                    />
                    <span className="w-12 text-center font-bold">{newCompany.employeeCapabilities}</span>
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
                      value={[newCompany.informationSystems]}
                      onValueChange={(value) => handleSliderChange("informationSystems", value)}
                    />
                    <span className="w-12 text-center font-bold">{newCompany.informationSystems}</span>
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
                      value={[newCompany.motivation]}
                      onValueChange={(value) => handleSliderChange("motivation", value)}
                    />
                    <span className="w-12 text-center font-bold">{newCompany.motivation}</span>
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
                      value={[newCompany.staffIncrease]}
                      onValueChange={(value) => handleSliderChange("staffIncrease", value)}
                    />
                    <span className="w-12 text-center font-bold">{newCompany.staffIncrease}</span>
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
                      value={[newCompany.revenuePerEmployee]}
                      onValueChange={(value) => handleSliderChange("revenuePerEmployee", value)}
                    />
                    <span className="w-12 text-center font-bold">{newCompany.revenuePerEmployee}</span>
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
                      value={[newCompany.trainingExpenses]}
                      onValueChange={(value) => handleSliderChange("trainingExpenses", value)}
                    />
                    <span className="w-12 text-center font-bold">{newCompany.trainingExpenses}</span>
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
                      value={[newCompany.employeeSatisfaction]}
                      onValueChange={(value) => handleSliderChange("employeeSatisfaction", value)}
                    />
                    <span className="w-12 text-center font-bold">{newCompany.employeeSatisfaction}</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={handlePrevStep} variant="outline">
                    Anterior
                  </Button>
                  <Button onClick={handleNextStep}>Siguiente</Button>
                </div>
              </div>
            )}

            {formStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visionMissionValues">Visión, Misión, Valores y Objetivos Estratégicos (1-3)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="visionMissionValues"
                      min={1}
                      max={3}
                      step={1}
                      value={[newCompany.visionMissionValues]}
                      onValueChange={(value) => handleSliderChange("visionMissionValues", value)}
                    />
                    <span className="w-12 text-center font-bold">{newCompany.visionMissionValues}</span>
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
                    value={newCompany.environmentalScore}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
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
                    value={newCompany.socialScore}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
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
                    value={newCompany.governanceScore}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
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
                    value={newCompany.climateScore}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    placeholder="Puntuación Climática"
                  />
                  <p className="text-xs text-gray-500">A/A+/A- = 1, B/B+/B- = 0.75, C/C+/C- = 0.5, D/D+/D- = 0</p>
                </div>

                <div className="flex justify-between">
                  <Button onClick={handlePrevStep} variant="outline">
                    Anterior
                  </Button>
                  <Button onClick={handleSubmitCompany}>Guardar Empresa</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Renderizado condicional para el listado de empresas
  const renderCompanyList = () => {
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
          {companyScores.map((company) => (
            <div key={company.id} className="flex items-center">
              <Button
                variant={selectedCompany === company.id ? "default" : "outline"}
                className="w-full justify-start mr-2"
                onClick={() => handleSelectCompany(company.id)}
              >
                <div className="flex items-center w-full">
                  <span className="flex-1 text-left">{company.name}</span>
                  <span className={`w-4 h-4 rounded-full ${company.global.color}`}></span>
                </div>
              </Button>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => handleDeleteCompany(company.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Renderizado condicional para el dashboard
  const renderDashboard = () => {
    if (companies.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Bienvenido al Cuadro de Mando Integral</CardTitle>
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
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Mapa de Calor</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="h-full flex flex-col">
                  <TabsList className="grid grid-cols-6">
                    <TabsTrigger value="global">Global</TabsTrigger>
                    <TabsTrigger value="finance">Finanzas</TabsTrigger>
                    <TabsTrigger value="commercial">Comercial</TabsTrigger>
                    <TabsTrigger value="operations">Operaciones</TabsTrigger>
                    <TabsTrigger value="trainingGrowth">Formación</TabsTrigger>
                    <TabsTrigger value="visionStrategyESGC">Visión</TabsTrigger>
                  </TabsList>

                  {["global", "finance", "commercial", "operations", "trainingGrowth", "visionStrategyESGC"].map(
                    (category) => (
                      <TabsContent key={category} value={category} className="flex-1">
                        <div className="mt-4">
                          <div className="mb-4 flex justify-between items-center">
                            <div className="text-sm font-medium">Leyenda:</div>
                            <div className="flex gap-3">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-xs">A (6-7)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span className="text-xs">B (4-5)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-xs">C (1-3)</span>
                              </div>
                            </div>
                          </div>

                          {/* Ordenar las empresas por puntuación (de mayor a menor) */}
                          <div className="grid grid-cols-1 gap-2">
                            {companyScores
                              // @ts-ignore - Acceder dinámicamente a la propiedad
                              .sort((a, b) => b[category].score - a[category].score)
                              .map((company) => {
                                // @ts-ignore - Acceder dinámicamente a la propiedad
                                const categoryScore = company[category]

                                // Calcular el ancho de la barra basado en la puntuación (1-7)
                                const barWidth = `${(categoryScore.score / 7) * 100}%`

                                return (
                                  <div
                                    key={company.id}
                                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                                      selectedCompany === company.id ? "ring-2 ring-offset-2 ring-black" : ""
                                    }`}
                                    onClick={() => handleSelectCompany(company.id)}
                                  >
                                    <div className="flex justify-between items-center mb-1">
                                      <h3 className="font-bold">{company.name}</h3>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm">{categoryScore.score}/7</span>
                                        <span
                                          className={`${categoryScore.color} text-white font-bold rounded-full w-6 h-6 flex items-center justify-center`}
                                        >
                                          {categoryScore.rating}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Barra de progreso con el color correspondiente */}
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div
                                        className={`${categoryScore.color} h-2.5 rounded-full`}
                                        style={{ width: barWidth }}
                                      ></div>
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                        </div>
                      </TabsContent>
                    ),
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detail" className="flex-1">
            {selectedCompanyData && (
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{selectedCompanyData.name}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const companyScore = companyScores.find((c) => c.id === selectedCompany)
                      if (companyScore && selectedCompanyData) {
                        generateCompanyPDF(selectedCompanyData, companyScore)
                        toast({
                          title: "Informe generado",
                          description: `El informe de ${selectedCompanyData.name} se ha descargado correctamente.`,
                        })
                      }
                    }}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Generar Informe
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary">
                    <TabsList className="grid grid-cols-6">
                      <TabsTrigger value="summary">Resumen</TabsTrigger>
                      <TabsTrigger value="finance">Finanzas</TabsTrigger>
                      <TabsTrigger value="commercial">Comercial</TabsTrigger>
                      <TabsTrigger value="operations">Operaciones</TabsTrigger>
                      <TabsTrigger value="training">Formación</TabsTrigger>
                      <TabsTrigger value="vision">Visión</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary">
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {selectedCompany && (
                          <>
                            <div
                              className={`p-4 rounded-lg ${companyScores.find((c) => c.id === selectedCompany)?.finance.color}`}
                            >
                              <h3 className="font-bold text-white">Finanzas</h3>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-white">
                                  {companyScores.find((c) => c.id === selectedCompany)?.finance.score}/7
                                </span>
                                <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                  {companyScores.find((c) => c.id === selectedCompany)?.finance.rating}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`p-4 rounded-lg ${companyScores.find((c) => c.id === selectedCompany)?.commercial.color}`}
                            >
                              <h3 className="font-bold text-white">Comercial</h3>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-white">
                                  {companyScores.find((c) => c.id === selectedCompany)?.commercial.score}/7
                                </span>
                                <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                  {companyScores.find((c) => c.id === selectedCompany)?.commercial.rating}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`p-4 rounded-lg ${companyScores.find((c) => c.id === selectedCompany)?.operations.color}`}
                            >
                              <h3 className="font-bold text-white">Operaciones</h3>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-white">
                                  {companyScores.find((c) => c.id === selectedCompany)?.operations.score}/7
                                </span>
                                <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                  {companyScores.find((c) => c.id === selectedCompany)?.operations.rating}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`p-4 rounded-lg ${companyScores.find((c) => c.id === selectedCompany)?.trainingGrowth.color}`}
                            >
                              <h3 className="font-bold text-white">Formación</h3>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-white">
                                  {companyScores.find((c) => c.id === selectedCompany)?.trainingGrowth.score}/7
                                </span>
                                <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                  {companyScores.find((c) => c.id === selectedCompany)?.trainingGrowth.rating}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`p-4 rounded-lg ${companyScores.find((c) => c.id === selectedCompany)?.visionStrategyESGC.color}`}
                            >
                              <h3 className="font-bold text-white">Visión</h3>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-white">
                                  {companyScores.find((c) => c.id === selectedCompany)?.visionStrategyESGC.score}/7
                                </span>
                                <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                  {companyScores.find((c) => c.id === selectedCompany)?.visionStrategyESGC.rating}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`p-4 rounded-lg ${companyScores.find((c) => c.id === selectedCompany)?.global.color}`}
                            >
                              <h3 className="font-bold text-white">Global</h3>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-white">
                                  {companyScores.find((c) => c.id === selectedCompany)?.global.score}/7
                                </span>
                                <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                  {companyScores.find((c) => c.id === selectedCompany)?.global.rating}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="finance">
                      <div className="space-y-4 mt-4">
                        <h3 className="font-bold">Indicadores Financieros</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">ROA</p>
                            <p className="font-bold">{selectedCompanyData.roa}%</p>
                            <p className="text-xs text-gray-400">Valor objetivo: mayor o igual a 15%</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">ROE</p>
                            <p className="font-bold">{selectedCompanyData.roe}%</p>
                            <p className="text-xs text-gray-400">Valor objetivo: mayor o igual a 15%</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Q de Tobin</p>
                            <p className="font-bold">{selectedCompanyData.qTobin}</p>
                            <p className="text-xs text-gray-400">Valor objetivo: mayor o igual a 1</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Z-Score de Altman</p>
                            <p className="font-bold">{selectedCompanyData.zScoreAltman}</p>
                            <p className="text-xs text-gray-400">Valor objetivo: mayor o igual a 3</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Cash Flow</p>
                            <p className="font-bold">{selectedCompanyData.cashFlow}</p>
                            <p className="text-xs text-gray-400">Valor objetivo: mayor o igual a 0</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Fondo de Maniobra</p>
                            <p className="font-bold">{selectedCompanyData.workingCapital}</p>
                            <p className="text-xs text-gray-400">Valor objetivo: mayor o igual a 1</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Deuda/Capital Propio</p>
                            <p className="font-bold">{selectedCompanyData.debtToEquity}</p>
                            <p className="text-xs text-gray-400">Valor objetivo: menor a 0.5</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="commercial">
                      <div className="space-y-4 mt-4">
                        <h3 className="font-bold">Indicadores Comerciales</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Crecimiento de Ventas (3 años)</p>
                            <p className="font-bold">{selectedCompanyData.salesGrowth}%</p>
                            <p className="text-xs text-gray-400">Valor objetivo: mayor o igual a 5%</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Incremento de Deudores</p>
                            <p className="font-bold">{selectedCompanyData.receivablesIncrease}</p>
                            <p className="text-xs text-gray-400">Valor objetivo: igual a 0</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Período medio de cobro</p>
                            <p className="font-bold">{selectedCompanyData.averageCollectionPeriod} días</p>
                            <p className="text-xs text-gray-400">Valor objetivo: menor a 45 días</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Incremento de Inventario</p>
                            <p className="font-bold">{selectedCompanyData.inventoryIncrease}</p>
                            <p className="text-xs text-gray-400">Valor objetivo: igual a 0</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Concentración de Clientes</p>
                            <p className="font-bold">{selectedCompanyData.clientConcentration}</p>
                            <p className="text-xs text-gray-400">Valor objetivo: igual a 1</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Marketing Mix (4Ps)</p>
                            <p className="font-bold">{selectedCompanyData.marketingMix}</p>
                            <p className="text-xs text-gray-400">Valor objetivo: igual a 1</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Fondo de Comercio</p>
                            <p className="font-bold">{selectedCompanyData.goodwill}</p>
                            <p className="text-xs text-gray-400">Valor objetivo: mayor a 0</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="operations">
                      <div className="space-y-4 mt-4">
                        <h3 className="font-bold">Indicadores de Operaciones</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Ratio de Eficiencia</p>
                            <p className="font-bold">{selectedCompanyData.efficiencyRatio}%</p>
                            <p className="text-xs text-gray-400">Valor objetivo: menor a 70%</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Rotación de Activos</p>
                            <p className="font-bold">{selectedCompanyData.assetTurnover}</p>
                            <p className="text-xs text-gray-400">Valor objetivo: mayor a 1</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Innovación</p>
                            <p className="font-bold">{selectedCompanyData.innovation}/5</p>
                            <p className="text-xs text-gray-400">Valor objetivo: Mayor puntuación</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="training">
                      <div className="space-y-4 mt-4">
                        <h3 className="font-bold">Indicadores de Formación y Crecimiento</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Capacidades de Empleados</p>
                            <p className="font-bold">{selectedCompanyData.employeeCapabilities}/7</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Sistemas de Información</p>
                            <p className="font-bold">{selectedCompanyData.informationSystems}/7</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Motivación</p>
                            <p className="font-bold">{selectedCompanyData.motivation}/7</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Incremento de Plantilla</p>
                            <p className="font-bold">{selectedCompanyData.staffIncrease}/7</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Ingresos por Empleado</p>
                            <p className="font-bold">{selectedCompanyData.revenuePerEmployee}/7</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Gastos en Formación</p>
                            <p className="font-bold">{selectedCompanyData.trainingExpenses}/7</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Satisfacción de Empleados</p>
                            <p className="font-bold">{selectedCompanyData.employeeSatisfaction}/7</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="vision">
                      <div className="space-y-4 mt-4">
                        <h3 className="font-bold">Indicadores de Visión, Estrategia y ESGC</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Visión, Misión y Valores</p>
                            <p className="font-bold">{selectedCompanyData.visionMissionValues}/3</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Puntuación Ambiental</p>
                            <p className="font-bold">{selectedCompanyData.environmentalScore}</p>
                            <p className="text-xs text-gray-400">Escala: 0-1</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Puntuación Social</p>
                            <p className="font-bold">{selectedCompanyData.socialScore}</p>
                            <p className="text-xs text-gray-400">Escala: 0-1</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Puntuación de Gobernanza</p>
                            <p className="font-bold">{selectedCompanyData.governanceScore}</p>
                            <p className="text-xs text-gray-400">Escala: 0-1</p>
                          </div>
                          <div className="border p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Puntuación Climática</p>
                            <p className="font-bold">{selectedCompanyData.climateScore}</p>
                            <p className="text-xs text-gray-400">Escala: 0-1</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cuadro de Mando Integral con Sostenibilidad</h1>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button variant="outline" size="sm" className="text-white" onClick={handleAdminLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="text-white" onClick={handleOpenLoginDialog}>
              <Lock className="h-4 w-4 mr-2" />
              Admin
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sección izquierda: Listado de empresas */}
        <div className="w-1/4 border-r border-gray-200 overflow-y-auto p-4">{renderCompanyList()}</div>

        {/* Sección central: Dashboard/Visualización */}
        <div className="w-2/4 overflow-y-auto p-4">{renderDashboard()}</div>

        {/* Sección derecha: Formulario para añadir empresas */}
        <div className="w-1/4 border-l border-gray-200 overflow-y-auto p-4">{renderAddCompanyForm()}</div>
      </div>

      {/* Diálogo de inicio de sesión */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Iniciar sesión como administrador</DialogTitle>
            <DialogDescription>
              Introduce la contraseña de administrador para acceder a funciones adicionales.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Contraseña</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Introduce la contraseña"
              />
              {loginError && <p className="text-sm text-red-500">{loginError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseLoginDialog}>
              Cancelar
            </Button>
            <Button onClick={handleAdminLogin}>Iniciar sesión</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Componente Toaster para mostrar notificaciones */}
      <Toaster />
    </main>
  )
}
