<script lang="ts">
	import About from '$lib/components/about/About.svelte';
	import Benefit from '$lib/components/benefit/Benefit.svelte';
	import Faq from '$lib/components/faq/FAQ.svelte';
	import Feedback from '$lib/components/feedback/Feedback.svelte';
	import LearningTools from '$lib/components/learningTools/LearningTools.svelte';
	import Platform from '$lib/components/platform/Platform.svelte';
</script>

<div class="container content">
	<Platform />
	<About />
	<Benefit />
</div>
<LearningTools />
<div class="container">
	<Faq />
	<Feedback />
</div>

<style>
	.content {
		margin-top: 60px;
	}
</style>
