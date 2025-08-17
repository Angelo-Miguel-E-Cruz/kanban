import { MdOutlineModeEditOutline } from "react-icons/md"
import { Items } from "@/utilities/exports"

interface TaskProps {
  index: number,
  item: Items,
  handleDragStart: (columnID: number, item: Items) => void,
  removeTask: (columnID: number, taskID: string) => void
}

export default function Task({ index, item, handleDragStart, removeTask }: TaskProps) {
  return (
    <div
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
  )
}