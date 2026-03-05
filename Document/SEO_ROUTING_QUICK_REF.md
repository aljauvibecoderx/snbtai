# SEO Dashboard Routing - Quick Reference

## 🎯 URL Mapping

```
/dashboard                    → Redirect to /dashboard/overview
/dashboard/overview           → Overview Tab
/dashboard/ai-lens            → AI Lens Tab
/dashboard/official-tryouts   → Official Tryouts Tab
/dashboard/my-questions       → My Questions Tab
/dashboard/question-bank      → Question Bank Tab
/dashboard/history            → History Tab
```

## 🔧 Key Components

### 1. DashboardLayout.js
```jsx
<DashboardLayout user={user} onBack={handleBack}>
  <Outlet /> {/* Renders child routes */}
</DashboardLayout>
```

### 2. Navigation (NavLink)
```jsx
<NavLink 
  to="/dashboard/my-questions"
  className={({ isActive }) => isActive ? 'active-class' : 'inactive-class'}
>
  Soal Saya
</NavLink>
```

### 3. SEO Metadata (Helmet)
```jsx
<Helmet>
  <title>My Questions - SNBT AI</title>
  <meta name="description" content="Manage your SNBT questions" />
  <link rel="canonical" href={`${window.location.origin}/dashboard/my-questions`} />
</Helmet>
```

## 📋 Implementation Checklist

### Phase 1: Setup (DONE ✅)
- [x] Install react-helmet
- [x] Create DashboardLayout.js
- [x] Create DashboardTabs.js
- [x] Update App.js imports

### Phase 2: Integration (TODO)
- [ ] Add Routes to App.js
- [ ] Update DashboardView to accept activeTab prop
- [ ] Remove old tab state management
- [ ] Remove old navigation buttons
- [ ] Test all routes

### Phase 3: Testing (TODO)
- [ ] Direct URL access works
- [ ] Browser back/forward works
- [ ] Active tab styling correct
- [ ] SEO metadata updates
- [ ] No console errors

## 🚨 Common Mistakes to Avoid

1. ❌ Using `window.history.pushState` → ✅ Use `navigate()`
2. ❌ Using `window.location.pathname` → ✅ Use `location.pathname`
3. ❌ Hardcoded activeTab state → ✅ Use URL-based routing
4. ❌ Missing `<Outlet />` → ✅ Add in DashboardLayout
5. ❌ Wrong NavLink path → ✅ Use absolute paths `/dashboard/...`

## 🎨 Active Tab Styling

```jsx
// NavLink automatically adds 'active' class
<NavLink 
  to="/dashboard/overview"
  className={({ isActive }) => 
    `base-class ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-600'}`
  }
>
  Overview
</NavLink>
```

## 🔍 Debug Commands

```javascript
// Check current route
console.log(location.pathname);

// Check if route matches
console.log(location.pathname.startsWith('/dashboard'));

// Navigate programmatically
navigate('/dashboard/my-questions');

// Navigate with replace (no history)
navigate('/dashboard/overview', { replace: true });
```

## 📊 SEO Metadata Template

```jsx
<Helmet>
  <title>[Feature Name] - [Section] | SNBT AI</title>
  <meta name="description" content="[50-160 characters description]" />
  <link rel="canonical" href={`${window.location.origin}[current-path]`} />
  <meta property="og:title" content="[Feature Name]" />
  <meta property="og:description" content="[Description]" />
  <meta property="og:url" content={`${window.location.origin}[current-path]`} />
</Helmet>
```

## 🔗 Navigation Patterns

### From Dashboard to Home
```javascript
navigate('/');
```

### From Tab to Another Tab
```javascript
// Automatic via NavLink click
<NavLink to="/dashboard/history">History</NavLink>
```

### Programmatic Navigation
```javascript
const navigate = useNavigate();
navigate('/dashboard/my-questions');
```

### With State
```javascript
navigate('/dashboard/overview', { state: { from: 'home' } });
```

## 📱 Responsive Considerations

- Navigation bar scrollable on mobile
- Active tab always visible
- Touch-friendly tap targets (min 44x44px)
- Smooth scroll behavior

## 🎯 Performance Tips

1. Lazy load tab content
2. Memoize expensive computations
3. Use React.memo for tab components
4. Avoid re-renders on route change

## 📚 Quick Links

- [Full Documentation](./SEO_ROUTING_IMPLEMENTATION.md)
- [React Router Docs](https://reactrouter.com)
- [React Helmet Docs](https://github.com/nfl/react-helmet)
