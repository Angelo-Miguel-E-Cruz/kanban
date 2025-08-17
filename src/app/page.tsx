"use client"

import { useState } from "react"
import Modal from "../components/Modals/modal"
import { colors, Items, Column, Board } from "../utilities/exports"
import AddColumn from "@/components/Modals/AddColumnModal"
import AddBoard from "@/components/Modals/AddBoardModal"
import EditColumn from "@/components/Modals/EditColumnModal"
import Task from "@/components/Board/Task"
import { MdOutlineModeEditOutline } from "react-icons/md"


export default function Home() {

  // Items and Column Types
  // TODO: 1. Refine and check
  interface DraggedItem {
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
  // TODO: 1. useReducer
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

    const newItem: Items = {
      id: Date.now().toString(),
      content: newTask
    }

    const updatedColumns: Column[] = columns.map((column, index) =>
      index === activeColId
        ? { ...column, items: [...column.items, newItem] }
        : column
    )

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

    const updatedColumns = columns.map((column, index) =>
      index === columnId
        ? { ...column, items: [...column.items, item] }
        : index === sourceColumnId
          ? { ...column, items: column.items.filter((i) => i.id != item.id) }
          : column
    )

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

    const updatedColumns = columns.map((col, index) =>
      index === activeColId ? { ...col, name: editColumnName, from: newFrom, to: newTo } : col
    )

    setColumns(updatedColumns)
    setEditColumnName("")
    setEditColumnModal(false)
  }

  const handleChangeBoard = () => {

    const updatedBoards = boards.map((board, index) =>
      index === activeBoard ? { ...board, columns: columns } : board)

    console.log(updatedBoards)
    setBoards(updatedBoards)
    setActiveBoard(null)
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
                          <Task key={item.id}
                            index={index}
                            item={item}
                            handleDragStart={handleDragStart}
                            removeTask={removeTask} />
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
      <AddColumn
        isOpen={isAddModalOpen}
        selectedColor={selectedColor}
        onClose={setIsAddModalOpen}
        inputValue={newColumn}
        onInputChange={setNewColumn}
        onPress={addNewColumn}
        setColor={setSelectedColor} />

      {/* Add board modal */}
      <AddBoard
        isOpen={addBoardModal}
        onClose={setAddBoardModal}
        inputValue={newBoard}
        onInputChange={setNewBoard}
        onPress={addNewBoard}
        onReset={handleResetNewBoard}
        columnNumber={colNum}
        columnNames={colNames}
        columnColors={colColors}
        openColPicker={openColPicker!}
        setColumnNames={setColNames}
        setColumnColors={setColColors}
        setOpenColPicker={setOpenColPicker}
        handleNewBoardColumns={handleNewBoardColumns} />

      {/* Edit board modal */}
      <Modal isOpen={editBoardModal} onClose={() => setEditBoardModal(false)}>
        <div>

        </div>
      </Modal>

      {/* Edit column modal */}
      <EditColumn
        isOpen={editColumnModal}
        onClose={setEditColumnModal}
        inputValue={editColumnName}
        onInputChange={setEditColumnName}
        onPress={editColumn}
        selectedColor={selectedColor}
        setColor={setSelectedColor} />
    </main>
  )
}
