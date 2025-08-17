import Modal from "./modal"
import { colors } from "@/utilities/exports"

interface AddColumnProps {
  isOpen: boolean,
  onClose: (value: boolean) => void,
  inputValue: string,
  onInputChange: (text: string) => void
  onPress: () => void,
  onReset: () => void,
  columnNumber: number,
  columnNames: string[],
  columnColors: string[],
  openColPicker: number,
  setColumnNames: (names: string[]) => void,
  setColumnColors: (names: string[]) => void,
  setOpenColPicker: (value: number | null) => void,
  handleNewBoardColumns: (value: number) => void
}

export default function AddBoard(
  { isOpen, onClose, inputValue, onInputChange, onPress, onReset, columnNumber, columnNames, columnColors, openColPicker,
    setColumnNames, setColumnColors, setOpenColPicker, handleNewBoardColumns }: AddColumnProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)}>
      <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-2 text-yellow-500">Add New Board</h1>
        <div className="flex gap-4">
          <div className="flex flex-col w-full max-w-lg overflow-hidden">
            <div className="flex my-4 mr-2 items-center">
              <h1 className="mr-4 text-center">Board Name</h1>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Board Name"
                className="flex-grow p-3 bg-zinc-700 text-white shadow-lg rounded-lg"
                onKeyDown={(e) => e.key === "Enter" && onPress()} />
            </div>

            <div className="flex mb-2 mr-2 items-center">
              <h1 className="mr-4 text-center">Number of Columns</h1>
              <input
                type="number"
                value={columnNumber}
                min={1}
                onChange={(e) => handleNewBoardColumns(Number(e.target.value))}
                className="flex-grow p-3 bg-zinc-700 text-white shadow-lg rounded-lg" />
            </div>

            <div className="flex flex-col max-h-45 pt-2 overflow-y-auto">
              {columnNames.map((_, index) => (
                <div className="flex mb-4 mr-2 items-center" key={index}>
                  <h1 className="mr-4 text-center">Column No. {index + 1} Name</h1>
                  <input
                    type="text"
                    value={columnNames[index]}
                    onChange={(e) => {
                      const newNames = [...columnNames]
                      newNames[index] = e.target.value
                      setColumnNames(newNames)
                    }}
                    placeholder={`Column No. ${index + 1} Name`}
                    className="flex-grow p-3 bg-zinc-700 text-white shadow-lg rounded-lg mr-2" />

                  <div
                    className={`w-11 h-11 rounded-lg cursor-pointer ${columnColors[index]}`}
                    onClick={() => setOpenColPicker(openColPicker === index ? null : index)}>
                    {openColPicker === index &&
                      <div className="absolute bottom-37 right-0 bg-zinc-900 p-2 rounded-lg border-1 border-zinc-800 z-10 grid grid-cols-4 gap-2">
                        {colors.map((color, count) => (
                          <div
                            key={count}
                            onClick={() => {
                              const newColors = [...columnColors]
                              newColors[index] = color.class
                              setColumnColors(newColors)
                            }}
                            className={`w-8 h-8 rounded cursor-pointer ${color.class}
                              ${columnColors[index] === color.class ? "ring-2 ring-white ring-offset-1 ring-offset-gray-900 scale-110" : ""}`} />
                        ))}
                      </div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => onPress()}
                className="py-3 px-4 bg-gradient-to-r from-yellow-600 to-amber-500 text-white 
                  font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
                  duration-200 cursor-pointer rounded-lg">
                Confirm
              </button>

              <button
                onClick={() => onReset()}
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
  )
}