<script lang="ts">
	import { Roles, RolesNames, type RoleValues, type User } from 'lib';
	import AdminModal from './AdminModal.svelte';
	import NcSelect from '$lib/components/general/select/NCSelect.svelte';
	import { ApiError } from '$lib/plugins/api';
	import { notification } from '$lib/stores/notifyStore';
	import Button from '../form/Button.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { UsersApi } from '$lib/plugins/api/modules/users';

	let props = $props();

	// const dispatch = createEventDispatcher();
	let usersApi: UsersApi;
	const statusSelectOptions = Object.keys(RolesNames)
		.filter((key) => isNaN(Number(key)))
		.map((status) => {
			return { value: status, label: RolesNames[status as RoleValues] };
		});

	let user: User = props.user;

	let errors: Record<string, string[]> | undefined = undefined;

	onMount(() => {
		usersApi = new UsersApi(fetch);
	});

	async function onSubmit() {
		if (!user) {
			return;
		}

		try {
			const res = await usersApi.updateUser({
				id: user.id,
				role: Roles[user.role]
			});
			notification.success(`Пользователь c id: ${res.id} успешно обновлен!`);
			props.refresh();
		} catch (error) {
			if (error instanceof ApiError) {
				errors = error.body.errors;
				notification.error('Error!');
			}
		}
	}

	async function onDelete(id: number | undefined) {
		if (id === undefined) {
			return;
		}
		try {
			const res = await usersApi.deleteUser({ id });
			props.refresh();
			notification.success(`Пользователь c id: ${res.id} успешно удален!`);
		} catch (error) {
			notification.error('Error!');
		}
	}
</script>

<AdminModal on:close>
	<div class="user">
		<h2 class="user__title">Редактирование пользователя id {user.id}</h2>
		<p class="user__name"><strong>Имя клиента:</strong> {user.firstName || 'не указано'}</p>
		<NcSelect options={statusSelectOptions} bind:value={user.role} />
		<p class="order-details__phone">
			<strong>Телефон:</strong>
			{#if user.phone}
				<a class="link link_dark border-dotted border-b-2 border-black" href="tel:+{+user.phone}">
					{user.phone}
				</a>
			{:else}
				не указан
			{/if}
		</p>
	</div>
	<div class="user__controls">
		<Button on:click={onSubmit} size="medium" primary>Сохранить</Button>
		<Button on:click={() => onDelete(user?.id)} size="medium">Удалить</Button>
	</div>
</AdminModal>

<style lang="postcss">
	.user {
		&__title {
			margin-bottom: 20px;

			font-size: 24px;
			line-height: 115%;
			font-weight: 700;
		}

		&__date {
			margin-bottom: 20px;
			opacity: 0.6;
		}

		&__button {
			display: inline-flex;
			padding: 10px;

			font-size: 12px;
			color: #fff;
			background: #0275ee;
			border-radius: 999px;
			line-height: 10px;
			text-align: center;
		}

		&__controls {
			display: flex;
			justify-content: space-between;
			gap: 30px;
			margin-top: 30px;
		}
	}
</style>
