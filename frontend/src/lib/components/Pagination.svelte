<script lang="ts">
	import paginate from '$lib/assets/utils/pagination';
	import NCIconSvg from './NCIconSvg.svelte';

	export let currentPage: number = 1;
	export let itemsCount = 5;
	export let linkName = '';
	export let limit: number;
	export let searchQuery: string = '';
	$: maxPage = paginate(itemsCount, limit);
	$: pageArray = Array.from({ length: maxPage }, (_, i) => i + 1);
</script>

{#if maxPage !== 1}
	<ul class="pagination">
		<li>
			<a
				class="pagination__item"
				class:disabled={currentPage === 1}
				href="/{linkName}?page={currentPage - 1}{searchQuery ? `&searchQuery=${searchQuery}` : ''}"
			>
				<NCIconSvg iconId="arrow-left" width={13} height={22} />
			</a>
		</li>
		{#each pageArray as page, idx}
			{#if idx === 0 || idx === maxPage - 1 || (idx >= currentPage - 2 && idx <= currentPage)}
				<!-- {#if (idx > currentPage || idx < currentPage - 2) && idx !== currentPage - 1 && idx != maxPage - 1 && idx != 0}  -->
				<li>
					<a
						class="pagination__item"
						class:pagination__item_active={currentPage === page}
						href="/{linkName}?page={page}{searchQuery ? `&searchQuery=${searchQuery}` : ''}"
					>
						{page}
					</a>
				</li>
			{:else if idx === currentPage - 3 || idx === currentPage + 1}
				<li>...</li>
			{/if}
		{/each}
		<li>
			<a
				class="pagination__item"
				class:disabled={currentPage === maxPage}
				href="/{linkName}?page={currentPage + 1}{searchQuery ? `&searchQuery=${searchQuery}` : ''}"
			>
				<Icon iconId="arrow-right" width={13} height={22} />
			</a>
		</li>
	</ul>
{/if}

<style lang="scss">
	.pagination {
		border-radius: 30px;
		border: 1px solid var(--Gray, #e7e7e7);
		display: flex;
		align-items: center;

		&__item {
			width: 50px;
			height: 50px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--dark);
		}

		&__item_active {
			background-color: var(--primary);
			color: var(--black);
		}
	}
	.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
</style>
