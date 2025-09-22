<script setup>
import { computed } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

const getPageBuilderConfig = computed(() => {
  return pageBuilderStateStore.getPageBuilderConfig
})
</script>

<template>
  <div>
    <div class="pbx-flex pbx-items-center pbx-justify-center">
      <div class="pbx-mr-2">
        <!-- User No image Start-->
        <div
          class="pbx-flex pbx-items-center pbx-myPrimaryTag pbx-whitespace-nowrap pbx-py-0 pbx-gap-2"
          v-if="
            getPageBuilderConfig &&
            getPageBuilderConfig.userForPageBuilder &&
            getPageBuilderConfig.userForPageBuilder.name &&
            (!getPageBuilderConfig.userForPageBuilder.image ||
              (typeof getPageBuilderConfig.userForPageBuilder.image === 'string' &&
                getPageBuilderConfig.userForPageBuilder.image?.length < 2))
          "
        >
          <div
            class="pbx-text-white pbx-rounded-full pbx-bg-myPrimaryBrandColor pbx-flex pbx-justify-center pbx-items-center pbx-text-xs pbx-d pbx-min-d pbx-max-d lg:pbx-w-8 lg:pbx-h-8 lg:pbx-min-w-8 lg:pbx-max-w-8 pbx-w-8 pbx-h-8 pbx-min-w-8 pbx-max-w-8 pbx-font-normal"
          >
            {{
              typeof getPageBuilderConfig.userForPageBuilder.name === 'string' &&
              getPageBuilderConfig.userForPageBuilder.name[0]
            }}
          </div>
          <div
            class="pbx-hidden pbx-text-xs pbx-pl-1 lg:pbx-flex pbx-items-center pbx-font-normal pbx-w-max pbx-break-keep"
          >
            {{
              getPageBuilderConfig.userForPageBuilder.name
                ? getPageBuilderConfig.userForPageBuilder.name.charAt(0).toUpperCase()
                : ''
            }}
          </div>
        </div>

        <!-- User No image End -->

        <!-- User With image Start-->
        <div
          class="pbx-flex pbx-items-center lg:pbx-myPrimaryTag pbx-whitespace-nowrap pbx-py-0 pbx-gap-4 pbx-w-max pbx-h-12 pbx-ml-2"
          v-if="
            getPageBuilderConfig &&
            getPageBuilderConfig.userForPageBuilder &&
            getPageBuilderConfig.userForPageBuilder.name &&
            getPageBuilderConfig.userForPageBuilder.image &&
            typeof getPageBuilderConfig.userForPageBuilder.image === 'string' &&
            getPageBuilderConfig.userForPageBuilder.image.length > 2
          "
        >
          <div
            class="pbx-text-white pbx-flex-shrink-0 pbx-d pbx-w-10 pbx-h-10 pbx-rounded-full pbx-flex pbx-justify-center pbx-items-center pbx-text-xs pbx-rounded-l-full"
          >
            <img
              alt="Avatar"
              :src="`${getPageBuilderConfig.userForPageBuilder.image}`"
              class="pbx-block pbx-inset-0 pbx-object-top pbx-d pbx-min-d pbx-max-d lg:pbx-w-8 lg:pbx-h-8 lg:pbx-min-w-8 lg:pbx-max-w-8 pbx-w-8 pbx-h-8 pbx-min-w-8 pbx-max-w-8 pbx-object-cover pbx-rounded-full"
            />
          </div>
          <div
            class="pbx-hidden pbx-text-xs pbx-pl-1 lg:pbx-flex pbx-items-center pbx-font-normal pbx-w-max pbx-break-keep"
          >
            {{
              getPageBuilderConfig.userForPageBuilder.name
                ? getPageBuilderConfig.userForPageBuilder.name.charAt(0).toUpperCase()
                : ''
            }}
          </div>
        </div>
      </div>

      <!-- User With image End -->
    </div>
  </div>
</template>
