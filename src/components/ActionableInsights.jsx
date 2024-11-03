import React, { useEffect, useState } from "react";

function ActionableInsights() {
    const [insights, setInsights] = useState([]);

    useEffect(() => {
        // Mock data for demonstration. Replace with actual insights later.
        setInsights([
            {
                id: 1,
                insight:
                    "Consider adjusting the dosage to reduce the risk of Side Effect A.",
            },
            {
                id: 2,
                insight:
                    "Monitor blood pressure regularly due to the potential for Side Effect B.",
            },
            {
                id: 3,
                insight: "Increase hydration to mitigate Side Effect C.",
            },
        ]);
    }, []);

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Actionable Insights</h3>
            <ul className="list-disc pl-5 space-y-2">
                {insights.map((item) => (
                    <li key={item.id} className="text-gray-800">
                        {item.insight}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ActionableInsights;
