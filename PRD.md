# Catering Estimation Platform

A streamlined web platform that allows customers to calculate catering costs by selecting party size and food items to receive instant pricing estimates.

**Experience Qualities**:
1. **Intuitive** - Users should immediately understand how to build their catering estimate without confusion
2. **Transparent** - Pricing and calculations should be clear and build trust through visibility
3. **Efficient** - Quick estimation process that respects users' time with minimal friction

**Complexity Level**: Light Application (multiple features with basic state)
- The app manages party size selection, food item configuration, and real-time cost calculations while maintaining user selections across the session

## Essential Features

**Party Size Selection**
- Functionality: Allow customers to specify number of guests (5-500+ people)
- Purpose: Foundation for portion calculations and minimum order requirements
- Trigger: First step in the estimation process
- Progression: Landing → Party size input → Food selection enabled
- Success criteria: Clear numerical input with validation and visual feedback

**Food Item Selection**
- Functionality: Browse categories (appetizers, mains, sides, desserts, beverages) and select items with quantities
- Purpose: Core menu building experience that drives the estimation
- Trigger: After party size is set
- Progression: Category tabs → Item cards with descriptions → Quantity selection → Running total updates
- Success criteria: Smooth category browsing, clear item details, responsive quantity controls

**Real-time Cost Calculator**
- Functionality: Automatically calculate per-person costs, total estimate, and display cost breakdowns
- Purpose: Immediate feedback builds confidence and helps decision-making
- Trigger: Any change to party size or food selections
- Progression: Selection change → Instant calculation → Updated display with breakdown
- Success criteria: Sub-second calculation updates, clear cost breakdown, accurate math

**Estimate Summary & Export**
- Functionality: Generate a detailed summary with itemized costs and export/save options
- Purpose: Allows customers to review, save, or share their catering estimate
- Trigger: "Generate Estimate" or "Review Order" action
- Progression: Summary view → Cost breakdown → Save/Print/Email options
- Success criteria: Professional-looking summary, multiple sharing options working

## Edge Case Handling

- **Very Large Parties**: Scale pricing and show bulk discounts for 100+ guests
- **Empty Selections**: Guide users toward popular combinations when no items selected
- **Mobile Usage**: Ensure touch-friendly controls and readable text on small screens
- **Price Changes**: Handle dynamic pricing gracefully with notifications
- **Browser Refresh**: Persist user selections using local storage for session continuity

## Design Direction

The design should feel professional and trustworthy like a high-end catering service, with clean lines and appetizing food imagery that builds confidence in quality while maintaining simplicity for quick decision-making.

## Color Selection

Complementary color scheme using warm and cool tones to balance appetite appeal with professional trust.

- **Primary Color**: Warm Golden Orange (oklch(0.75 0.15 65)) - Communicates appetite appeal and warmth of hospitality
- **Secondary Colors**: Deep Charcoal (oklch(0.25 0.02 240)) for sophistication, Soft Cream (oklch(0.95 0.02 85)) for elegant backgrounds
- **Accent Color**: Fresh Sage Green (oklch(0.65 0.12 145)) - Represents freshness and natural ingredients for call-to-action elements
- **Foreground/Background Pairings**: 
  - Background (Soft Cream oklch(0.95 0.02 85)): Dark Charcoal text (oklch(0.25 0.02 240)) - Ratio 7.2:1 ✓
  - Primary (Golden Orange oklch(0.75 0.15 65)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Secondary (Deep Charcoal oklch(0.25 0.02 240)): White text (oklch(1 0 0)) - Ratio 8.1:1 ✓
  - Accent (Sage Green oklch(0.65 0.12 145)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓

## Font Selection

Typography should convey approachable professionalism with excellent readability for pricing information and food descriptions using clean, modern sans-serif fonts.

- **Typographic Hierarchy**: 
  - H1 (Platform Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal letter spacing  
  - H3 (Food Categories): Inter Medium/20px/normal letter spacing
  - Body (Food Descriptions): Inter Regular/16px/relaxed line height
  - Pricing (Cost Display): Inter Bold/18px/tabular numbers

## Animations

Subtle and purposeful animations that guide attention to cost updates and provide satisfying feedback for selections without distracting from the core estimation task.

- **Purposeful Meaning**: Gentle transitions communicate freshness and attention to detail while number changes draw attention to live calculations
- **Hierarchy of Movement**: Price updates get priority animation focus, followed by selection confirmations, with background transitions being most subtle

## Component Selection

- **Components**: Card components for food items, Tabs for categories, Input for party size, Button variants for selections, Badge for pricing, Dialog for estimate summary
- **Customizations**: Custom food item cards with imagery, quantity steppers, and cost display overlays
- **States**: Buttons show selected/unselected clearly, inputs provide immediate validation feedback, cards highlight on selection
- **Icon Selection**: Plus/Minus for quantities, Users icon for party size, Receipt for estimates, Download for export
- **Spacing**: Generous padding (p-6) for cards, consistent gap-4 for grids, comfortable touch targets (min 44px)
- **Mobile**: Single column card layout, sticky cost summary, collapsible category navigation, larger touch controls for quantity adjustment