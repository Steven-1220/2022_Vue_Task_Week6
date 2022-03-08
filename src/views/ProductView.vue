<template>
  <h1>單一產品</h1>

  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>{{ product.title }}</span>
        </h5>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-6">
            <img class="img-fluid" :src="product.imageUrl" alt="" />
          </div>
          <div class="col-sm-6">
            <span class="badge bg-primary rounded-pill">{{
              product.category
            }}</span>
            <p>商品描述：{{ product.description }}</p>
            <p>商品內容：{{ product.content }}</p>
            <div class="h5" v-if="product.price == product.origin_price">
              {{ product.origin_price }} 元
            </div>
            <div v-else>
              <del class="h6">原價 {{ product.origin_price }} 元</del>
              <div class="h5">現在只要 {{ product.price }} 元</div>
            </div>

            <div class="input-group mt-auto">
              <input
                type="number"
                class="form-control"
                min="1"
                v-model="quantity"
              />
              <button
                type="button"
                class="btn btn-primary"
                @click="addToCart(product.id)"
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from "@/libraries/emitter";
export default {
  data() {
    return {
      product: {},
      quantity: 1,
    };
  },
  methods: {
    // 取得特定產品資訊
    getProductInfo() {
      // $router -> 方法 ，$route -> 物件
      // console.log(this.$route);
      const id = this.$route.params.id;
      this.$http
        .get(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${id}`,
        )
        .then((res) => {
          console.log(res);
          this.product = res.data.product;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 加入購物車
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
          this.loadingState = "";
          emitter.emit("get-cart");
          // 加入購物車後重置數量
          setTimeout(() => {
            this.quantity = 1;
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getProductInfo();
  },
};
</script>
