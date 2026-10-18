/*
 * Public API surface of @tactivph/cadence-ui
 * Styling + presentational components only. No HTTP, no app logic.
 */

// Core
export * from './lib/core/types';
export * from './lib/core/status-presets';

// Components — batch 1 (primitives)
export * from './lib/button/button.component';
export * from './lib/badge/badge.component';
export * from './lib/status-badge/status-badge.component';
export * from './lib/avatar/avatar.component';
export * from './lib/spinner/spinner.component';
export * from './lib/skeleton/skeleton.component';
export * from './lib/card/card.component';
export * from './lib/empty-state/empty-state.component';
export * from './lib/alert/alert.component';
export * from './lib/form-field/form-field.component';
export * from './lib/input/input.directive';
export * from './lib/checkbox/checkbox.component';
export * from './lib/radio/radio.component';

// Components — batch 2 (overlays, tables, grouped & navigation)
export * from './lib/modal/modal.component';
export * from './lib/offcanvas/offcanvas.component';
export * from './lib/table/table.directive';
export * from './lib/input-group/input-group.component';
export * from './lib/field-group/field-group.component';
export * from './lib/tabs/tab.component';
export * from './lib/tabs/tabs.component';
export * from './lib/breadcrumb/breadcrumb.component';
export * from './lib/pagination/pagination.component';
export * from './lib/stepper/stepper.component';
export * from './lib/dropdown/dropdown.component';
export * from './lib/dropdown/menu-item.component';

// Layout / shell (compose pages from these)
export * from './lib/layout/top-nav/top-nav.component';
export * from './lib/layout/top-nav/nav-item.component';
export * from './lib/layout/page-header/page-header.component';
export * from './lib/layout/stat-tile/stat-tile.component';
export * from './lib/layout/filter-bar/filter-bar.component';
export * from './lib/layout/data-table/data-table.component';
export * from './lib/layout/kanban/kanban-column.component';
export * from './lib/layout/kanban/kanban-card.component';

// Table stack + shell additions (faithful PDO reproductions)
export * from './lib/table-header/table-header.component';
export * from './lib/table-pagination/table-pagination.component';
export * from './lib/loading-state/loading-state.component';
export * from './lib/layout/user-chip/user-chip.component';
export * from './lib/layout/notif-bell/notif-bell.component';
export * from './lib/lead-progress-tag/lead-progress-tag.component';
export * from './lib/lead-temperature/lead-temperature.component';
export * from './lib/pipeline-switcher/pipeline-switcher.component';
export * from './lib/calendar/calendar-grid';
export * from './lib/calendar/calendar.component';
