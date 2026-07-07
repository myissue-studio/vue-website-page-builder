<script setup lang="ts">
import type { PageBuilderProduct } from '../../types'
import ProductPickerPanel from '../../Components/PageBuilder/ProductPicker/ProductPickerPanel.vue'
import productsArray from '../productsArray.test.json'

const products = productsArray as PageBuilderProduct[]
</script>

<template>
  <ProductPickerPanel :products="products" />
</template>
