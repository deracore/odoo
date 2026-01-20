/** @app-module alias=@app/hoot-mock default=false */

import * as _hootDom from "@app/hoot-dom";
import * as _animation from "./mock/animation";
import * as _date from "./mock/date";
import * as _math from "./mock/math";
import * as _navigator from "./mock/navigator";
import * as _network from "./mock/network";
import * as _notification from "./mock/notification";
import * as _window from "./mock/window";

/** @deprecated use `import { advanceFrame } from "@app/hoot";` */
export const advanceFrame = _hootDom.advanceFrame;
/** @deprecated use `import { advanceTime } from "@app/hoot";` */
export const advanceTime = _hootDom.advanceTime;
/** @deprecated use `import { animationFrame } from "@app/hoot";` */
export const animationFrame = _hootDom.animationFrame;
/** @deprecated use `import { cancelAllTimers } from "@app/hoot";` */
export const cancelAllTimers = _hootDom.cancelAllTimers;
/** @deprecated use `import { Deferred } from "@app/hoot";` */
export const Deferred = _hootDom.Deferred;
/** @deprecated use `import { delay } from "@app/hoot";` */
export const delay = _hootDom.delay;
/** @deprecated use `import { freezeTime } from "@app/hoot";` */
export const freezeTime = _hootDom.freezeTime;
/** @deprecated use `import { microTick } from "@app/hoot";` */
export const microTick = _hootDom.microTick;
/** @deprecated use `import { runAllTimers } from "@app/hoot";` */
export const runAllTimers = _hootDom.runAllTimers;
/** @deprecated use `import { setFrameRate } from "@app/hoot";` */
export const setFrameRate = _hootDom.setFrameRate;
/** @deprecated use `import { tick } from "@app/hoot";` */
export const tick = _hootDom.tick;
/** @deprecated use `import { unfreezeTime } from "@app/hoot";` */
export const unfreezeTime = _hootDom.unfreezeTime;

/** @deprecated use `import { disableAnimations } from "@app/hoot";` */
export const disableAnimations = _animation.disableAnimations;
/** @deprecated use `import { enableTransitions } from "@app/hoot";` */
export const enableTransitions = _animation.enableTransitions;

/** @deprecated use `import { mockDate } from "@app/hoot";` */
export const mockDate = _date.mockDate;
/** @deprecated use `import { mockLocale } from "@app/hoot";` */
export const mockLocale = _date.mockLocale;
/** @deprecated use `import { mockTimeZone } from "@app/hoot";` */
export const mockTimeZone = _date.mockTimeZone;
/** @deprecated use `import { onTimeZoneChange } from "@app/hoot";` */
export const onTimeZoneChange = _date.onTimeZoneChange;

/** @deprecated use `import { makeSeededRandom } from "@app/hoot";` */
export const makeSeededRandom = _math.makeSeededRandom;

/** @deprecated use `import { mockPermission } from "@app/hoot";` */
export const mockPermission = _navigator.mockPermission;
/** @deprecated use `import { mockSendBeacon } from "@app/hoot";` */
export const mockSendBeacon = _navigator.mockSendBeacon;
/** @deprecated use `import { mockUserAgent } from "@app/hoot";` */
export const mockUserAgent = _navigator.mockUserAgent;
/** @deprecated use `import { mockVibrate } from "@app/hoot";` */
export const mockVibrate = _navigator.mockVibrate;

/** @deprecated use `import { mockFetch } from "@app/hoot";` */
export const mockFetch = _network.mockFetch;
/** @deprecated use `import { mockLocation } from "@app/hoot";` */
export const mockLocation = _network.mockLocation;
/** @deprecated use `import { mockWebSocket } from "@app/hoot";` */
export const mockWebSocket = _network.mockWebSocket;
/** @deprecated use `import { mockWorker } from "@app/hoot";` */
export const mockWorker = _network.mockWorker;

/** @deprecated use `import { flushNotifications } from "@app/hoot";` */
export const flushNotifications = _notification.flushNotifications;

/** @deprecated use `import { mockMatchMedia } from "@app/hoot";` */
export const mockMatchMedia = _window.mockMatchMedia;
/** @deprecated use `import { mockTouch } from "@app/hoot";` */
export const mockTouch = _window.mockTouch;
/** @deprecated use `import { watchAddedNodes } from "@app/hoot";` */
export const watchAddedNodes = _window.watchAddedNodes;
/** @deprecated use `import { watchKeys } from "@app/hoot";` */
export const watchKeys = _window.watchKeys;
/** @deprecated use `import { watchListeners } from "@app/hoot";` */
export const watchListeners = _window.watchListeners;
