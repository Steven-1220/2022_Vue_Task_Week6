<template>
  <h1>後台管理</h1>
  <div id="nav">
    <router-link to="/">回到前台</router-link> |
    <router-link to="/admin/products">後台產品列表</router-link> |
    <router-link to="/admin/orders">後台訂單</router-link> |
    <router-link to="/admin/coupon">後台優惠券 |</router-link>
    <a href="#" @click.prevent="logOut">登出</a>
  </div>
  <router-view v-if="checkSuccess"></router-view>
</template>

<script>
// 驗證可以寫在 Dashboard 統一管理，並由 router-view 控制切換呈現的內容
export default {
  data() {
    return {
      checkSuccess: false,
    };
  },
  methods: {
    checkLogin() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      if (token) {
        this.$http.defaults.headers.common.Authorization = token;

        const api = `${process.env.VUE_APP_API}/api/user/check`;
        this.$http
          .post(api)
          .then(() => {
            // 驗證成功代表 token 沒過期
            this.checkSuccess = true;
          })
          .catch((err) => {
            alert(err.data.message);
            this.$router.push("/login");
          });
      } else {
        alert("您尚未登入。");
        this.$router.push("/login");
      }
    },
    logOut() {
      document.cookie = "myToken=;expires=;";
      alert("已登出");
      this.$router.push("/login");
    },
  },
  mounted() {
    this.checkLogin();
  },
};
</script>
