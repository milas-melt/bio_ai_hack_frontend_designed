'use client'
import AdvancedDiagnostic from '@/components/AdvancedDiagnostic'
import SideEffectBarChart from '@/components/SideEffectBarChart'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProgressOverlay from './progress_overlay'

export default function Results() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const [selectedAnalysis, setSelectedAnalysis] = useState('combined')
  const [progress, setProgress] = useState({
    progress: 0,
    status: 'Starting analysis...',
    details: '',
    isComplete: false,
  })

  useEffect(() => {
    let eventSource = null
    const formData = JSON.parse(localStorage.getItem('patientFormData'))
    if (!formData) {
      router.push('/')
      return
    }

    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem('dashboardData')
        if (cachedData) {
          setDashboardData(JSON.parse(cachedData))
          setIsProcessing(false)
          return
        }

        setProgress({
          progress: 0,
          status: 'Starting analysis...',
          details: '',
          isComplete: false,
        })

        eventSource = new EventSource(
          `${process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5050'}/dashboard/progress`
        )

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data)
          setProgress(data)

          if (data.isComplete) {
            eventSource.close()
          }
        }

        eventSource.onerror = (error) => {
          console.error('EventSource failed:', error)
          eventSource.close()
          setIsProcessing(false)
        }

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5050'}/dashboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseData = await response.json()
        setDashboardData(responseData)
        localStorage.setItem('dashboardData', JSON.stringify(responseData))
        setIsProcessing(false)
      } catch (error) {
        console.error('Error:', error)
        setIsProcessing(false)
      }
    }

    fetchData()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [router])

  const findBestDataIntersection = (mostCommon) => {
    const dataAvailability = mostCommon
      .map((entry) => ({
        category: entry[0],
        dataPoints: entry[1].length,
        data: entry[1],
      }))
      .sort((a, b) => b.dataPoints - a.dataPoints)

    return dataAvailability[0]
  }

  if (isProcessing || !dashboardData) {
    return <ProgressOverlay progress={progress.progress} status={progress.status} details={progress.details} />
  }

  const { patient_info, probabilities, summary, actionable_insights } = dashboardData
  const mostCommon = probabilities.most_common
  const bestIntersection = findBestDataIntersection(mostCommon)

  // Get the attribute options for AdvancedDiagnostic
  const attributeOptions = mostCommon.map((entry) => entry[0]).filter((attr) => attr !== 'age weight sex')

  // Process side effect data
  const sideEffectData = bestIntersection.data.map(([label, value]) => ({
    label,
    value: value, // Convert to percentage
  }))

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header Section */}
        {/* <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Patient Risk Analysis</h1>
          <div className="border-l-4 border-blue-500 bg-blue-100 p-4">
            <p className="text-sm text-blue-700">{summary}</p>
          </div>
        </div> */}
        <div className="mb-8 rounded-lg p-6 shadow-md">
          <h1 className="mb-4 text-2xl font-bold">Patient Risk Analysis</h1>
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon aria-hidden="true" className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">{summary}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Information Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Basic Info */}
          <div className="rounded-lg p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Patient Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="">Age:</span>
                <span className="font-medium">{patient_info.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="">Sex:</span>
                <span className="font-medium">{patient_info.sex}</span>
              </div>
              <div className="flex justify-between">
                <span className="">Weight:</span>
                <span className="font-medium">{patient_info.weight} kg</span>
              </div>
            </div>
          </div>

          {/* Existing Conditions */}
          <div className="rounded-lg p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Existing Conditions</h2>
            <div className="space-y-2">
              {patient_info.conditions.length > 0 ? (
                patient_info.conditions.map((condition, index) => (
                  // TODO: Add gaps between conditions

                  <span className="m-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    {condition}
                  </span>
                ))
              ) : (
                <div className="text-gray-700">No existing conditions reported.</div>
              )}
            </div>
          </div>

          {/* Current Medications */}
          <div className="rounded-lg p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Current Medications</h2>
            <div className="space-y-2">
              {patient_info.medications.length > 0 ? (
                patient_info.medications.map((medication, index) => (
                  <span className="m-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    {medication}
                  </span>
                ))
              ) : (
                <div className="">No medications reported.</div>
              )}
            </div>
          </div>
        </div>

        {/* Initial Risk Analysis */}
        <div className="mb-8 rounded-lg p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold">Primary Risk Analysis</h2>
          <div className="mb-6">
            {/* Side Effects Chart */}
            <div className="mt-4">
              <SideEffectBarChart title="Risk Factors and Probabilities" data={sideEffectData} barColor="bg-blue-500" />
            </div>

            <div className="mt-4 text-sm">
              <p className="mb-2 font-medium">Understanding these numbers:</p>
              <ul className="list-inside list-disc space-y-1">
                <li>Percentages show likelihood based on similar patient profiles</li>
                <li>Analysis combines multiple patient characteristics</li>
                <li>Data sourced from FDA Adverse Event database</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold">Advanced Analysis</h2>
          <div className="mb-4">
            <p className="mb-4 text-sm">
              This section allows detailed exploration of risk factors across different patient characteristics. Select
              different attributes to see how they influence potential outcomes.
            </p>
          </div>
          <AdvancedDiagnostic mostCommon={mostCommon} attributeOptions={attributeOptions} />
        </div>

        {/* Actionable Insights Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold">Dosage Recommendations</h3>
            <p className="text-sm">{actionable_insights.dosage}</p>
          </div>

          <div className="rounded-lg p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold">Drug Interactions</h3>
            <p className="text-sm">{actionable_insights.interactions}</p>
          </div>

          <div className="rounded-lg p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold">Monitoring Plan</h3>
            <p className="text-sm">{actionable_insights.monitoring}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
