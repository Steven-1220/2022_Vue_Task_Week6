<template>
  <div class="container">
    <VueLoading :active="isLoading"></VueLoading>
    <div class="mt-4">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id">
            <td style="width: 200px">
              <div
                style="
                  height: 100px;
                  background-size: cover;
                  background-position: center;
                "
                :style="{ backgroundImage: `url(${item.imageUrl})` }"
              ></div>
            </td>
            <td>{{ item.title }}</td>
            <td>
              <div class="h5" v-if="item.price === item.origin_price">
                {{ item.origin_price }} 元
              </div>
              <div v-else>
                <del class="h6">原價 {{ item.origin_price }} 元</del>
                <div class="h5">現在只要 {{ item.price }} 元</div>
              </div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <router-link
                  :to="`/product/${item.id}`"
                  class="btn btn-outline-secondary"
                  :disabled="loadingState === item.id"
                >
                  查看更多
                </router-link>
                <!-- 當觸發 ajax 的時候，所存取的 id 若與 item.id 相同，則啟用 disabled 狀態 (暫時無法再 click，等可以 click，表示 AJAX 執行完畢)-->
                <button
                  type="button"
                  class="btn btn-warning"
                  @click="addToCart(item.id)"
                  :disabled="loadingState === item.id"
                >
                  <span
                    class="spinner-border spinner-border-sm"
                    v-if="loadingState === item.id"
                  ></span>
                  加到購物車
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import emitter from "@/libraries/emitter";
export default {
  data() {
    return {
      products: [],
      productId: "",
      loadingState: "",
      isLoading: false,
    };
  },

  methods: {
    getProducts() {
      this.isLoading = true;
      this.$http
        .get(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`,
        )
        .then((res) => {
          // console.log(res);
          this.products = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //加入購物車， quantity = 1 預設數量 1
    addToCart(id, quantity = 1) {
      const data = {
        product_id: id,
        qty: quantity,
      };
      this.loadingState = id;
      this.$http
        .post(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`,
          { data },
        )
        .then((res) => {
          console.log(res);
          emitter.emit("get-cart");
          this.loadingState = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  mounted() {
    this.getProducts();
  },
};
</script>
