<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="Sex">
      <!-- <el-input v-model.trim="user.sex" /> -->
      <template>
      <el-radio v-model="user.sex" label="0">男</el-radio>
      <el-radio v-model="user.sex" label="1">女</el-radio>
      </template>
    </el-form-item>
    <el-form-item label="Descript">
      <el-input v-model.trim="user.descript" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getToken, setToken, removeToken } from "@/utils/auth";
import { getProfile, postProfile } from "@/api/hadoop";

export default {
  data() {
    return {
      user: {
        name: "123",
        email: "",
        sex: 0,
        descript: "",
      },
    };
  },

  created() {
    let id = getToken();
    getProfile({ token: id }).then((res) => {
      console.log(res);
      this.user = res.data;
      this.user.sex = this.user.sex==true?1:0
      console.log(this.user.sex)
    });
  },
  methods: {
    submit() {
      console.log(getToken());
      let id = getToken();
      postProfile({
        token: id,
        name: this.user.name,
        email: this.user.email,
        sex: this.user.sex,
        descript: this.user.descript,
      }).then(this.$message({
        message: "修改成功",
        type: "success",
        duration: 2 * 1000,
      }));
      
    },
  },
};
</script>
