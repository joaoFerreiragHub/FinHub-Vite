import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import React from 'react'

interface IndicatorValueProps {
  value: number | string
  isGood: (val: number) => boolean
  className?: string
  goodText?: string
  badText?: string
  showText?: boolean
}

export const IndicatorValue: React.FC<IndicatorValueProps> = ({
  value,
  isGood,
  className = '',
  goodText = 'Bom',
  badText = 'Atenção',
  showText = true,
}) => {
  const parsedValue = parseFloat(value as string)
  if (isNaN(parsedValue)) return null

  const good = isGood(parsedValue)
  const Icon = good ? FaCheckCircle : FaTimesCircle
  const colorClass = good ? 'text-green-600' : 'text-red-500'
  const text = good ? goodText : badText

  return (
    <span className={`inline-flex items-center ml-1 ${colorClass} ${className}`}>
      <Icon className="mr-1" />
      {showText && <span className="text-xs font-medium">{text}</span>}
    </span>
  )
}
