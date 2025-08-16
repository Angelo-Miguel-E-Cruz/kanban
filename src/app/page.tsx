"use client"

import { useState } from "react"
import Modal from "../components/modal"
import { MdOutlineModeEditOutline } from "react-icons/md"
import { colors } from "../utilities/exports"

// SSG Memoization

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
    items: Items[],
    from: string,
    to: string
  }

  type Board = {
    id: number,
    name: string,
    columnNumber: number,
    columns: Column[]
  }

  type DraggedItem = {
    columnId: number,
    item: Items
  }

  // Columns
  // TODO: 1. Make them customizable (ie. name, how many columns, etc.)
  // ^^ start from 0 columns then create board
  // 2. Retain items through refresh (using supabase?)
  const [columns, setColumns] = useState<Column[]>([])
  const [boards, setBoards] = useState<Board[]>([])

  // States
  // TODO: 1. useStateProvider
  const [newTask, setNewTask] = useState("")
  const [newColumn, setNewColumn] = useState("")
  const [newBoard, setNewBoard] = useState("")
  const [activeBoard, setActiveBoard] = useState<number | null>(null)
  const [colNum, setColNum] = useState(1)
  const [colNames, setColNames] = useState<string[]>([""])
  const [colColors, setColColors] = useState<string[]>([colors[0].class])
  const [openColPicker, setOpenColPicker] = useState<number | null>(null)
  const [activeColId, setActiveColId] = useState<number>(0);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)
  const [addBoardModal, setAddBoardModal] = useState(false)
  const [editBoardModal, setEditBoardModal] = useState(false)
  const [editColumnModal, setEditColumnModal] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(colors[0].name)
  const [editColumnName, setEditColumnName] = useState("")

  // Functions
  // TODO: 1. Put in own ts file?
  const addNewTask = () => {
    if (newTask.trim() === "") {
      console.log("No board name") // TODO: 1. Make Toast
      return
    }

    const updatedColumns: Column[] = { ...columns }

    updatedColumns[activeColId].items.push({
      id: Date.now().toString(),
      content: newTask
    })

    setColumns(updatedColumns)
    setNewTask("")
  }

  const addNewColumn = () => {
    // Check if no new column name
    if (newColumn.trim() === "") {
      console.log("No column name") // TODO: 1. Make Toast
      setIsAddModalOpen(false)
      return
    }

    // Check if column of same name already exists
    if (columns.some((column) => column.name === newColumn)) {
      console.log("Column already exists") // TODO: 1. Change to toast
      setIsAddModalOpen(false)
      return
    }

    const headerColor = colors.find((color) => color.name === selectedColor)
    const fromColor = headerColor!.from
    const toColor = headerColor!.to

    const newColID = columns.length
    const newCol: Column = {
      id: newColID + 1,
      name: newColumn,
      items: [],
      from: fromColor,
      to: toColor
    }

    setColumns([...columns, newCol])
    setNewColumn("")
    setIsAddModalOpen(false)
  }

  const addNewBoard = () => {
    var validNewBoard = true
    // Check if no new board name
    if (newBoard.trim() === "") {
      console.log("No board name") // TODO: 1. Make Toast
      setAddBoardModal(false)
      validNewBoard = false
    }

    // Check if column of same name already exists
    if (boards.some((board) => board.name === newBoard)) {
      console.log("Board already exists") // TODO: 1. Change to toast
      setAddBoardModal(false)
      validNewBoard = false
    }

    // Check if some column names are empty or just spaces
    if (colNames.some(name => name.trim() === "")) {
      console.log("Column names can not be empty") // TODO: 1. Change to toast
      setAddBoardModal(false)
      validNewBoard = false
    }

    if (validNewBoard) {
      var newCols: Column[] = []
      colNames.map((name, index) => {
        const colorObj = colors.find(c => c.class === colColors[index])
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
        id: boards.length + 1,
        name: newBoard,
        columnNumber: colNum,
        columns: newCols
      }
      setBoards((prev => [...prev, newB]))
    }

    handleResetNewBoard()
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

  const removeColumn = (colName: string) => {
    if (columns.length === 1) {
      console.log("Board must have at least 1 column") // TODO: 1. Make toast 
      return
    }

    setColumns((columns.filter((column) => column.name !== colName)))
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

  const handleNewBoardColumns = (num: number) => {
    setColNum(num)

    setColNames((prev) => {
      const newArr = [...prev]
      if (num > prev.length) {
        return [...newArr, ...Array(num - prev.length).fill("")];
      } else {
        return newArr.slice(0, num);
      }
    })

    setColColors((prev) => {
      const newArr = [...prev]
      if (num > prev.length) {
        return [...newArr, ...Array(num - prev.length).fill(colors[0].class)];
      } else {
        return newArr.slice(0, num);
      }
    })
  }

  const handleResetNewBoard = () => {
    setNewBoard("")
    setColNum(1)
    setColNames([""])
    setAddBoardModal(false)
    setOpenColPicker(null)
    setColColors(prev => {
      const reset = [...prev]
      reset[0] = colors[0].class
      return reset.slice(0, 1)
    })
  }

  const openBoard = (boardID: number) => {
    setColumns(boards[boardID - 1].columns)
    setActiveBoard(boardID)
  }

  const handleEditColumn = (columnID: number) => {
    const columnColor: string = colors.find((color) => color.from === columns[columnID].from)!.from

    setEditColumnName(columns[columnID].name)
    setSelectedColor(columnColor)
    setActiveColId(columnID)
    setEditColumnModal(true)
  }

  const editColumn = () => {
    // Check if no new column name
    if (editColumnName.trim() === "") {
      console.log("No column name") // TODO: 1. Make Toast
      setEditColumnModal(false)
      return
    }

    // Check if column of same name already exists
    if (columns.some((column, index) => column.name === editColumnName && index !== activeColId)) {
      console.log("Column already exists") // TODO: 1. Change to toast
      setEditColumnModal(false)
      return
    }

    const newColor = colors.find((color) => color.from === selectedColor)
    const newFrom = newColor!.from
    const newTo = newColor!.to

    const updatedColumns = columns.map((col, id) =>
      id === activeColId ? { ...col, name: editColumnName, from: newFrom, to: newTo } : col
    )

    setColumns(updatedColumns)
    setEditColumnName("")
    setEditColumnModal(false)
  }

  return (
    <main>
      <div className="p-6 w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center">
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400">Canban Board</h1>

          {/* Add new task / Add column Area */}
          {!activeBoard ? (<></>) : (
            <div className="flex gap-4">
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
                  {Object.keys(columns).map((columnId) => (
                    <option value={columnId} key={columnId}> {columns[Number(columnId)].name} </option>
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
                onClick={() => setActiveBoard(null)}
                className="px-6 rounded-lg bg-gradient-to-r  from-yellow-600 to-amber-500 text-white 
              font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
              duration-200 cursor-pointer">
                Change Board
              </button>
            </div>
          )}

          {/* Board Area */}
          <div className="flex gap-6 overflow-x-auto pb-6 w-full justify-center">
            {/* Column */}
            {/* TODO: 1. Make into separate component */}
            {boards.length === 0 ? (
              <button
                onClick={() => setAddBoardModal(true)}
                className="p-3 rounded-lg bg-gradient-to-r  from-yellow-600 to-amber-500 text-white 
                font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
                duration-200 cursor-pointer">
                Create New Board
              </button>
            ) : (
              !activeBoard ? (
                <div className="flex flex-col shrink-0 w-80 bg-zinc-800 rounded-lg shadow-xl">
                  <div className="p-4 min-h-64 max-h-96">
                    {
                      Object.keys(boards).map((boardID) => (
                        <div
                          onClick={() => openBoard(Number(boardID) + 1)}
                          key={boardID}
                          className="p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-pointer
                          flex items-center justify-between transform transition-all duration-200
                          hover:scale-105 hover:shadow-lg hover:bg-zinc-600">
                          <span className="mr-2">{boards[Number(boardID)].name}</span>
                        </div>
                      ))
                    }
                    <div
                      onClick={() => setAddBoardModal(true)}
                      className="p-4 mb-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400 
                        text-white rounded-lg shadow-md cursor-pointer flex items-center justify-center
                          transform transition-all duration-200 hover:scale-105 hover:shadow-lg 
                          hover:from-yellow-500 hover:via-amber-600 hover:to-rose-500">
                      <span>Add New Board</span>
                    </div>
                  </div>
                </div>
              ) : (
                Object.keys(columns).map((columnId, index) => (
                  <div
                    key={columnId}
                    className="flex flex-col shrink-0 w-80 bg-zinc-800 rounded-lg shadow-xl"
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleDrop(e, index)}>

                    <div
                      className={`flex p-4 text-white font-bold text-xl rounded-t-md w-full bg-gradient-to-r ${columns[index].from} ${columns[index].to}`}>
                      {columns[index].name}
                      <span className="ml-2 px-2 py-1 bg-zinc-800 bg-opacity-30 rounded-full text-sm">{columns[index].items.length}</span>

                      <button
                        onClick={() => handleEditColumn(index)}
                        className="ml-auto text-zinc-400 hover:text-red-400 transform-colors duration-200
                            w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-600">
                        <MdOutlineModeEditOutline className="text-2xl cursor-pointer" />
                      </button>

                      <button
                        onClick={() => removeColumn(columns[index].name)}
                        className="text-zinc-400 hover:text-red-400 transform-colors duration-200
                            w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-600">
                        <span className="text-2xl cursor-pointer">x</span>
                      </button>
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
                            hover:scale-105 hover:shadow-lg hover:bg-zinc-600"
                            draggable onDragStart={() => handleDragStart(index, item)}>
                            <span className="mr-2">{item.content}</span>
                            <button
                              onClick={() => console.log("Editing board...")}
                              className="ml-auto text-zinc-400 hover:text-red-400 transform-colors duration-200
                              w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-500">
                              <MdOutlineModeEditOutline className="text-lg cursor-pointer" />
                            </button>
                            <button
                              onClick={() => removeTask(index, item.id)}
                              className="text-zinc-400 hover:text-red-400 transform-colors duration-200
                              w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-500">
                              <span className="text-lg cursor-pointer"> x</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>

      {/* Add column modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-3xl font-bold mb-2 text-yellow-500">Add Column</h1>
          <div className="mb-8 flex flex-col gap-4">
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

            <div className="flex flex-col gap-2">
              <h1 className="text-sm font-medium text-white">Color</h1>
              <div className="grid grid-cols-4 gap-4 justify-items-center ">
                {colors.map((color) => (
                  <button
                    key={color.class}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-12 h-12 rounded-lg transition-all duration-200 hover:scale-110 focus:scale-110 cursor-pointer ${color.class}
                    ${selectedColor === color.name ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110" : ""}
                    `}
                    aria-label={`Select ${color.name} color`}>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add board modal */}
      <Modal isOpen={addBoardModal} onClose={() => setAddBoardModal(false)}>
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-3xl font-bold mb-2 text-yellow-500">Add New Board</h1>
          <div className="flex gap-4">
            <div className="flex flex-col w-full max-w-lg overflow-hidden">
              <div className="flex my-4 mr-2 items-center">
                <h1 className="mr-4 text-center">Board Name</h1>
                <input
                  type="text"
                  value={newBoard}
                  onChange={(e) => setNewBoard(e.target.value)}
                  placeholder="Board Name"
                  className="flex-grow p-3 bg-zinc-700 text-white shadow-lg rounded-lg"
                  onKeyDown={(e) => e.key === "Enter" && addNewBoard()} />
              </div>

              <div className="flex mb-2 mr-2 items-center">
                <h1 className="mr-4 text-center">Number of Columns</h1>
                <input
                  type="number"
                  value={colNum}
                  min={1}
                  onChange={(e) => handleNewBoardColumns(Number(e.target.value))}
                  className="flex-grow p-3 bg-zinc-700 text-white shadow-lg rounded-lg" />
              </div>

              <div className="flex flex-col max-h-45 pt-2 overflow-y-auto">
                {colNames.map((column, index) => (
                  <div className="flex mb-4 mr-2 items-center" key={index}>
                    <h1 className="mr-4 text-center">Column No. {index + 1} Name</h1>
                    <input
                      type="text"
                      value={colNames[index]}
                      onChange={(e) => {
                        const newNames = [...colNames]
                        newNames[index] = e.target.value
                        setColNames(newNames)
                      }}
                      placeholder={`Column No. ${index + 1} Name`}
                      className="flex-grow p-3 bg-zinc-700 text-white shadow-lg rounded-lg mr-2" />

                    <div
                      className={`w-11 h-11 rounded-lg cursor-pointer ${colColors[index]}`}
                      onClick={() => setOpenColPicker(openColPicker === index ? null : index)}>
                      {openColPicker === index &&
                        <div className="absolute bottom-37 right-0 bg-zinc-900 p-2 rounded-lg border-1 border-zinc-800 z-10 grid grid-cols-4 gap-2">
                          {colors.map((color, count) => (
                            <div
                              key={count}
                              onClick={() => {
                                const newColors = [...colColors]
                                newColors[index] = color.class
                                setColColors(newColors)
                              }}
                              className={`w-8 h-8 rounded cursor-pointer ${color.class}
                              ${colColors[index] === color.class ? "ring-2 ring-white ring-offset-1 ring-offset-gray-900 scale-110" : ""}`} />
                          ))}
                        </div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => addNewBoard()}
                  className="py-3 px-4 bg-gradient-to-r from-yellow-600 to-amber-500 text-white 
                  font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
                  duration-200 cursor-pointer rounded-lg">
                  Confirm
                </button>

                <button
                  onClick={() => handleResetNewBoard()}
                  className="py-3 px-4 bg-gradient-to-r from-yellow-600 to-amber-500 text-white 
                  font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
                  duration-200 cursor-pointer rounded-lg ml-2">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit board modal */}
      <Modal isOpen={editBoardModal} onClose={() => setEditBoardModal(false)}>
        <div>

        </div>
      </Modal>

      {/* Edit column modal */}
      <Modal isOpen={editColumnModal} onClose={() => setEditColumnModal(false)}>
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-3xl font-bold mb-2 text-yellow-500">Edit Column</h1>
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
              <input
                type="text"
                value={editColumnName}
                onChange={(e) => setEditColumnName(e.target.value)}
                placeholder="Enter new name..."
                className="flex-grow p-3 bg-zinc-700 text-white"
                onKeyDown={(e) => e.key === "Enter" && editColumn()} />

              <button
                onClick={() => editColumn()}
                className="px-6 bg-gradient-to-r from-yellow-600 to-amber-500 text-white 
                font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
                duration-200 cursor-pointer">
                Confirm
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-sm font-medium text-white">Color</h1>
              <div className="grid grid-cols-4 gap-4 justify-items-center ">
                {colors.map((color) => (
                  <button
                    key={color.class}
                    onClick={() => setSelectedColor(color.from)}
                    className={`w-12 h-12 rounded-lg transition-all duration-200 hover:scale-110 focus:scale-110 cursor-pointer ${color.class}
                    ${selectedColor === color.from ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110" : ""}
                    `}
                    aria-label={`Select ${color.name} color`}>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>

    </main>
  )
}
