'use client'
import React, { useState, useEffect } from 'react';
import AdvancedDiagnostic from '@/components/AdvancedDiagnostic';
import PatientInformation from '@/components/PatientInformation';
import SideEffectBarChart from '@/components/SideEffectBarChart';
import { useRouter } from 'next/navigation';
import ProgressOverlay from './progress_overlay';

export default function Results() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState('combined');
  const [progress, setProgress] = useState({
    progress: 0,
    status: 'Starting analysis...',
    details: '',
    isComplete: false
  });

  // Add this function to determine the class based on risk level
const getRiskLevelClass = (riskLevel) => {
  switch (riskLevel) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-gray-500'; // Fallback for unknown risk levels
  }
};

  useEffect(() => {
    let eventSource = null;
    const formData = JSON.parse(localStorage.getItem('patientFormData'));
    if (!formData) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem('dashboardData');
        if (cachedData) {
          setDashboardData(JSON.parse(cachedData));
          setIsProcessing(false);
          return;
        }

        setProgress({
          progress: 0,
          status: 'Starting analysis...',
          details: '',
          isComplete: false
        });

        eventSource = new EventSource(`${process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5050'}/dashboard/progress`);
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setProgress(data);
          
          if (data.isComplete) {
            eventSource.close();
          }
        };

        eventSource.onerror = (error) => {
          console.error('EventSource failed:', error);
          eventSource.close();
          setIsProcessing(false);
        };

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5050'}/dashboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setDashboardData(responseData);
        localStorage.setItem('dashboardData', JSON.stringify(responseData));
        setIsProcessing(false);

      } catch (error) {
        console.error('Error:', error);
        setIsProcessing(false);
      }
    };

    fetchData();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [router]);

  const findBestDataIntersection = (mostCommon) => {
    const dataAvailability = mostCommon.map(entry => ({
      category: entry[0],
      dataPoints: entry[1].length,
      data: entry[1]
    }))
    .sort((a, b) => b.dataPoints - a.dataPoints);
    
    return dataAvailability[0];
  };

  if (isProcessing || !dashboardData) {
    return <ProgressOverlay progress={progress.progress} status={progress.status} details={progress.details} />;
  }

  const { patient_info, probabilities, summary, actionable_insights } = dashboardData;
  const mostCommon = probabilities.most_common;
  const bestIntersection = findBestDataIntersection(mostCommon);

  
  // Get the attribute options for AdvancedDiagnostic
  const attributeOptions = mostCommon
    .map((entry) => entry[0])
    .filter((attr) => attr !== 'age weight sex');

  // Process side effect data
  const sideEffectData = bestIntersection.data.map(([label, value]) => ({
    label,
    value: value // Convert to percentage
  }));

  console.log(sideEffectData)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 relative">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Patient Risk Analysis</h1>
          
          {/* Risk Level Tab */}
          <div className={`
            absolute top-0 right-4 px-4 py-2 rounded-b-lg font-medium text-sm
            ${getRiskLevelClass('low')}
          `}>
            Low Risk
          </div>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
          <p className="text-sm text-blue-700">{summary}</p>
        </div>
        </div>

        {/* Patient Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Age:</span>
                <span className="font-medium text-gray-700">{patient_info.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Sex:</span>
                <span className="font-medium text-gray-700">{patient_info.sex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Weight:</span>
                <span className="font-medium text-gray-700">{patient_info.weight} kg</span>
              </div>
            </div>
          </div>

          {/* Existing Conditions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Existing Conditions</h2>
            <div className="space-y-2">
              {patient_info.conditions.length > 0 ? (
                patient_info.conditions.map((condition, index) => (
                  <div key={index} className="inline-block bg-red-200 text-red-900 text-sm px-3 py-1 rounded-full">
                    {condition}
                  </div>
                ))
              ) : (
                <div className="text-gray-700">No existing conditions reported.</div>
              )}
            </div>
          </div>

          {/* Current Medications */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h2>
            <div className="space-y-2">
              {patient_info.medications.length > 0 ? (
                patient_info.medications.map((medication, index) => (
                  <div key={index} className="inline-block bg-red-200 text-red-900 text-sm px-3 py-1 rounded-full">
                    {medication}
                  </div>
                ))
              ) : (
                <div className="text-gray-700">No medications reported.</div>
              )}
            </div>
          </div>
        </div>

        {/* Initial Risk Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Primary Risk Analysis</h2>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-700">
                Based on: {bestIntersection.category.replace(/_/g, ' ')}
              </h3>
              <span className="text-sm text-gray-500">
                {bestIntersection.dataPoints} data points analyzed
              </span>
            </div>
            
            {/* Side Effects Chart */}
            <div className="mt-4">
              <SideEffectBarChart 
                title="Risk Factors and Probabilities" 
                data={sideEffectData} 
                barColor="bg-blue-500"
              />
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p className="font-medium mb-2">Understanding these numbers:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Percentages show likelihood based on similar patient profiles</li>
                <li>Analysis combines multiple patient characteristics</li>
                <li>Data sourced from FDA Adverse Event database</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Advanced Diagnostic Section */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Advanced Analysis</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              This section allows detailed exploration of risk factors across different patient characteristics. 
              Select different attributes to see how they influence potential outcomes.
            </p>
          </div>
          <AdvancedDiagnostic 
            mostCommon={mostCommon} 
            attributeOptions={attributeOptions}
          />
        </div> */}


        {/* Actionable Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dosage Recommendations</h3>
            <p className="text-sm text-gray-600">{actionable_insights.dosage}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Drug Interactions</h3>
            <p className="text-sm text-gray-600">{actionable_insights.interactions}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Plan</h3>
            <p className="text-sm text-gray-600">{actionable_insights.monitoring}</p>
          </div>
        </div>
      </div>
    </div>
  );
}