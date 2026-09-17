<script setup lang="ts">
import { ref } from 'vue';
import { Button } from './ui/button';
import { MinusIcon, MaximizeIcon, MinimizeIcon, XIcon } from '@lucide/vue';

const isMaximised = ref(false);

const minimize = () => runtime.WindowMinimise();
const maximize = async () => {
	if(await runtime.WindowIsMaximised()) runtime.WindowUnmaximise();
	else runtime.WindowMaximise();
	isMaximised.value = !isMaximised.value;
}
const close = () => runtime.Quit();
</script>

<template>
	<div class="fixed top-0 left-0 right-0 flex justify-between bg-white/10" style="--wails-draggable: drag;">
		<span></span>
		<span style="--wails-draggable: no-drag;">
			<Button variant="ghost" @click="minimize"><MinusIcon /></Button>
			<Button variant="ghost" @click="maximize">
				<MaximizeIcon v-if="!isMaximised" />
				<MinimizeIcon v-else />
			</Button>
			<Button variant="ghost" @click="close"><XIcon /></Button>
		</span>
	</div>
</template>
