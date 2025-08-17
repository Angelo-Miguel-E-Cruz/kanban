import Modal from "./modal"
import { colors } from "@/utilities/exports"

interface AddColumnProps {
  isOpen: boolean,
  selectedColor: string,
  onClose: (value: boolean) => void,
  inputValue: string,
  onInputChange: (text: string) => void
  onPress: () => void,
  setColor: (color: string) => void
}

export default function AddColumn(
  { isOpen, selectedColor, onClose, inputValue, onInputChange, onPress, setColor }: AddColumnProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)}>
      <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-2 text-yellow-500">Add Column</h1>
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Add a new column..."
              className="flex-grow p-3 bg-zinc-700 text-white"
              onKeyDown={(e) => e.key === "Enter" && onPress()} />

            <button
              onClick={() => onPress()}
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
                  onClick={() => setColor(color.name)}
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
  )
}