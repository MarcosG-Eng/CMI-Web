import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type {
  Company,
  CompanyScore,
  FinanceIndicators,
  CommercialIndicators,
  OperationsIndicators,
  TrainingGrowthIndicators,
  VisionStrategyESGC,
} from "@/types/company"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calcular puntuación para finanzas (1-7)
export function calculateFinanceScore(finance: FinanceIndicators): number {
  let score = 0

  if (finance.roa >= 15) score += 1
  if (finance.roe >= 15) score += 1
  if (finance.qTobin >= 1) score += 1
  if (finance.zScoreAltman >= 3) score += 1
  if (finance.cashFlow >= 0) score += 1
  if (finance.workingCapital >= 1) score += 1
  if (finance.debtToEquity < 0.5) score += 1

  return score
}

// Calcular puntuación para comercial (1-7)
export function calculateCommercialScore(commercial: CommercialIndicators): number {
  let score = 0

  if (commercial.salesGrowth >= 5) score += 1
  if (commercial.receivablesIncrease === 0) score += 1
  if (commercial.averageCollectionPeriod < 45) score += 1
  if (commercial.inventoryIncrease === 0) score += 1
  score += commercial.clientConcentration
  score += commercial.marketingMix
  if (commercial.goodwill > 0) score += 1

  return score
}

// Calcular puntuación para operaciones (1-7)
export function calculateOperationsScore(operations: OperationsIndicators): number {
  let score = 0

  if (operations.efficiencyRatio < 70) score += 1
  if (operations.assetTurnover > 1) score += 1
  score += operations.innovation

  // Normalizar a escala 1-7
  return Math.min(7, Math.max(1, Math.round((score * 7) / 3)))
}

// Calcular puntuación para formación y crecimiento (1-7)
export function calculateTrainingGrowthScore(trainingGrowth: TrainingGrowthIndicators): number {
  const total =
    trainingGrowth.employeeCapabilities +
    trainingGrowth.informationSystems +
    trainingGrowth.motivation +
    trainingGrowth.staffIncrease +
    trainingGrowth.revenuePerEmployee +
    trainingGrowth.trainingExpenses +
    trainingGrowth.employeeSatisfaction

  // Promedio (ya está en escala 1-7)
  return Math.round(total / 7)
}

// Calcular puntuación para visión, estrategia y ESGC (1-7)
export function calculateVisionStrategyESGCScore(visionStrategyESGC: VisionStrategyESGC): number {
  const score = visionStrategyESGC.visionMissionValues

  // Sumar puntuaciones ESGC (máximo 4 puntos)
  const esgcScore =
    visionStrategyESGC.environmentalScore +
    visionStrategyESGC.socialScore +
    visionStrategyESGC.governanceScore +
    visionStrategyESGC.climateScore

  // Normalizar a escala 1-7
  return Math.min(7, Math.max(1, Math.round(((score + esgcScore) * 7) / 7)))
}

// Convertir puntuación a rating (A, B, C)
export function scoreToRating(score: number): "A" | "B" | "C" {
  if (score >= 6) return "A"
  if (score >= 4) return "B"
  return "C"
}

// Convertir rating a color
export function ratingToColor(rating: "A" | "B" | "C"): string {
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

// Calcular todas las puntuaciones para una empresa
export function calculateCompanyScores(company: Company): CompanyScore {
  // Calcular puntuaciones por categoría
  const financeScore = calculateFinanceScore(company.finance)
  const commercialScore = calculateCommercialScore(company.commercial)
  const operationsScore = calculateOperationsScore(company.operations)
  const trainingGrowthScore = calculateTrainingGrowthScore(company.trainingGrowth)
  const visionStrategyESGCScore = calculateVisionStrategyESGCScore(company.visionStrategyESGC)

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

// Generar un ID único
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
