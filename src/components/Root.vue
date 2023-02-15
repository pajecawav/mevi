<template>
	<div class="gallery max-w-7xl mx-auto p-1 gap-1">
		<div
			v-for="(file, index) of files"
			class="flex flex-col gap-2 cursor-pointer"
			:key="file"
			@click="selectedIndex = index"
		>
			<div class="aspect-square max-w-full">
				<img
					class="w-full h-full object-cover object-center"
					:src="`/media/${file}`"
					loading="lazy"
				/>
			</div>
			<!-- TODO: make filename toggable -->
			<!-- <span class="text-sm text-center break-all">{{ file }}</span> -->
		</div>
	</div>

	<div class="fixed inset-0 z-10 bg-black/70" v-if="selectedFile">
		<div class="fixed inset-0" @click="selectedIndex = null" />

		<div class="fixed inset-0 flex items-center justify-center sm:inset-x-10 sm:inset-y-20">
			<div
				class="carousel relative w-full h-full aspect-square flex flex-col bg-neutral-800 sm:rounded-xl overflow-hidden"
				@touchstart="handleTouchStart"
				@touchend="handleTouchEnd"
				@touchmove="handleTouchMove"
			>
				<img
					class="w-full h-full object-contain"
					:class="touchOffsetY === 0 && 'transition-transform'"
					:src="`/media/${selectedFile}`"
					:style="{ transform: `translateY(${touchOffsetY}px)` }"
				/>

				<button
					class="control-btn absolute left-0 top-0 bottom-0 w-1/3 outline-none"
					@click="selectPrev"
				>
					<img
						class="ml-2 w-12 rotate-180 opacity-30 transition-opacity duration-300"
						:src="chevronRight"
					/>
				</button>
				<button
					class="control-btn absolute right-0 top-0 bottom-0 w-1/3 outline-none"
					@click="selectNext"
				>
					<img
						class="ml-auto mr-2 w-12 opacity-30 transition-opacity duration-300"
						:src="chevronRight"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import chevronRight from "../icons/chevron-right.svg";

const json: string[] = await fetch("/api/files").then(res => res.json());
const files = ref(json);

const selectedIndex = ref<number | null>(null);
const selectedFile = computed(() =>
	selectedIndex.value === null ? null : files.value?.[selectedIndex.value] ?? null
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

function handleKeyPress(e: KeyboardEvent) {
	if (selectedIndex.value !== null) {
		switch (e.key) {
			case "Escape":
				selectedIndex.value = null;
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

let touchStartY = 0;
let touchStartId: number | null = null;
const touchOffsetY = ref(0);
function handleTouchStart(e: TouchEvent) {
	const touch = e.changedTouches[0];
	touchStartY = touch.clientY;
	touchStartId = touch.identifier;
}
function handleTouchEnd() {
	if (Math.abs(touchOffsetY.value) > 200) {
		selectedIndex.value = null;
	}

	touchStartY = 0;
	touchStartId = null;
	touchOffsetY.value = 0;
}
function handleTouchMove(e: TouchEvent) {
	const touch = e.changedTouches[0];
	if (touch.identifier === touchStartId && e.touches.length === 1) {
		e.preventDefault();
		touchOffsetY.value = touch.clientY - touchStartY;
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
	grid-template-columns: repeat(auto-fill, minmax(clamp(6rem, 15vw, 10rem), 1fr));
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
