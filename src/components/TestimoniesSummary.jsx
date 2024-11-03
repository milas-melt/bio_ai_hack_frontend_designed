import React, { useEffect, useState } from "react";

function TestimoniesSummary() {
    const [testimony, setTestimonies] = useState([]);

    useEffect(() => {
        // For now, we'll use mock data. Replace this with actual data fetching later.
        setTestimonies([
            {
                id: 1,
                name: "John Doe",
                testimony:
                    "This medication significantly improved my condition with minimal side effects.",
            },
            {
                id: 2,
                name: "Jane Smith",
                testimony:
                    "I experienced some dizziness, but overall the treatment was effective.",
            },
            {
                id: 3,
                name: "Alice Johnson",
                testimony: "Had severe headaches after taking the medication.",
            },
        ]);
    }, []);

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Testimonies Summary</h3>
            <div className="space-y-4">
                {testimony.map((item) => (
                    <div key={item.id} className="p-4 bg-white rounded shadow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-gray-700">{item.testimony}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TestimoniesSummary;
