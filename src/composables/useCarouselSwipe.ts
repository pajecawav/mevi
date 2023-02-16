import { computed, ref, Ref, watch } from "vue";
import { SwipeDirection, useSwipe } from "@vueuse/core";

const SWIPE_THRESHOLD = 100;

interface UseCarouselSwipeOptions {
	onSelectNext: () => void;
	onSelectPrev: () => void;
	onClose: () => void;
}

export const useCarouselSwipe = (
	carouselRef: Ref<HTMLElement | null | undefined>,
	{ onSelectNext, onSelectPrev, onClose }: UseCarouselSwipeOptions
) => {
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
						onSelectNext();
					}
				} else {
					if (Math.abs(lengthX.value) > SWIPE_THRESHOLD) {
						onSelectPrev();
					}
				}
			} else if (direction.value === "vertical") {
				if (Math.abs(lengthY.value) > SWIPE_THRESHOLD) {
					onClose();
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

	return { direction, isSwiping, offsetX, offsetY };
};
