import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		title: "Bareeq Al-Aeeq — Prestige Interior Atelier, Dubai",
		loadComponent: () => import("@bq/features/home/home").then((m) => m.Home),
	},
	{ path: "**", redirectTo: "" },
];
