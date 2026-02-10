<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useClipboard } from '@vueuse/core';
import { toast } from 'vue-sonner';
import { use2faStore } from '@/stores/2fa';
import { useI18nStore } from '@/stores/i18n';
import { Button } from '@/components/ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp';
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
import { Progress } from '@/components/ui/progress';
import { useSidebar } from '@/components/ui/sidebar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { QrCode, SquareX, UserRoundPlus, MoreHorizontal } from 'lucide-vue-next';
import QRCode from 'qrcode.vue';

const twoFaStore = use2faStore();
const { t } = useI18nStore();
const { open: isSidebarOpen } = useSidebar();

const countdown = ref(30);
const percent = computed(() => countdown.value / 30 * 100);
const isCritical = computed(() => countdown.value <= 5);
let countdownTimer: number | null = null;

const otps = reactive<Record<string, string>>(Object.fromEntries(
	Object.keys(twoFaStore.accounts).map(
		key => [key, twoFaStore.accounts[key]?.generate() || '']
	)
));

async function copy(content?: string) {
	const clipboard = useClipboard();
	if (!clipboard.isSupported || !content) {
		toast.info(t('notification.unsupported'));
		return;
	}
	await clipboard.copy(content).then(
		() => toast.info(t('notification.copied')),
		(err) => {
			toast.error(t('notification.copy_failed'), { description: err.message });
			logger.error(err);
		}
	);
}

function parseSecret(uri: string) {
	const url = new URL(uri);
	return url.searchParams.get('secret') || '';
}

onMounted(() => {
	countdownTimer = setInterval(() => {
		const now = Math.floor(Date.now() / 1000);
		countdown.value = 30 - (now % 30);
		if (percent.value === 100) {
			Object.keys(twoFaStore.accounts).forEach(key => {
				otps[key] = twoFaStore.accounts[key]!.generate();
			});
		}
	}, 1000) as unknown as number;
});

onBeforeUnmount(() => {
	if (countdownTimer)
		clearInterval(countdownTimer);
});
</script>

<template>
	<main>
		<h2 v-if="false">{{ $t('home.welcome') }}</h2>
		<div v-if="Object.keys(twoFaStore.accounts).length === 0" class="h-full">
			<Empty class="h-full m-auto">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<UserRoundPlus />
					</EmptyMedia>
				</EmptyHeader>
				<EmptyTitle>{{ $t('otp.empty.title') }}</EmptyTitle>
				<EmptyDescription>{{ $t('quote.empty') }}</EmptyDescription>
				<EmptyContent>
					<Button @click="$router.push({ name: 'add', params: { type: '2fa' } })">
						{{ $t('title.add', [$t('title.2fa')]) }}
					</Button>
				</EmptyContent>
			</Empty>
		</div>
		<div v-else class="accounts-list grid gap-4 grid-cols-1" :class="{
			'md:grid-cols-2': !isSidebarOpen,
			'lg:grid-cols-4': !isSidebarOpen
		}">
			<Card v-for="(account, name) in twoFaStore.accounts" :key="name" class="relative overflow-hidden">
				<CardHeader>
					<CardTitle>{{ account.issuer }}</CardTitle>
					<CardDescription>{{ account.label }}</CardDescription>
					<CardAction>
						<Dialog>
							<DialogTrigger><Button variant="ghost" size="icon">
									<QrCode />
								</Button></DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>{{ $t('otp.info.title') }}</DialogTitle>
									<DialogDescription></DialogDescription>
								</DialogHeader>
								<div class="flex flex-col gap-1.5">
									<QRCode :value="account.toString()" :image-settings="{
										src: '/icon.png', borderRadius: 4, excavate: true, width: 32, height: 32
									}" :margin="2" render-as="svg"
										class="w-48 h-48 mx-auto blur-sm hover:blur-none transition-all ease duration-300" />
									<span>{{ $t('otp.issuer') }}: <code>{{ account.issuer }}</code></span>
									<span>{{ $t('otp.label') }}: <code>{{ account.label }}</code></span>
									<span>{{ $t('otp.type') }}: <code>{{ account.hmac ? 'HOTP' : 'TOTP' }}</code></span>
									<span>
										{{ $t('otp.secret') }}:
										<code class="blur-xs hover:blur-none transition-all ease duration-300">
											{{ parseSecret(account.toString()) }}
										</code>
									</span>
								</div>
							</DialogContent>
						</Dialog>
						<Popover>
							<PopoverTrigger>
								<Button variant="ghost" size="icon">
									<MoreHorizontal />
								</Button>
							</PopoverTrigger>
							<PopoverContent class="w-fit">
								<Dialog>
									<DialogTrigger>
										<TooltipProvider as-child>
											<Tooltip>
												<TooltipTrigger as-child>
													<Button variant="destructive" size="icon">
														<SquareX />
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													{{ $t('otp.remove') }}
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>{{ $t('otp.remove.title') }}</DialogTitle>
											<DialogDescription>{{ $t('otp.remove.description', [account.label]) }}</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<DialogClose as-child>
												<Button variant="destructive" @click="twoFaStore.remove(name)">
													{{ $t('otp.remove') }}
												</Button>
											</DialogClose>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</PopoverContent>
						</Popover>
					</CardAction>
				</CardHeader>
				<CardContent>
					<InputOTP readonly :maxlength="account.digits" v-model="otps[name]" :key="name"
						@click="copy(otps[name]!)" :class="{ 'animate-pulse': isCritical }">
						<InputOTPGroup
							class="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border"
							:class="{ 'animate-pulse': isCritical }">
							<InputOTPSlot :index="i - 1" v-for="i of account.digits" :key="i - 1"
								:class="{ 'border-red-500 animate-pulse': isCritical }" />
						</InputOTPGroup>
					</InputOTP>
				</CardContent>
				<Progress :model-value="percent" :class="[
					'h-2.5 rounded-none absolute bottom-0 left-0 transition-colors duration-300',
					isCritical ? 'bg-red-500 animate-pulse' : 'bg-primary/20'
				]" />
			</Card>
		</div>
	</main>
</template>
