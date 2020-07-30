<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="Sex">
      <el-input v-model.trim="user.sex" />
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
import { getProfile, resgitryUser } from "@/api/hadoop";

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: "",
          email: "",
          sex: true,
          descript: "",
        };
      },
    },
  },
  created() {
    let id = getToken();
    getProfile({ token: id }).then((res) => {
      console.log(res);
    });
  },
  methods: {
    submit() {
      console.log(getToken());
      this.$message({
        message: "User information has been updated successfully",
        type: "success",
        duration: 5 * 1000,
      });
    },
  },
};
</script>
