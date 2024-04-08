export default (props: any) => {
  const selected = (item: any) => {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem?.blur();
    }
  };
  return (
    <div class="dropdown">
      <div tabindex="0" role="button">
        {props.button}
      </div>
      <ul
        tabindex="0"
        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <div onClick={selected}>{props.children}</div>
      </ul>
    </div>
  );
};
