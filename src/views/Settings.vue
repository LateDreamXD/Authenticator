<script setup lang="ts">
import { reactive } from 'vue';
import { useFileDialog } from '@vueuse/core';
import { file2base64 } from '@/lib/file-helper';
import { useSettingsStore } from '@/stores/settings';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
} from '@/components/ui/field';
import SettingItem from '@/components/SettingItem.vue';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
const settingsStore = useSettingsStore();

const settings = reactive(settingsStore.settings);

const { isClient } = BUILD_INFO;
async function chooseBackground() {
	if(isClient) {
	} else {
		const { onChange, open } = useFileDialog({
			accept: 'image/*',
			multiple: false
		});
		open();
		onChange(async(files) => {
			if(files?.[0]) {
				settings.appearance.background_image = await file2base64(files?.[0]);
			}
		});
	}
}
</script>

<template>
	<main class="w-[80%]">
		<FieldSet>
			<FieldLegend class="text-[1.25em]">{{ $t('settings.categories.appearance') }}</FieldLegend>
			<FieldDescription class="text-accent-foreground/70 dark:text-[grey]">{{ $t('settings.appearance.description') }}</FieldDescription>
			<FieldGroup>
				<Field>
					<SettingItem id="theme" :label="$t('settings.appearance.theme')"
						:description="$t('settings.appearance.theme.description')">
						<Select id="theme" v-model="settings.appearance.theme">
							<SelectTrigger>
								<SelectValue :placeholder="$t('settings.shared.waiting_for_choose')" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="system" :selected="settings.appearance.theme === 'system'">
										{{ $t('settings.shared.system') }}
									</SelectItem>
									<SelectItem v-for="theme in ['light', 'dark']" :key="theme" :value="theme"
										:selected="settings.appearance.theme === theme">
										{{ $t(`settings.appearance.theme.${theme}`) }}
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</SettingItem>
					<SettingItem id="background_image" :label="$t('settings.appearance.background_image')"
						:description="$t('settings.appearance.background_image.description')">
						<Button v-text="$t('settings.actions.choose_file')" @click="chooseBackground" />
					</SettingItem>
					<SettingItem v-if="false" id="background_image_blur" :label="$t('settings.appearance.background_image_blur')"
						:description="$t('settings.appearance.background_image_blur.description')">
						<Input class="w-fit" id="background_image_blur" v-model="settings.appearance.background_image_blur" type="number" max="16" />
					</SettingItem>
				</Field>
			</FieldGroup>
		</FieldSet>
		<FieldSeparator class="p-10" />
		<FieldSet>
			<FieldLegend class="text-[1.25em]">{{ $t('settings.categories.general') }}</FieldLegend>
			<FieldDescription class="text-accent-foreground/70 dark:text-[grey]">{{ $t('settings.categories.general.description') }}</FieldDescription>
			<FieldGroup>
				<Field>
					<SettingItem id="language" :label="$t('settings.language')"
						:description="$t('settings.language.description')">
						<Select id="language" v-model="settings.language">
							<SelectTrigger>
								<SelectValue :placeholder="$t('settings.shared.waiting_for_choose')" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="system" :selected="settings.language === 'system'">
										{{ $t('settings.shared.system') }}
									</SelectItem>
									<SelectItem value="zh-CN" :selected="settings.language === 'zh-CN'">
										{{ $t('settings.language.zh-CN') }}
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</SettingItem>
					<SettingItem id="portable_mode" :label="$t('settings.portable_mode')"
						:description="$t('settings.portable_mode.description')"
						:need-restart-or-refresh="true" :allowed-platforms="['client']">
						<Switch id="portable_mode" v-model="settings.portable_mode" :disabled="!isClient" />
					</SettingItem>
				</Field>
				<FieldSeparator />
				<Field orientation="horizontal" class=" justify-end">
					<Dialog>
						<DialogTrigger as-child>
							<Button variant="outline" type="button" v-text="$t('settings.actions.reset')" />
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle v-text="$t('settings.actions.confirm.title', [$t('settings.actions.reset')])" />
								<DialogDescription v-text="$t('settings.actions.confirm.description')" />
							</DialogHeader>
							<DialogFooter>
								<DialogClose as-child>
									<Button variant="outline" type="button" v-text="$t('settings.actions.cancel')" />
								</DialogClose>
								<DialogClose as-child>
									<Button type="submit" v-text="$t('settings.actions.confirm')" @click="$settings.reset()" />
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<Button type="submit" v-text="$t('settings.actions.apply')" @click="$settings.update(settings)" />
				</Field>
			</FieldGroup>
		</FieldSet>
	</main>
</template>
