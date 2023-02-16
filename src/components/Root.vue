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
				<img
					v-if="prevFile"
					class="absolute top-0 left-0 w-full h-full object-contain block"
					:class="!isSwiping && 'transition-transform'"
					:style="{ transform: `translateX(calc(-100% - 1rem + ${offsetX}px))` }"
					:src="`/media/${prevFile}`"
					:key="prevFile"
				/>
				<img
					v-if="nextFile"
					class="absolute top-0 left-0 w-full h-full object-contain block"
					:class="!isSwiping && 'transition-transform'"
					:style="{ transform: `translateX(calc(100% + 1rem + ${offsetX}px))` }"
					:src="`/media/${nextFile}`"
					:key="nextFile"
				/>

				<img
					class="w-full h-full object-contain will-change-transform"
					:class="!isSwiping && 'transition-transform'"
					:src="`/media/${selectedFile}`"
					:style="{ transform: `translate(${offsetX}px, ${offsetY}px)` }"
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

function wrapIndex(index: number): number {
	return (index + files.value.length) % files.value.length;
}

const selectedIndex = ref<number | null>(null);
const selectedFile = computed(() =>
	selectedIndex.value === null ? null : files.value[selectedIndex.value] ?? null
);
const prevFile = computed(() => {
	return selectedIndex.value === null ? null : files.value[wrapIndex(selectedIndex.value - 1)];
});
const nextFile = computed(() => {
	return selectedIndex.value === null ? null : files.value[wrapIndex(selectedIndex.value + 1)];
});
function selectPrev() {
	if (selectedIndex.value !== null) {
		selectedIndex.value = wrapIndex(selectedIndex.value - 1);
	}
}
function selectNext() {
	if (selectedIndex.value !== null) {
		selectedIndex.value = wrapIndex(selectedIndex.value + 1);
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
const direction = ref<null | "vertical" | "horizontal">(null);
const {
	lengthX,
	lengthY,
	isSwiping,
	direction: swipeDirection,
} = useSwipe(carouselRef, {
	onSwipeEnd(e, dir) {
		if (direction.value === "horizontal") {
			if (dir === SwipeDirection.LEFT) {
				if (Math.abs(lengthX.value) > SWIPE_THRESHOLD) {
					selectNext();
				}
			} else {
				if (Math.abs(lengthX.value) > SWIPE_THRESHOLD) {
					selectPrev();
				}
			}
		} else if (direction.value === "vertical") {
			if (Math.abs(lengthY.value) > SWIPE_THRESHOLD) {
				closeCarousel();
			}
		}

		direction.value = null;
	},
});
watch([swipeDirection, isSwiping], ([newDirection, newIsSwiping]) => {
	if (!newIsSwiping) {
		direction.value = null;
	} else if (direction.value !== null) {
		return;
	} else if (newDirection === SwipeDirection.UP || newDirection === SwipeDirection.DOWN) {
		direction.value = "vertical";
	} else {
		direction.value = "horizontal";
	}
});
const offsetX = computed(() => {
	return direction.value === "horizontal" ? -lengthX.value : 0;
});
const offsetY = computed(() => {
	return direction.value === "vertical" ? -lengthY.value : 0;
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
