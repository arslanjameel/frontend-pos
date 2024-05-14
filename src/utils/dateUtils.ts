import {
  addMonths,
  differenceInDays,
  format,
  isWithinInterval,
  parse,
  parseISO,
  startOfMonth,
} from 'date-fns'

import {
  isTransactionAReceipt,
  isTransactionAReturn,
  isTransactionAnInvoice,
} from './transactionUtils'

export const formatDate = (
  inputValue: string,
  dateFormat = 'dd MMM yyyy',
) => {
  try {
    const parsed = parse(
      inputValue.split('T')[0],
      'yyyy-MM-dd',
      new Date(),
    )
    const formatted = format(parsed, dateFormat)

    return formatted
  } catch (e) {
    return format(
      parse('2000-01-01', 'yyyy-MM-dd', new Date()),
      dateFormat,
    )
  }
}

export const dateToString = (
  date: Date,
  dateFormat = 'dd MMM yyyy',
) => {
  try {
    return format(date, dateFormat)
  } catch (e) {
    return ''
  }
}

export const timeToAMPM = (
  timeString: string,
  timeFormat = 'ha',
) => {
  try {
    const parsedTime = parse(
      timeString,
      'HH:mm:ss',
      new Date(),
    )
    const formattedTime = format(parsedTime, timeFormat)

    return formattedTime
  } catch (e) {
    return ''
  }
}
interface MonthObject {
  value: string
  label: string
}

export const generateArrayOfMonths = (
  transactions: any[],
  dateProperty = 'created_at',
): MonthObject[] => {
  const uniqueMonths: { [key: string]: string } = {}

  const currentMonth = new Date()
  Array.from({ length: 3 }, (_, index) => {
    // {format(addMonths(currentMonth, -index), 'MM-yyyy'),}
    const monthValue = format(
      addMonths(currentMonth, -index),
      'MM-yyyy',
    )
    const monthLabel = format(
      addMonths(currentMonth, -index),
      'MMMM yyyy',
    )

    uniqueMonths[monthValue] = monthLabel
  })

  transactions.forEach(transaction => {
    const transactionDate = new Date(
      transaction[dateProperty],
    )
    const monthValue = format(transactionDate, 'MM-yyyy')
    const monthLabel = format(transactionDate, 'MMMM yyyy')

    uniqueMonths[monthValue] = monthLabel
  })

  return Object.keys(uniqueMonths)
    .map(value => ({
      value,
      label: uniqueMonths[value],
    }))
    .sort((a, b) => {
      return (
        new Date(b.value + '-01').getTime() -
        new Date(a.value + '-01').getTime()
      )
    })
}

export const filterTransactionsByMonthYear = (
  transactions: any[],
  targetMonthYear: string,
  timestampProperty: string,
) => {
  return transactions.filter(transaction => {
    const transactionDate = parseISO(
      transaction[timestampProperty],
    )

    return (
      format(transactionDate, 'MM-yyyy') === targetMonthYear
    )
  })
}

export const divideTransactionsIntoMonths = (
  invoices: any[],
) => {
  const currentDate = new Date()

  const currentMonthTransactions: any[] = []
  const oneMonthOldTransactions: any[] = []
  const twoMonthsOldTransactions: any[] = []
  const threeMonthsOldTransactions: any[] = []
  const fourMonthsOrOlderTransactions: any[] = []

  invoices.forEach(transaction => {
    const transactionDate = new Date(transaction.created_at)

    const startOfCurrentMonth = startOfMonth(currentDate)
    const startOfPreviousMonth = startOfMonth(
      addMonths(currentDate, -1),
    )
    const startOfTwoMonthsAgo = startOfMonth(
      addMonths(currentDate, -2),
    )
    const startOfThreeMonthsAgo = startOfMonth(
      addMonths(currentDate, -3),
    )
    const startOfFourMonthsAgo = startOfMonth(
      addMonths(currentDate, -4),
    )

    if (
      isWithinInterval(transactionDate, {
        start: startOfCurrentMonth,
        end: currentDate,
      })
    ) {
      currentMonthTransactions.push(transaction)
    } else if (
      isWithinInterval(transactionDate, {
        start: startOfPreviousMonth,
        end: startOfCurrentMonth,
      })
    ) {
      oneMonthOldTransactions.push(transaction)
    } else if (
      isWithinInterval(transactionDate, {
        start: startOfTwoMonthsAgo,
        end: startOfPreviousMonth,
      })
    ) {
      twoMonthsOldTransactions.push(transaction)
    } else if (
      isWithinInterval(transactionDate, {
        start: startOfThreeMonthsAgo,
        end: startOfTwoMonthsAgo,
      })
    ) {
      threeMonthsOldTransactions.push(transaction)
    } else if (
      isWithinInterval(transactionDate, {
        start: startOfFourMonthsAgo,
        end: startOfThreeMonthsAgo,
      })
    ) {
      fourMonthsOrOlderTransactions.push(transaction)
    }
  })

  // const getTotal = (transaction: any) => {
  //   let _total = 0
  //   if (isTransactionAnInvoice(transaction)) {
  //     _total = Number(transaction?.transaction?.total)
  //   } else if (isTransactionAReturn(transaction)) {
  //     _total = Number(transaction.total)
  //   } else if (isTransactionAReceipt(transaction)) {
  //     _total = Number(transaction.total)
  //   }

  //   return _total
  // }

  const currentMonthTransactionsTotal =
    currentMonthTransactions.reduce(
      (prev, curr) => prev + (curr.debit - curr.credit),
      0,
    )
  const oneMonthOldTransactionsTotal =
    oneMonthOldTransactions.reduce(
      (prev, curr) => prev + (curr.debit - curr.credit),
      0,
    )
  const twoMonthsOldTransactionsTotal =
    twoMonthsOldTransactions.reduce(
      (prev, curr) => prev + (curr.debit - curr.credit),
      0,
    )
  const threeMonthsOldTransactionsTotal =
    threeMonthsOldTransactions.reduce(
      (prev, curr) => prev + (curr.debit - curr.credit),
      0,
    )
  const fourMonthsOrOlderTransactionsTotal =
    fourMonthsOrOlderTransactions.reduce(
      (prev, curr) => prev + (curr.debit - curr.credit),
      0,
    )

  return [
    {
      label: '4 Months+',
      value: fourMonthsOrOlderTransactionsTotal,
    },
    {
      label: '3 Months',
      value: threeMonthsOldTransactionsTotal,
    },
    {
      label: '2 Months',
      value: twoMonthsOldTransactionsTotal,
    },

    {
      label: '1 Months',
      value: oneMonthOldTransactionsTotal,
    },
    {
      label: 'Current',
      value: currentMonthTransactionsTotal,
    },
    {
      label: 'Total',
      value:
        fourMonthsOrOlderTransactionsTotal +
        threeMonthsOldTransactionsTotal +
        twoMonthsOldTransactionsTotal +
        oneMonthOldTransactionsTotal +
        currentMonthTransactionsTotal,
    },
  ]
}

export const addDebitCreditAvailableColumn = (
  invoices: any[],
) => {
  const _invoices: any[] = []
  let prev = 0

  invoices.forEach(invoice => {
    const debit =
      Number(
        invoice?.transaction?.total || invoice?.total,
      ) || 0
    const credit =
      Number(
        invoice?.transaction?.total || invoice?.total,
      ) - Number(invoice?.transaction?.payable) || 0
    const newAvailable = debit - credit + prev

    prev = newAvailable
    _invoices.push({
      ...invoice,
      debit,
      credit,
      available: newAvailable,
    })
  })

  return _invoices
}

export const addDebitCreditAvailableColumnGeneral = (
  transactions: any[],
) => {
  const _transactions: any[] = []
  let prev = 0

  transactions.forEach(transaction => {
    let debit = 0
    let credit = 0

    if (isTransactionAnInvoice(transaction)) {
      debit = Number(transaction?.transaction?.total)
      credit =
        Number(transaction?.transaction?.total) -
        Number(transaction?.transaction?.payable)
    } else if (isTransactionAReturn(transaction)) {
      debit = Number(transaction.total)
      credit =
        Number(transaction?.total) -
        Number(transaction?.payment_to_customer)
    } else if (isTransactionAReceipt(transaction)) {
      debit = Number(transaction.total)
      credit =
        Number(transaction.total) -
        Number(transaction?.transaction?.payable)
    }

    const newAvailable = debit - credit + prev

    prev = newAvailable
    _transactions.push({
      ...transaction,
      debit,
      credit,
      available: newAvailable,
    })
  })

  return _transactions
}

export const sortByDate = (
  arr: any[],
  columnToSortBy = 'created_at',
  ascending = false, // Default to sorting in descending order
) => {
  try {
    const structuredArr = arr.map(row => ({
      ...row,
      sortColumn: parse(
        row[columnToSortBy].split('T')[0],
        'yyyy-MM-dd',
        new Date(),
      ),
    }))

    console.log(
      structuredArr.sort((a: any, b: any) => {
        const dateA = new Date(a[columnToSortBy]).getTime()
        const dateB = new Date(b[columnToSortBy]).getTime()

        return (dateB as any) - (dateA as any)
      }),
    )

    if (ascending) {
      return structuredArr.sort((a: any, b: any) => {
        const dateA = new Date(a[columnToSortBy]).getTime()
        const dateB = new Date(b[columnToSortBy]).getTime()

        return (dateA as any) - (dateB as any)
      })
    } else {
      return structuredArr.sort((a: any, b: any) => {
        const dateA = new Date(a[columnToSortBy]).getTime()
        const dateB = new Date(b[columnToSortBy]).getTime()

        return (dateB as any) - (dateA as any)
      })
    }
  } catch (e) {
    return arr
  }

  // return [...arr].sort((a, b) => {
  // const dateA = new Date(a[columnToSortBy]).getTime()
  // const dateB = new Date(b[columnToSortBy]).getTime()

  // if (ascending) {
  //   return (dateA as any) - (dateB as any)
  //   } else {
  //     return (dateB as any) - (dateA as any)
  //   }
  // })
}

export const isDateOlderThan30Days = (
  dateString: string,
): boolean => {
  const date = parseISO(dateString)

  const difference = differenceInDays(new Date(), date)

  return difference > 30
}

/**
 *
 * Divide into month1(Current), month2(Current-1), month3(Current-1), month4(Current--) and total
 *
 */

export const divideTransactionsInto3Months = (
  invoices: any[],
) => {
  const currentDate = new Date()

  const currentMonthTransactions: any[] = []
  const oneMonthOldTransactions: any[] = []
  const twoMonthsOldTransactions: any[] = []
  const threeMonthsOrOlderTransactions: any[] = []

  invoices.forEach(transaction => {
    const transactionDate = new Date(transaction.created_at)

    const startOfCurrentMonth = startOfMonth(currentDate)
    const startOfPreviousMonth = startOfMonth(
      addMonths(currentDate, -1),
    )
    const startOfTwoMonthsAgo = startOfMonth(
      addMonths(currentDate, -2),
    )
    const startOfThreeMonthsAgo = startOfMonth(
      addMonths(currentDate, -3),
    )

    if (
      isWithinInterval(transactionDate, {
        start: startOfCurrentMonth,
        end: currentDate,
      })
    ) {
      currentMonthTransactions.push(transaction)
    } else if (
      isWithinInterval(transactionDate, {
        start: startOfPreviousMonth,
        end: startOfCurrentMonth,
      })
    ) {
      oneMonthOldTransactions.push(transaction)
    } else if (
      isWithinInterval(transactionDate, {
        start: startOfTwoMonthsAgo,
        end: startOfPreviousMonth,
      })
    ) {
      twoMonthsOldTransactions.push(transaction)
    } else if (
      isWithinInterval(transactionDate, {
        start: startOfThreeMonthsAgo,
        end: startOfTwoMonthsAgo,
      })
    ) {
      threeMonthsOrOlderTransactions.push(transaction)
    }
  })

  const currentMonthTransactionsTotal =
    currentMonthTransactions.reduce(
      (prev, curr) => prev + (curr.debit - curr.credit),
      0,
    )
  const oneMonthOldTransactionsTotal =
    oneMonthOldTransactions.reduce(
      (prev, curr) => prev + (curr.debit - curr.credit),
      0,
    )
  const twoMonthsOldTransactionsTotal =
    twoMonthsOldTransactions.reduce(
      (prev, curr) => prev + (curr.debit - curr.credit),
      0,
    )
  const threeMonthsOrOlderTransactionsTotal =
    threeMonthsOrOlderTransactions.reduce(
      (prev, curr) => prev + (curr.debit - curr.credit),
      0,
    )

  return {
    month: currentMonthTransactionsTotal,
    month1: oneMonthOldTransactionsTotal,
    month2: twoMonthsOldTransactionsTotal,
    month3: threeMonthsOrOlderTransactionsTotal,
    monthTotal:
      currentMonthTransactionsTotal +
      oneMonthOldTransactionsTotal +
      twoMonthsOldTransactionsTotal +
      threeMonthsOrOlderTransactionsTotal,
  }
}

export const getPreviousMonthName = (diff: number) => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear() % 100

  let month = currentMonth - diff
  let year = currentYear

  if (month < 0) {
    month += 12
    year -= 1
  }

  const monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]

  return `${monthNames[month % 12]} ${year}`
}
