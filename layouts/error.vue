<template>
  <v-app class="flexcenter">
    <h1 class="flex flexcenter flexcol" v-if="error.statusCode === 404">
      {{ pageNotFound }}
      <NuxtLink to="/">Home page</NuxtLink>
    </h1>
    <h1 class="flex flexcenter flexcol" v-else>{{ otherError }}</h1>
  </v-app>
</template>

<script>
export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title
    };
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred"
    };
  }
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
