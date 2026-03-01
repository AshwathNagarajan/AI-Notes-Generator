# 🎨 UI Component Library & Utilities Guide

Quick reference for all available UI components and utilities after the Dashboard enhancement.

## 🎯 Button Components

### Primary Button
```jsx
<button className="btn-primary">Primary Action</button>
```
- Background: Primary color (slate blue)
- Hover: Brighter primary
- Active: Scale down (scale-95)
- Focus: Ring around button

### Secondary Button
```jsx
<button className="btn-secondary">Secondary Action</button>
```
- Light background with dark text
- Dark mode: Inverted colors
- Same interaction effects

### Success Button
```jsx
<button className="btn-success">Confirm</button>
```
- Green background
- Perfect for confirmations

### Warning Button
```jsx
<button className="btn-warning">Be Careful</button>
```
- Amber background
- Use for cautionary actions

### Error Button
```jsx
<button className="btn-error">Delete</button>
```
- Red background
- Use for destructive actions

### Outline Button
```jsx
<button className="btn-outline">Cancel</button>
```
- Transparent with border
- Primary color outline

---

## 🎨 Cards

### Standard Card
```jsx
<div className="card p-6">
  {/* Content */}
</div>
```

### Industrial Card (Enhanced)
```jsx
<div className="industrial-card p-8">
  {/* Premium styling */}
</div>
```
- Elevation and shadow
- Better border styling
- Dark mode support

### Card with Hover Lift
```jsx
<div className="industrial-card p-8 hover-lift">
  {/* Content that lifts on hover */}
</div>
```
- Translates up on hover
- Shadow increases
- Smooth transition

### Card with Glow
```jsx
<div className="industrial-card p-8 hover-glow">
  {/* Content with colored glow on hover */}
</div>
```

---

## 🎭 Icons & Feature Icons

### Feature Icon Container
```jsx
<div className="feature-icon">
  <Icon className="h-8 w-8" />
</div>
```
- Circular container
- Gradient background
- Centered icon
- Responsive sizing

### With Custom Colors
```jsx
<div className="feature-icon bg-gradient-to-br from-blue-100 to-blue-50">
  <Icon className="h-8 w-8 text-blue-600" />
</div>
```

---

## 📊 Stat Display Components

### Stat Badge
```jsx
<span className="stat-badge">7 Powerful Tools</span>
```
- Styled label badge
- Primary background
- Professional appearance

### Stat Value
```jsx
<p className="stat-value">1,234</p>
```
- Text-3xl font-bold
- Primary color
- Large numbers emphasized

### Stat Label
```jsx
<p className="stat-label">Total Activities</p>
```
- Small, muted text
- Gray color
- For descriptions

### Entire Stat Card
```jsx
<div className="industrial-card p-8">
  <div className="feature-icon bg-gradient-to-br from-primary-100">
    <Activity className="h-7 w-7" />
  </div>
  <p className="stat-label mb-2">Total Activities</p>
  <p className="stat-value">156</p>
  <p className="text-sm text-gray-500 mt-2">Your progress</p>
</div>
```

---

## ✨ Animation & Effects

### Fade In Up (Entrance)
```jsx
<div className="fade-in-up">
  {/* Fades in while sliding up */}
</div>
```
- Duration: 400ms
- Easing: ease-in-out
- Great for hero sections

### Slide In Right
```jsx
<div className="slide-in-right">
  {/* Slides in from left */}
</div>
```

### Bounce In
```jsx
<div className="bounce-in">
  {/* Bounces when appearing */}
</div>
```

### Scale In
```jsx
<div className="scale-in">
  {/* Scales up while appearing */}
</div>
```

### Hover Lift Effect
```jsx
<div className="hover-lift cursor-pointer">
  {/* Lifts on hover with shadow */}
</div>
```
- Transforms up: -4px
- Shadow increases
- Smooth 300ms transition

### Hover Glow Effect
```jsx
<div className="hover-glow cursor-pointer">
  {/* Glows on hover */}
</div>
```
- Colored shadow appears
- Smooth color transition
- Professional appearance

---

## 🎬 Animation Delays

For staggered animations with multiple elements:

```jsx
{items.map((item, index) => (
  <div 
    key={index}
    style={{animationDelay: `${index * 50}ms`}}
    className="fade-in-up"
  >
    {item}
  </div>
))}
```

Or use utility classes:
```jsx
<div className="fade-in-up">First</div>
<div className="fade-in-up animation-delay-50">Second</div>
<div className="fade-in-up animation-delay-100">Third</div>
```

Available delays:
- `.animation-delay-50`  → 50ms
- `.animation-delay-100` → 100ms
- `.animation-delay-150` → 150ms
- `.animation-delay-200` → 200ms
- `.animation-delay-300` → 300ms

---

## 🎨 Glass Morphism Effects

### Light Glass Effect
```jsx
<div className="glass-effect rounded-xl">
  {/* Frosted glass appearance */}
</div>
```
- Backdrop blur
- White transparency
- Modern aesthetic

### Dark Glass Effect
```jsx
<div className="glass-effect-dark rounded-xl">
  {/* Dark frosted glass */}
</div>
```
- Dark mode variant
- Better contrast

---

## 📝 Form Components

### Input Field
```jsx
<input type="text" className="input-field" placeholder="Enter text..." />
```
- Enhanced styling
- Focus states with ring
- Dark mode support

### Textarea
```jsx
<textarea className="textarea-field" placeholder="Enter message..."></textarea>
```
- Larger input area
- Same styling as input-field
- Vertical resize only

---

## 🎨 Text Utilities

### Gradient Text
```jsx
<p className="gradient-text text-4xl font-bold">
  Amazing Text
</p>
```
- Gradient from primary to secondary
- Bold styling
- Eye-catching

### Text Balance
```jsx
<p className="text-balance text-lg">
  Long text that balances better across lines
</p>
```

### Truncate Lines
```jsx
<p className="truncate-2">
  Text truncated at 2 lines...
</p>

<p className="truncate-3">
  Text truncated at 3 lines...
</p>
```

### Text Uppercase First Letter
```jsx
<p className="text-uppercase-first">
  capitalize first letter of sentence
</p>
```

---

## 📜 Scrollbar Customization

### Hide Scrollbar (But Allow Scrolling)
```jsx
<div className="scrollbar-hide h-80 overflow-y-auto">
  {/* Content scrolls but scrollbar hidden */}
</div>
```

### Thin Scrollbar
```jsx
<div className="scrollbar-thin h-80 overflow-y-auto">
  {/* Content with thin scrollbar */}
</div>
```

---

## 🏭 Industrial Design Classes

### Industrial Header
```jsx
<div className="industrial-header p-10 md:p-16">
  <h1 className="text-5xl font-bold text-white">Welcome</h1>
  <p className="text-white/70">Subtitle</p>
</div>
```
- Gradient background (primary)
- Large padding
- White text
- Professional appearance

### Industrial Stat Card
```jsx
<div className="industrial-card p-8">
  {/* Stat content */}
</div>
```
- Card elevation
- Better shadows
- Consistent spacing

---

## 🎯 Layout Patterns

### Hero Section Layout
```jsx
<div className="industrial-header mb-20 p-10 md:p-16 fade-in-up">
  {/* Left side: Icon + Title */}
  <div className="flex items-start md:items-center space-x-6">
    <div className="feature-icon">
      <Icon />
    </div>
    <div>
      <h1 className="text-5xl font-bold text-white">Welcome</h1>
      <p className="text-white/70">Subtitle</p>
    </div>
  </div>
</div>
```

### Feature Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {features.map((feature) => (
    <div key={feature.name} className="industrial-card p-8 hover-lift">
      <div className="feature-icon mb-4">
        <feature.icon />
      </div>
      <h3 className="text-2xl font-bold mb-3">{feature.name}</h3>
      <p className="text-gray-600 mb-4">{feature.description}</p>
    </div>
  ))}
</div>
```

### Stats Grid
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {stats.map((stat) => (
    <div key={stat.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <stat.icon />
      <p className="font-bold text-2xl">{stat.value}</p>
      <p className="text-white/60 text-xs">{stat.label}</p>
    </div>
  ))}
</div>
```

---

## 🌈 Color System

### Color Utilities
```jsx
// Text colors
className="text-primary-600 dark:text-primary-400"
className="text-success-600 dark:text-success-400"
className="text-warning-600 dark:text-warning-400"
className="text-error-600 dark:text-error-400"

// Background colors
className="bg-primary-50 dark:bg-primary-900"
className="bg-white/10"  // Transparency variant

// Border colors
className="border-primary-200 dark:border-primary-800"
```

### Gradient Backgrounds
```jsx
className="bg-gradient-to-r from-primary-600 to-primary-700"
className="bg-gradient-to-b from-gray-50 to-gray-100"
className="bg-gradient-to-br from-primary-100 to-primary-50"
```

---

## 🎓 Complete Example

```jsx
import { FileText, Activity, TrendingUp, Clock } from 'lucide-react';

export function DashboardExample() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <div className="industrial-header mb-20 p-10 md:p-16 fade-in-up">
        <div className="flex items-start space-x-6">
          <div className="feature-icon">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-white">Welcome</h1>
            <p className="text-white/70 text-lg">AI-powered learning</p>
          </div>
        </div>

        {/* Stats in Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <Activity className="h-5 w-5 text-white/60 mb-2" />
            <p className="text-white font-bold text-2xl">156</p>
            <p className="text-white/60 text-xs">Activities</p>
          </div>
          {/* More stats... */}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-24">
        <h2 className="text-4xl font-bold mb-12">AI-Powered Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="industrial-card p-8 hover-lift">
            <div className="feature-icon mb-4 bg-gradient-to-br from-primary-100 to-primary-50">
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Notes Summarizer</h3>
            <p className="text-gray-600 mb-4">Transform long text into concise summaries</p>
            <span className="text-primary-600 font-semibold">Explore Tool →</span>
          </div>
          {/* More cards... */}
        </div>
      </div>

      {/* Metrics Section */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="industrial-card p-8 hover-lift fade-in-up">
            <div className="feature-icon bg-gradient-to-br from-primary-100 mb-8">
              <Activity className="h-7 w-7 text-primary-600" />
            </div>
            <p className="stat-label mb-2">Total Activities</p>
            <p className="stat-value">156</p>
          </div>
          {/* More metrics... */}
        </div>
      </div>
    </div>
  );
}
```

---

## 📚 Quick Reference Sheet

| Component | Class | Use Case |
|-----------|-------|----------|
| Primary Button | `btn-primary` | Main actions |
| Secondary Button | `btn-secondary` | Alternative actions |
| Card | `industrial-card` | Content containers |
| Hover Effect | `hover-lift` | Interactive cards |
| Glow Effect | `hover-glow` | Premium feel |
| Feature Icon | `feature-icon` | Icon containers |
| Animation | `fade-in-up` | Page entries |
| Delay | `animation-delay-*` | Staggered effects |
| Glass Effect | `glass-effect` | Modern look |
| Badge | `stat-badge` | Labels |
| Value | `stat-value` | Large numbers |
| Label | `stat-label` | Descriptions |

---

## 💡 Tips & Tricks

1. **Always pair animations with delays in grids**: Use `style={{animationDelay: \`${index * 50}ms\`}}` for staggered effects

2. **Use hover-lift for interactive elements**: Makes cards feel responsive and modern

3. **Glass effects work best over gradients**: Combine `glass-effect` with gradient backgrounds

4. **Stack badges for emphasis**: Use `stat-badge` inside feature cards for highlighting

5. **Responsive typography**: Combine text sizes with `md:` and `lg:` prefixes

6. **Dark mode always**: Test all components with `className="dark"` on parent

---

**Last Updated**: Current session  
**Total Utilities**: 30+  
**Button Variants**: 6  
**Animation Types**: 5+  
**Design Classes**: 15+
