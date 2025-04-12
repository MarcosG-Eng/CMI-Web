import type { Company } from "@/types/company"
import { calculateCompanyScores } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CompanyDetailProps {
  company: Company
}

export default function CompanyDetail({ company }: CompanyDetailProps) {
  const scores = calculateCompanyScores(company);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{company.name}</CardTitle>
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
              <div className={`p-4 rounded-lg ${scores.finance.color}`}>
                <h3 className="font-bold text-white">Finanzas</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white">{scores.finance.score}/7</span>
                  <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {scores.finance.rating}
                  </span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${scores.commercial.color}`}>
                <h3 className="font-bold text-white">Comercial</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white">{scores.commercial.score}/7</span>
                  <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {scores.commercial.rating}
                  </span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${scores.operations.color}`}>
                <h3 className="font-bold text-white">Operaciones</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white">{scores.operations.score}/7</span>
                  <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {scores.operations.rating}
                  </span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${scores.trainingGrowth.color}`}>
                <h3 className="font-bold text-white">Formación</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white">{scores.trainingGrowth.score}/7</span>
                  <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {scores.trainingGrowth.rating}
                  </span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${scores.visionStrategyESGC.color}`}>
                <h3 className="font-bold text-white">Visión</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white">{scores.visionStrategyESGC.score}/7</span>
                  <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {scores.visionStrategyESGC.rating}
                  </span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${scores.global.color}`}>
                <h3 className="font-bold text-white">Global</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white">{scores.global.score}/7</span>
                  <span className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {scores.global.rating}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="finance">
            <div className="space-y-4 mt-4">
              <h3 className="font-bold">Indicadores Financieros</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">ROA</p>
                  <p className="font-bold">{company.finance.roa}%</p>
                  <p className="text-xs text-gray-400">Valor objetivo: ≥ 15%</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">ROE</p>
                  <p className="font-bold">{company.finance.roe}%</p>
                  <p className="text-xs text-gray-400">Valor objetivo: ≥ 15%</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Q de Tobin</p>
                  <p className="font-bold">{company.finance.qTobin}</p>
                  <p className="text-xs text-gray-400">Valor objetivo: ≥ 1</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Z-Score de Altman</p>
                  <p className="font-bold">{company.finance.zScoreAltman}</p>
                  <p className="text-xs text-gray-400">Valor objetivo: ≥ 3</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Cash Flow</p>
                  <p className="font-bold">{company.finance.cashFlow}</p>
                  <p className="text-xs text-gray-400">Valor objetivo: ≥ 0</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Fondo de Maniobra</p>
                  <p className="font-bold">{company.finance.workingCapital}</p>
                  <p className="text-xs text-gray-400">Valor objetivo: ≥ 1</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Deuda/Capital Propio</p>
                  <p className="font-bold">{company.finance.debtToEquity}</p>
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
                  <p className="font-bold">{company.commercial.salesGrowth}%</p>
                  <p className="text-xs text-gray-400">Valor objetivo: ≥ 5%</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Incremento de Deudores</p>
                  <p className="font-bold">{company.commercial.receivablesIncrease}</p>
                  <p className="text-xs text-gray-400">Valor objetivo: = 0</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Período medio de cobro</p>
                  <p className="font-bold">{company.commercial.averageCollectionPeriod} días</p>
                  <p className="text-xs text-gray-400">Valor objetivo: menor a 45 días</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Incremento de Inventario</p>
                  <p className="font-bold">{company.commercial.inventoryIncrease}</p>
                  <p className="text-xs text-gray-400">Valor objetivo: = 0</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Concentración de Clientes</p>
                  <p className="font-bold">{company.commercial.clientConcentration}</p>
                  <p className="text-xs text-gray-400">Valor objetivo: = 1</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Marketing Mix (4Ps)</p>
                  <p className="font-bold">{company.commercial.marketingMix}</p>
                  <p className="text-xs text-gray-400">Valor objetivo: = 1</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Fondo de Comercio</p>
                  <p className="font-bold">{company.commercial.goodwill}</p>
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
                  <p className="font-bold">{company.operations.efficiencyRatio}%</p>
                  <p className="text-xs text-gray-400">Valor objetivo: menor a 70%</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Rotación de Activos</p>
                  <p className="font-bold">{company.operations.assetTurnover}</p>
                  <p className="text-xs text-gray-400">Valor objetivo: mayor a 1</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Innovación</p>
                  <p className="font-bold">{company.operations.innovation}/5</p>
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
                  <p className="font-bold">{company.trainingGrowth.employeeCapabilities}/7</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Sistemas de Información</p>
                  <p className="font-bold">{company.trainingGrowth.informationSystems}/7</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Motivación</p>
                  <p className="font-bold">{company.trainingGrowth.motivation}/7</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Incremento de Plantilla</p>
                  <p className="font-bold">{company.trainingGrowth.staffIncrease}/7</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Ingresos por Empleado</p>
                  <p className="font-bold">{company.trainingGrowth.revenuePerEmployee}/7</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Gastos en Formación</p>
                  <p className="font-bold">{company.trainingGrowth.trainingExpenses}/7</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Satisfacción de Empleados</p>
                  <p className="font-bold">{company.trainingGrowth.employeeSatisfaction}/7</p>
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
                  <p className="font-bold">{company.visionStrategyESGC.visionMissionValues}/3</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Puntuación Ambiental</p>
                  <p className="font-bold">{company.visionStrategyESGC.environmentalScore}</p>
                  <p className="text-xs text-gray-400">Escala: 0-1</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Puntuación Social</p>
                  <p className="font-bold">{company.visionStrategyESGC.socialScore}</p>
                  <p className="text-xs text-gray-400">Escala: 0-1</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Puntuación de Gobernanza</p>
                  <p className="font-bold">{company.visionStrategyESGC.governanceScore}</p>
                  <p className="text-xs text-gray-400">Escala: 0-1</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Puntuación Climática</p>
                  <p className="font-bold">{company.visionStrategyESGC.climateScore}</p>
                  <p className="text-xs text-gray-400">Escala: 0-1</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
