<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">經典法式甜點</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link class="nav-link" to="/">首頁</router-link>
          <router-link class="nav-link" aria-current="page" to="/products"
            >產品列表</router-link
          >
          <router-link class="nav-link" to="/cart">購物車</router-link>
          <router-link class="nav-link" to="/admin">後台管理</router-link>
        </div>
      </div>
      <button type="button" class="btn btn-primary">
        結帳去
        <span class="badge rounded-pill bg-danger">{{
          cartData.carts.length
        }}</span>
      </button>
    </div>
  </nav>
</template>

<script>
import emitter from "@/libraries/emitter";
export default {
  data() {
    return {
      cartData: {
        // 定義 carts
        carts: [],
      },
    };
  },

  methods: {
    // 取得購物車列表
    getCartList() {
      this.$http
        .get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`)
        .then((res) => {
          console.log(res);
          this.cartData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  mounted() {
    this.getCartList();
    // 監聽點擊加入購物車，更新購物車的數字
    emitter.on("get-cart", () => {
      this.getCartList();
    });
  },
};
</script>
