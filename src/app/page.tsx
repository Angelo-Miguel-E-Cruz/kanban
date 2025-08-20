"use client"

import { useReducer, useState } from "react"
import Modal from "../components/Modals/modal"
import { colors, Items, Column, Board, DraggedItem, initialState, generateID } from "../utilities/exports"
import AddColumn from "@/components/Modals/AddColumnModal"
import AddBoard from "@/components/Modals/AddBoardModal"
import EditColumn from "@/components/Modals/EditColumnModal"
import EditTask from "@/components/Modals/EditTaskModal"
import ColumnComponent from "@/components/Board/Column"
import Reducer from "@/utilities/reducer"
import * as hooks from "@/utilities/hooks"

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
      id: generateID(),
      content: state.forms.newTask
    }

    const updatedColumns: Column[] = state.columns.map((column) =>
      column.id === state.activeColId
        ? { ...column, items: [...column.items, newItem] }
        : column
    )

    dispatch({ type: "SET_COLUMN", payload: updatedColumns })
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

    const newCol: Column = {
      id: generateID(),
      name: state.forms.newColumn,
      items: [],
      from: fromColor,
      to: toColor
    }

    const updatedColumns = [...state.columns, newCol]

    dispatch({ type: 'SET_COLUMN', payload: updatedColumns })
    dispatch({ type: 'SET_PROPERTY', payload: { type: 'selectedColor', value: initialState.selectedColor } })
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addColumn', isOpen: false } })
  }

  const addNewBoard = () => {
    const validNewBoard = hooks.useBoardValidation(state.forms.newBoard, state.columnProps.names, state.boards)

    if (validNewBoard) {
      var newCols: Column[] = []
      state.columnProps.names.map((name, index) => {
        const colorObj = colors.find(c => c.class === state.columnProps.colors[index])
        const from = colorObj!.from
        const to = colorObj!.to
        const newCol: Column = {
          id: generateID(),
          name: name,
          items: [],
          from: from,
          to: to,
        }
        newCols.push(newCol)
      })

      const newB: Board = {
        id: generateID(),
        name: state.forms.newBoard,
        columnNumber: state.columnProps.number,
        columns: newCols
      }
      dispatch({ type: 'ADD_BOARD', payload: newB })
    }

    dispatch({ type: 'RESET_FORMS' })
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addBoard', isOpen: false } })
  }

  const setActiveCol = (columnId: number) => {
    console.log(columnId)
    dispatch({ type: 'SET_PROPERTY', payload: { type: 'activeColId', value: columnId } })
  }

  const removeTask = (columnId: number, taskId: number) => {
    dispatch({ type: 'REMOVE_TASK', payload: { columnIndex: columnId, taskId: taskId } })
  }

  const handleEditTask = (columnId: number, taskId: number) => {
    const task = state.columns.find((column) => column.id === columnId)
      ?.items.find((i) => i.id === taskId)?.content

    console.log(task)
    dispatch({ type: 'SET_PROPERTY', payload: { type: 'activeColId', value: columnId } })
    dispatch({ type: 'SET_PROPERTY', payload: { type: 'taskId', value: taskId } })
    dispatch({ type: 'UPDATE_FORM', payload: { form: 'editTaskName', value: task! } })
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'editTask', isOpen: true } })
  }

  const removeColumn = (colName: string) => {
    if (state.columns.length === 1) {
      console.log("Board must have at least 1 column") // TODO: 1. Make toast 
      return
    }

    const updatedColumns = state.columns.filter((column) => column.name !== colName)
    dispatch({ type: "SET_COLUMN", payload: updatedColumns })
  }

  const handleDragStart = (columnId: number, item: Items) => {
    const draggedItem: DraggedItem = {
      columnId: columnId,
      item: item
    }
    dispatch({ type: 'SET_PROPERTY', payload: { type: 'draggedItem', value: draggedItem } })
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: number) => {
    e.preventDefault()

    if (!state.draggedItem) return

    const { columnId: sourceColumnId, item } = state.draggedItem

    if (sourceColumnId === targetColumnId) return

    const updatedColumns = state.columns.map((column) =>
      column.id === targetColumnId
        ? { ...column, items: [...column.items, item] }
        : column.id === sourceColumnId
          ? { ...column, items: column.items.filter((i) => i.id != item.id) }
          : column
    )

    dispatch({ type: "SET_COLUMN", payload: updatedColumns })
    dispatch({ type: 'SET_PROPERTY', payload: { type: 'draggedItem', value: null } })
  }

  const handleNewBoardColumns = (num: number) => {
    const columnArr = hooks.useCustomProps(state.columnProps.names, num, "name")
    const colorArr = hooks.useCustomProps(state.columnProps.colors, num, "color")

    dispatch({ type: 'SET_COLUMN_PROPS', payload: { type: 'number', value: num } })
    dispatch({ type: 'SET_COLUMN_PROPS', payload: { type: 'names', value: columnArr } })
    dispatch({ type: 'SET_COLUMN_PROPS', payload: { type: 'colors', value: colorArr } })
  }

  const handleResetNewBoard = () => {
    dispatch({ type: 'RESET_FORMS' })
    dispatch({ type: 'SET_COLUMN_PROPS', payload: { type: 'names', value: initialState.columnProps.names } })
    dispatch({ type: 'SET_COLUMN_PROPS', payload: { type: 'colors', value: initialState.columnProps.colors } })
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'addBoard', isOpen: false } })
    setOpenColPicker(null)
  }

  const openBoard = (boardID: number) => {
    dispatch({ type: 'SET_COLUMN_ON_START', payload: boardID })
    dispatch({ type: "SET_ACTIVE_BOARD", payload: boardID })
  }

  const handleEditColumn = (columnID: number) => {
    const columnMatch = state.columns.find((column) => column.id === columnID)
    const colorMatch = columnMatch ? colors.find((color) => color.from === columnMatch.from) : colors[0]
    const columnColor = colorMatch?.name || colors[0].name

    dispatch({ type: 'UPDATE_FORM', payload: { form: 'editColumnName', value: columnMatch!.name } })
    dispatch({ type: 'SET_PROPERTY', payload: { type: 'selectedColor', value: columnColor } })
    dispatch({ type: 'SET_PROPERTY', payload: { type: 'activeColId', value: columnID } })
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
    if (state.columns.some((column) => column.name === state.forms.editColumnName && column.id !== state.activeColId)) {
      console.log("Column already exists") // TODO: 1. Change to toast
      dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'editColumn', isOpen: false } })
      return
    }

    const newColor = colors.find((color) => color.name === state.selectedColor)
    const newFrom = newColor!.from
    const newTo = newColor!.to

    const updatedColumns = state.columns.map((column) =>
      column.id === state.activeColId ? { ...column, name: state.forms.editColumnName, from: newFrom, to: newTo } : column
    )

    dispatch({ type: "SET_COLUMN", payload: updatedColumns })
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'editColumn', isOpen: false } })
    dispatch({ type: 'SET_PROPERTY', payload: { type: 'activeColId', value: state.columns[0].id } })
  }

  const handleChangeBoard = () => {

    const updatedBoards = state.boards.map((board) =>
      board.id === state.activeBoard ? { ...board, columns: state.columns } : board)

    dispatch({ type: 'SET_BOARD', payload: updatedBoards })
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
                  onChange={(e) => setActiveCol(Number(e.target.value))}
                  className="p-3 bg-zinc-700 text-white border-0 border-l border-zinc-600">
                  {state.columns.map((column) => (
                    <option value={column.id} key={column.id}> {column.name} </option>
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
                      state.boards.map((board) => (
                        <div
                          onClick={() => openBoard(board.id)}
                          key={board.id}
                          className="p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-pointer
                          flex items-center justify-between transform transition-all duration-200
                          hover:scale-105 hover:shadow-lg hover:bg-zinc-600">
                          <span className="mr-2">{board.name}</span>
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
                state.columns.map((column) => (
                  <ColumnComponent key={column.id}
                    handleEditTask={handleEditTask}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    column={column}
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
        isOpen={state.modals.addColumn}
        inputValue={state.forms.newColumn}
        selectedColor={state.selectedColor}
        dispatch={dispatch}
        onPress={addNewColumn} />

      {/* Add board modal */}
      <AddBoard
        isOpen={state.modals.addBoard}
        inputValue={state.forms.newBoard}
        columnNumber={state.columnProps.number}
        columnColors={state.columnProps.colors}
        columnNames={state.columnProps.names}
        dispatch={dispatch}
        onPress={addNewBoard}
        onReset={handleResetNewBoard}
        openColPicker={openColPicker!} // use custom hook to make sure of this?
        setOpenColPicker={setOpenColPicker}
        handleNewBoardColumns={handleNewBoardColumns} />

      {/* Edit task modal */}
      <EditTask
        isOpen={state.modals.editTask}
        inputValue={state.forms.editTaskName}
        dispatch={dispatch}>
      </EditTask>

      {/* Edit column modal */}
      <EditColumn
        isOpen={state.modals.editColumn}
        inputValue={state.forms.editColumnName}
        selectedColor={state.selectedColor}
        dispatch={dispatch}
        onPress={editColumn} />
    </main>
  )
}
