import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/description-list'
import { Subheading } from '@/components/heading'

function PatientInformation({ patient_info }) {
  return (
    <>
      <Subheading>Patient Information</Subheading>
      <DescriptionList className="mt-4">
        <DescriptionTerm>Age</DescriptionTerm>
        <DescriptionDetails>{patient_info.age}</DescriptionDetails>

        <DescriptionTerm>Weight</DescriptionTerm>
        <DescriptionDetails>{patient_info.weight} kg</DescriptionDetails>

        <DescriptionTerm>Sex</DescriptionTerm>
        <DescriptionDetails>{patient_info.sex}</DescriptionDetails>

        <DescriptionTerm>Ethnicity</DescriptionTerm>
        <DescriptionDetails>{patient_info.ethnicity}</DescriptionDetails>
      </DescriptionList>
    </>
  )
}

export default PatientInformation
