export const colors = [
  { name: "Red", value: "#ef4444", class: "bg-red-500", from: "from-red-500", to: "to-red-600" },
  { name: "Orange", value: "#f97316", class: "bg-orange-500", from: "from-orange-400", to: "to-orange-500" },
  { name: "Yellow", value: "#eab308", class: "bg-yellow-500", from: "from-amber-300", to: "to-yellow-400" },
  { name: "Green", value: "#22c55e", class: "bg-green-500", from: "from-green-600", to: "to-green-700" },
  { name: "Blue", value: "#3b82f6", class: "bg-blue-500", from: "from-blue-600", to: "to-blue-700" },
  { name: "Indigo", value: "#615fff", class: "bg-teal-500", from: "from-teal-400", to: "to-teal-600" },
  { name: "Purple", value: "#8b5cf6", class: "bg-purple-500", from: "from-purple-600", to: "to-purple-700" },
  { name: "Pink", value: "#ec4899", class: "bg-rose-400", from: "from-rose-400", to: "to-rose-500" },
]

export interface Items {
  id: string,
  content: string
}

export interface Column {
  id: number,
  name: string,
  items: Items[],
  from: string,
  to: string
}

export interface Board {
  id: number,
  name: string,
  columnNumber: number,
  columns: Column[]
}