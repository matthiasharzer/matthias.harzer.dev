import { html, type TemplateResult } from 'lit';
import type { TerminalItem, TerminalResponse } from './terminal.ts';

const cutText = (text: string, maxLength: number) => {
	if (maxLength === -1) {
		return text;
	}
	if (text.length <= maxLength) {
		return text;
	}
	return text.slice(0, maxLength);
};

const renderResponseParts = (
	parts: TerminalItem[],
	maxCharsToRender: number,
): [TemplateResult[], number] => {
	const renderedParts: TemplateResult[] = [];
	let charsRendered = 0;
	let totalLength = 0;
	for (const part of parts) {
		const [renderedPart, partLength] = renderResponsePart(
			part,
			maxCharsToRender === -1 ? -1 : maxCharsToRender - charsRendered,
		);
		if (charsRendered < maxCharsToRender || maxCharsToRender === -1) {
			renderedParts.push(renderedPart);
			charsRendered += partLength;
		}

		totalLength += partLength;
	}
	return [renderedParts, totalLength];
};

const renderResponsePart = (
	part: TerminalItem,
	maxCharsToRender: number,
): [TemplateResult, number] => {
	if (typeof part === 'string') {
		return [html`${cutText(part, maxCharsToRender)}`, part.length];
	}

	switch (part.type) {
		case 'text':
			return [html`${cutText(part.text, maxCharsToRender)}`, part.text.length];
		case 'highlight':
			return [
				html`<span class="highlight ${part.highlightType ?? ''}">${cutText(part.text, maxCharsToRender)}</span>`,
				part.text.length,
			];
		case 'link': {
			const [renderedPartText, totalLength] = renderResponsePart(part.text, maxCharsToRender);
			return [
				html`<a class="highlight ${part.highlightType ?? ''}" href="${part.href}" target="_blank" rel="noopener">${renderedPartText}</a>`,
				totalLength,
			];
		}
		case 'linebreak':
			return [html`<div class="linebreak" style="height: ${part.height ?? 0}em;"></div>`, 1];
		case 'button': {
			return [
				html`<button class="highlight ${part.highlightType ?? ''}" @click=${() => part.action()}>${cutText(part.text, maxCharsToRender)}</button>`,
				part.text.length,
			];
		}
		case 'paragraph': {
			const [renderedParts, totalLength] = renderResponseParts(part.parts, maxCharsToRender);
			return [html`<p>${renderedParts}</p>`, totalLength];
		}
		case 'indentation': {
			const [renderedParts, totalLength] = renderResponseParts(part.parts, maxCharsToRender);
			return [html`<div class="indentation l-${part.level}">${renderedParts}</div>`, totalLength];
		}
		case 'hover-highlight-block': {
			const [renderedParts, totalLength] = renderResponseParts(part.parts, maxCharsToRender);
			return [html`<div class="hover-highlight-block">${renderedParts}</div>`, totalLength];
		}
		case 'emoji': {
			switch (part.emoji) {
				case '🎉':
					return [html`<img src="./assets/tada.webp" alt="🎉" class="pixel-emoji" />`, 1];
				default:
					return [html`<span>${part.emoji}</span>`, 1];
			}
		}
		case 'component': {
			return [part.component, 0];
		}
		case 'inline-image': {
			return [
				html`<img src="${part.src}" alt="${part.alt ?? ''}" class="terminal-inline-image"  />`,
				0,
			];
		}
		case 'group': {
			const [renderedParts, totalLength] = renderResponseParts(part.parts, maxCharsToRender);
			return [html`${renderedParts}`, totalLength];
		}
	}
};

const renderResponse = (response: TerminalResponse) => {
	return response.map(part => renderResponsePart(part, -1)[0]);
};

export { renderResponse, renderResponsePart, renderResponseParts };
