<script setup lang="ts">
defineProps({
  descriptionArea: {
    Type: Boolean,
    required: true,
    default: true,
  },
  headerArea: {
    Type: Boolean,
    default: true,
  },
})
</script>

<template>
  <!-- chimp start -->
  <div class="pbx-myPrimaryWidthScreenModule">
    <template v-if="headerArea">
      <div class="pbx-myPrimaryContentSection">
        <h2 class="pbx-mySecondaryHeader">
          <slot name="title" />
        </h2>
        <template v-if="descriptionArea === true">
          <p class="pbx-myPrimaryParagraph pbx-font-normal">
            <slot name="description" />
          </p>
        </template>
      </div>
    </template>
    <div class="pbx-myPrimaryContentSection">
      <slot name="content" />
    </div>
  </div>
</template>
