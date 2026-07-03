import { type Command, link, plainCommand, text } from '../terminal.ts';

const github: Command = {
	name: 'github',
	description: 'Link to my GitHub profile',
	prepare: plainCommand(() => {
		return [
			text('You can find my project at '),
			link('github.com/matthiasharzer', 'https://github.com/matthiasharzer', 'github'),
			text('.'),
		];
	}),
};

export default github;
