import Slide from './slide.js';

const slide = new Slide('.slide-wrapper', '.slide');
slide.init();

slide.changeSlide(0);
slide.activeNextSlide();
