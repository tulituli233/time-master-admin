<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getWaterTypeListApi, createWaterTypeApi, updateWaterTypeApi, deleteWaterTypeApi } from "@/api/water"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { ExpensesCategory } from "@/api/expenses/type/expenses"
import { WaterType } from "@/api/water/type/water"
import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "Water"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// ##region 新增
const DEFAULT_FORM_DATA_WATER: WaterType = {
  WaterID: undefined,
  WaterName: "",
  WaterTip: "",
  WaterIcon: "",
  WaterColor: "",
  HydratePercent: 100
}
const dialogVisibleWater = ref<boolean>(false)
const formRefWater = ref<FormInstance | null>(null)
const formDataWater = ref<WaterType>(cloneDeep(DEFAULT_FORM_DATA_WATER))
const formRulesWater: FormRules<WaterType> = {
  WaterName: [{ required: true, trigger: "blur", message: "请输入水类型" }],
  WaterIcon: [{ required: true, trigger: "blur", message: "请输入水类型图标" }],
  HydratePercent: [{ required: true, trigger: "blur", message: "请输入含水率" }]
}
const handleCreateOrUpdateWater = () => {
  formRefWater.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    console.log("formDataWater", formDataWater.value)
    loading.value = true
    const api = formDataWater.value.WaterID === undefined ? createWaterTypeApi : updateWaterTypeApi
    api(formDataWater.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisibleWater.value = false
        getWaterTypeList()
      })
      .finally(() => {
        loading.value = false
      })
  })
}
const resetFormWater = () => {
  formRefWater.value?.clearValidate()
  formDataWater.value = cloneDeep(DEFAULT_FORM_DATA_WATER)
}

//#region 删
const handleDeleteWater = (row: WaterType) => {
  ElMessageBox.confirm(`正在删除水类型：${row.WaterName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteWaterTypeApi(row.WaterID).then(() => {
      ElMessage.success("删除成功")
      getWaterTypeList()
    })
  })
}
//#endregion

//#region 改
const handleUpdateWater = (row: WaterType) => {
  dialogVisibleWater.value = true
  formDataWater.value = cloneDeep(row)
}
//#endregion

//#region 查
const searchFormRef = ref<FormInstance | null>(null)
const searchDataWater = reactive({
  WaterName: ""
})

const waterTypeList = ref([])
const getWaterTypeList = () => {
  getWaterTypeListApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    WaterName: searchDataWater.WaterName
  })
    .then(({ data }) => {
      waterTypeList.value = data.data
      paginationData.total = data.total
      console.log("waterTypeList", waterTypeList.value)
    })
    .catch(() => {
      waterTypeList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getWaterTypeList() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getWaterTypeList, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchDataWater">
        <el-form-item prop="WaterName" label="水类型">
          <el-input v-model="searchDataWater.WaterName" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisibleWater = true">新增水类型</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getWaterTypeList" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="waterTypeList">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="WaterName" label="水名称" align="center" />
          <el-table-column prop="WaterIcon" label="水图标" align="center" />
          <el-table-column prop="WaterTip" label="水提示" align="center" />
          <el-table-column prop="HydratePercent" label="含水率" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdateWater(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDeleteWater(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改水类型 -->
    <el-dialog
      v-model="dialogVisibleWater"
      :title="formDataWater.WaterID === undefined ? '新增水类型' : '修改水类型'"
      @closed="resetFormWater"
      width="30%"
    >
      <el-form
        ref="formRefWater"
        :model="formDataWater"
        :rules="formRulesWater"
        label-width="100px"
        label-position="left"
      >
        <el-form-item prop="WaterName" label="水名称">
          <el-input v-model="formDataWater.WaterName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="WaterIcon" label="水图标">
          <el-input v-model="formDataWater.WaterIcon" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="WaterTip" label="水提示">
          <el-input v-model="formDataWater.WaterTip" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="HydratePercent" label="含水率">
          <el-input v-model="formDataWater.HydratePercent" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisibleWater = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdateWater" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
@/api/expenses
