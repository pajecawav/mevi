<template>
	<div class="gallery max-w-7xl mx-auto p-1 gap-1">
		<button
			v-for="(file, index) of files"
			class="flex flex-col gap-2 cursor-pointer"
			:key="file"
			@click="selectFile(index)"
		>
			<img
				class="object-cover object-center aspect-square"
				:src="`/media/${file}`"
				loading="lazy"
				width="4000"
				height="4000"
			/>
			<!-- TODO: make filename toggable -->
			<!-- <span class="text-sm text-center break-all">{{ file }}</span> -->
		</button>
	</div>

	<Carousel
		v-if="visibleFiles"
		:files="visibleFiles"
		@close="selectFile(null)"
		@select-next="selectNext"
		@select-prev="selectPrev"
	/>
</template>

<script setup lang="ts">
import { useScrollLock } from "@vueuse/core";
import { watch } from "vue";
import { useFiles } from "../composables/useFiles";
import Carousel from "./Carousel.vue";

const { files, visibleFiles, selectFile, selectNext, selectPrev } = await useFiles();

const isScrollLocked = useScrollLock(document.body);
watch(visibleFiles, () => (isScrollLocked.value = visibleFiles.value !== null));
</script>

<style scoped>
.gallery {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(clamp(10rem, 20vw, 15rem), 1fr));
}
</style>
