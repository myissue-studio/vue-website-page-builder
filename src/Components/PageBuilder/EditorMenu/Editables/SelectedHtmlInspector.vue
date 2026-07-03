<script setup lang="ts">
import { computed, ref } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { useTranslations } from '../../../../composables/useTranslations'
import { prettifyHtml } from '../../../../utils/builder/prettify-html'
import type { ComponentObject } from '../../../../types'

const { translate } = useTranslations()

const pageBuilderStateStore = sharedPageBuilderStore

const getElement = computed(() => pageBuilderStateStore.getElement)
const getComponent = computed(() => pageBuilderStateStore.getComponent)
const getComponents = computed(() => pageBuilderStateStore.getComponents)

type ContentTab = 'element' | 'component' | 'components'
const activeTab = ref<ContentTab>('element')

const componentsCount = computed(() => getComponents.value?.length ?? 0)

function formatElementType(element: HTMLElement | null): string {
  if (!element) return '—'
  return element.tagName.toLowerCase()
}

function formatComponentType(component: ComponentObject | null): string {
  if (!component) return '—'
  return 'object'
}

function formatComponentsType(components: ComponentObject[]): string {
  if (!components.length) return translate('array')
  return `${translate('array')} · ${components.length}`
}

const typeRows = computed(() => [
  {
    label: translate('Element type:'),
    value: formatElementType(getElement.value),
    tone: getElement.value ? 'active' : 'muted',
  },
  {
    label: translate('Component type:'),
    value: formatComponentType(getComponent.value),
    tone: getComponent.value ? 'active' : 'muted',
  },
  {
    label: translate('Components:'),
    value: formatComponentsType(getComponents.value),
    tone: componentsCount.value > 0 ? 'active' : 'muted',
  },
])

const elementClasses = computed(() => {
  const element = getElement.value
  if (!element?.classList?.length) return '—'
  return Array.from(element.classList).join(' ')
})

const elementSrc = computed(() => {
  const element = getElement.value
  if (!element || element.tagName !== 'IMG') return null
  return (element as HTMLImageElement).src || '—'
})

function setActiveTab(tab: ContentTab) {
  activeTab.value = tab
}
</script>

<template>
  <div class="pbx-selectedHtmlInspector">
    <p class="pbx-editorSectionDesc">
      {{
        translate(
          'Overview of Selected Element, Component, and Components. This section provides real-time updates based on your HTML selection.',
        )
      }}
    </p>

    <div class="pbx-editorFieldGroup">
      <h4 class="pbx-editorSectionTitle">{{ translate('Types') }}</h4>
      <div class="pbx-inspectorCard">
        <div v-for="row in typeRows" :key="row.label" class="pbx-inspectorRow">
          <span class="pbx-inspectorLabel">{{ row.label }}</span>
          <span
            class="pbx-inspectorBadge"
            :class="row.tone === 'active' ? 'pbx-inspectorBadgeActive' : 'pbx-inspectorBadgeMuted'"
          >
            {{ row.value }}
          </span>
        </div>
      </div>
    </div>

    <div class="pbx-editorFieldGroup">
      <h4 class="pbx-editorSectionTitle">{{ translate('Content') }}</h4>

      <div class="pbx-inspectorTabs" role="tablist" :aria-label="translate('Content')">
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'element'"
          class="pbx-inspectorTab"
          :class="{ 'pbx-inspectorTabActive': activeTab === 'element' }"
          @click="setActiveTab('element')"
        >
          {{ translate('Element') }}
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'component'"
          class="pbx-inspectorTab"
          :class="{ 'pbx-inspectorTabActive': activeTab === 'component' }"
          @click="setActiveTab('component')"
        >
          {{ translate('Component') }}
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'components'"
          class="pbx-inspectorTab"
          :class="{ 'pbx-inspectorTabActive': activeTab === 'components' }"
          @click="setActiveTab('components')"
        >
          {{ translate('Components') }}
        </button>
      </div>

      <div class="pbx-inspectorPanel">
        <div v-if="activeTab === 'element'" role="tabpanel">
          <p v-if="!getElement" class="pbx-inspectorEmpty">
            {{ translate('No Element selected') }}
          </p>
          <template v-else>
            <div class="pbx-inspectorField">
              <span class="pbx-inspectorFieldLabel">{{ translate('Selected HTML:') }}</span>
              <pre class="pbx-inspectorCodeRaw">{{ getElement.outerHTML }}</pre>
            </div>

            <div v-if="elementSrc !== null" class="pbx-inspectorField">
              <span class="pbx-inspectorFieldLabel">{{ translate('Element src:') }}</span>
              <p class="pbx-inspectorValue pbx-inspectorValueBreak">{{ elementSrc }}</p>
            </div>

            <div class="pbx-inspectorField">
              <span class="pbx-inspectorFieldLabel">{{ translate('Element classes:') }}</span>
              <p class="pbx-inspectorValue pbx-inspectorValueBreak">{{ elementClasses }}</p>
            </div>
          </template>
        </div>

        <div v-if="activeTab === 'component'" role="tabpanel">
          <p v-if="!getComponent" class="pbx-inspectorEmpty">
            {{ translate('No Component selected') }}
          </p>
          <template v-else>
            <div class="pbx-inspectorMeta">
              <div class="pbx-inspectorMetaRow">
                <span class="pbx-inspectorFieldLabel">{{ translate('ID:') }}</span>
                <span class="pbx-inspectorValue">{{ getComponent.id ?? '—' }}</span>
              </div>
              <div class="pbx-inspectorMetaRow">
                <span class="pbx-inspectorFieldLabel">{{ translate('Title:') }}</span>
                <span class="pbx-inspectorValue">{{ getComponent.title || '—' }}</span>
              </div>
            </div>

            <div class="pbx-inspectorField">
              <span class="pbx-inspectorFieldLabel">{{ translate('HTML Code:') }}</span>
              <pre
                class="pbx-inspectorCodeRaw"
              ><code class="pbx-font-sans" v-html="prettifyHtml(getComponent.html_code)"></code></pre>
            </div>
          </template>
        </div>

        <div v-if="activeTab === 'components'" role="tabpanel">
          <div
            class="pbx-inspectorComponentsSummary"
            :class="{ 'pbx-inspectorComponentsSummaryEmpty': !componentsCount }"
          >
            <template v-if="componentsCount">
              <span>{{ translate('You have added') }}</span>
              <span :aria-label="`${componentsCount} ${translate('Components')}`">
                {{ componentsCount }}
              </span>
              <span>{{ translate('Components') }}</span>
            </template>
            <template v-else>
              {{ translate('No Components added yet') }}
            </template>
          </div>

          <div v-if="componentsCount" class="pbx-inspectorList">
            <details
              v-for="(component, index) in getComponents"
              :key="String(component.id ?? component.title ?? index)"
              class="pbx-inspectorListItem"
              :open="index === 0"
            >
              <summary class="pbx-inspectorListSummary">
                <span class="pbx-inspectorListIndex">#{{ index + 1 }}</span>
                <span class="pbx-inspectorListTitle">
                  {{ component.title || component.id || translate('Component') }}
                </span>
              </summary>

              <div class="pbx-inspectorListBody">
                <div class="pbx-inspectorMeta">
                  <div class="pbx-inspectorMetaRow">
                    <span class="pbx-inspectorFieldLabel">{{ translate('ID:') }}</span>
                    <span class="pbx-inspectorValue">{{ component.id ?? '—' }}</span>
                  </div>
                  <div class="pbx-inspectorMetaRow">
                    <span class="pbx-inspectorFieldLabel">{{ translate('Title:') }}</span>
                    <span class="pbx-inspectorValue">{{ component.title || '—' }}</span>
                  </div>
                </div>

                <div class="pbx-inspectorField">
                  <span class="pbx-inspectorFieldLabel">{{ translate('HTML Code:') }}</span>
                  <pre
                    class="pbx-inspectorCodeRaw"
                  ><code class="pbx-font-sans" v-html="prettifyHtml(component.html_code)"></code></pre>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
