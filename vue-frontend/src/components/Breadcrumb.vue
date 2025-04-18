<!-- src/components/Breadcrumb.vue -->
<template>
  <nav class="breadcrumb-wrapper">
    <ol class="breadcrumb-list">
      <li
        v-for="(crumb, index) in computedBreadcrumbs"
        :key="index"
        class="breadcrumb-item"
      >
        <!-- If crumb has a link, use a normal <a>. If you use Vue Router, <router-link> is also fine. -->
        <a v-if="crumb.link" :href="crumb.link">
          {{ crumb.name }}
        </a>
        <span v-else>{{ crumb.name }}</span>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    computedBreadcrumbs() {
      // Fallback if no breadcrumbs are passed in
      return this.breadcrumbs.length
        ? this.breadcrumbs
        : [{ name: "Home", link: "/" }];
    },
  },
};
</script>

<style scoped>
/* Existing example code */
.catalogue-view {
  margin-top: 80px; /* Adjust as needed so the breadcrumb isn't behind a fixed header */
}
.breadcrumb-spacing {
  margin-bottom: 1rem;
  /* margin-top: 1rem; if you want additional top spacing just for the breadcrumb */
}
.products-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  padding: 20px;
  background-color: #f9fafb;
}

@media (max-width: 1600px) {
  .products-container {
    grid-template-columns: repeat(5, 1fr);
  }
}
@media (max-width: 1200px) {
  .products-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 992px) {
  .products-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .products-container {
    grid-template-columns: 1fr;
  }
}

/* ──────────────────────────────────────────────────────────
   NEW BREADCRUMB STYLES (for "Store > Portable Energy" look)
   ────────────────────────────────────────────────────────── */

.breadcrumb-wrapper {
  /* Light background color behind the breadcrumb */
  background-color: #f8f4ed;
  padding: 8px 16px;
}

.breadcrumb-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: inline-block;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.breadcrumb-item {
  display: inline;
  color: #333;
}

/* Insert '>' as the separator between items */
.breadcrumb-item + .breadcrumb-item::before {
  content: '>';
  margin: 0 6px;
  color: #333;
}

/* Breadcrumb links */
.breadcrumb-item a {
  text-decoration: none;
  color: #000; /* black text */
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}
</style>
