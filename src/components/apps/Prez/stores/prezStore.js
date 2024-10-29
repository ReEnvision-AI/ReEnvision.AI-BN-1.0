import { create } from 'zustand';

export const usePrezStore = create((set, get) => ({
  slides: [],
  currentSlideIndex: null,
  currentSlide: null,

  setCurrentSlide: (index) => {
    set({ 
      currentSlideIndex: index,
      currentSlide: get().slides[index]
    });
  },

  addSlide: () => {
    const newSlide = {
      id: Date.now(),
      elements: []
    };

    set(state => ({
      slides: [...state.slides, newSlide],
      currentSlideIndex: state.slides.length,
      currentSlide: newSlide
    }));
  },

  duplicateSlide: (index) => {
    const slides = get().slides;
    const slideToClone = slides[index];
    const newSlide = {
      ...slideToClone,
      id: Date.now(),
      elements: slideToClone.elements.map(el => ({
        ...el,
        id: Date.now() + Math.random()
      }))
    };

    set(state => ({
      slides: [
        ...state.slides.slice(0, index + 1),
        newSlide,
        ...state.slides.slice(index + 1)
      ]
    }));
  },

  deleteSlide: (index) => {
    set(state => ({
      slides: state.slides.filter((_, i) => i !== index),
      currentSlideIndex: state.currentSlideIndex === index 
        ? Math.min(index, state.slides.length - 2)
        : state.currentSlideIndex
    }));
  },

  addText: () => {
    const { currentSlide, currentSlideIndex } = get();
    if (!currentSlide) return;

    const newElement = {
      id: Date.now(),
      type: 'text',
      content: 'Double click to edit',
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      fontSize: 16,
      color: '#000000',
      bold: false,
      italic: false,
      underline: false,
      align: 'left'
    };

    set(state => ({
      slides: state.slides.map((slide, index) =>
        index === currentSlideIndex
          ? { ...slide, elements: [...slide.elements, newElement] }
          : slide
      )
    }));
  },

  addShape: (shape) => {
    const { currentSlide, currentSlideIndex } = get();
    if (!currentSlide) return;

    const newElement = {
      id: Date.now(),
      type: 'shape',
      shape,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: '#000000'
    };

    set(state => ({
      slides: state.slides.map((slide, index) =>
        index === currentSlideIndex
          ? { ...slide, elements: [...slide.elements, newElement] }
          : slide
      )
    }));
  },

  addImage: (src) => {
    const { currentSlide, currentSlideIndex } = get();
    if (!currentSlide) return;

    const newElement = {
      id: Date.now(),
      type: 'image',
      src,
      x: 100,
      y: 100,
      width: 200,
      height: 200
    };

    set(state => ({
      slides: state.slides.map((slide, index) =>
        index === currentSlideIndex
          ? { ...slide, elements: [...slide.elements, newElement] }
          : slide
      )
    }));
  },

  updateElement: (slideId, elementId, changes) => {
    set(state => ({
      slides: state.slides.map(slide =>
        slide.id === slideId
          ? {
              ...slide,
              elements: slide.elements.map(element =>
                element.id === elementId
                  ? { ...element, ...changes }
                  : element
              )
            }
          : slide
      )
    }));
  },

  deleteElement: (slideId, elementId) => {
    set(state => ({
      slides: state.slides.map(slide =>
        slide.id === slideId
          ? {
              ...slide,
              elements: slide.elements.filter(el => el.id !== elementId)
            }
          : slide
      )
    }));
  },

  savePresentation: () => {
    const { slides } = get();
    const data = JSON.stringify(slides);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'presentation.prez';
    link.click();
    URL.revokeObjectURL(url);
  },

  loadPresentation: async (file) => {
    try {
      const text = await file.text();
      const slides = JSON.parse(text);
      set({ 
        slides,
        currentSlideIndex: 0,
        currentSlide: slides[0]
      });
    } catch (error) {
      console.error('Failed to load presentation:', error);
    }
  },

  exportPresentation: () => {
    // TODO: Implement export to PowerPoint
    console.log('Export to PowerPoint not implemented yet');
  }
}));