<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50" @click.self="close">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center pb-3">
        <h3 class="text-2xl font-bold"></h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
      <div class="mt-2">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScYeZ_sttBdcfd_CkETo_stAF_fTZNXd5TOVffQyQqCP1LWPQ/viewform?usp=publish-editor"
          width="100%"
          height="600"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        >
          Loading…
        </iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

function close() {
  emit('close');
}
</script>
