<template>
  <div class="home">
    <h1>前台頁面</h1>
    <FrontNavbar></FrontNavbar>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src

import FrontNavbar from "@/components/FrontNavbar.vue";
export default {
  components: {
    FrontNavbar,
  },
};
</script>
