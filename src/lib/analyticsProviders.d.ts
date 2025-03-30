import { AnalyticsProps } from '../types/analytics'
export declare function initGA(): void
export declare function initMetaPixel(): void
export declare function initPostHog(): void
export declare function captureEvent(name: string, properties?: AnalyticsProps): void
export declare function identifyUser(userId: string, props?: AnalyticsProps): void
export declare function initAnalytics(): void
