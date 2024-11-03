'use client'
import AdvancedDiagnostic from '@/components/AdvancedDiagnostic'
import PatientInformation from '@/components/PatientInformation'
import SideEffectBarChart from '@/components/SideEffectBarChart'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import ProgressOverlay from './progress_overlay'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5050'


export default function Results() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const [progress, setProgress] = useState({
    progress: 0,
    status: 'Starting analysis...',
    details: '',
    isComplete: false
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
        setProgress({
          progress: 0,
          status: 'Starting analysis...',
          details: '',
          isComplete: false
        })
        // Start the progress event listener
        eventSource = new EventSource(`${API_BASE_URL}/dashboard/progress`)
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data)
          console.log(data)
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
        // Start the main processing request
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
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
        setIsProcessing(false)

      } catch (error) {
        console.error('Error:', error)
        setIsProcessing(false)
      }
    }

    fetchData()

    // Cleanup function
    return () => {
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }
    }
  }, [router])

  if (isProcessing || !dashboardData) {
    return (
      <ProgressOverlay 
        progress={progress.progress}
        status={progress.status}
        details={progress.details}
      />
    )
  }


    const { patient_info, probabilities } = dashboardData

    // Extract the "most_common" array
    const mostCommon = probabilities.most_common

    // Find the entry with the key "age weight sex"
    const jointReactionsEntry = mostCommon.find((entry) => entry[0] === 'age weight sex')

    // Map the reactions data to the format expected by SideEffectBarChart
    let sideEffectData = []
    if (jointReactionsEntry && jointReactionsEntry.length > 1) {
      const jointRelatedReactions = jointReactionsEntry[1]
      sideEffectData = jointRelatedReactions.map((item) => ({
        label: item[0],
        value: item[1],
      }))
    }

    // Extract attribute options, excluding "age weight sex"
    const attributeOptions = mostCommon.map((entry) => entry[0]).filter((attr) => attr !== 'age weight sex')

    return (
      <div className="min-h-screenp-8">
        <Heading>Analysis Results</Heading>
        <Divider className="my-10 mt-6" />

        {/* Patient Information */}
        <PatientInformation patient_info={patient_info} />

        <Divider className="my-10" soft />
        {/* Most Common Side Effects */}
        {sideEffectData.length > 0 ? (
          <SideEffectBarChart title="Most Common Side Effects" data={sideEffectData} barColor="bg-blue-500" />
        ) : (
          <p>No side effects data available.</p>
        )}

        {/* Advanced Diagnostic */}
        <AdvancedDiagnostic mostCommon={mostCommon} attributeOptions={attributeOptions} />

        {/* Additional components if needed */}
        {/* <TestimoniesSummary data={testimony} /> */}
        {/* <ActionableInsights data={actionable_insights} /> */}
      </div>
    )
}
