import { colors, Board } from "./exports"

export function useBoardValidation(newBoardName: string, newColumnNames: string[], existingBoard: Board[]) {
  let validNewBoard = true
  // Check if no new board name
  if (newBoardName.trim() === "") {
    console.log("No board name") // TODO: 1. Make Toast
    validNewBoard = false
  }

  // Check if column of same name already exists
  if (existingBoard.some((board) => board.name === newBoardName)) {
    console.log("Board already exists") // TODO: 1. Change to toast
    validNewBoard = false
  }

  // Check if some column names are empty or just spaces
  if (newColumnNames.some(name => name.trim() === "")) {
    console.log("Column names can not be empty") // TODO: 1. Change to toast
    validNewBoard = false
  }

  return validNewBoard
}

export function useCustomProps(propArray: string[], targetCount: number, propType: string) {
  if (targetCount > propArray.length) {
    return [
      ...propArray,
      ...Array(targetCount - propArray.length).fill(propType === "name" ? "" : colors[0].class)
    ]
  } else {
    return propArray.slice(0, targetCount)
  }
}

