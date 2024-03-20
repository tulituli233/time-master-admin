export interface GetExpressCategoryListRequestData {
  currentPage: number
  size: number
  CategoryType: number
  CategoryName: string
}

export interface ExpensesCategory {
  CategoryID: number | undefined
  CategoryName: string
  CategoryIcon: string
  CategoryColor: string
  CategoryType: number
}
