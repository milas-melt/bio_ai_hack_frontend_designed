import AdvancedDiagnostic from '@/components/AdvancedDiagnostic'
import PatientInformation from '@/components/PatientInformation'
import SideEffectBarChart from '@/components/SideEffectBarChart'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'

export default async function Results({ searchParams }) {
  const { age, weight, sex, ethnicity } = searchParams

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5050'

  const queryParams = new URLSearchParams({
    age,
    weight,
    sex,
    ethnicity,
  })

  try {
    const res = await fetch(`${API_BASE_URL}/dashboard?${queryParams.toString()}`, {
      method: 'GET',
      cache: 'no-store', // Ensure fresh data on each request
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const dashboardData = await res.json()

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
  } catch (error) {
    return <div>Error: {error.message}</div>
  }
}
