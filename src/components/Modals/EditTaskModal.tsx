import Modal from "./modal"
import { colors, Action, AppState } from "@/utilities/exports"

interface EditTaskProps {
  isOpen: boolean,
  inputValue: string,
  dispatch: (action: Action) => void
}

export default function EditTask(
  { isOpen, inputValue, dispatch }: EditTaskProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => dispatch({ type: 'TOGGLE_MODAL', payload: { modal: 'editTask', isOpen: false } })}>
      <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-2 text-yellow-500">Edit Task</h1>
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => dispatch({
                type: 'UPDATE_FORM',
                payload: { form: 'editTaskName', value: e.target.value }
              })}
              placeholder="Enter new name..."
              className="flex-grow p-3 bg-zinc-700 text-white"
              onKeyDown={(e) => e.key === "Enter" && dispatch({
                type: 'EDIT_TASK',
              })} />

            <button
              onClick={() => dispatch({
                type: 'EDIT_TASK',
              })}
              className="px-6 bg-gradient-to-r from-yellow-600 to-amber-500 text-white 
                      font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
                      duration-200 cursor-pointer">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}