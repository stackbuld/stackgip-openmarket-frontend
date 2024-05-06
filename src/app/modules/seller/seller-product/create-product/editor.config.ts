import { AngularEditorConfig } from '@kolkov/angular-editor';

export const previewEditorConfig: AngularEditorConfig = {
  editable: false,
  showToolbar: false,
  enableToolbar: false,
  height: 'auto',
  minHeight: '15rem',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '10rem',
};

export const editorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '15rem',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '10rem',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Product description...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'times-new-roman', name: 'Times New Roman' },
    { class: 'calibri', name: 'Calibri' },
    { class: 'comic-sans-ms', name: 'Comic Sans MS' },
  ],
  toolbarHiddenButtons: [
    [
      'strikeThrough',
      'subscript',
      'superscript',
      'colorPicker',
      'justifyFull',
      'outdent',
      'eyedrop',
    ],
    [
      'textColor',
      'backgroundColor',
      'customClasses',
      'link',
      'unlink',
      'insertImage',
      'insertVideo',
      'insertHorizontalRule',
      'removeFormat',
      'toggleEditorMode',
    ],
  ],

  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
};

export const pickupOptions = [
  {
    name: 'None',
  },
  {
    name: 'Bike',
  },
  {
    name: 'Car',
  },
  {
    name: 'Van',
  },
  {
    name: 'Truck',
  },
];
