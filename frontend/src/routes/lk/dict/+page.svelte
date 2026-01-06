<script lang="ts">
	import AiCamera from '$lib/components/ai/AICamera.svelte';
	import Drawer from '$lib/components/ai/Drawer.svelte';
	import Button from '$lib/components/form/Button.svelte';
	import UserModal from '$lib/components/modals/UserModal.svelte';
	import { type FrameData } from '$lib/interfaces/frame-data.interface';
	let liveFrame: Partial<FrameData> = $state({
		face: undefined,
		hands: undefined,
		pose: undefined,
		timestamp: 0
	});
	let { data } = $props();
	let guests = $state(data.guests);
	let playingGuest: { id: number; name: string; data: Partial<FrameData>[] } | undefined =
		$state(undefined);
	let isShowModal = $state(false);
	async function saveGuest(frameData: Partial<FrameData>[], name: string) {
		const res = await fetch('/api/guests', {
			method: 'POST',
			body: JSON.stringify({ name, data: frameData })
		});
		if (res.ok) {
			isShowModal = false;
			guests.push(await res.json());
		}
	}
	async function removeGuest(id: number) {
		const res = await fetch('/api/guests', {
			method: 'DELETE',
			body: JSON.stringify({ id })
		});
		const removedData = await res.json();
		if (removedData.length) {
			const idx = guests.findIndex((i) => i.id === removedData[0].id);
			guests.splice(idx, 1);
		}
	}

	async function getGuestById(id: number) {
		const res = await fetch(`/api/guests/${id}`, {
			method: 'GET'
		});
		playingGuest = await res.json();
	}
</script>

<div class="dict-page">
	<div class="dict-page__bar">
		<h1>Словарь</h1>
		<Button primary on:click={() => (isShowModal = true)}>Добавить</Button>
	</div>
	<div class="dict-page__content">
		{#if isShowModal}
			<UserModal
				close={() => {
					isShowModal = false;
				}}
			>
				<AiCamera height={480} width={640} bind:frame={liveFrame} cb={saveGuest} />
			</UserModal>
		{/if}
		{#if playingGuest}
			<UserModal
				close={() => {
					playingGuest = undefined;
				}}
			>
				<Drawer fps={20} height={480} width={640} frames={playingGuest.data} />
				<div class="dict-page__drawer-title">Наименование жеста: {playingGuest.name}</div>
			</UserModal>
		{/if}
		<div>
			<div class="table-row">
				<span><b>id</b></span>
				<span><b>Наименование</b></span>
			</div>
			{#each guests as guest (guest.id)}
				<div class="table-row">
					<span>{guest.id}</span>
					<span>{guest.name}</span>
					<span
						><button class="icon-btn" onclick={() => getGuestById(guest.id)}
							><img src="/icons/play.svg" alt="play" /></button
						></span
					>
					<span
						><button class="icon-btn" onclick={() => removeGuest(guest.id)}
							><img src="/icons/remove.svg" alt="remove" /></button
						></span
					>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.dict-page {
		display: grid;
		grid-template-rows: auto 1fr;
		gap: 10px;
		height: calc(100vh - 20px);
	}
	.dict-page__bar {
		background: white;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px;
		border: 1px solid var(--color-primary-transparent);
	}
	.dict-page__content {
		background: white;
		border: 1px solid var(--color-primary-transparent);
		padding: 10px;
		border-radius: 10px;
		overflow-y: auto;
	}

	.table-row {
		display: grid;
		grid-template-columns: 50px 1fr auto auto;
		align-items: center;
		gap: 20px;
		border-bottom: 1px solid var(--color-primary-transparent);
		padding: 10px;
	}
	.icon-btn {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: white;
		border: 1px solid var(--color-primary-transparent);
		border-radius: 10px;
	}
	.icon-btn:hover {
		cursor: pointer;
	}
	.dict-page__drawer-title {
		text-align: center;
		margin-top: 10px;
	}
</style>
