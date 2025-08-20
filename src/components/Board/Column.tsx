import { MdOutlineModeEditOutline } from "react-icons/md"
import { Column, Items } from "@/utilities/exports"
import Task from "./Task"

interface ColumnProps {
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>, columnId: number) => void
  column: Column
  handleEditColumn: (columnID: number) => void,
  removeColumn: (columnName: string) => void,
  handleDragStart: (columnID: number, item: Items) => void,
  removeTask: (columnID: number, taskID: number) => void,
  handleEditTask: (columnId: number, taskId: number) => void
}

export default function ColumnComponent(
  { handleDragOver, handleDrop, column, handleEditColumn, removeColumn, handleDragStart, removeTask, handleEditTask }: ColumnProps) {
  return (
    <div
      className="flex flex-col shrink-0 w-80 bg-zinc-800 rounded-lg shadow-xl"
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e, column.id)}>

      <div
        className={`flex p-4 text-white font-bold text-xl rounded-t-md w-full bg-gradient-to-r ${column.from} ${column.to}`}>
        {column.name}
        <span className="ml-2 px-2 py-1 bg-zinc-800 bg-opacity-30 rounded-full text-sm">{column.items.length}</span>

        <button
          onClick={() => handleEditColumn(column.id)}
          className="ml-auto text-zinc-400 hover:text-red-400 transform-colors duration-200
                                w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-600">
          <MdOutlineModeEditOutline className="text-2xl cursor-pointer" />
        </button>

        <button
          onClick={() => removeColumn(column.name)}
          className="text-zinc-400 hover:text-red-400 transform-colors duration-200
                                w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-600">
          <span className="text-2xl cursor-pointer">x</span>
        </button>
      </div>

      <div className="p-3 min-h-64">
        {column.items.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 italic text-sm"> Drop Tasks Here</div>
        ) : (
          column.items.map((item) => (
            <Task key={item.id}
              handleEditTask={handleEditTask}
              index={column.id}
              item={item}
              handleDragStart={handleDragStart}
              removeTask={removeTask} />
          ))
        )}
      </div>
    </div>
  )
}