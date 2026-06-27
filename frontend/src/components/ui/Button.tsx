import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
}

export function Button({ variant = 'primary', loading, children, className = '', ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-400 text-black',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700',
    ghost: 'hover:bg-zinc-800 text-zinc-400 hover:text-white',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? 'Carregando...' : children}
    </button>
  )
}
