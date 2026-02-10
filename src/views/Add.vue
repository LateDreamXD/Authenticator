<script setup lang="ts">
import { reactive, ref } from 'vue';
import { toast } from 'vue-sonner';
import { use2faStore } from '@/stores/2fa';
import { useI18nStore } from '@/stores/i18n';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
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

const twofaStore = use2faStore();
const { t } = useI18nStore();

const mode = ref('input');
const uri = ref('');
const type = ref('TOTP');
const form = reactive({
	issuer: '',
	label: '',
	secret: '',
	issuerInLabel: true
});

const basicItems = {
	issuer: { type: 'text', required: true },
	label: { type: 'text', required: true },
	secret: { type: 'password', required: true },
};

function add() {
	try {
		twofaStore.add(mode.value === 'uri' ? uri.value : form, type.value as 'TOTP' | 'HOTP');
		toast.info(t('notification.added'));
	} catch(e) { toast.error(t('notification.add_failed')); logger.error(e); }
}
function checkURI() {
	try {
		new URL(uri.value);
		return true;
	} catch { return false; }
}
function check() {
	if(mode.value === 'uri') return checkURI();
	else {
		return Boolean(form.issuer && form.label && form.secret);
	}
}
</script>

<template>
	<main class="h-full m-auto">
		<Dialog>
			<DialogTrigger class="flex gap-2">
				<Button variant="outline" @click="mode = 'uri'">{{ $t('add.2fa.by.otp_uri') }}</Button>
				<Button @click="mode = 'input'">{{ $t('add.2fa.by.manual_input') }}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{{ $t('add.new', [$t('title.2fa')]) }}</DialogTitle>
					<DialogDescription v-if="mode === 'input'">{{ $t('add.2fa.by.manual_input') }}</DialogDescription>
					<DialogDescription v-else>{{ $t('add.2fa.by.otp_uri') }}</DialogDescription>
				</DialogHeader>
				<div>
					<span v-if="mode === 'input'" class="grid grid-cols-3 gap-2">
						<Input v-for="(item, key) of basicItems" v-model="form[key]" :type="item.type"
							:placeholder="$t(`otp.${key}`)" :required="item.required" />
						<Select v-model="type" class="w-fit">
							<SelectTrigger>
								<SelectLabel>{{ $t('otp.type') }}</SelectLabel>
								<SelectValue :placeholder="$t('otp.type')" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="TOTP" :selected="type === 'TOTP'">
										{{ $t('otp.type.totp') }}
									</SelectItem>
									<SelectItem value="HOTP" :selected="type === 'HOTP'">
										{{ $t('otp.type.hotp') }}
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</span>
					<span v-else>
						<Field>
							<FieldLabel>OTP URI</FieldLabel>
							<FieldContent>
								<Input v-model="uri" type="url" placeholder="OTP URI" />
							</FieldContent>
							<FieldError v-if="!checkURI()">{{ $t('add.input_error_massage', [' OTP URI']) }}</FieldError>
						</Field>
					</span>
				</div>
				<DialogFooter>
					<DialogClose as-child>
						<Button type="submit" :disabled="!check()" @click="add">{{ $t('otp.add') }}</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</main>
</template>
