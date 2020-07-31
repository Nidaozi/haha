<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <!-- <div style="position:relative">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">Username : editor</span>
          <span>Password : any</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">Or connect with</el-button>
      </div>-->
      <div>
        <el-button
          :loading="loading"
          type="primary"
          style="width:31.5%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >Login</el-button>

        <el-button
          :loading="loading"
          type="primary"
          style="width:31.5%;margin-bottom:30px;center"
          @click="dialogFormVisible = true"
        >Registry</el-button>
        <el-button
          :loading="loading"
          type="primary"
          style="width:31.5%;margin-bottom:30px;"
          @click="repasswordFormVisible = true"
        >RePassword</el-button>

        <el-dialog title="注册新账号" :visible.sync="dialogFormVisible">
          <el-form :model="registryForm">
            <el-form-item class="haha" label="用户名" :label-width="formLabelWidth">
              <el-input
                class="input1"
                v-model="registryForm.username"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item class="haha" label="密码" :label-width="formLabelWidth">
              <el-input
                class="input1"
                v-model="registryForm.password"
                autocomplete="off"
                placeholder="请输入密码"
                type="password"
              ></el-input>
            </el-form-item>
            <el-form-item class="haha" label="密保问题" :label-width="formLabelWidth">
              <el-input
                class="input1"
                v-model="registryForm.color"
                autocomplete="off"
                placeholder="喜欢什么颜色?"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handRegistry">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="更改密码" :visible.sync="repasswordFormVisible">
          <el-form :model="rePasswordForm"  >
            <el-form-item class="haha" label="用户名" :label-width="formLabelWidth">
              <el-input
                class="input1"
                v-model="rePasswordForm.username"
                autocomplete="off"
                placeholder="用户名"
              ></el-input>
            </el-form-item>
            <el-form-item class="haha" label="密保问题" :label-width="formLabelWidth">
              <el-input
                class="input1"
                v-model="rePasswordForm.color"
                autocomplete="off"
                placeholder="喜欢的颜色"
              ></el-input>
            </el-form-item>
            <el-form-item class="haha" label="新密码" :label-width="formLabelWidth">
              <el-input
                class="input1"
                v-model="rePasswordForm.newpassword"
                autocomplete="off"
                placeholder="旧密码"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="repasswordFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handlePassword">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-form>

    <!-- <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br />
      <br />
      <br />
      <social-sign />
    </el-dialog>-->
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import SocialSign from "./components/SocialSignin";
import { Message } from "element-ui";
import { resgitryUser, rePasswordByColor } from "@/api/hadoop";

export default {
  name: "Login",
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入正确用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      repasswordFormVisible: false,
      loginForm: {
        username: "admin",
        password: 1234567,
      },
      registryForm: {
        username: "",
        password: "",
        color: "",
      },
      rePasswordForm: {
        username: "",
        color: "",
        newpassword: "",
      },
      formLabelWidth: "30%",
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      registryRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },

  methods: {
    handlePassword() {
      rePasswordByColor({
        userName: this.rePasswordForm.username,
        color: this.rePasswordForm.color,
        newPassword: this.rePasswordForm.newpassword,
      })
        .then((res) => {
          Message({
            message: "更改成功",
            type: "success",
            duration: 3 * 1000,
          });
          repasswordFormVisible = false;
        })
        .catch((err) => {
          Message({
            message: "用户名密码错误" | err.data.msg,
            type: "error",
            duration: 3 * 1000,
          });
        });
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handRegistry() {
      // if (
      //   validUsername(this.registryForm.username) &&
      //   this.registryForm.password.length > 6
      // ) {
      //   resgitryUser({
      //     username: this.registryForm.username,
      //     password: this.registryForm.password,
      //     color: this.registryForm.color,
      //   }).then((res) => {
      //     this.dialogFormVisible = false;
      //     Message({
      //       message: "注册成功",
      //       type: "success",
      //       duration: 3 * 1000,
      //     });
      //   });
      // } else {
      //   Message({
      //     message: "用户名或密码格式错误",
      //     type: "error",
      //     duration: 3 * 1000,
      //   });
      // }
      if (
        validUsername(this.registryForm.username) &&
        this.registryForm.password.length > 6
      ) {
        resgitryUser({
          username: this.registryForm.username,
          password: this.registryForm.password,
          color: this.registryForm.color,
        }).then((res) => {
          this.dialogFormVisible = false;
          Message({
            message: "注册成功",
            type: "success",
            duration: 3 * 1000,
          });
        });
      } else if (!validUsername(this.registryForm.username)) {
        Message({
          message: "用户名格式错误错误",
          type: "error",
          duration: 3 * 1000,
        });
      } else if (this.registryForm.password.length <= 6) {
        Message({
          message: "密码必须大于六位",
          type: "error",
          duration: 3 * 1000,
        });
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input:not(.input1) input:not {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input:not(.input1) {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    /*height:600px;*/
    // max-height:calc(50%);
    // max-width:calc(50%);
    width: 40%;
  }
  .el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
  .el-form-item:not(.haha) {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
