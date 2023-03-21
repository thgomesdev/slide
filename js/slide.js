export default class Slide {
  constructor(wrapper, slide) {
    this.wrapper = document.querySelector(wrapper);
    this.slide = document.querySelector(slide);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
  }

  transititon(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
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
    this.transititon(false);
  }

  moveSlide(distX) {
    this.dist.lastPosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0px, 0px)`;
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.5;
    return this.dist.finalPosition - this.dist.movement;
  }

  onEnd() {
    this.wrapper.removeEventListener(this.movetype, this.onMove);
    this.dist.finalPosition = this.dist.lastPosition;
    this.transititon(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) this.activeNextSlide();

    if (this.dist.movement < -120 && this.index.prev !== undefined) this.activePrevSlide();

    if (this.index.prev == undefined || this.index.next == undefined) {
      this.changeSlide(this.index.active);
    }
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

  // Slides config

  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }

  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }

  init() {
    if (this.wrapper && this.slide) {
      this.bindEvents();
      this.addSlideEvents();
      this.slidesConfig();
    }
    return this;
  }
}
