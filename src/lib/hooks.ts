export function useOutsideClick<T extends HTMLElement>(
  onClickOutside: () => void,
) {
  return (element: T) => {
    function onClick(event: MouseEvent) {
      if (!element.contains(event.target as Node)) {
        onClickOutside()
      }
    }
    document.body.addEventListener("click", onClick)
    return {
      destroy() {
        document.body.removeEventListener("click", onClick)
      },
    }
  }
}
