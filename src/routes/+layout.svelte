<script lang="ts">
	import "../app.css";
	import { page } from "$app/stores";
	import { signIn, signOut } from "@auth/sveltekit/client";
	import {
		Avatar,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownDivider,
		Navbar,
		NavBrand,
		NavHamburger,
		NavUl,
		NavLi,
		Toggle,
	} from "flowbite-svelte";
	import { devTools } from "$lib/stores/devtools";
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold"> Cribbly </span>
	</NavBrand>
	<NavUl {hidden} class="text-">
		<NavLi><a href="/">Home</a></NavLi>
		<NavLi><a href="/games">Games</a></NavLi>
		<NavLi><a href="/standings">Standings</a></NavLi>
		{#if $page.data.isAdmin}
			<NavLi><a href="/admin">Admin</a></NavLi>
		{/if}
		{#if !$page.data.session?.user}
			<NavLi><button on:click={signIn}>Sign In</button></NavLi>
		{/if}
		<div class="flex items-center md:order-2">
			{#if $page.data.session?.user}
				{#if $page.data.session?.user?.image}
					<Avatar id="avatar-menu" src={$page.data.session?.user?.image} class="cursor-pointer" />
				{/if}
				<Dropdown placement="bottom" triggeredBy="#avatar-menu">
					<DropdownHeader>
						<span class="block text-sm">{$page.data.session.user.name}</span>
						<span class="block truncate text-sm font-medium">{$page.data.session.user.email}</span>
					</DropdownHeader>
					<DropdownItem>
						<a href="/admin">Admin</a>
					</DropdownItem>
					<DropdownDivider />
					<DropdownItem>
						<span>Enable Dev Tools</span>
						<Toggle class="mt-2" bind:checked={$devTools} />
					</DropdownItem>
					<DropdownDivider />
					<DropdownItem on:click={signOut}>Sign out</DropdownItem>
				</Dropdown>
			{/if}
		</div>
	</NavUl>
	<NavHamburger on:click={toggle} />
</Navbar>

<main class="mx-auto max-w-4xl container">
	<slot />
</main>
