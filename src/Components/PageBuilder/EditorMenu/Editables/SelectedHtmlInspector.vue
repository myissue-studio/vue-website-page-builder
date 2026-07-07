<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { useTranslations } from '../../../../composables/useTranslations'
import { useHtmlCodeViewer } from '../../../../composables/useHtmlCodeViewer'
import { useHtmlCodeEditor } from '../../../../composables/useHtmlCodeEditor'
import { extractClassesFromHtml } from '../../../../utils/builder/extract-classes-from-html'
import type { ComponentObject } from '../../../../types'
import InspectorIdValue from './InspectorIdValue.vue'
import HtmlActionButton from './HtmlActionButton.vue'
import ClassTagsList from './ClassTagsList.vue'

const { translate } = useTranslations()
const { openHtmlViewer } = useHtmlCodeViewer()
const { openHtmlEditor } = useHtmlCodeEditor()

const pageBuilderStateStore = sharedPageBuilderStore

const getElement = computed(() => pageBuilderStateStore.getElement)
const getComponent = computed(() => pageBuilderStateStore.getComponent)
const getComponents = computed(() => pageBuilderStateStore.getComponents)

type ContentTab = 'element' | 'component' | 'components'
const activeTab = ref<ContentTab>('element')

const componentsCount = computed(() => getComponents.value?.length ?? 0)

const componentsListOpen = ref(false)
const openComponentCards = ref<Set<string>>(new Set())

function toggleComponentsList() {
  if (!componentsCount.value) return
  componentsListOpen.value = !componentsListOpen.value
}

function componentCardKey(component: ComponentObject, index: number): string {
  return String(component.id ?? component.title ?? index)
}

function isComponentCardOpen(component: ComponentObject, index: number): boolean {
  return openComponentCards.value.has(componentCardKey(component, index))
}

function toggleComponentCard(component: ComponentObject, index: number) {
  const key = componentCardKey(component, index)
  const next = new Set(openComponentCards.value)

  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }

  openComponentCards.value = next
}

watch(componentsListOpen, (isOpen) => {
  if (!isOpen) {
    openComponentCards.value = new Set()
  }
})

watch(activeTab, (tab) => {
  if (tab !== 'components') {
    componentsListOpen.value = false
    openComponentCards.value = new Set()
  }
})

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

const elementClassList = computed(() => {
  const element = getElement.value
  if (!element?.classList?.length) return []
  return Array.from(element.classList)
})

const componentClassList = computed(() => {
  if (!getComponent.value?.html_code) return []
  return extractClassesFromHtml(getComponent.value.html_code)
})

const elementSrc = computed(() => {
  const element = getElement.value
  if (!element || element.tagName !== 'IMG') return null
  return (element as HTMLImageElement).src || '—'
})

function setActiveTab(tab: ContentTab) {
  activeTab.value = tab
}

function openElementHtmlEditor() {
  if (!getElement.value) return
  openHtmlEditor(translate('Element HTML'), getElement.value.outerHTML, 'element')
}

function openElementHtmlViewer() {
  if (!getElement.value) return
  openHtmlViewer(translate('Element HTML'), getElement.value.outerHTML)
}

function openComponentHtmlViewer(component: ComponentObject, index?: number) {
  const label =
    component.title ||
    (index !== undefined ? `${translate('Component')} #${index + 1}` : translate('Component'))
  openHtmlViewer(`${label} · ${translate('HTML')}`, component.html_code || '')
}

function openSelectedComponentHtmlViewer() {
  if (!getComponent.value) return
  openComponentHtmlViewer(getComponent.value)
}

function getComponentClassList(component: ComponentObject): string[] {
  return extractClassesFromHtml(component.html_code || '')
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
          class="pbx-inspectorTab pbx-font-sans"
          :class="{ 'pbx-inspectorTabActive': activeTab === 'element' }"
          @click="setActiveTab('element')"
        >
          {{ translate('Element') }}
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'component'"
          class="pbx-inspectorTab pbx-font-sans"
          :class="{ 'pbx-inspectorTabActive': activeTab === 'component' }"
          @click="setActiveTab('component')"
        >
          {{ translate('Component') }}
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'components'"
          class="pbx-inspectorTab pbx-font-sans"
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
            <div class="pbx-inspectorMeta pbx-mb-3">
              <div v-if="elementSrc !== null" class="pbx-inspectorMetaRow">
                <span class="pbx-inspectorFieldLabel">{{ translate('Element src:') }}</span>
                <span class="pbx-inspectorValue pbx-inspectorValueBreak">{{ elementSrc }}</span>
              </div>
              <div class="pbx-inspectorMetaRow pbx-inspectorMetaRowStacked">
                <span class="pbx-inspectorFieldLabel">{{ translate('Element classes:') }}</span>
                <ClassTagsList :classes="elementClassList" empty-placeholder />
              </div>
            </div>

            <div class="pbx-inspectorActionStack">
              <HtmlActionButton
                icon="visibility"
                :label="translate('View element HTML')"
                :hint="translate('Preview selected element markup')"
                @click="openElementHtmlViewer"
              />
              <HtmlActionButton
                icon="deployed_code"
                :label="translate('Open element HTML editor')"
                :hint="translate('Edit selected element markup')"
                @click="openElementHtmlEditor"
              />
            </div>
          </template>
        </div>

        <div v-if="activeTab === 'component'" role="tabpanel">
          <p v-if="!getComponent" class="pbx-inspectorEmpty">
            {{ translate('No Component selected') }}
          </p>
          <template v-else>
            <div class="pbx-inspectorMeta pbx-mb-3">
              <div class="pbx-inspectorMetaRow">
                <span class="pbx-inspectorFieldLabel">{{ translate('ID:') }}</span>
                <InspectorIdValue :value="getComponent.id" />
              </div>
              <div class="pbx-inspectorMetaRow">
                <span class="pbx-inspectorFieldLabel">{{ translate('Title:') }}</span>
                <span class="pbx-inspectorValue">{{ getComponent.title || '—' }}</span>
              </div>
              <div class="pbx-inspectorMetaRow pbx-inspectorMetaRowStacked">
                <span class="pbx-inspectorFieldLabel">{{ translate('Component classes:') }}</span>
                <ClassTagsList :classes="componentClassList" empty-placeholder />
              </div>
            </div>

            <HtmlActionButton
              icon="visibility"
              :label="translate('View component HTML')"
              :hint="translate('Preview component markup')"
              @click="openSelectedComponentHtmlViewer"
            />
          </template>
        </div>

        <div v-if="activeTab === 'components'" role="tabpanel">
          <button
            v-if="componentsCount"
            type="button"
            class="pbx-font-sans pbx-inspectorComponentsSummary pbx-inspectorComponentsSummaryToggle"
            :class="{ 'pbx-inspectorComponentsSummaryOpen': componentsListOpen }"
            :aria-expanded="componentsListOpen"
            :aria-label="translate('Components')"
            @click="toggleComponentsList"
          >
            <span class="pbx-inspectorComponentsSummaryContent">
              <span>{{ translate('Components') }}</span>
            </span>
            <span
              class="pbx-inspectorComponentsSummaryChevron material-symbols-outlined"
              aria-hidden="true"
            >
              {{ componentsListOpen ? 'expand_less' : 'expand_more' }}
            </span>
          </button>
          <div v-else class="pbx-inspectorComponentsSummary pbx-inspectorComponentsSummaryEmpty">
            {{ translate('No Components added yet') }}
          </div>

          <div v-show="componentsCount && componentsListOpen" class="pbx-inspectorList">
            <article
              v-for="(component, index) in getComponents"
              :key="String(component.id ?? component.title ?? index)"
              class="pbx-inspectorComponentCard"
            >
              <button
                type="button"
                class="pbx-font-sans pbx-inspectorComponentCardToggle"
                :aria-expanded="isComponentCardOpen(component, index)"
                :aria-label="component.title || translate('Component')"
                @click="toggleComponentCard(component, index)"
              >
                <span class="pbx-inspectorComponentCardTitleContent">
                  <span class="pbx-inspectorListIndex">#{{ index + 1 }}</span>
                  <span class="pbx-inspectorListTitle">
                    {{ component.title || translate('Component') }}
                  </span>
                </span>
                <span
                  class="pbx-inspectorComponentsSummaryChevron material-symbols-outlined"
                  aria-hidden="true"
                >
                  {{ isComponentCardOpen(component, index) ? 'expand_less' : 'expand_more' }}
                </span>
              </button>

              <div
                v-show="isComponentCardOpen(component, index)"
                class="pbx-inspectorComponentCardBody"
              >
                <div class="pbx-inspectorMeta pbx-inspectorComponentCardMeta">
                  <div class="pbx-inspectorMetaRow">
                    <span class="pbx-inspectorFieldLabel">{{ translate('ID:') }}</span>
                    <InspectorIdValue :value="component.id" />
                  </div>
                  <div class="pbx-inspectorMetaRow pbx-inspectorMetaRowStacked">
                    <span class="pbx-inspectorFieldLabel">{{
                      translate('Component classes:')
                    }}</span>
                    <ClassTagsList :classes="getComponentClassList(component)" empty-placeholder />
                  </div>
                </div>

                <div class="pbx-inspectorComponentCardFooter">
                  <HtmlActionButton
                    icon="visibility"
                    :label="translate('View component HTML')"
                    :hint="translate('Preview component markup')"
                    @click="openComponentHtmlViewer(component, index)"
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
