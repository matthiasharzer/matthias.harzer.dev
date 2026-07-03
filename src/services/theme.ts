
export interface Theme {
	background: {
		canvas: string;
		window: string;
		surface: string;
	};
	ink: {
		main: string;
		muted: string;
	};
	pop: {
		1: string;
		2: string;
		3: string;
		4: string;
		5: string;
	};
	border: {
		color: string;
		width: {
			thick: string;
			thin: string;
		}
	};
	shadow: {
		offsetX: string;
		offsetY: string;
		color: string;
	};
	radius: {
		sharp: string;
		soft: string;
	};
}

export type PopNames = `pop-${keyof Theme['pop']}`;
export type BackgroundNames = `bg-${keyof Theme['background']}`;
export type RadiusNames = keyof Theme['radius'];
export type BorderWidthNames = keyof Theme['border']['width'];
export type InkNames = keyof Theme['ink'];

// 1. The Classic (Standard Neo-Brutalism)
export const classicTheme: Theme = {
	background: {
		canvas: "#E5E5E5",
		window: "#FFFFFF",
		surface: "#F4F4F4"
	},
	ink: {
		main: "#000000",
		muted: "#555555"
	},
	pop: {
		1: "#FF90E8",
		2: "#FFC900",
		3: "#00E5FF",
		4: "#FF4911",
		5: "#B16CEC"
	},
	border: {
		color: "#000000",
		width: {
			thick: "3px",
			thin: "1px"
		}
	},
	shadow: {
		offsetX: "4px",
		offsetY: "4px",
		color: "#000000"
	},
	radius: {
		sharp: "0px",
		soft: "4px"
	}
};

// 2. Retro Print (Warm & Nostalgic)
export const retroPrintTheme: Theme = {
	background: {
		canvas: "#F3EFE0",
		window: "#FFFBF0",
		surface: "#F9F5EA"
	},
	ink: {
		main: "#1A1A1A",
		muted: "#686458"
	},
	pop: {
		1: "#E94E38",
		2: "#4D6B9C",
		3: "#F5A122",
		4: "#3C9055",
		5: "#E0BCE4"
	},
	border: {
		color: "#1A1A1A",
		width: {
			thick: "4px",
			thin: "2px"
		}
	},
	shadow: {
		offsetX: "6px",
		offsetY: "6px",
		color: "#1A1A1A"
	},
	radius: {
		sharp: "0px",
		soft: "0px"
	}
};

// 3. Minty Fresh (Pastel & Punchy)
export const mintyFreshTheme: Theme = {
	background: {
		canvas: "#E4F3E3",
		window: "#FFFFFF",
		surface: "#F2FAF1"
	},
	ink: {
		main: "#0F1A15",
		muted: "#51665C"
	},
	pop: {
		1: "#EE4266",
		2: "#FFD23F",
		3: "#3BCEAC",
		4: "#540D6E",
		5: "#0EAD69"
	},
	border: {
		color: "#0F1A15",
		width: {
			thick: "3px",
			thin: "1px"
		}
	},
	shadow: {
		offsetX: "5px",
		offsetY: "5px",
		color: "#0F1A15"
	},
	radius: {
		sharp: "0px",
		soft: "8px"
	}
};

// 4. Cyber Web (High Energy)
export const cyberWebTheme: Theme = {
	background: {
		canvas: "#EAE6FF",
		window: "#FFFFFF",
		surface: "#F5F3FF"
	},
	ink: {
		main: "#100A20",
		muted: "#5B5377"
	},
	pop: {
		1: "#D2FF00",
		2: "#FF007F",
		3: "#00E0FF",
		4: "#A66CFF",
		5: "#FF7700"
	},
	border: {
		color: "#100A20",
		width: {
			thick: "4px",
			thin: "2px"
		}
	},
	shadow: {
		offsetX: "8px",
		offsetY: "8px",
		color: "#100A20"
	},
	radius: {
		sharp: "0px",
		soft: "2px"
	}
};

// 5. Mono + Accent (Minimalist Brutal)
export const monoAccentTheme: Theme = {
	background: {
		canvas: "#D4D4D4",
		window: "#FFFFFF",
		surface: "#F0F0F0"
	},
	ink: {
		main: "#000000",
		muted: "#737373"
	},
	pop: {
		1: "#000000",
		2: "#FFFFFF",
		3: "#FF3366",
		4: "#00FF66",
		5: "#3300FF"
	},
	border: {
		color: "#000000",
		width: {
			thick: "2px",
			thin: "1px"
		}
	},
	shadow: {
		offsetX: "3px",
		offsetY: "3px",
		color: "#000000"
	},
	radius: {
		sharp: "0px",
		soft: "0px"
	}
};

// Optional: An array or record to easily map over them in your app
export const allThemes: Record<string, Theme> = {
	classic: classicTheme,
	retroPrint: retroPrintTheme,
	mintyFresh: mintyFreshTheme,
	cyberWeb: cyberWebTheme,
	monoAccent: monoAccentTheme
};

const themes: Record<string, Theme> = {
	default: cyberWebTheme,
};


const applyTheme = (theme: Theme) => {
	document.documentElement.style.setProperty('--bg-canvas', theme.background.canvas);
	document.documentElement.style.setProperty('--bg-window', theme.background.window);
	document.documentElement.style.setProperty('--bg-surface', theme.background.surface);

	document.documentElement.style.setProperty('--ink-main', theme.ink.main);
	document.documentElement.style.setProperty('--ink-muted', theme.ink.muted);

	for (const [key, value] of Object.entries(theme.pop)) {
		document.documentElement.style.setProperty(`--pop-${key}`, value);
	}

	document.documentElement.style.setProperty('--border-color', theme.border.color);
	document.documentElement.style.setProperty('--border-thick', theme.border.width.thick);
	document.documentElement.style.setProperty('--border-thin', theme.border.width.thin);

	document.documentElement.style.setProperty('--shadow-offset-x', theme.shadow.offsetX);
	document.documentElement.style.setProperty('--shadow-offset-y', theme.shadow.offsetY);
	document.documentElement.style.setProperty('--shadow-color', theme.shadow.color);

	document.documentElement.style.setProperty('--radius-sharp', theme.radius.sharp);
	document.documentElement.style.setProperty('--radius-soft', theme.radius.soft);
}

export const setTheme = (themeName: string) => {
	if (!themes[themeName]) {
		console.warn(`Theme "${themeName}" not found. Falling back to default theme.`);
		themeName = 'default';
	}

	const theme = themes[themeName];
	applyTheme(theme);
};


