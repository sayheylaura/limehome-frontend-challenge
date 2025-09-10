export function hasClass(classname: string, element: HTMLElement) {
  return element.classList.contains(classname);
}
export function addClass(classname: string, element: HTMLElement) {
  let cn = element.className ? element.className : '';

  if (cn.indexOf(classname) != -1) {
    return;
  }

  if (cn != '') {
    classname = ' ' + classname;
  }

  element.className = cn + classname;
}

export function removeClass(classname: string, element: HTMLElement) {
  element.className = element.className.replace(new RegExp(classname, 'g'), '');
}
