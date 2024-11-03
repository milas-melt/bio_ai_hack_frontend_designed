'use client'

import { Button } from '@/components/button'
import { Description, Field, FieldGroup, Fieldset, Label, Legend } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Text } from '@/components/text'
import { Textarea } from '@/components/textarea'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function FormComponent() {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    medicalHistory: '',
    sex: '',
  })

  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const query = new URLSearchParams(formData).toString()
    router.push(`/results?${query}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit}>
        <Fieldset>
          <Legend>Patient Information</Legend>
          <Text>Please provide the following details.</Text>
          <FieldGroup>
            <Field>
              <Label>Age</Label>
              <Input type="number" name="age" value={formData.age} onChange={handleChange} required />
            </Field>
            <Field>
              <Label>Weight (kg)</Label>
              <Input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
            </Field>
            <Field>
              <Label>Sex</Label>
              <Select name="sex" value={formData.sex} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </Select>
            </Field>
            <Field>
              <Label>Medical History</Label>
              <Textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} rows="4" />
              <Description>Please include any relevant medical information.</Description>
            </Field>
          </FieldGroup>
        </Fieldset>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}
