export default function ProductsMaster() {
  const mockProducts = [
    { code: "PEST001", name: "Glyphosate 41% SL", category: "Herbicide", unit: "Liter", reorder: 200, hsn: "3808" },
    { code: "PEST002", name: "Imidacloprid 17.8% SL", category: "Insecticide", unit: "Liter", reorder: 100, hsn: "3808" },
    { code: "PEST003", name: "Mancozeb 75% WP", category: "Fungicide", unit: "Kg", reorder: 150, hsn: "3808" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-900">Product Master</h1>
        <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          + Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="px-6 py-4 text-left">Code</th>
              <th className="px-6 py-4 text-left">Product Name</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Unit</th>
              <th className="px-6 py-4 text-left">Reorder Level</th>
              <th className="px-6 py-4 text-left">HSN Code</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockProducts.map((prod, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{prod.code}</td>
                <td className="px-6 py-4">{prod.name}</td>
                <td className="px-6 py-4">{prod.category}</td>
                <td className="px-6 py-4">{prod.unit}</td>
                <td className="px-6 py-4">{prod.reorder}</td>
                <td className="px-6 py-4">{prod.hsn}</td>
                <td className="px-6 py-4">
                  <button className="text-teal-600 hover:underline mr-3">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}