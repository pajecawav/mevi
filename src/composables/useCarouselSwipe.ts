import { computed, ref, Ref, watch } from "vue";
import { useSwipe } from "@vueuse/core";

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
	const isLeftSwipe = ref<boolean | null>(null);

	const {
		lengthX,
		lengthY,
		isSwiping,
		direction: swipeDirection,
	} = useSwipe(carouselRef, {
		threshold: 25,
		onSwipeStart() {
			isLeftSwipe.value = null;
		},
		onSwipeEnd(e, dir) {
			isLeftSwipe.value = null;

			if (direction.value === "horizontal") {
				if (dir === "left") {
					isLeftSwipe.value = true;
					if (Math.abs(lengthX.value) > SWIPE_THRESHOLD) {
						onSelectNext();
					}
				} else {
					isLeftSwipe.value = false;
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
		} else if (newDirection === "up" || newDirection === "down") {
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

	return { direction, isSwiping, offsetX, offsetY, isLeftSwipe };
};
