import { defineStore } from 'pinia';

export const useVisibilityStore = defineStore('visibility', {
  state: () => ({
    showValues: true,
  }),
  actions: {
    toggleShowValues() {
      this.showValues = !this.showValues;
    },
  },
});
