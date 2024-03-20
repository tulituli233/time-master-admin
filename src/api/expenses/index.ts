import { request } from "@/utils/serviceT"
import type * as Expenses from "./types/expenses"

/** 获取记账分类列表 */
export function getExpressCategoryListApi(params: Expenses.GetExpressCategoryListRequestData) {
  return request({
    url: `expenses/cateList?currentPage=${params.currentPage}&size=${params.size}&CategoryType=${params.CategoryType}&CategoryName=${params.CategoryName}`,
    method: "get"
  })
}

/** 新增记账分类 */
export function createExpressCategoryApi(data: Expenses.ExpensesCategory) {
  return request({
    url: "expenses/addCate",
    method: "post",
    data
  })
}

/** 删除记账 */
export function deleteExpressCategoryApi(CategoryID: number) {
  return request({
    url: `expenses/deleteCate?CategoryID=${CategoryID}`,
    method: "get"
  })
}

/** 修改记账 */
export function updateExpressCategoryApi(data: Expenses.ExpensesCategory) {
  return request({
    url: "expenses/updateCate",
    method: "post",
    data
  })
}
