export interface FinanceIndicators {
  roa: number // 1 cuando ≥ 15%
  roe: number // 1 cuando ≥ 15%
  qTobin: number // 1 cuando ≥ 1
  zScoreAltman: number // 1 cuando ≥ 3
  cashFlow: number // 1 cuando ≥ 0
  workingCapital: number // 1 cuando ≥ 1
  debtToEquity: number // 1 cuando < 0.5
}

export interface CommercialIndicators {
  salesGrowth: number // 1 cuando el incremento en los 3 últimos años ≥ 5%
  receivablesIncrease: number // 1 cuando = 0
  averageCollectionPeriod: number // 1 cuando < 45 días
  inventoryIncrease: number // 1 cuando = 0
  clientConcentration: number // 0 o 1
  marketingMix: number // 0 o 1
  goodwill: number // 1 cuando > 0
}

export interface OperationsIndicators {
  efficiencyRatio: number // 1 cuando < 70%
  assetTurnover: number // 1 cuando > 1
  innovation: number // 0-5 puntos
}

export interface TrainingGrowthIndicators {
  employeeCapabilities: number // 1-7
  informationSystems: number // 1-7
  motivation: number // 1-7
  staffIncrease: number // 1-7
  revenuePerEmployee: number // 1-7
  trainingExpenses: number // 1-7
  employeeSatisfaction: number // 1-7
}

export interface VisionStrategyESGC {
  visionMissionValues: number // 1-3
  environmentalScore: number // 0-1
  socialScore: number // 0-1
  governanceScore: number // 0-1
  climateScore: number // 0-1
}

export interface Company {
  id: string
  name: string
  finance: FinanceIndicators
  commercial: CommercialIndicators
  operations: OperationsIndicators
  trainingGrowth: TrainingGrowthIndicators
  visionStrategyESGC: VisionStrategyESGC
  createdAt: string
}

export interface CategoryScore {
  score: number
  rating: "A" | "B" | "C"
  color: string
}

export interface CompanyScore {
  id: string
  name: string
  finance: CategoryScore
  commercial: CategoryScore
  operations: CategoryScore
  trainingGrowth: CategoryScore
  visionStrategyESGC: CategoryScore
  global: CategoryScore
}
