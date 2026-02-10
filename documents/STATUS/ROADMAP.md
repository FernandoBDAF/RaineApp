# RaineApp Roadmap

**Version:** 1.0  
**Last Updated:** February 6, 2026  
**Full Plan:** [7-MASTER-IMPLEMENTATION-PLAN.md](../../implementation-history/7-MASTER-IMPLEMENTATION-PLAN.md)

---

## Vision

RaineApp is a social platform for mothers with four pillars: Introductions (1:1 connections), Communities (group discussions), Drops (curated product recommendations), and Home (central dashboard). Target: full social platform with end-to-end backend integration.

**Estimated Timeline:** 8-10 weeks from foundation to launch.

---

## Current Phase

Plans B through F (UI) are complete. All four tabs, feature screens, Home dashboard, and Profile redesign are implemented with mock data flows. Plan A (Backend Integration) is pending.

---

## Plan Summary

| Plan | Scope | Status |
|------|-------|--------|
| A | Backend Integration — schema, bio function, Firestore collections, deploy | Not Started |
| B | Foundation & Navigation — types, 4-tab nav, shared components, stores | Complete |
| C | Drops Feature — tab, viewer, My Hearts | Complete |
| D | Introductions Feature — tab, profile detail, pending, chat | Complete |
| E | Communities Feature — tab, detail, timeline, posts | Complete |
| F | Home Dashboard & Profile Redesign | Complete |

---

## Next Steps

### Backend Integration Priorities

1. **Firebase migration** — Move to modular API (v22), resolve deprecation warnings
2. **Firestore connection** — Connect mock services to real Firestore collections
3. **Social auth** — Wire real Facebook SDK (requires App ID configuration)
4. **Cloud Functions** — Deploy bio generation and matching logic
5. **RevenueCat** — Configure API key for subscription flows
6. **Push notifications** — Configure FCM for production

### Feature Completion (Medium Priority)

- Wire Home dashboard sections to real feature components (MomsLikeYouCarousel, CommunityPreviewList, DropPreviewCard)
- Redesign chat room header per Plan D spec
- Add error boundaries and offline handling

---

## Dependencies

- Plan A can start independently (lives in Raine-bk repository)
- Plans C, D, E depended on Plan B (now complete)
- Plan F depended on Plans C, D, E (now complete)
- Production launch blocked by Plan A

---

For detailed deliverables, effort estimates, and risk management, see the [Master Implementation Plan](../../implementation-history/7-MASTER-IMPLEMENTATION-PLAN.md).
