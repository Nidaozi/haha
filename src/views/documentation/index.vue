<template>
  <div class="tab-container">
    
    <el-form :inline="true" :model="searchPath" class="demo-form-inline">
      <el-form-item label="文件名搜索">
        <el-input v-model="searchPath.fileName" placeholder="请输入要搜索的文件名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchByName" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="backHome" icon="el-icon-lock">回到主空间</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="backDirectory" icon="el-icon-back">返回上一级目录</el-button>
      </el-form-item>-->
      <!-- <el-form-item>
        <el-button type="primary" @click="makeDirectory" icon="el-icon-folder-add">创建目录</el-button>
      </el-form-item>-->
      <!-- <el-form-item>
        <! <el-upload
          class="upload-demo"
          ref="upload"
          action="http://localhost:8090/api/hdfs/file/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :data="{targetDirector:searchPath.pathName}"
          :on-success="handleFileSuccess"
          multiple
          :limit="5"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button type="primary" icon="el-icon-upload">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">单文件不超过50MB</div>
      </el-upload>-->
      <!-- </el-form-item> -->
    </el-form>

    <div class="path-table">
      <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column type prop="path" label="地址" width="380"></el-table-column>
        <el-table-column prop="type" label="文件类型" width="180"></el-table-column>
        <el-table-column prop="owner" label="所有者"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <div v-if="tableData[scope.$index].type == '文件夹'">
              <el-button @click="enterDirector(scope.row)" type="text" size="small">进入文件夹</el-button>
            </div>
            <div v-else-if="tableData[scope.$index].type == '文件'">
              <el-button @click="downloadFile(scope.row)" type="text" size="small">下载文件</el-button>
            </div>
            <div>
              <el-button type="text" size="small" @click="delPath(scope.$index,scope.row)">删除</el-button>
            </div>
            <div>
              <el-button type="text" size="small" @click="renameFile(scope.$index,scope.row)">重命名</el-button>
            </div>
            <!-- <div>
              <el-button type="text" size="small" @click="collect(scope.$index,scope.row)">收藏</el-button>
            </div>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
<script>
import {
  resgitryUser,
  makeDirector,
  download,
  delect,
  renameResources,
  collectPath,
  getcollectPath,
  search,
  delectPath,
} from "@/api/hadoop";
import { Message } from "element-ui";
import { getToken } from "../../utils/auth";
export default {
  name: "Tab",
  data() {
    return {
      searchPath: {
        fileName: "",
      },
      tableData: [
        {
          path: "/bar",
          type: "文件夹",
          owner: "nhw",
        },
        {
          path: "/tmp.text",
          type: "文件",
          owner: "root",
        },
      ],
      defaultProps: {
        children: "children",
        label: "/",
      },
      fileList: [],
    };
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`);
    },
  },
  created() {
    let id = getToken();
    getcollectPath({ userId: id }).then((res) => {
      this.setTableData(res.data);
    });
    
  },
  methods: {
    searchByName() {
      let id = getToken();
      search({ userID: id, searchStr: this.searchPath.fileName }).then(
        (res) => {
          this.setTableData(res.data);
        }
      );
    },
    delPath(index, row) {
      let id = getToken();
      console.log( this.tableData[index].path)
      
      delectPath({ userId: id, path: this.tableData[index].path })
        .then((res) => {
          this.tableData.splice(index, 1);

          Message({
            message: "删除成功",
            type: "success",
            duration: 3 * 1000,
          });
        })
        .catch((err) => {
          Message({
            message: "重复删除" | err.data,
            type: "success",
            duration: 3 * 1000,
          });
        });
    },
    backHome() {
      let id = getToken();
      getcollectPath({ userId: id }).then((res) => {
        this.setTableData(res.data);
      });
    },
    collect(index, row) {
      let id = getToken();
      console.log(row);
      collectPath({ userId: id, path: row.path })
        .then(
          Message({
            message: "收藏成功",
            type: "success",
            duration: 3 * 1000,
          })
        )
        .catch((err) => {
          Message({
            message: "收藏失败,重复收藏" | err.data,
            type: "error",
            duration: 3 * 1000,
          });
        });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.type == "文件夹") {
        return "warning-row";
      } else if (row.type == "文件") {
        return "success-row";
      }
      return "";
    },
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1;
    },
    setTableData(data) {
      this.tableData = data;
    },
    
    handleNodeClick(data) {
      console.log(data);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleFileSuccess(file, fileList) {
      this.onSubmit();
      this.$refs.upload.clearFiles();
    },
    handlePreview(file) {
      console.log(file);
    },
    renameFile(index, row) {
      this.$prompt("请输入目录名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(\w+\/?)+$/,
        inputErrorMessage: "目录格式不正确",
      })
        .then(({ value }) => {
          renameResources({
            newFileName: this.searchPath.pathName + "/" + value,
            oldFileName: this.tableData[index].path,
          });
          console.log(this.searchPath.pathName + "/" + value);

          Message({
            message: "成功更改目录名",
            type: "success",
            duration: 3 * 1000,
          });
          if (
            this.searchPath.pathName.lastIndexOf("/") !=
            this.searchPath.pathName.length - 1
          ) {
            this.tableData[index].path = this.searchPath.pathName + "/" + value;
          } else {
            this.tableData[index].path = this.searchPath.pathName + value;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    delectFile(index, row) {
      delect({ pathName: row.path }).then((response) => {
        Message({
          message: "删除成功",
          type: "success",
          duration: 3 * 1000,
        });
        console.log(index);
        this.tableData.splice(index, 1);
      });
    },
    makeDirectory() {
      this.$prompt("请输入目录名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(\w+\/?)+$/,
        inputErrorMessage: "目录格式不正确",
      })
        .then(({ value }) => {
          makeDirector({ director: this.searchPath.pathName + "/" + value });
          console.log(this.searchPath.pathName + "/" + value);

          Message({
            message: "成功创建目录",
            type: "success",
            duration: 3 * 1000,
          });

          this.onSubmit();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      //return this.$confirm(`确定移除 ${file.name}？`);
    },
    downloadFile(row) {
      download({ fileName: row.path }).then((res) => {
        const { data, config } = res;

        let blob = new Blob([data], { type: res.headers["content-type"] });
        console.log(blob);
        let file = config.params.fileName.split("/");
        let fileName = file[file.length - 1];
        console.log(fileName);
        // const fileName = headers["content-disposition"].replace(
        //   /\w+;filename=(.*)/,
        //   "$1"
        // );

        let url = window.URL.createObjectURL(blob);
        console.log(url);
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);

        document.body.removeChild(link);
      });
    },
    backDirectory() {
      let str1 = this.searchPath.pathName;
      if (str1.length > 1 && str1.indexOf("/") >= 0) {
        this.searchPath.pathName = str1.slice(0, str1.lastIndexOf("/"));
      } else {
        Message({
          message: "路径不可返回",
          type: "error",
          duration: 3 * 1000,
        });
      }
      if (this.searchPath.pathName == "") {
        this.searchPath.pathName = "/";
      }
      
    },
    enterDirector(row) {
      console.log(row.path);
      
    },
  },
};
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
