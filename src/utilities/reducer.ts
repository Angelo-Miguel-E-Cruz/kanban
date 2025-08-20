import { colors, Action, AppState, initialState } from "@/utilities/exports"

export default function Reducer(state: AppState, action: Action) {
  const { type } = action

  switch (type) {
    case 'TOGGLE_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: action.payload.isOpen ?? !state.modals[action.payload.modal]
        },
        forms: !action.payload.isOpen
          ? initialState.forms
          : state.forms,
        columnProps: {
          number: 1,
          names: [""],
          colors: [colors[0].class]
        },
        selectedColor: action.payload.modal === 'addColumn' ? initialState.selectedColor : state.selectedColor
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
        columns: state.columns.map((column) =>
          column.id === action.payload.columnIndex
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
        columns: state.columns.map((column) =>
          column.id === action.payload.columnIndex
            ? { ...column, items: column.items.filter(item => item.id !== action.payload.taskId) }
            : column
        )
      }


    case 'SET_BOARD':
      return {
        ...state,
        boards: action.payload
      }

    case 'SET_COLUMN':
      return {
        ...state,
        columns: action.payload,
        forms: initialState.forms,
      }

    case 'SET_COLUMN_ON_START':
      const selectedBoard = state.boards.find((board) => board.id === action.payload)
      const boardColumns = selectedBoard ? selectedBoard.columns : []
      return {
        ...state,
        columns: boardColumns,
        activeColId: boardColumns ? boardColumns[0].id : 0
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
        forms: initialState.forms,
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

    case 'SET_PROPERTY':
      return {
        ...state,
        [action.payload.type]: action.payload.value
      }

    case 'EDIT_TASK':
      return {
        ...state,
        columns: state.columns.map((column) =>
          column.id === state.activeColId
            ? {
              ...column,
              items: column.items.map((item) =>
                item.id === state.taskId
                  ? { ...item, content: state.forms.editTaskName }
                  : item
              ),
            }
            : column
        ),
        forms: {
          ...state.forms,
          editTaskName: ''
        },
        modals: {
          ...state.modals,
          editTask: false
        }
      }

    default:
      return state
  }
}