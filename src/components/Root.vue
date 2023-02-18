<template>
	<div class="max-w-7xl mx-auto p-1 flex flex-col gap-1">
		<div class="flex justify-end">
			<button
				class="w-10 p-[0.3em] rounded-md transition-colors duration-100 hover:bg-gray-200 sm:w-8"
				@click="shuffle"
				title="Shuffle"
			>
				<img :src="shuffleIcon" />
			</button>
		</div>
		<div class="gallery gap-1">
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
import shuffleIcon from "../icons/shuffle.svg";

const { files, visibleFiles, selectFile, selectNext, selectPrev } = await useFiles();

const isScrollLocked = useScrollLock(document.body);
watch(visibleFiles, () => (isScrollLocked.value = visibleFiles.value !== null));

function shuffle() {
	for (let i = files.value.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * i);
		[files.value[i], files.value[j]] = [files.value[j], files.value[i]];
	}
}
</script>

<style scoped>
.gallery {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(clamp(10rem, 20vw, 15rem), 1fr));
}
</style>
