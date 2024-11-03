'use client'

import { Button } from '@/components/button'
import { useState } from 'react'
import SideEffectBarChart from './SideEffectBarChart'

export default function AdvancedDiagnostic({ mostCommon, attributeOptions }) {
  const [selectedAttribute, setSelectedAttribute] = useState(attributeOptions[0] || '')
  const [showAdvancedDiagnostic, setShowAdvancedDiagnostic] = useState(false)

  // Find data for the selected attribute
  const selectedAttributeEntry = mostCommon.find((entry) => entry[0] === selectedAttribute)

  let attributeSideEffectData = []
  if (selectedAttributeEntry && selectedAttributeEntry.length > 1) {
    const reactions = selectedAttributeEntry[1]
    attributeSideEffectData = reactions.map((item) => ({
      label: item[0],
      value: item[1],
    }))
  }

  return (
    <>
      {/* Toggle Button for Advanced Diagnostic */}
      <Button onClick={() => setShowAdvancedDiagnostic(!showAdvancedDiagnostic)} className="mb-4 rounded px-4 py-2">
        {showAdvancedDiagnostic ? 'Hide Advanced Diagnostic' : 'Show Advanced Diagnostic'}
      </Button>

      {/* Advanced Diagnostic Section */}
      <div
        className={`mb-8 overflow-hidden transition-all duration-500 ease-in-out ${
          showAdvancedDiagnostic ? 'max-h-screen opacity-100 delay-200' : 'max-h-0 opacity-0 delay-200'
        }`}
      >
        <h3 className="mb-4 text-xl font-semibold">Advanced Diagnostic</h3>
        <div className="mb-4 flex border-b">
          {attributeOptions.map((attribute) => (
            <button
              key={attribute}
              onClick={() => setSelectedAttribute(attribute)}
              className={`mr-4 pb-2 focus:outline-none ${
                selectedAttribute === attribute
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
            </button>
          ))}
        </div>
        {attributeSideEffectData.length > 0 ? (
          <SideEffectBarChart
            title={`Side Effects for ${selectedAttribute.charAt(0).toUpperCase() + selectedAttribute.slice(1)}`}
            data={attributeSideEffectData}
            barColor="bg-green-500"
          />
        ) : (
          <p>No data available for {selectedAttribute}.</p>
        )}
      </div>
    </>
  )
}
