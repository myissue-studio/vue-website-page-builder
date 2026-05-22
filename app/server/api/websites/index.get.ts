export default defineEventHandler(async (_event) => {
  // TODO: replace with real API call
  // const config = useRuntimeConfig(event)
  // return await $fetch(`${config.apiBaseUrl}/websites`, {
  //   headers: { 'X-Api-Key': config.apiSecretKey },
  // })

  return [
    { id: 1, name: 'RubikX Store', domain: 'rubikxstores.com' },
    { id: 2, name: 'RubikX B2B', domain: 'b2b.rubikxstores.com' },
  ]
})
