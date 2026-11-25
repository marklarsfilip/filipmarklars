---
title: "GluCobra"
description: "A personal glucose companion that brings LibreLinkUp readings to iPhone, Garmin, and the lights at home."
date: "2026-10-19"
tags: ["SwiftUI", "watchOS", "Garmin Connect IQ", "Home Assistant", "TypeScript", "Python"]
featured: true
featuredOrder: 2
---

Glucose data is most useful when it is easy to notice at the right moment. GluCobra is a personal companion that takes readings from LibreLinkUp and brings them into the places already woven into a day: an iPhone screen, a Garmin watch, and the lights at home.

## One signal, several surfaces

The iPhone app is the hub. It shows the latest reading in mmol/L, its trend and age, plus a history chart with the target range. A widget keeps a quick glance close; a Live Activity puts the current value and a short trend graph on the Lock Screen and Dynamic Island.

The same reading can travel further. A Garmin watch face and glance retrieve glucose, trend and timestamp from Home Assistant. At home, a small Python watcher checks readings and can use Philips Hue lamps to signal a low, high, rapidly falling value, or a gap in fresh data. Each alert has a distinct colour; when it clears, the lamps return to their previous state.

## The work behind a glance

Making these surfaces feel immediate takes more than drawing a number. GluCobra has to keep readings and timestamps consistent, make old data visibly stale, and keep alerts from flickering when a value hovers around a threshold. The Hue rules use separate entry and exit thresholds, a form of hysteresis, to make those state changes calmer. The watcher also has a simulation mode, so alert sequences can be exercised without waiting for live readings.

Live Activities add a different constraint: iOS limits how long one can remain active. The SwiftUI app hands push tokens to a small TypeScript service, which polls only for devices with an active or pending activity and sends updates through Apple Push Notification service. It ends and restarts an activity before the system limit, keeping the glance available without relying on the app staying open.

## Keeping the boundary clear

The app signs in to LibreLinkUp directly; the account password stays on the phone. The backend receives a time-limited session ticket for background updates, stores it encrypted, and removes the device data when the user signs out. There are no GluCobra user accounts.

GluCobra is a personal software project, not a medical device or a source for treatment decisions. Readings can be delayed or missing, so the official Libre app or reader remains the place to check glucose information.

## Built across a small ecosystem

- **iPhone:** SwiftUI app, glucose history, widget and Live Activity.
- **Background updates:** TypeScript service and APNs push notifications.
- **Garmin:** Connect IQ watch face and glance, with Home Assistant as the bridge.
- **Home alerts:** Python rules engine and Philips Hue integration.
