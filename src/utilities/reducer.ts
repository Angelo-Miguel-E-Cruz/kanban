import { colors, Action, AppState } from "@/utilities/exports"

export default function Reducer(state: AppState, action: Action) {
  const { type } = action

  switch (type) {
    case 'TOGGLE_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: action.payload.isOpen ?? !state.modals[action.payload.modal]
        }
      }

    case 'UPDATE_FORM':
      return {
        ...state,
        forms: {
          ...state.forms,
          [action.payload.form]: action.payload.value
        }
      }

    case 'ADD_TASK':
      return {
        ...state,
        columns: state.columns.map((column, index) =>
          index === action.payload.columnIndex
            ? { ...column, items: [...column.items, action.payload.task] }
            : column
        ),
        forms: { ...state.forms, newTask: '' }
      }

    case 'ADD_BOARD':
      return {
        ...state,
        boards: [...state.boards, action.payload],
        forms: { ...state.forms, newBoard: '' }
      }

    case 'REMOVE_TASK':
      return {
        ...state,
        columns: state.columns.map((column, index) =>
          index === action.payload.columnIndex
            ? { ...column, items: column.items.filter(item => item.id !== action.payload.taskId) }
            : column
        )
      }

    case 'SET_COLUMN':
      return {
        ...state,
        columns: action.payload,
        boards: state.boards.map((board, index) => // this one doesn't work
          index === state.activeBoard
            ? { ...board, columns: action.payload }
            : board
        )
      }

    case 'SET_COLUMN_ON_START':
      return {
        ...state,
        columns: state.boards[action.payload - 1].columns
      }

    case 'SET_ACTIVE_BOARD':
      return {
        ...state,
        activeBoard: action.payload,
        columns: action.payload ? state.boards.find(b => b.id === action.payload)?.columns || [] : []
      }

    case 'RESET_FORMS':
      return {
        ...state,
        forms: {
          newTask: '',
          newColumn: '',
          newBoard: '',
          editColumnName: ''
        },
        columnProps: {
          number: 1,
          names: [""],
          colors: [colors[0].class]
        }
      }

    case 'SET_COLUMN_PROPS':
      return {
        ...state,
        columnProps: {
          ...state.columnProps,
          [action.payload.type]: action.payload.value
        }
      }

    case 'SET_COLUMN_ID':
      return {
        ...state,
        activeColId: action.payload
      }

    case 'SET_COLOR':
      return {
        ...state,
        selectedColor: action.payload
      }

    default:
      return state
  }
}