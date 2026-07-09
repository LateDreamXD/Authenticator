<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSettingsStore } from './stores/settings';
import { SidebarProvider } from './components/ui/sidebar';
import AppSidebar from './components/AppSidebar.vue';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from './components/ui/context-menu';
import 'vue-sonner/style.css';
import { Toaster } from '@/components/ui/sonner';
import { Plus, RefreshCcwIcon, Settings } from '@lucide/vue';
const contextMenuItems: {
	key: string;
	label?: string;
	icon: import('vue').Component;
	route?: string[];
	action?: Function;
}[] = [
	{ key: 'add', label: 'title.add', icon: Plus, route: ['2fa', 'passwords', 'steam_guard', 'recovery_codes'] },
	{ key: 'settings', icon: Settings },
];

const env = ref<import('@runtime').EnvironmentInfo>();
const version = __VERSION__;

const settingsStore = useSettingsStore();

const isClient = !!window.runtime;

const refresh = runtime.WindowReload;

onMounted(async () => {
	env.value = await runtime.Environment();
});
</script>

<template>
	<div v-if="settingsStore.settings.appearance?.background_image"
		class="w-full h-full pointer-events-none fixed top-0 left-0 -z-1 bg-background/40"/>
	<div v-if="settingsStore.settings.appearance?.background_image"
		class="w-full h-full pointer-events-none fixed top-0 left-0 -z-2">
		<img
			:src="settingsStore.settings.appearance.background_image"
			class="w-full h-full object-cover brightness-[0.8] dark:brightness-[0.2]"
		/>
	</div>
	<ContextMenu>
		<ContextMenuTrigger as-child>
			<SidebarProvider>
				<AppSidebar />
				<RouterView v-slot="{ Component }">
					<transition name="app">
						<component :is="Component" />
					</transition>
				</RouterView>
				<Toaster />
			</SidebarProvider>
		</ContextMenuTrigger>
		<ContextMenuContent @context-menu.prevent>
			<template v-for="item in contextMenuItems" :key="item.key">
				<ContextMenuItem v-if="item?.route?.includes($route.name?.toString() || '')"
					@click="item?.action?.(item) || $router.push({ name: item.key, params: { type: $route.name?.toString() } })">
					<component :is="item.icon" />
					<span>{{ $t(item?.label || `contextmenu.${item.key}`, [$t(`title.${$route.name?.toString()}`)]) }}</span>
				</ContextMenuItem>
			</template>
			<ContextMenuSeparator v-if="isClient" />
			<ContextMenuItem v-if="isClient" @click="refresh">
				<RefreshCcwIcon />
				<span>{{ $t('contextmenu.refresh') }}</span>
			</ContextMenuItem>
		</ContextMenuContent>
	</ContextMenu>
	<div class="watermarks fixed bottom-2 right-2 text-sm text-primary/50 flex flex-col items-end">
		<span v-if="settingsStore.settings.portable_mode" v-text="$t('watermark.portable_mode')" />
		<span>
			v{{ version }} {{ env? `${env.platform}-${env.arch}-${env.buildType}`: 'web' }}
		</span>
		<span v-if="version.startsWith('0.')">{{ $t('watermark.unstable_version_warning') }}</span>
	</div>
</template>
