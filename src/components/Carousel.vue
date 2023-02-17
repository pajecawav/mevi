<template>
	<div class="fixed inset-0 z-10 bg-black/70">
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
						v-for="file of props.files"
						class="min-w-full h-full object-contain"
						:src="`/media/${file}`"
						:key="file"
					/>
				</TransitionGroup>

				<button
					class="control-btn absolute left-0 top-0 bottom-0 w-1/3 outline-none"
					@click="emit('selectPrev')"
				>
					<img
						class="hidden ml-2 w-12 rotate-180 opacity-30 transition-opacity duration-300 sm:block"
						:src="chevronRight"
					/>
				</button>
				<button
					class="control-btn absolute right-0 top-0 bottom-0 w-1/3 outline-none"
					@click="emit('selectNext')"
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
import { onClickOutside } from "@vueuse/core";
import { onMounted, onUnmounted, ref } from "vue";
import { useCarouselSwipe } from "../composables/useCarouselSwipe";
import chevronRight from "../icons/chevron-right.svg";
import xMarkIcon from "../icons/x-mark.svg";

const props = defineProps<{ files: string[] }>();

const emit = defineEmits(["close", "selectPrev", "selectNext"]);

const carouselRef = ref<HTMLDivElement | null>(null);

onClickOutside(carouselRef, () => emit("close"));

const { offsetX, offsetY, isLeftSwipe } = useCarouselSwipe(carouselRef, {
	onSelectNext: () => emit("selectNext"),
	onSelectPrev: () => emit("selectPrev"),
	onClose: () => emit("close"),
});

function handleKeyPress(e: KeyboardEvent) {
	switch (e.key) {
		case "Escape":
			emit("close");
			break;
		case "ArrowLeft":
			emit("selectPrev");
			break;
		case "ArrowRight":
			emit("selectNext");
			break;
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
