import { computed, ref } from "vue";

export const useFiles = async () => {
	const json: string[] = await fetch("/api/files").then(res => res.json());
	const files = ref(json);

	function wrapIndex(index: number): number {
		return (index + files.value.length) % files.value.length;
	}

	const selectedIndex = ref<number | null>(null);

	const visibleFiles = computed(() => {
		if (selectedIndex.value === null) return null;
		return [
			files.value[wrapIndex(selectedIndex.value - 1)],
			files.value[wrapIndex(selectedIndex.value)],
			files.value[wrapIndex(selectedIndex.value + 1)],
		];
	});

	function selectFile(index: number | null) {
		selectedIndex.value = index;
	}

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

	return { files, selectedIndex, visibleFiles, selectFile, selectNext, selectPrev };
};
