---
title: "ROINX"
description: "Anyone can post a winning call after the final whistle. ROINX makes sports Picks public before kickoff, then tracks the record."
date: "2026-06-01"
tags: ["React", "TypeScript", "Supabase", "Vercel", "Stripe"]
thumbnail: "https://roinx.app/assets/og-card.jpg"
demo: "https://roinx.app"
featured: true
featuredOrder: 1
---

Anyone can share a winning call after the final whistle. ROINX is built around the harder question: what did you call before kickoff, and how has that record held up over time?

ROINX is a football-first social prediction platform. Players publish Picks before an event starts, with their selection, reasoning, simulated stake and user-reported odds. The Pick is timestamped, then settled against the match result. Profiles and leaderboards build a record from those calls over time, so the conversation has something concrete to refer back to.

## Designed for accountability

The central product decision is simple: make the prediction visible before the outcome is known. A Pick carries its context and timestamp with it, and its result contributes to a player's public history. That makes it easier to compare a long run of predictions than a highlight reel of isolated wins.

The activity around each Pick makes that record social. Players can follow each other, discuss matches, react to posts, join groups and take part in competitions. A Tip Slip lets people collect interesting Picks to revisit. Prediction Score, Reputation and ROI appear with the number of settled Picks, giving the record context instead of letting a short hot streak speak for itself. These are historical measures, not a promise about future results.

## A platform for players and creators

ROINX also gives sports creators tools to build an audience around their work. Followers can access creator content through subscriptions or unlock individual Picks, while creators get dashboards for growth, channels and monetization. This links a creator's reputation to a visible history of predictions and gives them ways to serve an audience they have built on the platform.

The boundary matters: Picks use simulated stakes, and odds are user-reported references. ROINX does not accept wagers or act as a bookmaker. Creator payments are for access to content, not for placing bets or receiving a share of betting outcomes.

## The product behind the feed

The project combines a React and TypeScript client with Supabase-backed data and access rules, server-side APIs, and Vercel deployment. The challenge is to make one Pick behave consistently across its lifecycle: creation before kickoff, visibility rules for public and subscriber content, community interaction, and settlement after the event. Keeping those rules close to the data helps the feed, player profiles and leaderboards reflect the same record.

ROINX is an ongoing product, built around a clear idea: credibility should come from what you said before the match and what happened next.

[Explore ROINX](https://roinx.app)
