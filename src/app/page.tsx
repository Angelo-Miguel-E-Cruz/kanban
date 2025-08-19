"use client"

import { useReducer, useState } from "react"
import Modal from "../components/Modals/modal"
import { colors, Items, Column, Board, DraggedItem, initialState } from "../utilities/exports"
import AddColumn from "@/components/Modals/AddColumnModal"
import AddBoard from "@/components/Modals/AddBoardModal"
import EditColumn from "@/components/Modals/EditColumnModal"
import ColumnComponent from "@/components/Board/Column"
import Reducer from "@/utilities/reducer"

export default function Home() {

  const [state, dispatch] = useReducer(Reducer, initialState)
  const [openColPicker, setOpenColPicker] = useState<number | null>(null)

  // Functions
  // TODO: 1. Put in own ts file?
  const addNewTask = () => {
    if (state.forms.newTask.trim() === "") {
      console.log("No board name") // TODO: 1. Make Toast
      return
    }

    const newItem: Items = {
      id: Date.now().toString(),
      content: state.forms.newTask
    }

    const updatedColumns: Column[] = state.columns.map((column, index) =>
      index === state.activeColId
        ? { ...column, items: [...column.items, newItem] }
        : column
    )

    dispatch({ type: "SET_COLUMN", payload: updatedColumns })
    dispatch({ type: "RESET_FORMS" })
  }

  const addNewColumn = () => {
    // Check if no new column name
    if (state.forms.newColumn.trim() === "") {
      console.log("No column name") // TODO: 1. Make Toast
      dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addColumn', isOpen: false } })
      return
    }

    // Check if column of same name already exists
    if (state.columns.some((column) => column.name === state.forms.newColumn)) {
      console.log("Column already exists") // TODO: 1. Change to toast
      dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addColumn', isOpen: false } })
      return
    }

    const headerColor = colors.find((color) => color.name === state.selectedColor)
    const fromColor = headerColor!.from
    const toColor = headerColor!.to

    const newColID = state.columns.length
    const newCol: Column = {
      id: newColID + 1,
      name: state.forms.newColumn,
      items: [],
      from: fromColor,
      to: toColor
    }

    const updatedColumns = [...state.columns, newCol]

    dispatch({ type: 'SET_COLUMN', payload: updatedColumns })
    dispatch({ type: "RESET_FORMS" })
    dispatch({ type: 'SET_COLOR', payload: initialState.selectedColor })
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addColumn', isOpen: false } })
  }

  const addNewBoard = () => {
    var validNewBoard = true
    // Check if no new board name
    if (state.forms.newBoard.trim() === "") {
      console.log("No board name") // TODO: 1. Make Toast
      validNewBoard = false
      dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addBoard', isOpen: false } })
    }

    // Check if column of same name already exists
    if (state.boards.some((board) => board.name === state.forms.newBoard)) {
      console.log("Board already exists") // TODO: 1. Change to toast
      validNewBoard = false
      dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addBoard', isOpen: false } })
    }

    // Check if some column names are empty or just spaces
    if (state.columnProps.names.some(name => name.trim() === "")) {
      console.log("Column names can not be empty") // TODO: 1. Change to toast
      validNewBoard = false
      dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addBoard', isOpen: false } })
    }

    if (validNewBoard) {
      var newCols: Column[] = []
      state.columnProps.names.map((name, index) => {
        const colorObj = colors.find(c => c.class === state.columnProps.colors[index])
        const from = colorObj!.from
        const to = colorObj!.to
        const newCol: Column = {
          id: index + 1,
          name: name,
          items: [],
          from: from,
          to: to,
        }
        newCols.push(newCol)
      })

      const newB: Board = {
        id: state.boards.length + 1,
        name: state.forms.newBoard,
        columnNumber: state.columnProps.number,
        columns: newCols
      }
      dispatch({ type: 'ADD_BOARD', payload: newB })
    }

    dispatch({ type: 'RESET_FORMS' })
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addBoard', isOpen: false } })
  }

  const setActiveCol = (columnId: string) => {
    const colId = parseInt(columnId, 10)
    dispatch({ type: 'SET_COLUMN_ID', payload: colId })
  }

  const removeTask = (columnId: number, taskId: string) => {
    const updatedColumns: Column[] = state.columns.map((column, index) =>
      index === columnId
        ? { ...column, items: column.items.filter((item) => item.id !== taskId) }
        : column
    )

    dispatch({ type: 'SET_COLUMN', payload: updatedColumns })
  }

  const removeColumn = (colName: string) => {
    if (state.columns.length === 1) {
      console.log("Board must have at least 1 column") // TODO: 1. Make toast 
      return
    }

    const updatedColumns = state.columns.filter((column) => column.name !== colName)
    dispatch({ type: "SET_COLUMN", payload: updatedColumns })
    dispatch({ type: "RESET_FORMS" })
  }

  const handleDragStart = (columnId: number, item: Items) => {
    const draggedItem: DraggedItem = {
      columnId: columnId,
      item: item
    }
    dispatch({ type: 'SET_DRAGGED_ITEM', payload: draggedItem })
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: number) => {
    e.preventDefault()

    if (!state.draggedItem) return

    const { columnId: sourceColumnId, item } = state.draggedItem

    if (sourceColumnId === targetColumnId) return

    const updatedColumns = state.columns.map((column, index) =>
      index === targetColumnId
        ? { ...column, items: [...column.items, item] }
        : index === sourceColumnId
          ? { ...column, items: column.items.filter((i) => i.id != item.id) }
          : column
    )

    dispatch({ type: "SET_COLUMN", payload: updatedColumns })
    dispatch({ type: "RESET_FORMS" })
    dispatch({ type: 'SET_DRAGGED_ITEM', payload: null })
  }

  const handleNewBoardColumns = (num: number) => {
    dispatch({ type: 'SET_COLUMN_PROPS', payload: { type: 'number', value: num } })

    var columnArr = state.columnProps.names

    if (num > columnArr.length) {
      columnArr = [...columnArr, ...Array(num - columnArr.length).fill("")]
    } else {
      columnArr = columnArr.slice(0, num)
    }

    dispatch({ type: 'SET_COLUMN_PROPS', payload: { type: 'names', value: columnArr } })

    var colorArr = state.columnProps.colors

    if (num > colorArr.length) {
      colorArr = [...colorArr, ...Array(num - colorArr.length).fill(colors[0].class)]
    } else {
      colorArr = colorArr.slice(0, num)
    }

    dispatch({ type: 'SET_COLUMN_PROPS', payload: { type: 'colors', value: colorArr } })
  }

  const handleResetNewBoard = () => {
    dispatch({ type: 'RESET_FORMS' })
    dispatch({ type: 'SET_COLUMN_PROPS', payload: { type: 'names', value: [""] } })
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addBoard', isOpen: false } })
    setOpenColPicker(null)
  }

  const openBoard = (boardID: number) => {
    dispatch({ type: 'SET_COLUMN_ON_START', payload: boardID })
    dispatch({ type: "SET_ACTIVE_BOARD", payload: boardID })
  }

  const handleEditColumn = (columnID: number) => {
    const columnColor: string = colors.find((color) => color.from === state.columns[columnID].from)!.name

    dispatch({ type: 'UPDATE_FORM', payload: { form: 'editColumnName', value: state.columns[columnID].name } })
    dispatch({ type: 'SET_COLOR', payload: columnColor })
    dispatch({ type: 'SET_COLUMN_ID', payload: columnID })
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'editColumn', isOpen: true } })
  }

  const editColumn = () => {
    // Check if no new column name
    if (state.forms.editColumnName.trim() === "") {
      console.log("No column name") // TODO: 1. Make Toast
      dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'editColumn', isOpen: false } })
      return
    }

    // Check if column of same name already exists
    if (state.columns.some((column, index) => column.name === state.forms.editColumnName && index !== state.activeColId)) {
      console.log("Column already exists") // TODO: 1. Change to toast
      dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'editColumn', isOpen: false } })
      return
    }

    const newColor = colors.find((color) => color.name === state.selectedColor)
    const newFrom = newColor!.from
    const newTo = newColor!.to

    const updatedColumns = state.columns.map((col, index) =>
      index === state.activeColId ? { ...col, name: state.forms.editColumnName, from: newFrom, to: newTo } : col
    )

    dispatch({ type: "SET_COLUMN", payload: updatedColumns })
    dispatch({ type: "RESET_FORMS" })
    dispatch({ type: 'UPDATE_FORM', payload: { form: 'editColumnName', value: "" } })
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'editColumn', isOpen: false } })
  }

  const handleChangeBoard = () => {

    const updatedBoards = state.boards.map((board, index) =>
      index === state.activeBoard ? { ...board, columns: state.columns } : board)

    console.log(updatedBoards)
    dispatch({ type: "SET_ACTIVE_BOARD", payload: null })
  }

  return (
    <main>
      <div className="p-6 w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center">
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400">Canban Board</h1>

          {/* Add new task / Add column Area */}
          {!state.activeBoard ? (<></>) : (
            <div className="flex gap-4">
              <div className="flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={state.forms.newTask}
                  onChange={(e) => dispatch({
                    type: "UPDATE_FORM",
                    payload: { form: "newTask", value: e.target.value }
                  })}
                  placeholder="Add a new task..."
                  className="flex-grow p-3 bg-zinc-700 text-white"
                  onKeyDown={(e) => e.key === "Enter" && addNewTask()} />

                <select
                  value={state.activeColId}
                  onChange={(e) => setActiveCol(e.target.value)}
                  className="p-3 bg-zinc-700 text-white border-0 border-l border-zinc-600">
                  {Object.keys(state.columns).map((columnId) => (
                    <option value={columnId} key={columnId}> {state.columns[Number(columnId)].name} </option>
                  ))}
                </select>

                <button
                  onClick={() => addNewTask()}
                  className="px-6 bg-gradient-to-r  from-yellow-600 to-amber-500 text-white 
                  font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
                  duration-200 cursor-pointer">
                  Add
                </button>

              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addColumn', isOpen: true } })}
                className="px-6 rounded-lg bg-gradient-to-r  from-yellow-600 to-amber-500 text-white 
              font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
              duration-200 cursor-pointer">
                Add Column
              </button>

              <button
                onClick={() => handleChangeBoard()}
                className="px-6 rounded-lg bg-gradient-to-r  from-yellow-600 to-amber-500 text-white 
              font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
              duration-200 cursor-pointer">
                Change Board
              </button>
            </div>
          )}

          {/* Board Area */}
          <div className="flex gap-6 overflow-x-auto pb-6 w-full justify-center">
            {state.boards.length === 0 ? (
              <button
                onClick={() => dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addBoard', isOpen: true } })}
                className="p-3 rounded-lg bg-gradient-to-r  from-yellow-600 to-amber-500 text-white 
                font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
                duration-200 cursor-pointer">
                Create New Board
              </button>
            ) : (
              !state.activeBoard ? (
                <div className="flex flex-col shrink-0 w-80 bg-zinc-800 rounded-lg shadow-xl">
                  <div className="p-4 min-h-64 max-h-96">
                    {
                      Object.keys(state.boards).map((boardID) => (
                        <div
                          onClick={() => openBoard(Number(boardID) + 1)}
                          key={boardID}
                          className="p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-pointer
                          flex items-center justify-between transform transition-all duration-200
                          hover:scale-105 hover:shadow-lg hover:bg-zinc-600">
                          <span className="mr-2">{state.boards[Number(boardID)].name}</span>
                        </div>
                      ))
                    }
                    <div
                      onClick={() => dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addBoard', isOpen: true } })}
                      className="p-4 mb-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400 
                        text-white rounded-lg shadow-md cursor-pointer flex items-center justify-center
                          transform transition-all duration-200 hover:scale-105 hover:shadow-lg 
                          hover:from-yellow-500 hover:via-amber-600 hover:to-rose-500">
                      <span>Add New Board</span>
                    </div>
                  </div>
                </div>
              ) : (
                Object.keys(state.columns).map((_, index) => (
                  <ColumnComponent key={index}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    columns={state.columns}
                    index={index}
                    handleEditColumn={handleEditColumn}
                    removeColumn={removeColumn}
                    handleDragStart={handleDragStart}
                    removeTask={removeTask} />
                ))
              )
            )}
          </div>
        </div>
      </div>

      {/* Add column modal */}
      <AddColumn
        state={state}
        dispatch={dispatch}
        onPress={addNewColumn} />

      {/* Add board modal */}
      <AddBoard
        state={state}
        dispatch={dispatch}
        onPress={addNewBoard}
        onReset={handleResetNewBoard}
        openColPicker={openColPicker!} // use custom hook to make sure of this?
        setOpenColPicker={setOpenColPicker}
        handleNewBoardColumns={handleNewBoardColumns} />

      {/* Edit task modal */}
      <Modal isOpen={state.modals.editTask} onClose={() => dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'editTask', isOpen: false } })}>
        <div>

        </div>
      </Modal>

      {/* Edit column modal */}
      <EditColumn
        state={state}
        dispatch={dispatch}
        onPress={editColumn} />
    </main>
  )
}
