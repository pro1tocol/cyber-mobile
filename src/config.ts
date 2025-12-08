import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "DUK技术栈",
	subtitle: "v3.8.313",
	lang: "zh_CN",
	themeColor: {
		hue: 250,
		fixed: false,
	},
	banner: {
		enable: true,
		src: "assets/images/index-bg.jpg",
		position: "center",
		credit: {
			enable: true,
			text: "v3.8.313",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 1,
	},
	favicon: [
		 {
		   src: 'assets/images/Misaka.ico',
		   theme: 'dark',
		   sizes: '32x32',
		 }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/pro1tocol/cyber-mobile",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/Misaka.jpg",
	name: "dot1q",
	bio: "只谈技术 不谈感情",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/pro1tocol/cyber-mobile",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
