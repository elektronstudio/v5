<template>
  <Transition appear>
    <nav v-if="breadcrumbs.length" class="Breadcrumbs">
      <template v-for="breadcrumb in breadcrumbs">
        <NuxtLink
          v-if="breadcrumb.link"
          :to="breadcrumb.link"
          class="breadcrumbItem"
        >
          {{ breadcrumb.title }}
        </NuxtLink>
        <span v-else class="breadcrumbItem">
          {{ breadcrumb.title }}
        </span>
      </template>
    </nav>
  </Transition>
</template>

<style scoped>
.Breadcrumbs {
  display: none;
}

@media only screen and (min-width: 600px) {
  .Breadcrumbs {
    position: fixed;
    top: calc(var(--h-9) - 1px);
    display: flex;
    font-size: var(--text-sm);
    background-color: var(--bg);
    transform: none;
    z-index: 10;
  }

  .breadcrumbItem {
    display: inline-flex;
    align-items: center;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--gray-300);
    border: var(--border-DEFAULT) solid var(--gray-500);
    line-height: 1;
    text-transform: uppercase;
    padding: var(--p-1) var(--p-2);
    height: var(--h-6);
    color: var(--gray-500);
  }

  .breadcrumbItem:not(:first-child) {
    margin-left: calc(var(--border-DEFAULT) * -1);
  }

  .breadcrumbItem:last-child {
    color: var(--gray-300);
  }
  .breadcrumbItem:hover {
    border-image: url("/images/bg-texture-xs.gif") 1;
    z-index: 2;
    color: var(--gray-300);
  }
}

.v-enter-active,
.v-leave-active {
  transition: transform 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-100%);
}
</style>
