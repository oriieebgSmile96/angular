import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Icon } from "@bq/shared/components/icon/icon";

/**
 * The sprite itself is guarded by `npm run icons:check`, which regenerates both
 * the sprite and the name union from the same folder and fails on drift. What is
 * worth asserting here is the wiring, because a wrong `href` renders nothing at
 * all — no error, no fallback, just an empty box.
 */
@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Icon],
	template: `<bq-icon name="calendar" [size]="32" [strokeWidth]="2" />`,
})
class HostComponent {}

describe("bq-icon", () => {
	it("points at the sprite symbol for the given name", () => {
		const fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();

		const svg = fixture.nativeElement.querySelector("svg");
		const use = fixture.nativeElement.querySelector("use");

		expect(use.getAttribute("href")).toBe("icons/sprite.svg#calendar");
		expect(svg.getAttribute("width")).toBe("32");
		expect(svg.getAttribute("height")).toBe("32");
		expect(svg.getAttribute("stroke-width")).toBe("2");
	});

	/** An HTML `<use>` element parses fine and draws nothing, so check the namespace. */
	it("creates the svg elements in the svg namespace", () => {
		const fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();

		const use = fixture.nativeElement.querySelector("use");

		expect(use.namespaceURI).toBe("http://www.w3.org/2000/svg");
	});
});
