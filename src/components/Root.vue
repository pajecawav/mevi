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

	<!-- preload next and previous images in carousel -->
	<img
		v-if="selectedIndex !== null && files[selectedIndex - 1]"
		class="sr-only"
		:src="`/media/${files[selectedIndex - 1]}`"
	/>
	<img
		v-if="selectedIndex !== null && files[selectedIndex + 1]"
		class="sr-only"
		:src="`/media/${files[selectedIndex + 1]}`"
	/>

	<div class="fixed inset-0 z-10 bg-black/70" v-if="selectedFile">
		<div class="fixed inset-0" />

		<button
			class="fixed top-4 right-4 w-10 hidden sm:block transition-opacity duration-300 opacity-30 hover:opacity-100"
		>
			<img :src="xMarkIcon" />
		</button>

		<div class="fixed inset-0 flex items-center justify-center sm:inset-10">
			<div
				class="carousel relative h-full aspect-square flex flex-col bg-neutral-800/95 sm:rounded-xl overflow-hidden"
				ref="carouselRef"
			>
				<img
					class="w-full h-full object-contain will-change-transform"
					:class="!isSwiping && 'transition-transform'"
					:src="`/media/${selectedFile}`"
					:style="{ transform: transform }"
					:key="selectedFile"
				/>

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
import { onClickOutside, SwipeDirection, useScrollLock, useSwipe } from "@vueuse/core";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import chevronRight from "../icons/chevron-right.svg";
import xMarkIcon from "../icons/x-mark.svg";

const json: string[] = await fetch("/api/files").then(res => res.json());
const files = ref(json);

const selectedIndex = ref<number | null>(null);
const selectedFile = computed(() =>
	selectedIndex.value === null ? null : files.value[selectedIndex.value] ?? null
);
function selectPrev() {
	if (selectedIndex.value !== null) {
		selectedIndex.value = (selectedIndex.value - 1 + files.value.length) % files.value.length;
	}
}
function selectNext() {
	if (selectedIndex.value !== null) {
		selectedIndex.value = (selectedIndex.value + 1) % files.value.length;
	}
}

const isScrollLocked = useScrollLock(document.body);
watch(selectedIndex, () => (isScrollLocked.value = selectedIndex.value !== null));

const carouselRef = ref<HTMLDivElement | null>(null);

function closeCarousel() {
	selectedIndex.value = null;
}

onClickOutside(carouselRef, closeCarousel);

const SWIPE_THRESHOLD = 100;
const { lengthX, lengthY, isSwiping, direction } = useSwipe(carouselRef, {
	onSwipeEnd(e, dir) {
		if (dir === SwipeDirection.LEFT) {
			if (Math.abs(lengthX.value) > SWIPE_THRESHOLD) {
				selectNext();
			}
			return;
		} else if (dir === SwipeDirection.RIGHT) {
			if (Math.abs(lengthX.value) > SWIPE_THRESHOLD) {
				selectPrev();
			}
			return;
		}

		if (Math.abs(lengthY.value) > SWIPE_THRESHOLD) {
			closeCarousel();
		}
	},
});

const transform = computed(() => {
	if (!isSwiping.value) {
		return undefined;
	} else if (direction.value === SwipeDirection.UP || direction.value === SwipeDirection.DOWN) {
		return `translateY(${-lengthY.value}px)`;
	} else {
		return `translateX(${-lengthX.value}px)`;
	}
});

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
</style>
