export const isEmptyObject = function (obj: object) {
  return (
    !obj || (typeof obj === 'object' && obj.constructor === Object && Object.keys(obj).length === 0)
  )
}
