<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, getTableDataApi } from "@/api/table"
import {
  getExpressCategoryListApi,
  createExpressCategoryApi,
  updateExpressCategoryApi,
  deleteExpressCategoryApi
} from "@/api/expenses"
import { type CreateOrUpdateTableRequestData, type GetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { ExpensesCategory } from "@/api/expenses/type/expenses"
import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// ##region 新增
const DEFAULT_FORM_DATA_CATEGORY: any = {
  CategoryID: undefined,
  CategoryName: "",
  CategoryIcon: "",
  CategoryColor: "",
  CategoryType: 1
}
const dialogVisibleCategory = ref<boolean>(false)
const formRefCategory = ref<FormInstance | null>(null)
const formDataCategory = ref<ExpensesCategory>(cloneDeep(DEFAULT_FORM_DATA_CATEGORY))
const formRulesCategory: FormRules<ExpensesCategory> = {
  CategoryName: [{ required: true, trigger: "blur", message: "请输入分类名称" }],
  CategoryIcon: [{ required: true, trigger: "blur", message: "请输入分类图标" }],
  CategoryColor: [{ required: true, trigger: "blur", message: "请输入分类颜色" }]
}
const handleCreateOrUpdateCategory = () => {
  formRefCategory.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    console.log("formDataCategory", formDataCategory.value)
    loading.value = true
    const api = formDataCategory.value.CategoryID === undefined ? createExpressCategoryApi : updateExpressCategoryApi
    api(formDataCategory.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisibleCategory.value = false
        getExpressCategoryList()
      })
      .finally(() => {
        loading.value = false
      })
  })
}
const resetFormCategory = () => {
  formRefCategory.value?.clearValidate()
  formDataCategory.value = cloneDeep(DEFAULT_FORM_DATA_CATEGORY)
}

//#region 删
const handleDeleteCategory = (row: ExpensesCategory) => {
  ElMessageBox.confirm(`正在删除分类：${row.CategoryName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteExpressCategoryApi(row.CategoryID).then(() => {
      ElMessage.success("删除成功")
      getExpressCategoryList()
    })
  })
}
//#endregion

//#region 改
const handleUpdateCategory = (row: ExpensesCategory) => {
  dialogVisibleCategory.value = true
  formDataCategory.value = cloneDeep(row)
}
//#endregion

//#region 查
const searchFormRef = ref<FormInstance | null>(null)

const searchDataCategory = reactive({
  CategoryType: 1,
  CategoryName: ""
})

const expressCategoryList = ref([])
// 获取记账分类数据
const getExpressCategoryList = () => {
  getExpressCategoryListApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    CategoryType: searchDataCategory.CategoryType,
    CategoryName: searchDataCategory.CategoryName
  })
    .then(({ data }) => {
      expressCategoryList.value = data.data
      paginationData.total = data.total
      console.log("expressCategoryList", expressCategoryList.value)
    })
    .catch(() => {
      expressCategoryList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getExpressCategoryList() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getExpressCategoryList, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchDataCategory">
        <!-- 根据记账分类类型筛选 -->
        <el-form-item label="记账分类">
          <el-select v-model="searchDataCategory.CategoryType" placeholder="请选择" style="width: 200px">
            <el-option label="支出" :value="1" />
            <el-option label="收入" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="CategoryName" label="记账分类名">
          <el-input v-model="searchDataCategory.CategoryName" placeholder="请输入" />
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisibleCategory = true">新增分类</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getExpressCategoryList" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="expressCategoryList">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="CategoryName" label="分类名称" align="center" />
          <el-table-column prop="CategoryType" label="分类类型" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.type === 1" type="warning" effect="plain">支出</el-tag>
              <el-tag v-else type="success" effect="plain">收入</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="CategoryIcon" label="分类图标" align="center">
            <!-- <template #default="scope">
                            <el-icon>
                                <component :is="scope.row.CategoryIcon"></component>
                            </el-icon>
                        </template> -->
          </el-table-column>
          <el-table-column prop="CategoryColor" label="分类颜色" align="center">
            <template #default="scope">
              <el-tag :color="scope.row.CategoryColor" effect="dark">
                {{ scope.row.CategoryColor }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdateCategory(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDeleteCategory(scope.row)">删除</el-button>
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
    <!-- 新增/修改分类 -->
    <el-dialog
      v-model="dialogVisibleCategory"
      :title="formDataCategory.id === undefined ? '新增分类' : '修改分类'"
      @closed="resetFormCategory"
      width="30%"
    >
      <el-form
        ref="formRefCategory"
        :model="formDataCategory"
        :rules="formRulesCategory"
        label-width="100px"
        label-position="left"
      >
        <!-- 分类类型：0支出，1收入 -->
        <el-form-item prop="CategoryType" label="分类类型">
          <el-radio-group v-model="formDataCategory.CategoryType">
            <el-radio :value="1">支出</el-radio>
            <el-radio :value="2">收入</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="CategoryName" label="分类名">
          <el-input v-model="formDataCategory.CategoryName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="CategoryIcon" label="图标">
          <el-input v-model="formDataCategory.CategoryIcon" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="CategoryColor" label="颜色">
          <el-input v-model="formDataCategory.CategoryColor" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisibleCategory = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdateCategory" :loading="loading">确认</el-button>
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
