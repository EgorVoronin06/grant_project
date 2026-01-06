<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { notification } from '$lib/stores/notifyStore';
	
	let user = $state<any>(null);
	let profile = $state<any>(null);
	let stats = $state<any>(null);
	let activity = $state<any[]>([]);
	let achievements = $state<any>({});
	let isLoading = $state(true);
	let activeTab = $state('progress');

	onMount(async () => {
		const token = localStorage.getItem('auth_token');
		if (!token) {
			notification.error('Пожалуйста, войдите в систему');
			goto('/login');
			return;
		}

		await loadProfileData();
	});

	async function loadProfileData() {
		isLoading = true;
		try {
			const token = localStorage.getItem('auth_token');
			
			// Загружаем полный профиль
			const profileResponse = await fetch('http://localhost:3001/api/profile', {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const profileData = await profileResponse.json();
			if (profileData.success) {
				profile = profileData.data.user;
				user = profile;
			}
			
			// Загружаем статистику
			const statsResponse = await fetch('http://localhost:3001/api/profile/progress', {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const statsData = await statsResponse.json();
			if (statsData.success) {
				stats = statsData.data;
			}
			
			// Загружаем активность
			const activityResponse = await fetch('http://localhost:3001/api/profile/activity?period=week', {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const activityData = await activityResponse.json();
			if (activityData.success) {
				activity = activityData.data;
			}
			
			// Загружаем достижения
			const achievementsResponse = await fetch('http://localhost:3001/api/profile/achievements', {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const achievementsData = await achievementsResponse.json();
			if (achievementsData.success) {
				achievements = achievementsData.data;
			}
			
		} catch (error) {
			console.error('Error loading profile data:', error);
			notification.error('Ошибка загрузки данных профиля');
		} finally {
			isLoading = false;
		}
	}

	function formatDate(dateString: string) {
		if (!dateString) return '—';
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	const tabs = [
		{ id: 'progress', label: 'Прогресс', icon: '📊' },
		{ id: 'achievements', label: 'Достижения', icon: '🏆' },
		{ id: 'activity', label: 'Активность', icon: '📈' },
		{ id: 'settings', label: 'Настройки', icon: '⚙️' }
	];

	async function handleAvatarUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		if (!file.type.match('image.*')) {
			notification.error('Пожалуйста, выберите изображение');
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			notification.error('Размер файла не должен превышать 5MB');
			return;
		}

		try {
			const formData = new FormData();
			formData.append('avatar', file);
			const token = localStorage.getItem('auth_token');

			const response = await fetch('http://localhost:3001/api/profile/avatar', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body: formData
			});

			const data = await response.json();
			
			if (data.success) {
				if (profile) profile.avatar_url = data.data.avatar_url;
				notification.success('Аватар успешно обновлен');
			} else {
				notification.error(data.error || 'Ошибка загрузки аватара');
			}
		} catch (error) {
			notification.error('Ошибка загрузки аватара');
		}
	}
</script>

<main class="profile-page">
	{#if isLoading}
		<div class="loading">
			<div class="spinner"></div>
			<p>Загрузка данных...</p>
		</div>
	{:else}
		<!-- Информация пользователя -->
		<div class="user-info-section">
			<div class="user-avatar">
				<div class="avatar-container">
					<img
						src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&size=200&background=0077FF&color=fff`}
						alt={profile?.name || 'Пользователь'}
						class="avatar-image"
					/>
					<label class="avatar-upload">
						<input
							type="file"
							accept="image/*"
							on:change={handleAvatarUpload}
						/>
						<span class="upload-icon">📷</span>
					</label>
				</div>
			</div>

			<div class="user-details">
				<h1 class="user-name">{profile?.name || 'Пользователь'}</h1>
				<p class="user-email">{profile?.email}</p>
				
				<div class="user-meta">
					<div class="meta-item">
						<span class="meta-label">Дата регистрации:</span>
						<span class="meta-value">{formatDate(profile?.created_at)}</span>
					</div>
					{#if profile?.phone}
						<div class="meta-item">
							<span class="meta-label">Телефон:</span>
							<span class="meta-value">{profile.phone}</span>
						</div>
					{/if}
					{#if profile?.birth_date}
						<div class="meta-item">
							<span class="meta-label">Дата рождения:</span>
							<span class="meta-value">{formatDate(profile.birth_date)}</span>
						</div>
					{/if}
				</div>
			</div>

			<div class="user-stats">
				<div class="stat-card level">
					<span class="stat-label">Уровень</span>
					<span class="stat-value">{profile?.level || 1}</span>
				</div>
				<div class="stat-card points">
					<span class="stat-label">Очки</span>
					<span class="stat-value">{profile?.total_points || 0}</span>
				</div>
				<div class="stat-card streak">
					<span class="stat-label">Серия</span>
					<span class="stat-value">{profile?.current_streak || 0} дней</span>
				</div>
			</div>
		</div>

		<!-- Панель навигации -->
		<div class="tabs-navigation">
			{#each tabs as tab}
				<button
					class="tab {activeTab === tab.id ? 'active' : ''}"
					on:click={() => activeTab = tab.id}
				>
					<span class="tab-icon">{tab.icon}</span>
					<span class="tab-label">{tab.label}</span>
				</button>
			{/each}
		</div>

		<!-- Основной контент -->
		<div class="profile-content">
			<div class="content-wrapper">
				<!-- Левая колонка -->
				<div class="left-column">
					{#if activeTab === 'progress'}
						<!-- Блок прогресса -->
						<div class="progress-section">
							<h2 class="section-title">
								<span class="title-icon">📊</span>
								Прогресс обучения
							</h2>
							
							<div class="overall-progress">
								<div class="progress-header">
									<span class="progress-label">Общий прогресс</span>
									<span class="progress-percent">
										{#if stats?.total_courses > 0}
											{Math.round((stats.total_lessons_completed / stats.total_courses) * 100)}%
										{:else}
											0%
										{/if}
									</span>
								</div>
								<div class="progress-bar">
									<div
										class="progress-fill"
										style={`width: ${stats?.total_courses > 0 ? Math.min((stats.total_lessons_completed / stats.total_courses) * 100, 100) : 0}%`}
									></div>
								</div>
							</div>

							<!-- Карточки прогресса -->
							{#if stats?.courses && stats.courses.length > 0}
								<div class="progress-cards">
									{#each stats.courses.slice(0, 4) as course}
										<div class="progress-card">
											<div class="card-image">
												{#if course.image_url}
													<img src={course.image_url} alt={course.title} />
												{:else}
													<div class="image-placeholder">
														<span>{course.title.charAt(0)}</span>
													</div>
												{/if}
											</div>
											<div class="card-title">{course.title}</div>
											<div class="card-progress">
												<div class="progress-text">
													<span>Прогресс:</span>
													<span>
														{Math.round((course.completed_lessons / course.total_lessons) * 100)}%
													</span>
												</div>
												<div class="progress-bar">
													<div
														class="progress-fill"
														style={`width: ${(course.completed_lessons / course.total_lessons) * 100}%`}
													></div>
												</div>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>

					{:else if activeTab === 'achievements'}
						<div class="achievements-section">
							<h2 class="section-title">
								<span class="title-icon">🏆</span>
								Достижения
							</h2>
							{#if achievements.earned && achievements.earned.length > 0}
								<div class="achievements-grid">
									{#each achievements.earned as achievement}
										<div class="achievement-card earned">
											<span class="achievement-icon">{achievement.icon || '🏆'}</span>
											<h3>{achievement.title}</h3>
											<p>{achievement.description}</p>
										</div>
									{/each}
								</div>
							{:else}
								<div class="empty-state">
									<p>Достижения отсутствуют</p>
								</div>
							{/if}
						</div>

					{:else if activeTab === 'activity'}
						<div class="activity-section">
							<h2 class="section-title">
								<span class="title-icon">📈</span>
								Активность
							</h2>
							{#if activity.length > 0}
								<div class="activity-chart">
									<div class="chart-bars">
										{#each activity.slice(0, 7) as day}
											<div class="chart-bar" style={`height: ${Math.min((day.practice_time || 0) * 2, 100)}%`}>
												<div class="bar-tooltip">
													<div>{new Date(day.activity_date).toLocaleDateString('ru-RU', { weekday: 'short' })}</div>
													<div>{day.practice_time || 0} мин</div>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{:else}
								<div class="empty-state">
									<p>Данные об активности отсутствуют</p>
								</div>
							{/if}
						</div>

					{:else if activeTab === 'settings'}
						<div class="settings-section">
							<h2 class="section-title">
								<span class="title-icon">⚙️</span>
								Настройки профиля
							</h2>
							<div class="settings-form">
								<p>Настройки в разработке...</p>
							</div>
						</div>
					{/if}
				</div>

				<!-- Правая колонка -->
				<div class="right-column">
					<!-- Уведомления -->
					<div class="notifications-widget">
						<h3 class="widget-title">Уведомления</h3>
						<div class="notifications-list">
							<div class="notification-item unread">
								<span class="notification-icon">🎯</span>
								<div class="notification-content">
									<p class="notification-text">Выполните первый урок!</p>
									<span class="notification-time">Сегодня</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Быстрые действия -->
					<div class="quick-actions">
						<h3 class="widget-title">Быстрые действия</h3>
						<div class="actions-grid">
							<button class="action-btn" on:click={() => goto('/lk/courses')}>
								<span class="action-icon">📚</span>
								<span>Продолжить обучение</span>
							</button>
							<button class="action-btn" on:click={() => goto('/lk/dict')}>
								<span class="action-icon">🔍</span>
								<span>Поиск жестов</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	.profile-page {
		position: relative;
		width: 100%;
		min-height: 100vh;
		background: #FFFFFF;
		padding-top: 20px;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 70vh;
		gap: 20px;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 5px solid #F3F6FF;
		border-top-color: #0077FF;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.user-info-section {
		display: flex;
		align-items: center;
		gap: 40px;
		padding: 40px 80px;
		background: linear-gradient(135deg, #F3F6FF 0%, #FFFFFF 100%);
		border-bottom: 1px solid #E0E0E0;
	}

	.user-avatar {
		flex-shrink: 0;
	}

	.avatar-container {
		position: relative;
		width: 170px;
		height: 158px;
	}

	.avatar-image {
		width: 100%;
		height: 100%;
		border-radius: 100px;
		border: 0.5px solid #DDDDDD;
		object-fit: cover;
		background: white;
	}

	.avatar-upload {
		position: absolute;
		bottom: 10px;
		right: 10px;
		width: 40px;
		height: 40px;
		background: #0077FF;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.avatar-upload:hover {
		transform: scale(1.1);
		background: #0055CC;
	}

	.avatar-upload input {
		display: none;
	}

	.upload-icon {
		color: white;
		font-size: 20px;
	}

	.user-details {
		flex: 1;
	}

	.user-name {
		font-family: 'Raleway', sans-serif;
		font-weight: 700;
		font-size: 36px;
		color: #221E1E;
		margin-bottom: 5px;
	}

	.user-email {
		font-size: 16px;
		color: rgba(0, 0, 0, 0.72);
		margin-bottom: 20px;
	}

	.user-meta {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.meta-item {
		display: flex;
		gap: 10px;
	}

	.meta-label {
		font-size: 14px;
		color: #909090;
		min-width: 140px;
	}

	.meta-value {
		font-size: 14px;
		color: #333;
	}

	.user-stats {
		display: flex;
		gap: 20px;
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100px;
		height: 100px;
		border-radius: 20px;
		padding: 15px;
	}

	.stat-card.level {
		background: linear-gradient(135deg, #0077FF 0%, #00C6FF 100%);
		color: white;
	}

	.stat-card.points {
		background: linear-gradient(135deg, #FF6B6B 0%, #FFA8A8 100%);
		color: white;
	}

	.stat-card.streak {
		background: linear-gradient(135deg, #51CF66 0%, #A9E34B 100%);
		color: white;
	}

	.stat-label {
		font-size: 12px;
		opacity: 0.9;
		margin-bottom: 5px;
	}

	.stat-value {
		font-size: 28px;
		font-weight: 700;
	}

	.tabs-navigation {
		display: flex;
		padding: 0 80px;
		background: white;
		border-bottom: 1px solid #E0E0E0;
	}

	.tab {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 20px 30px;
		background: none;
		border: none;
		border-bottom: 3px solid transparent;
		font-size: 16px;
		color: #909090;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.tab:hover {
		color: #0077FF;
	}

	.tab.active {
		color: #0077FF;
		border-bottom-color: #0077FF;
		font-weight: 600;
	}

	.profile-content {
		padding: 40px 80px;
	}

	.content-wrapper {
		display: grid;
		grid-template-columns: 1fr 350px;
		gap: 40px;
	}

	.section-title {
		font-size: 24px;
		font-weight: 600;
		color: #909090;
		margin-bottom: 30px;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.overall-progress {
		background: #F3F6FF;
		border-radius: 20px;
		padding: 30px;
		margin-bottom: 40px;
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.progress-bar {
		width: 100%;
		height: 10px;
		background: rgba(218, 218, 218, 0.5);
		border-radius: 50px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: rgba(0, 130, 255, 0.6);
		border-radius: 50px;
		transition: width 0.5s ease;
	}

	.progress-cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
		gap: 24px;
	}

	.progress-card {
		background: #FFFFFF;
		border-radius: 67px;
		padding: 35px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	}

	.card-image {
		width: 100%;
		height: 200px;
		border-radius: 42px;
		overflow: hidden;
		background: #F3F6FF;
	}

	.image-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #0077FF, #00C6FF);
	}

	.image-placeholder span {
		font-size: 64px;
		font-weight: 600;
		color: white;
	}

	.card-title {
		font-size: 28px;
		font-weight: 700;
		text-align: center;
	}

	.right-column {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.widget-title {
		font-size: 18px;
		font-weight: 600;
		color: #333;
		margin-bottom: 20px;
		padding-bottom: 10px;
		border-bottom: 2px solid #0077FF;
	}

	.notifications-widget,
	.quick-actions {
		background: #F3F6FF;
		border-radius: 15px;
		padding: 25px;
	}

	.notification-item {
		display: flex;
		align-items: flex-start;
		gap: 15px;
		padding: 15px;
		background: white;
		border-radius: 10px;
		border-left: 4px solid #0077FF;
		margin-bottom: 10px;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 15px;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 15px;
		padding: 15px 20px;
		background: white;
		border: none;
		border-radius: 10px;
		font-size: 14px;
		color: #333;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.action-btn:hover {
		background: #0077FF;
		color: white;
		transform: translateY(-2px);
	}

	.empty-state {
		background: #F3F6FF;
		border-radius: 15px;
		padding: 60px 30px;
		text-align: center;
	}

	@media (max-width: 1200px) {
		.user-info-section,
		.tabs-navigation,
		.profile-content {
			padding: 30px 20px;
		}
		
		.content-wrapper {
			grid-template-columns: 1fr;
		}
	}
</style>

