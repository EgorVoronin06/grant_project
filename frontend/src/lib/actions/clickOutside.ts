import type { Action } from 'svelte/action';

export const clickOutside: Action<HTMLElement, () => void> = (node: Node, callback) => {
  const handleClick = (event: MouseEvent) => {
    const target = event.target as Node
    if (node && !node.contains(target) && !event.defaultPrevented) {
      callback()
    }
  }
	document.addEventListener('mousedown', handleClick, true);
  
  return {
    destroy() {
      document.removeEventListener('mousedown', handleClick, true);
    }
	}
}