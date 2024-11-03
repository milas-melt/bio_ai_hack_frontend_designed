'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const conditions = [
  { value: "type2-diabetes", label: "Type 2 Diabetes" },
  { value: "hypertension", label: "Hypertension" },
  { value: "heart-disease", label: "Heart Disease" },
  { value: "asthma", label: "Asthma" },
  { value: "arthritis", label: "Arthritis" },
  { value: "depression", label: "Depression" },
  { value: "anxiety", label: "Anxiety" },
  { value: "copd", label: "COPD" },
  { value: "kidney-disease", label: "Kidney Disease" },
  { value: "sleep-apnea", label: "Sleep Apnea" },
]

const medications = [
  { value: "metformin", label: "Metformin" },
  { value: "lisinopril", label: "Lisinopril" },
  { value: "amlodipine", label: "Amlodipine" },
  { value: "omeprazole", label: "Omeprazole" },
  { value: "simvastatin", label: "Simvastatin" },
  { value: "levothyroxine", label: "Levothyroxine" },
  { value: "albuterol", label: "Albuterol" },
  { value: "gabapentin", label: "Gabapentin" },
  { value: "sertraline", label: "Sertraline" },
  { value: "metoprolol", label: "Metoprolol" },
]

export default function FormComponent() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    sex: '',
    conditions: [],
    medications: [],
    target_drug: ''
  })

  const handleChange = (e) => {
    if (e.target.name === 'conditions' || e.target.name === 'medications') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
      setFormData({
        ...formData,
        [e.target.name]: selectedOptions
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    localStorage.setItem('patientFormData', JSON.stringify(formData))
    router.push('/results')
  }

  const getSelectedLabels = (fieldName, options) => {
    return formData[fieldName]
      .map(value => options.find(o => o.value === value)?.label)
      .filter(Boolean)
      .join(', ')
  }


const targetDrugs = [
  { value: "ozempic", label: "OZEMPIC" },
  { value: "actrema", label: "ACTREMA" },
  { value: "metmorfin", label: "METMORFIN" },
  // Add more drugs as needed
]

  return (
    <div className="min-h-screen text-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6 p-8 rounded-xl shadow-xl">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Your Information</h2>
          <p className="text-gray-400">Please provide the following details.</p>
        </div>
          
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium text-gray-200">
              Age
            </label>
            <input
              id="age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-200">
              Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sex" className="block text-sm font-medium text-gray-200">
              Sex
            </label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div className="space-y-2">
          <label htmlFor="targetDrug" className="block text-sm font-medium text-gray-200">
            Target Drug
          </label>
          <select
            id="targetDrug"
            name="targetDrug"
            value={formData.target_drug}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            {targetDrugs.map((drug) => (
              <option key={drug.value} value={drug.value}>
                {drug.label}
              </option>
            ))}
          </select>
        </div>

          <div className="space-y-2">
            <label htmlFor="conditions" className="block text-sm font-medium text-gray-200">
              Medical Conditions
            </label>
            <select
              id="conditions"
              name="conditions"
              multiple
              value={formData.conditions}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 min-h-[200px]"
            >
              {conditions.map((condition) => (
                <option key={condition.value} value={condition.value} className="py-1">
                  {condition.label}
                </option>
              ))}
            </select>
            {formData.conditions.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Selected: {getSelectedLabels('conditions', conditions)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="medications" className="block text-sm font-medium text-gray-200">
              Current Medications
            </label>
            <select
              id="medications"
              name="medications"
              multiple
              value={formData.medications}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 min-h-[200px]"
            >
              {medications.map((medication) => (
                <option key={medication.value} value={medication.value} className="py-1">
                  {medication.label}
                </option>
              ))}
            </select>
            {formData.medications.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Selected: {getSelectedLabels('medications', medications)}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Submit
        </button>
      </form>
    </div>
  )
}