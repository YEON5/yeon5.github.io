<script setup lang="ts">
// nuxt.config.ts에서 설정한 alias 'vue-ui'를 통해 import
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'vue-ui';
</script>

<template>
    <div class="p-10 max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-gray-900">Vue UI Documentation</h1>

        <section class="space-y-4 border p-6 rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Tabs Component Preview</h2>

            <Tabs default-value="account" class="w-full">
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account" class="p-4 border border-t-0 rounded-b-md bg-white">
                    <p class="text-gray-600">Make changes to your account here.</p>
                </TabsContent>
                <TabsContent value="password" class="p-4 border border-t-0 rounded-b-md bg-white">
                    <p class="text-gray-600">Change your password here.</p>
                </TabsContent>
            </Tabs>
        </section>
    </div>
</template>
