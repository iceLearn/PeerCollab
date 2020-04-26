
export const validateQty = (val, unit) => {
  val = val.replace('-', '')
  if (val == '' || isNaN(val)) {
    val = ''
  } else {
    if (unit == 'NOS') {
      if (val >= 100000) {
        val = val / 10
      }
      val = Math.floor(val)
    } else {
      if (val >= 100000) {
        val = val / 10
      }
      val = Math.floor(val * 1000) / 1000
    }
  }
  return val
}

export const validatePrice = (val) => {
  val = val.replace('-', '')
  if (val == '' || isNaN(val)) {
    val = ''
  } else {
    if (val >= 100000) {
      val = val / 10
    }
    val = Math.floor(val * 100) / 100
  }
  return val
}
