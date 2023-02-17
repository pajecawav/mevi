<template>
	<div class="gallery max-w-7xl mx-auto p-1 gap-1">
		<button
			v-for="(file, index) of files"
			class="flex flex-col gap-2 cursor-pointer"
			:key="file"
			@click="selectedIndex = index"
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

	<div class="fixed inset-0 z-10 bg-black/70" v-if="selectedFile">
		<div class="fixed inset-0" />

		<button
			class="fixed top-2 right-2 w-8 z-10 hidden sm:block transition-opacity duration-300 opacity-30 hover:opacity-100"
		>
			<img :src="xMarkIcon" />
		</button>

		<div class="fixed inset-0 flex items-center justify-center sm:inset-10">
			<div
				class="carousel relative h-full aspect-square flex flex-col bg-neutral-800/95 sm:rounded-xl overflow-hidden"
				ref="carouselRef"
			>
				<TransitionGroup
					tag="div"
					:name="
						isLeftSwipe === true
							? 'list-left'
							: isLeftSwipe === false
							? 'list-right'
							: undefined
					"
					class="relative w-full h-full flex"
					:style="{
						transform: `translate(calc(-100% + ${offsetX}px), ${offsetY}px)`,
					}"
				>
					<img
						v-if="prevFile"
						class="min-w-full h-full object-contain"
						:src="`/media/${prevFile}`"
						:key="prevFile"
					/>
					<img
						class="min-w-full h-full object-contain"
						:src="`/media/${selectedFile}`"
						:key="selectedFile"
					/>
					<img
						v-if="nextFile"
						class="min-w-full h-full object-contain"
						:src="`/media/${nextFile}`"
						:key="nextFile"
					/>
				</TransitionGroup>

				<button
					class="control-btn absolute left-0 top-0 bottom-0 w-1/3 outline-none"
					@click="selectPrev"
				>
					<img
						class="hidden ml-2 w-12 rotate-180 opacity-30 transition-opacity duration-300 sm:block"
						:src="chevronRight"
					/>
				</button>
				<button
					class="control-btn absolute right-0 top-0 bottom-0 w-1/3 outline-none"
					@click="selectNext"
				>
					<img
						class="hidden ml-auto mr-2 w-12 opacity-30 transition-opacity duration-300 sm:block"
						:src="chevronRight"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onClickOutside, useScrollLock } from "@vueuse/core";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useCarouselSwipe } from "../composables/useCarouselSwipe";
import { useFiles } from "../composables/useFiles";
import chevronRight from "../icons/chevron-right.svg";
import xMarkIcon from "../icons/x-mark.svg";

const { files, selectedIndex, selectedFile, prevFile, nextFile, selectNext, selectPrev } =
	await useFiles();

const isScrollLocked = useScrollLock(document.body);
watch(selectedIndex, () => (isScrollLocked.value = selectedIndex.value !== null));

const carouselRef = ref<HTMLDivElement | null>(null);

onClickOutside(carouselRef, closeCarousel);

const { offsetX, offsetY, isLeftSwipe } = useCarouselSwipe(carouselRef, {
	onSelectNext: selectNext,
	onSelectPrev: selectPrev,
	onClose: closeCarousel,
});

function closeCarousel() {
	selectedIndex.value = null;
}

function handleKeyPress(e: KeyboardEvent) {
	if (selectedIndex.value !== null) {
		switch (e.key) {
			case "Escape":
				closeCarousel();
				break;
			case "ArrowLeft":
				selectPrev();
				break;
			case "ArrowRight":
				selectNext();
				break;
		}
	}
}

onMounted(() => {
	document.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
	document.removeEventListener("keydown", handleKeyPress);
});
</script>

<style scoped>
.gallery {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(clamp(10rem, 20vw, 15rem), 1fr));
}

.carousel .control-btn img {
	opacity: 0;
}

.carousel:hover .control-btn img {
	opacity: 0.3;
}

.carousel .control-btn:hover img {
	opacity: 0.9;
}

.list-left-move,
.list-right-move,
.list-left-enter-active,
.list-right-enter-active,
.list-left-leave-active,
.list-right-leave-active {
	transition: transform 0.15s ease-out;
}

.list-right-leave-to {
	transform: translateX(calc(300%));
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-left-leave-active,
.list-right-leave-active {
	position: absolute;
}
</style>
