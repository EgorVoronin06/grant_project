<script lang="ts">
	import Drawer from '$lib/components/ai/Drawer.svelte';
	import AICamera from '$lib/components/ai/AICamera.svelte';
	import { type FrameData } from '$lib/interfaces/frame-data.interface';

	const WIDTH = 640;
	const HEIGHT = 480;

	// Live данные
	let liveFrame: Partial<FrameData> = $state({
		face: undefined,
		hands: undefined,
		pose: undefined,
		timestamp: 0
	});

	// Для воспроизведения записи
	let recordingFrames: FrameData[] = [];
	let playbackFrame: Partial<FrameData> = $state({
		face: undefined,
		hands: undefined,
		pose: undefined,
		timestamp: 0
	});
	let isPlaying = $state(false);
	let currentFrameIndex = $state(0);
	let playbackStartTime = 0;
	let playbackInterval: number | null = null;

	async function loadRecording(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const content = await file.text();
		recordingFrames = JSON.parse(content);
		currentFrameIndex = 0;
		updatePlaybackFrame();
	}

	function togglePlayback() {
		if (isPlaying) {
			stopPlayback();
		} else if (recordingFrames.length > 0) {
			startPlayback();
		}
	}

	function startPlayback() {
		if (recordingFrames.length === 0) return;

		isPlaying = true;
		currentFrameIndex = 0;
		playbackStartTime = performance.now() - recordingFrames[0].timestamp;

		const playFrame = () => {
			const currentTime = performance.now() - playbackStartTime;

			// Находим текущий кадр по временной метке
			while (
				currentFrameIndex < recordingFrames.length - 1 &&
				recordingFrames[currentFrameIndex + 1].timestamp <= currentTime
			) {
				currentFrameIndex++;
			}

			updatePlaybackFrame();

			if (currentFrameIndex < recordingFrames.length - 1) {
				const nextFrameTime = recordingFrames[currentFrameIndex + 1].timestamp;
				const delay = nextFrameTime - currentTime;
				playbackInterval = requestAnimationFrame(playFrame) as unknown as number;
			} else {
				stopPlayback();
			}
		};

		playbackInterval = requestAnimationFrame(playFrame) as unknown as number;
	}

	function stopPlayback() {
		if (playbackInterval) {
			cancelAnimationFrame(playbackInterval);
			playbackInterval = null;
		}
		isPlaying = false;
	}

	function updatePlaybackFrame() {
		if (currentFrameIndex >= 0 && currentFrameIndex < recordingFrames.length) {
			playbackFrame = recordingFrames[currentFrameIndex];
		}
	}

	function handleSeek(e: Event) {
		const value = parseInt((e.target as HTMLInputElement).value);
		currentFrameIndex = Math.min(value, recordingFrames.length - 1);
		updatePlaybackFrame();

		if (isPlaying) {
			stopPlayback();
			startPlayback();
		}
	}
</script>

<div class="wrapper">
	<!-- Live камера и отображение -->
	<div class="view-container">
		<AICamera bind:frame={liveFrame} width={WIDTH} height={HEIGHT} />
		<div class="label">Live View</div>
	</div>

	<div class="view-container">
		<Drawer frame={liveFrame} width={WIDTH} height={HEIGHT} />
		<div class="label">Live Landmarks</div>
	</div>

	<!-- Воспроизведение записи -->
	<div class="view-container">
		<div class="playback-controls">
			<input type="file" accept=".json" on:change={loadRecording} />
			<button on:click={togglePlayback}>
				{isPlaying ? '⏸️ Pause' : '⏵ Play'}
			</button>
			<input
				type="range"
				min="0"
				max={recordingFrames.length > 0 ? recordingFrames.length - 1 : 0}
				bind:value={currentFrameIndex}
				on:input={handleSeek}
				disabled={recordingFrames.length === 0}
			/>
			<span>
				{recordingFrames.length > 0
					? `Frame: ${currentFrameIndex + 1}/${recordingFrames.length}`
					: 'No recording loaded'}
			</span>
		</div>
		<Drawer frame={playbackFrame} width={WIDTH} height={HEIGHT} />
		<div class="label">Recording Playback</div>
	</div>
</div>

<style>
	.wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.view-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.playback-controls {
		display: flex;
		gap: 10px;
		align-items: center;
		flex-wrap: wrap;
		padding: 10px;
		background: #f5f5f5;
		border-radius: 8px;
	}

	.label {
		text-align: center;
		font-weight: bold;
		color: #555;
	}

	button {
		padding: 5px 10px;
		background: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	input[type='range'] {
		flex-grow: 1;
		min-width: 150px;
	}
</style>
