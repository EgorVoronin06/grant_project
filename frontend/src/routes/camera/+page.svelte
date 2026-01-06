<script lang="ts">
	import AICamera from '$lib/components/ai/AICamera.svelte';
	import { type FrameData } from '$lib/interfaces/frame-data.interface';

	let liveFrame: Partial<FrameData> = $state({
		face: undefined,
		hands: undefined,
		pose: undefined,
		timestamp: 0
	});
</script>

<div class="camera-page">
	<AICamera width={640 * 2} height={480 * 2} frame={liveFrame} cb={() => {}} />
</div>

<style>
	.camera-page {
		background: black;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
