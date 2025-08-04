"use client"

import { useState } from "react"
import Modal from "../components/modal"

export default function Home() {

  // Items and Column Types
  // TODO: 1. Refine and check
  type Items = {
    id: string,
    content: string
  }

  type Column = {
    id: number,
    name: string,
    items: Items[]
  }

  type DraggedItem = {
    columnId: number,
    item: Items
  }


  // Columns
  // TODO: 1. Make them customizable (ie. name, how many columns, etc.)
  // ^^ start from 0 columns then create board
  // 2. Retain items through refresh (using supabase?)
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 1,
      name: "To Do",
      items: [
        { id: "1", content: "1" },
        { id: "2", content: "2" }
      ]
    },
    {
      id: 2,
      name: "In Progress",
      items: [
        { id: "3", content: "3" }
      ]
    },
    {
      id: 3,
      name: "Done",
      items: [
        { id: "4", content: "4" }
      ]
    }
  ])

  const [newTask, setNewTask] = useState("")
  const [newColumn, setNewColumn] = useState("")
  const [activeColId, setActiveColId] = useState<number>(0);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

  const addNewTask = () => {
    if (newTask.trim() === "") return

    const updatedColumns: Column[] = { ...columns }

    updatedColumns[activeColId].items.push({
      id: Date.now().toString(),
      content: newTask
    })

    setColumns(updatedColumns)
    setNewTask("")
  }

  const setActiveCol = (columnId: string) => {
    const colId = parseInt(columnId, 10)
    setActiveColId(colId)
  }

  const removeTask = (columnId: number, taskId: string) => {
    const updatedColumns: Column[] = { ...columns }

    updatedColumns[columnId].items = updatedColumns[columnId].items.filter((item) => item.id !== taskId)

    setColumns(updatedColumns)
  }

  const handleDragStart = (columnId: number, item: Items) => {
    setDraggedItem({ columnId, item })
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, columnId: number) => {
    e.preventDefault()

    if (!draggedItem) return

    const { columnId: sourceColumnId, item } = draggedItem

    if (sourceColumnId === columnId) return

    const updatedColumns = { ...columns }

    updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter((i) => i.id != item.id)

    updatedColumns[columnId].items.push(item)

    setColumns(updatedColumns)
    setDraggedItem(null)
  }

  const addNewColumn = () => {
    // Check if no new column name
    if (newColumn.trim() === "") {
      setIsAddModalOpen(false)
      return
    }

    // Check if column of same name already exists
    if (columns.some((column) => { column.name === newColumn })) {
      console.log("Column already exists") // TODO: 1. Change to toast
      setIsAddModalOpen(false)
      return
    }

    const newColID = columns.length
    const newCol: Column = {
      id: newColID + 1,
      name: newColumn,
      items: []
    }

    setColumns([...columns, newCol])
    setNewColumn("")
    setIsAddModalOpen(false)
  }

  const removeColumn = () => {
    let updatedColumns = [...columns]

    updatedColumns = updatedColumns.filter((column) => column.id !== activeColId + 1)

    setColumns(updatedColumns)
    setIsRemoveModalOpen(false)
  }

  return (
    <main>
      <div className="p-6 w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center">
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400">React Kanban Board</h1>

          {/* Add new task / Add column Area */}
          <div className="mb-8 flex gap-4">
            <div className="flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-grow p-3 bg-zinc-700 text-white"
                onKeyDown={(e) => e.key === "Enter" && addNewTask()} />

              <select
                value={activeColId}
                onChange={(e) => setActiveCol(e.target.value)}
                className="p-3 bg-zinc-700 text-white border-0 border-l border-zinc-600">
                {Object.keys(columns).map((columnId, index) => (
                  <option value={columnId} key={columnId}> {columns[index].name} </option>
                ))}
              </select>

              <button
                onClick={() => addNewTask()}
                className="px-6 bg-gradient-to-r from-yellow-600 to-amber-500 text-white 
              font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
              duration-200 cursor-pointer">
                Add
              </button>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 rounded-lg bg-gradient-to-r  from-yellow-600 to-amber-500 text-white 
              font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
              duration-200 cursor-pointer">
              Add Column
            </button>

            <button
              onClick={() => setIsRemoveModalOpen(true)}
              className="px-6 rounded-lg bg-gradient-to-r  from-yellow-600 to-amber-500 text-white 
              font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
              duration-200 cursor-pointer">
              Remove Column
            </button>
          </div>

          {/* Board Area */}
          <div className="flex gap-6 overflow-x-auto pb-6 w-full justify-center">
            {/* Column */}
            {/* TODO: 1. Make into separate component */}
            {Object.keys(columns).map((columnId, index) => (
              <div
                key={columnId}
                className="flex flex-col shrink-0 w-80 bg-zinc-800 rounded-lg shadow-xl border-t-4"
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, index)}>

                <div
                  className="p-4 text-white font-bold text-xl rounded-t-md w-full">
                  {columns[index].name}
                  <span className="ml-2 px-2 py-1 bg-gradient-to-bl from-green-700 to-green-500 bg-opacity-30 rounded-full text-sm">{columns[index].items.length}</span>
                </div>

                {/* Cards/Items */}
                {/* TODO: 1. Make into separate component */}
                {/* 2. Overflow or no overflow? */}
                <div className="p-3 min-h-64">
                  {columns[index].items.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 italic text-sm"> Drop Tasks Here</div>
                  ) : (
                    columns[index].items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-move
                        flex items-center justify-between transform transition-all duration-200
                        hover:scale-105 hover:shadow-lg"
                        draggable onDragStart={() => handleDragStart(index, item)}>
                        <span className="mr-2">{item.content}</span>
                        <button
                          onClick={() => removeTask(index, item.id)}
                          className="text-zinc-400 hover:text-red-400 transform-colors duration-200
                          w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-600">
                          <span className="text-lg cursor-pointer"> x</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400">Add Column</h1>
          <div className="mb-8 flex gap-4">
            <div className="flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
              <input
                type="text"
                value={newColumn}
                onChange={(e) => setNewColumn(e.target.value)}
                placeholder="Add a new column..."
                className="flex-grow p-3 bg-zinc-700 text-white"
                onKeyDown={(e) => e.key === "Enter" && addNewColumn()} />

              <button
                onClick={() => addNewColumn()}
                className="px-6 bg-gradient-to-r from-yellow-600 to-amber-500 text-white 
                font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
                duration-200 cursor-pointer">
                Add
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isRemoveModalOpen} onClose={() => setIsRemoveModalOpen(false)}>
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400">Remove Column</h1>
          <div className="mb-8 flex gap-4">
            <div className="flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">

              <select
                value={activeColId}
                onChange={(e) => setActiveCol(e.target.value)}
                className="p-3 bg-zinc-700 text-white border-0 border-l border-zinc-600">
                {Object.keys(columns).map((columnId, index) => (
                  <option value={columnId} key={columnId}> {columns[index].name} </option>
                ))}
              </select>

              <button
                onClick={() => removeColumn()}
                className="px-6 bg-gradient-to-r from-yellow-600 to-amber-500 text-white 
                font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
                duration-200 cursor-pointer">
                Remove
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </main>
  )
}
