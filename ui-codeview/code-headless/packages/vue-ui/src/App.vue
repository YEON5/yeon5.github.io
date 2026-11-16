<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/tabs';
</script>

<template>
    <div class="w-full max-w-3xl mx-auto p-10 space-y-10">
        <h1 class="text-3xl font-bold text-gray-900">Tabs Component Test</h1>

        <!-- pds 디자인토큰 css -->
        <section>
            <div class="bg-pds-mint-500 text-pds-gray-white p-pds-4 rounded-pds-md">bg-pds-mint-500</div>

            <div class="bg-pds-banner-green p-pds-3 rounded-pds-sm">bg-pds-banner-green</div>

            <span class="text-pds-gray-900 text-pds-xl">text-pds-xl / pds-gray-900</span>

            <div class="p-pds-5 rounded-pds-lg border border-pds-gray-200">p-pds-5 / rounded-pds-lg</div>
        </section>

        <!-- 1. Primary Variant (기본형: 하단 라인) -->
        <section>
            <h2 class="text-xl font-semibold mb-4 text-gray-700">1. Primary Variant</h2>
            <Tabs default-value="preview" class="w-full">
                <TabsList variant="primary">
                    <TabsTrigger value="preview" variant="primary">Preview</TabsTrigger>
                    <TabsTrigger value="code" variant="primary">Code</TabsTrigger>
                    <TabsTrigger value="settings" variant="primary" disabled>Disabled</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" class="p-4 border border-t-0 rounded-b-md bg-white">
                    <p class="text-gray-600">This is the preview content area.</p>
                </TabsContent>
                <TabsContent value="code" class="p-4 border border-t-0 rounded-b-md bg-gray-50">
                    <pre class="text-sm text-gray-800">console.log('Hello World');</pre>
                </TabsContent>
                <TabsContent value="settings" class="p-4"> Settings content. </TabsContent>
            </Tabs>
        </section>

        <!-- 2. Secondary Variant (박스/버튼형) -->
        <section>
            <h2 class="text-xl font-semibold mb-4 text-gray-700">2. Secondary Variant</h2>
            <Tabs default-value="monthly" class="w-[400px]">
                <TabsList variant="secondary" class="bg-gray-100">
                    <TabsTrigger value="monthly" variant="secondary" class="flex-1">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly" variant="secondary" class="flex-1">Yearly</TabsTrigger>
                </TabsList>
                <TabsContent value="monthly" class="mt-4 p-4 border rounded-lg">
                    <p class="font-medium">Monthly Plan: $10/mo</p>
                </TabsContent>
                <TabsContent value="yearly" class="mt-4 p-4 border rounded-lg">
                    <p class="font-medium">Yearly Plan: $100/yr (Save 20%)</p>
                </TabsContent>
            </Tabs>
        </section>
    </div>
</template>
