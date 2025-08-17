interface ButtonProps {
  text: string
  action: (...args: any[]) => void
}

export default function Button(
  { text, action }: ButtonProps) {
  return (

    <button
      onClick={() => action(true)}
      className="px-6 rounded-r-lg bg-gradient-to-r  from-yellow-600 to-amber-500 text-white 
              font-medium hover:from-yellow-500 hover:to-amber-500 transition-all
              duration-200 cursor-pointer">
      {text}
    </button>
  )
}