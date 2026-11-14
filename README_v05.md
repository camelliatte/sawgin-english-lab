# Saw & Gin English Lab v0.5 (Library & Pronunciation Beta)

Based on the supplied v0.4 Cloud Sync Beta. Deploy all site files to the existing GitHub Pages repository root, preserving the current Supabase project and login.

## New
- Vocabulary and Writing archives each have separate sort modes, manual ordering, and multi-select deletion.
- Duplicate episode uploads create separate packs (e.g., S1_EP01__2 internally), rather than overwriting existing content or answers.
- Deleting packs removes their question answers, feedback, review flags and current progress; keeps XP awards, previously earned completion XP, unlocked achievements and dated activity.
- Vocabulary entries show optional `발음 GB` and `발음 US` IPA fields and GB/US speech buttons. Audio uses browser speech synthesis and requires a matching installed voice. Some devices may not offer both accents.
- Existing v0.4 localStorage key and Supabase profile snapshot remain in use. Back up JSON before deployment.

## Important limitations
- This is a code-level beta; browser/device and cloud-sync regression testing have not yet been completed.
- Manual ordering supports HTML drag-and-drop on desktop and up/down fallback on mobile. Touch gestures are device-dependent.
- Existing EP01 entries without IPA fields will show GB/US labels and speech buttons, but no IPA transcription.
- The v0.4 whole-snapshot sync conflict limitations still apply. Finish and sync on one device before using another.
- Legacy XP awards remain as lifetime XP. A newly uploaded copy is a new pack and may earn new XP.

## MD example
```
- episode: S1_EP02
- title: Episode 02 Vocabulary

## V001
- 정답: come up with
- 뜻: 생각해 내다
- 발음 GB: /kʌm ʌp wɪð/
- 발음 US: /kʌm ʌp wɪð/
```
The pronunciations above are illustrative and should be checked against a pronunciation reference before publishing a complete learning pack.
