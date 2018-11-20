function recognizeRectangles(rectangles) {
  const rectWrapper = document.getElementById('rectangle-wrapper');
  rectWrapper.appendChild(createFragment(rectangles.map(rect => rect.elem = createElement('div', {
    classes: 'rectangle',
    styles: {
      width: rect.width + 'px',
      height: rect.height + 'px',
      transform: `translate(${rect.x}px, ${rect.y}px)`
    }
  }))));
}
