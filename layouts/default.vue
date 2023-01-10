<template>
  <main
    class="main"
    :class="{
      indexPage: $route.fullPath === '/',
      isLive: isLive,
      breadCumbs: breadcrumbs.length > 0,
    }"
  >
    <Nav />
    <Breadcrumbs />
    <slot />
    <UserInfo />
    <EWindowBorder />
    <DraggableChat />
  </main>
</template>

<style scoped>
.main {
  /* position: relative; */
  display: flex;
  min-height: 100vh;
  height: 100vh;
  flex-direction: column;
  padding-top: var(--h-9);
}

@media only screen and (max-width: 599px) {
  .main.isLive {
    padding-top: calc(var(--h-9) * 2);
  }
}
@media only screen and (min-width: 600px) {
  .main.breadCumbs {
    padding-top: calc(var(--h-9) + var(--h-6));
  }
}
</style>
