# RaineApp Documentation

> Living project documentation organized by two perspectives: **Business** (what and why) and **Technical** (how).

**Last Updated:** February 2026

---

## Quick Navigation

### By Role

| Role | Start Here |
|------|-----------|
| Product Manager / Stakeholder | [Product Overview](./BUSINESS/1-PRODUCT-OVERVIEW.md) then [User Flows](./BUSINESS/2-USER-FLOWS.md) |
| New Developer | [Architecture](./TECHNICAL/1-ARCHITECTURE.md) then [Folder Structure](./TECHNICAL/2-FOLDER-STRUCTURE.md) |
| Feature Developer | [Feature Specs](./BUSINESS/3-FEATURE-SPECS/) then [Component Library](./TECHNICAL/6-COMPONENT-LIBRARY.md) |
| Debugging | [System Invariants](./TECHNICAL/9-SYSTEM-INVARIANTS.md) then [Troubleshooting](./GUIDES/TROUBLESHOOTING.md) |
| Deployment | [Deployment Guide](./GUIDES/DEPLOYMENT.md) |

---

## Business Perspective — What & Why

Documents for product managers, designers, and stakeholders.

| # | Document | Description |
|---|----------|-------------|
| 1 | [Product Overview](./BUSINESS/1-PRODUCT-OVERVIEW.md) | What is Raine, the four pillars, target audience, value proposition |
| 2 | [User Flows](./BUSINESS/2-USER-FLOWS.md) | Critical paths with flow diagrams (onboarding, discovery, communities, drops) |
| 3.1 | [Onboarding](./BUSINESS/3-FEATURE-SPECS/3.1-ONBOARDING.md) | Splash, referral code, social login |
| 3.2 | [Profile Setup](./BUSINESS/3-FEATURE-SPECS/3.2-PROFILE-SETUP.md) | 14-step profile flow, validation rules |
| 3.3 | [Introductions](./BUSINESS/3-FEATURE-SPECS/3.3-INTRODUCTIONS.md) | Social discovery, 1:1 connections |
| 3.4 | [Communities](./BUSINESS/3-FEATURE-SPECS/3.4-COMMUNITIES.md) | Group discussions, threaded posts |
| 3.5 | [Drops](./BUSINESS/3-FEATURE-SPECS/3.5-DROPS.md) | Curated product recommendations |
| 4 | [Business Rules](./BUSINESS/4-BUSINESS-RULES.md) | All business rules extracted from code and PRDs |
| 5 | [Data Model](./BUSINESS/5-DATA-MODEL.md) | Firestore schema, MMKV keys, type definitions |
| 6 | [Decision Log](./BUSINESS/6-DECISION-LOG.md) | Why we made each technical and business choice |

---

## Technical Perspective — How

Documents for developers. Focus on architecture, patterns, and implementation.

| # | Document | Description |
|---|----------|-------------|
| 1 | [Architecture](./TECHNICAL/1-ARCHITECTURE.md) | Layers, tech stack, principles, configuration files |
| 2 | [Folder Structure](./TECHNICAL/2-FOLDER-STRUCTURE.md) | `src/` organization rationale, naming conventions |
| 3 | [Design Patterns](./TECHNICAL/3-DESIGN-PATTERNS.md) | 8 patterns with code examples (lazy loading, mock mode, etc.) |
| 4 | [State Management](./TECHNICAL/4-STATE-MANAGEMENT.md) | Zustand stores + MMKV persistence guide |
| 5 | [Service Layer](./TECHNICAL/5-SERVICE-LAYER.md) | Firebase, RevenueCat, location services |
| 6 | [Component Library](./TECHNICAL/6-COMPONENT-LIBRARY.md) | 43 components inventory + design tokens |
| 7 | [Routing & Navigation](./TECHNICAL/7-ROUTING-NAVIGATION.md) | Expo Router, navigation guards, deep linking |
| 8 | [Mock Mode](./TECHNICAL/8-MOCK-MODE.md) | Development without backend architecture |
| 9 | [System Invariants](./TECHNICAL/9-SYSTEM-INVARIANTS.md) | Critical rules that must never be broken |

---

## Status & Progress

| Document | Description |
|----------|-------------|
| [Current Status](./STATUS/CURRENT-STATUS.md) | Implementation review with metrics and gap analysis |
| [Roadmap](./STATUS/ROADMAP.md) | Plans A–F status and next steps |

---

## Operational Guides

| Guide | Description |
|-------|-------------|
| [Local Dev Setup](./GUIDES/LOCAL-DEV-SETUP.md) | Environment, emulators, first build |
| [Deployment](./GUIDES/DEPLOYMENT.md) | EAS builds, store submission |
| [Troubleshooting](./GUIDES/TROUBLESHOOTING.md) | Common errors and fixes |

---

## Cross-Reference Matrix

How features map to code:

| Feature | Spec | Components | Services | Store | Routes |
|---------|------|------------|----------|-------|--------|
| Onboarding | [3.1](./BUSINESS/3-FEATURE-SPECS/3.1-ONBOARDING.md) | `ui/OtpInput`, `ui/ShakeView` | `referral/`, `firebase/socialAuth` | `appStore` | `(onboarding)/splash`, `(onboarding)/referral` |
| Profile Setup | [3.2](./BUSINESS/3-FEATURE-SPECS/3.2-PROFILE-SETUP.md) | `profile-setup/*` (10) | `profile/`, `bio/`, `location/` | `profileSetupStore` | `(profile-setup)/*` (16 screens) |
| Introductions | [3.3](./BUSINESS/3-FEATURE-SPECS/3.3-INTRODUCTIONS.md) | `introductions/*` (5) | `introductions/` | `introductionsStore` | `(tabs)/introductions`, `introduction/*` |
| Communities | [3.4](./BUSINESS/3-FEATURE-SPECS/3.4-COMMUNITIES.md) | `communities/*` (7) | `communities/` | `communitiesStore` | `(tabs)/communities`, `community/*` |
| Drops | [3.5](./BUSINESS/3-FEATURE-SPECS/3.5-DROPS.md) | `drops/*` (4) | `drops/` | `dropsStore` | `(tabs)/drops`, `drop/[id]` |
| Home | — | `home/*` (3) | `activity/` | `activityStore` | `(tabs)/index` |
| Chat | — | `chat/*` (4) | `firebase/messages`, `firebase/rooms` | `appStore` | `room/[id]` |
| Auth | — | `ui/SocialButton` | `firebase/auth`, `firebase/socialAuth` | — | `(auth)/login` |
| Profile | — | `profile/ProfileTagList` | `firebase/users` | `profileSetupStore` | `profile/*`, `(tabs)/profile` |
| Subscriptions | — | — | `revenuecat/` | — | `subscription` |

---

## Related Resources

- [Main README](../README.md) — Quick start, Expo fundamentals, build commands
- [Development Docs](../development/README.md) — Working docs, backlog, master plan
- [Historical Plans](../implementation-history/) — Archived implementation plans (gitignored)
