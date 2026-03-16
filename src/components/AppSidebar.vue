<script setup lang="ts">
import { onMounted } from 'vue';
import { UserRoundCheck, BookUser, FileCodeCorner, Shield, Settings, Menu } from 'lucide-vue-next';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarFooter,
	useSidebar
} from '@/components/ui/sidebar';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();

const { toggleSidebar, setOpen, open } = useSidebar();

const items = [
	{ key: '2fa', icon: UserRoundCheck },
	{ key: 'steam_guard', icon: Shield, disabled: true },
	{ key: 'passwords', icon: BookUser },
	{ key: 'recovery_codes', icon: FileCodeCorner },
];

const menuToggleHandler = () => {
	toggleSidebar();
	settingsStore.settings.sidebar_open = open.value;
	settingsStore.save();
}

onMounted(() => {
	setOpen(settingsStore.settings.sidebar_open);
});
</script>

<template>
	<Sidebar collapsible="icon" variant="floating">
		<SidebarContent class="overflow-x-hidden">
			<SidebarGroup>
				<SidebarGroupLabel>{{ $t('title.app') }}</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton as-child @click="menuToggleHandler">
								<span class="cursor-pointer">
									<Menu />
									<span>{{ $t('home.menu') }}</span>
								</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem v-for="item in items" :key="item.key">
							<SidebarMenuButton as-child :disabled="item?.disabled" :is-active="item.key === $route.name">
								<RouterLink :to="{ name: item.key }">
									<component :is="item.icon" />
									<span>{{ $t(`menu.${item.key}`) }}</span>
								</RouterLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
		<SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton as-child :is-active="$route.name === 'settings'">
						<RouterLink :to="{ name: 'settings' }">
							<Settings />
							<span>{{ $t('menu.settings') }}</span>
						</RouterLink>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	</Sidebar>
</template>
