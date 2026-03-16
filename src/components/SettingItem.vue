<script setup lang="ts">
import Label from './ui/label/Label.vue';
const { allowedPlatforms } = defineProps<{
	id: string;
	label: string;
	description?: string;
	needRestartOrRefresh?: boolean;
	allowedPlatforms?: string[];
}>();
const { isClient } = BUILD_INFO;
const isUnsupportedPlatform = allowedPlatforms?
	!allowedPlatforms.includes(isClient ? 'client' : 'browser'): false;
</script>

<template>
	<div class="setting-item w-full flex justify-between items-center">
		<Label :for="id" class="flex flex-col gap-1.5 items-start"
			:class="{'text-muted-foreground': isUnsupportedPlatform}">
			<span>{{ label }}</span>
			<small v-if="isUnsupportedPlatform" class="text-sm text-[grey]">
				{{ $t('settings.shared.unsupported_platform') }}
			</small>
			<small v-else class="text-sm text-[grey]">
				<span class="text-red-500" v-if="needRestartOrRefresh">{{ $t(isClient ?
					'settings.shared.effect_after_restart' :
					'settings.shared.effect_after_refresh') }}</span>
				{{ description }}
			</small>
		</Label>
		<slot />
	</div>
</template>
