// components/Stocks/IndicatorValue.tsx
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import React from 'react'

interface IndicatorValueProps {
  value: number | string
  isGood: (val: number) => boolean
  className?: string
}

export const IndicatorValue: React.FC<IndicatorValueProps> = ({
  value,
  isGood,
  className = '',
}) => {
  const parsedValue = parseFloat(value as string)
  if (isNaN(parsedValue)) return null

  const Icon = isGood(parsedValue) ? FaCheckCircle : FaTimesCircle
  const colorClass = isGood(parsedValue) ? 'text-green-500' : 'text-red-500'

  return <Icon className={`${colorClass} inline ml-1 ${className}`} />
}
