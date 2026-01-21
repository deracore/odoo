import { beforeEach, describe, expect, test } from "@app/hoot";
import { queryAllTexts } from "@app/hoot-dom";
import { mockDate } from "@app/hoot-mock";
import {
    contains,
    defineModels,
    defineParams,
    fields,
    findComponent,
    models,
    mountView,
    preloadBundle,
} from "@web/../tests/web_test_helpers";

import { CalendarController } from "@web/views/calendar/calendar_controller";

describe.current.tags("desktop");

class Event extends models.Model {
    name = fields.Char();
    start = fields.Date();

    has_access() {
        return true;
    }
}

defineModels([Event]);
preloadBundle("web.fullcalendar_lib");
beforeEach(() => {
    mockDate("2021-08-14T08:00:00");
});

test(`Mount a CalendarDatePicker`, async () => {
    await mountView({
        resModel: "event",
        type: "calendar",
        arch: `<calendar date_start="start" mode="day"/>`,
    });
    expect(`.app_datetime_picker`).toHaveCount(1);
    expect(`.app_datetime_picker .app_selected`).toHaveCount(1);
    expect(`.app_datetime_picker .app_selected`).toHaveText("14");
    expect(`.app_datetime_picker_header .app_datetime_button`).toHaveText("August 2021");
    expect(queryAllTexts`.app_datetime_picker .app_day_of_week_cell`).toEqual([
        "S",
        "M",
        "T",
        "W",
        "T",
        "F",
        "S",
    ]);
});

test(`Scale: init with day`, async () => {
    await mountView({
        resModel: "event",
        type: "calendar",
        arch: `<calendar date_start="start" mode="day"/>`,
    });
    expect(`.app_datetime_picker .app_selected`).toHaveCount(1);
    expect(`.app_datetime_picker .app_selected`).toHaveText("14");
});

test(`Scale: init with week`, async () => {
    await mountView({
        resModel: "event",
        type: "calendar",
        arch: `<calendar date_start="start" mode="week"/>`,
    });
    expect(`.app_datetime_picker .app_selected`).toHaveCount(1);
    expect(`.app_datetime_picker .app_selected`).toHaveText("14");
});

test(`Scale: init with month`, async () => {
    await mountView({
        resModel: "event",
        type: "calendar",
        arch: `<calendar date_start="start" mode="month"/>`,
    });
    expect(`.app_datetime_picker .app_selected`).toHaveCount(1);
    expect(`.app_datetime_picker .app_selected`).toHaveText("14");
});

test(`Scale: init with year`, async () => {
    await mountView({
        resModel: "event",
        type: "calendar",
        arch: `<calendar date_start="start" mode="year"/>`,
    });
    expect(`.app_datetime_picker .app_selected`).toHaveCount(1);
    expect(`.app_datetime_picker .app_selected`).toHaveText("14");
});

test(`First day: 0 = Sunday`, async () => {
    // the week start depends on the locale
    defineParams({
        lang_parameters: { week_start: 0 },
    });
    await mountView({
        resModel: "event",
        type: "calendar",
        arch: `<calendar date_start="start" mode="day"/>`,
    });
    expect(queryAllTexts`.app_datetime_picker .app_day_of_week_cell`).toEqual([
        "S",
        "M",
        "T",
        "W",
        "T",
        "F",
        "S",
    ]);
});

test(`First day: 1 = Monday`, async () => {
    // the week start depends on the locale
    defineParams({
        lang_parameters: { week_start: 1 },
    });
    await mountView({
        resModel: "event",
        type: "calendar",
        arch: `<calendar date_start="start" mode="day"/>`,
    });
    expect(queryAllTexts`.app_datetime_picker .app_day_of_week_cell`).toEqual([
        "M",
        "T",
        "W",
        "T",
        "F",
        "S",
        "S",
    ]);
});

test(`Click on active day should change scale : day -> month`, async () => {
    const view = await mountView({
        resModel: "event",
        type: "calendar",
        arch: `<calendar date_start="start" mode="day"/>`,
    });
    const calendar = findComponent(view, (component) => component instanceof CalendarController);
    await contains(`.app_datetime_picker .app_selected`).click();
    expect(calendar.model.scale).toBe("month");
    expect(calendar.model.date.valueOf()).toBe(luxon.DateTime.local(2021, 8, 14).valueOf());
});

test(`Click on active day should change scale : month -> week`, async () => {
    const view = await mountView({
        resModel: "event",
        type: "calendar",
        arch: `<calendar date_start="start" mode="month"/>`,
    });
    const calendar = findComponent(view, (component) => component instanceof CalendarController);
    await contains(`.app_datetime_picker .app_selected`).click();
    expect(calendar.model.scale).toBe("week");
    expect(calendar.model.date.valueOf()).toBe(luxon.DateTime.local(2021, 8, 14).valueOf());
});

test(`Click on active day should change scale : week -> day`, async () => {
    const view = await mountView({
        resModel: "event",
        type: "calendar",
        arch: `<calendar date_start="start" mode="week"/>`,
    });
    const calendar = findComponent(view, (component) => component instanceof CalendarController);
    await contains(`.app_datetime_picker .app_selected`).click();
    expect(calendar.model.scale).toBe("day");
    expect(calendar.model.date.valueOf()).toBe(luxon.DateTime.local(2021, 8, 14).valueOf());
});

test(`Scale: today is correctly highlighted`, async () => {
    mockDate("2021-07-04T08:00:00");
    await mountView({
        resModel: "event",
        type: "calendar",
        arch: `<calendar date_start="start" mode="month"/>`,
    });
    expect(`.app_datetime_picker .app_today`).toHaveClass("app_selected");
    expect(`.app_datetime_picker .app_today`).toHaveText("4");
});
