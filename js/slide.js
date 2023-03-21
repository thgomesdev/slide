export default class Slide {
  constructor(wrapper, slide) {
    this.wrapper = document.querySelector(wrapper);
    this.slide = document.querySelector(slide);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
  }

  onMove(event) {
    const pointerPosition =
      event.type === 'mousemove' ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onStart(event) {
    this.movetype;
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
      this.movetype = 'mousemove';
    }
    if (event.type === 'touchstart') {
      this.dist.startX = event.changedTouches[0].clientX;
      this.movetype = 'touchmove';
    }

    this.wrapper.addEventListener(this.movetype, this.onMove);
  }

  moveSlide(distX) {
    this.dist.lastPosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0px, 0px)`;
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.5;
    return this.dist.finalPosition - this.dist.movement;
  }

  onEnd(event) {
    this.wrapper.removeEventListener(this.movetype, this.onMove);
    this.dist.finalPosition = this.dist.lastPosition;
  }

  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    if (this.wrapper && this.slide) {
      this.bindEvents();
      this.addSlideEvents();
    }
    return this;
  }
}
