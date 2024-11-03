export default function FormPage() {
  return <FormComponent />
}

import dynamic from 'next/dynamic'
const FormComponent = dynamic(() => import('./FormComponent'), { ssr: false })
