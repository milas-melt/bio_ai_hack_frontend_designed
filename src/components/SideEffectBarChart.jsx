import { DescriptionDetails, DescriptionTerm } from '@/components/description-list'
import { Subheading } from '@/components/heading'

function SideEffectBarChart({ title, data, barColor }) {
  return (
    <div className="mb-8">
      <Subheading>{title}</Subheading>
      <div className="space-y-4">
        {data.map((prob, index) => (
          <div key={index}>
            <div className="mb-1 flex justify-between">
              <DescriptionTerm>{prob.label}</DescriptionTerm>
              <DescriptionDetails>{prob.value.toFixed(2) * 100}%</DescriptionDetails>
            </div>
            <div className="h-6 w-full rounded bg-gray-300">
              <div className={`h-6 rounded ${barColor}`} style={{ width: `${prob.value * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideEffectBarChart
