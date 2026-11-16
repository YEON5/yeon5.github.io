<template>
    <div class="flex min-h-screen">
        <aside class="w-64 bg-slate-50 border-r p-6 hidden md:block">
            <h1 class="font-bold text-xl mb-6">Radix UI Docs</h1>
            <nav class="flex flex-col space-y-2">
                <NuxtLink to="/" class="hover:text-blue-600">Home</NuxtLink>
                <!-- <NuxtLink to="/button" class="hover:text-blue-600">Button</NuxtLink>
                <NuxtLink to="/forms" class="hover:text-blue-600">Forms</NuxtLink>
                <NuxtLink to="/accordion" class="hover:text-blue-600">Accordion</NuxtLink> -->
                <NuxtLink to="/tabs" class="hover:text-blue-600">Tabs</NuxtLink>
            </nav>
        </aside>

        <main class="flex-1 p-8">
            <slot />
        </main>
    </div>
</template>
