<template>
  <div class="container">
    <VueLoading :active="isLoading"></VueLoading>
    <div class="text-end">
      <button
        class="btn btn-outline-danger"
        type="button"
        @click="deleteAllCartItem"
        :disabled="cartData.carts.length === 0"
      >
        清空購物車
      </button>
    </div>
    <!-- <div> 測試用
                    {{ cartData }}
                </div> -->
    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 150px">數量/單位</th>
          <th>單價</th>
        </tr>
      </thead>
      <tbody>
        <!-- 加入 v-if -->
        <template v-if="cartData.carts">
          <tr v-for="item in cartData.carts" :key="item.id">
            <td>
              <!-- 刪除特定購物車產品按鈕 -->
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                :disabled="loadingState === item.id"
                @click="removeCartItem(item.id)"
              >
                x
              </button>
            </td>
            <td>
              {{ item.product.title }}
              <!-- <div class="text-success" v-if="item.coupon">
                                        已套用優惠券
                                    </div> -->
            </td>
            <td>
              <div class="input-group input-group-sm">
                <div class="input-group mb-3">
                  <input
                    min="1"
                    type="number"
                    class="form-control"
                    v-model.number="item.qty"
                    :disabled="loadingState === item.id"
                    @change="updateCartNumber(item)"
                  />

                  <span class="input-group-text" id="basic-addon2">{{
                    item.product.unit
                  }}</span>
                </div>
              </div>
            </td>
            <td class="text-end">
              <small class="text-success" v-if="item.final_total !== item.total"
                >折扣價：</small
              >
              {{ item.product.price }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-end">總計</td>
          <td class="text-end">{{ cartData.total }}</td>
        </tr>
        <tr v-if="cartData.final_total !== cartData.total">
          <td colspan="3" class="text-end text-success">折扣價</td>
          <td class="text-end text-success">
            {{ cartData.final_total }}
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- 訂單資訊 -->
    <div class="my-5 row justify-content-center">
      <VForm ref="form" class="col-md-6" v-slot="{ errors }">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <VField
            id="email"
            name="email"
            type="email"
            class="form-control"
            rules="email|required"
            :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email"
            v-model="form.user.email"
          ></VField>
          <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <VField
            id="name"
            name="姓名"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入姓名"
            rules="required"
            v-model="form.user.name"
          ></VField>
          <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <VField
            id="tel"
            name="電話"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['電話'] }"
            placeholder="請輸入電話"
            rules="min:8|max:10|required"
            v-model="form.user.tel"
          ></VField>
          <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <VField
            id="address"
            name="地址"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['地址'] }"
            placeholder="請輸入地址"
            rules="required"
            v-model="form.user.address"
          ></VField>
          <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea
            id="message"
            class="form-control"
            cols="30"
            rows="10"
            v-model="form.message"
          ></textarea>
        </div>
        <div class="text-end">
          <!-- 驗證沒過時或是購物車中沒產品時，無法 click -->
          <button
            type="submit"
            class="btn btn-danger"
            :disabled="
              Object.keys(errors).length > 0 || cartData.carts.length === 0
            "
            @click.prevent="sendOrder"
          >
            送出訂單
          </button>
        </div>
      </VForm>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartData: {
        carts: [],
      },
      loadingState: "",
      isLoading: false,
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },

  methods: {
    // 取得購物車列表
    getCartList() {
      this.isLoading = true;
      this.$http
        .get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`)
        .then((res) => {
          console.log(res);
          this.cartData = res.data.data;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 刪除特定購物車產品
    removeCartItem(id) {
      this.loadingState = id;
      this.$http
        .delete(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${id}`,
        )
        .then((res) => {
          console.log(res);
          // 再取得購物車列表
          this.getCartList();
          this.loadingState = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //清空全部購物車產品
    deleteAllCartItem() {
      this.isLoading = true;
      this.$http
        .delete(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/carts`,
        )
        .then((res) => {
          console.log(res);
          // 再取得購物車列表
          this.getCartList();
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //變更購物車數量
    updateCartNumber(item) {
      // 判斷是否為 0 或是負數
      if (item.qty == 0 || item.qty < 0) {
        alert("數量至少為1個");
        this.getCartList();
        return;
      }
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.loadingState = item.id;
      this.$http
        .put(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${item.id}`,
          { data },
        )
        .then((res) => {
          console.log(res);
          // 再取得購物車列表
          this.getCartList();
          // 清空讀取狀態
          this.loadingState = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //送出訂單
    sendOrder() {
      const order = this.form;
      console.log(order);
      this.$http
        .post(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order`,
          { data: order },
        )
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.form.message = "";
          // 再取得購物車列表
          this.getCartList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  mounted() {
    this.getCartList();
  },
};
</script>
