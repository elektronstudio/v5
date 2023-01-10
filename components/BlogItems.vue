<template>
  <div class="blogItems"><slot /></div>
</template>

<style scoped>
.blogItems {
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
  padding: var(--p-4);
}

@media only screen and (min-width: 600px) {
  .blogItems {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-4);
  }
}

@media only screen and (min-width: 1240px) {
  .blogItems {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
