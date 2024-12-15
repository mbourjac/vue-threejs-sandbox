<script setup lang="ts">
import { routes } from '@/router';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const hoveredLink = ref<string | null>(null);
</script>

<template>
  <main class="min-h-screen bg-black px-4 text-white">
    <ul>
      <template
        v-for="({ path, name, linkLabel }, index) in routes"
        :key="name"
      >
        <li
          v-if="name !== 'home'"
          @mouseenter="hoveredLink = name"
          @mouseleave="hoveredLink = null"
          :class="[
            'group',
            {
              'border-b border-white/50': index !== routes.length - 1,
            },
          ]"
        >
          <RouterLink
            :to="path"
            :class="[
              'flex items-baseline gap-[0.5vw] py-4 leading-none transition-all duration-[400ms] ease-[cubic-bezier([0.83,0,0.17,1])] group-hover:translate-x-4',
              {
                'opacity-60': hoveredLink && hoveredLink !== name,
              },
            ]"
          >
            <span class="text-[1.5vw] italic">{{
              String(index).padStart(2, '0')
            }}</span>
            <span class="text-[4vw] uppercase">{{ linkLabel }}</span>
          </RouterLink>
        </li>
      </template>
    </ul>
  </main>
</template>
