import { computed, ref, watch, type Ref } from 'vue'

export function usePagination<T>(items: Ref<T[]>, pageSize = 6) {
  const page = ref(1)

  const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)))

  const paginatedItems = computed(() => {
    const start = (page.value - 1) * pageSize
    return items.value.slice(start, start + pageSize)
  })

  watch(items, () => {
    page.value = 1
  })

  function goToPage(target: number) {
    page.value = Math.min(Math.max(1, target), totalPages.value)
  }

  return { page, pageSize, totalPages, paginatedItems, goToPage }
}
