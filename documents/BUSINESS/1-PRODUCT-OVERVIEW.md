# Raine - Product Overview

**Last Updated:** February 2026
**Status:** MVP in Development (~85% Foundation Complete)
**Platform:** iOS (React Native / Expo)

---

## 1. What is Raine?

Raine is an **invite-only social platform for moms in the San Francisco Bay Area**. It connects mothers through curated, trust-based relationships -- not random strangers, but friends of friends who share similar life stages, values, and interests.

New members enter through a referral code, complete a detailed 14-step profile setup, and are matched with other moms in their area. Every connection on the platform traces back to a real social link, creating a safe, high-quality network where moms can find their people.

Raine is not another social media feed. It is a curated space designed around four core experiences: engaging with a personalized home dashboard, connecting one-on-one with compatible moms, belonging to group communities, and discovering trusted product recommendations.

---

## 2. The Four Pillars

Raine is organized around four pillars, each serving a distinct purpose in a mom's social life:

| Pillar | Feature | Verb | Purpose |
|--------|---------|------|---------|
| **Home** | Dashboard | Engage | Central activity hub with personalized recommendations, recent activity, and suggested connections |
| **Introductions** | 1:1 Discovery | Connect | Social discovery engine that surfaces compatible moms for one-on-one conversations via "Say Hi" |
| **Communities** | Group Discussions | Belong | Topic-based group discussions where members share experiences, ask questions, and support each other |
| **Drops** | Product Curation | Discover | Curated product recommendations from trusted moms -- real picks, not sponsored content |

### User Journey

- **Day 1 (Onboarding):** Splash screen (4s) -> Referral code entry -> Social login -> 14-screen profile setup -> Home dashboard
- **Days 2-30 (Discovery):** Browse "Moms Like You" -> Say Hi -> 1:1 chat; join communities; explore drops
- **Ongoing (Growth):** Manage active conversations, participate in community threads, save product recommendations, edit profile, manage subscription

---

## 3. Target Audience

### Primary Audience

Mothers living in the San Francisco Bay Area who are looking for meaningful social connections with other moms in their area.

### Approved Counties

Raine currently serves the following Bay Area counties:

1. San Francisco
2. Marin
3. Contra Costa
4. Alameda
5. San Mateo
6. Santa Clara
7. Sonoma
8. Napa

Geographic eligibility is enforced during the profile setup flow (location step). Users must reside in one of the approved counties to proceed. Expansion to additional regions is planned for future releases.

### Audience Characteristics

- Mothers at all stages (expecting through school-age children)
- Seeking genuine connections beyond surface-level small talk
- Value trust, safety, and quality over volume
- May be new to the area, recently became a parent, or simply looking for mom friends who "get it"

---

## 4. Value Proposition

### Invite-Only Trust Model

Every member joins through a referral code from an existing member. This creates a network where every connection traces back to a real social link, ensuring a baseline of trust and quality that open platforms cannot provide.

### Curated Connections

Rather than scrolling through thousands of profiles, Raine surfaces a focused set of compatible moms based on location, life stage, interests, and values captured during the 14-step profile setup (city feel, before motherhood interests, perfect weekend preferences, mom friend style, and more).

### No Strangers

The "friends of friends" model means every person on the platform is socially vetted. Members are not interacting with anonymous users but with real moms connected through their extended social graph.

### Quality Over Quantity

Raine is intentionally small and local. By constraining geography to the Bay Area and gating access through invitations, the platform prioritizes depth of connection over breadth of reach.

---

## 5. Business Model

### Subscription Tiers

Raine uses a freemium subscription model powered by **RevenueCat** for in-app purchase management.

| Tier | Access | Details |
|------|--------|---------|
| **Free** | Core experience | Home dashboard, limited introductions, community browsing, drops viewing |
| **Premium** | Full experience | Unlimited introductions, priority matching, full community access, advanced profile features |

### Subscription Infrastructure

- **Provider:** RevenueCat (`react-native-purchases`)
- **Gating:** Controlled via feature flag (`subscriptionGatingEnabled`); currently disabled during development
- **Status:** RevenueCat SDK integrated; product configuration and paywall UI pending finalization

### Revenue Strategy

Subscription revenue is the primary monetization path. Raine does not currently plan to monetize through advertising, sponsored content, or data sales. The Drops feature surfaces organic mom-to-mom product recommendations, not paid placements.

---

## 6. Key Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| **Onboarding (Splash + Referral)** | Implemented | 4-second splash, referral code gate |
| **Social Authentication** | Implemented | Facebook, Instagram, LinkedIn via Firebase Auth; mock mode for development |
| **Profile Setup (14 screens)** | Implemented | Name, photo, location, city feel, children, interests, aesthetics, bio |
| **Home Dashboard** | Not Started | Central activity hub with recommendations and activity feed |
| **Introductions** | Not Started | 1:1 social discovery with "Say Hi" and compatibility matching |
| **Communities** | Not Started | Group discussions organized by topic |
| **Drops** | Not Started | Curated product recommendations from trusted moms |
| **1:1 Chat** | Implemented (UI) | Chat interface complete; real-time messaging pending backend integration |
| **Subscriptions** | Partial | RevenueCat integrated; product config and paywall pending |
| **Push Notifications** | Partial | Firebase Cloud Messaging service ready; configuration pending |
| **Feature Flags** | Implemented | Firebase Remote Config with local defaults |
| **Analytics** | Partial | Firebase Analytics scaffolded; Amplitude migration planned |
| **Settings** | Implemented | Account management, app reset, preferences |
| **Profile Viewing/Editing** | Implemented | View and edit profile; redesign planned |
| **Offline / Mock Mode** | Implemented | Full UI flow works without live backend via mock data layer |

---

## 7. Tech Stack Overview

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native with Expo (Development Builds) |
| **SDK** | Expo SDK 54 |
| **Language** | TypeScript (strict mode) |
| **Navigation** | Expo Router (file-based routing) |
| **Styling** | NativeWind v4 (Tailwind CSS for React Native) |
| **State Management** | Zustand + React Context API |
| **Authentication** | Firebase Auth (social providers) |
| **Database** | Cloud Firestore (real-time listeners) |
| **Local Cache** | MMKV v4 (Nitro Modules for fast startup) |
| **Subscriptions** | RevenueCat (`react-native-purchases`) |
| **Feature Flags** | Firebase Remote Config |
| **Push Notifications** | Firebase Cloud Messaging (FCM) |
| **Analytics** | Firebase Analytics (Amplitude planned) |
| **Build & Deploy** | EAS Build + EAS Submit |

For detailed architecture documentation, data models, and infrastructure decisions, see [Architecture](../TECHNICAL/1-ARCHITECTURE.md).

---

## Cross-References

### Business Documentation

- [User Flows](./2-USER-FLOWS.md) -- End-to-end user journey maps and screen flows
- [Feature Specs](./3-FEATURE-SPECS/) -- Detailed specifications for each feature (Communities, Introductions, Drops)
- [Decision Log](./6-DECISION-LOG.md) -- Key product and technical decisions with rationale

### Technical Documentation

- [Architecture](../TECHNICAL/1-ARCHITECTURE.md) -- System architecture, data models, and infrastructure details
