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
  id: number,
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

export interface DraggedItem {
  columnId: number,
  item: Items
}

export interface AppState {
  boards: Board[]
  activeBoard: number | null
  columns: Column[]

  modals: {
    addBoard: boolean
    editTask: boolean
    addColumn: boolean
    editColumn: boolean
  }

  forms: {
    newTask: string
    newColumn: string
    newBoard: string
    editColumnName: string
    editTaskName: string
  }

  columnProps: {
    number: number
    names: string[]
    colors: string[]
  }

  selectedColor: string
  activeColId: number
  taskId: number
  draggedItem: DraggedItem | null
}

export const initialState: AppState = {
  boards: [],
  activeBoard: null,
  columns: [],
  modals: {
    addBoard: false,
    editTask: false,
    addColumn: false,
    editColumn: false
  },

  forms: {
    newTask: "",
    newColumn: "",
    newBoard: "",
    editColumnName: "",
    editTaskName: ""
  },

  columnProps: {
    number: 1,
    names: [""],
    colors: [colors[0].class]
  },

  selectedColor: colors[0].name,
  activeColId: 0,
  taskId: 0,
  draggedItem: null

}

export type Action =
  // Modal actions
  | { type: 'TOGGLE_MODAL'; payload: { modal: keyof AppState['modals']; isOpen?: boolean } }

  // Form Actions
  | { type: 'UPDATE_FORM'; payload: { form: keyof AppState['forms']; value: string } }
  | { type: 'RESET_FORMS' }

  // Boards Actions
  | { type: 'SET_ACTIVE_BOARD'; payload: number | null }
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'SET_BOARD'; payload: Board[] }

  // Column Actions
  | { type: 'SET_COLUMN_ON_START'; payload: number }
  | { type: 'SET_COLUMN'; payload: Column[] }
  | { type: 'SET_COLUMN_PROPS'; payload: { type: keyof AppState['columnProps']; value: number | string[] | string } }

  // Task Actions
  | { type: 'ADD_TASK'; payload: { columnIndex: number; task: Items } }
  | { type: 'REMOVE_TASK'; payload: { columnIndex: number; taskId: number } }
  | { type: 'EDIT_TASK' }

  // General Actions
  | { type: 'SET_PROPERTY'; payload: { type: keyof AppState; value: number | string | DraggedItem | null } }


export function generateID(): number {
  return Date.now() + Math.floor(Math.random() * 1000)
}