import type { InjectionKey } from 'vue'
import type { PageBuilderService } from './services/PageBuilderService'
export const pageBuilderServiceKey: InjectionKey<PageBuilderService> = Symbol('PageBuilderService')
