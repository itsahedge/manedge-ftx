export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

// formatter.format(1000) // "$1,000.00"
// formatter.format(10) // "$10.00"