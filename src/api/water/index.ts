import { request } from "@/utils/serviceT"
import type * as Water from "./types/water"

/** 获取水类型列表 */
export function getWaterTypeListApi(params: Water.GetWaterTypeListRequestData) {
  return request({
    url: "water/types",
    method: "get",
    params
  })
}

/** 新增水类型 */
export function createWaterTypeApi(data: Water.CreateWaterTypeRequestData) {
  return request({
    url: "water/addType",
    method: "post",
    data
  })
}

/** 修改水类型 */
export function updateWaterTypeApi(data: Water.UpdateWaterTypeRequestData) {
  return request({
    url: "water/updateType",
    method: "post",
    data
  })
}

/** 删除水类型 */
export function deleteWaterTypeApi(WaterID: number) {
  return request({
    url: `water/deleteType/?WaterID=${WaterID}`,
    method: "get"
  })
}
