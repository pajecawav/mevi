import { computed, ref } from "vue";

export const useFiles = async () => {
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
		return selectedIndex.value === null
			? null
			: files.value[wrapIndex(selectedIndex.value - 1)];
	});

	const nextFile = computed(() => {
		return selectedIndex.value === null
			? null
			: files.value[wrapIndex(selectedIndex.value + 1)];
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

	return { files, selectedIndex, selectedFile, prevFile, nextFile, selectNext, selectPrev };
};
