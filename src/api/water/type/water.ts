// -- 创建喝水类型
// CREATE TABLE WaterTypes (
//     WaterID INT PRIMARY KEY AUTO_INCREMENT,
//     WaterName VARCHAR(10),
//     WaterTip VARCHAR(255) DEFAULT '',
//     WaterIcon VARCHAR(30),
//     WaterColor VARCHAR(10) DEFAULT '',
//     HydratePercent INT DEFAULT 100
// );
export interface GetWaterTypeListRequestData {
  currentPage: number
  size: number
  WaterName?: string
}

export interface WaterType {
  WaterID: number | undefined
  WaterName: string
  WaterTip: string
  WaterIcon: string
  WaterColor: string
  HydratePercent: number
}
