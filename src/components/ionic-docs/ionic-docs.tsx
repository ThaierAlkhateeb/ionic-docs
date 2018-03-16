import '@stencil/router';
import { Component, Element, Event, EventEmitter, Listen, State } from '@stencil/core';

@Component({
  tag: 'ionic-docs',
  styleUrl: 'ionic-docs.css'
})
export class IonicDocs {
  @Element() el: Element;
  @Event() sectionChanged: EventEmitter;
  @State() currentSection = 'framework';

  @Listen('docLoaded')
  onDocLoaded({ detail }) {
    if (!detail || !detail.path) return;
    this.removePageClass();
    this.el.classList.add(`page-${detail.path.replace(/\//g, '-')}`);
    this.el.classList.toggle('has-preview', typeof detail.previewUrl === 'string');

    const section = this.parseSection(detail.path);
    if (section !== this.currentSection) {
      this.currentSection = section;
      this.sectionChanged.emit({ section });
    }
  }

  parseSection(path) {
    const match = /^(cli|pro)\//.exec(path);
    const section = match && match[1] || 'framework';
    return section;
  }

  removePageClass() {
    this.el.className = this.el.className.split(' ')
      .filter(str => str.indexOf('page-') !== 0)
      .join(' ');
  }

  hostData() {
    return {
      class: { [`section-${this.currentSection}`]: true },
    };
  }

  render() {
    return [
      <site-header currentSection={ this.currentSection } />,
      <site-menu/>,
      <site-content/>,
      <site-preview-app/>
    ];
  }
}
