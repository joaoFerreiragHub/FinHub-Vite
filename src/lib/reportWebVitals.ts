// src/lib/reportWebVitals.ts
import { type Metric, onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

// Na versão mais recente, 'ReportHandler' foi substituído por uma função que recebe 'Metric'
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry)
    onFID(onPerfEntry)
    onFCP(onPerfEntry)
    onLCP(onPerfEntry)
    onTTFB(onPerfEntry)
  }
}
