import { html, type TemplateResult } from 'lit';
import { getFunctionParameters, paramsToString } from '../services/function-params.ts';
import type { Terminal } from '../Terminal.ts';

interface TerminalPart {
	type: string;
}

interface TerminalText extends TerminalPart {
	type: 'text';
	text: string;
}

interface TerminalHighlight extends TerminalPart {
	type: 'highlight';
	text: string;
	highlightType?: string;
}

interface TerminalLink extends TerminalPart {
	type: 'link';
	text: TerminalItem;
	href: string;
	highlightType?: string;
}

interface TerminalLinebreak extends TerminalPart {
	type: 'linebreak';
	height?: number; // in em
}

interface TerminalButton extends TerminalPart {
	type: 'button';
	text: string;
	highlightType?: string;
	action: () => void;
}

interface TerminalParagraph extends TerminalPart {
	type: 'paragraph';
	parts: TerminalItem[];
}

interface TerminalIndentation extends TerminalPart {
	type: 'indentation';
	level: number; // number of indentation levels (1 level = 4 spaces)
	parts: TerminalItem[];
}

interface TerminalHoverHighlightBlock extends TerminalPart {
	type: 'hover-highlight-block';
	parts: TerminalItem[];
}

interface TerminalEmoji extends TerminalPart {
	type: 'emoji';
	emoji: string; // the emoji character
}

interface TerminalComponent extends TerminalPart {
	type: 'component';
	component: TemplateResult; // a Lit template
}

interface TerminalInlineImage extends TerminalPart {
	type: 'inline-image';
	src: string;
	alt?: string;
	paddingX?: number;
}

interface TerminalGroup extends TerminalPart {
	type: 'group';
	parts: TerminalItem[];
}

interface TerminalList extends TerminalPart {
	type: 'list';
	items: TerminalItem[];
	style: 'unordered' | 'ordered';
}

interface TerminalGrid extends TerminalPart {
	type: 'grid';
	numCols: number;
	items: TerminalItem[]; // items are filled row by row
}

interface TerminalPadding extends TerminalPart {
	type: 'padding';
	x: number;
	y: number;
	part: TerminalItem;
}

type TerminalAdvancedItem =
	| TerminalText
	| TerminalHighlight
	| TerminalLink
	| TerminalLinebreak
	| TerminalButton
	| TerminalParagraph
	| TerminalIndentation
	| TerminalHoverHighlightBlock
	| TerminalEmoji
	| TerminalComponent
	| TerminalInlineImage
	| TerminalGroup
	| TerminalList
	| TerminalGrid
	| TerminalPadding;

type TerminalItem = TerminalAdvancedItem | string;

type TerminalResponse = TerminalItem[];

type Awaitable<T> = (...args: string[]) => T | Promise<T>;

type TerminalFunction = Awaitable<TerminalResponse | null>;

interface Command {
	name: string;
	description: string;
	prepare(terminal: Terminal): TerminalFunction;
	isHidden?: boolean;
	noHelp?: boolean;
	provideHelpDetails?(terminal: Terminal): TerminalFunction;
	provideSuggestions?(...args: string[]): string[] | Promise<string[]>;
}

const text = (text: string): TerminalText => ({ type: 'text', text });
const highlight = (text: string, highlightType?: string): TerminalHighlight => ({
	type: 'highlight',
	text,
	highlightType,
});
const link = (text: TerminalItem, href: string, highlightType?: string): TerminalLink => {
	return {
		type: 'link',
		text: text,
		href,
		highlightType,
	};
};
const linebreak = (height?: number): TerminalLinebreak => ({ type: 'linebreak', height });
const button = (text: string, action: () => void, highlightType?: string): TerminalButton => ({
	type: 'button',
	text,
	action,
	highlightType,
});
const paragraph = (parts: TerminalItem[]): TerminalParagraph => ({ type: 'paragraph', parts });

const indentation = (level: number, parts: TerminalItem[]): TerminalIndentation => ({
	type: 'indentation',
	level,
	parts,
});
const hoverHighlightBlock = (parts: TerminalItem[]): TerminalHoverHighlightBlock => ({
	type: 'hover-highlight-block',
	parts,
});
const emoji = (emoji: string): TerminalEmoji => ({ type: 'emoji', emoji });
const hr = (): TerminalComponent => ({ type: 'component', component: html`<hr>` });

const mentionCommandName = (
	terminal: Terminal,
	commandName: string,
	insertText?: string,
): TerminalButton =>
	button(
		commandName,
		() => {
			terminal.pasteCommand(insertText ?? commandName);
		},
		'command',
	);

const mentionCommandUsage = (
	terminal: Terminal,
	command: Command,
	insertText?: string,
): TerminalButton => {
	const params = getFunctionParameters(command.prepare(terminal));
	const paramsString = paramsToString(params);
	const completeCommand = `${command.name} ${paramsString}`.trim();
	return button(
		completeCommand,
		() => {
			terminal.pasteCommand(insertText ?? completeCommand);
		},
		'command',
	);
};

const component = (component: TemplateResult): TerminalComponent => ({
	type: 'component',
	component,
});

const plainCommand = (fn: (...args: string[]) => TerminalResponse) => () => fn;

interface InlineImageOptions {
	paddingX?: number;
	alt?: string;
}
const inlineImage = (src: string, options?: InlineImageOptions): TerminalInlineImage => ({
	type: 'inline-image',
	src,
	alt: options?.alt,
	paddingX: options?.paddingX,
});

const group = (parts: TerminalItem[]): TerminalGroup => ({
	type: 'group',
	parts,
});

const list = (
	items: TerminalItem[],
	style: 'unordered' | 'ordered' = 'unordered',
): TerminalList => {
	return {
		type: 'list',
		items,
		style,
	};
};

const grid = (cols: number, items: TerminalItem[]): TerminalGrid => ({
	type: 'grid',
	numCols: cols,
	items,
});

interface PaddingOptions {
	x: number;
	y: number;
}

const padding = (options: PaddingOptions, part: TerminalItem): TerminalPadding => ({
	type: 'padding',
	x: options.x,
	y: options.y,
	part,
});

export {
	button,
	component,
	emoji,
	highlight,
	hoverHighlightBlock,
	indentation,
	linebreak,
	link,
	mentionCommandName,
	mentionCommandUsage,
	paragraph,
	plainCommand,
	text,
	hr,
	inlineImage,
	group,
	list,
	grid,
	padding,
};
export type {
	Command,
	TerminalButton,
	TerminalComponent,
	TerminalEmoji,
	TerminalGroup,
	TerminalInlineImage,
	TerminalFunction,
	TerminalHighlight,
	TerminalHoverHighlightBlock,
	TerminalIndentation,
	TerminalItem,
	TerminalLinebreak,
	TerminalLink,
	TerminalParagraph,
	TerminalResponse,
	TerminalText,
	TerminalList,
	TerminalGrid,
	TerminalPadding,
};
