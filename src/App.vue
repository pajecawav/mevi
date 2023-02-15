<template>
	<Suspense>
		<Root />

		<template #fallback
			><div class="w-screen h-screen grid place-items-center"><Spinner class="w-10" /></div
		></template>
	</Suspense>
</template>

<script setup lang="ts">
import Root from "./components/Root.vue";
import Spinner from "./components/Spinner.vue";
</script>
