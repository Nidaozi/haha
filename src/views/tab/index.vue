<template>
  <div class="tab-container">
    <el-alert
      :closable="false"
      style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;"
      title="Tab with keep-alive"
      type="success"
    />
    <!-- <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>-->
    <el-form :inline="true" :model="searchPath" class="demo-form-inline">
      <el-form-item label="路径">
        <el-input v-model="searchPath.pathName" placeholder="路径"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="backDirectory" icon="el-icon-back">返回上一级目录</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="makeDirectory" icon="el-icon-folder-add">创建目录</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
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
        </el-upload>
      </el-form-item>
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
              <el-button type="text" size="small" @click="delectFile(scope.$index,scope.row)">删除</el-button>
            </div>
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
import TabPane from "./components/TabPane";

import {
  resgitryUser,
  listDirectory,
  makeDirector,
  download,
  delect,
} from "@/api/hadoop";
import { Message } from "element-ui";
export default {
  name: "Tab",
  components: { TabPane },
  data() {
    return {
      searchPath: {
        pathName: "/",
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
    listDirectory({ pathName: this.searchPath.pathName }).then((response) => {
      this.setTableData(response.data);
    });
  },
  methods: {
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
    onSubmit() {
      listDirectory({ pathName: this.searchPath.pathName }).then((response) => {
        this.setTableData(response.data);
      });
    },
    handleNodeClick(data) {
      console.log(data);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleFileSuccess(file, fileList) {
      console.log(fileList);
      console.log(this.$refs.upload);
      this.$refs.upload.clearFiles();
    },
    handlePreview(file) {
      console.log(file);
    },
    delectFile(index, row) {
      delect({ pathName: row.path }).then((response) => {
        Message({
          message: "删除成功",
          type: "success",
          duration: 5 * 1000,
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
            duration: 5 * 1000,
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
          duration: 5 * 1000,
        });
      }
      if (this.searchPath.pathName == "") {
        this.searchPath.pathName = "/";
      }
      listDirectory({ pathName: this.searchPath.pathName }).then((response) => {
        this.setTableData(response.data);
      });
    },
    enterDirector(row) {
      console.log(row.path);
      listDirectory({ pathName: row.path }).then((response) => {
        console.log(response.data);
        this.setTableData(response.data);
        this.searchPath.pathName = row.path;
        console.log(this.searchPath.pathName);
      });
    },
  },
};
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
