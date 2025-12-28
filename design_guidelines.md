# Design Guidelines: Passport/ID Card Application Portal

## Design Approach
**Selected System:** Material Design 3 adapted for government services
**Rationale:** Form-heavy application requiring clarity, accessibility, and trust. Material's structured approach ensures consistent form interactions and clear visual hierarchy for complex data entry.

**Key Principles:**
- Trust through clarity and professionalism
- Efficiency-first form design
- Maximum accessibility for all users
- Progressive disclosure to reduce cognitive load

## Typography
**Font Family:** Inter (via Google Fonts CDN)
- Headings: Inter 600 (Semibold)
- Body/Forms: Inter 400 (Regular)
- Labels: Inter 500 (Medium)
- Legal text: Inter 400 (Regular) at reduced size

**Scale:**
- Page Title: text-3xl (30px)
- Section Headers: text-xl (20px)
- Form Labels: text-sm (14px)
- Input Text: text-base (16px)
- Helper Text: text-xs (12px)

## Layout System
**Spacing Units:** Tailwind 4, 6, 8, 12 units
- Form field spacing: space-y-6
- Section padding: p-8
- Container max-width: max-w-3xl (forms), max-w-5xl (informational pages)
- Grid gaps: gap-6

## Component Library

### Navigation
- Fixed top navigation with application logo, progress indicator, save/exit buttons
- Breadcrumb trail showing application stages
- Sticky section navigation for multi-page forms

### Forms
**Input Fields:**
- Full-width inputs with floating labels
- Clear focus states with border accent
- Inline validation with icon indicators
- Required field asterisks in labels
- Character counters for limited fields

**Field Groups:**
- Logical grouping with subtle borders
- Clear visual separation between sections
- Collapsible sections for optional information

**Special Inputs:**
- Date pickers with calendar widget
- File upload with drag-drop zone and preview
- Radio/checkbox groups with clear selection states
- Dropdown selects with search capability
- Photo capture component with guidelines overlay

### Information Display
- Alert banners for important notices (color-neutral with icons)
- Instruction cards with numbered steps
- Document checklist with completion indicators
- Timeline showing application progress stages

### Actions
- Primary CTA: Solid button with medium emphasis
- Secondary actions: Outlined buttons
- Destructive actions: Clearly labeled with confirmation dialogs
- "Save & Continue Later" always visible

### Overlays
- Confirmation modals for irreversible actions
- Help tooltips for complex fields
- Document preview lightbox

## Page Structure

### Landing/Information Page
- Brief welcome section (not full hero - just header with icon/badge)
- Requirements checklist card
- "Start Application" primary CTA
- Estimated completion time
- FAQ accordion
- Contact information footer

### Application Form Pages
- Progress bar at top
- Single-column form layout (max-w-3xl)
- Sections with clear headers
- Save draft functionality
- "Previous/Next" navigation
- Auto-save indicator

### Review & Submit Page
- Editable summary cards organized by section
- "Edit" links to return to specific sections
- Terms acceptance checkbox
- Prominent "Submit Application" button
- Download/print draft option

### Confirmation Page
- Success message with reference number
- Next steps timeline
- Download confirmation PDF
- Email/print options

## Images
**No large hero image** - This is a transactional application focused on efficiency

**Minimal imagery:**
- Application badge/seal (top of landing page, 120x120px)
- Document example thumbnails in instruction sections
- Icon illustrations for empty states only
- Photo upload placeholder with dimension guidelines

## Accessibility Requirements
- WCAG AA minimum, AAA target for government compliance
- Keyboard navigation for entire flow
- Screen reader optimized labels and instructions
- High contrast mode support
- Minimum 16px font sizes for form inputs
- Clear error messages with recovery instructions
- Timeout warnings with extension options

## Animation
**Minimal - functional only:**
- Smooth page transitions (fade)
- Form validation feedback (subtle shake for errors)
- Progress indicator updates
- Loading spinners for async operations
**Duration:** 200-300ms maximum