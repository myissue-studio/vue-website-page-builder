<script setup lang="ts">
import type { PageBuilderProduct } from '../../types'
import ProductPickerPanel from '../../Components/PageBuilder/ProductPicker/ProductPickerPanel.vue'
import sampleProducts from '../../data/sample-products.json'

const products = sampleProducts as PageBuilderProduct[]
</script>

<template>
  <ProductPickerPanel :products="products" />
</template>
