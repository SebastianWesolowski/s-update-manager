export const debugFunction = (isDebug: boolean, content: string | object | [], description?: string): void => {
  if (isDebug) {
    let conentToShow = '';
    let descriptionToShow = '';

    if (typeof content === 'object') {
      conentToShow = JSON.stringify(content, null, 2);
    } else {
      conentToShow = content;
    }

    if (description) {
      descriptionToShow = ` - ${description}`;
    }

    console.debug(`[Debug${descriptionToShow}]: ` + conentToShow);
  }
};
