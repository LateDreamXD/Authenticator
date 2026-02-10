<script setup lang="ts">
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import { ListTodo } from 'lucide-vue-next';
</script>

<template>
	<main>
		<Empty class="h-full m-auto">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<ListTodo />
				</EmptyMedia>
			</EmptyHeader>
			<EmptyTitle>Work in Progress</EmptyTitle>
			<EmptyDescription>This feature is still under development. Please check back later.</EmptyDescription>
		</Empty>
	</main>
</template>
